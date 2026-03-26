import express from "express";
import {
    getEvents,
    getEventsByCountry,
    getEventById
} from "../controllers/eventsController.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/country/:country", getEventsByCountry);
router.get("/:id", getEventById);

export default router;