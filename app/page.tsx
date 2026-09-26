"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAll, type Workout } from "@/lib/api";
import { Stats } from "@/components/stats";
import Image from "next/image";
import logoImg from "../assets/banner.png";

export default function Home() {
  const [items, setItems] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    getAll()
      .then(setItems)
      .catch(() => setErr("Could not load workouts. Try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="mt-8 grid items-center gap-8 rounded-[18px] border border-[#2b3338] bg-[#0d1013] p-6 sm:p-8 md:grid-cols-[1.2fr_0.8fr] md:py-10">
        <div>
          <p className="text-[11px] font-bold tracking-[0.22em] text-[#b8f52d]">
            WORKOUT LIBRARY
          </p>
          <h1 className="mt-3 max-w-[560px] font-display text-[clamp(2.5rem,4vw,5rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em] text-white">
            Train with intent. Log every set.
          </h1>
          <p className="mt-4 max-w-md text-[14px] leading-6 text-zinc-400">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into todays plan, and watch the weeks work add up.
          </p>
          <a href="#library" className="btn btn-primary mt-6">
            BROWSE WORKOUTS ↓
          </a>
        </div>
        <Image
          src={logoImg}
          alt="Workout illustration"
          priority
          className="mx-auto h-auto max-h-[320px] w-full max-w-[360px] object-contain"
        />
      </section>

      <section id="library" className="mt-14 scroll-mt-6">
        <h2 className="font-display text-[2rem] font-bold uppercase tracking-[-0.04em] text-white">
          The Library
        </h2>
        <p className="mt-1 text-[12px] text-zinc-400">
          Twelve lifts covering every major muscle group.
        </p>

        {loading && (
          <div className="flex justify-center py-20" aria-label="Loading">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-accent" />
          </div>
        )}
        {err && <p className="py-10 text-center text-red-400">{err}</p>}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((w) => (
            <Link
              key={w.id}
              href={`/workout/${w.id}`}
              className="group overflow-hidden rounded-xl border border-[#2b3035] bg-[#12171b] transition hover:border-[#b8f52d]/60"
            >
              <Image
                src={w.image}
                alt={w.title}
                width={740}
                height={416}
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="space-y-2 p-4">
                <div className="flex flex-wrap gap-1.5">
                  {w.categories.map((c) => (
                    <span key={c} className="pill">
                      {c}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-[1.15rem] font-bold uppercase leading-none tracking-[0.02em] text-white">
                  {w.title}
                </h3>
                <p className="text-[11px] text-zinc-400">{w.equipment}</p>
                <div className="border-t border-[#2a3036] pt-3">
                  <Stats w={w} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
