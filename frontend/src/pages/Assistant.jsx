import { FileUp, RefreshCw, ChartColumn, PiggyBank, TrendingUp, ShieldAlert, Receipt, ShoppingCart, MessageSquare } from "lucide-react";
import { money, categories, expenseCategories } from "../utils/format";

export default function Assistant({ vm }) {
  const { month, chatBusy, sendQuestion, question, setQuestion, chatError, chatResult } = vm;
  return (
    <>
          <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5" aria-label="AI financial assistant">
            <h3 className="flex items-center gap-2 text-xl font-semibold"><MessageSquare size={20}/> Monetra AI financial assistant</h3>
            <p className="mt-2 text-sm text-slate-400">Ask questions about {month}. All financial numbers come from Python; Gemini only explains the verified data.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Summarize my spending", "How are my budgets?", "What is my financial risk?", "What bills are pending?", "Can I buy something for 1200 BDT?"].map(prompt =>
                <button key={prompt} type="button" disabled={chatBusy} onClick={() => sendQuestion(null, prompt)} className="rounded border border-slate-600 px-3 py-1 text-sm text-teal-300 disabled:opacity-50">{prompt}</button>)}
            </div>
            <form onSubmit={sendQuestion} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input aria-label="Ask a financial question" minLength={3} maxLength={500} required value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about your budget, forecast, or a purchase..." className="min-w-0 flex-1 rounded bg-slate-800 p-3"/>
              <button disabled={chatBusy} className="rounded bg-teal-600 px-5 py-2 font-semibold disabled:opacity-50">{chatBusy ? "Asking..." : "Ask Monetra AI"}</button>
            </form>
            {chatError && <p role="alert" className="mt-3 text-red-300">{chatError}</p>}
            {chatResult && <div className="mt-4 space-y-3 rounded-lg border border-slate-700 p-4" role="status">
              <p className="text-sm text-slate-400">Intent: {chatResult.intent} · AI status: {chatResult.status} · Source: {chatResult.source}</p>
              <p className="whitespace-pre-wrap text-slate-100">{chatResult.answer}</p>
              <div className="rounded-lg bg-slate-800 p-3"><h4 className="font-semibold">Verified Python financial data</h4>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">{Object.entries(chatResult.trusted_fields.summary || {}).map(([key, value]) =>
                  <p key={key} className="text-sm"><span className="text-slate-400">{key.replaceAll("_paisa", "").replaceAll("_", " ")}: </span><strong>{money(value)}</strong></p>)}</div>
                {chatResult.trusted_fields.forecast && <p className="mt-2 text-sm">Risk: {chatResult.trusted_fields.forecast.risk_level} · Forecast: {chatResult.trusted_fields.forecast.status} · Confidence: {chatResult.trusted_fields.forecast.confidence}</p>}
                {chatResult.trusted_fields.simulation && <div className="mt-2 text-sm"><p>Simulated purchase: {money(chatResult.trusted_fields.simulation.purchase_amount_paisa)}</p><p>Balance after purchase: {money(chatResult.trusted_fields.simulation.balance_after_purchase_paisa)}</p><p>Risk after purchase: {chatResult.trusted_fields.simulation.risk_level_after}</p></div>}
                {chatResult.trusted_fields.budgets && <div className="mt-2 text-sm">{chatResult.trusted_fields.budgets.map(b => <p key={b.category}>{b.category}: spent {money(b.spent_paisa)} / budget {money(b.limit_paisa)} ({b.status})</p>)}{!chatResult.trusted_fields.budgets.length && <p>No budgets set this month.</p>}</div>}
                {chatResult.trusted_fields.bills && <p className="mt-2 text-sm">Pending bills: {chatResult.trusted_fields.bills.pending_count} · Reserved: {money(chatResult.trusted_fields.bills.pending_total_paisa)}</p>}
              </div>
              <details className="text-xs text-slate-400"><summary className="cursor-pointer">Limitations and assumptions</summary><ul className="mt-2 list-disc pl-5">{chatResult.limitations.map(item => <li key={item}>{item}</li>)}</ul></details>
            </div>}
          </section>
    </>
  );
}
