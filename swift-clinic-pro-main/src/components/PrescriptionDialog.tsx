import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { Prescription } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export function PrescriptionDialog({
  appointmentId,
  open,
  onOpenChange,
}: {
  appointmentId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [rx, setRx] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!appointmentId || !open) return;
    setLoading(true);
    api.getPrescriptionForAppointment(appointmentId).then((r) => setRx(r)).finally(() => setLoading(false));
  }, [appointmentId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Prescription</DialogTitle>
          <DialogDescription>
            {rx ? `Issued ${format(new Date(rx.createdAt), "d MMM yyyy")}` : "Doctor's prescription details"}
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…</div>
        ) : !rx ? (
          <p className="text-sm text-muted-foreground">No prescription has been added for this appointment yet.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Diagnosis</div>
              <p className="mt-1 text-sm">{rx.diagnosis}</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Medicines</div>
              <ul className="mt-1 space-y-2">
                {rx.medicines.map((m, i) => (
                  <li key={i} className="rounded-md border p-2 text-sm">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.dose} · {m.frequency} · {m.duration}</div>
                  </li>
                ))}
              </ul>
            </div>
            {rx.notes && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</div>
                <p className="mt-1 text-sm">{rx.notes}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
