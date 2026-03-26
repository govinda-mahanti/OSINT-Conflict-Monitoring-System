import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    event_datetime_utc: Date,
    source_name: String,
    source_url: String,
    source_type: String,
    claim_text: String,
    country: String,
    location_text: String,
    attacker: String,
    defender: String,
    event_type: String,
    domain: String,
    weapon_type: String,
    target_type: String,
    fatalities: Number,
    injuries: Number,
    severity_score: Number,
    confidence_score: Number,
    tags: [String],
    last_updated_at: Date
}, { collection: "events" });

export default mongoose.model("Event", EventSchema);