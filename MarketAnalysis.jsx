import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Linkedin } from "lucide-react";
import { MaskLines, FadeUp } from "../components/site/Reveal";
import { ArticleCard } from "../components/market/ArticleCard";
import { api, asArray } from "../lib/api";
import { CATEGORIES, PROFILE } from "../data/content";

export default function MarketAnalysis() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const { data, isLoading, isError } = useQuery({ queryKey: ["articles"], queryFn: () => api.get("/articles").then((r) => r.data) });
  const all = asArray(data);
  const term = q.trim().toLowerCase();
  const list = all.filter((a) => (cat === "All" || a.category === cat) && (!term || `${a.title} ${a.excerpt} ${(a.tickers || []).join(" ")}`.toLowerCase().includes(term)));
  const [featured, ...rest] = list;

  return (
    <main className="pb-24 pt-32 md:pb-36 md:pt-44" data-testid="market-analysis-page">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="font-mono text-[12px] uppercase tracking-[0.3em] text-ice">Notes from the desk</motion.p>
            <h1 className="mt-6 font-display font-cond text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-[5.2rem]" data-testid="market-title">
              <MaskLines delay={0.25} lines={["Market Analysis", <span key="c" className="text-outline">& Commentary</span>]} />
            </h1>
            <FadeUp delay={0.5} className="mt-10 max-w-xl">
            <p className="text-base leading-relaxed text-slate-300">Equities, macro and commodities — read through the lens of someone who has run the plant and built the business case.</p>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" style={{ "--brand": "#0A66C2" }} className="social-link mt-6 inline-flex items-center gap-3 rounded-full border border-line px-5 py-3 text-slate-100" data-testid="market-follow-linkedin">
              <span className="social-icon-stack"><Linkedin className="h-4 w-4" /><Linkedin className="h-4 w-4" /></span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Follow on LinkedIn</span>
            </a>
            </FadeUp>
          </div>
          <motion.figure
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="group relative w-full max-w-[260px] sm:max-w-[300px] lg:col-span-4 lg:ml-auto"
            data-testid="market-hero-photo"
          >
            <div className="relative">
              <span aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-[22px] border border-ice/40 transition-transform duration-700 group-hover:translate-x-4 group-hover:translate-y-4" />
              <span aria-hidden="true" className="dot-grid absolute -left-6 -top-6 h-24 w-24 opacity-80" />
              <div className="relative overflow-hidden rounded-[22px] bg-ink-deep shadow-[0_40px_90px_-30px_rgba(56,189,248,0.45)] ring-1 ring-white/10">
              <img src="/img/wall-street-bull.jpg" alt="Itumeleng Kgongwane with the Charging Bull on Wall Street, New York" width="720" height="1280" className="block aspect-[9/16] h-auto w-full object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]" />
              </div>
            </div>
            <figcaption className="relative mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-300">
              <span className="h-px w-8 bg-ice" /> Charging Bull · Lower Manhattan
            </figcaption>
          </motion.figure>
        </div>

        <FadeUp delay={0.3} className="mt-14 flex flex-col gap-5 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible" data-testid="market-filters">
            {["All", ...CATEGORIES].map((c) => (
              <button key={c} onClick={() => setCat(c)} data-testid={`market-filter-${c.split(" ")[0].toLowerCase()}`} className={`relative shrink-0 rounded-full px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${cat === c ? "text-ink-deep" : "border border-line text-slate-300 hover:text-white"}`}>
                {cat === c && <motion.span layoutId="mk-filter" className="absolute inset-0 rounded-full bg-ice" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
          <label className="relative flex items-center lg:w-72">
            <Search className="absolute left-4 h-4 w-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search titles or tickers" data-testid="market-search-input" className="h-11 w-full rounded-full border border-line bg-ink-deep/60 pl-11 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-ice/60 focus:outline-none" />
          </label>
        </FadeUp>

        <div className="mt-12 space-y-6">
          {featured && <FadeUp><ArticleCard a={featured} featured /></FadeUp>}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => <FadeUp key={a.id} delay={(i % 3) * 0.08} className="h-full"><ArticleCard a={a} /></FadeUp>)}
          </div>
          {!isLoading && list.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line p-14 text-center text-slate-400" data-testid="market-empty">
              {isError ? "Commentary is temporarily unavailable." : "No articles match this filter yet."}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
