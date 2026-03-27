import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const events = [
  {
    _id: "69c56d4d4322d7cc8298fba8",
    event_datetime_utc: "2026-03-25 09:11:56+00:00",
    source_name: "Insurance Journal",
    source_url: "https://www.insurancejournal.com/news/international/2026/03/25/863321",
    claim_text: "Iran's Military Rejects Trump's Talk of Negotiation; Israel and Iran Locked in Conflict",
    country: "Iran",
    location_text: "",
    attacker: "Israel/Iran",
    defender: "Iran/Israel",
    event_type: "airstrike",
    domain: "military",
    weapon_type: "airstrike",
    target_type: "military",
    fatalities: 0,
    injuries: 0,
    severity_score: 5,
    confidence_score: 0.8,
    tags: ["Iran", "Israel"],
  },
  {
    _id: "69c56d4d4322d7cc8298fba9",
    event_datetime_utc: "2026-03-25 09:10:26+00:00",
    source_name: "Sputnikglobe.com",
    source_url: "https://sputnikglobe.com/20260325/middle-east-conflict",
    claim_text: "Middle East Conflict Could Lead to 1970s Energy Crisis 2.0 — Oil supplies threatened",
    country: "Israel",
    location_text: "Middle East",
    attacker: "Arab countries",
    defender: "Israel",
    event_type: "conflict",
    domain: "political",
    weapon_type: "",
    target_type: "government",
    fatalities: 0,
    injuries: 0,
    severity_score: 3,
    confidence_score: 0.8,
    tags: ["Middle East", "Energy"],
  },
  {
    _id: "69c56d4d4322d7cc8298fbaa",
    event_datetime_utc: "2026-03-25 15:12:48+00:00",
    source_name: "Military Times",
    source_url: "https://www.militarytimes.com/news/your-military/2026/03/25/pentagon",
    claim_text: "Pentagon confirms elements from the 82nd Airborne Division to deploy to Middle East region",
    country: "Iran",
    location_text: "Middle East",
    attacker: "",
    defender: "US",
    event_type: "deployment",
    domain: "military",
    weapon_type: "",
    target_type: "",
    fatalities: 0,
    injuries: 0,
    severity_score: 1,
    confidence_score: 0.8,
    tags: ["US", "Military"],
  },
  {
    _id: "69c56d4d4322d7cc8298fbab",
    event_datetime_utc: "2026-03-24 22:16:26+00:00",
    source_name: "Military Times",
    source_url: "https://www.militarytimes.com/news/your-military/2026/03/24/deadly-iran",
    claim_text: "Deadly Iran school strike casts shadow over Pentagon's AI targeting push — civilian casualties reported",
    country: "Iran",
    location_text: "Minab",
    attacker: "",
    defender: "",
    event_type: "strike",
    domain: "military",
    weapon_type: "",
    target_type: "civilian",
    fatalities: 0,
    injuries: 0,
    severity_score: 1,
    confidence_score: 0.8,
    tags: ["Iran", "Civilian"],
  },
];

const SEVERITY_COLORS = { 5: "#ef4444", 3: "#f97316", 1: "#facc15" };
const SEVERITY_LABELS = { 5: "Critical", 3: "Moderate", 1: "Low" };

const EVENT_TYPE_COLORS = {
  airstrike: "#a855f7",
  conflict: "#ef4444",
  deployment: "#3b82f6",
  strike: "#f97316",
};

const domainData = [
  { name: "Military", value: 3 },
  { name: "Political", value: 1 },
];
const DOMAIN_COLORS = ["#a855f7", "#f97316"];

const eventTypeData = [
  { name: "Airstrike", value: 1, fill: "#a855f7" },
  { name: "Conflict", value: 1, fill: "#ef4444" },
  { name: "Deployment", value: 1, fill: "#3b82f6" },
  { name: "Strike", value: 1, fill: "#f97316" },
];

const severityData = [
  { name: "Critical (5)", value: 1, fill: "#ef4444" },
  { name: "Moderate (3)", value: 1, fill: "#f97316" },
  { name: "Low (1)", value: 2, fill: "#facc15" },
];

const countryData = [
  { name: "Iran", value: 3 },
  { name: "Israel", value: 1 },
];

function SeverityBadge({ score }) {
  const color = SEVERITY_COLORS[score] || "#6b7280";
  const label = SEVERITY_LABELS[score] || "Unknown";
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ background: color + "22", color, border: `1px solid ${color}55` }}
    >
      {label}
    </span>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4"
      style={{ background: "#12151f", border: "1px solid #1e2235" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: accent + "22" }}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-400 font-semibold tracking-widest uppercase mb-1">{label}</div>
        <div className="text-2xl font-black text-white" style={{ fontFamily: "'Orbitron', monospace" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-3 py-2 text-sm text-white" style={{ background: "#1a1e2e", border: "1px solid #2a2f45" }}>
        <span className="font-bold">{payload[0].name}</span>: {payload[0].value}
      </div>
    );
  }
  return null;
};

