import { FileUp, RefreshCw, ChartColumn, PiggyBank, TrendingUp, ShieldAlert, Receipt, ShoppingCart, MessageSquare } from "lucide-react";
import { money, categories, expenseCategories } from "../utils/format";

export default function Dashboard({ vm }) {
  const { summary, budgets, category, setCategory, limit, setLimit, submitBudget, busy } = vm;
  return (
    <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Monthly income", summary?.income_paisa, "text-teal-300"],
              ["Monthly expenses", summary?.expenses_paisa, "text-orange-300"],
              ["Carried-in balance", summary?.opening_balance_paisa, "text-slate-200"],
              ["Balance through month", summary?.balance_paisa, "text-slate-100"],
              ["Pending bills reserved", summary?.unpaid_bills_paisa, "text-amber-300"],
              ["Spendable after bills", summary?.spendable_paisa, "text-teal-300"],
            ].map(([title, paisa, color]) => <div className="rounded-xl border border-slate-800 bg-slate-900 p-5" key={title}>
              <p className="text-sm text-slate-400">{title}</p><p className={`mt-2 text-2xl font-bold ${color}`}>{paisa == null ? "—" : money(paisa)}</p>
            </div>)}
          </div>
          <p className="mt-2 text-xs text-slate-500">Balance includes earlier recorded transactions and the configured opening balance. Pending bills are reserved through the selected month's end; this is not a reconstructed historical statement.</p>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="flex items-center gap-2 text-xl font-semibold"><ChartColumn size={20}/> Category spending</h3>
              <div className="mt-4 space-y-3">
                {Object.entries(summary?.category_expenses_paisa || {}).map(([name, paisa]) => {
                  const max = Math.max(...Object.values(summary?.category_expenses_paisa || {}), 1);
                  return <div key={name}><div className="flex justify-between gap-3 text-sm"><span>{name}</span><span>{money(paisa)}</span></div><div className="mt-1 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-teal-400" style={{ width: `${paisa / max * 100}%` }}/></div></div>;
                })}
                {!Object.keys(summary?.category_expenses_paisa || {}).length && <p className="text-sm text-slate-400">No expenses for this month.</p>}
              </div>
            </section>
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="flex items-center gap-2 text-xl font-semibold"><PiggyBank size={20}/> Set category budget</h3>
              <form className="mt-4 space-y-3" onSubmit={submitBudget}>
                <label className="block text-sm">Category<select aria-label="Budget category" className="mt-1 block w-full rounded bg-slate-800 p-2" value={category} onChange={e => setCategory(e.target.value)}>{expenseCategories.map(c => <option key={c}>{c}</option>)}</select></label>
                <label className="block text-sm">Monthly limit (BDT)<input aria-label="Budget limit BDT" required inputMode="decimal" placeholder="e.g. 5000.00" className="mt-1 block w-full rounded bg-slate-800 p-2" value={limit} onChange={e => setLimit(e.target.value)}/></label>
                <button disabled={busy} className="rounded bg-teal-600 px-5 py-2 font-semibold text-white disabled:opacity-50" type="submit">Save budget</button>
                <p className="text-xs text-slate-400">Enter 0 to indicate no active budget for that category.</p>
              </form>
            </section>
          </div>
          <section className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-xl font-semibold">Budget utilization</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">{budgets.map(b => <div key={b.id} className="rounded-lg border border-slate-700 p-4">
              <div className="flex justify-between gap-3"><strong>{b.category}</strong><span className={b.status === "over_budget" ? "text-red-300" : "text-teal-300"}>{b.status.replaceAll("_", " ")}</span></div>
              <p className="mt-2 text-sm text-slate-300">Spent {money(b.spent_paisa)} / limit {money(b.limit_paisa)}</p>
              <p className="mt-1 text-xs text-slate-400">{b.utilization_percent === null ? "No budget percentage (zero limit)" : `${b.utilization_percent}% used`} · Remaining {money(b.remaining_paisa)}</p>
              <div className="mt-2 h-2 rounded-full bg-slate-800"><div className={`h-2 rounded-full ${b.status === "over_budget" ? "bg-red-400" : "bg-teal-400"}`} style={{width:`${Math.min(b.utilization_percent || 0, 100)}%`}}/></div>
            </div>)}{!budgets.length && <p className="text-sm text-slate-400">No budgets set for this month yet.</p>}</div>
          </section>
    </>
  );
}
