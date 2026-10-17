import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login, register } from "../services/api";

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (mode === "register" && password !== confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }
    if (mode === "register" && !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,128}$/.test(password)) {
      setError("Password must be 8-128 characters with uppercase, lowercase, number, and special character.");
      return;
    }
    setBusy(true);
    try {
      const response = await (mode === "login"
        ? login({ identifier, password })
        : register({ username, email, password, confirm_password: confirmPassword }));
      localStorage.setItem("monetra_token", response.data.token);
      onAuthenticated(response.data.user);
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-50">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-teal-300">Monetra AI</h1>
        <p className="mt-2 text-slate-400">{mode === "login" ? "Sign in to your private financial workspace." : "Create a new private financial workspace."}</p>
        {mode === "register" && <label className="mt-6 block text-sm text-slate-300">Username
          <input required minLength={3} maxLength={30} pattern="[A-Za-z0-9_]+" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3" />
          <span className="mt-1 block text-xs text-slate-500">3-30 characters: letters, numbers, and underscores.</span>
        </label>}
        {mode === "login" ? <label className="mt-6 block text-sm text-slate-300">Email or username
          <input required autoComplete="username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Enter your email or username" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3" />
        </label> : <label className="mt-4 block text-sm text-slate-300">Email
          <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3" />
        </label>}
        <label className="mt-4 block text-sm text-slate-300">Password
          <span className="relative mt-2 block">
            <input required minLength={8} maxLength={128} autoComplete={mode === "login" ? "current-password" : "new-password"} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "login" ? "Enter your password" : "Create a strong password"} className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 pr-11" />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-teal-300">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        {mode === "register" && <label className="mt-4 block text-sm text-slate-300">Confirm password
          <span className="relative mt-2 block">
            <input required minLength={8} maxLength={128} type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 pr-11" />
            <button type="button" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-teal-300">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
          <span className="mt-1 block text-xs text-slate-500">Use 8+ characters with uppercase, lowercase, number, and special character.</span>
        </label>}
        {error && <p className="mt-4 text-sm text-red-300" role="alert">{error}</p>}
        <button disabled={busy} className="mt-6 w-full rounded-lg bg-teal-400 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50">
          {busy ? "Please wait..." : mode === "login" ? "Log in" : "Register"}
        </button>
        <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="mt-4 w-full text-sm text-teal-300">
          {mode === "login" ? "New user? Register" : "Already registered? Log in"}
        </button>
      </form>
    </main>
  );
}
