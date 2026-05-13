import { useState, useEffect } from "react";
import { Settings, RefreshCw, Newspaper } from "lucide-react";
import { formatTime, formatDate } from "../utils/formatters";

export default function Navbar({ onOpenSettings, onGlobalRefresh }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <Newspaper size={24} className="navbar-icon" />
          <div className="navbar-title-group">
            <h1 className="navbar-title">The Grok Chronicle</h1>
            <span className="navbar-subtitle">AI-Powered News</span>
          </div>
        </div>

        <div className="navbar-center">
          <div className="navbar-clock">
            <span className="clock-time">{formatTime(time)}</span>
            <span className="clock-date">{formatDate(time)}</span>
          </div>
        </div>

        <div className="navbar-actions">
          <button
            className="nav-btn"
            onClick={onGlobalRefresh}
            title="Refresh all"
            id="global-refresh-btn"
          >
            <RefreshCw size={18} />
          </button>
          <button
            className="nav-btn"
            onClick={onOpenSettings}
            title="Settings"
            id="settings-btn"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
