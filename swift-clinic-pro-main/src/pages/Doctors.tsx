import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AppSettings, Doctor } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star } from "lucide-react";
import { BookingDialog } from "@/components/BookingDialog";

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Doctor | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    Promise.all([api.listApprovedDoctors(), api.getSettings()]).then(([d, s]) => {
      setDoctors(d);
      setSettings(s);
    });
  }, []);

  const filtered = doctors.filter((d) =>
    `${d.name} ${d.specialization}`.toLowerCase().includes(q.toLowerCase())
  );

  const totalFee = (d: Doctor) =>
    settings ? d.fee + Math.round((d.fee * settings.commissionPercent) / 100) : d.fee;

  return (
    <AppShell>
      <section className="container py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Find a doctor</h1>
            <p className="mt-1 text-sm text-muted-foreground">Browse verified specialists and book a slot.</p>
          </div>
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or specialty…" className="pl-9" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <article key={d.id} className="clinical-card flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold">{d.name}</h3>
                  <p className="text-sm text-accent">{d.specialization}</p>
                </div>
                {d.rating && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium">
                    <Star className="h-3 w-3 fill-current" /> {d.rating}
                  </span>
                )}
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{d.bio}</p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div><dt>Experience</dt><dd className="text-foreground">{d.experienceYears} yrs</dd></div>
                <div><dt>Qualifications</dt><dd className="text-foreground">{d.qualifications}</dd></div>
              </dl>
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <div>
                  <div className="text-xs text-muted-foreground">Total per visit</div>
                  <div className="font-display text-lg font-bold">₹{totalFee(d)}</div>
                </div>
                <Button onClick={() => { setPicked(d); setOpen(true); }}>Book slot</Button>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border bg-muted/40 p-10 text-center text-sm text-muted-foreground">
              No doctors match your search.
            </div>
          )}
        </div>

        <BookingDialog doctor={picked} open={open} onOpenChange={setOpen} onBooked={() => {}} />
      </section>
    </AppShell>
  );
}
