import { Link } from "react-router-dom";

type ActivityFeedProps = {
  activities: any[];
};

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <div className="bg-surface rounded-lg border border-border-subtle shadow-card flex flex-col h-130">
      <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-slate-50/50">
        <h3 className="text-text-main font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">
            history
          </span>
          Aktivitas Terbaru
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-10 text-sm text-text-muted">
            Belum ada aktivitas terbaru
          </div>
        ) : (
          activities.map((activity, idx) => {
            const positiveCount = activity.containers.reduce(
              (acc: number, c: any) => acc + c.positiveCount,
              0,
            );
            const isPositive = positiveCount > 0;
            const date = new Date(activity.createdAt).toLocaleDateString(
              "id-ID",
              {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              },
            );

            return (
              <div
                key={activity.id}
                className={`relative pl-4 border-l-2 pb-4 ${idx === activities.length - 1 ? "pb-0" : ""} ${isPositive ? "border-red-200" : "border-slate-200"}`}
              >
                <div
                  className={`absolute -left-1.25 top-1 w-2 h-2 rounded-full ring-4 ring-white ${isPositive ? "bg-danger" : "bg-primary"}`}
                ></div>
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${isPositive ? "text-danger" : "text-text-main"}`}
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
          className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline"
        >
          Lihat Semua Data Survei →
        </Link>
      </div>
    </div>
  );
};

export default ActivityFeed;
