import express from "express"
import { signUp ,login,logout,updateProfile,checkAuth } from "../controllers/auth.controller.js";
import { isUser } from "../middlewares/auth.middleware.js";
const router=express.Router();

router.post("/signup",signUp)

router.post("/login",login)

router.get("/logout",logout)

router.put("/update-profile",isUser,updateProfile)

router.get("/check",isUser,checkAuth)

export default router;