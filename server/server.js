import express from "express";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app=express()

app.get("/", (req, res) => {
    res.json({
        success: true,
    })
})

app.use("/api", authRoutes);

app.listen(3000, () => {
    console.log("Success");
})

