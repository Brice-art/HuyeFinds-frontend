export function cld(url: string, width: number): string {
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const insertAt = idx + marker.length;
  return `${url.slice(0, insertAt)}w_${width},q_auto,f_auto/${url.slice(insertAt)}`;
}
