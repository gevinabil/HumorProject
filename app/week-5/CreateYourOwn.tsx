"use client";

import { useEffect, useMemo, useState } from "react";

export default function CreateYourOwn() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function generateCaptions() {
    if (!file || loading) return;

    setLoading(true);
    setError(null);
    setCaption(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/caption", {
        method: "POST",
        body: formData,
      });
      const json: {
        caption?: string;
        error?: string;
        details?: string;
        step?: number;
        imageId?: string;
        userId?: string;
      } = await res.json();

      if (!res.ok) {
        const fullError = [
          json.error,
          json.details,
          json.step ? `step=${json.step}` : null,
          json.imageId ? `imageId=${json.imageId}` : null,
          json.userId ? `userId=${json.userId}` : null,
        ]
          .filter(Boolean)
          .join(" — ");
        setError(fullError || "Caption generation failed");
        setLoading(false);
        return;
      }

      setCaption(typeof json.caption === "string" ? json.caption : null);
      setLoading(false);
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  const buttonLabel = loading ? "Generating..." : "Generate captions";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="rounded-[26px] border border-white/10 bg-[#0f1115]/90 p-6 shadow-[0_24px_65px_rgba(0,0,0,.5)] sm:p-10">
        <div className="rounded-2xl border border-white/15 bg-[#151922] p-6 text-center sm:p-10">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.03]">
            <div className="h-6 w-9 rounded-sm border border-white/70 bg-transparent" />
          </div>
          <p className="mt-5 text-xl font-semibold text-white">Upload your image</p>
          <p className="mt-2 text-sm text-white/55">
            Authorized formats: jpg, jpeg, png, webp, gif, heic
          </p>
          <div className="mx-auto mt-6 flex w-full max-w-xs items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/35">
            <div className="h-px flex-1 bg-white/20" />
            or
            <div className="h-px flex-1 bg-white/20" />
          </div>
          <label className="mt-6 inline-block cursor-pointer rounded-xl border border-white/20 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90">
            Choose File
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setCaption(null);
                setError(null);
              }}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {previewUrl ? (
        <div className="rounded-2xl border border-white/10 bg-[#0f1115] p-4">
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="max-h-[560px] w-full rounded-xl bg-black object-contain"
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-white/70">{file?.name}</p>
            <button
              disabled={loading}
              onClick={generateCaptions}
              className="rounded-xl border border-white/25 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      ) : null}

      {caption ? (
        <div className="rounded-2xl border border-white/10 bg-[#0f1115] p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-white/50">Generated Caption</p>
          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-6">
            <p className="text-xl leading-9 text-white/95 sm:text-2xl sm:leading-10">{caption}</p>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}
