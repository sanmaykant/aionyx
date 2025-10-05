import { Router } from "express";
import { scheduleEvent } from "../controllers/scheduleController.js";

const router = new Router()

router.post("/scheduleEvent", (req, res, next) => {
    scheduleEvent(req, res).catch(next)
})

export default router
