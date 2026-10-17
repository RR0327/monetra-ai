import { useEffect, useState } from "react";
import { Activity, Wallet, LayoutDashboard, List, TrendingUp, MessageSquare, Receipt, Menu } from "lucide-react";
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Forecast from "./pages/Forecast";
import Assistant from "./pages/Assistant";
import Bills from "./pages/Bills";
import { categories, expenseCategories, money, currentMonth, toPaisa } from "./utils/format";
import { getHealth, importTransactions, getTransactions, changeCategory, getSummary, getBudgets, saveBudget, getForecast, getBills, createBill, markBillPaid, simulatePurchase, askAssistant, getMe, logout } from "./services/api";
import Auth from "./pages/Auth";
import Home from "./pages/Home";

function MonetraApp() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [health, setHealth] = useState("Checking backend...");
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [bills, setBills] = useState([]);
  const [question, setQuestion] = useState("");
  const [chatResult, setChatResult] = useState(null);
  const [chatBusy, setChatBusy] = useState(false);
  const [chatError, setChatError] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseCategory, setPurchaseCategory] = useState("Shopping");
  const [simulation, setSimulation] = useState(null);
  const [billTitle, setBillTitle] = useState("");
  const [billDue, setBillDue] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(currentMonth());
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("monetra_token")) { setAuthChecked(true); return undefined; }
    getMe().then(({ data }) => setUser(data)).catch(() => localStorage.removeItem("monetra_token")).finally(() => setAuthChecked(true));
    const expired = () => { setUser(null); setAuthChecked(true); };
    window.addEventListener("monetra-auth-expired", expired);
    return () => window.removeEventListener("monetra-auth-expired", expired);
  }, []);

  useEffect(() => {
    getHealth().then(({ data }) => setHealth(`Connected — ${data.project} API v${data.version}`))
      .catch(() => setHealth("Backend unavailable. Start FastAPI on port 8000."));
  }, []);
  useEffect(() => {
    if (!user) return undefined;
    let active = true;
    setError(""); setLoading(true);
    Promise.all([getTransactions({ month }), getSummary(month), getBudgets(month), getForecast(month), getBills()])
      .then(([transactionResponse, summaryResponse, budgetResponse, forecastResponse, billsResponse]) => {
        if (!active) return;
        setRows(transactionResponse.data);
        setSummary(summaryResponse.data);
        setBudgets(budgetResponse.data);
        setForecast(forecastResponse.data);
        setBills(billsResponse.data.bills);
        setLoading(false);
      })
      .catch(err => { if (active) { setError(err.response?.data?.detail || "Could not load financial data"); setLoading(false); } });
    return () => { active = false; };
  }, [month, refresh]);
  useEffect(() => { setSimulation(null); setChatResult(null); setChatError(""); }, [month, refresh]);
  async function sendQuestion(event, prompt) {
    event?.preventDefault();
    const text = (prompt || question).trim();
    if (!text) return;
    setChatBusy(true); setChatResult(null); setChatError("");
    try {
      const { data } = await askAssistant({ month, question: text });
      setQuestion(text); setChatResult(data);
    } catch (err) {
      setChatError(typeof err.response?.data?.detail === "string" ? err.response.data.detail : "Chat request failed. Check the backend and try again.");
    } finally { setChatBusy(false); }
  }

  async function runSimulation(event) {
    event.preventDefault(); setError(""); setNotice(""); setSimulation(null);
    try {
      const amount = toPaisa(purchaseAmount);
      setBusy(true);
      const response = await simulatePurchase({ month, category: purchaseCategory, purchase_amount_paisa: amount });
      setSimulation(response.data);
    } catch (err) { setError(err.response?.data?.detail || err.message || "Simulation failed"); }
    finally { setBusy(false); }
  }
  async function addBill(event) {
    event.preventDefault(); setError(""); setNotice("");
    try {
      const amount = toPaisa(billAmount);
      if (!billTitle.trim() || !billDue) throw new Error("Enter a title and due date.");
      setBusy(true);
      await createBill({ title: billTitle.trim(), due_date: billDue, amount_paisa: amount });
      setBillTitle(""); setBillDue(""); setBillAmount("");
      setNotice("Bill saved. It is reserved until marked paid."); setRefresh(n => n + 1);
    } catch (err) { setError(err.response?.data?.detail || err.message || "Could not create bill"); }
    finally { setBusy(false); }
  }
  async function payBill(id) {
    setBusy(true); setError("");
    try { await markBillPaid(id); setNotice("Bill marked paid. Record any actual expense separately via CSV to reflect it in the balance."); setRefresh(n => n + 1); }
    catch (err) { setError(err.response?.data?.detail || "Could not mark bill paid"); }
    finally { setBusy(false); }
  }
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

  if (!authChecked) return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">Checking session...</main>;
  if (!user) {
    if (location.pathname === "/register") {
      return <Auth initialMode="register" onAuthenticated={(nextUser) => { setUser(nextUser); navigate("/dashboard", { replace: true }); }} />;
    }
    if (location.pathname === "/login") {
      return <Auth initialMode="login" onAuthenticated={(nextUser) => { setUser(nextUser); navigate("/dashboard", { replace: true }); }} />;
    }
    return <Home />;
  }
  if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register") {
    return <Navigate to="/dashboard" replace />;
  }
  async function signOut() {
    try { await logout(); } finally { localStorage.removeItem("monetra_token"); setUser(null); navigate("/", { replace: true }); }
  }

  const vm = { summary, budgets, forecast, rows, bills, question, setQuestion, chatResult, chatBusy, chatError, sendQuestion, purchaseAmount, setPurchaseAmount, purchaseCategory, setPurchaseCategory, simulation, runSimulation, billTitle, setBillTitle, billDue, setBillDue, billAmount, setBillAmount, addBill, payBill, report, upload, correct, busy, month, category, setCategory, limit, setLimit, submitBudget };
  const links = [
    { to: "/dashboard", text: "Dashboard", icon: LayoutDashboard },
    { to: "/transactions", text: "Transactions", icon: List },
    { to: "/forecast", text: "Forecast & simulator", icon: TrendingUp },
    { to: "/assistant", text: "AI Assistant", icon: MessageSquare },
    { to: "/bills", text: "Bills", icon: Receipt },
  ];
  const active = links.find(link => link.to === location.pathname) || links[0];
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-slate-800 bg-slate-900/80 p-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r" aria-label="Primary navigation">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3"><span className="rounded-xl bg-teal-400/15 p-3 text-teal-300"><Wallet size={26}/></span><div><h1 className="text-xl font-bold">Monetra AI</h1><p className="text-xs text-slate-400">Tech_Innovators</p></div></div>
            <div className="flex gap-2"><button onClick={signOut} className="rounded border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:text-white">Log out</button><button aria-label="Toggle navigation" aria-expanded={menuOpen} className="rounded border border-slate-700 p-2 lg:hidden" onClick={() => setMenuOpen(!menuOpen)}><Menu size={20}/></button></div>
          </div>
          <nav aria-label="Main pages" className={`${menuOpen ? "flex" : "hidden"} mt-6 flex-col gap-2 lg:flex`}>
            {links.map(({to,text,icon: Icon}) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${isActive ? "bg-teal-500/15 font-semibold text-teal-200" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}><Icon size={19}/>{text}</NavLink>)}
          </nav>
          <p className="mt-8 hidden text-xs text-slate-500 lg:block">Synthetic-data educational prototype. No real money movement.</p>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-7 lg:px-10">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div><h2 className="text-2xl font-bold sm:text-3xl">{active.text}</h2><p className="mt-1 text-sm text-slate-400">Phase 5 · Integrated financial workspace</p></div>
            <label className="text-sm text-slate-300">Selected month <input aria-label="Filter month" type="month" value={month} onChange={e => setMonth(e.target.value)} className="ml-2 rounded border border-slate-700 bg-slate-800 p-2"/></label>
          </header>
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm"><div className="flex items-center gap-2 text-teal-300"><Activity size={17}/> Backend connection</div><p className="mt-1 text-slate-300" role="status">{health}</p></div>
          {loading && <p className="mt-4 rounded border border-slate-700 bg-slate-900 p-3 text-slate-300" role="status">Loading verified financial data…</p>}
          {error && <p className="mt-4 rounded border border-red-800 bg-red-950/30 p-3 text-red-300" role="alert">{String(error)}</p>}
          {notice && <p className="mt-4 text-teal-300" role="status">{notice}</p>}
          <div className="pt-4" aria-busy={loading}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard vm={vm}/>}/>
              <Route path="/transactions" element={<Transactions vm={vm}/>}/>
              <Route path="/forecast" element={<Forecast vm={vm}/>}/>
              <Route path="/assistant" element={<Assistant vm={vm}/>}/>
              <Route path="/bills" element={<Bills vm={vm}/>}/>
              <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
            </Routes>
          </div>
          <footer className="mt-10 border-t border-slate-800 py-5 text-sm text-slate-500">Copyright © 2026 Tech_Innovators. · MIT License · Educational prototype</footer>
        </main>
      </div>
    </div>
  );
}
export default function App() { return <BrowserRouter><MonetraApp/></BrowserRouter>; }
