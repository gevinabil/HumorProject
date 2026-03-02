import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/server";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
]);

type PresignResponse = {
  presignedUrl?: string;
  cdnUrl?: string;
};

type UploadFromUrlResponse = {
  imageId?: string;
};

function extractCaptionStrings(payload: unknown): string[] {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => {
        if (typeof item === "string") return item;
        if (!item || typeof item !== "object") return null;
        const value = item as { content?: unknown; caption?: unknown; text?: unknown };
        if (typeof value.content === "string") return value.content;
        if (typeof value.caption === "string") return value.caption;
        if (typeof value.text === "string") return value.text;
        return null;
      })
      .filter((value): value is string => Boolean(value && value.trim()))
      .map((value) => value.trim());
  }

  if (payload && typeof payload === "object") {
    const obj = payload as {
      captions?: unknown;
      data?: unknown;
      content?: unknown;
      caption?: unknown;
      text?: unknown;
    };

    if (Array.isArray(obj.captions)) return extractCaptionStrings(obj.captions);
    if (Array.isArray(obj.data)) return extractCaptionStrings(obj.data);
    if (typeof obj.content === "string" && obj.content.trim()) return [obj.content.trim()];
    if (typeof obj.caption === "string" && obj.caption.trim()) return [obj.caption.trim()];
    if (typeof obj.text === "string" && obj.text.trim()) return [obj.text.trim()];
  }

  return [];
}

export async function POST(req: Request) {
  try {
    const supabase = await createRouteClient();
    const { data: auth } = await supabase.auth.getUser();
    const { data: sessionData } = await supabase.auth.getSession();

    if (!auth?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Missing image file" }, { status: 400 });
    }

    if (!ALLOWED_CONTENT_TYPES.has(image.type.toLowerCase())) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (image.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image is too large (max 8MB)" }, { status: 400 });
    }

    const token = sessionData.session?.access_token ?? process.env.ALMOSTCRACKD_API_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Missing auth token from session" }, { status: 401 });
    }

    const baseUrl = process.env.ALMOSTCRACKD_API_BASE_URL ?? "https://api.almostcrackd.ai";
    const authHeader = { Authorization: `Bearer ${token}` };

    // Step 1: generate presigned URL.
    const presignRes = await fetch(`${baseUrl}/pipeline/generate-presigned-url`, {
      method: "POST",
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contentType: image.type }),
    });

    if (!presignRes.ok) {
      return NextResponse.json(
        { error: "Failed to generate presigned URL", details: await presignRes.text() },
        { status: 502 }
      );
    }

    const presignPayload = (await presignRes.json()) as PresignResponse;
    const presignedUrl = presignPayload.presignedUrl;
    const cdnUrl = presignPayload.cdnUrl;

    if (!presignedUrl || !cdnUrl) {
      return NextResponse.json(
        { error: "Presign response missing presignedUrl or cdnUrl" },
        { status: 502 }
      );
    }

    // Step 2: upload bytes to presigned URL.
    const putRes = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": image.type,
      },
      body: image,
    });

    if (!putRes.ok) {
      return NextResponse.json(
        { error: "Failed to upload image bytes", details: await putRes.text() },
        { status: 502 }
      );
    }

    // Step 3: register uploaded URL.
    const registerRes = await fetch(`${baseUrl}/pipeline/upload-image-from-url`, {
      method: "POST",
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: cdnUrl,
        isCommonUse: false,
      }),
    });

    if (!registerRes.ok) {
      return NextResponse.json(
        { error: "Failed to register uploaded image URL", details: await registerRes.text() },
        { status: 502 }
      );
    }

    const registerPayload = (await registerRes.json()) as UploadFromUrlResponse;
    const imageId = registerPayload.imageId;

    if (!imageId) {
      return NextResponse.json(
        { error: "Upload registration did not return imageId" },
        { status: 502 }
      );
    }

    // Step 4: generate captions.
    const captionRes = await fetch(`${baseUrl}/pipeline/generate-captions`, {
      method: "POST",
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId }),
    });

    if (!captionRes.ok) {
      return NextResponse.json(
        {
          error: "Failed to generate captions",
          step: 4,
          details: await captionRes.text(),
          imageId,
          userId: auth.user.id,
        },
        { status: 502 }
      );
    }

    const captionsPayload = (await captionRes.json()) as unknown;
    const captions = extractCaptionStrings(captionsPayload);

    if (captions.length === 0) {
      return NextResponse.json(
        { error: "No captions returned by pipeline", raw: captionsPayload },
        { status: 502 }
      );
    }

    return NextResponse.json({ imageId, caption: captions[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
