import express from "express";
import {getEvents, getEventCoordinates } from "../controllers/eventsController.js";
const router = express.Router();

router.get("/", getEvents);
router.get("/coordinates", getEventCoordinates);
export default router;