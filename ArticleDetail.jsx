import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Linkedin } from "lucide-react";
import { api, asArray } from "../lib/api";
import { ArticleMeta, ArticleCard } from "../components/market/ArticleCard";
import { ShareButtons } from "../components/market/ShareButtons";
import { FadeUp } from "../components/site/Reveal";
import { PROFILE } from "../data/content";

const parseBlocks = (text) => {
  const out = [];
  let para = [];
  let list = [];
  const flushPara = () => { if (para.length) out.push({ t: "p", v: para.join(" ") }); para = []; };
  const flushList = () => { if (list.length) out.push({ t: "ul", v: list }); list = []; };
  String(text || "").split("\n").forEach((raw) => {
    const l = raw.trim();
    if (!l) { flushPara(); flushList(); return; }
    if (l.startsWith("## ")) { flushPara(); flushList(); out.push({ t: "h2", v: l.slice(3) }); return; }
    if (l.startsWith("- ")) { flushPara(); list.push(l.slice(2)); return; }
    flushList();
    para.push(l);
  });
  flushPara();
  flushList();
  return out;
};

const Body = ({ text }) =>
  parseBlocks(text).map((b, i) => {
    if (b.t === "h2") return <h2 key={i}>{b.v}</h2>;
    if (b.t === "ul") return <ul key={i}>{b.v.map((x, j) => <li key={j}>{x}</li>)}</ul>;
    return <p key={i}>{b.v}</p>;
  });

export default function ArticleDetail() {
  const { slug } = useParams();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const { data: a, isLoading, isError } = useQuery({ queryKey: ["article", slug], queryFn: () => api.get(`/articles/${slug}`).then((r) => r.data) });
  const { data: all } = useQuery({ queryKey: ["articles"], queryFn: () => api.get("/articles").then((r) => r.data) });
  const related = asArray(all).filter((x) => x.slug !== slug).slice(0, 3);

  if (isLoading) return <main className="min-h-screen pt-44"><div className="container-x font-mono text-sm text-slate-300">Loading…</div></main>;
  if (isError || !a) return (
    <main className="min-h-screen pt-44" data-testid="article-not-found">
      <div className="container-x"><p className="text-slate-300">This article could not be found.</p><Link to="/market-analysis" className="mt-6 inline-block text-ice">← Back to Market Analysis</Link></div>
    </main>
  );

  return (
    <main className="pb-24 pt-28 md:pt-36" data-testid="article-detail-page">
      <motion.div style={{ scaleX: progress }} className="fixed left-0 right-0 top-[72px] z-40 h-[2px] origin-left bg-ice" />
      <article className="container-x">
        <div className="mx-auto max-w-3xl">
          <Link to="/market-analysis" className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-slate-300 hover:text-white" data-testid="article-back-link"><ArrowLeft className="h-4 w-4" /> All commentary</Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="mt-10">
            <ArticleMeta a={a} />
            <h1 className="mt-6 font-display font-cond text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl" data-testid="article-title">{a.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">{a.excerpt}</p>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-5">
              <p className="text-sm text-slate-300">By <span className="font-semibold text-white">{PROFILE.name}</span></p>
              <ShareButtons slug={a.slug} />
            </div>
          </motion.div>
        </div>
        {a.cover_image && (
          <FadeUp className="mx-auto mt-12 max-w-5xl">
            <div className="relative aspect-[21/9] overflow-hidden rounded-3xl">
              <img src={a.cover_image} alt="" className="duotone absolute inset-0 h-full w-full object-cover" />
              <div className="duotone-tint absolute inset-0" />
            </div>
          </FadeUp>
        )}
        <div className="prose-article mx-auto mt-14 max-w-3xl text-[17px]" data-testid="article-body"><Body text={a.content} /></div>
        <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-ink-deep/70 p-6">
          <p className="font-display text-lg font-semibold text-white">Found this useful? Share it on LinkedIn.</p>
          <ShareButtons slug={a.slug} />
        </div>
        {a.linkedin_url && (
          <p className="mx-auto mt-6 max-w-3xl text-sm text-slate-300">
            Originally published on{" "}
            <a href={a.linkedin_url} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1.5 text-ice" data-testid="article-original-linkedin"><Linkedin className="h-3.5 w-3.5" /> LinkedIn — join the discussion</a>
          </p>
        )}
      </article>
      {related.length > 0 && (
        <section className="container-x mt-24">
          <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-ice">Keep reading</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <ArticleCard key={r.id} a={r} />)}
          </div>
        </section>
      )}
    </main>
  );
}
