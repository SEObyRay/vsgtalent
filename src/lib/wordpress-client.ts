import { WPEvent, WPPost, WPRestCollectionResponse, WPSponsor, WPTaxonomyTerm, WPSettings } from "@/types/wordpress";

export type FetchParams = Record<string, string | number | boolean | undefined | string[] | number[]>;

const normalizeBaseUrl = (url?: string) => {
  if (!url) return undefined;
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const getEnv = () => {
  const baseUrl = normalizeBaseUrl(import.meta.env.VITE_WP_BASE_URL as string | undefined);
  const username = import.meta.env.VITE_WP_USERNAME as string | undefined;
  const password = import.meta.env.VITE_WP_APP_PASSWORD as string | undefined;

  if (!baseUrl) {
    throw new Error("VITE_WP_BASE_URL is not configured");
  }

  if (!username || !password) {
    throw new Error("VITE_WP_USERNAME or VITE_WP_APP_PASSWORD is not configured");
  }

  return { baseUrl, username, password };
};

const buildQueryString = (params?: FetchParams) => {
  if (!params) return "";
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        search.append(key, String(item));
      });
      return;
    }

    search.append(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : "";
};

const getAuthHeader = (username: string, password: string) => {
  const token = btoa(`${username}:${password}`);
  return `Basic ${token}`;
};

const withCollectionMeta = <T>(data: T[], response: Response): WPRestCollectionResponse<T> => {
  const total = Number(response.headers.get("X-WP-Total") || 0);
  const totalPages = Number(response.headers.get("X-WP-TotalPages") || 0);

  return {
    items: data,
    total,
    totalPages,
  };
};

const fetchJson = async <T>(path: string, params?: FetchParams): Promise<T> => {
  const { baseUrl, username, password } = getEnv();
  const query = buildQueryString(params);
  const url = `${baseUrl}/wp-json${path}${query}`;

  const response = await fetch(url, {
    headers: {
      Authorization: getAuthHeader(username, password),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

const fetchCollection = async <T>(path: string, params?: FetchParams): Promise<WPRestCollectionResponse<T>> => {
  const { baseUrl, username, password } = getEnv();
  const query = buildQueryString(params);
  const url = `${baseUrl}/wp-json${path}${query}`;

  const response = await fetch(url, {
    headers: {
      Authorization: getAuthHeader(username, password),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = (await response.json()) as T[];
  return withCollectionMeta(data, response);
};

const fetchJsonWithFallback = async <T>(paths: string[], params?: FetchParams): Promise<T> => {
  let lastError: Error | null = null;

  for (const path of paths) {
    try {
      return await fetchJson<T>(path, params);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error("Request failed");
};

const fetchCollectionWithFallback = async <T>(
  paths: string[],
  params?: FetchParams,
): Promise<WPRestCollectionResponse<T>> => {
  let lastError: Error | null = null;

  for (const path of paths) {
    try {
      return await fetchCollection<T>(path, params);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error("Request failed");
};

export const wordpressClient = {
  fetchPosts: (params?: FetchParams) => fetchCollection<WPPost>("/wp/v2/posts", params),
  fetchPost: (id: number) => fetchJson<WPPost>(`/wp/v2/posts/${id}`),
  fetchEvents: (params?: FetchParams) =>
    fetchCollectionWithFallback<WPEvent>(["/wp/v2/evenementen", "/wp/v2/evenement"], params),
  fetchEvent: (id: number) =>
    fetchJsonWithFallback<WPEvent>([`/wp/v2/evenementen/${id}`, `/wp/v2/evenement/${id}`]),
  fetchTaxonomy: (taxonomy: string, params?: FetchParams) =>
    fetchCollection<WPTaxonomyTerm>(`/wp/v2/${taxonomy}`, params),
  fetchSettings: () => fetchJson<WPSettings>("/vsgtalent/v1/settings"),
  fetchSponsors: (params?: FetchParams) => fetchCollection<WPSponsor>("/wp/v2/sponsors", params),
  fetchSponsorBySlug: async (slug: string): Promise<WPSponsor | null> => {
    const res = await fetchCollection<WPSponsor>("/wp/v2/sponsors", { slug, per_page: 1, _embed: true });
    return res.items[0] ?? null;
  },
};

export type WordPressClient = typeof wordpressClient;
