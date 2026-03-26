import express from "express";
import { getExecutiveSummary } from "../controllers/summaryController.js";

const router = express.Router();

router.get("/", getExecutiveSummary);

export default router;