// lib/types.ts
export type Team = 'A' | 'B' | 'NA';

export interface Player {
  id: string;
  name: string;
  index: number; // Handicap Index
  team: Team;    // A/B/NA
}

export interface Roster {
  name: string;         // e.g., "I-29 Cup 2025"
  includedIds: string[]; // players chosen for the event
  createdAt: string;    // ISO date
}

export interface Round {
  id: string;
  name: string;          // e.g., "Sat AM"
  format: FormatCode;    // e.g., "scramble|shamble|altshot|fourball|singles|stroke"
  date?: string;         // optional date/time
  course?: string;       // free text for now
  // later: tees, slope/rating, scoring rules, pairings, etc.
}

export type FormatCode =
  | 'scramble'
  | 'shamble'
  | 'altshot'
  | 'fourball'
  | 'singles'
  | 'stroke';
