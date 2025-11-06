import express from "express";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import cors from 'cors';
import mongoose from "mongoose";
import llmRoutes from "./routes/llmRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import { startWatcher } from "./bot/gmail_cc_reader.js";

await mongoose.connect("mongodb://localhost:27017/aionyx")

dotenv.config();

const app=express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads")); 

app.get("/", (req, res) => {
    res.json({
        success: true,
    })
})

app.use("/api", authRoutes);
app.use("/api", llmRoutes);
app.use("/api", scheduleRoutes);

await startWatcher().catch((err) => console.error("❌ Error:", err));

app.listen(3000, () => {
    console.log("Success");
})
