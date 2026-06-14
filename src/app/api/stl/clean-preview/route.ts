import { NextResponse } from "next/server";
import { cleanSketchPreviewPng, parseConvertOptions } from "@/lib/stl";

export const runtime = "nodejs";

function jsonError(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status, headers: { "Cache-Control": "no-store" } });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: "OPTIONS, POST", "Cache-Control": "no-store" } });
}

export function GET() {
  return new Response(null, { status: 405, headers: { Allow: "OPTIONS, POST", "Cache-Control": "no-store" } });
}

export const HEAD = GET;

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError(400, "INVALID_FORM_DATA", "The request must use multipart/form-data.");
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonError(400, "MISSING_FILE", "Upload a PNG file before previewing cleanup.");
  }

  if (file.size > 5 * 1024 * 1024) {
    return jsonError(413, "FILE_TOO_LARGE", "The preview accepts PNG files up to 5 MB.");
  }

  if (file.type !== "image/png") {
    return jsonError(415, "UNSUPPORTED_FILE_TYPE", "PNG is required after browser normalization.");
  }

  try {
    const options = parseConvertOptions(formData);
    const result = await cleanSketchPreviewPng(file, options);
    const body = new ArrayBuffer(result.png.byteLength);
    new Uint8Array(body).set(result.png);

    return new Response(body, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(result.png.byteLength),
        "Cache-Control": "no-store",
        "X-Clean-Preview-Width": String(result.width),
        "X-Clean-Preview-Height": String(result.height),
      },
    });
  } catch {
    return jsonError(422, "IMAGE_DECODE_FAILED", "The uploaded PNG could not be decoded for cleanup preview.");
  }
}
