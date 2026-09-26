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
      {/* Hero Section */}
      <section className="mt-6 grid items-center gap-8 rounded-3xl border border-[#23272f]/60 bg-[#14171d] px-8 py-12 sm:px-12 md:grid-cols-[1.15fr_0.85fr] lg:px-16 lg:py-16">
        <div className="flex flex-col items-start">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.25em] text-[#c6ff00]">
            WORKOUT LIBRARY
          </p>
          
          <h1 className="mt-4 max-w-145 font-sans text-5xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-[3.75rem] lg:leading-[0.95]">
            Train with intent. Log every set.
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
            className="h-auto max-h-115 w-full max-w-105 object-contain"
          />
        </div>
      </section>

      {/* Library Section */}
      <section id="library" className="mt-16 scroll-mt-6">
        <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
          The Library
        </h2>
        <p className="mt-2 text-[14px] font-medium text-[#9ca3af]">
          Twelve lifts covering every major muscle group.
        </p>

        {loading && (
          <div className="flex justify-center py-20" aria-label="Loading">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#23272f] border-t-[#c6ff00]" />
          </div>
        )}
        {err && <p className="py-10 text-center text-red-400">{err}</p>}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((w) => (
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
                className="aspect-video w-full object-cover"
              />
              <div className="space-y-2.5 p-5">
                <div className="flex flex-wrap gap-1.5">
                  {w.categories.map((c) => (
                    <span key={c} className="pill">
                      {c}
                    </span>
                  ))}
                </div>
                <h3 className="font-sans text-[1.15rem] font-black uppercase leading-tight tracking-tight text-white">
                  {w.title}
                </h3>
                <p className="text-[12px] font-medium text-[#9ca3af]">{w.equipment}</p>
                <div className="border-t border-[#23272f] pt-3">
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