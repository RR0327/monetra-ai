import { FileUp, RefreshCw, ChartColumn, PiggyBank, TrendingUp, ShieldAlert, Receipt, ShoppingCart, MessageSquare } from "lucide-react";
import { money, categories, expenseCategories } from "../utils/format";

export default function Forecast({ vm }) {
  const { forecast, purchaseAmount, setPurchaseAmount, purchaseCategory, setPurchaseCategory, simulation, busy, runSimulation } = vm;
  return (
    <>
          <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5" aria-label="Spending forecast and financial risk">
            <h3 className="flex items-center gap-2 text-xl font-semibold"><TrendingUp size={20}/> Month-end spending forecast</h3>
            {!forecast ? <p className="mt-3 text-slate-400">Loading forecast...</p> : <>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div><p className="text-sm text-slate-400">Expenses through cutoff</p><p className="mt-1 text-xl font-semibold">{money(forecast.recorded_expenses_paisa)}</p></div>
                <div><p className="text-sm text-slate-400">Projected month-end expenses</p><p className="mt-1 text-xl font-semibold">{forecast.projected_month_end_expenses_paisa == null ? "Not available" : money(forecast.projected_month_end_expenses_paisa)}</p></div>
                <div><p className="text-sm text-slate-400">Estimated remaining expenses</p><p className="mt-1 text-xl font-semibold">{forecast.estimated_remaining_expenses_paisa == null ? "Not available" : money(forecast.estimated_remaining_expenses_paisa)}</p></div>
                <div><p className="flex items-center gap-2 text-sm text-slate-400"><ShieldAlert size={16}/> Financial risk</p><p className={`mt-1 text-xl font-semibold ${forecast.risk_level === "high" ? "text-red-300" : forecast.risk_level === "medium" ? "text-amber-300" : "text-teal-300"}`}>{forecast.risk_level.toUpperCase()}</p></div>
              </div>
              <p className="mt-4 text-sm text-slate-300">{forecast.warning}</p>
              <p className="mt-2 text-xs text-slate-400">Status: {forecast.status.replaceAll("_", " ")} · Confidence: {forecast.confidence} · {forecast.elapsed_days}/{forecast.days_in_month} calendar days · Cutoff: {forecast.cutoff_date || "Not yet started"}</p>
              <p className="mt-2 text-xs text-slate-400">Available funds: {money(forecast.available_funds_paisa)} · Pending bills reserved: {money(forecast.unpaid_bills_paisa)} · Projected obligations: {forecast.projected_obligations_paisa == null ? "Not available" : money(forecast.projected_obligations_paisa)}{forecast.risk_ratio_percent == null ? "" : ` · Obligations/funds: ${forecast.risk_ratio_percent}%`}</p>
              <details className="mt-3 text-sm text-slate-400"><summary className="cursor-pointer">View calculation assumptions</summary><ul className="mt-2 list-disc space-y-1 pl-5">{forecast.assumptions.map(text => <li key={text}>{text}</li>)}</ul></details>
            </>}
          </section>
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5" aria-label="Purchase simulation">
              <h3 className="flex items-center gap-2 text-xl font-semibold"><ShoppingCart size={20}/> What-if purchase simulator</h3>
              <p className="mt-2 text-sm text-slate-400">Preview a planned purchase without saving a transaction.</p>
              <form className="mt-4 space-y-3" onSubmit={runSimulation}>
                <label className="block text-sm">Purchase amount (BDT)<input required aria-label="Purchase amount BDT" inputMode="decimal" value={purchaseAmount} onChange={e=>setPurchaseAmount(e.target.value)} placeholder="e.g. 2500.00" className="mt-1 w-full rounded bg-slate-800 p-2"/></label>
                <label className="block text-sm">Category<select aria-label="Purchase category" value={purchaseCategory} onChange={e=>setPurchaseCategory(e.target.value)} className="mt-1 w-full rounded bg-slate-800 p-2">{expenseCategories.map(c=><option key={c}>{c}</option>)}</select></label>
                <button disabled={busy} className="rounded bg-teal-600 px-5 py-2 font-semibold disabled:opacity-50">Simulate purchase</button>
              </form>
              {simulation && <div className="mt-4 space-y-2 rounded-lg border border-slate-700 p-4 text-sm" role="status">
                <p>Balance after purchase: <strong>{money(simulation.balance_after_purchase_paisa)}</strong></p>
                <p>Spendable after reserved bills: <strong>{money(simulation.spendable_after_bills_paisa)}</strong></p>
                <p>After estimated remaining expenses: <strong>{simulation.spendable_after_essentials_paisa == null ? "Unavailable" : money(simulation.spendable_after_essentials_paisa)}</strong></p>
                <p>Risk: <strong>{simulation.risk_level_before.toUpperCase()} → {simulation.risk_level_after.toUpperCase()}</strong></p>
                <p className="text-amber-300">{simulation.warning}</p>
                <details className="text-slate-400"><summary className="cursor-pointer">Simulation assumptions</summary><ul className="list-disc pl-5">{simulation.assumptions.map(a=><li key={a}>{a}</li>)}</ul></details>
              </div>}
            </section>
    </>
  );
}
