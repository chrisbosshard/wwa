/** Browser-side fetch helpers for Directus API routes */

export async function apiGet(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPatch(path, body) {
  const res = await fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/directus/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchKids(after = 0, time) {
  const params = new URLSearchParams({ after: String(after), time });
  return apiGet(`/api/directus/kids?${params}`);
}

export async function fetchWishes() {
  return apiGet("/api/directus/wishes");
}

export async function fetchApplication() {
  return apiGet("/api/directus/application");
}

export async function blockKid(id, checkout) {
  return apiPatch(`/api/directus/kids/${id}`, { checkout });
}

export async function createDonor(data) {
  return apiPost("/api/directus/donors", { data });
}

export async function updateDonorPayment(id) {
  return apiPatch(`/api/directus/donors/${id}`, { paymentSuccessful: "Yes" });
}

export async function connectKidToDonor(kidId, donorId) {
  return apiPatch(`/api/directus/kids/${kidId}`, { donorId, completed: true });
}

export async function createWish(data) {
  return apiPost("/api/directus/wishes", { data });
}

export async function createFamily(data, kids, imageId) {
  return apiPost("/api/directus/families", { data, kids, imageId });
}

export async function updateKid(id, data) {
  return apiPatch(`/api/directus/kids/${id}`, data);
}
