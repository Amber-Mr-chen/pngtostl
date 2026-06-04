import { convertPngBufferToStl } from "@/lib/png-to-stl";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function jsonError(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}

function safeStlFileName(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "");
  return `${baseName || "png-model"}.stl`;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return jsonError("Expected multipart/form-data with a PNG file.", 400);
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return jsonError("Missing file field named file.", 400);
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return jsonError("File is too large. Limit is 10 MB.", 413);
  }

  if (file.type !== "image/png" && !file.name.toLowerCase().endsWith(".png")) {
    return jsonError("Only PNG files are accepted.", 400);
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));
    const result = convertPngBufferToStl(buffer);
    const stlFileName = safeStlFileName(file.name);

    return new Response(result.stl, {
      headers: {
        "Content-Disposition": `attachment; filename="${stlFileName}"`,
        "Content-Type": "model/stl; charset=utf-8",
        "X-PNGToSTL-Source-Width": String(result.sourceWidth),
        "X-PNGToSTL-Source-Height": String(result.sourceHeight),
        "X-PNGToSTL-Mesh-Width": String(result.meshWidth),
        "X-PNGToSTL-Mesh-Height": String(result.meshHeight),
        "X-PNGToSTL-Triangle-Count": String(result.triangleCount),
      },
    });
  } catch {
    return jsonError("Could not parse the PNG file.", 400);
  }
}
