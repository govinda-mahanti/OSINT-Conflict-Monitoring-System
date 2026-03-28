import Event from "../models/Event.js";
import axios from "axios";


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

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Simple in-memory cache
const locationCache = {};

const getCoordinates = async (location, defender, retries = 2) => {
  try {
    const country = defender && defender.length > 0 ? defender[0] : "";
    const query = `${location}, ${country}`;

    // Return from cache if already fetched
    if (locationCache[query]) {
      return locationCache[query];
    }

    await delay(1000); // IMPORTANT: Nominatim rate limit

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "osint-conflict-monitor (your-email@example.com)",
        },
      }
    );

    if (response.data.length > 0) {
      const coords = {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon),
      };

      locationCache[query] = coords; // Save to cache
      return coords;
    }

    return { latitude: null, longitude: null };
  } catch (error) {
    if (retries > 0) {
      await delay(2000);
      return getCoordinates(location, defender, retries - 1);
    }
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