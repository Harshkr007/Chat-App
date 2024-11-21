import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
   text :{
    type:String,
    required: function() {
        return !this.imageUrl && !this.videoUrl; // Text is required only if no media
      }
   },
   imageUrl :{
    type:String,
   },
   videoUrl :{
    type:String,
   },
   msgByUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   },
   seen:{
    type:Boolean,
    default:false,
   }
},{
    timestamps:true,
});

const Message = mongoose.model("Message",messageSchema);
export default Message;