export default function WarDashboard() {
  const [selected, setSelected] = useState(null);

  const totalEvents = events.length;
  const totalFatalities = events.reduce((s, e) => s + e.fatalities, 0);
  const avgSeverity = (events.reduce((s, e) => s + e.severity_score, 0) / totalEvents).toFixed(1);
  const avgConfidence = Math.round((events.reduce((s, e) => s + e.confidence_score, 0) / totalEvents) * 100);

  return (
    <div
      className="min-h-screen w-full p-6"
      style={{
        background: "#0b0e17",
        fontFamily: "'Rajdhani', 'Segoe UI', sans-serif",
        color: "#e2e8f0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        .event-card:hover { border-color: #a855f744 !important; transform: translateY(-2px); }
        .event-card { transition: all 0.2s ease; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2f45; border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold tracking-[0.25em] text-red-400 uppercase">Live Intelligence Feed</span>
          </div>
          <h1
            className="text-3xl font-black tracking-tight"
            style={{ fontFamily: "'Orbitron', monospace", color: "#fff" }}
          >
            WAR EVENT DASHBOARD
          </h1>
          <p className="text-gray-400 text-sm mt-1">Middle East Conflict Monitor · March 2026</p>
        </div>
        <div
          className="text-right rounded-2xl px-5 py-3"
          style={{ background: "#12151f", border: "1px solid #1e2235" }}
        >
          <div className="text-xs text-gray-400 tracking-widest uppercase mb-1">Last Updated</div>
          <div className="text-sm font-bold text-white">Mar 26, 2026 · 17:30 UTC</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="⚡" label="Total Events" value={totalEvents} accent="#a855f7" />
        <StatCard icon="💀" label="Fatalities" value={totalFatalities} accent="#ef4444" />
        <StatCard icon="🎯" label="Avg Severity" value={avgSeverity} accent="#f97316" />
        <StatCard icon="📡" label="Confidence" value={`${avgConfidence}%`} accent="#3b82f6" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Events by Type - Pie */}
        <div className="rounded-2xl p-5" style={{ background: "#12151f", border: "1px solid #1e2235" }}>
          <div className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-4">Event Types</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={eventTypeData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {eventTypeData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(val) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{val}</span>}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution - Bar */}
        <div className="rounded-2xl p-5" style={{ background: "#12151f", border: "1px solid #1e2235" }}>
          <div className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-4">Severity Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={severityData} barCategoryGap="35%">
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff08" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {severityData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Domain / Country */}
        <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "#12151f", border: "1px solid #1e2235" }}>
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-3">Domain Split</div>
            <ResponsiveContainer width="100%" height={90}>
              <PieChart>
                <Pie data={domainData} cx="50%" cy="50%" outerRadius={40} dataKey="value" paddingAngle={3}>
                  {domainData.map((_, i) => (
                    <Cell key={i} fill={DOMAIN_COLORS[i]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 11 }}>{v}</span>} iconType="circle" iconSize={7} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-3">Countries Involved</div>
            <div className="flex flex-col gap-2">
              {countryData.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="text-xs text-gray-400 w-12">{c.name}</div>
                  <div className="flex-1 h-2 rounded-full" style={{ background: "#1e2235" }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(c.value / totalEvents) * 100}%`,
                        background: c.name === "Iran" ? "#a855f7" : "#ef4444",
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 w-4">{c.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold uppercase tracking-widest text-gray-300">Recent Events</div>
            <div className="text-xs text-gray-500">{totalEvents} records</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {events.map((e) => (
              <div
                key={e._id}
                className="event-card rounded-2xl p-4 cursor-pointer"
                style={{
                  background: "#12151f",
                  border: `1px solid ${selected === e._id ? "#a855f744" : "#1e2235"}`,
                }}
                onClick={() => setSelected(selected === e._id ? null : e._id)}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                      style={{
                        background: (EVENT_TYPE_COLORS[e.event_type] || "#6b7280") + "22",
                        color: EVENT_TYPE_COLORS[e.event_type] || "#6b7280",
                        border: `1px solid ${(EVENT_TYPE_COLORS[e.event_type] || "#6b7280")}44`,
                      }}
                    >
                      {e.event_type}
                    </span>
                    <SeverityBadge score={e.severity_score} />
                  </div>
                  <div className="text-xs text-gray-500 shrink-0">
                    {e.event_datetime_utc.slice(0, 10)}
                  </div>
                </div>

                {/* Claim */}
                <p className="text-sm text-gray-200 leading-snug mb-3 line-clamp-2">{e.claim_text}</p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  <span>🌍 {e.country}</span>
                  {e.location_text && <span>📍 {e.location_text}</span>}
                  <span>🏛 {e.domain}</span>
                  <span className="ml-auto" style={{ color: "#3b82f6" }}>
                    {Math.round(e.confidence_score * 100)}% conf
                  </span>
                </div>

                {/* Expanded Detail */}
                {selected === e._id && (
                  <div
                    className="mt-3 pt-3 text-xs text-gray-400 space-y-1"
                    style={{ borderTop: "1px solid #1e2235" }}
                  >
                    {e.attacker && <div><span className="text-gray-500">Attacker: </span>{e.attacker}</div>}
                    {e.defender && <div><span className="text-gray-500">Defender: </span>{e.defender}</div>}
                    {e.weapon_type && <div><span className="text-gray-500">Weapon: </span>{e.weapon_type}</div>}
                    {e.target_type && <div><span className="text-gray-500">Target: </span>{e.target_type}</div>}
                    <div><span className="text-gray-500">Source: </span>
                      <a href={e.source_url} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">
                        {e.source_name}
                      </a>
                    </div>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {e.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full text-gray-300" style={{ background: "#1e2235" }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}