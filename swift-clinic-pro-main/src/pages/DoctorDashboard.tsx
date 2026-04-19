import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Appointment, Doctor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppointmentCard } from "@/components/AppointmentCard";
import { PrescriptionWriter } from "@/components/PrescriptionWriter";
import { SlotManager } from "@/components/SlotManager";
import { toast } from "sonner";
import { Calendar, CheckCircle2, Clock, IndianRupee } from "lucide-react";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [items, setItems] = useState<Appointment[]>([]);
  const [rxOpen, setRxOpen] = useState(false);
  const [rxAppt, setRxAppt] = useState<string | null>(null);
  const [slotsOpen, setSlotsOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const d = await api.getDoctorByUserId(user.id);
    setDoctor(d);
    if (d) setItems(await api.listAppointmentsForDoctor(d.id));
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (!user) return null;
  if (!doctor) {
    return (
      <AppShell>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">No doctor profile linked to this account.</p>
        </div>
      </AppShell>
    );
  }

  const upcoming = items.filter((a) => new Date(a.startsAt).getTime() >= Date.now() && a.status !== "cancelled");
  const completed = items.filter((a) => a.status === "completed");
  const earnings = completed.reduce((acc, a) => acc + a.doctorFee, 0);

  const stats = [
    { icon: Calendar, label: "Upcoming", value: upcoming.length },
    { icon: CheckCircle2, label: "Completed", value: completed.length },
    { icon: IndianRupee, label: "Earnings (₹)", value: earnings.toLocaleString() },
    { icon: Clock, label: "Total appts", value: items.length },
  ];

  return (
    <AppShell>
      <section className="container py-10">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Doctor portal</p>
            <h1 className="font-display text-3xl font-bold">{doctor.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="outline" className="text-accent">{doctor.specialization}</Badge>
              <span className="text-muted-foreground">{doctor.qualifications}</span>
              {doctor.status === "approved" ? (
                <Badge className="bg-success text-success-foreground hover:bg-success">Approved</Badge>
              ) : doctor.status === "pending" ? (
                <Badge className="bg-warning text-warning-foreground hover:bg-warning">Pending approval</Badge>
              ) : (
                <Badge variant="destructive">Rejected</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setSlotsOpen(true)}>Manage slots</Button>
          </div>
        </header>

        {doctor.status !== "approved" && (
          <div className="mt-6 rounded-xl border bg-warning/10 p-4 text-sm">
            Your profile is pending admin approval. Patients won't see you in the directory until you're approved, but you can already prepare your slots.
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
          <h2 className="font-display text-xl font-semibold">Upcoming appointments</h2>
          <div className="mt-3 space-y-3">
            {upcoming.length === 0 && (
              <div className="rounded-xl border bg-muted/40 p-6 text-sm text-muted-foreground">
                No upcoming appointments. Add slots to start receiving bookings.
              </div>
            )}
            {upcoming.map((a) => (
              <AppointmentCard
                key={a.id}
                appt={a}
                perspective="doctor"
                onComplete={async () => {
                  await api.setAppointmentStatus(a.id, "completed");
                  toast.success("Marked complete");
                  load();
                }}
                onAddPrescription={() => { setRxAppt(a.id); setRxOpen(true); }}
              />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold">Past appointments</h2>
          <div className="mt-3 space-y-3">
            {items
              .filter((a) => new Date(a.startsAt).getTime() < Date.now() || a.status === "cancelled" || a.status === "completed")
              .map((a) => (
                <AppointmentCard
                  key={a.id}
                  appt={a}
                  perspective="doctor"
                  onAddPrescription={() => { setRxAppt(a.id); setRxOpen(true); }}
                />
              ))}
          </div>
        </div>

        <PrescriptionWriter appointmentId={rxAppt} open={rxOpen} onOpenChange={setRxOpen} onSaved={load} />
        <SlotManager doctorId={doctor.id} open={slotsOpen} onOpenChange={setSlotsOpen} />
      </section>
    </AppShell>
  );
}
