import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import ApiError from "./src/utils/ApiError.js"; 
import {app} from "./src/socket/index.js";
import dotenv from "dotenv";
dotenv.config();



app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    sameSite: 'none',
    secure: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public')); 

//import routes
import userRouter from "./src/routes/user.routes.js";

//create routes
app.use("/api/v1/users", userRouter);

// Catch unhandled routes and throw 404 error
app.use((req, res, next) => {
    next(new ApiError(404, "Route not found"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || null,
        });
    } else {
        console.error(err.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

export default app;
