import { useState } from "react";

export default function PlaceholderImage({ categoryColor, keyword, index = 0, large = false }) {
  const [imgError, setImgError] = useState(false);
  const hex = categoryColor || "#E8C547";
  const hue = parseInt(hex.slice(1), 16) % 360;
  const offset = (index * 37) % 60;

  // Use picsum.photos with a seed based on keyword for consistent beautiful images
  const seed = encodeURIComponent((keyword || "news") + index);
  const width = large ? 800 : 400;
  const height = large ? 500 : 280;
  const imgUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;

  if (imgError) {
    return (
      <div
        className={`placeholder-img ${large ? "placeholder-img-large" : ""}`}
        style={{
          background: `linear-gradient(135deg, hsl(${hue + offset}, 40%, 15%) 0%, hsl(${(hue + 40 + offset) % 360}, 30%, 8%) 100%)`,
        }}
      >
        <span className="placeholder-keyword" style={{ color: hex }}>
          {keyword?.toUpperCase() || "NEWS"}
        </span>
      </div>
    );
  }

  return (
    <div className={`placeholder-img ${large ? "placeholder-img-large" : ""}`}>
      <img
        src={imgUrl}
        alt={keyword || "News"}
        className="placeholder-real-img"
        loading="lazy"
        onError={() => setImgError(true)}
      />
      <div className="placeholder-overlay" style={{
        background: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)`,
      }} />
      {keyword && (
        <span className="placeholder-badge" style={{ background: hex }}>
          {keyword}
        </span>
      )}
    </div>
  );
}
