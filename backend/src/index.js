import express from "express";
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import cloudinary from "./lib/cloudinary.js";

import path from "path";

dotenv.config();
import { app,server } from "./lib/socket.js";
const PORT=process.env.PORT;
const __dirname=path.resolve();

app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5174",
    credentials:true,
}
));

import { connectDB } from "./lib/db.js";
app.use(express.json({limit:"10mb"}));

connectDB();

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/chat/dist")));  
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/chat","dist","index.html"));
    })
}


server.listen(PORT,()=>{
    console.log("app running at port 5002");
});



