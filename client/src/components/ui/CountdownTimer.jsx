import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

function getTimeLeft(expiresAt) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { m, s, total: diff };
}

export default function CountdownTimer({ expiresAt }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!timeLeft) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-red-400">
        <Timer size={14} />
        Expired
      </span>
    );
  }

  const { m, s, total } = timeLeft;
  const urgent = total < 2 * 60 * 1000; // < 2 min

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-mono font-semibold ${
        urgent ? 'text-red-400 animate-pulse' : 'text-amber-400'
      }`}
    >
      <Timer size={14} />
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
}
