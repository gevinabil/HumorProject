"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type WeekItem = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  href: string;
};

const WEEKS: WeekItem[] = [
  {
    id: "week-1",
    label: "Week 1",
    title: "Hello World",
    subtitle: "Animated intro challenge",
    href: "/week-1",
  },
  {
    id: "week-2",
    label: "Week 2",
    title: "Database Read",
    subtitle: "Connected Supabase listing",
    href: "/week-2",
  },
  {
    id: "week-4",
    label: "Week 4",
    title: "Mutating Data",
    subtitle: "Caption voting experience",
    href: "/week-4",
  },
  {
    id: "week-5",
    label: "Week 5",
    title: "Create Your Own",
    subtitle: "Upload image and generate captions",
    href: "/week-5",
  },
];

const ROW_HEIGHT = 64;
const ROW_GAP = 12;

export default function WeekDashboard({ email }: { email: string | undefined }) {
  const router = useRouter();
  const [selected, setSelected] = useState(3);
  const active = WEEKS[selected];

  const indicatorStyle = useMemo(
    () => ({
      transform: `translateY(${selected * (ROW_HEIGHT + ROW_GAP)}px)`,
    }),
    [selected]
  );

  return (
    <div className="relative z-10 min-h-screen bg-black text-white">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md border border-white/20 bg-white/[0.03]" />
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">Humor Lab</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {WEEKS.map((week, index) => (
              <button
                key={week.id}
                onClick={() => setSelected(index)}
                className={`text-xs uppercase tracking-[0.22em] transition ${
                  selected === index ? "text-white" : "text-white/55 hover:text-white/80"
                }`}
              >
                {week.label}
              </button>
            ))}
          </nav>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-white/90"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <section className="relative h-[640px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2200&q=80"
          alt="Hardware board"
          className="h-full w-full object-cover opacity-80 [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
        />

        <div className="pointer-events-none absolute left-8 top-28 h-10 w-10 border-l border-t border-white/30" />
        <div className="pointer-events-none absolute right-8 top-28 h-10 w-10 border-r border-t border-white/30" />
        <div className="pointer-events-none absolute bottom-24 left-8 h-10 w-10 border-b border-l border-white/30" />
        <div className="pointer-events-none absolute bottom-24 right-8 h-10 w-10 border-b border-r border-white/30" />

        <div className="absolute inset-x-0 top-24 z-20 mx-auto w-full max-w-5xl px-6 text-center">
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl">
            Build Better Captions From Any Image
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-white/65">
            {email ?? "Signed in"} · black minimal interface with upload pipeline and week modules.
          </p>
          <div className="mt-8">
            <button
              onClick={() => router.push(active.href)}
              className="rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-white/90"
            >
              Open {active.label}
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto -mt-28 grid w-full max-w-[1720px] gap-10 px-6 pb-32 lg:grid-cols-[360px_1fr]">
        <aside className="relative p-1">
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 h-16 rounded-lg bg-white/[0.08] transition-transform duration-300"
            style={indicatorStyle}
          />
          <div className="relative space-y-3">
            {WEEKS.map((week, index) => (
              <button
                key={week.id}
                onClick={() => setSelected(index)}
                className={`flex h-16 w-full items-center justify-between rounded-lg px-5 text-left transition ${
                  selected === index ? "text-white" : "text-white/65 hover:text-white"
                }`}
              >
                <span className="text-xl font-semibold uppercase tracking-[0.2em]">{week.label}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-white/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-5 py-2">
          <p className="text-sm uppercase tracking-[0.24em] text-white/45">Module Preview</p>
          <p className="text-sm uppercase tracking-[0.2em] text-white/45">{active.label}</p>
          <h2 className="text-6xl font-black text-white">{active.title}</h2>
          <p className="max-w-3xl text-3xl text-white/65">{active.subtitle}</p>
          <button
            onClick={() => router.push(active.href)}
            className="mt-6 rounded-full border border-white/20 bg-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-white/90"
          >
            Enter Module
          </button>
        </section>
      </main>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full border border-white/20 bg-[#141414] text-lg text-white shadow-[0_12px_30px_rgba(0,0,0,.6)] transition hover:bg-[#1b1b1b]"
      >
        ?
      </button>
    </div>
  );
}
