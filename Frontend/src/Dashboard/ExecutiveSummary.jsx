import React, { useEffect, useState } from "react";

const ExecutiveSummary = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const totalEvents = events.length;
  const highSeverity = events.filter((e) => e.severity_score >= 4).length;
  const countries = [...new Set(events.map((e) => e.country))].length;

  const confirmed = events.filter((e) => e.confidence_score >= 0.8).length;
  const unverified = events.filter((e) => e.confidence_score < 0.5).length;

  const getRiskLevel = () => {
    if (highSeverity >= 10) return "HIGH";
    if (highSeverity >= 5) return "MEDIUM";
    return "LOW";
  };

  const riskLevel = getRiskLevel();

  const getRiskColor = () => {
    if (riskLevel === "HIGH") return "text-[#ef4444]";
    if (riskLevel === "MEDIUM") return "text-[#f59e0b]";
    return "text-[#22c55e]";
  };

  const actorCount = {};
  events.forEach((e) => {
    if (e.attacker) {
      actorCount[e.attacker] = (actorCount[e.attacker] || 0) + 1;
    }
  });

  const topActor = Object.keys(actorCount).reduce(
    (a, b) => (actorCount[a] > actorCount[b] ? a : b),
    "-"
  );

  return (
    <div className="bg-[#070b12] text-[#e2e8f0] min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Executive Summary</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0b1120] border border-[#1e2d45] p-4 rounded">
          <p className="text-[#64748b] text-sm">Total Events</p>
          <h2 className="text-2xl font-bold">{totalEvents}</h2>
        </div>

        <div className="bg-[#0b1120] border border-[#1e2d45] p-4 rounded">
          <p className="text-[#64748b] text-sm">High Severity Events</p>
          <h2 className="text-2xl font-bold text-[#ef4444]">
            {highSeverity}
          </h2>
        </div>

        <div className="bg-[#0b1120] border border-[#1e2d45] p-4 rounded">
          <p className="text-[#64748b] text-sm">Countries Involved</p>
          <h2 className="text-2xl font-bold">{countries}</h2>
        </div>

        <div className="bg-[#0b1120] border border-[#1e2d45] p-4 rounded">
          <p className="text-[#64748b] text-sm">Top Actor</p>
          <h2 className="text-2xl font-bold">{topActor}</h2>
        </div>
      </div>

      {/* Risk + Confidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0b1120] border border-[#1e2d45] p-6 rounded">
          <p className="text-[#64748b] text-sm mb-2">Current Risk Level</p>
          <h2 className={`text-3xl font-bold ${getRiskColor()}`}>
            {riskLevel}
          </h2>
        </div>

        <div className="bg-[#0b1120] border border-[#1e2d45] p-6 rounded">
          <p className="text-[#64748b] text-sm mb-2">
            Confirmed vs Unverified
          </p>
          <div className="flex justify-between mt-4">
            <div>
              <p className="text-[#22c55e] text-xl font-bold">{confirmed}</p>
              <p className="text-[#64748b] text-sm">Confirmed</p>
            </div>
            <div>
              <p className="text-[#f59e0b] text-xl font-bold">{unverified}</p>
              <p className="text-[#64748b] text-sm">Unverified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Events */}
      <div className="bg-[#0b1120] border border-[#1e2d45] p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Latest Events</h2>

        {events.slice(0, 5).map((event) => (
          <div
            key={event._id}
            className="border-t border-[#1e2d45] py-3"
          >
            <p className="text-sm text-[#64748b]">
              {new Date(event.event_datetime_utc).toLocaleString()} —{" "}
              {event.country}
            </p>
            <p className="font-medium">{event.claim_text}</p>
            <p className="text-sm text-[#0ea5e9]">{event.source_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutiveSummary;