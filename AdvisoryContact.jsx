import { MapPin, Mail, Check } from "lucide-react";
import { FadeUp, SectionLabel } from "../site/Reveal";
import { SocialLinks } from "../site/SocialLinks";
import { BookingForm } from "./BookingForm";
import { BookingsTable } from "./BookingsTable";
import { PROFILE, ADVISORY_AREAS } from "../../data/content";
import { LogoMark } from "../site/Logo";

const ContactCard = () => (
  <div className="relative overflow-hidden rounded-3xl border border-line bg-ink-raised/50 p-7 md:p-9" data-testid="contact-card">
    <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
    <div className="relative">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-ink-deep"><LogoMark className="h-8 w-8" /></span>
        <div>
          <p className="font-display text-xl font-bold text-white">{PROFILE.name}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-300">{PROFILE.credentials}</p>
        </div>
      </div>
      <p className="mt-6 flex items-center gap-2 text-sm text-slate-300"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative h-2 w-2 rounded-full bg-emerald-400" /></span> Accepting advisory engagements</p>
      <ul className="mt-8 space-y-3">
        {ADVISORY_AREAS.map((a) => (
          <li key={a} className="flex gap-3 text-[15px] text-slate-200"><Check className="mt-0.5 h-4 w-4 shrink-0 text-ice" />{a}</li>
        ))}
      </ul>
      <div className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
        <a href={`mailto:${PROFILE.email}`} className="link-underline flex w-fit items-center gap-3 text-white" data-testid="contact-email-link"><Mail className="h-4 w-4 text-ice" />{PROFILE.email}</a>
        <p className="flex items-center gap-3 text-slate-300"><MapPin className="h-4 w-4 text-ice" />{PROFILE.location}</p>
      </div>
      <div className="mt-8"><SocialLinks size="sm" /></div>
    </div>
  </div>
);

export const AdvisoryContact = ({ showHeading = true }) => (
  <section id="advisory" className="relative border-t border-line py-24 md:py-36" data-testid="advisory-section">
    <div className="container-x">
      {showHeading && (
        <div className="max-w-3xl">
          <FadeUp><SectionLabel index="04" label="Advisory" /></FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-8 font-display font-cond text-4xl font-bold leading-[1.02] tracking-tight text-white md:text-6xl">
              Have a decision where the <span className="text-ice">chemistry</span> meets the capital?
            </h2>
          </FadeUp>
        </div>
      )}
      <div className={`grid gap-6 lg:grid-cols-12 ${showHeading ? "mt-16" : ""}`}>
        <FadeUp className="lg:col-span-5"><ContactCard /></FadeUp>
        <FadeUp delay={0.1} className="lg:col-span-7"><BookingForm /></FadeUp>
      </div>
      <FadeUp className="mt-6"><BookingsTable /></FadeUp>
    </div>
  </section>
);
