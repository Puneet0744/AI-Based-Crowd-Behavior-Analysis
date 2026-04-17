import Sidebar from "../components/Sidebar";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import { useState, useEffect } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

export default function ZonesPage() {
    const [vertices, setVertices] = useState([{ lat: "", lon: "" }]);
    const [zoneName, setZoneName] = useState("");
    const [zoneType, setZoneType] = useState("danger");

    // 🔥 NEW: stored zones from backend
    const [zones, setZones] = useState([]);

    // 🔥 Fetch zones from backend
    useEffect(() => {
        const fetchZones = () => {
            fetch("http://localhost:5000/zones")
                .then(res => res.json())
                .then(data => setZones(data))
                .catch(err => console.error(err));
        };

        fetchZones();

        const interval = setInterval(fetchZones, 2000);

        return () => clearInterval(interval);
    }, []);

    // Convert input → polygon
    const polygon = vertices
        .filter(
            (v) =>
                v.lat !== "" &&
                v.lon !== "" &&
                !Number.isNaN(parseFloat(v.lat)) &&
                !Number.isNaN(parseFloat(v.lon))
        )
        .map((v) => [parseFloat(v.lat), parseFloat(v.lon)]);

    const addVertex = () => {
        setVertices([...vertices, { lat: "", lon: "" }]);
    };

    const removeVertex = (index) => {
        const updated = [...vertices];
        updated.splice(index, 1);
        setVertices(updated.length ? updated : [{ lat: "", lon: "" }]);
    };

    const updateVertex = (index, field, value) => {
        const updated = [...vertices];
        updated[index][field] = value;
        setVertices(updated);
    };

    const clearAll = () => {
        setVertices([{ lat: "", lon: "" }]);
        setZoneName("");
        setZoneType("danger");
    };

    // 🔥 Create Zone (POST)
    const createZone = async () => {
        if (polygon.length < 3) {
            alert("Minimum 3 points required");
            return;
        }

        const newZone = {
            id: zoneName || `zone_${Date.now()}`,
            type: zoneType,
            polygon: polygon,
        };

        try {
            const res = await fetch("http://localhost:5000/zones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newZone),
            });

            await res.json();

            alert("Zone created successfully ✅");

            // 🔥 instantly update UI
            setZones(prev => [...prev, newZone]);

            clearAll();

        } catch (err) {
            console.error(err);
            alert("Error creating zone ❌");
        }
    };

    return (
        <div className="flex min-h-screen bg-[#eff2ff] text-slate-900">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="px-6 py-6">
                    <div className="grid gap-6 xl:grid-cols-[1.9fr_420px]">
                        
                        {/* LEFT: MAP */}
                        <section className="rounded-[32px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] overflow-hidden min-h-[760px]">
                            
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                                        Active Zones
                                    </p>
                                    <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                                        Zone Mapping Console
                                    </h1>
                                </div>
                            </div>

                            <div className="relative mt-6 h-[660px] overflow-hidden rounded-[32px] border border-slate-200 shadow-sm">
                                
                                <MapContainer
                                    center={[12.8219, 80.0441]}
                                    zoom={15}
                                    className="h-full w-full"
                                >
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

                                    {/* 🔥 STORED ZONES */}
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
                                            }}
                                        />
                                    ))}

                                    {/* 🔥 CURRENT DRAWING */}
                                    {polygon.length >= 3 && (
                                        <Polygon
                                            positions={polygon}
                                            pathOptions={{
                                                color: "#2563eb",
                                                fillColor: "#bfdbfe",
                                                fillOpacity: 0.35,
                                                weight: 3,
                                            }}
                                        />
                                    )}
                                </MapContainer>

                                <button className="absolute bottom-6 left-6 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg hover:bg-slate-50">
                                    Reset Zone
                                </button>
                            </div>
                        </section>

                        {/* RIGHT: FORM */}
                        <aside className="rounded-[32px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
                            
                            <div className="mb-6">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    Create New Zone
                                </p>
                                <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                                    Define new safety boundaries
                                </h2>
                            </div>

                            <div className="space-y-5">

                                {/* Zone Name */}
                                <input
                                    type="text"
                                    placeholder="Zone Name"
                                    value={zoneName}
                                    onChange={(e) => setZoneName(e.target.value)}
                                    className="w-full rounded-3xl border px-4 py-3"
                                />

                                {/* Zone Type */}
                                <select
                                    value={zoneType}
                                    onChange={(e) => setZoneType(e.target.value)}
                                    className="w-full rounded-3xl border px-4 py-3"
                                >
                                    <option value="danger">Danger</option>
                                    <option value="restricted">Restricted</option>
                                    <option value="safe">Safe</option>
                                </select>

                                {/* Coordinates */}
                                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                    {vertices.map((vertex, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Lat"
                                                value={vertex.lat}
                                                onChange={(e) =>
                                                    updateVertex(index, "lat", e.target.value)
                                                }
                                                className="w-1/2 border p-2 rounded-lg"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Lon"
                                                value={vertex.lon}
                                                onChange={(e) =>
                                                    updateVertex(index, "lon", e.target.value)
                                                }
                                                className="w-1/2 border p-2 rounded-lg"
                                            />
                                            <button onClick={() => removeVertex(index)}>
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Vertex */}
                                <button
                                    onClick={addVertex}
                                    className="w-full border border-dashed py-2 rounded-xl"
                                >
                                    <FaPlus /> Add Vertex
                                </button>

                                {/* Create */}
                                <button
                                    onClick={createZone}
                                    className="w-full bg-black text-white py-3 rounded-xl"
                                >
                                    Create Zone
                                </button>

                                <button
                                    onClick={clearAll}
                                    className="w-full border py-3 rounded-xl"
                                >
                                    Clear All
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}