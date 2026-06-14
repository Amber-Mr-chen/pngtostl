import { NextResponse } from "next/server";
import {
  createMeshyImageTo3dTask,
  createMeshyTextTo3dTask,
  getMeshyImageTo3dTask,
  getMeshyTextTo3dTask,
  isMeshyConfigured,
} from "@/lib/ai3d";

export const runtime = "nodejs";

function jsonError(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";
  const type = url.searchParams.get("type") || "image";
  if (!id) return jsonError(400, "MISSING_TASK_ID", "Pass a Meshy task id to check generation status.");
  if (!isMeshyConfigured()) return jsonError(503, "AI_3D_NOT_CONFIGURED", "AI 3D generation is not configured on this deployment yet.");

  try {
    const task = type === "text" ? await getMeshyTextTo3dTask(id) : await getMeshyImageTo3dTask(id);
    return NextResponse.json({ provider: "meshy", task, type });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not check the AI 3D task.";
    return jsonError(502, "AI_3D_TASK_LOOKUP_FAILED", message);
  }
}

export async function POST(request: Request) {
  if (!isMeshyConfigured()) return jsonError(503, "AI_3D_NOT_CONFIGURED", "AI 3D generation is not configured on this deployment yet.");

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError(400, "INVALID_FORM_DATA", "The request must use multipart/form-data.");
  }

  const prompt = String(formData.get("prompt") || "").trim();
  if (prompt) {
    try {
      const task = await createMeshyTextTo3dTask(prompt);
      return NextResponse.json({ provider: "meshy", task, type: "text" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not start AI 3D generation.";
      return jsonError(502, "AI_3D_TASK_CREATE_FAILED", message);
    }
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return jsonError(400, "MISSING_FILE", "Upload an image file before starting AI 3D generation.");
  if (file.size > 8 * 1024 * 1024) return jsonError(413, "FILE_TOO_LARGE", "AI 3D generation accepts images up to 8 MB.");
  if (file.type !== "image/png" && file.type !== "image/jpeg") return jsonError(415, "UNSUPPORTED_FILE_TYPE", "AI 3D generation currently accepts PNG or JPG images.");

  try {
    const task = await createMeshyImageTo3dTask(file);
    return NextResponse.json({ provider: "meshy", task, type: "image" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start AI 3D generation.";
    return jsonError(502, "AI_3D_TASK_CREATE_FAILED", message);
  }
}
