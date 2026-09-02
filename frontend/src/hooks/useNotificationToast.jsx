import React, { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

const TYPE_STYLES = {
  ticket_created:  { color: '#58a6ff', emoji: '🎫' },
  ticket_updated:  { color: '#f0883e', emoji: '🔄' },
  ticket_resolved: { color: '#3fb950', emoji: '✅' },
  ticket_assigned: { color: '#bc8cff', emoji: '👤' },
  new_comment:     { color: '#79c0ff', emoji: '💬' },
};

function Toast({ notif, onClose }) {
  const style = TYPE_STYLES[notif.type] || TYPE_STYLES.ticket_updated;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        background: '#161b22',
        border: `1px solid ${style.color}40`,
        borderLeft: `3px solid ${style.color}`,
        borderRadius: '10px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        boxShadow: '0 8px 24px rgba(0,0,0,.5)',
        maxWidth: '320px',
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        transition: 'transform .3s cubic-bezier(.25,.46,.45,.94), opacity .3s',
        fontFamily: "'Inter', system-ui, sans-serif",
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: '18px', lineHeight: 1 }}>{style.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#e6edf3', marginBottom: '2px' }}>
          {notif.title}
        </div>
        <div style={{
          fontSize: '12px', color: '#8b949e', lineHeight: 1.4,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {notif.message}
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none', border: 'none', color: '#6e7681',
          cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0, flexShrink: 0,
        }}
      >×</button>
    </div>
  );
}

export function NotificationToastContainer() {
  const [toasts, setToasts] = useState([]);
  const { notifications } = useNotifications();
  const prevCountRef = useRef(0);

  useEffect(() => {
    if (notifications.length > prevCountRef.current) {
      const newest = notifications[0];
      if (newest && !newest.isRead) {
        setToasts(prev => [...prev, { ...newest, _toastId: Date.now() }]);
      }
    }
    prevCountRef.current = notifications.length;
  }, [notifications]);

  const remove = (toastId) => {
    setToasts(prev => prev.filter(t => t._toastId !== toastId));
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 10000,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t._toastId} style={{ pointerEvents: 'all' }}>
          <Toast notif={t} onClose={() => remove(t._toastId)} />
        </div>
      ))}
    </div>
  );
}