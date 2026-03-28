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

const getCoordinates = async (location, defender) => {
  try {
    const country = defender && defender.length > 0 ? defender[0] : "";
    const query = `${location}, ${country}`;

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "osint-conflict-monitor",
        },
      }
    );

    if (response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon),
      };
    }

    return { latitude: null, longitude: null };
  } catch (error) {
    return { latitude: null, longitude: null };
  }
};

export const getEventCoordinates = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ event_datetime_utc: -1 })
      .limit(100);

    const promises = events.map(async (event) => {
      if (!event.location || event.location.toLowerCase() === "unknown") {
        return null;
      }

      const coords = await getCoordinates(event.location, event.defender);

      if (coords.latitude && coords.longitude) {
        return {
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
        };
      }

      return null;
    });

    const result = (await Promise.all(promises)).filter(Boolean);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};