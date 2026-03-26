import Event from "../models/Event.js";
import Analysis from "../models/Analysis.js";

function calculateRisk(events) {
    let totalFatalities = 0;
    let severitySum = 0;
    let civilianAttacks = 0;

    events.forEach(e => {
        totalFatalities += e.fatalities || 0;
        severitySum += e.severity_score || 0;
        if (e.target_type === "civilian") civilianAttacks++;
    });

    const avgSeverity = events.length ? severitySum / events.length : 0;

    let risk = "low";
    if (totalFatalities > 50 || avgSeverity >= 8) risk = "critical";
    else if (avgSeverity >= 5) risk = "high";
    else if (avgSeverity >= 3) risk = "medium";

    return { totalFatalities, avgSeverity, civilianAttacks, risk };
}

export const runAnalysis = async (req, res) => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const todayEvents = await Event.find({
            event_datetime_utc: { $gte: yesterday }
        });

        const riskStats = calculateRisk(todayEvents);

        const analysis = new Analysis({
            date: new Date(),
            country: "Global",
            total_events: todayEvents.length,
            civilian_attacks: riskStats.civilianAttacks,
            military_attacks: todayEvents.length - riskStats.civilianAttacks,
            total_fatalities: riskStats.totalFatalities,
            avg_severity: riskStats.avgSeverity,
            risk_level: riskStats.risk,
            trend: "stable"
        });

        await analysis.save();

        res.json({ message: "Analysis completed", analysis });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAnalysis = async (req, res) => {
    try {
        const data = await Analysis.find().sort({ date: -1 }).limit(30);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};