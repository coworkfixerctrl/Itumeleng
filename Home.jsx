import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "../components/home/Hero";
import { Marquee } from "../components/home/Marquee";
import { Profile } from "../components/home/Profile";
import { Timeline } from "../components/home/Timeline";
import { CaseStudies } from "../components/home/CaseStudies";
import { AdvisoryContact } from "../components/advisory/AdvisoryContact";
import { scrollToId } from "../lib/lenis";

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;
    const t = setTimeout(() => scrollToId(hash.slice(1)), 350);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <main data-testid="home-page">
      <Hero />
      <Marquee />
      <Profile />
      <Timeline />
      <CaseStudies />
      <AdvisoryContact />
    </main>
  );
}
