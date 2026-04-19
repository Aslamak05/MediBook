import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/AppShell";
import { Calendar, ShieldCheck, Stethoscope, Bell, BadgeCheck, Clock } from "lucide-react";
import hero from "@/assets/hero-doctor.jpg";

const features = [
  { icon: Calendar, title: "Slot-based booking", desc: "Pick from a doctor's real availability. No double-bookings, ever." },
  { icon: Bell, title: "Smart reminders", desc: "Booking confirmation plus 1 day, 1 hour, and 15 minute nudges." },
  { icon: BadgeCheck, title: "Verified doctors", desc: "Every doctor is reviewed and approved by an administrator." },
  { icon: Stethoscope, title: "Digital prescriptions", desc: "Doctors add prescriptions; patients view them instantly." },
  { icon: ShieldCheck, title: "Role-based access", desc: "Separate, secure portals for patients, doctors, and admins." },
  { icon: Clock, title: "Fair policies", desc: "24-hour cancellation rule with auto-reschedule to the next slot." },
];

const Index = () => {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full border bg-secondary/40 px-3 py-1 text-xs font-medium text-secondary-foreground">
              Trusted by patients & clinicians
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Care, on schedule.
              <span className="block text-accent">Booked in seconds.</span>
            </h1>
            <p className="max-w-prose text-base text-muted-foreground md:text-lg">
              MediBook brings patients, doctors, and clinic operations into a single trusted workflow.
              Find verified specialists, book real-time slots, and get prescriptions delivered to your dashboard.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link to="/register">Get started — it's free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">I already have an account</Link>
              </Button>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4 border-t pt-6 text-sm">
              <div><div className="font-display text-2xl font-bold">120+</div><div className="text-muted-foreground">Verified doctors</div></div>
              <div><div className="font-display text-2xl font-bold">15k</div><div className="text-muted-foreground">Visits booked</div></div>
              <div><div className="font-display text-2xl font-bold">4.8★</div><div className="text-muted-foreground">Patient rating</div></div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] gradient-hero opacity-20 blur-2xl" />
            <div className="overflow-hidden rounded-[2rem] border bg-card shadow-[var(--shadow-elevated)]">
              <img
                src={hero}
                alt="Doctor in a modern consultation room"
                width={1024}
                height={1024}
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-6 right-6 flex items-center justify-between rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)] md:left-auto md:right-6 md:max-w-xs">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Next available</div>
                <div className="font-display text-lg font-semibold">Today · 11:00 AM</div>
                <div className="text-xs text-muted-foreground">Dr. Anika Rao · Cardiology</div>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground">
                <Calendar className="h-5 w-5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-gradient-soft">
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Everything a modern clinic needs</h2>
            <p className="mt-3 text-muted-foreground">
              Three role-based portals that talk to one clean API. Built for real-world clinical workflows.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="clinical-card p-6">
                <span className="mb-4 inline-grid h-11 w-11 place-items-center rounded-lg bg-accent/10 text-accent">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo creds */}
      <section className="container py-12">
        <div className="clinical-card mx-auto max-w-3xl p-6">
          <h3 className="font-display text-lg font-semibold">Demo accounts</h3>
          <p className="mt-1 text-sm text-muted-foreground">All data is stored locally in your browser for the demo.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { role: "Patient", email: "patient@demo.com", pw: "Demo@123" },
              { role: "Doctor", email: "doctor@demo.com", pw: "Demo@123" },
              { role: "Admin", email: "admin@demo.com", pw: "Demo@123" },
            ].map((c) => (
              <div key={c.role} className="rounded-lg border bg-muted/40 p-3 text-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-accent">{c.role}</div>
                <div className="mt-1 font-mono text-xs">{c.email}</div>
                <div className="font-mono text-xs text-muted-foreground">{c.pw}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default Index;
