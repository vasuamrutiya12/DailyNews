export default function NewsTicker({ items, onItemClick }) {
  if (!items || items.length === 0) return null;

  // Duplicate items for seamless looping
  const doubled = [...items, ...items];

  return (
    <div className="ticker-strip">
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="ticker-item"
            onClick={() => onItemClick?.(item)}
          >
            <span className="ticker-flash">⚡</span>
            <span className="ticker-headline">{item.headline}</span>
            <span className="ticker-category">— {item.category}</span>
            <span className="ticker-separator">···</span>
          </span>
        ))}
      </div>
    </div>
  );
}
