"use client";

import { useEffect, useMemo, useState } from "react";

type RunState = "idle" | "uploading" | "success" | "error";

export default function CreateYourOwn() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [runState, setRunState] = useState<RunState>("idle");

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function generateCaptions() {
    if (loading || !file) return;

    setLoading(true);
    setError(null);
    setCaption(null);
    setRunState("uploading");

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
        setRunState("error");
        setLoading(false);
        return;
      }

      setCaption(typeof json.caption === "string" ? json.caption : null);
      setRunState("success");
      setLoading(false);
    } catch {
      setError("Network error");
      setRunState("error");
      setLoading(false);
    }
  }

  const buttonLabel = loading ? "Generating..." : "Generate captions";
  const uploadStepLabel = file ? `Selected: ${file.name}` : "Choose one image to start";
  const generateHelpText = !file
    ? "Upload an image first. The generate button will work after that."
    : loading
      ? "Generating a caption now. This can take a few seconds."
      : caption
        ? "Caption ready. Upload a new image if you want to try again."
        : "Your image is ready. Click Generate Captions.";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_.9fr]">
        <div className="rounded-[24px] border border-emerald-300/20 bg-emerald-300/[0.08] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/80">How It Works</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Start here</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
            Upload one image, then click Generate Captions. The app sends your image through the caption pipeline and
            returns a caption below.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Steps</p>
          <ol className="mt-3 space-y-3 text-sm text-white/78">
            <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="mr-2 font-semibold text-white">1.</span>
              Upload an image.
            </li>
            <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="mr-2 font-semibold text-white">2.</span>
              Click Generate Captions.
            </li>
            <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="mr-2 font-semibold text-white">3.</span>
              Read your generated result below.
            </li>
          </ol>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-white/50">Step 1</p>
          <p className="mt-2 text-lg font-semibold text-white">Upload an image</p>
          <p className="mt-1 text-sm text-white/62">{uploadStepLabel}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-white/50">Step 2</p>
          <p className="mt-2 text-lg font-semibold text-white">Generate a caption</p>
          <p className="mt-1 text-sm text-white/62">{generateHelpText}</p>
        </div>
      </div>

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
                setRunState("idle");
              }}
              className="sr-only"
            />
          </label>
          <p className="mt-4 text-sm text-white/62">After you upload, use the Generate Captions button below.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0f1115] p-4">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="max-h-[560px] w-full rounded-xl bg-black object-contain"
          />
        ) : (
          <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/30 px-6 text-center">
            <div>
              <p className="text-lg font-semibold text-white">No image uploaded yet</p>
              <p className="mt-2 text-sm text-white/58">
                Choose a file above first. Your image preview will appear here.
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/70">{file?.name ?? "Waiting for an image"}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/45">
              {runState === "uploading"
                ? "Generating now"
                : runState === "success"
                  ? "Completed"
                  : runState === "error"
                    ? "Needs attention"
                    : "Ready"}
            </p>
          </div>
          <button
            disabled={loading || !file}
            onClick={generateCaptions}
            className="rounded-xl border border-white/25 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      {caption ? (
        <div className="rounded-2xl border border-white/10 bg-[#0f1115] p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-white/50">Generated Caption</p>
          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-6">
            <p className="text-xl leading-9 text-white/95 sm:text-2xl sm:leading-10">{caption}</p>
          </div>
          <p className="mt-3 text-sm text-emerald-200/80">Success. Your caption is ready.</p>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="rounded-xl border border-sky-300/25 bg-sky-400/10 px-4 py-3 text-sm text-sky-100">
          Generating your caption. Please wait.
        </p>
      ) : null}
    </div>
  );
}
