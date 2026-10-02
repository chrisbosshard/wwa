export function getWishProductUrl(link?: string | null) {
  const value = link?.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}
