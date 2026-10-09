import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { Toaster } from "./components/ui/sonner";
import { Nav } from "./components/site/Nav";
import { Footer } from "./components/site/Footer";
import { lenisRef } from "./lib/lenis";
import Home from "./pages/Home";
import MarketAnalysis from "./pages/MarketAnalysis";
import ArticleDetail from "./pages/ArticleDetail";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null; };
  }, []);
  return null;
};

const ScrollTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative min-h-screen bg-ink">
        <BrowserRouter>
          <SmoothScroll />
          <ScrollTop />
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/market-analysis" element={<MarketAnalysis />} />
            <Route path="/market-analysis/:slug" element={<ArticleDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Footer />
        </BrowserRouter>
        <Toaster position="bottom-right" theme="dark" richColors />
      </div>
    </MotionConfig>
  );
}

export default App;
