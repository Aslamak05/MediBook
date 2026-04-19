import { Appointment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Clock, Stethoscope, User } from "lucide-react";

const statusColor: Record<Appointment["status"], string> = {
  booked: "bg-accent/15 text-accent border-accent/30",
  confirmed: "bg-accent/15 text-accent border-accent/30",
  completed: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  rescheduled: "bg-warning/15 text-foreground border-warning/40",
  no_show: "bg-muted text-muted-foreground",
};

export function AppointmentCard({
  appt,
  perspective,
  onCancel,
  onReschedule,
  onComplete,
  onAddPrescription,
  onViewPrescription,
}: {
  appt: Appointment;
  perspective: "user" | "doctor" | "admin";
  onCancel?: () => void;
  onReschedule?: () => void;
  onComplete?: () => void;
  onAddPrescription?: () => void;
  onViewPrescription?: () => void;
}) {
  const start = new Date(appt.startsAt);
  const hoursUntil = (start.getTime() - Date.now()) / 36e5;
  const within24 = hoursUntil < 24 && hoursUntil > 0;
  const past = start.getTime() < Date.now();

  return (
    <div className="clinical-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
          <Stethoscope className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display font-semibold leading-tight">
              {perspective === "doctor" ? appt.userName : appt.doctorName}
            </h3>
            <Badge variant="outline" className={statusColor[appt.status]}>
              {appt.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {perspective === "doctor" ? <><User className="mr-1 inline h-3 w-3" />Patient</> : appt.specialization}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{format(start, "EEE, d MMM yyyy")}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{format(start, "h:mm a")}</span>
            <span>₹{appt.totalFee} <span className="text-xs">(₹{appt.doctorFee} + ₹{appt.commission} fee)</span></span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:justify-end">
        {perspective === "user" && appt.prescriptionId && (
          <Button size="sm" variant="outline" onClick={onViewPrescription}>View prescription</Button>
        )}
        {perspective === "doctor" && !appt.prescriptionId && appt.status !== "cancelled" && (
          <Button size="sm" onClick={onAddPrescription}>Add prescription</Button>
        )}
        {perspective === "doctor" && appt.status === "booked" && !past && (
          <Button size="sm" variant="outline" onClick={onComplete}>Mark complete</Button>
        )}
        {perspective === "user" && (appt.status === "booked" || appt.status === "rescheduled") && !past && (
          <>
            <Button size="sm" variant="outline" disabled={within24} onClick={onReschedule} title={within24 ? "Cannot reschedule within 24h" : undefined}>
              Reschedule
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" disabled={within24} onClick={onCancel} title={within24 ? "Cannot cancel within 24h" : undefined}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
