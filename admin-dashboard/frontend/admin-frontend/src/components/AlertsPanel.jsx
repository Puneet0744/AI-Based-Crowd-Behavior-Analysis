import { useEffect, useState } from "react";

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = () => {
      fetch("http://localhost:5000/alerts")
        .then((res) => res.json())
        .then((data) => {
          setAlerts(data.reverse()); // latest first
        })
        .catch((err) => console.error(err));
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="h-full rounded-[32px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Live Incidents
          </p>
          <p className="text-sm text-slate-500">
            {alerts.length} Active Alerts
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="mt-6 space-y-5 overflow-y-auto pr-1">
        
        {alerts.length === 0 && (
          <p className="text-sm text-slate-400">No active alerts</p>
        )}

        {alerts.map((alert, index) => {
          const isCrowd = alert.type === "high_density";
          const isSOS = alert.type === "sos";

          return (
            <div
              key={index}
              className={`rounded-3xl border p-5 shadow-sm ${
                isSOS
                  ? "border-red-100 bg-red-50"
                  : "border-orange-100 bg-orange-50"
              }`}
            >
              <div className="flex items-center justify-between">
                
                {/* Label */}
                <span
                  className={`text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${
                    isSOS ? "text-red-600" : "text-orange-600"
                  }`}
                >
                  {isSOS ? "SOS" : "Crowd Alert"}
                </span>

                {/* Time */}
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    isSOS
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {alert.timestamp}
                </span>
              </div>

              {/* Message */}
              <p className="mt-4 text-sm font-semibold text-slate-900">
                {alert.message}
              </p>

              {/* Extra Info */}
              {isCrowd && (
                <p className="mt-1 text-sm text-slate-500">
                  Users in zone: {alert.count}
                </p>
              )}

              {/* Button */}
              <button
                className={`mt-5 w-full rounded-full px-4 py-3 text-sm font-semibold text-white transition ${
                  isSOS
                    ? "bg-red-700 hover:bg-red-600"
                    : "bg-slate-950 hover:bg-slate-800"
                }`}
              >
                {isSOS ? "Initiate Contact" : "Monitor Zone"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <button className="mt-6 w-full rounded-full bg-white border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
        View All Alerts →
      </button>
    </aside>
  );
}