import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import mongoose from "mongoose";

import dotenv from "dotenv"
dotenv.config()

await mongoose.connect("mongodb://localhost:27017/aionyx")
console.log("MongoDB connected");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json())

app.get("/", (_, res) => res.json({ message: "working" }));
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
