import express from "express"
import { getUsersForSidebar,getMessages,sendMessages } from "../controllers/message.controllers.js";
import { isUser } from "../middlewares/auth.middleware.js";
const router=express.Router();

router.get("/user",isUser,getUsersForSidebar);

router.get("/:id",isUser,getMessages);

router.post("/send/:id",isUser,sendMessages);

export default router;