import { Router } from "express"
import authRoutes from "./authRoutes.js"
import llmRoutes from "./llmRoutes.js"
import schedulerRoutes from "./scheduleRoutes.js"

const router = new Router()
router.use("/auth", authRoutes)
router.use("/llm", llmRoutes)
router.use("/scheduler", schedulerRoutes)

export default router
