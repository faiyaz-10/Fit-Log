"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Workout } from "@/lib/api";

type StoreT = {
  plan: Workout[];
  saved: Workout[];
  done: string[];
  ready: boolean;
  addPlan: (w: Workout) => void;
  addSaved: (w: Workout) => void;
  remove: (kind: "plan" | "saved", w: Workout) => void;
  markDone: (w: Workout) => void;
};
const Ctx = createContext<StoreT | null>(null);
export const useStore = () => useContext(Ctx) as StoreT;
export const CAP = 5;

export default function Store({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("success");

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("fitlog") || "{}");
        const data = stored && typeof stored === "object" ? stored : {};
        setPlan(Array.isArray(data.plan) ? data.plan : []);
        setSaved(Array.isArray(data.saved) ? data.saved : []);
        setDone(
          Array.isArray(data.done)
            ? data.done.filter((id: unknown): id is string => typeof id === "string")
            : [],
        );
      } catch {
        setPlan([]);
        setSaved([]);
        setDone([]);
      }
      setReady(true);
    });
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    if (ready)
      localStorage.setItem("fitlog", JSON.stringify({ plan, saved, done }));
  }, [plan, saved, done, ready]);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 2200);
    return () => clearTimeout(t);
  }, [msg]);

  const say = (m: string, type: "success" | "error" = "success") => {
    setMsg("");
    setTimeout(() => {
      setMsgType(type);
      setMsg(m);
    }, 10);
  };

  const addPlan = (w: Workout) => {
    if (plan.some((x) => x.id === w.id))
      return say("Already added to plan", "error");
    if (plan.length >= CAP) return say("Today's plan is full");
    setPlan((current) => [...current, w]);
    setDone((current) => current.filter((id) => id !== w.id));
    say("Added to today's plan");
  };
  const addSaved = (w: Workout) => {
    if (saved.some((x) => x.id === w.id)) return say("Already saved");
    setSaved((current) => [...current, w]);
    say("Saved for later");
  };
  const remove = (kind: "plan" | "saved", w: Workout) => {
    if (kind === "plan") {
      setPlan((current) => current.filter((x) => x.id !== w.id));
      setDone((current) => current.filter((id) => id !== w.id));
      say("Workout removed from today's plan");
    } else {
      setSaved((current) => current.filter((x) => x.id !== w.id));
      say("Removed from saved");
    }
  };
  const markDone = (w: Workout) => {
    if (done.includes(w.id)) return;
    setDone((current) => (current.includes(w.id) ? current : [...current, w.id]));
    say("Workout marked as done");
  };

  return (
    <Ctx.Provider
      value={{ plan, saved, done, ready, addPlan, addSaved, remove, markDone }}
    >
      {children}
      {msg && (
        <div
          role="status"
          className={`fixed top-6 right-6 z-50 inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold shadow-xl ${msgType === "error"
            ? "border border-red-400/70 bg-red-500 text-white"
            : "border border-[#c6ff00] bg-[#c6ff00] text-black shadow-[0_8px_30px_rgba(198,255,0,0.28)]"
            }`}
        >
          {msgType === "error" && (
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          )}
          {msg}
        </div>
      )}
    </Ctx.Provider>
  );
}
