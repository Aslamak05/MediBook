import { AppShell } from "@/components/AppShell";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Appointment, AppSettings, AuthUser, Doctor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Users, Stethoscope, Calendar, IndianRupee, Settings as SettingsIcon } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<{ users: number; doctors: number; pendingDoctors: number; appointments: number; revenue: number } | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const load = useCallback(async () => {
    const [m, d, a, u, s] = await Promise.all([
      api.adminMetrics(),
      api.listAllDoctors(),
      api.listAllAppointments(),
      api.listUsers(),
      api.getSettings(),
    ]);
    setMetrics(m); setDoctors(d); setAppts(a); setUsers(u); setSettings(s);
  }, []);

  useEffect(() => { load(); }, [load]);

  const cards = metrics ? [
    { icon: Users, label: "Patients", value: metrics.users },
    { icon: Stethoscope, label: "Doctors", value: metrics.doctors },
    { icon: Calendar, label: "Appointments", value: metrics.appointments },
    { icon: IndianRupee, label: "Commission earned (₹)", value: metrics.revenue.toLocaleString() },
  ] : [];

  return (
    <AppShell>
      <section className="container py-10">
        <header>
          <p className="text-sm text-muted-foreground">Admin console</p>
          <h1 className="font-display text-3xl font-bold">Operations dashboard</h1>
        </header>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((s) => (
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

        <Tabs defaultValue="doctors" className="mt-10">
          <TabsList>
            <TabsTrigger value="doctors">Doctors {metrics?.pendingDoctors ? <Badge variant="secondary" className="ml-2">{metrics.pendingDoctors} pending</Badge> : null}</TabsTrigger>
            <TabsTrigger value="appts">Appointments</TabsTrigger>
            <TabsTrigger value="users">Patients</TabsTrigger>
            <TabsTrigger value="settings"><SettingsIcon className="mr-1 h-4 w-4" />Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="doctors">
            <div className="clinical-card mt-4 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Fee (₹)</TableHead>
                    <TableHead>Certificate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}<div className="text-xs text-muted-foreground">{d.email}</div></TableCell>
                      <TableCell>{d.specialization}</TableCell>
                      <TableCell>₹{d.fee}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{d.certificateName || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            d.status === "approved" ? "bg-success text-success-foreground hover:bg-success" :
                            d.status === "pending" ? "bg-warning text-warning-foreground hover:bg-warning" :
                            "bg-destructive text-destructive-foreground hover:bg-destructive"
                          }
                        >
                          {d.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {d.status !== "approved" && (
                          <Button size="sm" onClick={async () => { await api.approveDoctor(d.id, true); toast.success(`${d.name} approved`); load(); }}>Approve</Button>
                        )}
                        {d.status !== "rejected" && (
                          <Button size="sm" variant="ghost" className="ml-2 text-destructive" onClick={async () => { await api.approveDoctor(d.id, false); toast.message(`${d.name} rejected`); load(); }}>Reject</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="appts">
            <div className="clinical-card mt-4 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Total (₹)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appts.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="text-sm">{format(new Date(a.startsAt), "d MMM, h:mm a")}</TableCell>
                      <TableCell>{a.userName}</TableCell>
                      <TableCell>{a.doctorName}<div className="text-xs text-muted-foreground">{a.specialization}</div></TableCell>
                      <TableCell>₹{a.totalFee}<div className="text-xs text-muted-foreground">+₹{a.commission} fee</div></TableCell>
                      <TableCell><Badge variant="outline">{a.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {appts.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No appointments yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="clinical-card mt-4 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.phone || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            {settings && (
              <div className="clinical-card mt-4 max-w-2xl space-y-4 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Brand name</Label>
                    <Input value={settings.brandName} onChange={(e) => setSettings({ ...settings, brandName: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tagline</Label>
                    <Input value={settings.brandTagline} onChange={(e) => setSettings({ ...settings, brandTagline: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Commission percentage (%)</Label>
                    <Input type="number" min={0} max={100} value={settings.commissionPercent} onChange={(e) => setSettings({ ...settings, commissionPercent: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cancel/reschedule cutoff (hours)</Label>
                    <Input type="number" min={0} value={settings.reschedulePolicyHours} onChange={(e) => setSettings({ ...settings, reschedulePolicyHours: Number(e.target.value) })} />
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    await api.updateSettings(settings);
                    toast.success("Settings saved");
                    load();
                  }}
                >
                  Save settings
                </Button>
                <p className="text-xs text-muted-foreground">
                  Commission is added on top of each doctor's fee at booking time. Cutoff blocks patients from cancelling/rescheduling within the window.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </AppShell>
  );
}
