import { useState, useEffect } from "react";
import { Calendar, MapPin, ChevronRight, Loader, X } from "lucide-react";
import { fetchEvents, fetchEventDetails } from "../utils/claudeApi";

function EventDetailModal({ event, detail, loading, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal event-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} id="event-detail-close">
          <X size={20} />
        </button>

        <div className="detail-header">
          <h2 className="detail-title">
            {event.emoji} {event.title}
          </h2>
          <div className="detail-meta">
            <span className="meta-source">{event.date}</span>
            <span className="meta-dot">·</span>
            <span className="meta-time">{event.location}</span>
          </div>
        </div>

        {loading ? (
          <div className="detail-loading">
            <Loader size={28} className="spinner" />
            <p>Fetching event details…</p>
          </div>
        ) : detail ? (
          <div className="detail-body">
            <div className="detail-summary">
              <p>{detail.fullDescription}</p>
            </div>
            {detail.significance && (
              <div className="detail-section">
                <h3>Significance</h3>
                <p>{detail.significance}</p>
              </div>
            )}
            {detail.relatedLinks?.length > 0 && (
              <div className="detail-section">
                <h3>Related Links</h3>
                <div className="detail-related">
                  {detail.relatedLinks.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="related-card">
                      <span className="related-title">{link.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="detail-loading">
            <p>Could not load event details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPanel({ apiKey }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetail, setEventDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!apiKey) return;
    setLoading(true);
    fetchEvents(apiKey)
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiKey]);

  const handleEventClick = async (event) => {
    setSelectedEvent(event);
    setDetailLoading(true);
    try {
      const detail = await fetchEventDetails(apiKey, event.title);
      setEventDetail(detail);
    } catch {
      setEventDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedEvent(null);
    setEventDetail(null);
  };

  return (
    <>
      <aside className="events-panel" id="events-panel">
        <h3 className="events-title">
          <Calendar size={16} />
          Upcoming Events
        </h3>

        {loading ? (
          <div className="events-loading">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="event-skeleton shimmer" key={i} />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="events-list">
            {events.map((event, i) => (
              <div
                key={i}
                className="event-card"
                onClick={() => handleEventClick(event)}
                id={`event-card-${i}`}
              >
                <div className="event-header">
                  <span className="event-emoji">{event.emoji}</span>
                  <span className="event-title-text">{event.title}</span>
                </div>
                <div className="event-info">
                  <span className="event-date-badge">{event.date}</span>
                  <span className="event-location">
                    <MapPin size={10} />
                    {event.location}
                  </span>
                </div>
                <p className="event-desc">{event.shortDescription}</p>
                <span className="event-details-link">
                  Details <ChevronRight size={12} />
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="events-empty">No upcoming events found.</p>
        )}
      </aside>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          detail={eventDetail}
          loading={detailLoading}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
}
