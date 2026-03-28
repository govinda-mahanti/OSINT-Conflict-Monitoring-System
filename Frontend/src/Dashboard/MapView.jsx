import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { BASE_URL } from "../Config/urlConfig.js";


const MapView = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/events/coordinates`)
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const getMarkerColor = (severity) => {
    if (severity <= 2) return "green";
    if (severity === 3) return "orange";
    if (severity >= 4) return "red";
  };

  const createIcon = (severity) =>
    new L.Icon({
      iconUrl: `https://maps.google.com/mapfiles/ms/icons/${getMarkerColor(
        severity
      )}-dot.png`,
      iconSize: [28, 28],
    });

  return (
    <div className="bg-[#070b12] text-[#e2e8f0] min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Conflict Map</h1>

      <div className="border border-[#1e2d45] rounded overflow-hidden">
        <MapContainer
          center={[30, 40]}
          zoom={4}
          style={{ height: "600px", width: "100%" }}
        >
          {/* Dark Theme Map */}
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          {events.map((event) => (
            <Marker
              key={event.event_id}
              position={[event.latitude, event.longitude]}
              icon={createIcon(event.severity_score)}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold text-red-400">
                    {event.event_type.toUpperCase()}
                  </p>

                  <p><b>Country:</b> {event.country}</p>
                  <p><b>Location:</b> {event.location}</p>
                  <p><b>Target:</b> {event.target_type}</p>
                  <p><b>Fatalities:</b> {event.fatalities}</p>
                  <p><b>Injuries:</b> {event.injuries}</p>
                  <p><b>Severity:</b> {event.severity_score}</p>
                  <p><b>Confidence:</b> {event.confidence_score}</p>

                  
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