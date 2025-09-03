// lib/storage.ts
export const KEYS = {
  PLAYERS: 'upgcs.players',          // array<Player>
  ROSTER: 'upgcs.roster.v1',         // Roster
  ROUNDS: 'upgcs.rounds.v1',         // array<Round>
} as const;

export function getJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setJSON<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const makeId = () =>
  typeof globalThis !== 'undefined' &&
  (globalThis as any).crypto &&
  typeof (globalThis as any).crypto.randomUUID === 'function'
    ? (globalThis as any).crypto.randomUUID()
    : Math.random().toString(36).slice(2);
