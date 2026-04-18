import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function EventCountdown({ eventDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const eventTime = new Date(eventDate);
      const difference = eventTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [eventDate]);

  if (timeLeft.isOver) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-lg bg-red-500/10 p-4 text-center text-red-400"
      >
        <p className="text-sm font-semibold">Event is live or has ended!</p>
      </motion.div>
    );
  }

  const TimeUnit = ({ label, value }) => (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 10 }}
        className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-500"
      >
        <span className="text-xl font-bold text-black">{String(value).padStart(2, "0")}</span>
      </motion.div>
      <span className="text-xs uppercase tracking-widest text-zinc-400">{label}</span>
    </div>
  );

  return (
    <div className="rounded-lg bg-zinc-900/50 p-4">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Time Until Event
      </p>
      <div className="flex justify-center gap-2">
        {timeLeft.days > 0 && <TimeUnit label="Days" value={timeLeft.days} />}
        <TimeUnit label="Hours" value={timeLeft.hours} />
        <TimeUnit label="Mins" value={timeLeft.minutes} />
        <TimeUnit label="Secs" value={timeLeft.seconds} />
      </div>
    </div>
  );
}
