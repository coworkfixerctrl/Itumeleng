import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, ArrowUpRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../ui/sheet";
import { Logo } from "./Logo";
import { scrollToId } from "../../lib/lenis";

const LINKS = [
  { label: "Overview", hash: "overview" },
  { label: "Trajectory", hash: "trajectory" },
  { label: "Case Studies", hash: "case-studies" },
  { label: "Market Analysis", to: "/market-analysis" },
  { label: "Contact", to: "/contact" },
];

const useGo = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (l) => {
    if (l.to) return navigate(l.to);
    if (pathname === "/") return scrollToId(l.hash);
    return navigate(`/#${l.hash}`);
  };
};

const NavItem = ({ l, onClick, active }) => (
  <button
    data-testid={`nav-link-${(l.hash || l.to).replace("/", "")}`}
    onClick={onClick}
    className={`relative font-mono text-[12px] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-white ${active ? "text-white" : "text-slate-300"}`}
  >
    {l.label}
    {active && <motion.span layoutId="nav-active" className="absolute -bottom-2 left-0 h-px w-full bg-ice" />}
  </button>
);

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const go = useGo();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (l) => (l.to ? pathname.startsWith(l.to) : false);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      data-testid="site-header"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${scrolled ? "border-b border-line bg-ink/75 backdrop-blur-xl" : "border-b border-transparent"}`}
    >
      <div className="container-x flex h-[72px] items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="group" onClick={() => pathname === "/" && scrollToId("overview")}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => <NavItem key={l.label} l={l} active={isActive(l)} onClick={() => go(l)} />)}
        </nav>
        <div className="flex items-center gap-3">
          <button
            data-testid="nav-book-call-btn"
            onClick={() => go({ hash: "advisory" })}
            className="group hidden items-center gap-2 rounded-full bg-ice px-5 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-deep transition-[transform,background-color] duration-300 hover:scale-[1.03] hover:bg-white sm:inline-flex"
          >
            Book a call <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button data-testid="nav-mobile-menu-btn" aria-label="Open menu" className="grid h-11 w-11 place-items-center rounded-full border border-line text-white lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full border-line bg-ink-deep sm:max-w-sm" data-testid="nav-mobile-menu">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mt-14 flex flex-col gap-7">
                {[...LINKS, { label: "Book a call", hash: "advisory" }].map((l, i) => (
                  <motion.button
                    key={l.label}
                    data-testid={`mobile-nav-${(l.hash || l.to).replace("/", "")}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={() => { setOpen(false); setTimeout(() => go(l), 250); }}
                    className="text-left font-display font-cond text-4xl font-bold text-white hover:text-ice"
                  >
                    {l.label}
                  </motion.button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};
