import { Link } from "react-router-dom";
import { SocialLinks } from "./SocialLinks";
import { LogoMark } from "./Logo";
import { PROFILE } from "../../data/content";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-line bg-ink-deep" data-testid="site-footer">
    <div className="container-x py-16 md:py-20">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ice">Let's build value</p>
          <p className="mt-4 text-base text-slate-300">
            Engineering precision, translated into capital decisions. Open to advisory, board and speaking conversations.
          </p>
        </div>
        <SocialLinks size="sm" />
      </div>
      <div className="mt-16 select-none font-display font-wide text-[15vw] font-black leading-[0.8] tracking-tight text-white/[0.06] md:text-[11vw]" aria-hidden="true">
        KGONGWANE
      </div>
      <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <span className="flex items-center gap-3"><LogoMark className="h-5 w-5" /> © 2026 {PROFILE.name}</span>
        <span className="flex gap-6">
          <Link to="/market-analysis" className="link-underline hover:text-white" data-testid="footer-market-link">Market Analysis</Link>
          <Link to="/contact" className="link-underline hover:text-white" data-testid="footer-contact-link">Contact</Link>
          <Link to="/admin" className="link-underline hover:text-white" data-testid="footer-admin-link">Admin</Link>
        </span>
      </div>
    </div>
  </footer>
);
