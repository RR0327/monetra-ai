import { FileUp, RefreshCw, ChartColumn, PiggyBank, TrendingUp, ShieldAlert, Receipt, ShoppingCart, MessageSquare } from "lucide-react";
import { money, categories, expenseCategories } from "../utils/format";

export default function Transactions({ vm }) {
  const { rows, upload, busy, report, correct } = vm;
  return (
    <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="cursor-pointer rounded-xl border border-dashed border-teal-700 bg-slate-900 p-6"><div className="flex items-center gap-2 font-semibold"><FileUp size={20}/> Upload CSV</div><p className="mt-2 text-sm text-slate-400">Max 2 MB · UTF-8 · date, description, type, amount; optional category</p><input className="mt-4 block w-full text-sm" type="file" accept=".csv,text/csv" onChange={upload} disabled={busy}/></label>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6"><div className="flex items-center gap-2 font-semibold"><RefreshCw size={18}/> Import result</div>{busy ? <p className="mt-3">Working...</p> : report ? <p className="mt-3 text-sm">Imported: {report.imported} · Duplicates: {report.duplicates} · Invalid: {report.invalid_rows}</p> : <p className="mt-3 text-sm text-slate-400">Upload the sample file to get started.</p>}{report?.errors?.length > 0 && <ul className="mt-3 max-h-28 overflow-auto text-xs text-amber-300">{report.errors.map(e => <li key={e.row}>Row {e.row}: {e.reason}</li>)}</ul>}</div>
          </div>
          <h3 className="mt-8 text-xl font-semibold">Transactions ({rows.length} shown)</h3>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800"><table className="w-full min-w-[680px] text-sm"><thead className="bg-slate-900 text-slate-300"><tr>{["Date","Description","Type","Amount (BDT)","Category"].map(h=><th className="p-3 text-left" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(row => <tr className="border-t border-slate-800" key={row.id}><td className="p-3">{row.date}</td><td className="p-3">{row.description}</td><td className="p-3">{row.type}</td><td className="p-3">{money(row.amount_paisa)}</td><td className="p-3"><select aria-label={`Category for ${row.description}`} value={row.category} onChange={e=>correct(row.id,e.target.value)} className="rounded bg-slate-800 p-2">{categories.map(c=><option key={c}>{c}</option>)}</select></td></tr>)}</tbody></table>{!rows.length && <p className="p-6 text-center text-slate-400">No transactions for the selected month.</p>}</div>
          <p className="mt-3 text-xs text-slate-500">Latest 500 records shown. Summary calculations use all saved transactions, not just displayed rows.</p>
    </>
  );
}
