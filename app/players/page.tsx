'use client';

import { useEffect, useMemo, useState } from 'react';

type Team = 'A' | 'B';
type Player = { id: string; name: string; index: number; team: Team };

const STORAGE_KEY = 'upgcs.players';

// safe id generator (works everywhere)
const makeId = () =>
  typeof globalThis !== 'undefined' &&
  (globalThis as any).crypto &&
  typeof (globalThis as any).crypto.randomUUID === 'function'
    ? (globalThis as any).crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export default function PlayersPage() {
  const [name, setName] = useState('');
  const [index, setIndex] = useState<string>('');
  const [team, setTeam] = useState<Team>('A');
  const [players, setPlayers] = useState<Player[]>([]);

  // load saved players (browser only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        const fixed: Player[] = parsed.map((p) => ({
          id: p.id ?? makeId(),
          name: p.name ?? '',
          index: Number(p.index ?? 0),
          team: p.team === 'B' ? 'B' : 'A',
        }));
        setPlayers(fixed);
      }
    } catch {}
  }, []);

  // save whenever players change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    } catch {}
  }, [players]);

  function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    if (!name || index.trim() === '' || isNaN(Number(index))) return;
    setPlayers((prev) => [
      ...prev,
      { id: makeId(), name: name.trim(), index: Number(index), team },
    ]);
    setName('');
    setIndex('');
    setTeam('A');
  }

  function remove(id: string) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }

  function clearAll() {
    setPlayers([]);
  }

  const teamA = useMemo(() => players.filter((p) => p.team === 'A'), [players]);
  const teamB = useMemo(() => players.filter((p) => p.team === 'B'), [players]);

  return (
    <main className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">Players</h1>

      <form onSubmit={addPlayer} className="flex flex-wrap gap-2 items-center">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          className="border px-3 py-2 rounded w-40"
          placeholder="Handicap Index"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={team}
          onChange={(e) => setTeam(e.target.value as Team)}
        >
          <option value="A">Team A</option>
          <option value="B">Team B</option>
        </select>

        <button className="border px-3 py-2 rounded" type="submit">Add</button>
        <button className="border px-3 py-2 rounded" type="button" onClick={clearAll}>Clear All</button>
      </form>

      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Team A ({teamA.length})</h2>
          <ul className="space-y-2">
            {teamA.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="font-medium w-48">{p.name}</span>
                <span>HI: {p.index.toFixed(1)}</span>
                <button className="underline" onClick={() => remove(p.id)}>remove</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Team B ({teamB.length})</h2>
          <ul className="space-y-2">
            {teamB.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="font-medium w-48">{p.name}</span>
                <span>HI: {p.index.toFixed(1)}</span>
                <button className="underline" onClick={() => remove(p.id)}>remove</button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
