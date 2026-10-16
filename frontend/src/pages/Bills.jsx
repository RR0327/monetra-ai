import { FileUp, RefreshCw, ChartColumn, PiggyBank, TrendingUp, ShieldAlert, Receipt, ShoppingCart, MessageSquare } from "lucide-react";
import { money, categories, expenseCategories } from "../utils/format";

export default function Bills({ vm }) {
  const { billTitle, setBillTitle, billDue, setBillDue, billAmount, setBillAmount, addBill, bills, busy, payBill } = vm;
  return (
    <>
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5" aria-label="Upcoming bills">
              <h3 className="flex items-center gap-2 text-xl font-semibold"><Receipt size={20}/> Bills and reservations</h3>
              <p className="mt-2 text-sm text-slate-400">Pending bills due through the selected month are included in your spendable balance.</p>
              <form onSubmit={addBill} className="mt-4 grid gap-3">
                <label className="text-sm">Bill title<input aria-label="Bill title" required maxLength={200} value={billTitle} onChange={e=>setBillTitle(e.target.value)} className="mt-1 w-full rounded bg-slate-800 p-2"/></label>
                <label className="text-sm">Due date<input aria-label="Bill due date" required type="date" value={billDue} onChange={e=>setBillDue(e.target.value)} className="mt-1 w-full rounded bg-slate-800 p-2"/></label>
                <label className="text-sm">Amount (BDT)<input aria-label="Bill amount BDT" required inputMode="decimal" value={billAmount} onChange={e=>setBillAmount(e.target.value)} className="mt-1 w-full rounded bg-slate-800 p-2"/></label>
                <button disabled={busy} className="w-fit rounded bg-teal-600 px-5 py-2 font-semibold disabled:opacity-50">Add bill</button>
              </form>
              <div className="mt-5 max-h-64 space-y-3 overflow-y-auto">
                {bills.map(b=><div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-700 p-3 text-sm">
                  <div><strong>{b.title}</strong><p className="text-slate-400">{b.due_date} · {money(b.amount_paisa)} · {b.status}</p></div>
                  {b.status === "pending" && <button disabled={busy} onClick={()=>payBill(b.id)} className="rounded border border-teal-700 px-3 py-1 text-teal-300 disabled:opacity-50">Mark paid</button>}
                </div>)}
                {!bills.length && <p className="text-sm text-slate-400">No bills yet.</p>}
              </div>
              <p className="mt-3 text-xs text-amber-200">Marking paid only removes the reservation; it does not record a payment transaction. Import the corresponding expense once to keep your balance accurate.</p>
            </section>
    </>
  );
}
