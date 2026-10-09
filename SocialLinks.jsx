import { Linkedin, Mail, Phone } from "lucide-react";
import { SOCIALS } from "../../data/content";

const ICONS = { linkedin: Linkedin, email: Mail, phone: Phone };

export const SocialLinks = ({ size = "lg", className = "" }) => (
  <ul className={`flex flex-wrap gap-3 ${className}`} data-testid="social-links">
    {SOCIALS.map((s) => {
      const Icon = ICONS[s.id];
      return (
        <li key={s.id}>
          <a
            href={s.href}
            target={s.id === "linkedin" ? "_blank" : undefined}
            rel="noopener noreferrer"
            data-testid={`social-link-${s.id}`}
            style={{ "--brand": s.brand, "--brand-fg": s.fg || "#fff" }}
            className={`social-link inline-flex items-center gap-3 rounded-full border border-line text-slate-100 ${size === "lg" ? "px-6 py-3.5" : "px-4 py-2.5"}`}
          >
            <span className="social-icon-stack">
              <Icon className="h-5 w-5" />
              <Icon className="h-5 w-5" />
            </span>
            <span className="font-mono text-[12px] font-medium uppercase tracking-[0.22em]">{s.label}</span>
          </a>
        </li>
      );
    })}
  </ul>
);
