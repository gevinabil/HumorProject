import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Humor Project
        </h1>
        <p className="mt-4 max-w-xl text-center text-lg text-zinc-600">
          Choose a week to view your submission output.
        </p>

        <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
          <Link
            href="/week-1"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold">Week 1</span>
              <span className="text-zinc-400 transition group-hover:text-zinc-600">
                →
              </span>
            </div>
            <p className="mt-2 text-zinc-600">
              Hello World, large and clean.
            </p>
          </Link>

          <Link
            href="/week-2"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold">Week 2</span>
              <span className="text-zinc-400 transition group-hover:text-zinc-600">
                →
              </span>
            </div>
            <p className="mt-2 text-zinc-600">
              Caption examples in a nice table.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
