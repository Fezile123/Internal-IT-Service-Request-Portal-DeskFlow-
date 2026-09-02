import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';

// ── Icon helpers (inline SVG – no extra dependency needed) ────
const BellIcon = ({ hasUnread }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    {hasUnread && <circle cx="18" cy="6" r="4" fill="#f85149" stroke="#0d1117" strokeWidth="1.5"/>}
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const TicketIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

// ── Type → colour mapping ─────────────────────────────────────
const TYPE_STYLES = {
  ticket_created:  { bg: 'rgba(88,166,255,.12)',  color: '#58a6ff', emoji: '🎫' },
  ticket_updated:  { bg: 'rgba(240,136,62,.12)',  color: '#f0883e', emoji: '🔄' },
  ticket_resolved: { bg: 'rgba(63,185,80,.12)',   color: '#3fb950', emoji: '✅' },
  ticket_assigned: { bg: 'rgba(188,140,255,.12)', color: '#bc8cff', emoji: '👤' },
  new_comment:     { bg: 'rgba(121,192,255,.12)', color: '#79c0ff', emoji: '💬' },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Notification item ─────────────────────────────────────────
function NotifItem({ notif, onRead, onDelete, onNavigate }) {
  const style = TYPE_STYLES[notif.type] || TYPE_STYLES.ticket_updated;

  function handleClick() {
    if (!notif.isRead) onRead(notif.id);
    if (notif.ticketId && onNavigate) onNavigate(notif.ticketId);
  }

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 16px',
        background: notif.isRead ? 'transparent' : 'rgba(31,111,235,.06)',
        borderBottom: '1px solid rgba(48,54,61,.6)',
        cursor: notif.ticketId ? 'pointer' : 'default',
        transition: 'background .15s',
        position: 'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.03)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = notif.isRead ? 'transparent' : 'rgba(31,111,235,.06)'; }}
    >
      {/* Unread indicator */}
      {!notif.isRead && (
        <div style={{
          position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%)',
          width: '5px', height: '5px', borderRadius: '50%', background: '#58a6ff',
        }} />
      )}

      {/* Type icon */}
      <div style={{
        width: '34px', height: '34px', borderRadius: '8px',
        background: style.bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '16px', flexShrink: 0, marginLeft: '6px',
      }}>
        {style.emoji}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '13px', fontWeight: notif.isRead ? 400 : 600,
          color: '#e6edf3', marginBottom: '2px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {notif.title}
        </div>
        <div style={{
          fontSize: '12px', color: '#8b949e', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {notif.message}
        </div>
        <div style={{ fontSize: '11px', color: '#6e7681', marginTop: '4px' }}>
          {timeAgo(notif.createdAt)}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(notif.id); }}
        title="Dismiss"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#6e7681', padding: '4px', borderRadius: '5px',
          display: 'flex', alignItems: 'center', flexShrink: 0,
          transition: 'color .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#f85149'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#6e7681'; }}
      >
        <TrashIcon />
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function NotificationBell({ onNavigateToTicket }) {
  const {
    notifications, unreadCount, loading,
    panelOpen, setPanelOpen,
    markRead, markAllRead,
    deleteNotification, clearAll,
    requestBrowserPermission,
  } = useNotifications();

  const panelRef = useRef(null);
  const btnRef   = useRef(null);

  // Close panel on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (panelOpen &&
          panelRef.current && !panelRef.current.contains(e.target) &&
          btnRef.current   && !btnRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [panelOpen, setPanelOpen]);

  // Request browser permission on first open
  useEffect(() => {
    if (panelOpen) requestBrowserPermission();
  }, [panelOpen]);

  const unread = notifications.filter(n => !n.isRead);
  const read   = notifications.filter(n =>  n.isRead);

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      {/* ── Bell button ─────────────────────────────────────── */}
      <button
        ref={btnRef}
        onClick={() => setPanelOpen(p => !p)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        style={{
          position: 'relative',
          width: '38px', height: '38px',
          borderRadius: '50%', border: 'none',
          background: panelOpen ? 'rgba(88,166,255,.12)' : 'transparent',
          color: '#e6edf3', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .15s',
        }}
        onMouseEnter={e => { if (!panelOpen) e.currentTarget.style.background = 'rgba(255,255,255,.07)'; }}
        onMouseLeave={e => { if (!panelOpen) e.currentTarget.style.background = 'transparent'; }}
      >
        <BellIcon hasUnread={unreadCount > 0} />

        {/* Badge */}
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '4px', right: '4px',
            background: '#f85149', color: '#fff',
            fontSize: '10px', fontWeight: 700,
            minWidth: '16px', height: '16px',
            borderRadius: '8px', padding: '0 4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid #0d1117',
            fontFamily: 'system-ui',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Panel ───────────────────────────────────────────── */}
      {panelOpen && (
        <div
          ref={panelRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '380px',
            maxHeight: '520px',
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '12px',
            boxShadow: '0 16px 48px rgba(0,0,0,.5)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px 12px',
            borderBottom: '1px solid #30363d',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#e6edf3' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span style={{
                  background: 'rgba(88,166,255,.15)', color: '#58a6ff',
                  fontSize: '11px', fontWeight: 700,
                  padding: '1px 7px', borderRadius: '20px',
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  title="Mark all as read"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '5px 9px', borderRadius: '7px',
                    background: 'rgba(63,185,80,.1)', border: '1px solid rgba(63,185,80,.25)',
                    color: '#3fb950', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  <CheckIcon /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  title="Clear all"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '5px 9px', borderRadius: '7px',
                    background: 'rgba(248,81,73,.08)', border: '1px solid rgba(248,81,73,.2)',
                    color: '#f85149', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  <TrashIcon /> Clear all
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading && (
              <div style={{ padding: '32px', textAlign: 'center', color: '#8b949e', fontSize: '13px' }}>
                Loading…
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div style={{
                padding: '48px 24px', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'rgba(48,54,61,.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px',
                }}>🔔</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#e6edf3' }}>All caught up!</div>
                <div style={{ fontSize: '12px', color: '#8b949e' }}>
                  Notifications about your tickets will appear here.
                </div>
              </div>
            )}

            {!loading && unread.length > 0 && (
              <>
                <div style={{
                  padding: '8px 16px 4px', fontSize: '10px', fontWeight: 700,
                  color: '#8b949e', textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  New
                </div>
                {unread.map(n => (
                  <NotifItem
                    key={n.id} notif={n}
                    onRead={markRead}
                    onDelete={deleteNotification}
                    onNavigate={onNavigateToTicket}
                  />
                ))}
              </>
            )}

            {!loading && read.length > 0 && (
              <>
                <div style={{
                  padding: '8px 16px 4px', fontSize: '10px', fontWeight: 700,
                  color: '#8b949e', textTransform: 'uppercase', letterSpacing: '1px',
                  borderTop: unread.length > 0 ? '1px solid #30363d' : 'none',
                  marginTop: unread.length > 0 ? '4px' : 0,
                }}>
                  Earlier
                </div>
                {read.map(n => (
                  <NotifItem
                    key={n.id} notif={n}
                    onRead={markRead}
                    onDelete={deleteNotification}
                    onNavigate={onNavigateToTicket}
                  />
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: '10px 16px', borderTop: '1px solid #30363d',
              textAlign: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: '12px', color: '#8b949e' }}>
                Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
