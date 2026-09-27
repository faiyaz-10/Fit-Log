"use client";

import Link from "next/link";
import { useState } from "react";
import { Bebas_Neue } from "next/font/google";
import { useStore } from "@/components/store";
import type { Workout } from "@/lib/api";
import { Stats } from "@/components/stats";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

type Tab = "plan" | "saved";

const sorters: Record<string, (a: Workout, b: Workout) => number> = {
  Duration: (a, b) => a.duration - b.duration,
  Calories: (a, b) => a.calories - b.calories,
  Rating: (a, b) => b.rating - a.rating,
};

export default function MyPlan() {
  const { plan, saved, done, ready, remove, markDone } = useStore();
  const [tab, setTab] = useState<Tab>("plan");
  const [sort, setSort] = useState("Duration");
  const [search, setSearch] = useState("");

  const list = [...(tab === "plan" ? plan : saved)]
    .filter((w) => {
      const query = search.trim().toLowerCase();
      return (
        !query ||
        w.title.toLowerCase().includes(query) ||
        w.categories.some((category) => category.toLowerCase().includes(query))
      );
    })
    .sort(sorters[sort]);
    const sum = (k: "duration" | "calories") =>
    plan.reduce((s, w) => s + w[k], 0);

  const tabBtn = (id: Tab, label: string) => (
    <button
      onClick={() => setTab(id)}
      className={`rounded-lg px-5 py-2 text-[13px] font-bold transition-colors ${tab === id
          ? "bg-[#1c222b] text-white shadow-sm"
          : "text-[#9ca3af] hover:text-white"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <h1
        className={`${bebasNeue.className} text-[56px] font-normal uppercase leading-none tracking-[0.02em] text-white sm:text-[68px]`}
      >
        MY PLAN
      </h1>
      <p className="mt-2 text-[14px] text-[#9ca3af]">
        Cap of five lifts for today. Finish them, then load more.
      </p>

      {/* Top Stats Overview Card */}
      <div className="mt-8 grid grid-cols-3 divide-x divide-[#23272f]/80 rounded-[22px] border border-[#23272f]/80 bg-[#14171d] px-8 py-7 sm:px-12 sm:py-8">
        {(
          [
            ["Exercises", plan.length, true],
            ["Minutes", sum("duration"), false],
            ["Calories", sum("calories"), false],
          ] as [string, number, boolean][]
        ).map(([label, val, isAccent]) => (
          <div key={label} className="px-6 first:pl-0 last:pr-0 sm:px-10">
            <p className="text-[13px] font-medium text-[#9ca3af]">{label}</p>
            <p
              className={`${bebasNeue.className} mt-2 text-[48px] font-normal leading-none sm:text-[64px] ${isAccent ? "text-[#c6ff00]" : "text-white"
                }`}
            >
              {val}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs & Sort Controls */}
      <div className="mt-10 flex items-center justify-between gap-4">
        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl border border-[#23272f] bg-[#0f1318] p-1.5">
          {tabBtn("plan", "Today's Plan")}
          {tabBtn("saved", "Saved")}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <label className="sr-only" htmlFor="plan-search">
            Search workouts
          </label>
          <input
            id="plan-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search workouts"
            className="w-full rounded-xl border border-[#23272f] bg-[#14171d] px-4 py-2 text-[13px] text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#c6ff00] sm:w-48"
          />
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium text-[#9ca3af]">Sort By</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-xl border border-[#23272f] bg-[#14171d] py-2 pl-4 pr-9 text-[13px] font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#c6ff00]"
              >
                {Object.keys(sorters).map((s) => (
                  <option key={s} value={s} className="bg-[#14171d] text-white">
                    {s}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ca3af]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!ready ? (
        <p className="py-20 text-center text-sm font-medium text-[#9ca3af]">
          Loading workouts…
        </p>
      ) : list.length === 0 ? (
        /* Empty State */
        <div className="mt-6 flex min-h-[380px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#23272f] bg-[#0f1318]/50 px-6 py-20 text-center">
          <h2
            className={`${bebasNeue.className} text-[38px] font-normal uppercase tracking-[0.02em] text-white sm:text-[44px]`}
          >
            NOTHING HERE YET
          </h2>
          <p className="mt-2 text-[14px] text-[#9ca3af]">
            {search ? "No workouts match your search." : "Browse the library and add a lift to get today moving."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#c6ff00] px-7 py-3 text-[13px] font-black uppercase text-black transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Go to workouts
          </Link>
        </div>
      ) : (
        /* Workout List */
        <ul className="mt-6 space-y-4">
          {list.map((w) => {
            const isDone = tab === "plan" && done.includes(w.id);
            return (
              <li
                key={w.id}
                className={`flex flex-col gap-5 rounded-[20px] border border-[#23272f]/80 bg-[#14171d] p-5 sm:flex-row sm:items-center sm:p-6 ${isDone ? "opacity-60" : ""
                  }`}
              >
                <img
                  src={w.image}
                  alt={w.title}
                  className="h-20 w-full rounded-xl object-cover sm:h-24 sm:w-36"
                />

                <div className="flex-1 min-w-0">
                  <h3
                    className={`${bebasNeue.className} text-[24px] font-normal uppercase leading-tight tracking-[0.02em] text-white`}
                  >
                    {w.title}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-[#9ca3af]">{w.equipment}</p>
                  <div className="mt-2">
                    <Stats w={w} size="md" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/workout/${w.id}`}
                    className="inline-flex items-center justify-center rounded-xl border border-[#2e353f] bg-transparent px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:border-[#c6ff00]/60 active:scale-[0.98]"
                  >
                    View Details
                  </Link>

                  {tab === "plan" && (
                    <button
                      disabled={isDone}
                      onClick={() => markDone(w)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#c6ff00] px-5 py-2.5 text-[13px] font-black uppercase text-black transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                    >
                      <svg
                        className="h-4 w-4 stroke-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {isDone ? "Done" : "Mark as Done"}
                    </button>
                  )}

                  <button
                    aria-label="Remove"
                    onClick={() => remove(tab, w)}
                    className="p-1.5 text-zinc-500 transition-colors hover:text-white"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}