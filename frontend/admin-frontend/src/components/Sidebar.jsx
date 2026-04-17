import {
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaBell,
  FaLayerGroup,
  FaCog,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/",
    },
    {
      name: "Live Tracking",
      icon: <FaMapMarkerAlt />,
      path: "/tracking",
    },
    {
      name: "Alerts",
      icon: <FaBell />,
      path: "/alerts",
    },
    {
      name: "Zones",
      icon: <FaLayerGroup />,
      path: "/zones",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];

  return (
    <aside className="w-72 bg-white shadow-xl flex flex-col justify-between border-r border-slate-200">
      
      <div className="p-6">
        
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white text-xl font-semibold">
            G
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Guardian Lens
            </h2>
            <p className="text-sm text-slate-500">
              Safety Control
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.icon}
                <span className={isActive ? "font-semibold" : ""}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-6 text-slate-500 text-sm border-t border-slate-200">
        Support
      </div>
    </aside>
  );
}