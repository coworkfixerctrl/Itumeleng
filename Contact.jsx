import { MaskLines, FadeUp } from "../components/site/Reveal";
import { SocialLinks } from "../components/site/SocialLinks";
import { AdvisoryContact } from "../components/advisory/AdvisoryContact";
import { PROFILE } from "../data/content";

export default function Contact() {
  return (
    <main className="pt-32 md:pt-44" data-testid="contact-page">
      <section className="container-x pb-20">
        <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-ice">Advisory & Contact</p>
        <h1 className="mt-6 font-display font-cond text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-[5.6rem]" data-testid="contact-title">
          <MaskLines delay={0.2} lines={["Let's turn your", <span key="b">technical edge into <span className="text-ice">value.</span></span>]} />
        </h1>
        <FadeUp delay={0.6} className="mt-14 flex flex-col gap-8 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
          <a href={`mailto:${PROFILE.email}`} className="link-underline w-fit font-display text-2xl font-semibold text-white md:text-4xl" data-testid="contact-page-email">{PROFILE.email}</a>
          <SocialLinks />
        </FadeUp>
      </section>
      <AdvisoryContact showHeading={false} />
    </main>
  );
}
