'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Team = 'A' | 'B' | 'NA';
type Player = { id: string; name: string; index: number; team: Team };

const PLAYERS_KEY = 'upgcs.players';
const SAVE_KEY = 'upgcs.pairings.sat-pm';

type Pair = { a1: string; a2: string; b1: string; b2: string };

export default function SatPmPairingsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const teamA = useMemo(() => players.filter(p => p.team === 'A'), [players]);
  const teamB = useMemo(() => players.filter(p => p.team === 'B'), [players]);

  const [matches, setMatches] = useState<Pair[]>([
    { a1: '', a2: '', b1: '', b2: '' },
    { a1: '', a2: '', b1: '', b2: '' },
    { a1: '', a2: '', b1: '', b2: '' },
  ]);

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
    alert('Saturday Afternoon pairings saved.');
  }

  function clearAll() {
    setMatches([
      { a1: '', a2: '', b1: '', b2: '' },
      { a1: '', a2: '', b1: '', b2: '' },
      { a1: '', a2: '', b1: '', b2: '' },
    ]);
    localStorage.removeItem(SAVE_KEY);
  }

  const selectedIds = matches.flatMap(m => [m.a1, m.a2, m.b1, m.b2]).filter(Boolean);
  const hasDupes = new Set(selectedIds).size !== selectedIds.length;

  return (
    <main className="min-h-screen p-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Saturday Afternoon — Pairings</h1>
        <div className="flex gap-4">
          <Link href="/" className="underline">Home</Link>
          <Link href="/players" className="underline">Players</Link>
          <Link href="/rules" className="underline">Rules</Link>
        </div>
      </header>

      <p className="text-gray-700">
        This 18 includes <b>Front 9: Alternate Shot</b> and <b>Back 9: Four-Ball</b>. Choose pairs for three matches.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <Roster title={`Team A (${teamA.length})`} list={teamA} />
        <Roster title={`Team B (${teamB.length})`} list={teamB} />
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
              <PairPick
                label="Team A Pair"
                p1={m.a1} p2={m.a2}
                onP1={(v) => updateMatch(i, { a1: v })}
                onP2={(v) => updateMatch(i, { a2: v })}
                options={teamA}
              />
              <PairPick
                label="Team B Pair"
                p1={m.b1} p2={m.b2}
                onP1={(v) => updateMatch(i, { b1: v })}
                onP2={(v) => updateMatch(i, { b2: v })}
                options={teamB}
              />
            </div>
          </div>
        ))}
      </section>

      <div className="flex gap-3">
        <button className="border px-3 py-2 rounded" onClick={save}>Save Pairings</button>
        <button className="border px-3 py-2 rounded" onClick={clearAll}>Clear</button>
      </div>
    </main>
  );
}

function Roster({ title, list }: { title: string; list: Player[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <ul className="list-disc pl-6">
        {list.map(p => <li key={p.id}>{p.name} (HI {p.index.toFixed(1)})</li>)}
      </ul>
    </div>
  );
}

function PairPick({
  label, p1, p2, onP1, onP2, options,
}: {
  label: string;
  p1: string; p2: string;
  onP1: (v: string) => void; onP2: (v: string) => void;
  options: Player[];
}) {
  return (
    <div>
      <div className="mb-2 font-medium">{label}</div>
      <div className="flex gap-2">
        <Select value={p1} onChange={onP1} options={options} placeholder="player 1" />
        <Select value={p2} onChange={onP2} options={options} placeholder="player 2" />
      </div>
    </div>
  );
}

function Select({
  value, onChange, options, placeholder,
}: {
  value: string; onChange: (v: string) => void;
  options: Player[]; placeholder: string;
}) {
  return (
    <select className="border px-3 py-2 rounded min-w-48" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map(p => <option key={p.id} value={p.id}>{p.name} (HI {p.index.toFixed(1)})</option>)}
    </select>
  );
}
