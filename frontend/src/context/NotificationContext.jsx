import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

const NotificationContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function NotificationProvider({ children, user }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);
  const [panelOpen, setPanelOpen]         = useState(false);
  const eventSourceRef                    = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/notifications?limit=30`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {
      console.error('fetchNotifications:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const connectSSE = useCallback(() => {
    if (!user || eventSourceRef.current) return;

    const token = localStorage.getItem('deskflow_token') || '';
    const url   = `${API_BASE}/api/notifications/stream?token=${token}`;

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.type === 'CONNECTED') return;
        if (payload.type === 'NEW_NOTIFICATION') {
          const notif = payload.notification;
          setNotifications(prev => [notif, ...prev]);
          setUnreadCount(prev => prev + 1);
          showBrowserNotification(notif);
        }
      } catch {}
    };

    es.onerror = () => {
      es.close();
      eventSourceRef.current = null;
      setTimeout(connectSSE, 5000);
    };
  }, [user]);

  const disconnectSSE = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      connectSSE();
    } else {
      disconnectSSE();
      setNotifications([]);
      setUnreadCount(0);
    }
    return disconnectSSE;
  }, [user]);

  const markRead = useCallback(async (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      console.error('markRead error:', e);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await fetch(`${API_BASE}/api/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      console.error('markAllRead error:', e);
    }
  }, []);

  const deleteNotification = useCallback(async (id) => {
    const notif = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notif && !notif.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await fetch(`${API_BASE}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      console.error('deleteNotification error:', e);
    }
  }, [notifications]);

  const clearAll = useCallback(async () => {
    setNotifications([]);
    setUnreadCount(0);
    try {
      await fetch(`${API_BASE}/api/notifications/clear-all`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      console.error('clearAll error:', e);
    }
  }, []);

  const requestBrowserPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      panelOpen,
      setPanelOpen,
      markRead,
      markAllRead,
      deleteNotification,
      clearAll,
      fetchNotifications,
      requestBrowserPermission,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}

function getAuthHeaders() {
  const token = localStorage.getItem('deskflow_token');
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

function showBrowserNotification(notif) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notif.title, {
      body: notif.message,
      icon: '/favicon.ico',
      tag: notif.id,
    });
  }
}