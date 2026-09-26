import type { Workout } from "@/lib/api";

export const Stats = ({ w }: { w: Workout }) => (
  <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium text-zinc-300">
    <span>⏱ {w.duration} min</span>
    <span>🔥 {w.calories} kcal</span>
    <span>⭐ {w.rating}</span>
  </div>
);
