export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white shadow-sm border-b border-slate-200">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Guardian Lens</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">The Serene Sentinel</h1>
      </div>

      <div className="flex-1 px-6">
        <div className="relative mx-auto max-w-2xl">
          <input
            type="text"
            placeholder="Search tourist ID..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">Admin User</p>
          <p className="text-xs text-slate-500">Security Head</p>
        </div>
        <img
          src="https://i.pravatar.cc/42"
          alt="Admin avatar"
          className="h-11 w-11 rounded-full border border-slate-200"
        />
      </div>
    </header>
  );
}