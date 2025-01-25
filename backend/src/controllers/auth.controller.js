import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
export const signUp=async (req,res) => {
   
    const {fullName,email,password}=req.body;

    try{
        if(!fullName || !email || !password){
            return res.status(400).json({
                mssge:"all fields are required"
            });
        }
        if(password.length<6){
            return res.status(400).json({
                mssge:"password must be at least 6 characters"
            });
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                mssge:"user already exists"
            });
        }
        
        const hashedPass=await bcrypt.hash(password,10);
        const user=await User.create({
            fullName,
            email,
            password:hashedPass,
        });
        if(user){

           generateToken(user._id,res);
           await user.save();
            return res.status(201).json({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic,
                mssge:"user created successfylly"
            });
        }else{
            return res.status(400).json({
                mssge:"user not created"
            });
        }
        
    }catch(error){
        return res.status(500).json({
            mssge:"An error occurred",
        });
    }
}

export const login=async (req,res) => {
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({
            mssge:"all fields are required"
        });
    }

    try{

       const user=await User.findOne({email});
       if(!user){
          return res.status(400).json({
            mssge:"user not found"
        });
       }

       const isMatch=await bcrypt.compare(password,user.password);
       if(!isMatch){
           return res.status(400).json({    
            mssge:"invalid credentials"
        });
        }

         generateToken(user._id,res);

         res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
            mssge:"login successfylly"
         });

    }catch(error){
            return res.status(500).json({
                mssge:"An error occurred",
            });
    }
}

export const logout=async (req,res) => {
     try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({
            mssge:"logged out successfully"
        });
     }catch(error){
        return res.status(500).json({
            mssge:"An error occurred",
        });
     }
}

export const updateProfile=async (req,res) => {
    
    try{
        const {profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic){
            return res.status(400).json({
                mssge:"all fields are required"
            });
        }
       
         const upload=await cloudinary.uploader.upload(profilePic);
         const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url},{new:true});

         res.status(200).json({
            _id:updatedUser._id,
            fullName:updatedUser.fullName,
            email:updatedUser.email,
            profilePic:updatedUser.profilePic,
            mssge:"user updated successfylly"
         })
        
    }catch(error){
        return res.status(500).json({
            mssge:"An error occurred while updating profile",
        });
    }
}


//to check whetehr user is authenticated while we refresh a page
export const checkAuth=async (req,res) => {
    try{
        res.status(200).json(req.user);
    }catch(error){
        return res.status(500).json({
            mssge:"An error occurred in checkAuth controller",
        });
    }
}

