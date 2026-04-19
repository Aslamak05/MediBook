import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Appointment } from "@/lib/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppointmentCard } from "@/components/AppointmentCard";
import { PrescriptionDialog } from "@/components/PrescriptionDialog";
import { toast } from "sonner";
import { Calendar, Stethoscope, FileText } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState<Appointment[]>([]);
  const [rxAppt, setRxAppt] = useState<string | null>(null);
  const [rxOpen, setRxOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setItems(await api.listAppointmentsForUser(user.id));
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) return null;

  const upcoming = items.filter((a) => new Date(a.startsAt).getTime() >= Date.now() && a.status !== "cancelled");
  const past = items.filter((a) => new Date(a.startsAt).getTime() < Date.now() || a.status === "cancelled");

  const stats = [
    { icon: Calendar, label: "Upcoming visits", value: upcoming.length },
    { icon: Stethoscope, label: "Total appointments", value: items.length },
    { icon: FileText, label: "Prescriptions", value: items.filter((a) => a.prescriptionId).length },
  ];

  return (
    <AppShell>
      <section className="container py-10">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="font-display text-3xl font-bold">{user.name.split(" ")[0]}'s health hub</h1>
          </div>
          <Button asChild><Link to="/doctors">Find a doctor</Link></Button>
        </header>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="clinical-card flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold">Upcoming</h2>
          <div className="mt-3 space-y-3">
            {upcoming.length === 0 && (
              <div className="rounded-xl border bg-muted/40 p-6 text-sm text-muted-foreground">
                Nothing scheduled. <Link to="/doctors" className="font-medium text-foreground underline">Book your first visit →</Link>
              </div>
            )}
            {upcoming.map((a) => (
              <AppointmentCard
                key={a.id}
                appt={a}
                perspective="user"
                onCancel={async () => {
                  try { await api.cancelAppointment(a.id, user.id); toast.success("Appointment cancelled"); load(); }
                  catch (e) { toast.error(e instanceof Error ? e.message : "Cannot cancel"); }
                }}
                onReschedule={async () => {
                  try { await api.rescheduleToNextAvailable(a.id); toast.success("Moved to next available slot"); load(); }
                  catch (e) { toast.error(e instanceof Error ? e.message : "Cannot reschedule"); }
                }}
                onViewPrescription={() => { setRxAppt(a.id); setRxOpen(true); }}
              />
            ))}
          </div>
        </div>

        {past.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold">History</h2>
            <div className="mt-3 space-y-3">
              {past.map((a) => (
                <AppointmentCard
                  key={a.id}
                  appt={a}
                  perspective="user"
                  onViewPrescription={() => { setRxAppt(a.id); setRxOpen(true); }}
                />
              ))}
            </div>
          </div>
        )}

        <PrescriptionDialog appointmentId={rxAppt} open={rxOpen} onOpenChange={setRxOpen} />
      </section>
    </AppShell>
  );
}
