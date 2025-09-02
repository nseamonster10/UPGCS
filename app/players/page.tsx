'use client';

import { useEffect, useState } from 'react';

type Player = { id: string; name: string; index: number };
const STORAGE_KEY = 'upgcs.players';

export default function PlayersPage() {
  const [name, setName] = useState('');
  const [index, setIndex] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);

  // Load saved players from the browser
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPlayers(JSON.parse(raw));
    } catch {}
  }, []);

  // Save whenever the list changes
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
      { id: Math.random().toString(36).slice(2), name: name.trim(), index: Number(index) },
    ]);
    setName('');
    setIndex('');
  }

  function remove(id: string) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }

  function clearAll() {
    setPlayers([]);
  }

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
          className="border px-3 py-2 rounded w-32"
          placeholder="Handicap Index"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
        />
        <button className="border px-3 py-2 rounded" type="submit">Add</button>
        <button className="border px-3 py-2 rounded" type="button" onClick={clearAll}>Clear All</button>
      </form>

      <ul className="space-y-2">
        {players.map((p) => (
          <li key={p.id} className="flex gap-3 items-center">
            <span className="font-medium w-48">{p.name}</span>
            <span>HI: {p.index.toFixed(1)}</span>
            <button className="underline" onClick={() => remove(p.id)}>remove</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
