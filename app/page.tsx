import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">UPGCS — I-29 Cup</h1>
      <p>Hello from our fresh app. Deployed from GitHub → Vercel.</p>

      <Link href="/players" className="underline">
        Manage Players →
      </Link>
    </main>
  );
}
