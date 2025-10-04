import { Router } from "express";
import { identifyActivities } from "../controllers/llmController.js";

const router = new Router()

router.post("/identifyActivities", (req, res, next) => {
    identifyActivities(req, res).catch(next)
})

export default router
