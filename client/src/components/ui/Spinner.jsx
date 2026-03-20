export default function Spinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };
  return (
    <div
      className={`${sizes[size]} rounded-full border-2 border-violet-600/30 border-t-violet-500 animate-spin`}
    />
  );
}
