import { wordpressEnv } from "@/lib/env";
import { WPEvent, WPPost, WPRestCollectionResponse, WPTaxonomyTerm, WPSponsor } from "@/types/wordpress";

export type FetchParams = Record<string, string | number | boolean | undefined | string[] | number[]>;

type FetchInit = RequestInit & { revalidateSeconds?: number };

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

const getAuthHeader = () => {
  const token = Buffer.from(`${wordpressEnv.username}:${wordpressEnv.appPassword}`).toString("base64");
  return `Basic ${token}`;
};

const fetchJson = async <T>(path: string, params?: FetchParams, init?: FetchInit): Promise<T> => {
  const query = buildQueryString(params);
  const url = `${wordpressEnv.baseUrl}/wp-json${path}${query}`;

  const { revalidateSeconds, headers, ...restInit } = init ?? {};

  const response = await fetch(url, {
    ...restInit,
    headers: {
      Authorization: getAuthHeader(),
      ...headers,
    },
    next: revalidateSeconds ? { revalidate: revalidateSeconds } : undefined,
    // Ensure requests are executed from the server runtime (Node/Edge)
    cache: revalidateSeconds === 0 ? "no-store" : restInit?.cache,
  });

  if (!response.ok) {
    throw new Error(`WordPress request failed with status ${response.status}`);
  }

  return response.json();
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

const fetchCollection = async <T>(path: string, params?: FetchParams, init?: FetchInit) => {
  const query = buildQueryString(params);
  const url = `${wordpressEnv.baseUrl}/wp-json${path}${query}`;

  const { revalidateSeconds, headers, ...restInit } = init ?? {};

  const response = await fetch(url, {
    ...restInit,
    headers: {
      Authorization: getAuthHeader(),
      ...headers,
    },
    next: revalidateSeconds ? { revalidate: revalidateSeconds } : undefined,
    cache: revalidateSeconds === 0 ? "no-store" : restInit?.cache,
  });

  if (!response.ok) {
    throw new Error(`WordPress request failed with status ${response.status}`);
  }

  const data = (await response.json()) as T[];
  return withCollectionMeta<T>(data, response);
};

export const wordpressClient = {
  fetchPosts: (params?: FetchParams, init?: FetchInit) => fetchCollection<WPPost>("/wp/v2/posts", params, init),
  fetchPost: (id: number, init?: FetchInit) => fetchJson<WPPost>(`/wp/v2/posts/${id}`, undefined, init),
  fetchEvents: (params?: FetchParams, init?: FetchInit) =>
    fetchCollection<WPEvent>("/wp/v2/evenementen", params, init),
  fetchEvent: (id: number, init?: FetchInit) => fetchJson<WPEvent>(`/wp/v2/evenementen/${id}`, undefined, init),
  fetchTaxonomy: (taxonomy: string, params?: FetchParams, init?: FetchInit) =>
    fetchCollection<WPTaxonomyTerm>(`/wp/v2/${taxonomy}`, params, init),
  fetchSponsors: async (params?: FetchParams, init?: FetchInit) => {
    try {
      return await fetchCollection<WPSponsor>("/wp/v2/sponsors", params, init);
    } catch (e: unknown) {
      // Fallback if rest_base differs (e.g., 'sponsor')
      if (e instanceof Error && e.message.includes("status 404")) {
        return await fetchCollection<WPSponsor>("/wp/v2/sponsor", params, init);
      }
      throw e;
    }
  },
  fetchSponsor: (id: number, init?: FetchInit) => fetchJson<WPSponsor>(`/wp/v2/sponsors/${id}`, undefined, init),
};

export type WordPressClient = typeof wordpressClient;
