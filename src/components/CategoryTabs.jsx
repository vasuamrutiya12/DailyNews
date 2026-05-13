import { RefreshCw } from "lucide-react";
import { CATEGORIES } from "../utils/categories";
import { timeAgo } from "../utils/formatters";

export default function CategoryTabs({ activeCategory, onSelect, onRefresh, lastUpdated }) {
  return (
    <div className="category-tabs-wrapper">
      <div className="category-tabs">
        <div className="category-tabs-inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`category-tab-${cat.id}`}
              className={`category-tab ${activeCategory === cat.id ? "active" : ""}`}
              style={{
                "--cat-color": cat.color,
              }}
              onClick={() => onSelect(cat)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="category-meta">
          {lastUpdated && (
            <span className="last-updated">
              Updated {timeAgo(lastUpdated)}
            </span>
          )}
          <button className="refresh-btn" onClick={onRefresh} title="Refresh this category" id="category-refresh-btn">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
