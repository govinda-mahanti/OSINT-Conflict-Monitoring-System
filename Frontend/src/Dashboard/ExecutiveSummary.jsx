import { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";

const API_URL = "https://osint-conflict-monitoring-system-1.onrender.com/api/events";
const POLL_INTERVAL = 30000;

const COLORS = {
  attack: "#f87171",
  airstrike: "#fb923c",
  strikes: "#fb923c",
  threat: "#60a5fa",
  cyber: "#4ade80",
  drone: "#c084fc",
  missile: "#fbbf24",
  country: "#ef4444",
};

function normalize(ev) {
  return {
    ...ev,
    attacker: Array.isArray(ev.attacker) ? ev.attacker[0] || "Unknown" : ev.attacker || "Unknown",
    defender: Array.isArray(ev.defender) ? ev.defender[0] || "Unknown" : ev.defender || "Unknown",
    event_type: ev.event_type || "unknown",
    weapon_type: ev.weapon_type || "—",
    target_type: ev.target_type || "—",
  };
}

// ── D3 Force Graph ──────────────────────────────────────────
function ForceGraph({ nodes, links, onNodeClick }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    // Use ResizeObserver to get actual rendered size
    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", W)
      .attr("height", H)
      .style("background", "transparent");

    svg.append("defs").append("marker")
      .attr("id", "arrow").attr("viewBox", "0 -5 10 10")
      .attr("refX", 24).attr("refY", 0)
      .attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto")
      .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#334155");

    const nodesCopy = nodes.map(d => ({ ...d }));
    const linksCopy = links.map(d => ({ ...d }));

    const sim = d3.forceSimulation(nodesCopy)
      .force("link", d3.forceLink(linksCopy).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(W / 2, H / 2))
      .force("collision", d3.forceCollide(38))
      // Clamp nodes inside bounds
      .force("x", d3.forceX(W / 2).strength(0.04))
      .force("y", d3.forceY(H / 2).strength(0.04));

    const linkEl = svg.append("g").selectAll("line")
      .data(linksCopy).join("line")
      .attr("stroke", "#1e293b").attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");

    const nodeEl = svg.append("g").selectAll("g")
      .data(nodesCopy).join("g")
      .attr("cursor", "pointer")
      .on("click", (_, d) => onNodeClick(d))
      .call(d3.drag()
        .on("start", (event, d) => { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag",  (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on("end",   (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    nodeEl.append("circle")
      .attr("r", d => d.isEvent ? 10 + (d.severity || 1) * 2 : 20)
      .attr("fill", d => COLORS[d.type] || COLORS.country)
      .attr("stroke", "#0f172a").attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 0 6px rgba(0,0,0,0.7))");

    nodeEl.append("text")
      .attr("y", d => (d.isEvent ? 10 + (d.severity || 1) * 2 : 20) + 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8").attr("font-size", "9px")
      .attr("font-weight", "bold").attr("font-family", "monospace")
      .text(d => d.label || d.id);

    sim.on("tick", () => {
      // Hard-clamp positions so nodes never escape the SVG
      nodesCopy.forEach(d => {
        const r = d.isEvent ? 10 + (d.severity || 1) * 2 : 20;
        d.x = Math.max(r + 4, Math.min(W - r - 4, d.x));
        d.y = Math.max(r + 4, Math.min(H - r - 4, d.y));
      });

      linkEl
        .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      nodeEl.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [nodes, links]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef} />
    </div>
  );
}

// ── Event Detail Panel ──────────────────────────────────────
function EventPanel({ event, onClose }) {
  if (!event) return null;
  const color = COLORS[event.event_type] || "#94a3b8";
  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-slate-950/95 border-l border-slate-800 z-30 flex flex-col p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase border"
          style={{ color, borderColor: color, background: `${color}15` }}>
          Severity {event.severity_score}/5
        </span>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors">
          ✕
        </button>
      </div>

      <h2 className="text-3xl font-black text-white italic tracking-tight mb-1">
        {event.event_type.toUpperCase()}
      </h2>
      <p className="text-slate-500 font-mono text-xs mb-2">
        {new Date(event.event_datetime_utc).toLocaleString()}
      </p>
      {event.location && (
        <p className="text-slate-600 font-mono text-xs mb-8">📍 {event.location}</p>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-5">
        <div className="flex justify-between text-xs text-slate-500 uppercase mb-3">
          <span>Attacker</span><span>Target</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-black text-red-400">{event.attacker}</span>
          <span className="text-slate-600">→</span>
          <span className="text-lg font-black text-blue-400">{event.defender}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {[["Weapon", event.weapon_type], ["Target", event.target_type],
          ["Fatalities", event.fatalities ?? "—"], ["Injuries", event.injuries ?? "—"]
        ].map(([k, v]) => (
          <div key={k} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="block text-xs text-slate-500 uppercase mb-1">{k}</span>
            <span className="text-sm font-bold text-slate-200 uppercase">{String(v)}</span>
          </div>
        ))}
      </div>

      {event.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {event.tags.map(tag => (
            <span key={tag} className="px-2 py-1 text-xs bg-slate-800 text-slate-400 rounded-md border border-slate-700">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="border-l-2 border-slate-700 pl-4 mb-8">
        <p className="text-slate-300 text-sm italic leading-relaxed">"{event.claim_text}"</p>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase mb-1">Source</p>
          <p className="font-bold text-slate-200">{event.source_name}</p>
        </div>
        <a href={event.source_url} target="_blank" rel="noreferrer"
          className="px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
          VIEW →
        </a>
      </div>
    </div>
  );
}

// ── Main App ────────────────────────────────────────────────
export default function ConflictNexus() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("loading");

  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.events || data.data || [];
      setEvents(arr.map(normalize));
      setStatus("ok");
    } catch (err) {
      console.error("API fetch failed:", err);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchEvents();
    const id = setInterval(fetchEvents, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const { nodes, links } = useMemo(() => {
    const nodesMap = new Map();
    const links = [];
    events.forEach(ev => {
      const evId = `ev_${ev._id}`;
      if (!nodesMap.has(ev.attacker))
        nodesMap.set(ev.attacker, { id: ev.attacker, type: "country", isEvent: false });
      if (!nodesMap.has(ev.defender))
        nodesMap.set(ev.defender, { id: ev.defender, type: "country", isEvent: false });
      nodesMap.set(evId, {
        id: evId, label: ev.event_type.toUpperCase(),
        type: ev.event_type, isEvent: true,
        severity: ev.severity_score, data: ev,
      });
      links.push({ source: ev.attacker, target: evId });
      links.push({ source: evId, target: ev.defender });
    });
    return { nodes: Array.from(nodesMap.values()), links };
  }, [events]);

  const handleNodeClick = (node) => {
    if (node.data) {
      setSelected(node.data);
    } else {
      const ev = events.find(e => e.attacker === node.id || e.defender === node.id);
      if (ev) setSelected(ev);
    }
  };

  return (
    // Use h-full w-full — fits inside whatever parent <main> provides
    <div className="relative h-full w-full overflow-hidden bg-[#070b12] text-slate-200 font-mono">

      {/* Status bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 text-xs">
        {status === "loading" && <span className="text-slate-500 animate-pulse">● Fetching events…</span>}
        {status === "ok"      && <span className="text-emerald-500">● {events.length} events loaded</span>}
        {status === "error"   && (
          <button onClick={fetchEvents} className="text-red-400 hover:text-red-300 transition-colors">
            ⚠ API error — click to retry
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-20 bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-xl p-4 grid grid-cols-2 gap-x-5 gap-y-2">
        {Object.entries(COLORS).slice(0, 6).map(([name, color]) => (
          <div key={name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-xs uppercase text-slate-500 tracking-widest">{name}</span>
          </div>
        ))}
      </div>

      {/* Loading overlay */}
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <p className="text-slate-600 text-xs uppercase tracking-[0.5em] animate-pulse">Loading intelligence feed…</p>
        </div>
      )}

      {/* Graph — fills remaining space */}
      <div className="absolute inset-0">
        <ForceGraph nodes={nodes} links={links} onNodeClick={handleNodeClick} />
      </div>

      {/* Latest events ticker */}
      <div className="absolute bottom-6 right-6 w-64 z-20 pointer-events-none space-y-1">
        <p className="text-xs text-slate-600 uppercase tracking-widest mb-2">⬤ Latest Events</p>
        {events.slice(0, 6).map((ev, i) => (
          <div key={ev._id}
            className="text-xs bg-slate-900/70 backdrop-blur border-r-2 border-red-500/40 px-3 py-2 text-slate-400"
            style={{ opacity: 1 - i * 0.13 }}>
            {ev.attacker} → {ev.event_type.toUpperCase()} → {ev.defender}
          </div>
        ))}
      </div>

      {/* Side Panel — absolute within this container */}
      <EventPanel event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}