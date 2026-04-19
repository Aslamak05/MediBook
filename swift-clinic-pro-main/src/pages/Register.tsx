import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Upload } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [role, setRole] = useState<"user" | "doctor">("user");
  const [busy, setBusy] = useState(false);

  // shared
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // doctor
  const [specialization, setSpecialization] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experienceYears, setExperienceYears] = useState<number | "">("");
  const [fee, setFee] = useState<number | "">("");
  const [bio, setBio] = useState("");
  const [certificateName, setCertificateName] = useState<string | undefined>();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      const u = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        role,
        specialization: role === "doctor" ? specialization.trim() : undefined,
        qualifications: role === "doctor" ? qualifications.trim() : undefined,
        experienceYears: role === "doctor" ? Number(experienceYears || 0) : undefined,
        fee: role === "doctor" ? Number(fee || 0) : undefined,
        bio: role === "doctor" ? bio.trim() : undefined,
        certificateName: role === "doctor" ? certificateName : undefined,
      });
      toast.success(`Welcome, ${u.name.split(" ")[0]}`);
      if (u.role === "doctor") {
        toast.message("Profile submitted for admin approval.");
        nav("/doctor", { replace: true });
      } else {
        nav("/dashboard", { replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <section className="container grid min-h-[calc(100vh-8rem)] place-items-center py-10">
        <div className="clinical-card w-full max-w-2xl p-6 md:p-8">
          <h1 className="font-display text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join MediBook in under a minute.</p>

          <Tabs value={role} onValueChange={(v) => setRole(v as "user" | "doctor")} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">I'm a patient</TabsTrigger>
              <TabsTrigger value="doctor">I'm a doctor</TabsTrigger>
            </TabsList>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 …" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>

              <TabsContent value="doctor" className="mt-2 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Specialization</Label>
                    <Input required={role === "doctor"} value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Cardiology" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Qualifications</Label>
                    <Input required={role === "doctor"} value={qualifications} onChange={(e) => setQualifications(e.target.value)} placeholder="MBBS, MD" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Experience (years)</Label>
                    <Input type="number" min={0} value={experienceYears} onChange={(e) => setExperienceYears(e.target.value === "" ? "" : Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Consultation fee (₹)</Label>
                    <Input type="number" min={0} value={fee} onChange={(e) => setFee(e.target.value === "" ? "" : Number(e.target.value))} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Short bio</Label>
                  <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A brief introduction patients will see on your profile." />
                </div>
                <div className="space-y-1.5">
                  <Label>Medical certificate</Label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 text-sm hover:bg-muted/40">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{certificateName || "Upload PDF or image (demo: filename only)"}</span>
                    <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => setCertificateName(e.target.files?.[0]?.name)} />
                  </label>
                  <p className="text-xs text-muted-foreground">Your profile becomes bookable after admin approval.</p>
                </div>
              </TabsContent>

              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </Tabs>

          <p className="mt-6 text-sm text-muted-foreground">
            Already registered? <Link to="/login" className="font-medium text-foreground underline">Sign in</Link>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
