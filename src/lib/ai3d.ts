export type MeshyTaskStatus = "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED" | "CANCELED" | string;

export type MeshyTask = {
  id: string;
  status?: MeshyTaskStatus;
  model_urls?: {
    glb?: string;
    obj?: string;
    stl?: string;
    fbx?: string;
    usdz?: string;
    pre_remeshed_glb?: string;
  };
  thumbnail_url?: string;
  task_error?: { message?: string } | string | null;
};

export type MeshyTextTo3dTask = MeshyTask & {
  prompt?: string;
};

const MESHY_API_BASE = "https://api.meshy.ai/openapi/v1";
const MESHY_API_BASE_V2 = "https://api.meshy.ai/openapi/v2";

function meshyApiKey() {
  return process.env.MESHY_API_KEY || process.env.AI3D_MESHY_API_KEY || "";
}

function meshyHeaders() {
  const apiKey = meshyApiKey();
  if (!apiKey) return undefined;
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

function normalizeMeshyTask(body: any): MeshyTask {
  const task = body && typeof body === "object" ? body.task || body : {};
  return {
    id: String(task.id || task.result || body?.id || ""),
    status: task.status,
    model_urls: task.model_urls,
    thumbnail_url: task.thumbnail_url,
    task_error: task.task_error,
  };
}

export function isMeshyConfigured() {
  return Boolean(meshyApiKey());
}

export async function createMeshyImageTo3dTask(file: File) {
  const headers = meshyHeaders();
  if (!headers) throw new Error("MESHY_API_KEY is not configured.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const base64 = Buffer.from(bytes).toString("base64");
  const mime = file.type === "image/jpeg" || file.type === "image/png" ? file.type : "image/png";

  const response = await fetch(`${MESHY_API_BASE}/image-to-3d`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      image_url: `data:${mime};base64,${base64}`,
      model_type: "standard",
      ai_model: "latest",
      should_texture: true,
      enable_pbr: false,
      should_remesh: true,
      save_pre_remeshed_model: true,
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.message === "string" ? body.message : "Meshy image-to-3D request failed.";
    throw new Error(message);
  }

  return normalizeMeshyTask(body);
}

export async function getMeshyImageTo3dTask(id: string) {
  const headers = meshyHeaders();
  if (!headers) throw new Error("MESHY_API_KEY is not configured.");

  const response = await fetch(`${MESHY_API_BASE}/image-to-3d/${encodeURIComponent(id)}`, {
    headers: { Authorization: headers.Authorization },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.message === "string" ? body.message : "Meshy task lookup failed.";
    throw new Error(message);
  }

  return normalizeMeshyTask(body);
}

export async function createMeshyTextTo3dTask(prompt: string) {
  const headers = meshyHeaders();
  if (!headers) throw new Error("MESHY_API_KEY is not configured.");

  const response = await fetch(`${MESHY_API_BASE_V2}/text-to-3d`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      mode: "preview",
      prompt,
      art_style: "realistic",
      should_remesh: true,
      save_pre_remeshed_model: true,
      should_texture: true,
      topology: "quad",
      target_polycount: 30000,
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.message === "string" ? body.message : "Meshy text-to-3D request failed.";
    throw new Error(message);
  }

  return normalizeMeshyTask(body) as MeshyTextTo3dTask;
}

export async function getMeshyTextTo3dTask(id: string) {
  const headers = meshyHeaders();
  if (!headers) throw new Error("MESHY_API_KEY is not configured.");

  const response = await fetch(`${MESHY_API_BASE_V2}/text-to-3d/${encodeURIComponent(id)}`, {
    headers: { Authorization: headers.Authorization },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.message === "string" ? body.message : "Meshy text-to-3D task lookup failed.";
    throw new Error(message);
  }

  return normalizeMeshyTask(body) as MeshyTextTo3dTask;
}
