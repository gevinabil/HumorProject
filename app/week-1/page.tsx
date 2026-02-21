"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const dynamic = "force-dynamic";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randColor() {
  const r = randInt(90, 255);
  const g = randInt(90, 255);
  const b = randInt(90, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function Week1Page() {
  const elRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [x, setX] = useState(80);
  const [y, setY] = useState(140);
  const [color, setColor] = useState(randColor());

  useEffect(() => {
    let px = 80;
    let py = 140;

    // Speed (tweak if you want faster/slower)
    let vx = 4.2;
    let vy = 3.6;

    const tick = () => {
      const el = elRef.current;
      if (!el) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const w = el.offsetWidth || 360;
      const h = el.offsetHeight || 120;

      const maxX = Math.max(0, window.innerWidth - w);
      const maxY = Math.max(0, window.innerHeight - h);

      px += vx;
      py += vy;

      let bounced = false;

      if (px <= 0) {
        px = 0;
        vx = Math.abs(vx);
        bounced = true;
      } else if (px >= maxX) {
        px = maxX;
        vx = -Math.abs(vx);
        bounced = true;
      }

      if (py <= 0) {
        py = 0;
        vy = Math.abs(vy);
        bounced = true;
      } else if (py >= maxY) {
        py = maxY;
        vy = -Math.abs(vy);
        bounced = true;
      }

      if (bounced) setColor(randColor());

      setX(px);
      setY(py);

      rafRef.current = requestAnimationFrame(tick);
    };

    // Start AFTER layout/fonts settle (fixes “doesn’t populate”)
    const start = () => {
      const el = elRef.current;
      if (el) {
        const w = el.offsetWidth || 360;
        const h = el.offsetHeight || 120;
        px = Math.min(Math.max(0, px), Math.max(0, window.innerWidth - w));
        py = Math.min(Math.max(0, py), Math.max(0, window.innerHeight - h));
        setX(px);
        setY(py);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const t = window.setTimeout(start, 50);

    const onResize = () => {
      const el = elRef.current;
      if (!el) return;
      const w = el.offsetWidth || 360;
      const h = el.offsetHeight || 120;
      px = Math.min(Math.max(0, px), Math.max(0, window.innerWidth - w));
      py = Math.min(Math.max(0, py), Math.max(0, window.innerHeight - h));
      setX(px);
      setY(py);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="startup-shell">
      <div className="pointer-events-none absolute right-[-180px] top-28 h-64 w-[500px] rotate-12 bg-gradient-to-r from-[#ff1248] to-[#ff3d6e] opacity-20" />

      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/protected"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-sm text-white/85 hover:text-white hover:bg-black/65 transition"
        >
          ← Back
        </Link>
      </div>

      <div className="absolute left-6 top-20 z-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff6f93]">Week 1</p>
      </div>

      {/* Bouncing element */}
      <div
        ref={elRef}
        className="fixed z-20 select-none"
        style={{
          transform: `translate3d(${x}px, ${y}px, 0)`,
          willChange: "transform",
        }}
      >
        <div
          className="rounded-3xl border border-black/20 bg-[#f4f4f4] px-10 py-8 shadow-[0_18px_60px_rgba(0,0,0,.45)]"
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,.03) inset, 0 30px 90px rgba(0,0,0,.55)",
          }}
        >
          <div className="mb-3 text-xs tracking-widest text-[#ff1248]">WEEK 1</div>
          <div
            className="font-black leading-none"
            style={{
              fontSize: "clamp(56px, 6vw, 92px)", // BIG
              color,
              textShadow:
                "0 0 20px rgba(255,255,255,.15), 0 0 36px rgba(0,0,0,.42)",
            }}
          >
            Hello World
          </div>
        </div>
      </div>
    </div>
  );
}
