import { useEffect, useState } from "react";
import { Activity, FileUp, RefreshCw, Wallet, ChartColumn, PiggyBank } from "lucide-react";
import { getHealth, importTransactions, getTransactions, changeCategory, getSummary, getBudgets, saveBudget } from "./services/api";

const categories = ["Income", "Food", "Transport", "Shopping", "Utilities", "Rent", "Health", "Education", "Other"];
const expenseCategories = categories.filter(category => category !== "Income");
const money = paisa => `৳${(paisa / 100).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const currentMonth = () => new Date().toISOString().slice(0, 7);

export default function App() {
  const [health, setHealth] = useState("Checking backend...");
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [month, setMonth] = useState(currentMonth());
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    getHealth().then(({ data }) => setHealth(`Connected — ${data.project} API v${data.version}`))
      .catch(() => setHealth("Backend unavailable. Start FastAPI on port 8000."));
  }, []);
  useEffect(() => {
    let active = true;
    setError("");
    Promise.all([getTransactions({ month }), getSummary(month), getBudgets(month)])
      .then(([transactionResponse, summaryResponse, budgetResponse]) => {
        if (!active) return;
        setRows(transactionResponse.data);
        setSummary(summaryResponse.data);
        setBudgets(budgetResponse.data);
      })
      .catch(err => { if (active) setError(err.response?.data?.detail || "Could not load financial data"); });
    return () => { active = false; };
  }, [month, refresh]);

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setError(""); setReport(null); setNotice("");
    try {
      const { data } = await importTransactions(file);
      setReport(data); setRefresh(n => n + 1);
    } catch (err) { setError(err.response?.data?.detail || "Upload failed. Verify backend connectivity."); }
    finally { setBusy(false); event.target.value = ""; }
  }
  async function correct(id, nextCategory) {
    setError("");
    try { await changeCategory(id, nextCategory); setRefresh(n => n + 1); }
    catch (err) { setError(err.response?.data?.detail || "Category update failed"); }
  }
  async function submitBudget(event) {
    event.preventDefault(); setError(""); setNotice("");
    if (!/^\d+(\.\d{1,2})?$/.test(limit)) { setError("Enter a nonnegative BDT amount with up to two decimals."); return; }
    const [whole, fraction = ""] = limit.split(".");
    const paisa = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
    if (!Number.isSafeInteger(paisa)) { setError("Budget amount is too large."); return; }
    setBusy(true);
    try {
      await saveBudget({ month, category, limit_paisa: paisa });
      setNotice(`Saved ${category} budget for ${month}.`);
      setRefresh(n => n + 1);
    } catch (err) { setError(err.response?.data?.detail || "Could not save budget."); }
    finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <header className="flex items-center gap-3 border-b border-slate-800 pb-6">
          <span className="rounded-xl bg-teal-400/15 p-3 text-teal-300"><Wallet size={28}/></span>
          <div><h1 className="text-2xl font-semibold">Monetra AI</h1><p className="text-sm text-slate-400">Tech_Innovators · Synthetic-data finance prototype</p></div>
        </header>
        <section className="py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><h2 className="text-3xl font-bold">Financial Dashboard</h2><p className="mt-2 text-slate-400">Phase 3 · Verified financial calculations and monthly category budgets</p></div>
            <label className="text-sm text-slate-300">Selected month <input aria-label="Filter month" type="month" value={month} onChange={e => setMonth(e.target.value)} className="ml-2 rounded bg-slate-800 p-2"/></label>
          </div>
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm"><div className="flex items-center gap-2 text-teal-300"><Activity size={18}/> Backend connection</div><p className="mt-2" role="status">{health}</p></div>
          {error && <p className="mt-4 rounded border border-red-800 bg-red-950/30 p-3 text-red-300" role="alert">{String(error)}</p>}
          {notice && <p className="mt-4 text-teal-300" role="status">{notice}</p>}
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
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="cursor-pointer rounded-xl border border-dashed border-teal-700 bg-slate-900 p-6"><div className="flex items-center gap-2 font-semibold"><FileUp size={20}/> Upload CSV</div><p className="mt-2 text-sm text-slate-400">Max 2 MB · UTF-8 · date, description, type, amount; optional category</p><input className="mt-4 block w-full text-sm" type="file" accept=".csv,text/csv" onChange={upload} disabled={busy}/></label>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6"><div className="flex items-center gap-2 font-semibold"><RefreshCw size={18}/> Import result</div>{busy ? <p className="mt-3">Working...</p> : report ? <p className="mt-3 text-sm">Imported: {report.imported} · Duplicates: {report.duplicates} · Invalid: {report.invalid_rows}</p> : <p className="mt-3 text-sm text-slate-400">Upload the sample file to get started.</p>}{report?.errors?.length > 0 && <ul className="mt-3 max-h-28 overflow-auto text-xs text-amber-300">{report.errors.map(e => <li key={e.row}>Row {e.row}: {e.reason}</li>)}</ul>}</div>
          </div>
          <h3 className="mt-8 text-xl font-semibold">Transactions ({rows.length} shown)</h3>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800"><table className="w-full min-w-[680px] text-sm"><thead className="bg-slate-900 text-slate-300"><tr>{["Date","Description","Type","Amount (BDT)","Category"].map(h=><th className="p-3 text-left" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(row => <tr className="border-t border-slate-800" key={row.id}><td className="p-3">{row.date}</td><td className="p-3">{row.description}</td><td className="p-3">{row.type}</td><td className="p-3">{money(row.amount_paisa)}</td><td className="p-3"><select aria-label={`Category for ${row.description}`} value={row.category} onChange={e=>correct(row.id,e.target.value)} className="rounded bg-slate-800 p-2">{categories.map(c=><option key={c}>{c}</option>)}</select></td></tr>)}</tbody></table>{!rows.length && <p className="p-6 text-center text-slate-400">No transactions for the selected month.</p>}</div>
          <p className="mt-3 text-xs text-slate-500">Latest 500 records shown. Summary calculations use all saved transactions, not just displayed rows.</p>
        </section>
        <footer className="border-t border-slate-800 py-5 text-sm text-slate-500">Copyright © 2026 Tech_Innovators. · MIT License · Educational prototype</footer>
      </div>
    </main>
  );
}
