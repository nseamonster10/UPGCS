import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">UPGCS — I-29 Cup</h1>
      <p>Hello from our fresh app. Deployed from GitHub → Vercel.</p>

      <ul className="list-disc pl-6 space-y-2">
        <li><Link href="/players" className="underline">Manage Players →</Link></li>
        <li><Link href="/rules" className="underline">Rules / Formats →</Link></li>
        <li><Link href="/pairings/sat-am" className="underline">Pairings — Saturday AM →</Link></li>
      </ul>
    </main>
  );
}
