"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Bebas_Neue } from "next/font/google";
import { getOne, type Workout } from "@/lib/api";
import { useStore, CAP } from "@/components/store";
import NotFound from "@/app/not-found";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const { plan, addPlan, addSaved } = useStore();
  const [w, setW] = useState<Workout | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    getOne(id)
      .then((d) => {
        setW(d);
        setState("ok");
      })
      .catch(() => setState("error"));
  }, [id]);

  if (state === "error") return <NotFound />;
  if (state === "loading" || !w)
    return (
      <p className="py-24 text-center text-sm font-medium text-[#9ca3af]">
        Loading workout…
      </p>
    );

  const rows = [
    ["EQUIPMENT", w.equipment],
    ["DIFFICULTY", w.difficulty],
    ["SETS", w.sets],
    ["REPS", w.reps],
    ["DURATION", `${w.duration} min`],
    ["CALORIES", `${w.calories} kcal`],
    ["RATING", w.rating],
  ];
  const full = plan.length >= CAP && !plan.some((x) => x.id === w.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        {/* Left: Image */}
        <div className="overflow-hidden rounded-[24px]">
          <img
            src={w.image}
            alt={w.title}
            className="aspect-[4/5] w-full object-cover sm:aspect-square lg:aspect-[4/5]"
          />
        </div>

        {/* Right: Content details */}
        <div className="flex flex-col">
          {/* Workout Title */}
          <h1
            className={`${bebasNeue.className} text-[56px] font-normal uppercase leading-[0.95] tracking-[0.02em] text-white sm:text-[68px]`}
          >
            {w.title}
          </h1>

          {/* Description */}
          <p className="mt-4 text-[14px] leading-relaxed text-[#9ca3af]">
            {w.description}
          </p>

          {/* Category Badges */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            {w.categories.map((c) => (
              <span
                key={c}
                className="rounded-full bg-[#c6ff00] px-4 py-1 text-[13px] font-bold text-black"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Specs / Info Table */}
          <div className="mt-8 rounded-2xl border border-[#23272f]/80 bg-[#14171d] px-6 py-2">
            <dl className="divide-y divide-[#23272f]/80">
              {rows.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between py-3.5 text-[13px]"
                >
                  <dt className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#9ca3af]">
                    {k}
                  </dt>
                  <dd className="font-semibold text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Instructions Heading */}
          <h2
            className={`${bebasNeue.className} mt-8 text-[32px] font-normal uppercase tracking-[0.02em] text-white`}
          >
            INSTRUCTIONS
          </h2>

          {/* Instructions List */}
          <ol className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-[#9ca3af]">
            {w.instructions.map((s, i) => (
              <li key={i}>
                <span className="font-medium">{i + 1}. </span>
                {s}
              </li>
            ))}
          </ol>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              disabled={full}
              onClick={() => addPlan(w)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#c6ff00] px-6 py-3 text-[13px] font-black uppercase text-black transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              <svg
                className="h-4 w-4 fill-current stroke-current"
                viewBox="0 0 24 24"
                strokeWidth="1"
              >
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
              Add to today&apos;s plan
            </button>

            <button
              onClick={() => addSaved(w)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#2e353f] bg-transparent px-6 py-3 text-[13px] font-bold text-white transition-colors hover:border-[#c6ff00]/60 active:scale-[0.98]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Save for later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}