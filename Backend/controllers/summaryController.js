import Analysis from "../models/Analysis.js";

export const getExecutiveSummary = async (req, res) => {
    try {
        const latest = await Analysis.findOne().sort({ date: -1 });

        if (!latest) {
            return res.json({ message: "No analysis data available" });
        }

        const summary = `
Executive Summary:

Total Events: ${latest.total_events}
Civilian Attacks: ${latest.civilian_attacks}
Military Attacks: ${latest.military_attacks}
Total Fatalities: ${latest.total_fatalities}
Average Severity: ${latest.avg_severity.toFixed(2)}
Risk Level: ${latest.risk_level}
Trend: ${latest.trend}
        `;

        res.json({ summary, data: latest });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};