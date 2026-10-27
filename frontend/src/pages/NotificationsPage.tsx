import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ShieldAlert,
  ArrowRight,
  CheckCheck
} from 'lucide-react';
import api from '../services/api';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      const data = res.data?.data || res.data || [];
      setNotifications(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id || n.notificationId === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // Fallback
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Fallback
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL':
      case 'HIGH':
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'URGENT':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-red-400" />
            <span>Notification & Dispatch Center</span>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h2>
          <p className="text-sm text-white/50">
            Emergency broadcasts, blood request status changes, and transfusion certifications
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all w-fit"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-white/10 text-white/50 space-y-3">
          <Bell className="w-12 h-12 mx-auto text-white/20" />
          <p className="text-base font-semibold text-white/70">No notifications at this time.</p>
          <p className="text-xs">You're completely up to date with all alerts and match dispatches.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const timeAgo = notif.createdAt
              ? new Date(notif.createdAt).toLocaleString()
              : 'Recently';

            return (
              <div
                key={notif._id || notif.notificationId}
                className={`p-5 rounded-2xl glass-card border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  notif.isRead
                    ? 'border-white/5 bg-white/[0.02] opacity-75'
                    : 'border-red-500/30 bg-red-950/10 shadow-lg shadow-red-950/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                    {getUrgencyIcon(notif.urgency)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-white">{notif.title}</h4>
                      <Badge
                        variant={
                          notif.urgency === 'CRITICAL'
                            ? 'red'
                            : notif.urgency === 'URGENT'
                            ? 'yellow'
                            : 'blue'
                        }
                        size="sm"
                      >
                        {notif.type || notif.urgency || 'INFO'}
                      </Badge>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed max-w-2xl">
                      {notif.message}
                    </p>
                    <span className="text-[11px] text-white/40 flex items-center gap-1 pt-1">
                      <Clock className="w-3 h-3" /> {timeAgo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!notif.isRead && (
                    <button
                      onClick={() => markAsRead(notif._id || notif.notificationId)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-medium transition-all"
                    >
                      Mark Read
                    </button>
                  )}
                  {notif.actionLink && (
                    <Link
                      to={notif.actionLink}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
