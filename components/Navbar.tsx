"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/components/store";
import logoImg from "../assets/logo.png";

export default function Navbar(): React.JSX.Element {
  const pathname = usePathname();
  const { plan, saved } = useStore();
  const onPlan = pathname === "/my-plan";

  const active =
    "bg-[#1f2e05] text-[#a3e635] px-4 sm:px-5 py-1.5 rounded-full font-medium text-[12px] tracking-[0.08em] uppercase transition-all";
  const idle =
    "text-zinc-400 hover:text-white px-3 sm:px-4 py-1.5 text-[12px] tracking-[0.08em] uppercase font-medium transition-all";

  return (
    <header className="w-full border-b border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-white sm:px-6">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logoImg}
            alt="FITLOG Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="hidden text-xl font-extrabold tracking-[0.1em] sm:inline">
            FITLOG
          </span>
        </Link>

        <div className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/60 p-1 sm:gap-4">
          <Link href="/" className={onPlan ? idle : active}>
            Workouts
          </Link>
          <Link href="/my-plan" className={onPlan ? active : idle}>
            My Plan
          </Link>
        </div>

        <Link
          href="/my-plan"
          className="flex items-center gap-4 text-[12px] font-medium sm:gap-6"
        >
          <span className="flex items-center gap-2">
            <span className="text-zinc-300">Plan</span>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#a3e635] px-1.5 text-[11px] font-bold text-black">
              {plan.length}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span className="text-zinc-300">Saved</span>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full border border-zinc-700 px-1.5 text-[11px] font-bold text-zinc-300">
              {saved.length}
            </span>
          </span>
        </Link>
      </nav>
    </header>
  );
}
