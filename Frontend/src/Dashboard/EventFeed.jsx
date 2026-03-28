import React, { useEffect, useState } from "react";

const EventFeed = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [countryFilter, setCountryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [confidenceFilter, setConfidenceFilter] = useState("");
  const [attackerFilter, setAttackerFilter] = useState("");
  const [defenderFilter, setDefenderFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data);
      });
  }, []);

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.8) return "Confirmed";
    if (confidence >= 0.5) return "Likely";
    if (confidence >= 0.3) return "Unverified";
    return "Low";
  };

  const getSeverityColor = (severity) => {
    if (severity <= 2) return "bg-[#22c55e]";
    if (severity === 3) return "bg-[#f59e0b]";
    if (severity === 4) return "bg-[#f97316]";
    return "bg-[#ef4444]";
  };

  useEffect(() => {
    let data = events;

    if (countryFilter) data = data.filter((e) => e.country === countryFilter);
    if (typeFilter) data = data.filter((e) => e.event_type === typeFilter);
    if (confidenceFilter) {
      data = data.filter(
        (e) => getConfidenceLabel(e.confidence_score) === confidenceFilter
      );
    }
    if (attackerFilter) {
      data = data.filter((e) => e.attacker?.includes(attackerFilter));
    }
    if (defenderFilter) {
      data = data.filter((e) => e.defender?.includes(defenderFilter));
    }

    setFilteredEvents(data);
  }, [
    countryFilter,
    typeFilter,
    confidenceFilter,
    attackerFilter,
    defenderFilter,
    events,
  ]);

  return (
    <div className="bg-[#070b12] text-[#e2e8f0] min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Event Feed</h1>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <select
          className="bg-[#0b1120] border border-[#1e2d45] p-2 rounded"
          onChange={(e) => setCountryFilter(e.target.value)}
        >
          <option value="">All Countries</option>
          {[...new Set(events.map((e) => e.country))].map((country) => (
            <option key={country}>{country}</option>
          ))}
        </select>

        <select
          className="bg-[#0b1120] border border-[#1e2d45] p-2 rounded"
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Event Types</option>
          {[...new Set(events.map((e) => e.event_type))].map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        <select
          className="bg-[#0b1120] border border-[#1e2d45] p-2 rounded"
          onChange={(e) => setConfidenceFilter(e.target.value)}
        >
          <option value="">All Confidence</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Likely">Likely</option>
          <option value="Unverified">Unverified</option>
          <option value="Low">Low</option>
        </select>

        <select
          className="bg-[#0b1120] border border-[#1e2d45] p-2 rounded"
          onChange={(e) => setAttackerFilter(e.target.value)}
        >
          <option value="">All Attackers</option>
          {[...new Set(events.flatMap((e) => e.attacker || []))].map(
            (attacker) => (
              <option key={attacker}>{attacker}</option>
            )
          )}
        </select>

        <select
          className="bg-[#0b1120] border border-[#1e2d45] p-2 rounded"
          onChange={(e) => setDefenderFilter(e.target.value)}
        >
          <option value="">All Defenders</option>
          {[...new Set(events.flatMap((e) => e.defender || []))].map(
            (defender) => (
              <option key={defender}>{defender}</option>
            )
          )}
        </select>
      </div>

      {/* Table */}
      <div className="border border-[#1e2d45] bg-[#0b1120] rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#0d1526] text-[#64748b] text-sm">
            <tr className="text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Country</th>
              <th className="p-3">Location</th>
              <th className="p-3">Event</th>
              <th className="p-3">Weapon</th>
              <th className="p-3">Severity</th>
              <th className="p-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr
                key={event._id}
                onClick={() => setSelectedEvent(event)}
                className="border-t border-[#1e2d45] hover:bg-[rgba(255,255,255,0.04)] cursor-pointer"
              >
                <td className="p-3">
                  {new Date(event.event_datetime_utc).toLocaleString()}
                </td>
                <td className="p-3">{event.country}</td>
                <td className="p-3">{event.location}</td>
                <td className="p-3">{event.event_type}</td>
                <td className="p-3">{event.weapon_type}</td>
                <td className="p-3">
                  <span
                    className={`${getSeverityColor(
                      event.severity_score
                    )} text-white px-2 py-1 rounded text-xs`}
                  >
                    {event.severity_score}
                  </span>
                </td>
                <td className="p-3">{event.source_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-[#0b1120] border border-[#1e2d45] rounded-lg p-6 w-[600px]">
            <h2 className="text-xl font-bold mb-4">Event Details</h2>

            <div className="space-y-2 text-sm">
              <p><b>Date:</b> {new Date(selectedEvent.event_datetime_utc).toLocaleString()}</p>
              <p><b>Country:</b> {selectedEvent.country}</p>
              <p><b>Location:</b> {selectedEvent.location}</p>
              <p><b>Event Type:</b> {selectedEvent.event_type}</p>
              <p><b>Weapon Type:</b> {selectedEvent.weapon_type}</p>
              <p><b>Target:</b> {selectedEvent.target_type}</p>
              <p><b>Attacker:</b> {selectedEvent.attacker?.join(", ")}</p>
              <p><b>Defender:</b> {selectedEvent.defender?.join(", ")}</p>
              <p><b>Fatalities:</b> {selectedEvent.fatalities}</p>
              <p><b>Injuries:</b> {selectedEvent.injuries}</p>
              <p><b>Severity:</b> {selectedEvent.severity_score}</p>
              <p><b>Confidence:</b> {getConfidenceLabel(selectedEvent.confidence_score)}</p>
              <p><b>Tags:</b> {selectedEvent.tags?.join(", ")}</p>
              <p><b>Description:</b> {selectedEvent.claim_text}</p>

              <a
                href={selectedEvent.source_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#0ea5e9] underline"
              >
                Open Source Article
              </a>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-4 bg-[#ef4444] px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFeed;