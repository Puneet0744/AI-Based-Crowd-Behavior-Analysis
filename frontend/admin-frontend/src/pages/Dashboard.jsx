import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import MapView from "../components/MapView";
import AlertsPanel from "../components/AlertsPanel";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#eff2ff]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 p-6">
            <StatsCards />

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_380px]">
              <div className="rounded-[32px] bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] overflow-hidden min-h-[680px]">
                <MapView />
              </div>
              <AlertsPanel />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}