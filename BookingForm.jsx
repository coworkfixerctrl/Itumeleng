import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { api, formatErr } from "../../lib/api";
import { TOPICS, TIME_SLOTS } from "../../data/content";

const EMPTY = { name: "", email: "", company: "", topic: "", time: "", message: "" };
const field = "h-12 rounded-xl border-line bg-ink/60 text-white placeholder:text-slate-400 focus-visible:ring-ice/60";

const Field = ({ label, children, htmlFor }) => (
  <div className="space-y-2">
    <Label htmlFor={htmlFor} className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-300">{label}</Label>
    {children}
  </div>
);

export const BookingForm = () => {
  const [f, setF] = useState(EMPTY);
  const [date, setDate] = useState();
  const [dateOpen, setDateOpen] = useState(false);
  const qc = useQueryClient();
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e?.target ? e.target.value : e }));
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const m = useMutation({
    mutationFn: (body) => api.post("/bookings", body).then((r) => r.data),
    onSuccess: (b) => {
      toast.success(`Request ${b?.ref ?? ""} received`, { description: "I'll confirm your consultation slot by email." });
      setF(EMPTY); setDate(undefined);
      qc.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (e) => toast.error(formatErr(e)),
  });

  const submit = (e) => {
    e.preventDefault();
    if (!f.topic || !date || !f.time) return toast.error("Please choose a topic, date and time.");
    m.mutate({ name: f.name, email: f.email, company: f.company, topic: f.topic, preferred_date: format(date, "yyyy-MM-dd"), preferred_time: `${f.time} SAST`, message: f.message });
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-line bg-ink-deep/80 p-6 md:p-9" data-testid="booking-form">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-2xl font-bold text-white">Book a consultation</h3>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ice">45 min · Video call</span>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="bk-name"><Input id="bk-name" required minLength={2} value={f.name} onChange={set("name")} placeholder="Jane Doe" className={field} data-testid="booking-name-input" /></Field>
        <Field label="Email" htmlFor="bk-email"><Input id="bk-email" type="email" required value={f.email} onChange={set("email")} placeholder="jane@company.com" className={field} data-testid="booking-email-input" /></Field>
        <Field label="Company" htmlFor="bk-company"><Input id="bk-company" value={f.company} onChange={set("company")} placeholder="Organisation" className={field} data-testid="booking-company-input" /></Field>
        <Field label="Advisory topic">
          <Select value={f.topic} onValueChange={set("topic")}>
            <SelectTrigger className={field} data-testid="booking-topic-select"><SelectValue placeholder="Select a topic" /></SelectTrigger>
            <SelectContent data-lenis-prevent className="border-line bg-ink-deep text-white">
              {TOPICS.map((t) => <SelectItem key={t} value={t} data-testid={`booking-topic-option-${t.split(" ")[0].toLowerCase()}`}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Preferred date">
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <button type="button" data-testid="booking-date-btn" className={`${field} flex w-full items-center justify-between border px-3 text-left text-sm ${date ? "text-white" : "text-slate-400"}`}>
                {date ? format(date, "EEE, d MMM yyyy") : "Pick a date"} <CalendarIcon className="h-4 w-4 text-ice" />
              </button>
            </PopoverTrigger>
            <PopoverContent data-lenis-prevent className="w-auto border-line bg-ink-deep p-0 text-white" align="start">
              <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setDateOpen(false); }} disabled={(d) => d < today || d.getDay() === 0 || d.getDay() === 6} initialFocus data-testid="booking-calendar" />
            </PopoverContent>
          </Popover>
        </Field>
        <Field label="Preferred time (SAST)">
          <Select value={f.time} onValueChange={set("time")}>
            <SelectTrigger className={field} data-testid="booking-time-select"><SelectValue placeholder="Select a time" /></SelectTrigger>
            <SelectContent data-lenis-prevent className="border-line bg-ink-deep text-white">
              {TIME_SLOTS.map((t) => <SelectItem key={t} value={t} data-testid={`booking-time-option-${t.replace(":", "")}`}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="mt-5">
        <Field label="Project brief" htmlFor="bk-msg"><Textarea id="bk-msg" rows={4} value={f.message} onChange={set("message")} maxLength={2000} placeholder="What decision are you trying to make?" className="rounded-xl border-line bg-ink/60 text-white placeholder:text-slate-400 focus-visible:ring-ice/60" data-testid="booking-message-input" /></Field>
      </div>
      <button
        type="submit"
        disabled={m.isPending}
        data-testid="booking-submit-btn"
        className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-ice px-7 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-deep transition-[transform,background-color] duration-300 hover:scale-[1.01] hover:bg-white disabled:opacity-60 sm:w-auto"
      >
        {m.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />}
        Request consultation
      </button>
    </form>
  );
};
