import Event from "../models/Event.js";

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .sort({ event_datetime_utc: -1 })
            .limit(100);

        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getEventsByCountry = async (req, res) => {
    try {
        const events = await Event.find({ country: req.params.country })
            .sort({ event_datetime_utc: -1 });

        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};