import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

export const Counter = ({ to, decimals = 0, prefix = "", suffix = "", duration = 1.8, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, to, { duration, delay, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(v) });
    return () => controls.stop();
  }, [inView, to, duration, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
};
