import { FlaskConical, TrendingUp } from "lucide-react";
import { FadeUp, SectionLabel } from "../site/Reveal";
import { CASES } from "../../data/content";

const onGlow = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
};

const CaseCard = ({ c }) => (
  <article onMouseMove={onGlow} className="card-glow group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-deep/70" data-testid={`case-card-${c.id}`}>
    <div className="relative aspect-[16/10] overflow-hidden">
      <img src={c.image} alt={c.title} loading="lazy" className="duotone h-full w-full object-cover transition-[transform,filter] duration-[1200ms] ease-out group-hover:scale-[1.06] group-hover:[filter:grayscale(0.2)_contrast(1.1)_brightness(0.9)]" />
      <div className="duotone-tint absolute inset-0 transition-opacity duration-700 group-hover:opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/20 to-transparent" />
      <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-ink-deep/60 px-3 py-1 font-mono text-[11px] text-white backdrop-blur">{c.code}</span>
      <span className="absolute right-5 top-5 font-mono text-[11px] text-slate-200">{c.years}</span>
    </div>
    <div className="flex flex-1 flex-col p-6 md:p-7">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ice">{c.sector}</p>
      <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-white">{c.title}</h3>
      <div className="mt-6 space-y-5">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-300"><FlaskConical className="h-3.5 w-3.5 text-ice" /> Technical problem</p>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-300">{c.problem}</p>
        </div>
        <div className="border-l-2 border-ice pl-4">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-300"><TrendingUp className="h-3.5 w-3.5 text-ice" /> Business outcome</p>
          <p className="mt-2 text-[15px] leading-relaxed text-white">{c.outcome}</p>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line pt-0" style={{ marginTop: "1.75rem" }}>
        {c.stats.map((s) => (
          <div key={s.l} className="bg-ink-deep p-4">
            <p className="font-display font-cond text-3xl font-extrabold text-white">{s.v}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-300">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  </article>
);

export const CaseStudies = () => (
  <section id="case-studies" className="relative py-24 md:py-36" data-testid="case-studies-section">
    <div className="container-x">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <FadeUp><SectionLabel index="03" label="Case Studies" /></FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-8 font-display font-cond text-4xl font-bold leading-[1.02] tracking-tight text-white md:text-6xl">
              Technical problems solved. <span className="text-outline">Financial outcomes</span> delivered.
            </h2>
          </FadeUp>
        </div>
        <FadeUp delay={0.2} className="lg:col-span-4 lg:self-end">
          <p className="text-base leading-relaxed text-slate-300">Cross-functional product development across R&D, production, sales and finance — each measured on the income statement.</p>
        </FadeUp>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CASES.map((c, i) => (
          <FadeUp key={c.id} delay={(i % 3) * 0.1} className="h-full"><CaseCard c={c} /></FadeUp>
        ))}
      </div>
    </div>
  </section>
);
