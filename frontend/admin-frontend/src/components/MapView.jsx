import { FaPlus, FaMinus, FaLocationArrow } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Polygon } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

export default function MapView() {
  const center = [12.8219, 80.0441];

  const [users, setUsers] = useState([]);
  const [zones, setZones] = useState([]); // 🔥 NEW

  // ✅ Marker Icons
  const redIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32],
  });

  const greenIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32],
  });

  // 🔥 Fetch users + zones
  useEffect(() => {
    const fetchData = () => {
      // USERS
      fetch("http://localhost:5000/users")
        .then((res) => res.json())
        .then((data) => {
          const usersArray = Object.keys(data).map((id) => ({
            id,
            ...data[id],
          }));
          setUsers(usersArray);
        })
        .catch((err) => console.error(err));

      // ZONES
      fetch("http://localhost:5000/zones")
        .then((res) => res.json())
        .then((data) => {
          setZones(data);
        })
        .catch((err) => console.error(err));
    };

    fetchData();

    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full min-h-[680px] bg-slate-50">
      
      {/* Zone Info */}
      <div className="absolute left-6 top-6 z-20 rounded-3xl border border-slate-200 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          Current Zone
        </p>
        <h2 className="mt-2 text-base font-semibold text-slate-900">
          Live Zone Monitoring
        </h2>
      </div>

      {/* Controls */}
      <div className="absolute left-6 bottom-6 z-20 flex flex-col gap-3">
        <button className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-lg hover:bg-slate-100">
          <FaPlus />
        </button>
        <button className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-lg hover:bg-slate-100">
          <FaMinus />
        </button>
        <button className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-lg hover:bg-slate-800">
          <FaLocationArrow />
        </button>
      </div>

      {/* Map */}
      <MapContainer center={center} zoom={17} className="h-full w-full">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {/* 🔥 USERS */}
        {users.map((user) => (
          <Marker
            key={user.id}
            position={[user.lat, user.lon]}
            icon={user.status === "danger" ? redIcon : greenIcon}
          />
        ))}

        {/* 🔥 ZONES (FROM BACKEND) */}
        {zones.map((zone, index) => (
          <Polygon
            key={index}
            positions={zone.polygon}
            pathOptions={{
              color:
                zone.type === "danger"
                  ? "#ef4444"
                  : zone.type === "restricted"
                  ? "#f59e0b"
                  : "#10b981",
              fillOpacity: 0.2,
              weight: 3,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}