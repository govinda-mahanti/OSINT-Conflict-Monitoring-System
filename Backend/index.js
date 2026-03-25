import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from "./db/db.js"
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
    origin: "*"
}));
app.use(express.json());
connectDB()

app.get("/", (req, res) => {
    res.send("Welcome to my server");
});


const PORT=process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("Server is running on port 5000");
});
