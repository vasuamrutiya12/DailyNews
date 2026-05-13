import PlaceholderImage from "./PlaceholderImage";
import { ExternalLink } from "lucide-react";

export default function NewsCard({ article, categoryColor, index, onClick }) {
  if (!article) return null;

  const sentimentColors = {
    positive: "#52D48A",
    neutral: "#6B6B78",
    negative: "#F87171",
  };

  return (
    <article
      className="news-card"
      onClick={() => onClick?.(article)}
      id={`news-card-${index}`}
    >
      <div className="news-card-image">
        <PlaceholderImage
          categoryColor={categoryColor}
          keyword={article.imageKeyword}
          index={index}
        />
      </div>
      <div className="news-card-content">
        <h3 className="news-card-title">{article.title}</h3>
        <p className="news-card-summary">{article.summary}</p>
        <div className="news-card-footer">
          <div className="news-card-meta">
            <span
              className="sentiment-dot"
              style={{ background: sentimentColors[article.sentiment] || sentimentColors.neutral }}
            />
            <span className="meta-source">{article.source}</span>
            <span className="meta-dot">·</span>
            <span className="meta-time">{article.publishedAt}</span>
          </div>
          <span className="news-card-readmore">
            <ExternalLink size={12} />
          </span>
        </div>
      </div>
    </article>
  );
}
