import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="flex flex-col gap-6 text-center">
        <h1 className="text-5xl font-bold">The Humor Project</h1>

        <Link
          href="/week-1"
          className="px-8 py-4 text-xl rounded-lg bg-black text-white hover:bg-zinc-800"
        >
          Week 1
        </Link>

        <Link
          href="/week-2"
          className="px-8 py-4 text-xl rounded-lg bg-blue-600 text-white hover:bg-blue-500"
        >
          Week 2
        </Link>
      </div>
    </main>
  );
}

