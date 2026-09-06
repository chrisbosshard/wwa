import {
  createDirectus,
  rest,
  staticToken,
  readItems,
  readSingleton,
  createItem,
  updateItem,
  deleteItem,
  uploadFiles,
} from "@directus/sdk";

function getDirectusUrl() {
  return process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
}

function getDirectusToken() {
  return process.env.DIRECTUS_TOKEN || "";
}

function isAuthError(error: unknown): boolean {
  const parts: string[] = [];
  if (error instanceof Error) parts.push(error.message);
  if (typeof error === "string") parts.push(error);

  const directusErrors = (error as { errors?: { message?: string }[] })?.errors;
  if (Array.isArray(directusErrors)) {
    parts.push(...directusErrors.map((entry) => entry.message ?? ""));
  }

  const responseStatus = (error as { response?: { status?: number } })?.response?.status;
  if (responseStatus) parts.push(String(responseStatus));

  const combined = parts.join(" ");
  return /INVALID_CREDENTIALS|invalid user credentials|401|403|Unauthorized/i.test(combined);
}

async function getAdminAccessToken(): Promise<string | null> {
  const email = process.env.DIRECTUS_ADMIN_EMAIL;
  const password = process.env.DIRECTUS_ADMIN_PASSWORD;
  if (!email || !password) return null;

  const res = await fetch(`${getDirectusUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data?.access_token ?? null;
}

export function createDirectusClient(token?: string) {
  let client = createDirectus(getDirectusUrl()).with(rest());
  const authToken = token ?? getDirectusToken();
  if (authToken) {
    client = client.with(staticToken(authToken));
  }
  return client;
}

/** Run a Directus request; retries with admin login / public access if the static token fails. */
export async function requestDirectus<T>(
  request: (client: ReturnType<typeof createDirectusClient>) => Promise<T>
): Promise<T> {
  const staticToken = getDirectusToken();

  if (staticToken) {
    try {
      return await request(createDirectusClient(staticToken));
    } catch (error) {
      if (!isAuthError(error)) throw error;
      console.warn("[directus] Static token rejected, trying fallbacks");
    }
  }

  const adminToken = await getAdminAccessToken();
  if (adminToken) {
    try {
      return await request(createDirectusClient(adminToken));
    } catch (error) {
      console.warn("[directus] Admin session failed, trying public access", error);
    }
  }

  return await request(createDirectusClient(undefined));
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
  deleteItem,
  uploadFiles,
};
