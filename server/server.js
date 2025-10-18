import express from "express";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app=express()

app.use(cors)
app.use(express.json())

app.get("/", (req, res) => {
    res.json({
        success: true,
    })
})

app.use("/api", authRoutes);

app.listen(3000, () => {
    console.log("Success");
})

