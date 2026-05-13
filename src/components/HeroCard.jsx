import PlaceholderImage from "./PlaceholderImage";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function HeroCard({ article, categoryColor, onClick }) {
  if (!article) return null;

  const sentimentConfig = {
    positive: { color: "#52D48A", Icon: TrendingUp, label: "Positive" },
    neutral: { color: "#6B6B78", Icon: Minus, label: "Neutral" },
    negative: { color: "#F87171", Icon: TrendingDown, label: "Negative" },
  };

  const sentiment = sentimentConfig[article.sentiment] || sentimentConfig.neutral;

  return (
    <article className="hero-card" onClick={() => onClick?.(article)} id="hero-card">
      <div className="hero-card-image">
        <PlaceholderImage
          categoryColor={categoryColor}
          keyword={article.imageKeyword}
          index={0}
          large
        />
        <div className="hero-card-badge">
          <span className="badge-featured">⚡ Featured</span>
        </div>
      </div>
      <div className="hero-card-content">
        <div className="hero-sentiment-badge" style={{
          background: `${sentiment.color}18`,
          color: sentiment.color,
          borderColor: `${sentiment.color}40`
        }}>
          <sentiment.Icon size={12} />
          {sentiment.label}
        </div>
        <h2 className="hero-card-title">{article.title}</h2>
        <p className="hero-card-summary">{article.summary}</p>
        <div className="hero-card-meta">
          <span className="meta-source">{article.source}</span>
          <span className="meta-dot">·</span>
          <span className="meta-time">{article.publishedAt}</span>
          <span className="meta-dot">·</span>
          <span className="meta-readtime">{article.readTime}</span>
        </div>
        <button className="hero-read-btn" style={{ "--cat-color": categoryColor }}>
          Read Full Story
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}
