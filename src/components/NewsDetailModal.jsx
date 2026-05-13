import { useState, useEffect } from "react";
import { X, ExternalLink, Loader, RefreshCw, AlertCircle } from "lucide-react";
import { fetchArticleDetail } from "../utils/claudeApi";

export default function NewsDetailModal({ article, apiKey, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sentimentLabels = {
    positive: { text: "Positive", color: "#52D48A" },
    neutral: { text: "Neutral", color: "#6B6B78" },
    negative: { text: "Negative", color: "#F87171" },
  };

  const loadDetail = () => {
    if (!article || !apiKey) return;
    setLoading(true);
    setError(null);
    fetchArticleDetail(apiKey, article.title, article.url)
      .then((data) => {
        if (data && (data.extendedSummary || data.keyPoints)) {
          setDetail(data);
        } else {
          setError("empty");
        }
      })
      .catch((err) => {
        if (err.message === "RATE_LIMIT") {
          setError("rate_limit");
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDetail();
  }, [article, apiKey]); // eslint-disable-line

  // ESC key handler
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!article) return null;

  const sentiment = sentimentLabels[article.sentiment] || sentimentLabels.neutral;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} id="detail-modal-close">
          <X size={20} />
        </button>

        <div className="detail-header">
          <h2 className="detail-title">{article.title}</h2>
          <div className="detail-meta">
            <span className="meta-source">{article.source}</span>
            <span className="meta-dot">·</span>
            <span className="meta-time">{article.publishedAt}</span>
            {article.readTime && (
              <>
                <span className="meta-dot">·</span>
                <span className="meta-readtime">{article.readTime}</span>
              </>
            )}
            <span
              className="sentiment-badge"
              style={{ background: `${sentiment.color}20`, color: sentiment.color, borderColor: `${sentiment.color}40` }}
            >
              {sentiment.text}
            </span>
          </div>
        </div>

        {/* Always show the basic summary from the card */}
        {article.summary && (
          <div className="detail-basic-summary">
            <p>{article.summary}</p>
          </div>
        )}

        {loading ? (
          <div className="detail-loading">
            <Loader size={28} className="spinner" />
            <p>Groq is analyzing this story…</p>
          </div>
        ) : error ? (
          <div className="detail-error">
            <AlertCircle size={24} />
            {error === "rate_limit" ? (
              <p>Rate limited — Groq's free tier has strict limits. Wait 30 seconds and retry.</p>
            ) : error === "empty" ? (
              <p>Couldn't generate a detailed analysis for this story.</p>
            ) : (
              <p>Error: {error}</p>
            )}
            <button className="detail-retry-btn" onClick={loadDetail}>
              <RefreshCw size={14} />
              Retry Analysis
            </button>
          </div>
        ) : detail ? (
          <div className="detail-body">
            <div className="detail-summary">
              {detail.extendedSummary?.split("\n").filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {detail.keyPoints?.length > 0 && (
              <div className="detail-section">
                <h3>Key Points</h3>
                <ul className="detail-keypoints">
                  {detail.keyPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {detail.expertQuote && (
              <blockquote className="detail-quote">
                <p>"{detail.expertQuote.quote}"</p>
                <cite>— {detail.expertQuote.source}</cite>
              </blockquote>
            )}

            {detail.relatedStories?.length > 0 && (
              <div className="detail-section">
                <h3>Related Stories</h3>
                <div className="detail-related">
                  {detail.relatedStories.map((story, i) => (
                    <a
                      key={i}
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="related-card"
                    >
                      <span className="related-title">{story.title}</span>
                      <span className="related-source">{story.source}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="detail-original-link"
          >
            <ExternalLink size={16} />
            Open Original Article
          </a>
        )}
      </div>
    </div>
  );
}
