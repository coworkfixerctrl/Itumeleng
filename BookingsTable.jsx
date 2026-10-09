import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { api, asArray, fmtDate } from "../../lib/api";

export const STATUS_STYLE = {
  Pending: "border-amber-300/40 bg-amber-300/10 text-amber-200",
  Confirmed: "border-ice/40 bg-ice/10 text-ice",
  Completed: "border-emerald-300/40 bg-emerald-300/10 text-emerald-200",
  Declined: "border-rose-300/40 bg-rose-300/10 text-rose-200",
};

export const StatusPill = ({ s }) => (
  <span className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-[11px] ${STATUS_STYLE[s] || STATUS_STYLE.Pending}`}>{s}</span>
);

export const BookingsTable = () => {
  const { data, isLoading, isError } = useQuery({ queryKey: ["bookings"], queryFn: () => api.get("/bookings").then((r) => r.data), refetchInterval: 30000 });
  const rows = asArray(data);

  return (
    <div className="rounded-3xl border border-line bg-ink-deep/60" data-testid="bookings-table">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line p-6 md:p-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ice">Live ledger</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-white">Consultation requests</h3>
        </div>
        <p className="max-w-xs text-sm text-slate-400">Names are shortened and emails masked for privacy.</p>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="border-line hover:bg-transparent">
              {["Ref", "Client", "Company", "Topic", "Preferred slot", "Status", "Received"].map((h) => (
                <TableHead key={h} className="h-12 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-300">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((b) => (
              <TableRow key={b.id} className="border-line transition-colors hover:bg-white/[0.03]" data-testid={`booking-row-${b.ref}`}>
                <TableCell className="font-mono text-xs text-ice">{b.ref}</TableCell>
                <TableCell><p className="text-sm font-semibold text-white">{b.name}</p><p className="font-mono text-[11px] text-slate-400">{b.email}</p></TableCell>
                <TableCell className="text-sm text-slate-300">{b.company || "—"}</TableCell>
                <TableCell className="text-sm text-slate-300">{b.topic}</TableCell>
                <TableCell className="whitespace-nowrap text-sm text-slate-300">{fmtDate(`${b.preferred_date}T00:00:00`)} · {b.preferred_time}</TableCell>
                <TableCell><StatusPill s={b.status} /></TableCell>
                <TableCell className="whitespace-nowrap text-sm text-slate-400">{fmtDate(b.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!isLoading && rows.length === 0 && (
          <p className="p-10 text-center text-sm text-slate-400" data-testid="bookings-empty">
            {isError ? "The ledger is temporarily unavailable." : "No requests yet — be the first to book a consultation."}
          </p>
        )}
      </div>
    </div>
  );
};
