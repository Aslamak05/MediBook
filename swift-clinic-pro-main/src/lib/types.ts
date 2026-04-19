// Domain types — mirror the Mongoose schemas in BACKEND_SPEC.md

export type Role = "user" | "doctor" | "admin";
export type DoctorStatus = "pending" | "approved" | "rejected";
export type AppointmentStatus =
  | "booked"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rescheduled"
  | "no_show";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  bio: string;
  fee: number; // doctor's base fee
  status: DoctorStatus;
  certificateUrl?: string;
  certificateName?: string;
  avatarUrl?: string;
  rating?: number;
  createdAt: string;
}

export interface Slot {
  id: string;
  doctorId: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  isBooked: boolean;
  appointmentId?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  diagnosis: string;
  medicines: { name: string; dose: string; frequency: string; duration: string }[];
  notes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  slotId: string;
  startsAt: string;
  endsAt: string;
  doctorFee: number;
  commission: number; // absolute amount
  totalFee: number;
  status: AppointmentStatus;
  prescriptionId?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: "booking" | "reminder" | "completion" | "system";
  createdAt: string;
}

export interface AppSettings {
  brandName: string;
  brandTagline: string;
  commissionPercent: number; // e.g. 10 means 10%
  reschedulePolicyHours: number; // default 24
}
