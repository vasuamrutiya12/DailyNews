import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import CategoryTabs from "./components/CategoryTabs";
import NewsTicker from "./components/NewsTicker";
import HeroCard from "./components/HeroCard";
import NewsCard from "./components/NewsCard";
import EventsPanel from "./components/EventsPanel";
import NewsDetailModal from "./components/NewsDetailModal";
import SettingsDrawer from "./components/SettingsDrawer";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { useNewsData } from "./hooks/useNewsData";
import { useTicker } from "./hooks/useTicker";
import { CATEGORIES } from "./utils/categories";
import { AlertTriangle, Clock } from "lucide-react";

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("claude_news_api_key") || "");
  const [settingsOpen, setSettingsOpen] = useState(!apiKey);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const { articles, loading, error, lastUpdated, loadCategory, clearAllCache } = useNewsData(apiKey);
  const ticker = useTicker(apiKey);

  // Load initial category
  useEffect(() => {
    if (apiKey) {
      loadCategory(activeCategory);
    }
  }, [apiKey]); // eslint-disable-line

  const handleCategorySelect = useCallback(
    (cat) => {
      setActiveCategory(cat);
      loadCategory(cat);
    },
    [loadCategory]
  );

  const handleRefresh = useCallback(() => {
    loadCategory(activeCategory, true);
  }, [loadCategory, activeCategory]);

  const handleGlobalRefresh = useCallback(() => {
    clearAllCache();
    loadCategory(activeCategory, true);
    ticker.refresh();
  }, [clearAllCache, loadCategory, activeCategory, ticker]);

  const handleSaveApiKey = useCallback(
    (key, remember) => {
      setApiKey(key);
      if (remember && key) {
        localStorage.setItem("claude_news_api_key", key);
      } else {
        localStorage.removeItem("claude_news_api_key");
      }
      setSettingsOpen(false);
    },
    []
  );

  const handleTickerItemClick = useCallback((item) => {
    setSelectedArticle({
      title: item.headline,
      url: item.url,
      source: item.category,
      publishedAt: "Just now",
      readTime: "2 min read",
      sentiment: "neutral",
    });
  }, []);

  const heroArticle = articles?.[0] || null;
  const gridArticles = articles?.slice(1) || [];

  return (
    <div className="app" style={{ "--active-color": activeCategory.color }}>
      <Navbar
        onOpenSettings={() => setSettingsOpen(true)}
        onGlobalRefresh={handleGlobalRefresh}
      />

      <SettingsDrawer
        isOpen={settingsOpen}
        onClose={() => apiKey && setSettingsOpen(false)}
        apiKey={apiKey}
        onSave={handleSaveApiKey}
      />

      {apiKey && (
        <>
          <CategoryTabs
            activeCategory={activeCategory.id}
            onSelect={handleCategorySelect}
            onRefresh={handleRefresh}
            lastUpdated={lastUpdated}
          />

          <NewsTicker items={ticker.items} onItemClick={handleTickerItemClick} />

          <main className="main-layout">
            <div className="content-area">
              {loading ? (
                <LoadingSkeleton />
              ) : error ? (
                <div className="error-card">
                  {error === "rate_limit" ? (
                    <>
                      <Clock size={32} className="error-icon" />
                      <h3>Slow down!</h3>
                      <p>Groq is thinking… retry in 30 seconds.</p>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={32} className="error-icon" />
                      <h3>Couldn't fetch news</h3>
                      <p>{error}</p>
                    </>
                  )}
                  <button className="error-retry-btn" onClick={handleRefresh}>
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <HeroCard
                    article={heroArticle}
                    categoryColor={activeCategory.color}
                    onClick={setSelectedArticle}
                  />
                  <div className="news-grid">
                    {gridArticles.map((article, i) => (
                      <NewsCard
                        key={i}
                        article={article}
                        categoryColor={activeCategory.color}
                        index={i + 1}
                        onClick={setSelectedArticle}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <EventsPanel apiKey={apiKey} />
          </main>

          {selectedArticle && (
            <NewsDetailModal
              article={selectedArticle}
              apiKey={apiKey}
              onClose={() => setSelectedArticle(null)}
            />
          )}
        </>
      )}

      {!apiKey && !settingsOpen && (
        <div className="no-key-message">
          <h2>Welcome to The Grok Chronicle</h2>
          <p>Enter your Groq API key to get started.</p>
          <button onClick={() => setSettingsOpen(true)} className="hero-read-btn">
            Open Settings →
          </button>
        </div>
      )}
    </div>
  );
}
