import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId,io } from "../lib/socket.js";
export const getUsersForSidebar=async (req,res) => {
    try{
        const loggedinUserid=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedinUserid}}).select("-password");

       res.status(200).json(filteredUsers);
    }catch(error){
        return res.status(500).json({
            mssge:"An error occurred in getUsersForSidebar controller",
        });
    }
}

export const getMessages=async (req,res) => {
    try{
        const {id:userToChatId}=req.params;
        const senderId=req.user._id;
        const messages=await Message.find({
            $or:[
                {senderId:senderId,recieverId:userToChatId},
                {senderId:userToChatId,recieverId:senderId},
            ]
        });

        res.status(200).json(messages);
    }catch(error){
        return res.status(500).json({
            mssge:"An error occurred in getMessages controller",
        });
    }
}

export const sendMessages=async (req,res) => {
    try{
        const {id:userToChatId}=req.params;
        const {text,image}=req.body;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
            const upload=await cloudinary.uploader.upload(image);
            imageUrl=upload.secure_url;
        }
        const message=await Message.create({senderId,text,image:imageUrl,recieverId:userToChatId});
        await message.save();
        
        const receiverSocketId=getRecieverSocketId(userToChatId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",message);
        }
        res.status(201).json(message);
    }catch(error){
        return res.status(500).json({
            mssge:"An error occurred in sendMessages controller",
        });
    }
}