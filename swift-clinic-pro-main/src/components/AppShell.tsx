import { ReactNode, useEffect, useState } from "react";
import { AppHeader } from "./AppHeader";
import { api } from "@/lib/api";

export function AppShell({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState("MediBook");
  useEffect(() => {
    api.getSettings().then((s) => setBrand(s.brandName));
  }, []);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader brand={brand} />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {brand}. All rights reserved.
      </footer>
    </div>
  );
}
