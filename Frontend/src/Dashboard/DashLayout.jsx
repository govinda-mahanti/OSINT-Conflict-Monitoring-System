import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  RadioTower,
  Swords,
  Map,
  BarChart3,
  Bell,
  Bot,
  Settings,
  LogOut,
  X,
  Menu,
  ShieldAlert,
  User,
} from "lucide-react";

const DashLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("en-US", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit", hour12: false,
        }) + " UTC"
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/", icon: <LayoutDashboard size={17} />, badge: null },
    { label: "Intel Feed", path: "/intel-feed", icon: <RadioTower size={17} />, },
    { label: "Events", path: "/event-feed", icon: <Swords size={17} />, badge: null },
    { label: "Threat Map", path: "/map-view", icon: <Map size={17} />, badge: null },
   
  ];

  const isActive = (path) => location.pathname === path;

  /* ─── Reusable Nav List ──────────────────────────────────────────────────── */
  const NavList = ({ onItemClick }) => (
    <ul className="list-none m-0 p-0 flex flex-col gap-[2px]">
      {navItems.map((item, idx) => {
        const active = isActive(item.path);
        return (
          <li key={idx}>
            <Link
              to={item.path}
              onClick={onItemClick}
              className={[
                /* layout */
                "flex items-center gap-[11px]",
                "px-[14px] py-[10px]",
                "rounded-[10px]",
                /* typography */
                "text-[11px] font-mono tracking-[0.1em] uppercase no-underline",
                /* border + transition */
                "border transition-all duration-[160ms] ease-[ease]",
                /* state */
                active
                  ? "font-bold text-white border-[rgba(239,68,68,0.32)] shadow-[0_0_18px_rgba(239,68,68,0.1)] bg-[linear-gradient(90deg,rgba(239,68,68,0.18),rgba(239,68,68,0.04))]"
                  : "font-medium text-[#64748b] bg-transparent border-transparent hover:bg-[rgba(255,255,255,0.04)] hover:text-[#e2e8f0] hover:border-[#1e2d45]",
              ].join(" ")}
            >
              {/* Icon */}
              <span className={`flex-shrink-0 flex ${active ? "text-[#ef4444]" : "text-[#64748b]"}`}>
                {item.icon}
              </span>

              {/* Label */}
              <span className="flex-1">{item.label}</span>

              {/* Badge */}
              {item.badge && (
                <span
                  className={[
                    "text-[9px] font-extrabold font-mono tracking-[1px]",
                    "px-[7px] py-[1px] rounded-full",
                    active ? "bg-[#ef4444] text-white" : "bg-[rgba(239,68,68,0.18)] text-[#ef4444]",
                  ].join(" ")}
                >
                  {item.badge}
                </span>
              )}

              {active && !item.badge && (
                <span className="w-[5px] h-[5px] rounded-full flex-shrink-0 bg-[#ef4444] shadow-[0_0_7px_#ef4444]" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const Logo = ({ size = "md" }) =>
    size === "md" ? (
      <div className="flex items-center gap-[11px] px-[18px] py-[20px] border-b border-[#1e2d45] mb-[18px]">

        <div>
          <p className="text-[#e2e8f0] font-extrabold text-[16px] tracking-[3px] font-mono leading-none">WAR</p>
          <p className="text-[#ef4444] font-bold text-[8px] tracking-[5px] font-mono">INTEL OPS</p>
        </div>
      </div>
    ) : (
      <div className="flex items-center gap-[10px]">

        <div>
          <p className="text-[#e2e8f0] font-extrabold text-[14px] tracking-[3px] font-mono leading-none">WAR</p>
          <p className="text-[#ef4444] text-[8px] tracking-[5px] font-mono">INTEL OPS</p>
        </div>
      </div>
    );

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#070b12]"
      style={{ fontFamily: "'Rajdhani','Segoe UI',monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap');
        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: #070b12; }
        ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 2px; }
        @keyframes livePulse {
          0%,100% { opacity:1; box-shadow: 0 0 7px #ef4444; }
          50%      { opacity:0.35; box-shadow: none; }
        }
        .live-pulse { animation: livePulse 1.8s infinite; }
      `}</style>

      {/* DESKTOP SIDEBAR  */}
      <aside className="
        hidden md:flex
        w-[228px] flex-shrink-0
        flex-col justify-between
        pb-[16px]
        bg-[#0b1120]
        border-r border-[#1e2d45]
        relative overflow-hidden
      ">
        <div className="
          absolute top-[-50px] left-[-50px]
          w-[180px] h-[180px] rounded-full
          pointer-events-none
          bg-[radial-gradient(circle,rgba(239,68,68,0.07)_0%,transparent_70%)]
        " />

        <div>
          {/* Logo */}
          <Logo size="md" />

          {/* Section label */}
          <div className="px-[18px] pb-[10px]">
            <span className="text-[#64748b] text-[8px] font-mono tracking-[4px] uppercase">
              — Operations —
            </span>
          </div>

          {/* Nav */}
          <div className="px-[10px]">
            <NavList />
          </div>
        </div>
      </aside>

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-[3px] z-40"
        />
      )}

      {/* MOBILE DRAWER   */}
      <div
        className={[
          "fixed top-0 left-0 z-50",
          "h-full w-[258px]",
          "flex flex-col justify-between",
          "pb-[16px]",
          "bg-[#0b1120]",
          "border-r border-[#1e2d45]",
          "duration-[270ms]",
          "transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
      >
        <div>
          <div className="
            flex items-center justify-between
            px-[16px] py-[18px]
            border-b border-[#1e2d45]
            mb-[14px]
          ">
            <Logo size="sm" />

            <button
              onClick={() => setMobileOpen(false)}
              className="
                flex items-center
                bg-[rgba(255,255,255,0.05)]
                border border-[#1e2d45]
                rounded-[8px]
                p-[6px]
                cursor-pointer
                text-[#64748b]
              "
            >
              <X size={15} />
            </button>
          </div>

          {/* Nav */}
          <div className="px-[10px]">
            <NavList onItemClick={() => setMobileOpen(false)} />
          </div>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/*  TOPBAR */}
        <header className="
          relative flex-shrink-0
          flex items-center justify-between
          h-[62px] px-[20px] gap-[12px]
          bg-[#0d1526]
          border-b border-[#1e2d45]
        ">
          <div className="flex items-center gap-[14px]">

            <div className="flex items-center gap-[10px]">
              <div className="flex items-center gap-[6px]">
                <span className="live-pulse inline-block w-[8px] h-[8px] rounded-full bg-[#ef4444]" />
                <span className="text-[#ef4444] text-[10px] font-mono tracking-[3px] font-bold">
                  LIVE
                </span>
              </div>

              <div className="w-[1px] h-[20px] bg-[#1e2d45] mx-[6px]" />

              <span className="text-[#64748b] text-[11px] font-mono whitespace-nowrap">
                {currentTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-[2px] relative">

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="
                md:hidden
                flex items-center
                bg-transparent border border-transparent
                rounded-[9px] p-[8px]
                cursor-pointer text-[#64748b]
                transition-all duration-150
              "
            >
              <Menu size={18} />
            </button>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#070b12]">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashLayout;