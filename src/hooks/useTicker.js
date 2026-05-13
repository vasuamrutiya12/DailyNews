import { useState, useEffect, useCallback, useRef } from "react";
import { fetchTickerNews } from "../utils/claudeApi";

export function useTicker(apiKey) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const load = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const data = await fetchTickerNews(apiKey);
      if (Array.isArray(data) && data.length > 0) {
        setItems(data);
      }
    } catch {
      // silently fail — ticker is non-critical
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiKey) {
      load();
      intervalRef.current = setInterval(load, 10 * 60 * 1000); // refresh every 10 min
    }
    return () => clearInterval(intervalRef.current);
  }, [apiKey, load]);

  return { items, loading, refresh: load };
}
