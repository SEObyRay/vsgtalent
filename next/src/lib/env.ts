const normalizeBaseUrl = (url?: string | null) => {
  if (!url) return undefined;
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const baseUrl = normalizeBaseUrl(
  process.env.WP_BASE_URL ?? process.env.NEXT_PUBLIC_WP_BASE_URL ?? process.env["VITE_WP_BASE_URL"],
);
const username =
  process.env.WP_USERNAME ?? process.env.NEXT_PUBLIC_WP_USERNAME ?? process.env["VITE_WP_USERNAME"];
const appPassword =
  process.env.WP_APP_PASSWORD ?? process.env.NEXT_PUBLIC_WP_APP_PASSWORD ?? process.env["VITE_WP_APP_PASSWORD"];

// Allow builds without WordPress configured (will use fallback data)
// Only warn in development mode
if (!baseUrl && process.env.NODE_ENV === 'development') {
  console.warn("WP_BASE_URL environment variable is not configured - using fallback data");
}

if ((!username || !appPassword) && process.env.NODE_ENV === 'development') {
  console.warn("WP_USERNAME or WP_APP_PASSWORD environment variable is not configured - using fallback data");
}

export const wordpressEnv = {
  baseUrl: baseUrl || "http://localhost/wp-json",
  username: username || "default",
  appPassword: appPassword || "default",
};
