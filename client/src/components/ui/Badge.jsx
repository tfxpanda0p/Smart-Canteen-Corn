const variants = {
  PENDING: 'bg-amber-400/15 text-amber-400 border-amber-400/30',
  CONFIRMED: 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30',
  CANCELLED: 'bg-red-400/15 text-red-400 border-red-400/30',
  available: 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30',
  unavailable: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  admin: 'bg-violet-400/15 text-violet-400 border-violet-400/30',
  user: 'bg-blue-400/15 text-blue-400 border-blue-400/30',
};

export default function Badge({ label, pulse = false }) {
  const cls = variants[label] || 'bg-slate-400/15 text-slate-400 border-slate-400/30';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {label}
    </span>
  );
}
