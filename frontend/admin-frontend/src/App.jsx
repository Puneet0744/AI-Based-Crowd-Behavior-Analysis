import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AlertsPage from "./pages/AlertsPage";
import ZonesPage from "./pages/ZonesPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/zones" element={<ZonesPage />} />
      </Routes>
    </Router>
  );
}