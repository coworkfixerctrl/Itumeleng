import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, LogOut, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { api, asArray, fmtDate, formatErr, TOKEN_KEY } from "../lib/api";
import { ArticleEditor } from "../components/admin/ArticleEditor";
import { ShareButtons } from "../components/market/ShareButtons";
import { StatusPill } from "../components/advisory/BookingsTable";

const STATUSES = ["Pending", "Confirmed", "Completed", "Declined"];

const ArticlesTab = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [del, setDel] = useState(null);
  const { data } = useQuery({ queryKey: ["articles"], queryFn: () => api.get("/articles").then((r) => r.data) });
  const rm = useMutation({
    mutationFn: (id) => api.delete(`/articles/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["articles"] }); toast.success("Article deleted"); },
    onError: (e) => toast.error(formatErr(e)),
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-300">{asArray(data).length} articles</p>
        <button onClick={() => { setEditing(null); setOpen(true); }} className="inline-flex items-center gap-2 rounded-full bg-ice px-5 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-deep hover:bg-white" data-testid="admin-new-article-btn"><Plus className="h-4 w-4" /> New article</button>
      </div>
      <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-ink-deep/70">
        {asArray(data).map((a) => (
          <div key={a.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between" data-testid={`admin-article-row-${a.slug}`}>
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ice">{a.category} · {fmtDate(a.published_at)} {a.is_sample && <span className="text-amber-200">· Sample</span>}</p>
              <p className="mt-1 truncate font-display text-lg font-semibold text-white">{a.title}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ShareButtons slug={a.slug} compact />
              <Link to={`/market-analysis/${a.slug}`} className="grid h-9 w-9 place-items-center rounded-full border border-line text-slate-200 hover:text-white" aria-label="View" data-testid={`admin-view-${a.slug}`}><ExternalLink className="h-4 w-4" /></Link>
              <button onClick={() => { setEditing(a); setOpen(true); }} className="grid h-9 w-9 place-items-center rounded-full border border-line text-slate-200 hover:border-ice hover:text-ice" aria-label="Edit" data-testid={`admin-edit-${a.slug}`}><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setDel(a)} className="grid h-9 w-9 place-items-center rounded-full border border-line text-slate-200 hover:border-rose-300 hover:text-rose-300" aria-label="Delete" data-testid={`admin-delete-${a.slug}`}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      <ArticleEditor open={open} onOpenChange={setOpen} article={editing} />
      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent className="border-line bg-ink-deep text-white">
          <AlertDialogHeader><AlertDialogTitle>Delete this article?</AlertDialogTitle><AlertDialogDescription className="text-slate-300">"{del?.title}" will be removed permanently.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-line bg-transparent text-white" data-testid="admin-delete-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-500 text-white hover:bg-rose-400" onClick={() => rm.mutate(del.id)} data-testid="admin-delete-confirm">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const BookingsTab = () => {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-bookings"], queryFn: () => api.get("/admin/bookings").then((r) => r.data) });
  const upd = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/bookings/${id}`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-bookings"] }); qc.invalidateQueries({ queryKey: ["bookings"] }); toast.success("Status updated"); },
    onError: (e) => toast.error(formatErr(e)),
  });
  const rows = asArray(data);
  return (
    <div className="space-y-4">
      {rows.length === 0 && <p className="rounded-2xl border border-dashed border-line p-10 text-center text-slate-400">No consultation requests yet.</p>}
      {rows.map((b) => (
        <div key={b.id} className="rounded-2xl border border-line bg-ink-deep/70 p-5" data-testid={`admin-booking-${b.ref}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-mono text-xs text-ice">{b.ref} · {fmtDate(b.created_at)}</p>
              <p className="mt-1 font-display text-lg font-semibold text-white">{b.name} <span className="text-sm font-normal text-slate-300">· {b.company || "—"}</span></p>
              <a href={`mailto:${b.email}`} className="text-sm text-slate-200 underline-offset-4 hover:underline">{b.email}</a>
              <p className="mt-2 text-sm text-slate-300">{b.topic} · {b.preferred_date} · {b.preferred_time}</p>
              {b.message && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">{b.message}</p>}
            </div>
            <div className="flex items-center gap-3">
              <StatusPill s={b.status} />
              <Select value={b.status} onValueChange={(status) => upd.mutate({ id: b.id, status })}>
                <SelectTrigger className="h-10 w-36 rounded-full border-line bg-ink/60 text-white" data-testid={`admin-booking-status-${b.ref}`}><SelectValue /></SelectTrigger>
                <SelectContent className="border-line bg-ink-deep text-white">{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: me, isLoading, isError } = useQuery({ queryKey: ["me"], queryFn: () => api.get("/auth/me").then((r) => r.data), retry: false });

  useEffect(() => {
    if (isError) navigate("/admin", { replace: true });
  }, [isError, navigate]);

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch { /* ignore */ }
    localStorage.removeItem(TOKEN_KEY);
    navigate("/admin");
  };

  if (isLoading || !me) return <main className="min-h-screen pt-44"><div className="container-x font-mono text-sm text-slate-300">Checking session…</div></main>;

  return (
    <main className="min-h-screen pb-24 pt-32" data-testid="admin-dashboard">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-ice">Editor desk</p>
            <h1 className="mt-3 font-display font-cond text-4xl font-extrabold text-white md:text-5xl">Welcome back, {me?.name?.split(" ")[0] ?? "Editor"}</h1>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-slate-200 hover:text-white" data-testid="admin-logout-btn"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
        <Tabs defaultValue="articles" className="mt-10">
          <TabsList className="h-auto rounded-full border border-line bg-ink-deep p-1">
            <TabsTrigger value="articles" className="rounded-full px-5 py-2 font-mono text-[12px] uppercase tracking-[0.14em] data-[state=active]:bg-ice data-[state=active]:text-ink-deep" data-testid="admin-tab-articles">Articles</TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-full px-5 py-2 font-mono text-[12px] uppercase tracking-[0.14em] data-[state=active]:bg-ice data-[state=active]:text-ink-deep" data-testid="admin-tab-bookings">Bookings</TabsTrigger>
          </TabsList>
          <TabsContent value="articles" className="mt-8"><ArticlesTab /></TabsContent>
          <TabsContent value="bookings" className="mt-8"><BookingsTab /></TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
