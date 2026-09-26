import type { Workout } from "@/lib/api";

export const Stats = ({ w }: { w: Workout }) => (
  <div className="flex flex-wrap items-center gap-3 font-display text-[9px] font-normal text-[#858b96]">
    <span>⏱ {w.duration} min</span>
    <span>🔥 {w.calories} kcal</span>
    <span>⭐ {w.rating}</span>
  </div>
);
