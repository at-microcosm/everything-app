export async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`non-ok fetch response: ${res.status}`);
  }
  return await res.json();
}
