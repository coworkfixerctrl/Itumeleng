import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Award, GraduationCap, TrendingUp } from "lucide-react";
import { Counter } from "../site/Counter";

const card = "card-glow relative overflow-hidden rounded-2xl border border-line bg-ink-deep/80 p-6 backdrop-blur-md";

const onGlow = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
};

const Bars = () => (
  <div className="flex h-24 items-end gap-3" aria-hidden="true">
    {[{ v: 36, l: "Y1" }, { v: 51, l: "Y2" }].map((b, i) => (
      <div key={b.l} className="flex flex-col items-center gap-2">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${b.v * 1.5}px` }}
          transition={{ duration: 1.2, delay: 1.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={`w-9 rounded-t-md ${i ? "bg-ice" : "bg-ice/40"}`}
        />
        <span className="font-mono text-[11px] text-slate-300">{b.l}</span>
      </div>
    ))}
  </div>
);

const item = (i) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay: 0.7 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
});

export const Bento = () => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 18 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <div className="[perspective:1400px]" onMouseMove={onMove} onMouseLeave={reset}>
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="grid grid-cols-2 gap-4 [transform-style:preserve-3d]" data-testid="hero-bento">
        <motion.div {...item(0)} onMouseMove={onGlow} className={`${card} col-span-2`} data-testid="bento-ebitda">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ice"><TrendingUp className="h-3.5 w-3.5" /> Sustainable packaging</p>
              <p className="mt-4 font-display font-cond text-6xl font-extrabold leading-none text-white sm:text-7xl">
                <Counter prefix="R" to={87} suffix="M" delay={0.9} />
              </p>
              <p className="mt-3 max-w-[16rem] text-sm text-slate-300">EBITDA in the first two years after launch — market share from 0 to 16% in year one.</p>
            </div>
            <Bars />
          </div>
        </motion.div>
        <motion.div {...item(1)} onMouseMove={onGlow} className={card} data-testid="bento-npv">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ice"><Award className="h-3.5 w-3.5" /> MFC scale-up</p>
          <p className="mt-4 font-display font-cond text-4xl font-extrabold leading-none text-white sm:text-5xl">
            <Counter prefix="R" to={203} suffix="M" delay={1.05} />
          </p>
          <p className="mt-3 text-sm text-slate-300">15-year NPV · +R24M EBITDA a year</p>
        </motion.div>
        <motion.div {...item(2)} onMouseMove={onGlow} className={card} data-testid="bento-credentials">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ice"><GraduationCap className="h-3.5 w-3.5" /> Fordham MS Fin</p>
          <p className="mt-4 font-display font-cond text-4xl font-extrabold leading-none text-white sm:text-5xl">
            <Counter to={3.94} decimals={2} delay={1.2} />
          </p>
          <p className="mt-3 text-sm text-slate-300">GPA, Summa Cum Laude · MBA · BSc Chem Eng</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
