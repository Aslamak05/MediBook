import {
  Appointment,
  AppointmentStatus,
  AppSettings,
  AuthUser,
  Doctor,
  Notification,
  Prescription,
  Role,
  Slot,
} from "./types";

/**
 * Real API client connected to Express + MongoDB backend.
 * 
 * All fetch calls go to VITE_API_URL/path with Bearer token from localStorage.
 */

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function getToken(): string {
  return localStorage.getItem("medibook.token") || "";
}

async function http<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(init.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || res.statusText);
  }
  return data;
}

// ---------- helpers ----------
function mapBackendDoctor(doc: any): Doctor {
  return {
    id: doc._id || doc.id,
    userId: doc.user?._id || doc.user,
    name: doc.user?.name || doc.name,
    email: doc.user?.email || doc.email,
    phone: doc.user?.phone || doc.phone,
    specialization: doc.specialization,
    qualifications: doc.qualifications,
    experienceYears: doc.experienceYears,
    bio: doc.bio,
    fee: doc.fee,
    status: doc.status,
    rating: doc.rating,
    createdAt: doc.createdAt || new Date().toISOString(),
  };
}

function mapBackendSlot(slot: any): Slot {
  return {
    id: slot._id || slot.id,
    doctorId: slot.doctor?._id || slot.doctor,
    startsAt: slot.startsAt,
    endsAt: slot.endsAt,
    isBooked: slot.isBooked,
    appointmentId: slot.appointment?._id || slot.appointment,
  };
}

function mapBackendAppointment(appt: any, doctor?: any): Appointment {
  const doc = doctor || appt.doctor || {};
  const docUser = (typeof doc.user === "object" ? doc.user : {}) || {};
  return {
    id: appt._id || appt.id,
    userId: appt.user?._id || appt.user,
    userName: appt.user?.name || "Unknown",
    doctorId: appt.doctor?._id || appt.doctor,
    doctorName: docUser.name || "Unknown",
    specialization: doc.specialization || "General",
    slotId: appt.slot?._id || appt.slot,
    startsAt: appt.startsAt,
    endsAt: appt.endsAt,
    doctorFee: appt.doctorFee,
    commission: appt.commission,
    totalFee: appt.totalFee,
    status: appt.status,
    prescriptionId: appt.prescription?._id || appt.prescription,
    createdAt: appt.createdAt || new Date().toISOString(),
  };
}

function mapBackendNotification(notif: any): Notification {
  return {
    id: notif._id || notif.id,
    userId: notif.user?._id || notif.user,
    title: notif.title,
    message: notif.message,
    read: notif.read,
    type: notif.type || "system",
    createdAt: notif.createdAt || new Date().toISOString(),
  };
}

