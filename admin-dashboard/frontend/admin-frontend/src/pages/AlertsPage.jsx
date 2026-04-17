import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = () => {
      fetch("http://localhost:5000/alerts")
        .then((res) => res.json())
        .then((data) => {
          setAlerts(data.reverse());
        })
        .catch((err) => console.error(err));
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 2000);

    return () => clearInterval(interval);
  }, []);

  const activeIncidents = alerts.length;
  const serviceHealth = Math.max(28, 100 - activeIncidents * 12);

  return (
    <div className="flex min-h-screen bg-[#eff2ff]">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 rounded-[32px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Alerts
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                    Alerts Control Center
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Export Report
                  </button>
                  <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                    New Incident
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-xl">
                  <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                    placeholder="Search incidents, services, or users"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                    Active
                  </span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    Last 7 days
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-4">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Active Incidents</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="rounded-3xl bg-red-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-red-600">
                    Action Required
                  </div>
                  <span className="text-3xl font-semibold text-slate-900">
                    {activeIncidents}
                  </span>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Service Health</p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <h2 className="text-3xl font-semibold text-slate-900">
                    {serviceHealth}%
                  </h2>
                  <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    +2.4%
                  </span>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Mean Time to Resolve</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-900">
                  45m
                </h2>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">AI Agents Running</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-900">
                  4
                </h2>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.6fr_380px]">
              <section className="rounded-[32px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Recent Incidents</p>
                    <p className="text-sm text-slate-500">Latest alerts from the control center</p>
                  </div>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    View all
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {alerts.length === 0 && (
                    <p className="text-sm text-slate-400">No active incidents found.</p>
                  )}

                  {alerts.map((alert, index) => {
                    const isSOS = alert.type === "sos";
                    const badgeLabel = isSOS ? "P1" : "P2";
                    const statusLabel = isSOS ? "Investigating" : "Open";

                    return (
                      <div key={index} className="rounded-[28px] border border-slate-200 p-5 shadow-sm transition hover:-translate-y-0.5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <p className="text-base font-semibold text-slate-900">{alert.message}</p>
                            <p className="text-sm text-slate-500">{alert.timestamp} • {alert.zone_id || "Zone"}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className={`rounded-full px-3 py-1 font-semibold ${isSOS ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                              {badgeLabel}
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                              {statusLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <aside className="rounded-[32px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Activity Feed</p>
                    <p className="text-sm text-slate-500">Recent system and operator events</p>
                  </div>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    View all
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-900">Alex Rivera performed Update</p>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">05:20:00</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Changed status to Investigating</p>
                  </div>
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-900">System performed Create</p>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">05:15:00</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Automated alert trigger: High Density</p>
                  </div>
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-900">Sarah Chen performed Deploy</p>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">04:45:00</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Rollback to v2.4.5</p>
                  </div>
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-900">Mike Ross performed Login</p>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">12:30:00</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Logged in from 192.168.1.5</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
