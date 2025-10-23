import { Router } from "express";
import { uploadMiddleware, handleMessage } from "../controllers/llmController.js";

const router=new Router()

router.post("/sendMessage", uploadMiddleware, handleMessage);

export default router