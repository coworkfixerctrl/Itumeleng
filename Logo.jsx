export const LogoMark = ({ className = "h-8 w-8" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <polygon points="16,3.5 26.8,9.75 26.8,22.25 16,28.5 5.2,22.25 5.2,9.75" fill="none" stroke="#F8FAFC" strokeWidth="1.6" strokeLinejoin="round" />
    <polyline points="9.5,20.5 14,16 17.5,18.5 22.5,11.5" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="22.5" cy="11.5" r="2.2" fill="#38BDF8" />
  </svg>
);

export const Logo = () => (
  <span className="flex items-center gap-3">
    <LogoMark className="h-8 w-8 transition-transform duration-700 group-hover:rotate-[60deg]" />
    <span className="flex flex-col leading-none">
      <span className="font-display font-wide text-[15px] font-extrabold tracking-[0.18em] text-white">KGONGWANE</span>
      <span className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.28em] text-slate-300">Molecule → Margin</span>
    </span>
  </span>
);
