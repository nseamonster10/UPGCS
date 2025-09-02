'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Team = 'A' | 'B' | 'NA';
type Player = { id: string; name: string; index: number; team: Team };

const PLAYERS_KEY = 'upgcs.players';                 // where your roster is
const SAVE_KEY = 'upgcs.pairings.sat-am';            // where these pairings save

type Pair = { a1: string; a2: string; b1: string; b2: string };

export default function SatAmPairingsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const teamA = useMemo(() => players.filter(p => p.team === 'A'), [players]);
  const teamB = useMemo(() => players.filter(p => p.team === 'B'), [players]);

  const [matches, setMatches] = useState<Pair[]>([
    { a1: '', a2: '', b1: '', b2: '' },
    { a1: '', a2: '', b1: '', b2: '' },
    { a1: '', a2: '', b1: '', b2: '' },
  ]);

  // Load roster + any saved pairings
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PLAYERS_KEY);
      if (raw) {
        const parsed: any[] = JSON.parse(raw);
        const fixed: Player[] = parsed.map((p) => ({
          id: p.id ?? String(Math.random()),
          name: p.name ?? '',
          index: Number(p.index ?? 0),
          team: p.team === 'A' || p.team === 'B' ? p.team : 'NA',
        }));
        setPlayers(fixed);
      }
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3) setMatches(parsed);
      }
    } catch {}
  }, []);

  function updateMatch(i: number, patch: Partial<Pair>) {
    setMatches(prev => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }

  function save() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(matches));
    alert('Saturday Morning pairings saved.');
  }

  function clearAll() {
    setMatches([
      { a1: '', a2: '', b1: '', b2: '' },
      { a1: '', a2: '', b1: '', b2: '' },
      { a1: '', a2: '', b1: '', b2: '' },
    ]);
    localStorage.removeItem(SAVE_KEY);
  }

  // Simple duplicate warning (optional): flags if a player is used twice
  const selectedIds = matches.flatMap(m => [m.a1, m.a2, m.b1, m.b2]).filter(Boolean);
  const hasDupes = new Set(selectedIds).size !== selectedIds.length;

  return (
    <main className="min-h-screen p-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Saturday Morning — Pairings</h1>
        <div className="flex gap-4">
          <Link href="/" className="underline">Home</Link>
          <Link href="/players" className="underline">Players</Link>
          <Link href="/rules" className="underline">Rules</Link>
        </div>
      </header>

      <p className="text-gray-700">
        This 18 includes <b>Front 9: Scramble</b> and <b>Back 9: Shamble</b>. Choose your own pairs for three matches.
        (We’ll use the same pairs for both 9s in this block.)
      </p>

      {/* Roster quick view */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Team A ({teamA.length})</h2>
          <ul className="list-disc pl-6">
            {teamA.map(p => <li key={p.id}>{p.name} (HI {p.index.toFixed(1)})</li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Team B ({teamB.length})</h2>
          <ul className="list-disc pl-6">
            {teamB.map(p => <li key={p.id}>{p.name} (HI {p.index.toFixed(1)})</li>)}
          </ul>
        </div>
      </div>

      {hasDupes && (
        <div className="border rounded p-3 bg-yellow-50">
          You’ve selected someone more than once. Double-check your choices.
        </div>
      )}

      <section className="space-y-6">
        {matches.map((m, i) => (
          <div key={i} className="border rounded p-4">
            <h3 className="font-semibold mb-3">Match {i + 1}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="mb-2 font-medium">Team A Pair</div>
                <div className="flex gap-2">
                  <SelectPlayer
                    value={m.a1}
                    onChange={(v) => updateMatch(i, { a1: v })}
                    options={teamA}
                    placeholder="A player 1"
                  />
                  <SelectPlayer
                    value={m.a2}
                    onChange={(v) => updateMatch(i, { a2: v })}
                    options={teamA}
                    placeholder="A player 2"
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 font-medium">Team B Pair</div>
                <div className="flex gap-2">
                  <SelectPlayer
                    value={m.b1}
                    onChange={(v) => updateMatch(i, { b1: v })}
                    options={teamB}
                    placeholder="B player 1"
                  />
                  <SelectPlayer
                    value={m.b2}
                    onChange={(v) => updateMatch(i, { b2: v })}
                    options={teamB}
                    placeholder="B player 2"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="flex gap-3">
        <button className="border px-3 py-2 rounded" onClick={save}>Save Pairings</button>
        <button className="border px-3 py-2 rounded" onClick={clearAll}>Clear</button>
      </div>

      <p className="text-sm text-gray-600">
        Saved locally in your browser. We’ll add scoring next (front/back segment points) and pages for Saturday Afternoon & Sunday.
      </p>
    </main>
  );
}

function SelectPlayer({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Player[];
  placeholder: string;
}) {
  return (
    <select
      className="border px-3 py-2 rounded min-w-48"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name} (HI {p.index.toFixed(1)})
        </option>
      ))}
    </select>
  );
}
