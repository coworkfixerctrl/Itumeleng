import { motion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1];

export const FadeUp = ({ children, delay = 0, className = "", y = 28, ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.9, ease: EASE, delay }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const MaskLines = ({ lines, delay = 0, className = "" }) =>
  lines.map((line, i) => (
    <span key={i} className={`block overflow-hidden pb-[0.06em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1], delay: delay + i * 0.11 }}
      >
        {line}
      </motion.span>
    </span>
  ));

export const SectionLabel = ({ index, label }) => (
  <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-ice">
    <span>{index}</span>
    <span className="h-px w-10 bg-ice/60" />
    <span className="text-slate-300">{label}</span>
  </div>
);
