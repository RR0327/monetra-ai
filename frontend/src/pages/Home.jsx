import { ArrowRight, BarChart3, ShieldCheck, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="rounded-xl bg-teal-400/15 p-3 text-teal-300"><Wallet size={25} /></span>
          <span className="text-xl font-bold">Monetra AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">Log in</Link>
          <Link to="/register" className="rounded-lg bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-300">Get started</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:items-center lg:pt-24">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">Your money, made clearer</p>
          <h1 className="max-w-2xl text-5xl font-bold leading-tight sm:text-6xl">Make confident decisions with every taka.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">Monetra AI brings your transactions, budgets, bills, and forecasts into one private financial workspace.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-teal-400 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-300">Create your account <ArrowRight size={18} /></Link>
            <Link to="/login" className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:border-teal-400 hover:text-teal-300">I already have an account</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-teal-950/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div><p className="text-sm text-slate-400">Financial overview</p><p className="mt-1 text-3xl font-bold">৳ 84,250</p></div>
            <span className="rounded-xl bg-teal-400/15 p-3 text-teal-300"><BarChart3 size={25} /></span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-800 p-4"><p className="text-sm text-slate-400">Monthly budget</p><p className="mt-2 text-xl font-semibold text-teal-300">On track</p></div>
            <div className="rounded-xl bg-slate-800 p-4"><p className="text-sm text-slate-400">Upcoming bills</p><p className="mt-2 text-xl font-semibold">৳ 12,400</p></div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-teal-400/20 bg-teal-400/5 p-4 text-sm text-slate-300"><ShieldCheck size={20} className="text-teal-300" /> Your financial records stay separated in your private account.</div>
        </div>
      </section>

      <section className="border-t border-slate-900 bg-slate-900/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 md:grid-cols-3">
          {[
            ["Track everything", "Import transactions and understand where your money goes."],
            ["Plan ahead", "Set budgets and keep upcoming bills visible before they are due."],
            ["Decide with clarity", "Use forecasts and read-only simulations to explore your options."],
          ].map(([title, description]) => <div key={title}><h2 className="font-semibold text-teal-300">{title}</h2><p className="mt-2 leading-7 text-slate-400">{description}</p></div>)}
        </div>
      </section>
      <footer className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-500">Copyright © 2026 Tech_Innovators. · MIT License · Educational prototype</footer>
    </main>
  );
}
