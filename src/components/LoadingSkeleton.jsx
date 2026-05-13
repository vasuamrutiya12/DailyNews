export default function LoadingSkeleton() {
  return (
    <div className="skeleton-wrapper">
      {/* Hero skeleton */}
      <div className="skeleton-hero">
        <div className="skeleton-image shimmer" />
        <div className="skeleton-content">
          <div className="skeleton-line skeleton-title shimmer" />
          <div className="skeleton-line skeleton-text shimmer" />
          <div className="skeleton-line skeleton-text skeleton-short shimmer" />
          <div className="skeleton-line skeleton-meta shimmer" />
        </div>
      </div>

      {/* Grid skeletons */}
      <div className="skeleton-grid">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton-card-image shimmer" />
            <div className="skeleton-card-content">
              <div className="skeleton-line skeleton-card-title shimmer" />
              <div className="skeleton-line skeleton-card-text shimmer" />
              <div className="skeleton-line skeleton-card-meta shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
