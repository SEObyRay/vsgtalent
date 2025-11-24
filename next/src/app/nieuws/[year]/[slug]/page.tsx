import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, MapPin, ArrowLeft, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MediaGallery } from "@/components/news/MediaGallery";
import { getWordPressPostBySlug } from "@/lib/wordpress-data";
import { decodeHtml } from "@/lib/utils";
import { buildCanonical, SITE_URL } from "@/lib/seo";
import { buildBreadcrumbsJsonLd } from "@/lib/breadcrumbs";
import type { WPPost } from "@/types/wordpress";

type NieuwsRouteParams = Promise<{ slug: string; year: string }>;

type FeaturedMedia = { source_url?: string | null };
type PostEmbeddedMedia = {
  "wp:featuredmedia"?: FeaturedMedia[];
};
type EmbeddedTerm = { taxonomy?: string; name?: string };

const extractFeaturedImage = (post: WPPost | null) => {
  const embedded = post?._embedded as PostEmbeddedMedia | undefined;
  const media = embedded?.["wp:featuredmedia"]?.[0];
  return media?.source_url ?? post?.featured_image_url ?? null;
};

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

const formatDate = (value?: string | null) => {
  if (!value) return "Onbekende datum";
  return new Date(value).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const extractTerms = (post: WPPost | null) => {
  const embedded = post?._embedded as { "wp:term"?: EmbeddedTerm[][] } | undefined;
  const embeddedTerms = embedded?.["wp:term"] ?? [];
  const terms = embeddedTerms.flat();
  const findByTaxonomy = (taxonomy: string) => terms.find((term) => term.taxonomy === taxonomy);

  return {
    competition: findByTaxonomy("competities")?.name as string | undefined,
    season: findByTaxonomy("seizoen")?.name as string | undefined,
  };
};

const buildArticleJsonLd = (post: WPPost, featuredImage: string | null, canonicalPath: string) => {
  const published = post.date ? new Date(post.date).toISOString() : undefined;
  const modified = post.modified ? new Date(post.modified).toISOString() : undefined;
  const image = featuredImage ?? `${SITE_URL}/og-image.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: decodeHtml(post.title.rendered),
    description:
      decodeHtml(stripHtml(String(post.meta?.samenvatting ?? post.excerpt?.rendered ?? ""))) ||
      "Lees het volledige wedstrijdverslag van Levy Opbergen.",
    datePublished: published,
    dateModified: modified ?? published,
    author: {
      "@type": "Person",
      name: "Levy Opbergen",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Team Levy Opbergen",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.jpg`,
      },
    },
    image,
    url: buildCanonical(canonicalPath),
  };
};

export async function generateMetadata({ params }: { params: NieuwsRouteParams }): Promise<Metadata> {
  const { slug, year } = await params;
  const post = await getWordPressPostBySlug(slug);
  if (!post) {
    return {
      title: "Wedstrijdverslag | Levy Opbergen",
    };
  }

  const featuredImage = extractFeaturedImage(post) ?? `${SITE_URL}/og-image.jpg`;
  const title = `${decodeHtml(post.title.rendered)} | Wedstrijdverslag Levy Opbergen`;
  const rawSummary = post.meta?.samenvatting ?? post.excerpt?.rendered ?? "";
  const description =
    decodeHtml(stripHtml(String(rawSummary))) || "Lees het volledige wedstrijdverslag van Levy Opbergen.";
  const canonicalPath = `/nieuws/${year}/${slug}`;

  return {
    title,
    description,
    authors: [{ name: "Levy Opbergen" }],
    alternates: {
      canonical: buildCanonical(canonicalPath),
    },
    openGraph: {
      title,
      description,
      url: buildCanonical(canonicalPath),
      type: "article",
      images: [featuredImage],
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: ["Levy Opbergen"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [featuredImage],
    },
  };
}

export default async function NieuwsDetailPage({ params }: { params: NieuwsRouteParams }) {
  const { slug, year } = await params;
  const post = await getWordPressPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const featuredImage = extractFeaturedImage(post);
  const { competition, season } = extractTerms(post);
  const circuit = post?.meta?.circuit ? decodeHtml(post.meta.circuit) : "Onbekend circuit";
  const position = typeof post?.meta?.positie === "number" ? post.meta.positie : null;
  const time = post.meta?.tijd ? decodeHtml(String(post.meta.tijd)) : null;
  const canonicalPath = `/nieuws/${year}/${slug}`;
  const rawSummary = post?.meta?.samenvatting ?? post?.excerpt?.rendered ?? "";
  const description =
    decodeHtml(stripHtml(String(rawSummary))) || "Lees het volledige wedstrijdverslag van Levy Opbergen.";
  const articleJsonLd = post ? buildArticleJsonLd(post, featuredImage, canonicalPath) : undefined;
  const galleryImages = post.meta?.media_gallery ?? null;
  const galleryVideos = post.meta?.media_videos ?? null;
  
  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: "Home", url: "/" },
    { name: "Nieuws", url: "/nieuws" },
    { name: decodeHtml(post.title.rendered) },
  ]);

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-4xl space-y-10">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/nieuws">
              <ArrowLeft className="w-4 h-4" /> Terug naar overzicht
            </Link>
          </Button>
          {season && (
            <div className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wide">
              {season}
            </div>
          )}
          {competition && (
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
              {competition}
            </div>
          )}
        </div>

        <header className="space-y-6">
          <div className="space-y-2">
            {position ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider">
                <Trophy className="w-4 h-4" /> Positie {position}
              </div>
            ) : null}
            <h1 className="text-4xl md:text-5xl font-headline font-bold">
              {decodeHtml(post.title.rendered)}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {circuit}
            </div>
            {time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {time}
              </div>
            )}
          </div>

          {featuredImage && (
            <div className="overflow-hidden rounded-3xl border border-border">
              <Image
                src={featuredImage}
                alt={decodeHtml(post.title.rendered)}
                width={1280}
                height={720}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}
        </header>

        <MediaGallery images={galleryImages} videos={galleryVideos} title="Race media" />

        <Card className="border-border/60">
          <CardContent className="prose prose-invert max-w-none p-8" dangerouslySetInnerHTML={{ __html: post.content?.rendered ?? "" }} />
        </Card>

        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Deel dit verslag met fans en partners.
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/nieuws">
              <ArrowLeft className="w-4 h-4" /> Terug naar overzicht
            </Link>
          </Button>
        </div>
      </div>
      {articleJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
    </div>
  );
}
