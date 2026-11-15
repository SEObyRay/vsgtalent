import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowLeft, Trophy } from "lucide-react";
import { decodeHtml } from "@/lib/utils";
import { getPostCircuitLabel } from "@/lib/post-location";
import { useWordPressPostBySlug } from "@/hooks/use-wordpress";
import type { WPPost } from "@/types/wordpress";
import PageSeo from "@/components/seo/PageSeo";
import { buildCanonical, SITE_URL } from "@/lib/seo";
import { MediaGallery } from "@/components/news/MediaGallery";

const extractFeaturedImage = (post: WPPost | null) => {
  if (!post) return null;
  
  // Try to get from _embedded first
  if (post._embedded) {
    const media = (post._embedded["wp:featuredmedia"] as any)?.[0];
    if (media?.source_url) return media.source_url;
  }

  if (post.featured_image_url) {
    return post.featured_image_url;
  }
  
  // Fallback: construct URL from featured_media ID if available
  if (post.featured_media) {
    // This is a placeholder - in production, we'd need to fetch the media details
    // For now, return null to indicate we couldn't get the image
    return null;
  }
  
  return null;
};

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

const getStringMeta = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const getUploadPath = (source?: string | null) => {
  if (!source) return "";

  try {
    const url = new URL(source);
    return url.pathname;
  } catch {
    const uploadsIndex = source.indexOf("/wp-content/uploads/");
    return uploadsIndex >= 0 ? source.slice(uploadsIndex) : source;
  }
};

const filterFeaturedFromGallery = (gallery?: (string | null | undefined)[] | null, featured?: string | null) => {
  const featuredPath = getUploadPath(featured);
  if (!featuredPath) return gallery ?? [];

  return (gallery ?? []).filter((item) => getUploadPath(item) !== featuredPath);
};

const formatDate = (date?: string) => {
  if (!date) return "Onbekende datum";
  return new Date(date).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const extractTerms = (post: WPPost | null) => {
  const terms = (post?._embedded?.["wp:term"] as Array<Array<{ name: string; taxonomy: string }>> | undefined)?.flat() ?? [];
  return {
    competition: terms.find((term) => term.taxonomy === "competitie")?.name ?? "",
    season: terms.find((term) => term.taxonomy === "seizoen")?.name ?? post?.date?.slice(0, 4) ?? "",
  };
};

const NieuwsDetail = () => {
  const { slug, year } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading, isError } = useWordPressPostBySlug(slug ?? "");

  const featuredImage = useMemo(() => extractFeaturedImage(post), [post]);
  const galleryImages = useMemo(
    () => filterFeaturedFromGallery(post?.meta?.media_gallery, featuredImage),
    [post?.meta?.media_gallery, featuredImage],
  );
  const { competition, season } = useMemo(() => extractTerms(post), [post]);

  const circuit = getPostCircuitLabel(post);
  const position = post?.meta?.positie ? Number(post.meta.positie) : null;

  const canonicalPath = post ? "/nieuws/" + post.date.slice(0, 4) + "/" + post.slug : year && slug ? "/nieuws/" + year + "/" + slug : "/nieuws";
  const title = post
    ? getStringMeta(post.meta?._vsgfb_seo_title) || `${decodeHtml(post.title.rendered)} | Wedstrijdverslag Levy Opbergen`
    : "Wedstrijdverslag | Levy Opbergen";
  const rawSummary =
    getStringMeta(post?.meta?._vsgfb_meta_desc) ||
    getStringMeta(post?.meta?.samenvatting) ||
    post?.excerpt?.rendered ||
    "";
  const description = post
    ? decodeHtml(stripHtml(String(rawSummary))) || "Lees het volledige wedstrijdverslag van Levy Opbergen."
    : "Lees het wedstrijdverslag van Levy Opbergen.";

  const articleJsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: decodeHtml(post.title.rendered),
        description,
        datePublished: post.date,
        dateModified: post.modified,
        image: featuredImage ? [featuredImage] : [`${SITE_URL}/og-image.jpg`],
        about: { "@type": "Person", "@id": `${SITE_URL}/#levy-opbergen`, name: "Levy Opbergen", url: `${SITE_URL}/over-levy` },
        ...(circuit !== "Onbekend circuit" ? { contentLocation: { "@type": "Place", name: circuit } } : {}),
        author: {
          "@type": "Organization",
          name: "VSG Talent",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "VSG Talent",
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/og-image.jpg`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": buildCanonical(canonicalPath),
        },
      }
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title={title}
        description={description}
        path={canonicalPath}
        type="article"
        image={featuredImage ?? undefined}
        jsonLd={articleJsonLd ? [articleJsonLd, {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Nieuws", item: SITE_URL + "/nieuws" },
            { "@type": "ListItem", position: 3, name: decodeHtml(post!.title.rendered), item: buildCanonical(canonicalPath) },
          ],
        }] : undefined}
      />
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" /> Terug
          </Button>

          {isLoading && <div className="text-muted-foreground">Artikel wordt geladen...</div>}
          {isError && !isLoading && (
            <div className="text-destructive">Kon het artikel niet ophalen. Probeer later opnieuw.</div>
          )}

          {!isLoading && !post && !isError && (
            <div className="text-muted-foreground">Artikel niet gevonden.</div>
          )}

          {post && (
            <article className="space-y-10">
              <header className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm uppercase tracking-wide text-primary/80">{season || "Seizoen"}</span>
                  <h1 className="text-4xl md:text-5xl font-headline font-bold">
                    {decodeHtml(post.title.rendered)}
                  </h1>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.date)}
                  </div>
                  {circuit !== "Onbekend circuit" && <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {circuit}
                  </div>}
                  {competition && <span>{competition}</span>}
                </div>

                {featuredImage && (
                  <div className="overflow-hidden rounded-3xl border border-border">
                    <img
                      src={featuredImage}
                      alt={decodeHtml(post.title.rendered)}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </header>

              {position && (
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <Trophy className="w-5 h-5" /> Positie: {position}
                </div>
              )}

              <MediaGallery
                key={post.id}
                images={galleryImages}
                videos={post.meta?.media_videos ?? []}
                title="Foto’s en video’s"
                imageAlt={decodeHtml(post.title.rendered)}
                videoPoster={featuredImage}
              />

              <div className="article-content prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NieuwsDetail;
