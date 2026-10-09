import { useEffect, useRef } from "react";

// Honeycomb "cellulose" lattice that brightens and lifts around the cursor
export const Lattice = ({ className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let w = 0, h = 0, s = 40, hexes = [], raf = 0, visible = true, t = 0;

    const build = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s = w < 640 ? 30 : 42;
      const hx = s * Math.sqrt(3);
      hexes = [];
      for (let row = -1; row * s * 1.5 < h + s * 2; row++)
        for (let col = -1; col * hx < w + hx; col++)
          hexes.push({ x: col * hx + (row % 2 ? hx / 2 : 0), y: row * s * 1.5 });
    };

    const draw = () => {
      t += 0.008;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      ctx.clearRect(0, 0, w, h);
      for (const c of hexes) {
        const dx = c.x - mouse.x, dy = c.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const near = Math.max(0, 1 - d / 220);
        const wave = 0.5 + 0.5 * Math.sin(t * 2 + c.x * 0.006 + c.y * 0.009);
        const lift = near * 10;
        const ox = d > 0 ? (dx / d) * lift : 0, oy = d > 0 ? (dy / d) * lift : 0;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = (Math.PI / 3) * k - Math.PI / 2;
          const px = c.x + ox + s * 0.96 * Math.cos(a), py = c.y + oy + s * 0.96 * Math.sin(a);
          if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = near > 0.02 ? `rgba(56,189,248,${0.08 + near * 0.6})` : `rgba(148,163,184,${0.05 + wave * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        if (near > 0.35) {
          ctx.fillStyle = `rgba(56,189,248,${near * 0.9})`;
          ctx.beginPath(); ctx.arc(c.x + ox, c.y + oy - s * 0.96, 1.6, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
    };
    const onLeave = () => { mouse.tx = -9999; mouse.ty = -9999; };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    const ro = new ResizeObserver(build);

    build();
    ro.observe(canvas);
    io.observe(canvas);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={`h-full w-full ${className}`} aria-hidden="true" />;
};
