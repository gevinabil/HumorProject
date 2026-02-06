import Link from "next/link";

export default function Week1() {
  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-sm border p-10 text-center">
        <h1 className="text-6xl font-bold tracking-tight">Hello World</h1>
        <p className="mt-4 text-zinc-600">Week 1</p>

        <div className="mt-8">
          <Link className="text-sm text-zinc-600 underline" href="/">
            ← Back
          </Link>
        </div>
      </div>
    </main>
  );
}
