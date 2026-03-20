import Spinner from './Spinner';

const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-violet-600 hover:bg-violet-700 text-white focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0f1117]',
  secondary: 'bg-[#22263a] hover:bg-[#2d3148] border border-[#2d3148] text-slate-300 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-[#0f1117]',
  danger: 'bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#0f1117]',
  ghost: 'hover:bg-white/5 text-slate-400 hover:text-slate-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
