import { Router } from "express";
import { generateOAuth2URI } from "../controllers/authController.js";

const router=new Router()

router.post("/auth/oauth/google", async (req, res, next) => {
    generateOAuth2URI(req, res).catch(next);
})

export default router;