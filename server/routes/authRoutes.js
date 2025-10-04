import { Router } from "express";
import {
    generateGoogleOAuthURI,
    retrieveTokensGoogleOAuth
} from "../controllers/authController.js";

const router = new Router()

router.post('/oauth/google/authuri', async function(req, res, next) {
    generateGoogleOAuthURI(req, res).catch(next)
});

router.get("/oauth/google/tokens", async (req, res, next) => {
    retrieveTokensGoogleOAuth(req, res).catch(next)
});


export default router
