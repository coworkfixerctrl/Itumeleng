import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { api, formatErr, TOKEN_KEY } from "../lib/api";
import { LogoMark } from "../components/site/Logo";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem(TOKEN_KEY, data?.token ?? "");
      navigate("/admin/dashboard");
    } catch (e2) {
      setErr(formatErr(e2));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-5 pt-20" data-testid="admin-login-page">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-line bg-ink-deep/80 p-8 md:p-10" data-testid="admin-login-form">
        <LogoMark className="h-10 w-10" />
        <h1 className="mt-6 font-display text-3xl font-bold text-white">Editor sign-in</h1>
        <p className="mt-2 text-sm text-slate-300">Publish market commentary and manage consultation requests.</p>
        <div className="mt-8 space-y-5">
          <div className="space-y-2"><Label htmlFor="ad-email" className="text-slate-300">Email</Label><Input id="ad-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl border-line bg-ink/60 text-white" data-testid="admin-email-input" /></div>
          <div className="space-y-2"><Label htmlFor="ad-pass" className="text-slate-300">Password</Label><Input id="ad-pass" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl border-line bg-ink/60 text-white" data-testid="admin-password-input" /></div>
        </div>
        {err && <p className="mt-5 text-sm text-rose-300" data-testid="admin-login-error">{err}</p>}
        <button type="submit" disabled={busy} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ice px-6 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-deep transition-colors hover:bg-white disabled:opacity-60" data-testid="admin-login-submit">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
        </button>
      </form>
    </main>
  );
}
