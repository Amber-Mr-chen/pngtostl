import { NextResponse } from "next/server";
import { parseConvertOptions, pngToStl } from "@/lib/stl";

export const runtime = "nodejs";

function jsonError(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status });
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError(400, "INVALID_FORM_DATA", "The request must use multipart/form-data.");
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonError(400, "MISSING_FILE", "Upload a PNG file before generating an STL.");
  }

  if (file.size > 5 * 1024 * 1024) {
    return jsonError(413, "FILE_TOO_LARGE", "The MVP accepts PNG files up to 5 MB.");
  }

  if (file.type !== "image/png") {
    return jsonError(415, "UNSUPPORTED_FILE_TYPE", "PNG is the minimum supported format for this MVP.");
  }

  try {
    const options = parseConvertOptions(formData);
    const result = await pngToStl(file, options);
    const filename =
      options.mode === "lithophane" ? "pngtostl-lithophane.stl" :
      options.mode === "extrude" ? "pngtostl-clean-extrude.stl" :
      options.mode === "sketch" ? "pngtostl-sketch-relief.stl" :
      "pngtostl-relief.stl";

    const body = new ArrayBuffer(result.stl.byteLength);
    new Uint8Array(body).set(result.stl);

    return new Response(body, {
      headers: {
        "Content-Type": "model/stl",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(result.binarySize),
        "X-Tool-Mode": options.mode,
        "X-Tool-Source-Width": String(result.sourceWidth),
        "X-Tool-Source-Height": String(result.sourceHeight),
        "X-Tool-Grid-Columns": String(result.columns),
        "X-Tool-Grid-Rows": String(result.rows),
        "X-Tool-Triangle-Count": String(result.triangleCount),
        "X-Tool-Occupied-Ratio": result.occupiedRatio.toFixed(4),
        "X-Tool-Output-Kind": result.outputKind,
      },
    });
  } catch {
    return jsonError(422, "IMAGE_DECODE_FAILED", "The uploaded PNG could not be decoded for STL conversion.");
  }
}
