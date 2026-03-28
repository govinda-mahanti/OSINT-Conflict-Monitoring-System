import React, { useEffect, useState } from "react";
import {
  Line,
  Bar,
  Pie
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { BASE_URL } from "../Config/urlConfig.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const TrendsAnalysis = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  // Events over time
  const eventsByDate = {};
  events.forEach((e) => {
    const date = e.event_datetime_utc.split(" ")[0];
    eventsByDate[date] = (eventsByDate[date] || 0) + 1;
  });

  const lineData = {
    labels: Object.keys(eventsByDate),
    datasets: [
      {
        label: "Events Over Time",
        data: Object.values(eventsByDate),
        borderColor: "#0ea5e9",
        backgroundColor: "#0ea5e9",
      },
    ],
  };

  // Events by country
  const countryData = {};
  events.forEach((e) => {
    countryData[e.country] = (countryData[e.country] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(countryData),
    datasets: [
      {
        label: "Events by Country",
        data: Object.values(countryData),
        backgroundColor: "#ef4444",
      },
    ],
  };

  // Event type
  const typeData = {};
  events.forEach((e) => {
    typeData[e.event_type] = (typeData[e.event_type] || 0) + 1;
  });

  const pieData = {
    labels: Object.keys(typeData),
    datasets: [
      {
        label: "Event Types",
        data: Object.values(typeData),
        backgroundColor: ["#ef4444", "#0ea5e9", "#22c55e", "#f59e0b"],
      },
    ],
  };

  // Confirmed vs Unverified
  let confirmed = 0;
  let unverified = 0;

  events.forEach((e) => {
    if (e.confidence_score >= 0.8) confirmed++;
    else unverified++;
  });

  const confidenceData = {
    labels: ["Confirmed", "Unverified"],
    datasets: [
      {
        data: [confirmed, unverified],
        backgroundColor: ["#22c55e", "#f59e0b"],
      },
    ],
  };

  return (
    <div className="bg-[#070b12] text-[#e2e8f0] min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Trends & Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Events Over Time */}
        <div className="bg-[#0b1120] border border-[#1e2d45] p-4 rounded">
          <h2 className="mb-2">Events Over Time</h2>
          <Line data={lineData} />
        </div>

        {/* Events by Country */}
        <div className="bg-[#0b1120] border border-[#1e2d45] p-4 rounded">
          <h2 className="mb-2">Events by Country</h2>
          <Bar data={barData} />
        </div>

        {/* Event Types */}
        <div className="bg-[#0b1120] border border-[#1e2d45] p-4 rounded">
          <h2 className="mb-2">Event Type Distribution</h2>
          <Pie data={pieData} />
        </div>

        {/* Confirmed vs Unverified */}
        <div className="bg-[#0b1120] border border-[#1e2d45] p-4 rounded">
          <h2 className="mb-2">Confirmed vs Unverified</h2>
          <Pie data={confidenceData} />
        </div>
      </div>
    </div>
  );
};

export default TrendsAnalysis;