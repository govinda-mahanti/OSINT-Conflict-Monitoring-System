import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const MapView = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const getMarkerColor = (severity) => {
    if (severity <= 2) return "green";
    if (severity === 3) return "orange";
    if (severity === 4) return "red";
    return "red";
  };

  const createIcon = (severity) =>
    new L.Icon({
      iconUrl: `https://maps.google.com/mapfiles/ms/icons/${getMarkerColor(
        severity
      )}-dot.png`,
      iconSize: [25, 25],
    });

  const getCoordinates = (country) => {
    if (country === "Iran") return [32.4279, 53.688];
    if (country === "Israel") return [31.0461, 34.8516];
    if (country === "US" || country === "USA") return [37.0902, -95.7129];
    return [20, 0];
  };

  return (
    <div className="bg-[#070b12] text-[#e2e8f0] min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Conflict Map</h1>

      <div className="border border-[#1e2d45] rounded overflow-hidden">
        <MapContainer
          center={[30, 40]}
          zoom={3}
          style={{ height: "600px", width: "100%" }}
        >
          {/* DARK MAP TILE */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {events.map((event) => (
            <Marker
              key={event._id}
              position={getCoordinates(event.country)}
              icon={createIcon(event.severity_score)}
            >
              <Popup>
                <div>
                  <p><b>{event.event_type}</b></p>
                  <p>{event.country}</p>
                  <p>Severity: {event.severity_score}</p>
                  <p>Confidence: {event.confidence_score}</p>
                  <a href={event.source_url} target="_blank">
                    Source
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;