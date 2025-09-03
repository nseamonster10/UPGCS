'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Player, Team } from '../../lib/types';
import { KEYS, getJSON, setJSON, makeId } from '../../lib/storage';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState('');
  const [indexInput, setIndexInput] = useState<string>('');
  const [teamInput, setTeamInput] = useState<Team>('NA');

  // Load previously saved players (if any)
  useEffect(() => {
    const saved = getJSON<Player[]>(KEYS.PLAYERS, []);
    setPlayers(saved);
  }, []);

  function addPlayer() {
    const trimmed = name.trim();
    const hi = parseFloat(indexInput);
    if (!trimmed) {
      alert('Please enter a name.');
      return;
    }
    if (Number.isNaN(hi)) {
      alert('Please enter a Handicap Index (e.g. 10.2).');
      return;
    }
    const p: Player = {
      id: makeId(),
      name: trimmed,
      index: hi,
      team: teamInput,
    };
    setPlayers(prev => [...prev, p]);
    setName('');
    setIndexInput('');
    setTeamInput('NA');
  }

  function removePlayer(id: string) {
    setPlayers(prev => prev.filter(p => p.id !== id));
  }

  function setTeam(id: string, team: Team) {
    setPlayers(prev => prev.map(p => (p.id === id ? { ...p, team } : p)));
  }

  function clearAll() {
    if (!confirm('Clear ALL players?')) return;
    setPlayers([]);
    setJSON(KEYS.PLAYERS, []); // also clear saved copy
  }

  // NEW: Save button — writes current players list to storage
  function savePlayers() {
    setJSON(KEYS.PLAYERS, players);
    alert('Players saved. Open “Build Roster →” to use them.');
  }

  // Simple 3 columns: Team A, Team B, N/A
  const teamA = useMemo(() => players.filter(p => p.team === 'A'), [players]);
  const teamB = useMemo(() => players.filter(p => p.team === 'B'), [players]);
  const unassigned = useMemo(() => players.filter(p => p.team === 'NA'), [players]);

  return (
    <main className="min-h-screen p-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Players</h1>
        <div className="flex gap-4">
          <Link className="underline" href="/">Home</Link>
          <Link className="underline" href="/roster">Build Roster</Link>
        </div>
      </header>

      {/* Add form */}
      <section className="flex flex-wrap items-center gap-3">
        <input
          className="border px-3 py-2 rounded min-w-[220px]"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          className="border px-3 py-2 rounded w-[170px]"
          placeholder="Handicap Index"
          value={indexInput}
          onChange={(e) => setIndexInput(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={teamInput}
          onChange={(e) => setTeamInput(e.target.value as Team)}
        >
          <option value="NA">Team: N/A</option>
          <option value="A">Team: A</option>
          <option value="B">Team: B</option>
        </select>

        <button className="border px-3 py-2 rounded" onClick={addPlayer}>Add</button>
        <button className="border px-3 py-2 rounded" onClick={savePlayers}>Save</button>
        <button className="border px-3 py-2 rounded" onClick={clearAll}>Clear All</button>
      </section>

      {/* Lists */}
      <section className="grid md:grid-cols-3 gap-8">
        <TeamList title={`Team A (${teamA.length})`} players={teamA} onSetTeam={setTeam} onRemove={removePlayer} />
        <TeamList title={`Team B (${teamB.length})`} players={teamB} onSetTeam={setTeam} onRemove={removePlayer} />
        <TeamList title={`Unassigned (${unassigned.length})`} players={unassigned} onSetTeam={setTeam} onRemove={removePlayer} />
      </section>

      <p className="text-sm text-gray-600">
        After adding players, click <b>Save</b>, then go to <Link className="underline" href="/roster">Build Roster →</Link>.
      </p>
    </main>
  );
}

function TeamList({
  title,
  players,
  onSetTeam,
  onRemove,
}: {
  title: string;
  players: Player[];
  onSetTeam: (id: string, team: Team) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {players.length === 0 ? (
        <p className="text-sm text-gray-600">No players.</p>
      ) : (
        <ul className="space-y-2">
          {players.map(p => (
            <li key={p.id} className="flex items-center gap-3">
              <span className="min-w-[180px]">{p.name}</span>
              <span className="w-[70px] text-sm text-gray-700">HI {p.index.toFixed(1)}</span>
              <select
                className="border px-2 py-1 rounded"
                value={p.team}
                onChange={(e) => onSetTeam(p.id, e.target.value as Team)}
              >
                <option value="NA">N/A</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
              <button className="text-sm underline" onClick={() => onRemove(p.id)}>remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
