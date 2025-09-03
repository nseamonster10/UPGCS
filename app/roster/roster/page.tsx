'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Player, Team, Roster } from '@/lib/types';
import { KEYS, getJSON, setJSON } from '@/lib/storage';

type SortKey = 'name-asc' | 'hi-asc' | 'hi-desc';

export default function RosterPage() {
  const [rosterName, setRosterName] = useState('I-29 Cup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [included, setIncluded] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>('name-asc');

  // Load players + any saved roster
  useEffect(() => {
    const ps = getJSON<Player[]>(KEYS.PLAYERS, []);
    setPlayers(ps);

    const saved = getJSON<Roster | null>(KEYS.ROSTER, null);
    if (saved) {
      setRosterName(saved.name || 'I-29 Cup');
      setIncluded(new Set(saved.includedIds || []));
    }
  }, []);

  // persist player team changes (so Manage Players & Roster stay in sync)
  useEffect(() => {
    // write-through whenever teams change
    setJSON(KEYS.PLAYERS, players);
  }, [players]);

  const sortedPlayers = useMemo(() => {
    const copy = [...players];
    switch (sortKey) {
      case 'name-asc':
        copy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'hi-asc':
        copy.sort((a, b) => a.index - b.index);
        break;
      case 'hi-desc':
        copy.sort((a, b) => b.index - a.index);
        break;
    }
    return copy;
  }, [players, sortKey]);

  const teamA = players.filter(p => p.team === 'A');
  const teamB = players.filter(p => p.team === 'B');

  function toggleIncluded(id: string) {
    setIncluded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function setTeam(id: string, team: Team) {
    setPlayers(prev => prev.map(p => (p.id === id ? { ...p, team } : p)));
  }

  function includeAll() {
    setIncluded(new Set(players.map(p => p.id)));
  }
  function includeNone() {
    setIncluded(new Set());
  }

  // Randomize teams (balanced by HI) on currently "included" players
  function randomizeTeamsBalanced() {
    const pool = players.filter(p => included.has(p.id));
    if (pool.length < 2) {
      alert('Select at least 2 included players to balance.');
      return;
    }
    // sort low HI (better) to high HI (worse)
    const sorted = [...pool].sort((a, b) => a.index - b.index);
    // snake draft into two teams
    const A: Player[] = [];
    const B: Player[] = [];
    sorted.forEach((p, i) => (i % 2 === 0 ? A.push(p) : B.push(p)));

    // write back team assignments for included players; leave others as-is
    setPlayers(prev =>
      prev.map(p =>
        included.has(p.id)
          ? { ...p, team: A.some(x => x.id === p.id) ? 'A' : B.some(x => x.id === p.id) ? 'B' : 'NA' }
          : p
      )
    );
  }

  function saveRoster() {
    const payload: Roster = {
      name: rosterName || 'I-29 Cup',
      includedIds: [...included],
      createdAt: new Date().toISOString(),
    };
    setJSON(KEYS.ROSTER, payload);
    alert('Roster saved. Pairings/Rounds can use this as the active roster.');
  }

  return (
    <main className="min-h-screen p-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Roster</h1>
        <div className="flex gap-4">
          <Link className="underline" href="/">Home</Link>
          <Link className="underline" href="/players">Manage Players</Link>
          <Link className="underline" href="/rules">Rules</Link>
        </div>
      </header>

      <section className="flex flex-wrap items-center gap-3">
        <label className="font-medium">Event name:</label>
        <input
          className="border px-3 py-2 rounded"
          value={rosterName}
          onChange={(e) => setRosterName(e.target.value)}
          placeholder="e.g., I-29 Cup"
        />
        <label className="ml-4 font-medium">Sort:</label>
        <select
          className="border px-3 py-2 rounded"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="name-asc">Name (A→Z)</option>
          <option value="hi-asc">Handicap (Low→High)</option>
          <option value="hi-desc">Handicap (High→Low)</option>
        </select>

        <button className="border px-3 py-2 rounded" onClick={includeAll}>Include All</button>
        <button className="border px-3 py-2 rounded" onClick={includeNone}>Include None</button>
        <button className="border px-3 py-2 rounded" onClick={randomizeTeamsBalanced}>
          Randomize Teams (balance HI)
        </button>
        <button className="border px-3 py-2 rounded" onClick={saveRoster}>
          Save Roster
        </button>
      </section>

      <section className="overflow-auto">
        <table className="min-w-[700px] w-full border rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">In</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">HI</th>
              <th className="text-left p-2">Team</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={included.has(p.id)}
                    onChange={() => toggleIncluded(p.id)}
                  />
                </td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.index.toFixed(1)}</td>
                <td className="p-2">
                  <select
                    className="border px-2 py-1 rounded"
                    value={p.team}
                    onChange={(e) => setTeam(p.id, e.target.value as Team)}
                  >
                    <option value="NA">N/A</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Team A ({teamA.length})</h2>
          <ul className="list-disc pl-6">
            {teamA.map(p => included.has(p.id) && <li key={p.id}>{p.name} (HI {p.index.toFixed(1)})</li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Team B ({teamB.length})</h2>
          <ul className="list-disc pl-6">
            {teamB.map(p => included.has(p.id) && <li key={p.id}>{p.name} (HI {p.index.toFixed(1)})</li>)}
          </ul>
        </div>
      </section>

      <p className="text-sm text-gray-600">
        Tip: Use Manage Players to add/edit golfers. Roster saves who’s in the event and their teams.
      </p>
    </main>
  );
}
