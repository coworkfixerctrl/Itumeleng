import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Lattice } from "../site/Lattice";
import { MaskLines } from "../site/Reveal";
import { Bento } from "./Bento";
import { scrollToId } from "../../lib/lenis";

const fade = (d) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: d, ease: [0.16, 1, 0.3, 1] } });

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const latticeY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section ref={ref} id="overview" className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 lg:pt-24" data-testid="hero-section">
      <motion.div style={{ y: latticeY }} className="absolute inset-0 opacity-90">
        <Lattice />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(56,189,248,0.10),transparent_55%),linear-gradient(to_bottom,transparent_60%,#1e293b)]" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <motion.div style={{ y: textY }} className="lg:col-span-7">
          <motion.p {...fade(0.3)} className="flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.28em] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-ice shadow-[0_0_16px_#38BDF8]" />
            Chemical Engineering <span className="text-ice">×</span> Corporate Finance
          </motion.p>
          <h1 className="mt-7 font-display font-cond text-[2.9rem] font-extrabold leading-[0.94] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[5.4rem]" data-testid="hero-headline">
            <MaskLines
              delay={0.35}
              lines={[
                "Bridging",
                <>Molecular <span className="text-ice">Execution</span></>,
                <>and <span className="text-outline">Corporate</span></>,
                "Strategy.",
              ]}
            />
          </h1>
          <motion.p {...fade(0.95)} className="mt-8 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
            I'm Itumeleng D. Kgongwane — a Lead Engineer at Sappi R&D with an MS Finance (Fordham) and an MBA (GIBS).
            For two decades I've turned process breakthroughs into EBITDA, NPV and market share.
          </motion.p>
          <motion.div {...fade(1.1)} className="mt-10 flex flex-wrap items-center gap-4">
            <button
              data-testid="hero-case-studies-btn"
              onClick={() => scrollToId("case-studies")}
              className="group inline-flex items-center gap-3 rounded-full bg-ice px-7 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-deep transition-[transform,background-color] duration-300 hover:scale-[1.03] hover:bg-white"
            >
              View case studies <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </button>
            <button
              data-testid="hero-book-btn"
              onClick={() => scrollToId("advisory")}
              className="inline-flex items-center gap-3 rounded-full border border-white/25 px-7 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-[border-color,background-color] duration-300 hover:border-ice hover:bg-ice/10"
            >
              Schedule advisory call
            </button>
          </motion.div>
        </motion.div>
        <div className="lg:col-span-5">
          <Bento />
        </div>
      </div>

      <motion.button
        {...fade(1.6)}
        onClick={() => scrollToId("profile")}
        data-testid="hero-scroll-indicator"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-slate-300 md:flex"
      >
        <ArrowDown className="h-4 w-4 animate-bounce text-ice" /> Scroll
      </motion.button>
    </section>
  );
};
