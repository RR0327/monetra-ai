import { useEffect, useState } from "react";
import { Activity, FileUp, RefreshCw, Wallet } from "lucide-react";
import { getHealth, importTransactions, getTransactions, changeCategory } from "./services/api";

const categories = ["Income", "Food", "Transport", "Shopping", "Utilities", "Rent", "Health", "Education", "Other"];
export default function App() {
  const [health, setHealth] = useState("Checking backend...");
  const [rows, setRows] = useState([]);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [month, setMonth] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    getHealth().then(({data}) => setHealth(`Connected — ${data.project} API v${data.version}`))
      .catch(() => setHealth("Backend unavailable. Start FastAPI on port 8000."));
  }, []);
  useEffect(() => {
    getTransactions(month ? {month} : {}).then(({data}) => setRows(data))
      .catch((err) => setError(err.response?.data?.detail || "Could not load transactions"));
  }, [month, refresh]);
  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setError(""); setReport(null);
    try {
      const {data} = await importTransactions(file);
      setReport(data); setRefresh(n => n + 1);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed. Verify backend connectivity.");
    } finally { setBusy(false); event.target.value = ""; }
  }
  async function correct(id, category) {
    setError("");
    try { await changeCategory(id, category); setRefresh(n => n + 1); }
    catch (err) { setError(err.response?.data?.detail || "Category update failed"); }
  }
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <header className="flex items-center gap-3 border-b border-slate-800 pb-6">
          <span className="rounded-xl bg-teal-400/15 p-3 text-teal-300"><Wallet size={28}/></span>
          <div><h1 className="text-2xl font-semibold">Monetra AI</h1><p className="text-sm text-slate-400">Tech_Innovators · Synthetic-data finance prototype</p></div>
        </header>
        <section className="py-10">
          <h2 className="text-3xl font-bold">Transaction Import & Categorization</h2>
          <p className="mt-2 text-slate-400">Phase 2 · Upload fictional CSV records; categorization, validation and duplicate prevention run on FastAPI.</p>
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex gap-2 items-center text-teal-300"><Activity size={18}/><span>Backend connection</span></div>
            <p className="mt-2" role="status">{health}</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="cursor-pointer rounded-xl border border-dashed border-teal-700 bg-slate-900 p-6">
              <div className="flex items-center gap-2 font-semibold"><FileUp size={20}/> Upload CSV</div>
              <p className="mt-2 text-sm text-slate-400">Max 2 MB · UTF-8 · date, description, type, amount; optional category</p>
              <input className="mt-4 block w-full text-sm" type="file" accept=".csv,text/csv" onChange={upload} disabled={busy}/>
            </label>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center gap-2 font-semibold"><RefreshCw size={18}/> Import result</div>
              {busy ? <p className="mt-3">Importing...</p> : report ? <p className="mt-3 text-sm">Imported: {report.imported} · Duplicates: {report.duplicates} · Invalid: {report.invalid_rows}</p> : <p className="mt-3 text-sm text-slate-400">Upload the sample file to get started.</p>}
              {report?.errors?.length > 0 && <ul className="mt-3 max-h-28 overflow-auto text-xs text-amber-300">{report.errors.map(e => <li key={e.row}>Row {e.row}: {e.reason}</li>)}</ul>}
              {error && <p role="alert" className="mt-3 text-sm text-red-300">{String(error)}</p>}
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold">Transactions ({rows.length} shown)</h3>
            <label className="text-sm">Month <input aria-label="Filter month" type="month" value={month} onChange={e => setMonth(e.target.value)} className="ml-2 rounded bg-slate-800 p-2"/></label>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="bg-slate-900 text-slate-300"><tr>{["Date","Description","Type","Amount (BDT)","Category"].map(h=><th className="p-3 text-left" key={h}>{h}</th>)}</tr></thead>
              <tbody>{rows.map(row => <tr className="border-t border-slate-800" key={row.id}>
                <td className="p-3">{row.date}</td><td className="p-3">{row.description}</td><td className="p-3">{row.type}</td>
                <td className="p-3">{(row.amount_paisa / 100).toFixed(2)}</td>
                <td className="p-3"><select aria-label={`Category for ${row.description}`} value={row.category} onChange={e=>correct(row.id,e.target.value)} className="rounded bg-slate-800 p-2">{categories.map(c=><option key={c}>{c}</option>)}</select></td>
              </tr>)}</tbody>
            </table>
            {!rows.length && <p className="p-6 text-center text-slate-400">No transactions found. Upload sample_data/transactions.csv.</p>}
          </div>
          <p className="mt-3 text-xs text-slate-500">Showing the latest 500 records. Backend financial totals will be implemented in Phase 3.</p>
        </section>
        <footer className="border-t border-slate-800 py-5 text-sm text-slate-500">Copyright © 2026 Tech_Innovators. · MIT License · Educational prototype</footer>
      </div>
    </main>
  );
}
