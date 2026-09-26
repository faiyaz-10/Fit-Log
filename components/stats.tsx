import type { Workout } from "@/lib/api";

export const Stats = ({ w, size = "sm" }: { w: Workout; size?: "sm" | "md" }) => (
  <div
    className={`flex flex-wrap items-center font-display font-normal ${size === "md"
        ? "gap-4 text-[12px] text-[#b0b7c3]"
        : "gap-3 text-[9px] text-[#858b96]"
      }`}
  >
    <span>⏱ {w.duration} min</span>
    <span>🔥 {w.calories} kcal</span>
    <span>⭐ {w.rating}</span>
  </div>
);
