import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { Slot } from "@/lib/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";

export function SlotManager({
  doctorId,
  open,
  onOpenChange,
}: {
  doctorId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("10:30");
  const [duration, setDuration] = useState(30);
  const [count, setCount] = useState(4);

  // Calculate end time when start or duration changes
  const updateEndTime = (startTime: string, dur: number) => {
    const [h, m] = startTime.split(":").map(Number);
    const totalMinutes = h * 60 + m + dur;
    const endHour = Math.floor(totalMinutes / 60);
    const endMin = totalMinutes % 60;
    setEnd(`${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`);
  };

  // Update end time when start time changes
  const handleStartChange = (newStart: string) => {
    setStart(newStart);
    updateEndTime(newStart, duration);
  };

  // Update end time when duration changes
  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    updateEndTime(start, newDuration);
  };

  const load = async () => {
    if (!doctorId) return;
    setSlots(await api.listSlotsForDoctor(doctorId));
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, doctorId]);

  const add = async () => {
    if (!doctorId) return;
    const [h, m] = start.split(":").map(Number);
    const slots: { startsAt: string; endsAt: string }[] = [];
    for (let i = 0; i < count; i++) {
      const s = new Date(`${date}T00:00:00`);
      s.setHours(h, m + i * duration, 0, 0);
      const e = new Date(s.getTime() + duration * 60 * 1000);
      if (s.getTime() < Date.now()) continue;
      slots.push({ startsAt: s.toISOString(), endsAt: e.toISOString() });
    }
    if (slots.length === 0) return toast.error("All chosen times are in the past.");
    await api.addSlots(doctorId, slots);
    toast.success(`${slots.length} slot(s) added`);
    load();
  };

  const upcoming = slots.filter((s) => new Date(s.startsAt).getTime() >= Date.now())
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage availability</DialogTitle>
          <DialogDescription>Generate consecutive slots, then publish them to patients.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-5">
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Start time</Label>
            <Input type="time" value={start} onChange={(e) => handleStartChange(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Duration (min)</Label>
            <Input type="number" min={10} step={5} value={duration} onChange={(e) => handleDurationChange(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label>End time</Label>
            <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} disabled className="bg-muted" />
          </div>
          <div className="space-y-1.5">
            <Label>How many</Label>
            <Input type="number" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </div>
          <div className="sm:col-span-5">
            <Button onClick={add} className="w-full sm:w-auto"><Plus className="mr-1 h-4 w-4" /> Add slots</Button>
          </div>
        </div>

        <div className="mt-2">
          <h4 className="mb-2 text-sm font-semibold">Upcoming slots</h4>
          <ScrollArea className="h-72 rounded-lg border">
            {upcoming.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No upcoming slots yet.</div>}
            <ul className="divide-y">
              {upcoming.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <span>{format(new Date(s.startsAt), "EEE d MMM, h:mm a")} - {format(new Date(s.endsAt), "h:mm a")}</span>
                  <div className="flex items-center gap-2">
                    {s.isBooked ? (
                      <Badge variant="secondary">Booked</Badge>
                    ) : (
                      <Badge variant="outline" className="border-success/40 text-success">Open</Badge>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={s.isBooked}
                      onClick={async () => {
                        try { await api.deleteSlot(s.id); toast.success("Slot removed"); load(); }
                        catch (e) { toast.error(e instanceof Error ? e.message : "Cannot delete"); }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
