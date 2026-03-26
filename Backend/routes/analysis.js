import express from "express";
import {
    runAnalysis,
    getAnalysis
} from "../controllers/analysisController.js";

const router = express.Router();

router.get("/", getAnalysis);
router.post("/run", runAnalysis);

export default router;