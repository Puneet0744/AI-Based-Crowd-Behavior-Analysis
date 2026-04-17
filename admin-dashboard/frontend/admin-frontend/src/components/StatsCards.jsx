export default function StatsCards() {
  return (
    <div className="grid gap-4 xl:grid-cols-4 p-4">
      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Total Tourists</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">1,284</h2>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Active Users</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">942</h2>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">In Risk Zones</p>
        <h2 className="mt-3 text-3xl font-semibold text-red-600">12</h2>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Safe Users</p>
        <h2 className="mt-3 text-3xl font-semibold text-emerald-600">930</h2>
      </div>
    </div>
  );
}