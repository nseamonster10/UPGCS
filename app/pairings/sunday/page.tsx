'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Team = 'A' | 'B' | 'NA';
type Player = { id: string; name: string; index: number; team: Team };

const PLAYERS_KEY = 'upgcs.players';
const SAVE_KEY = 'upgcs.pairings.sun';

type Single = { a: string; b: string }; // A vs B

export default function SundaySinglesPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const teamA = useMemo(() => players.filter(p => p.team === 'A'), [players]);
  const teamB = useMemo(() => players.filter(p => p.team === 'B'), [players]);

  const [matches, setMatches] = useState<Single[]>(
    Array.from({ length: 6 }, () => ({ a: '', b: '' }))
  );

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
        if (Array.isArray(parsed) && parsed.length === 6) setMatches(parsed);
      }
    } catch {}
  }, []);

  function updateMatch(i: number, patch: Partial<Single>) {
    setMatches(prev => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }

  function save() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(matches));
    alert('Sunday Singles pairings saved.');
  }

  function clearAll() {
    setMatches(Array.from({ length: 6 }, () => ({ a: '', b: '' })));
    localStorage.removeItem(SAVE_KEY);
  }

  // duplicate checks
  const aIds = matches.map(m => m.a).filter(Boolean);
  const bIds = matches.map(m => m.b).filter(Boolean);
  const dupA = new Set(aIds).size !== aIds.length;
  const dupB = new Set(bIds).size !== bIds.length;

  return (
    <main className="min-h-screen p-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sunday — Singles Stableford</h1>
        <div className="flex gap-4">
          <Link href="/" className="underline">Home</Link>
          <Link href="/players" className="underline">Players</Link>
          <Link href="/rules" className="underline">Rules</Link>
        </div>
      </header>

      <p className="text-gray-700">
        Set up six 1v1 matches (Team A vs Team B). Each match is worth <b>2 points</b>.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <Roster title={`Team A (${teamA.length})`} list={teamA} />
        <Roster title={`Team B (${teamB.length})`} list={teamB} />
      </div>

      {(dupA || dupB) && (
        <div className="border rounded p-3 bg-yellow-50">
          {dupA && <div>Team A has duplicate selections.</div>}
          {dupB && <div>Team B has duplicate selections.</div>}
        </div>
      )}

      <section className="space-y-6">
        {matches.map((m, i) => (
          <div key={i} className="border rounded p-4">
            <h3 className="font-semibold mb-3">Match {i + 1}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Select
                label="Team A"
                value={m.a}
                onChange={(v) => updateMatch(i, { a: v })}
                options={teamA}
                placeholder="Select A"
              />
              <Select
                label="Team B"
                value={m.b}
                onChange={(v) => updateMatch(i, { b: v })}
                options={teamB}
                placeholder="Select B"
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

function Select({
  label, value, onChange, options, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Player[];
  placeholder: string;
}) {
  return (
    <div>
      <div className="mb-2 font-medium">{label}</div>
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
    </div>
  );
}
