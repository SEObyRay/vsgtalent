export interface WPRenderedField {
  rendered: string;
  protected?: boolean;
}

export interface WPBaseEntity {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRenderedField;
  content: WPRenderedField;
  excerpt: WPRenderedField;
  featured_media: number;
  featured_image_url: string | null;
}

export interface WPPostMeta {
  circuit?: string | null;
  positie?: number | null;
  samenvatting?: string | null;
  media_gallery?: string[] | null;
  media_videos?: string[] | null;
  [key: string]: unknown;
}

export interface WPPost extends WPBaseEntity {
  meta: WPPostMeta;
  categories: number[];
  tags: number[];
  author: number;
  competitie?: number[];
  seizoen?: number[];
  _embedded?: Record<string, unknown>;
}

export interface WPEventMeta {
  datum?: string | null;
  einddatum?: string | null;
  tijd?: string | null;
  locatie?: string | null;
  stad?: string | null;
  adres?: string | null;
  klasse?: string | null;
  serie?: string | null;
  ronde_label?: string | null;
  volgende_race?: boolean | null;
  resultaat?: string | null;
  [key: string]: unknown;
}

export interface WPEvent extends WPBaseEntity {
  meta: WPEventMeta;
  _embedded?: Record<string, unknown>;
}

export interface WPSponsorMeta {
  website?: string | null;
  tier?: string | null;
  priority?: number | null;
  active?: boolean | null;
  [key: string]: unknown;
}

export interface WPSponsor extends WPBaseEntity {
  meta: WPSponsorMeta;
  _embedded?: Record<string, unknown>;
}

export interface WPTaxonomyTerm {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, unknown>;
}

export interface WPRestCollectionResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
}

export interface WPSettingsImage {
  url: string;
  width: number | null;
  height: number | null;
}

export interface WPHomepageStats {
  active_talents: string;
  wins: string;
  podiums: string;
  partners: string;
}

export interface WPSettings {
  title: string;
  description: string;
  icon: WPSettingsImage | null;
  logo: WPSettingsImage | null;
  homepage_stats: WPHomepageStats;
}

export interface WPRestFetchOptions {
  page?: number;
  perPage?: number;
  search?: string;
  order?: "asc" | "desc";
  orderby?: string;
  include?: number[];
  slug?: string[];
  [key: string]: unknown;
}