// ---------- API surface ----------
export const api = {
  // ---- auth ----
  async register(payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
    phone?: string;
    specialization?: string;
    qualifications?: string;
    experienceYears?: number;
    fee?: number;
    bio?: string;
  }) {
    const body: any = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone || "",
      role: payload.role,
    };

    if (payload.role === "doctor") {
      body.specialization = payload.specialization || "";
      body.qualifications = payload.qualifications || "";
      body.experienceYears = payload.experienceYears || 0;
      body.fee = payload.fee || 500;
      body.bio = payload.bio || "";
    }

    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    localStorage.setItem("medibook.token", data.token);
    return data;
  },

  async login(email: string, password: string) {
    const data = await http<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("medibook.token", data.token);
    return data;
  },

  async logout() {
    await http("/auth/logout", { method: "POST" });
    localStorage.removeItem("medibook.token");
    return true;
  },

  async me(): Promise<AuthUser | null> {
    const token = getToken();
    if (!token) return null;
    try {
      return await http("/auth/me");
    } catch {
      return null;
    }
  },

  // ---- settings ----
  async getSettings() {
    return http<AppSettings>("/settings");
  },
  async updateSettings(patch: Partial<AppSettings>) {
    return http<AppSettings>("/settings", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },

  // ---- doctors ----
  async listApprovedDoctors() {
    const doctors = await http<any[]>("/doctors");
    return doctors.map(mapBackendDoctor);
  },
  async listAllDoctors() {
    const doctors = await http<any[]>("/admin/doctors");
    return doctors.map(mapBackendDoctor);
  },
  async getDoctor(id: string) {
    const doc = await http<any>(`/doctors/${id}`);
    return mapBackendDoctor(doc);
  },
  async getDoctorByUserId(userId: string) {
    try {
      const doc = await http<any>("/doctors/me/profile");
      return mapBackendDoctor(doc);
    } catch {
      return null;
    }
  },
  async approveDoctor(id: string, approved: boolean) {
    const doc = await http<any>(`/admin/doctors/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ approved }),
    });
    return mapBackendDoctor(doc);
  },
  async updateDoctorProfile(id: string, patch: Partial<Doctor>) {
    const body = new FormData();
    Object.entries(patch).forEach(([k, v]) => {
      if (v !== undefined && v !== null) body.append(k, String(v));
    });

    const res = await fetch(`${API}/doctors/me/profile`, {
      method: "PATCH",
      body,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Update failed");
    return mapBackendDoctor(data);
  },

  // ---- slots ----
  async listSlotsForDoctor(doctorId: string) {
    const slots = await http<any[]>(`/slots/doctor/${doctorId}`);
    return slots.map(mapBackendSlot);
  },
  async addSlots(
    doctorId: string,
    slots: { startsAt: string; endsAt: string }[]
  ) {
    const created = await http<any[]>("/slots", {
      method: "POST",
      body: JSON.stringify({ slots }),
    });
    return created.map(mapBackendSlot);
  },
  async deleteSlot(slotId: string) {
    await http(`/slots/${slotId}`, { method: "DELETE" });
    return true;
  },

  // ---- appointments ----
  async bookAppointment(userId: string, slotId: string) {
    const appt = await http<any>("/appointments", {
      method: "POST",
      body: JSON.stringify({ slotId }),
    });
    return mapBackendAppointment(appt);
  },

  async listAppointmentsForUser(userId: string) {
    const appts = await http<any[]>("/appointments/me");
    return appts.map((a) => mapBackendAppointment(a));
  },

  async listAppointmentsForDoctor(doctorId: string) {
    const appts = await http<any[]>("/appointments/doctor");
    return appts.map((a) => mapBackendAppointment(a));
  },

  async listAllAppointments() {
    const data = await http<any>("/appointments");
    const appts = data.appointments || [];
    return appts.map((a: any) => mapBackendAppointment(a));
  },

  async setAppointmentStatus(id: string, status: AppointmentStatus) {
    const appt = await http<any>(`/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return mapBackendAppointment(appt);
  },

  async cancelAppointment(id: string, byUserId: string) {
    const appt = await http<any>(`/appointments/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    return mapBackendAppointment(appt);
  },

  async rescheduleToNextAvailable(id: string) {
    const appt = await http<any>(`/appointments/${id}/reschedule`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    return mapBackendAppointment(appt);
  },

  // ---- prescriptions ----
  async addPrescription(payload: Omit<Prescription, "id" | "createdAt">) {
    const p = await http<any>("/prescriptions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return {
      id: p._id || p.id,
      appointmentId: p.appointment?._id || p.appointment,
      diagnosis: p.diagnosis,
      medicines: p.medicines,
      notes: p.notes,
      createdAt: p.createdAt || new Date().toISOString(),
    } as Prescription;
  },

  async getPrescriptionForAppointment(appointmentId: string) {
    try {
      const p = await http<any>(`/prescriptions/appointment/${appointmentId}`);
      return {
        id: p._id || p.id,
        appointmentId: p.appointment?._id || p.appointment,
        diagnosis: p.diagnosis,
        medicines: p.medicines,
        notes: p.notes,
        createdAt: p.createdAt || new Date().toISOString(),
      } as Prescription;
    } catch {
      return null;
    }
  },

  // ---- notifications ----
  async listNotifications(userId: string) {
    const notifs = await http<any[]>("/notifications");
    return notifs.map(mapBackendNotification);
  },

  async markNotificationRead(id: string) {
    await http(`/notifications/${id}/read`, { method: "PATCH" });
    return true;
  },

  // ---- admin metrics ----
  async adminMetrics() {
    return http("/admin/metrics");
  },

  async listUsers() {
    return http("/admin/users");
  },

  // ---- dev helpers ----
  __reset() {
    // No-op when using real backend
  },
};
