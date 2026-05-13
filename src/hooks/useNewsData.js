import { useState, useRef, useCallback } from "react";
import { fetchCategoryNews } from "../utils/claudeApi";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useNewsData(apiKey) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const cacheRef = useRef({});

  const loadCategory = useCallback(
    async (category, forceRefresh = false) => {
      if (!apiKey) {
        setError("No API key provided");
        return;
      }

      const cacheKey = category.id;
      const cached = cacheRef.current[cacheKey];

      if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setArticles(cached.data);
        setLastUpdated(cached.timestamp);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchCategoryNews(apiKey, category.query, category.label);
        cacheRef.current[cacheKey] = { data, timestamp: Date.now() };
        setArticles(data);
        setLastUpdated(Date.now());
      } catch (err) {
        if (err.message === "RATE_LIMIT") {
          setError("rate_limit");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  const clearAllCache = useCallback(() => {
    cacheRef.current = {};
  }, []);

  return { articles, loading, error, lastUpdated, loadCategory, clearAllCache };
}
