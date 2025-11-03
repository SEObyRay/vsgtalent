import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { wordpressClient, type FetchParams } from "@/lib/wordpress-client";
import { WPEvent, WPPost, WPTaxonomyTerm, WPRestCollectionResponse, WPSettings } from "@/types/wordpress";

const defaultQueryOptions = {
  staleTime: 0,
  refetchOnWindowFocus: true,
  refetchOnMount: "always" as const,
};

export const useWordPressPosts = (
  params?: FetchParams,
  options?: UseQueryOptions<WPRestCollectionResponse<WPPost>>,
) =>
  useQuery<WPRestCollectionResponse<WPPost>>({
    queryKey: ["wp-posts", params],
    queryFn: () => wordpressClient.fetchPosts(params),
    ...defaultQueryOptions,
    ...options,
  });

export const useWordPressSettings = (options?: UseQueryOptions<WPSettings>) =>
  useQuery<WPSettings>({
    queryKey: ["wp-settings"],
    queryFn: () => wordpressClient.fetchSettings(),
    ...defaultQueryOptions,
    ...options,
  });

export const useWordPressEvents = (
  params?: FetchParams,
  options?: UseQueryOptions<WPRestCollectionResponse<WPEvent>>,
) =>
  useQuery<WPRestCollectionResponse<WPEvent>>({
    queryKey: ["wp-events", params],
    queryFn: () => wordpressClient.fetchEvents(params),
    ...defaultQueryOptions,
    ...options,
  });

export const useWordPressTaxonomy = (
  taxonomy: string,
  params?: FetchParams,
  options?: UseQueryOptions<WPRestCollectionResponse<WPTaxonomyTerm>>,
) =>
  useQuery<WPRestCollectionResponse<WPTaxonomyTerm>>({
    queryKey: ["wp-taxonomy", taxonomy, params],
    queryFn: () => wordpressClient.fetchTaxonomy(taxonomy, params),
    ...defaultQueryOptions,
    ...options,
  });

export const useWordPressPostBySlug = (
  slug: string,
  options?: UseQueryOptions<WPPost | null>,
) =>
  useQuery<WPPost | null>({
    queryKey: ["wp-post", slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await wordpressClient.fetchPosts({
        slug,
        per_page: 1,
        _fields:
          "id,slug,title,content,excerpt,date,modified,meta,featured_media",
      });
      return response.items[0] ?? null;
    },
    ...defaultQueryOptions,
    ...options,
  });

export const useWordPressEventBySlug = (
  slug: string,
  options?: UseQueryOptions<WPEvent | null>,
) =>
  useQuery<WPEvent | null>({
    queryKey: ["wp-event", slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await wordpressClient.fetchEvents({ slug, per_page: 1, _embed: true });
      return response.items[0] ?? null;
    },
    ...defaultQueryOptions,
    ...options,
  });
