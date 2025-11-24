import { FetchParams, wordpressClient } from "@/lib/wordpress-client";
import { WPEvent, WPPost, WPRestCollectionResponse, WPTaxonomyTerm } from "@/types/wordpress";

const DEFAULT_COLLECTION_REVALIDATE = 120; // seconds
const DEFAULT_SINGLE_REVALIDATE = 60; // seconds

export const getWordPressPosts = (params?: FetchParams, revalidate = DEFAULT_COLLECTION_REVALIDATE) =>
  wordpressClient.fetchPosts(params, { revalidateSeconds: revalidate });

export const getWordPressEvents = (params?: FetchParams, revalidate = DEFAULT_COLLECTION_REVALIDATE) =>
  wordpressClient.fetchEvents(params, { revalidateSeconds: revalidate });

export const getWordPressSponsors = (params?: FetchParams, revalidate = DEFAULT_COLLECTION_REVALIDATE) =>
  wordpressClient.fetchSponsors(params, { revalidateSeconds: revalidate });

export const getWordPressTaxonomy = (
  taxonomy: string,
  params?: FetchParams,
  revalidate = DEFAULT_COLLECTION_REVALIDATE,
) => wordpressClient.fetchTaxonomy(taxonomy, params, { revalidateSeconds: revalidate });

export const getWordPressPostBySlug = async (slug: string): Promise<WPPost | null> => {
  if (!slug) return null;

  const response = await wordpressClient.fetchPosts(
    { slug, per_page: 1, _embed: true },
    { revalidateSeconds: DEFAULT_SINGLE_REVALIDATE },
  );

  return response.items[0] ?? null;
};

export const getWordPressEventBySlug = async (slug: string): Promise<WPEvent | null> => {
  if (!slug) return null;

  const response = await wordpressClient.fetchEvents(
    { slug, per_page: 1, _embed: true },
    { revalidateSeconds: DEFAULT_SINGLE_REVALIDATE },
  );

  return response.items[0] ?? null;
};

export type WordPressCollection<T> = WPRestCollectionResponse<T>;
export type WordPressTaxonomyTerm = WPTaxonomyTerm;
