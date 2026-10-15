import { useEffect, useState } from "react";
import { Activity, ShieldCheck, Wallet } from "lucide-react";
import { getHealth } from "./services/api";

export default function App() {
  const [health, setHealth] = useState({ status: "checking" });

  useEffect(() => {
    let active = true;
    getHealth()
      .then(({ data }) => active && setHealth({ status: "connected", data }))
      .catch(() => active && setHealth({ status: "offline" }));
    return () => { active = false; };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex items-center gap-3 border-b border-slate-800 pb-6">
          <span className="rounded-xl bg-teal-400/15 p-3 text-teal-300"><Wallet size={28} /></span>
          <div><h1 className="text-2xl font-semibold tracking-tight">Monetra AI</h1>
          <p className="text-sm text-slate-400">Your explainable personal finance copilot</p></div>
        </header>
        <section className="py-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-500/40 px-3 py-1 text-xs text-teal-300">
            <ShieldCheck size={14} /> Hackathon MVP · Foundation stage
          </div>
          <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">Understand your money. Make more informed decisions.</h2>
          <p className="mt-5 max-w-2xl text-slate-400">We are building transaction insights, budgets, forecasts, risk alerts, and grounded AI explanations. These features will be added incrementally.</p>
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-3"><Activity className="text-teal-300"/><h3 className="font-semibold">Backend connection</h3></div>
            <p className="mt-3 text-slate-300" role="status">
              {health.status === "connected" ? `Connected — ${health.data.project} API v${health.data.version}` :
               health.status === "offline" ? "Backend unavailable. Start FastAPI on port 8000." : "Checking backend..."}
            </p>
            <p className="mt-2 text-sm text-slate-500">Check API docs at http://127.0.0.1:8000/docs</p>
          </div>
        </section>
        <footer className="border-t border-slate-800 pt-6 text-sm text-slate-500">Synthetic data only · Educational prototype · Not financial advice</footer>
      </div>
    </main>
  );
}
