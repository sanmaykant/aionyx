import { Router } from "express"
import authRoutes from "./authRoutes.js"
import llmRoutes from "./llmRoutes.js"

const router = new Router()
router.use("/auth", authRoutes)
router.use("/llm", llmRoutes)

export default router
