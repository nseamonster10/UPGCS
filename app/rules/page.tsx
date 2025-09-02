'use client';

import Link from "next/link";

export default function RulesPage() {
  const printPage = () => window.print();

  return (
    <main className="min-h-screen p-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">I-29 Cup — Rules & Formats</h1>
        <div className="flex gap-3">
          <Link href="/" className="underline">Home</Link>
          <button onClick={printPage} className="border px-3 py-2 rounded">Print</button>
        </div>
      </header>

      {/* Overview */}
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>All matches are <b>NET</b> scoring.</li>
          <li>If a match/segment is tied, each side gets <b>0.5</b> points.</li>
          <li>Total points available: <b>24</b>. First to <b>12.5</b> wins the Cup.</li>
        </ul>
      </section>

      {/* Saturday Morning */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Saturday Morning (6 matches total)</h2>

        <div>
          <h3 className="text-xl font-medium">Scramble — 9 Holes (3 matches)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Format: classic 2-man scramble.</li>
            <li>2v2 <b>match play</b>, 9 holes.</li>
            <li>Each match worth <b>1 point</b>. Total: <b>3 points</b>.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-medium">Shamble — 9 Holes (3 matches)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Both players tee off, select the best drive, then each plays their own ball in.</li>
            <li>Team score = lower NET score of the pair on each hole.</li>
            <li>2v2 <b>match play</b>, 9 holes.</li>
            <li>Each match worth <b>1 point</b>. Total: <b>3 points</b>.</li>
          </ul>
        </div>

        <p className="text-sm text-gray-700">Subtotal Morning: <b>6 points</b>.</p>
      </section>

      {/* Saturday Afternoon */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Saturday Afternoon (6 matches total)</h2>

        <div>
          <h3 className="text-xl font-medium">Alternate Shot — 9 Holes (3 matches)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Partners play one ball, alternating shots until holed.</li>
            <li>One partner tees odd holes; the other tees even holes.</li>
            <li>2v2 <b>match play</b>, 9 holes.</li>
            <li>Each match worth <b>1 point</b>. Total: <b>3 points</b>.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-medium">Four-Ball (Best Ball) — 9 Holes (3 matches)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Each player plays their own ball.</li>
            <li>Team score on a hole = lower NET score between the two teammates.</li>
            <li>2v2 <b>match play</b>, 9 holes.</li>
            <li>Each match worth <b>1 point</b>. Total: <b>3 points</b>.</li>
          </ul>
        </div>

        <p className="text-sm text-gray-700">Subtotal Afternoon: <b>6 points</b>.</p>
      </section>

      {/* Sunday Morning */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Sunday Morning (6 matches total)</h2>

        <div>
          <h3 className="text-xl font-medium">Singles Stableford — 18 Holes (6 matches)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>1v1 NET Stableford, 18 holes.</li>
            <li>Points per hole (NET): Bogey 1 · Par 2 · Birdie 4 · Eagle 6.</li>
            <li>Most total Stableford points wins the match.</li>
            <li>Each match worth <b>2 points</b>. Total: <b>12 points</b>.</li>
          </ul>
        </div>
      </section>

      {/* Summary */}
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Points Summary</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Saturday Morning: 6 points (Scramble 3 · Shamble 3)</li>
          <li>Saturday Afternoon: 6 points (Alt-Shot 3 · Four-Ball 3)</li>
          <li>Sunday Morning: 12 points (Singles Stableford 6 × 2)</li>
          <li><b>Total: 24 points</b> · Win requires <b>12.5</b>.</li>
        </ul>
      </section>

      <footer className="pt-6 border-t text-sm text-gray-600">
        Adjust any details as your group prefers; this page is your quick reference on course.
      </footer>
    </main>
  );
}
