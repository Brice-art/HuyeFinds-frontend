const normalizeOrigin = (value: string) => value.replace(/\/$/, "");

const API_ORIGIN = normalizeOrigin(
  import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
).replace(/\/api\/?$/, "");

const SITE_URL = normalizeOrigin(
  import.meta.env.VITE_SITE_URL ?? window.location.origin,
);

const SHARE_ORIGIN = /localhost|127\.0\.0\.1/.test(SITE_URL)
  ? API_ORIGIN
  : SITE_URL;

export type SharePayload = {
  title: string;
  description?: string;
  /** App path, e.g. `/places/amahoro` or `/students-hub/abc123` */
  path: string;
};

/** Build a share URL that includes OG meta tags for rich previews in WhatsApp and other apps. */
export function getShareUrl({ path }: Pick<SharePayload, "path">): string {
  const placeMatch = path.match(/^\/places\/([^/]+)$/);
  if (placeMatch) {
    return `${SHARE_ORIGIN}/og/places/${placeMatch[1]}`;
  }

  const hubPostMatch = path.match(/^\/students-hub\/([^/]+)$/);
  if (hubPostMatch) {
    return `${SHARE_ORIGIN}/og/hub-posts/${hubPostMatch[1]}`;
  }

  if (path === "/students-hub") {
    return `${SHARE_ORIGIN}/og/students-hub`;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function getWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export async function copyShareLink(url: string): Promise<void> {
  await navigator.clipboard.writeText(url);
}

export async function shareContent(
  payload: SharePayload,
): Promise<"shared" | "copied"> {
  const url = getShareUrl(payload);
  const text = payload.description
    ? `${payload.title}\n${payload.description}`
    : payload.title;

  if (navigator.share) {
    try {
      await navigator.share({ title: payload.title, text, url });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw err;
      }
    }
  }

  const whatsappText = `${text}\n${url}`;
  await copyShareLink(whatsappText);
  return "copied";
}

export async function shareViaWhatsApp(payload: SharePayload): Promise<void> {
  const url = getShareUrl(payload);
  const text = payload.description
    ? `${payload.title}\n${payload.description}\n${url}`
    : `${payload.title}\n${url}`;

  window.open(getWhatsAppUrl(text), "_blank", "noopener,noreferrer");
}

export async function copySharePayload(payload: SharePayload): Promise<void> {
  const url = getShareUrl(payload);
  const text = payload.description
    ? `${payload.title}\n${payload.description}\n${url}`
    : `${payload.title}\n${url}`;

  await copyShareLink(text);
}
