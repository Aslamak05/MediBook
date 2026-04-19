import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: { pathname?: string } } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(email.trim(), password);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}`);
      const dest =
        loc.state?.from?.pathname ||
        (u.role === "admin" ? "/admin" : u.role === "doctor" ? "/doctor" : "/dashboard");
      nav(dest, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const fill = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <AppShell>
      <section className="container grid min-h-[calc(100vh-8rem)] place-items-center py-10">
        <div className="clinical-card w-full max-w-md p-6 md:p-8">
          <h1 className="font-display text-2xl font-bold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back. Pick up where you left off.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border bg-muted/40 p-3 text-xs">
            <div className="font-semibold">Quick demo login</div>
            <div className="mt-2 grid gap-2">
              <button type="button" className="text-left hover:underline" onClick={() => fill("admin@demo.com", "Demo@123")}>
                Admin — admin@demo.com
              </button>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            New to MediBook? <Link to="/register" className="font-medium text-foreground underline">Create an account</Link>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
