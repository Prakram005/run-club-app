import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check } from "lucide-react";
import * as api from "../../utils/api";

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setExpanded(!expanded)}
        className="relative p-2.5 text-red-400 hover:text-red-300 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell size={20} className="stroke-2" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold shadow-red-glow-sm"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 max-h-96 rounded-xl border border-red-600/40 bg-gradient-to-br from-red-950/30 to-black/60 backdrop-blur-xl z-50 overflow-hidden flex flex-col shadow-red-glow-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-red-600/30 px-4 py-3 bg-black/40">
                <div>
                  <p className="text-sm font-bold text-red-400">Notifications</p>
                  {unreadCount > 0 && (
                    <p className="text-xs text-gray-400">{unreadCount} unread</p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <motion.button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition"
                    whileHover={{ scale: 1.05 }}
                  >
                    Mark all
                  </motion.button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto space-y-2 p-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8 text-gray-400">
                    <p className="text-sm">Loading...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-gray-400">
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={`rounded-lg p-3 transition-all ${
                        notification.read
                          ? "bg-black/30"
                          : "bg-red-600/20 border-l-2 border-red-600 shadow-red-glow-sm"
                      } hover:bg-red-600/25`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <motion.button
                              onClick={() => markAsRead(notification._id)}
                              className="text-red-400 hover:text-red-300 transition"
                              whileHover={{ scale: 1.1 }}
                            >
                              <Check size={14} />
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => deleteNotification(notification._id)}
                            className="text-gray-500 hover:text-gray-400 transition"
                            whileHover={{ scale: 1.1 }}
                          >
                            <X size={14} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
