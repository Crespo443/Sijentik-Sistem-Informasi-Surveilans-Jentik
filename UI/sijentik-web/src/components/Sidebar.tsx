import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/Logo.png";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const [isLaporanOpen, setIsLaporanOpen] = useState(false);
  const location = useLocation();
  const isPuskesmasReportActive =
    location.pathname.startsWith("/laporan/puskesmas");
  const navigate = useNavigate();

  const laporanPuskesmasPath = (() => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return "/laporan/puskesmas/1";

      const parsedUser = JSON.parse(user);
      return parsedUser.healthCenter?.id
        ? `/laporan/puskesmas/${parsedUser.healthCenter.id}`
        : "/laporan/puskesmas/1";
    } catch {
      return "/laporan/puskesmas/1";
    }
  })();

  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-surface-dark border-r border-slate-800 flex flex-col shrink-0 
      transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}
    >
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-[#0B1120]">
        <div className="flex items-center gap-2.5">
          <img
            src={logo}
            alt="Sijentik Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="font-heading font-bold text-lg text-white tracking-wide">
            SIJENTIK<span className="text-primary">.</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-slate-400 hover:text-white p-1"
          aria-label="Close sidebar"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scroll bg-[#0f172a]">
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Main Menu
          </p>
        </div>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded transition-colors group ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">
            dashboard
          </span>
          <span className="text-sm font-medium">Dashboard</span>
        </NavLink>

        {/* Master Data */}
        <div>
          <button
            onClick={() => setIsMasterOpen(!isMasterOpen)}
            aria-expanded={isMasterOpen}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-slate-300 hover:bg-white/5 hover:text-white transition-colors group"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-white">
              database
            </span>
            <span className="text-sm font-medium flex-1 text-left">
              Data Master
            </span>
            <span
              className={`material-symbols-outlined text-[16px] text-slate-400 group-hover:text-white transition-transform ${isMasterOpen ? "rotate-180" : ""}`}
            >
              expand_more
            </span>
          </button>

          {isMasterOpen ? (
            <div className="ml-8 mt-1 space-y-0.5">
              <NavLink
                to="/master/kecamatan"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-slate-400 hover:bg-white/5 hover:text-white"}`
                }
              >
                <span className="material-symbols-outlined text-[16px]">
                  location_city
                </span>
                Data Kecamatan
              </NavLink>
              <NavLink
                to="/master/puskesmas"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-slate-400 hover:bg-white/5 hover:text-white"}`
                }
              >
                <span className="material-symbols-outlined text-[16px]">
                  local_hospital
                </span>
                Data Puskesmas
              </NavLink>
            </div>
          ) : null}
        </div>

        <NavLink
          to="/survey"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded transition-colors group ${isActive ? "bg-primary/10 text-primary" : "text-slate-300 hover:bg-white/5 hover:text-white"}`
          }
        >
          <span className="material-symbols-outlined text-[20px]">
            edit_document
          </span>
          <span className="text-sm font-medium">Survey Input</span>
        </NavLink>

        <NavLink
          to="/peta-risiko"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded transition-colors group ${isActive ? "bg-primary/10 text-primary" : "text-slate-300 hover:bg-white/5 hover:text-white"}`
          }
        >
          <span className="material-symbols-outlined text-[20px]">map</span>
          <span className="text-sm font-medium">Peta Risiko</span>
        </NavLink>

        <NavLink
          to="/data-survey"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded transition-colors group ${isActive ? "bg-primary/10 text-primary" : "text-slate-300 hover:bg-white/5 hover:text-white"}`
          }
        >
          <span className="material-symbols-outlined text-[20px]">
            fact_check
          </span>
          <span className="text-sm font-medium">Data Survey</span>
        </NavLink>

        {/* Laporan */}
        <div>
          <button
            onClick={() => setIsLaporanOpen(!isLaporanOpen)}
            aria-expanded={isLaporanOpen}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-slate-300 hover:bg-white/5 hover:text-white transition-colors group"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-white">
              summarize
            </span>
            <span className="text-sm font-medium flex-1 text-left">
              Laporan
            </span>
            <span
              className={`material-symbols-outlined text-[16px] text-slate-400 group-hover:text-white transition-transform ${isLaporanOpen ? "rotate-180" : ""}`}
            >
              expand_more
            </span>
          </button>

          {isLaporanOpen ? (
            <div className="ml-8 mt-1 space-y-0.5">
              <NavLink
                to="/laporan"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-slate-400 hover:bg-white/5 hover:text-white"}`
                }
              >
                <span className="material-symbols-outlined text-[16px]">
                  bar_chart
                </span>
                Rekap Periodik
              </NavLink>
              <NavLink
                to={laporanPuskesmasPath}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${isActive || isPuskesmasReportActive ? "bg-primary/10 text-primary" : "text-slate-400 hover:bg-white/5 hover:text-white"}`
                }
              >
                <span className="material-symbols-outlined text-[16px]">
                  local_hospital
                </span>
                Per Puskesmas
              </NavLink>
            </div>
          ) : null}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary">
            <span className="material-symbols-outlined text-[20px]">
              person
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user")!).name
                : "Pengguna"}
            </p>
            <p className="text-slate-400 text-xs truncate">
              {localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user")!).role === "ADMIN"
                  ? "Administrator"
                  : "Puskesmas Manager"
                : "-"}
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            aria-label="Logout"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
