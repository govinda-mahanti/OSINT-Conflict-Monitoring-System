import Event from "../models/Event.js";
import axios from "axios";

const locationCache = new Map();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

const getCoordinates = async (location, defender) => {
  try {
    const country = defender && defender.length > 0 ? defender[0] : "";
    const query = `${location}, ${country}`;

    if (locationCache.has(query)) {
      return locationCache.get(query);
    }

    await delay(1100);

    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: query,
          key: process.env.OPENCAGE_API_KEY,
          limit: 1,
        },
      }
    );

    if (response.data.results.length > 0) {
      const coords = {
        latitude: response.data.results[0].geometry.lat,
        longitude: response.data.results[0].geometry.lng,
      };

      locationCache.set(query, coords);

      return coords;
    }

    return { latitude: null, longitude: null };
  } catch (error) {
    console.log("OpenCage error:", error.message);
    return { latitude: null, longitude: null };
  }
};

export const getEventCoordinates = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ event_datetime_utc: -1 })
      .limit(100);

    const result = [];

    for (const event of events) {
      if (!event.location || event.location.toLowerCase() === "unknown") {
        continue;
      }

      const coords = await getCoordinates(event.location, event.defender);

      if (coords.latitude && coords.longitude) {
        result.push({
          event_id: event._id,
          country: event.country,
          location: event.location,
          attacker: event.attacker,
          defender: event.defender,
          event_type: event.event_type,
          weapon_type: event.weapon_type,
          target_type: event.target_type,
          fatalities: event.fatalities,
          injuries: event.injuries,
          severity_score: event.severity_score,
          confidence_score: event.confidence_score,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      }
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};