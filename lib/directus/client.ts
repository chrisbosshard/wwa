import {
  createDirectus,
  rest,
  staticToken,
  readItems,
  readSingleton,
  createItem,
  updateItem,
  uploadFiles,
} from "@directus/sdk";

function getDirectusUrl() {
  return process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
}

function getDirectusToken() {
  return process.env.DIRECTUS_TOKEN || "";
}

export function createDirectusClient(token?: string) {
  let client = createDirectus(getDirectusUrl()).with(rest());
  const authToken = token ?? getDirectusToken();
  if (authToken) {
    client = client.with(staticToken(authToken));
  }
  return client;
}

export function getAssetUrl(file: { id: string } | string | null | undefined, params?: Record<string, string>): string | null {
  if (!file) return null;
  const id = typeof file === "string" ? file : file.id;
  const base = process.env.NEXT_PUBLIC_DIRECTUS_URL || getDirectusUrl();
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  return `${base}/assets/${id}${query}`;
}

export {
  createDirectus,
  rest,
  staticToken,
  readItems,
  readSingleton,
  createItem,
  updateItem,
  uploadFiles,
};
