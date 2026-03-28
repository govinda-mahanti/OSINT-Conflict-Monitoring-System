import { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { BASE_URL } from "../Config/urlConfig.js";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const SEVERITY_COLORS = { 5: "#ef4444", 3: "#f97316", 1: "#facc15" };

const EVENT_TYPE_COLORS = {
  airstrike: "#a855f7",
  conflict: "#ef4444",
  deployment: "#3b82f6",
  strike: "#f97316",
  missile: "#22c55e",
  invasion: "#eab308",
  warning: "#06b6d4",
  blockade: "#f43f5e",
  threat: "#8b5cf6",
  attack: "#10b981"
};

function StatCard({ icon, label, value, accent }) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4"
      style={{ background: "#12151f", border: "1px solid #1e2235" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: accent + "22" }}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-400 font-semibold uppercase mb-1">{label}</div>
        <div className="text-2xl font-black text-white">{value}</div>
      </div>
    </div>
  );
}

export default function WarDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/events`)
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  const totalEvents = events.length;
  const totalFatalities = events.reduce((s, e) => s + (e.fatalities || 0), 0);
  const avgSeverity = totalEvents
    ? (events.reduce((s, e) => s + (e.severity_score || 0), 0) / totalEvents).toFixed(1)
    : 0;
  const avgConfidence = totalEvents
    ? Math.round((events.reduce((s, e) => s + (e.confidence_score || 0), 0) / totalEvents) * 100)
    : 0;

  // ================= Charts Data =================
  const eventTypeCount = {};
  const severityCount = {};
  const eventsByDate = {};
  let confirmed = 0;
  let unverified = 0;

  events.forEach(e => {
    if (e.event_type) eventTypeCount[e.event_type] = (eventTypeCount[e.event_type] || 0) + 1;
    if (e.severity_score) severityCount[e.severity_score] = (severityCount[e.severity_score] || 0) + 1;

    if (e.event_datetime_utc) {
      const date = e.event_datetime_utc.split(" ")[0];
      eventsByDate[date] = (eventsByDate[date] || 0) + 1;
    }

    if (e.confidence_score >= 0.8) confirmed++;
    else unverified++;
  });

  // Event Type Pie
  const eventTypeData = {
    labels: Object.keys(eventTypeCount),
    datasets: [{
      data: Object.values(eventTypeCount),
      backgroundColor: Object.keys(eventTypeCount).map(t => EVENT_TYPE_COLORS[t] || "#888"),
      borderColor: "#0b0e17",
      borderWidth: 2,
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { color: "#cbd5f5" }
      }
    }
  };

  // Severity Bar
  const severityData = {
    labels: Object.keys(severityCount).map(s => `Severity ${s}`),
    datasets: [{
      label: "Events",
      data: Object.values(severityCount),
      backgroundColor: "#f97316"
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#cbd5f5" } } },
    scales: {
      x: { ticks: { color: "#94a3b8" } },
      y: { ticks: { color: "#94a3b8" } }
    }
  };

  // Events Over Time Line
  const lineData = {
    labels: Object.keys(eventsByDate),
    datasets: [{
      label: "Events",
      data: Object.values(eventsByDate),
      borderColor: "#3b82f6",
      backgroundColor: "#3b82f6",
      tension: 0.3
    }]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#cbd5f5" } } },
    scales: {
      x: { ticks: { color: "#94a3b8" } },
      y: { ticks: { color: "#94a3b8" } }
    }
  };

  // Confirmed vs Unverified
  const confidenceData = {
    labels: ["Confirmed", "Unverified"],
    datasets: [{
      data: [confirmed, unverified],
      backgroundColor: ["#22c55e", "#f59e0b"]
    }]
  };

  return (
    <div className="min-h-screen w-full p-6" style={{ background: "#0b0e17", color: "#e2e8f0" }}>
      <h1 className="text-3xl font-black text-white mb-6">WAR EVENT DASHBOARD</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="⚡" label="Total Events" value={totalEvents} accent="#a855f7" />
        <StatCard icon="💀" label="Fatalities" value={totalFatalities} accent="#ef4444" />
        <StatCard icon="🎯" label="Avg Severity" value={avgSeverity} accent="#f97316" />
        <StatCard icon="📡" label="Confidence" value={`${avgConfidence}%`} accent="#3b82f6" />
      </div>

      {/* Top Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl p-5" style={{ background: "#12151f", border: "1px solid #1e2235", height: "280px" }}>
          <div className="text-sm font-bold uppercase mb-4">Event Types</div>
          <div style={{ height: "200px" }}>
            <Pie data={eventTypeData} options={pieOptions} />
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "#12151f", border: "1px solid #1e2235", height: "280px" }}>
          <div className="text-sm font-bold uppercase mb-4">Severity Distribution</div>
          <div style={{ height: "200px" }}>
            <Bar data={severityData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: "#12151f", border: "1px solid #1e2235", height: "280px" }}>
          <div className="text-sm font-bold uppercase mb-4">Events Over Time</div>
          <div style={{ height: "200px" }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "#12151f", border: "1px solid #1e2235", height: "280px" }}>
          <div className="text-sm font-bold uppercase mb-4">Confirmed vs Unverified</div>
          <div style={{ height: "200px" }}>
            <Pie data={confidenceData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}