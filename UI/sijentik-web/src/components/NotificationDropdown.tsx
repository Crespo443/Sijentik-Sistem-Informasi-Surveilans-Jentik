import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch recent activities
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["recent-activity-header"],
    queryFn: async () => {
      const res = await api.get("/analytics/recent-activity");
      return res.data ?? [];
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const unreadCount = activities.length > 0 ? activities.length : 0; // Or determine unread logic if available

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className={`relative p-2 text-text-muted hover:bg-slate-100 rounded-full transition-colors ${isOpen ? 'bg-slate-100' : ''}`}
      >
        <span className="material-symbols-outlined text-[20px] md:text-[22px]">
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-danger rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-surface rounded-lg shadow-xl border border-border-subtle z-50 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-slate-50/50">
            <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">
                notifications_active
              </span>
              Notifikasi Terbaru
            </h3>
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto p-4 custom-scroll space-y-4">
            {isLoading ? (
              <div className="text-center py-6 text-sm text-text-muted">
                Memuat notifikasi...
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-6 text-sm text-text-muted">
                Belum ada notifikasi
              </div>
            ) : (
              activities.map((activity: any, idx: number) => {
                const positiveCount = activity.containers.reduce(
                  (acc: number, c: any) => acc + c.positiveCount,
                  0
                );
                const isPositive = positiveCount > 0;
                const date = new Date(activity.createdAt).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );

                return (
                  <div
                    key={activity.id}
                    className={`relative pl-4 border-l-2 pb-4 ${
                      idx === activities.length - 1 ? "pb-0" : ""
                    } ${isPositive ? "border-red-200" : "border-slate-200"}`}
                  >
                    <div
                      className={`absolute -left-1.25 top-1 w-2 h-2 rounded-full ring-4 ring-white ${
                        isPositive ? "bg-danger" : "bg-primary"
                      }`}
                    ></div>
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isPositive ? "text-danger" : "text-text-main"
                        }`}
                      >
                        {isPositive ? "Ditemukan Jentik" : "Survei Bersih"}
                      </span>
                      <span className="text-[10px] text-text-muted">{date}</span>
                    </div>
                    <p className="text-xs text-text-muted mb-1.5">
                      <strong className="text-text-main font-medium">
                        {activity.surveyorName}
                      </strong>{" "}
                      menginput rumah <strong>{activity.houseOwner}</strong> di{" "}
                      <strong className="text-text-main font-medium">
                        {activity.village?.name || "Wilayah"}
                      </strong>
                      .
                    </p>
                    {isPositive && (
                      <div className="inline-flex gap-2">
                        <span className="bg-red-50 text-danger border border-red-100 text-[10px] px-1.5 py-0.5 rounded font-medium">
                          {positiveCount} Kontainer Positif
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          
          <div className="p-3 border-t border-border-subtle bg-slate-50 text-center">
            <Link
              to="/data-survey"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline block w-full"
            >
              Lihat Semua Data Survei →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
