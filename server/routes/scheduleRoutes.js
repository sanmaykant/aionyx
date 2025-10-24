import { Router } from "express";
import { scheduleEvent } from "../controllers/scheduleController.js";

const router=Router()

router.post('/schedule', scheduleEvent);

export default router