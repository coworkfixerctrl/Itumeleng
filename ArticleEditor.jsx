import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { api, formatErr, articleUrl, linkedInShareUrl } from "../../lib/api";
import { CATEGORIES, COVER_PRESETS } from "../../data/content";

const EMPTY = { title: "", category: CATEGORIES[0], excerpt: "", content: "", tickers: "", cover_image: COVER_PRESETS[3], linkedin_url: "" };
const inp = "rounded-xl border-line bg-ink/60 text-white placeholder:text-slate-400";

export const ArticleEditor = ({ open, onOpenChange, article }) => {
  const [f, setF] = useState(EMPTY);
  const qc = useQueryClient();

  useEffect(() => {
    if (!open) return;
    setF(article ? { ...article, linkedin_url: article.linkedin_url || "", tickers: (article.tickers || []).join(", ") } : EMPTY);
  }, [open, article]);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e?.target ? e.target.value : e }));

  const m = useMutation({
    mutationFn: (body) => (article ? api.put(`/articles/${article.id}`, body) : api.post("/articles", body)).then((r) => r.data),
    onSuccess: (saved) => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["article"] });
      onOpenChange(false);
      toast.success(article ? "Article updated" : "Article published", {
        action: { label: "Share on LinkedIn", onClick: () => window.open(linkedInShareUrl(articleUrl(saved?.slug)), "_blank", "noopener") },
        duration: 10000,
      });
    },
    onError: (e) => toast.error(formatErr(e)),
  });

  const submit = (e) => {
    e.preventDefault();
    m.mutate({ title: f.title, category: f.category, excerpt: f.excerpt, content: f.content, cover_image: f.cover_image, linkedin_url: f.linkedin_url, tickers: f.tickers.split(",").map((t) => t.trim()).filter(Boolean) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-lenis-prevent className="max-h-[92vh] overflow-y-auto border-line bg-ink-deep text-white sm:max-w-3xl" data-testid="article-editor">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{article ? "Edit article" : "New article"}</DialogTitle>
          <DialogDescription className="text-slate-300">Use a blank line between paragraphs, "## " for headings and "- " for bullet points.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="mt-2 space-y-5">
          <div className="space-y-2"><Label className="text-slate-300">Title</Label><Input required minLength={3} value={f.title} onChange={set("title")} className={`h-12 ${inp}`} data-testid="editor-title-input" /></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-slate-300">Category</Label>
              <Select value={f.category} onValueChange={set("category")}>
                <SelectTrigger className={`h-12 ${inp}`} data-testid="editor-category-select"><SelectValue /></SelectTrigger>
                <SelectContent data-lenis-prevent className="border-line bg-ink-deep text-white">{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label className="text-slate-300">Tickers (comma separated)</Label><Input value={f.tickers} onChange={set("tickers")} placeholder="SAP.JO, USDZAR" className={`h-12 ${inp}`} data-testid="editor-tickers-input" /></div>
          </div>
          <div className="space-y-2"><Label className="text-slate-300">Excerpt</Label><Textarea required minLength={10} rows={2} value={f.excerpt} onChange={set("excerpt")} className={inp} data-testid="editor-excerpt-input" /></div>
          <div className="space-y-2"><Label className="text-slate-300">Article</Label><Textarea required minLength={20} rows={12} value={f.content} onChange={set("content")} className={`font-mono text-sm ${inp}`} data-testid="editor-content-input" /></div>
          <div className="space-y-2">
            <Label className="text-slate-300">Cover image</Label>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {COVER_PRESETS.map((c, i) => (
                <button type="button" key={c} onClick={() => setF((p) => ({ ...p, cover_image: c }))} data-testid={`editor-cover-${i}`} className={`aspect-square overflow-hidden rounded-lg border-2 ${f.cover_image === c ? "border-ice" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={c} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <Input value={f.cover_image} onChange={set("cover_image")} placeholder="…or paste an image URL" className={`h-11 ${inp}`} data-testid="editor-cover-url-input" />
          </div>
          <div className="space-y-2"><Label className="text-slate-300">Original LinkedIn post URL (optional)</Label><Input type="url" value={f.linkedin_url} onChange={set("linkedin_url")} placeholder="https://www.linkedin.com/pulse/..." className={`h-11 ${inp}`} data-testid="editor-linkedin-url-input" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => onOpenChange(false)} className="rounded-full border border-line px-6 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-slate-200 hover:text-white" data-testid="editor-cancel-btn">Cancel</button>
            <button type="submit" disabled={m.isPending} className="inline-flex items-center gap-2 rounded-full bg-ice px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-deep hover:bg-white disabled:opacity-60" data-testid="editor-save-btn">
              {m.isPending && <Loader2 className="h-4 w-4 animate-spin" />}{article ? "Save changes" : "Publish"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
