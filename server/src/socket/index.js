import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import  getUserDetailsFromToken  from '../helpers/getUserDetailsFromToken.js';
import getConversation from '../helpers/getConversation.js';
import User from "../models/user.model.js";
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        methods: ["GET", "POST"]
    }
});

const onlineUsers = new Set();

io.on("connection", async (socket) => {
    console.log("connected user at :: ", socket.id);

    const token = socket.handshake.auth.token;

    try {
        const user = await getUserDetailsFromToken(token);
        console.log("user details :: ", user);

        //create a room for user
        socket.join(user._id);
        onlineUsers.add(user?._id?.toString());

        io.emit("onlineUsers", Array.from(onlineUsers));

        socket.on("message-page", async (userId) => {
            const userDetails = await User.findById(userId).select("-password");

            const payload = {
                _id: userDetails._id,
                name: userDetails.name,
                email: userDetails.email,
                online: onlineUsers.has(userDetails._id.toString()),
                profile_pic: userDetails.profile_pic,
            };

            socket.emit("message-user", payload);

            //get previous message
            const getConversationMessage = await Conversation.findOne({
                "$or": [
                    { sender: user?._id, receiver: userId },
                    { sender: userId, receiver: user?._id }
                ]
            }).populate('messages').sort({ updatedAt: -1 })

            socket.emit('message', getConversationMessage?.messages || [])
        });



        //new message
        socket.on('new message', async (data) => {
            if (!data?.sender || !data?.receiver) return;
        
            try {
                let conversation = await Conversation.findOne({
                    "$or": [
                        { sender: data?.sender, receiver: data?.receiver },
                        { sender: data?.receiver, receiver: data?.sender }
                    ]
                });
        
                if (!conversation) {
                    conversation = await Conversation.create({
                        sender: data?.sender,
                        receiver: data?.receiver
                    });
                }
        
                const message = await Message.create({
                    text: data.text,
                    imageUrl: data.imageUrl,
                    videoUrl: data.videoUrl,
                    msgByUserId: data?.msgByUserId,
                });
        
                await Conversation.updateOne(
                    { _id: conversation?._id },
                    { "$push": { messages: message?._id } }
                );
        
                const updatedConversation = await Conversation.findOne({
                    "$or": [
                        { sender: data?.sender, receiver: data?.receiver },
                        { sender: data?.receiver, receiver: data?.sender }
                    ]
                }).populate('messages').sort({ updatedAt: -1 });
        
                io.to(data?.sender).emit('message', updatedConversation?.messages || []);
                io.to(data?.receiver).emit('message', updatedConversation?.messages || []);
        
                const conversationSender = await getConversation(data?.sender);
                const conversationReceiver = await getConversation(data?.receiver);
        
                io.to(data?.sender).emit('conversation', conversationSender);
                io.to(data?.receiver).emit('conversation', conversationReceiver);
            } catch (error) {
                console.error('Message handling error:', error);
            }
        });
        
        //sidebar
        socket.on('sidebar', async (currentUserId) => {
            console.log("current user", currentUserId)

            const conversation = await getConversation(currentUserId)

            socket.emit('conversation', conversation)

        })

        //seen message
        socket.on('seen', async (msgByUserId) => {

            let conversation = await Conversation.findOne({
                "$or": [
                    { sender: user?._id, receiver: msgByUserId },
                    { sender: msgByUserId, receiver: user?._id }
                ]
            })

            const conversationMessageId = conversation?.messages || []

            const updateMessages = await Message.updateMany(
                { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
                { "$set": { seen: true } }
            )

            //send conversation
            const conversationSender = await getConversation(user?._id?.toString())
            const conversationReceiver = await getConversation(msgByUserId)

            io.to(user?._id?.toString()).emit('conversation', conversationSender)
            io.to(msgByUserId).emit('conversation', conversationReceiver)
        })


        // Store user in socket for disconnect event
        socket.user = user;

        socket.on("disconnect", () => {
            onlineUsers.delete(socket.user?._id);
            io.emit("onlineUsers", Array.from(onlineUsers));
            console.log("disconnected user at :: ", socket.id);
        });
    } catch (error) {
        console.error("Socket connection error:", error);
        socket.disconnect();
    }
});

export { app, httpServer as server };
