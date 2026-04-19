import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Doctor, Slot, AppSettings } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { format, isSameDay } from "date-fns";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function BookingDialog({
  doctor,
  open,
  onOpenChange,
  onBooked,
}: {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onBooked?: () => void;
}) {
  const { user } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!doctor || !open) return;
    setLoading(true);
    Promise.all([api.listSlotsForDoctor(doctor.id), api.getSettings()])
      .then(([s, st]) => {
        setSlots(s.filter((x) => !x.isBooked && new Date(x.startsAt).getTime() > Date.now()));
        setSettings(st);
      })
      .finally(() => setLoading(false));
    setSelected(null);
  }, [doctor, open]);

  const grouped = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const key = format(new Date(s.startsAt), "yyyy-MM-dd");
      const arr = map.get(key) ?? [];
      arr.push(s);
      map.set(key, arr);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [slots]);

  const fee = doctor && settings
    ? {
        doctor: doctor.fee,
        commission: Math.round((doctor.fee * settings.commissionPercent) / 100),
        total: doctor.fee + Math.round((doctor.fee * settings.commissionPercent) / 100),
      }
    : null;

  const book = async () => {
    if (!doctor || !user || !selected) return;
    setBusy(true);
    try {
      await api.bookAppointment(user.id, selected);
      toast.success("Appointment booked!");
      onOpenChange(false);
      onBooked?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not book");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book with {doctor?.name}</DialogTitle>
          <DialogDescription>{doctor?.specialization} · {doctor?.qualifications}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading slots…</div>
        ) : grouped.length === 0 ? (
          <div className="rounded-lg border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
            No upcoming slots. Please check back soon.
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map(([day, daySlots]) => (
              <div key={day}>
                <div className="mb-2 text-sm font-semibold">
                  {format(new Date(day), "EEEE, d MMM")}
                  {isSameDay(new Date(day), new Date()) && <Badge variant="secondary" className="ml-2">Today</Badge>}
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {daySlots.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelected(s.id)}
                      className={`rounded-lg border px-3 py-2 text-sm transition ${selected === s.id ? "border-accent bg-accent text-accent-foreground" : "hover:border-accent/60"}`}
                    >
                      {format(new Date(s.startsAt), "h:mm a")}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {fee && (
          <div className="mt-4 rounded-lg border bg-muted/40 p-3 text-sm">
            <div className="flex justify-between"><span>Doctor's fee</span><span>₹{fee.doctor}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Platform fee ({settings?.commissionPercent}%)</span><span>₹{fee.commission}</span></div>
            <div className="mt-1 flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>₹{fee.total}</span></div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!selected || busy} onClick={book}>
            {busy ? "Booking…" : "Confirm booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
