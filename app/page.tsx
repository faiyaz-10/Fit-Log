"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bebas_Neue } from "next/font/google";
import { getAll, type Workout } from "@/lib/api";
import { Stats } from "@/components/stats";
import Image from "next/image";
import logoImg from "../assets/banner.png";

type SortOption = "Duration" | "Calories" | "Rating";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const [items, setItems] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("Duration");

  useEffect(() => {
    getAll()
      .then(setItems)
      .catch(() => setErr("Could not load workouts. Try again."))
      .finally(() => setLoading(false));
  }, []);

  const visibleItems = items
    .filter((w) => {
      const query = search.trim().toLowerCase();
      return (
        !query ||
        w.title.toLowerCase().includes(query) ||
        w.categories.some((category) => category.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      if (sort === "Calories") return a.calories - b.calories;
      if (sort === "Rating") return b.rating - a.rating;
      return a.duration - b.duration;
    });

  return (
    <>
      {/* Hero Section */}
      <section className="mt-6 grid items-center gap-8 rounded-[24px] border border-[#23272f]/60 bg-[#14171d] px-8 py-12 sm:px-12 md:grid-cols-[1.15fr_0.85fr] lg:px-16 lg:py-16">
        <div className="flex flex-col items-start">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.25em] text-[#c6ff00]">
            WORKOUT LIBRARY
          </p>

          <h1
            className={`${bebasNeue.className} mt-4 max-w-[580px] text-5xl font-normal uppercase leading-[0.9] tracking-[0.02em] text-white sm:text-6xl lg:text-[3.75rem]`}
          >
            <span className="block lg:whitespace-nowrap">TRAIN WITH INTENT. LOG</span>
            <span className="block">EVERY SET.</span>
          </h1>

          <p className="mt-6 max-w-lg text-[15px] font-normal leading-relaxed text-[#9ca3af]">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          <a
            href="#library"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#c6ff00] px-7 py-3 text-[13px] font-extrabold uppercase tracking-wide text-black transition-all hover:brightness-110 active:scale-[0.98]"
          >
            BROWSE WORKOUTS
          </a>
        </div>

        <div className="flex items-center justify-center">
          <Image
            src={logoImg}
            alt="Workout illustration"
            priority
            className="h-auto max-h-[460px] w-full max-w-[420px] object-contain"
          />
        </div>
      </section>

      {/* Library Section */}
      <section id="library" className="mt-16 scroll-mt-6 pb-16">
        <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
          The Library
        </h2>
        <p className="mt-2 text-[14px] font-medium text-[#9ca3af]">
          Twelve lifts covering every major muscle group.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="sr-only" htmlFor="workout-search">
            Search workouts
          </label>
          <input
            id="workout-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search workouts or muscle groups"
            className="w-full rounded-xl border border-[#23272f] bg-[#14171d] px-4 py-2.5 text-[13px] text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#c6ff00] sm:max-w-sm"
          />
          <div className="flex items-center gap-3">
            <label htmlFor="workout-sort" className="text-[13px] font-medium text-[#9ca3af]">
              Sort By
            </label>
            <div className="relative">
              <select
                id="workout-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="appearance-none rounded-xl border border-[#23272f] bg-[#14171d] py-2 pl-4 pr-9 text-[13px] font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#c6ff00]"
              >
                <option>Duration</option>
                <option>Calories</option>
                <option>Rating</option>
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

        {loading && (
          <div className="flex justify-center py-20" aria-label="Loading">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#23272f] border-t-[#c6ff00]" />
          </div>
        )}
        {err && <p className="py-10 text-center text-red-400">{err}</p>}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((w) => (
            <Link
              key={w.id}
              href={`/workout/${w.id}`}
              className="group overflow-hidden rounded-2xl border border-[#23272f] bg-[#14171d] transition duration-200 hover:border-[#c6ff00]/60"
            >
              <Image
                src={w.image}
                alt={w.title}
                width={700}
                height={400}
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="space-y-2.5 p-5">
                <div className="flex flex-wrap gap-1.5">
                  {w.categories.map((c) => (
                    <span key={c} className="pill">
                      {c}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-[14px] font-bold uppercase leading-tight tracking-[0.02em] text-white">
                  {w.title}
                </h3>
                <p className="font-display text-[10px] font-normal text-[#8f96a3]">{w.equipment}</p>
                <div className="border-t border-[#23272f] pt-3">
                  <Stats w={w} />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {!loading && !err && visibleItems.length === 0 && (
          <p className="py-16 text-center text-sm font-medium text-[#9ca3af]">
            No workouts match your search.
          </p>
        )}
      </section>
    </>
  );
}