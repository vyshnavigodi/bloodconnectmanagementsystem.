import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import api from '../../services/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  type?: 'EMERGENCY' | 'INFO' | 'SUCCESS' | 'WARNING';
  isRead: boolean;
  createdAt: string;
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
      }
    } catch {
      // Mock fallback notifications if backend route is empty/mock
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Emergency Blood Need',
          message: 'Urgent O- blood requested at City General Hospital.',
          type: 'EMERGENCY',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Donation Eligibility',
          message: 'You are now eligible for your next whole blood donation.',
          type: 'SUCCESS',
          isRead: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
    } catch {
      // Ignore error for offline/demo
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const markOneAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      // Ignore
    }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case 'EMERGENCY':
        return <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />;
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors border border-white/10"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-lg ring-2 ring-navy-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-card bg-navy-800/95 border border-white/15 shadow-2xl p-4 z-50 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-white">Notifications</h4>
              {unreadCount > 0 && (
                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-white/40 py-6">No notifications yet</p>
            ) : (
              notifications.map((n: any) => {
                const notifId = n.id || n._id || n.notificationId;
                return (
                  <div
                    key={notifId}
                    onClick={() => !n.isRead && markOneAsRead(notifId)}
                    className={`p-3 rounded-xl transition-all cursor-pointer border ${
                    n.isRead
                      ? 'bg-white/5 border-transparent opacity-60'
                      : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/15'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {getIcon(n.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white leading-tight">{n.title}</p>
                      <p className="text-xs text-white/70 mt-1 leading-normal line-clamp-2">{n.message}</p>
                      <div className="flex items-center gap-1 text-[10px] text-white/40 mt-2">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
