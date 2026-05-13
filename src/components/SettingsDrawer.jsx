import { useState } from "react";
import { Key, X, Shield } from "lucide-react";

export default function SettingsDrawer({ isOpen, onClose, apiKey, onSave }) {
  const [key, setKey] = useState(apiKey || "");
  const [remember, setRemember] = useState(true);

  const handleSave = () => {
    if (!key.trim()) return;
    onSave(key.trim(), remember);
  };

  const handleClear = () => {
    setKey("");
    localStorage.removeItem("claude_news_api_key");
    onSave("", false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-drawer" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} id="settings-close">
          <X size={20} />
        </button>

        <div className="settings-header">
          <div className="settings-icon-wrap">
            <Key size={32} className="settings-key-icon" />
          </div>
          <h2 className="settings-title">Connect to Groq</h2>
          <p className="settings-desc">
            Enter your Groq API key to start reading AI-summarized news.
            Your key is used directly in the browser and never sent to any server.
          </p>
        </div>

        <div className="settings-form">
          <label className="settings-label" htmlFor="api-key-input">API Key</label>
          <input
            id="api-key-input"
            type="password"
            className="settings-input"
            placeholder="gsk_..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />

          <label className="settings-checkbox-label">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember this key in localStorage</span>
          </label>

          <div className="settings-security">
            <Shield size={14} />
            <span>Your key never leaves your browser.</span>
          </div>

          <button
            className="settings-save-btn"
            onClick={handleSave}
            disabled={!key.trim()}
            id="settings-save-btn"
          >
            Start Reading →
          </button>

          {apiKey && (
            <button className="settings-clear-btn" onClick={handleClear} id="settings-clear-btn">
              Clear Saved Key
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
