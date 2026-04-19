import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

type Med = { name: string; dose: string; frequency: string; duration: string };

export function PrescriptionWriter({
  appointmentId,
  open,
  onOpenChange,
  onSaved,
}: {
  appointmentId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved?: () => void;
}) {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [meds, setMeds] = useState<Med[]>([{ name: "", dose: "", frequency: "", duration: "" }]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setDiagnosis("");
      setNotes("");
      setMeds([{ name: "", dose: "", frequency: "", duration: "" }]);
    }
  }, [open]);

  const update = (i: number, patch: Partial<Med>) =>
    setMeds((m) => m.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const save = async () => {
    if (!appointmentId) return;
    if (!diagnosis.trim()) return toast.error("Diagnosis is required.");
    const cleanMeds = meds.filter((m) => m.name.trim());
    if (cleanMeds.length === 0) return toast.error("Add at least one medicine.");
    setBusy(true);
    try {
      await api.addPrescription({ appointmentId, diagnosis: diagnosis.trim(), notes: notes.trim() || undefined, medicines: cleanMeds });
      toast.success("Prescription saved");
      onOpenChange(false);
      onSaved?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add prescription</DialogTitle>
          <DialogDescription>Saving a prescription marks the appointment complete.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Diagnosis</Label>
            <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="e.g. Acute pharyngitis" />
          </div>
          <div className="space-y-2">
            <Label>Medicines</Label>
            {meds.map((m, i) => (
              <div key={i} className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
                <Input placeholder="Name" value={m.name} onChange={(e) => update(i, { name: e.target.value })} />
                <Input placeholder="Dose" value={m.dose} onChange={(e) => update(i, { dose: e.target.value })} />
                <Input placeholder="Frequency" value={m.frequency} onChange={(e) => update(i, { frequency: e.target.value })} />
                <Input placeholder="Duration" value={m.duration} onChange={(e) => update(i, { duration: e.target.value })} />
                <Button variant="ghost" size="icon" onClick={() => setMeds((arr) => arr.filter((_, idx) => idx !== i))} disabled={meds.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setMeds((arr) => [...arr, { name: "", dose: "", frequency: "", duration: "" }])}>
              <Plus className="mr-1 h-4 w-4" /> Add medicine
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label>Additional notes</Label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save prescription"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
