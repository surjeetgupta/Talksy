import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const isUser = async (req,res,next) => {
     try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({
                mssge:"unauthorized login",
            })
        }
        if(token){
            const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
            if(!decoded){
                return res.status(401).json({
                    mssge:"unauthorized login",
                })
            }

            const user=await User.findById(decoded.userId).select("-password");
            if(!user){
                return res.status(401).json({
                    mssge:"No user found",
                })
            }
            req.user=user;
            next();
        }
     }catch(err){
        return res.status(500).json({
            mssge:"An error occurred while verifying user using jwt middleware",
        });
     }
}
