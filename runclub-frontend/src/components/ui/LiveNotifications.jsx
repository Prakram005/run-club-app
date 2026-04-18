import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";

export default function LiveNotifications() {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for various events
    socket.on("event:participant-joined", (data) => {
      addNotification({
        type: "success",
        title: "New Participant",
        message: `${data.userName} joined the event!`,
        icon: CheckCircle
      });
    });

    socket.on("event:started", (data) => {
      addNotification({
        type: "info",
        title: "Event Started",
        message: `${data.eventName} has started!`,
        icon: Bell
      });
    });

    socket.on("event:updated", (data) => {
      addNotification({
        type: "info",
        title: "Event Updated",
        message: data.message,
        icon: Info
      });
    });

    socket.on("event:error", (data) => {
      addNotification({
        type: "error",
        title: "Alert",
        message: data.message,
        icon: AlertCircle
      });
    });

    return () => {
      socket.off("event:participant-joined");
      socket.off("event:started");
      socket.off("event:updated");
      socket.off("event:error");
    };
  }, [socket]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const getColors = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500/10 border-green-500/30 text-green-100";
      case "error":
        return "bg-red-500/10 border-red-500/30 text-red-100";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-100";
      default:
        return "bg-blue-500/10 border-blue-500/30 text-blue-100";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 max-w-sm pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => {
          const Icon = notif.icon;
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20, x: 400 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: 400 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 rounded-lg border p-4 ${getColors(notif.type)} pointer-events-auto`}
            >
              <Icon size={18} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{notif.title}</p>
                <p className="text-xs mt-1 opacity-90">{notif.message}</p>
              </div>
              <button
                onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
                className="flex-shrink-0 opacity-50 hover:opacity-100"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
