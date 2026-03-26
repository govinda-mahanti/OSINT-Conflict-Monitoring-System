import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema({
    date: Date,
    country: String,
    total_events: Number,
    civilian_attacks: Number,
    military_attacks: Number,
    total_fatalities: Number,
    avg_severity: Number,
    risk_level: String,
    trend: String
}, { collection: "analysis" });

export default mongoose.model("Analysis", AnalysisSchema);