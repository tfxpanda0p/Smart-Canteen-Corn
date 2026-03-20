export function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-4 bg-[#2d3148] rounded w-3/4 mb-3" />
      <div className="h-3 bg-[#2d3148] rounded w-1/2 mb-2" />
      <div className="h-3 bg-[#2d3148] rounded w-1/3" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-[#2d3148]">
      {[1, 2, 3, 4].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-[#2d3148] rounded w-4/5" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonStat() {
  return (
    <div className="stat-card animate-pulse">
      <div className="h-8 w-8 bg-[#2d3148] rounded-lg mb-2" />
      <div className="h-7 bg-[#2d3148] rounded w-1/3 mb-1" />
      <div className="h-3 bg-[#2d3148] rounded w-1/2" />
    </div>
  );
}
