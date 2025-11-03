import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowLeft, Trophy } from "lucide-react";
import { decodeHtml } from "@/lib/utils";
import { useWordPressPostBySlug } from "@/hooks/use-wordpress";
import type { WPPost } from "@/types/wordpress";
import PageSeo from "@/components/seo/PageSeo";
import { buildCanonical, SITE_URL } from "@/lib/seo";
import { MediaGallery } from "@/components/news/MediaGallery";

const extractFeaturedImage = (post: WPPost | null) => {
  if (!post?._embedded) return null;
  const media = (post._embedded["wp:featuredmedia"] as any)?.[0];
  return media?.source_url || null;
};

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

const formatDate = (date?: string) => {
  if (!date) return "Onbekende datum";
  return new Date(date).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const extractTerms = (post: WPPost | null) => {
  if (!post?._embedded) return { competition: "", season: "" };
  const terms = post._embedded["wp:term"] as any[] | undefined;
  if (!terms) return { competition: "", season: "" };

  const flatTerms = terms.flat() as Array<{ taxonomy?: string; name?: string }>;
  const competition = flatTerms.find((term) => term.taxonomy === "competitie")?.name ?? "";
  const season = flatTerms.find((term) => term.taxonomy === "seizoen")?.name ?? "";
  return { competition, season };
};

const NieuwsDetail = () => {
  const { slug, year } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading, isError } = useWordPressPostBySlug(slug ?? "");

  const featuredImage = useMemo(() => extractFeaturedImage(post), [post]);
  const { competition, season } = useMemo(() => extractTerms(post), [post]);

  const circuit = post?.meta?.circuit ? decodeHtml(String(post.meta.circuit)) : "Onbekend circuit";
  const position = post?.meta?.positie ? Number(post.meta.positie) : null;

  const canonicalPath = year && slug ? `/nieuws/${year}/${slug}` : "/nieuws";
  const title = post
    ? `${decodeHtml(post.title.rendered)} | Wedstrijdverslag Levy Opbergen`
    : "Wedstrijdverslag | Levy Opbergen";
  const rawSummary = post?.meta?.samenvatting ?? post?.excerpt?.rendered ?? "";
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
        author: {
          "@type": "Person",
          name: "Levy Opbergen",
        },
        publisher: {
          "@type": "Organization",
          name: "Team Levy Opbergen",
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
        jsonLd={articleJsonLd}
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
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {circuit}
                  </div>
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
                images={post.meta?.media_gallery ?? []}
                videos={post.meta?.media_videos ?? []}
                title="Race media"
              />

              <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NieuwsDetail;
