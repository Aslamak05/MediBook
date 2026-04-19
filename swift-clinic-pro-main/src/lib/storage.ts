// Tiny localStorage-backed key/value persistence for the mock backend.
// Real backend (Express + Mongo) will replace src/lib/api.ts entirely.

const PREFIX = "medibook.";

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore quota errors in demo
  }
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), ms));
}
