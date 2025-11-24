import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getWordPressPosts, getWordPressTaxonomy } from "@/lib/wordpress-data";
import { decodeHtml } from "@/lib/utils";
import { buildCanonical } from "@/lib/seo";
import { WPPost, WPTaxonomyTerm } from "@/types/wordpress";

export const revalidate = 180; // Revalidate every 3 minutes

export const metadata: Metadata = {
  title: "Wedstrijdverslagen",
  description: "Lees alle wedstrijdverslagen, resultaten en verhalen van onze VSG Talent sporters, waaronder kart coureur Levy Opbergen.",
  alternates: {
    canonical: buildCanonical("/nieuws"),
  },
  openGraph: {
    title: "Wedstrijdverslagen | VSG Talent",
    description: "Ontdek de laatste race verslagen en resultaten van onze talenten.",
    url: buildCanonical("/nieuws"),
  },
};

const parseQueryParamNumber = (value?: string | string[]) => {
  if (!value) return null;
  const first = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(first, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const buildFilterHref = (year: number | null, competition: number | null) => {
  const params = new URLSearchParams();
  if (year) params.set("year", String(year));
  if (competition) params.set("competition", String(competition));
  const query = params.toString();
  return query ? `/nieuws?${query}` : "/nieuws";
};

type NieuwsEmbeddedMedia = {
  "wp:featuredmedia"?: Array<{ source_url?: string | null }>;
};

const getFeaturedImage = (post: WPPost) => {
  if (post.featured_image_url) return post.featured_image_url;
  const embedded = post._embedded as NieuwsEmbeddedMedia | undefined;
  const media = embedded?.["wp:featuredmedia"]?.[0];
  return media?.source_url ?? "/placeholder.svg";
};

const getCompetitionLabel = (post: WPPost, competitionMap: Map<number, WPTaxonomyTerm>) => {
  const ids = (post.competitie ?? []) as number[];
  for (const id of ids) {
    const term = competitionMap.get(id);
    if (term) return term.name;
  }
  return "";
};

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

const buildListJsonLd = (posts: WPPost[]) => {
  const itemListElement = posts.slice(0, 20).map((post, index) => {
    const year = new Date(post.date).getFullYear();
    return {
      "@type": "ListItem",
      position: index + 1,
      url: buildCanonical(`/nieuws/${year}/${post.slug}`),
      name: decodeHtml(post.title.rendered),
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Wedstrijdverslagen van Levy Opbergen",
    description: "Overzicht van alle race verslagen, resultaten en verhalen van kart coureur Levy Opbergen.",
    url: buildCanonical("/nieuws"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement,
    },
  };
};

interface NieuwsPageProps {
  searchParams?: Promise<Record<string, string | string[]>>;
}

export default async function NieuwsPage({ searchParams }: NieuwsPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const yearFilter = parseQueryParamNumber(resolvedParams.year);
  const competitionFilter = parseQueryParamNumber(resolvedParams.competition);

  let posts: WPPost[] = [];
  let competitions: WPTaxonomyTerm[] = [];

  try {
    const res = await getWordPressPosts({ per_page: 100, order: "desc", orderby: "date", _embed: true }, 180);
    posts = res.items;
  } catch {
    posts = [];
  }

  try {
    const taxonomy = await getWordPressTaxonomy("competities", { per_page: 100, order: "asc", orderby: "name" }, 600);
    competitions = taxonomy.items;
  } catch {
    competitions = [];
  }

  const years = Array.from(
    posts.reduce((set, post) => {
      const year = new Date(post.date).getFullYear();
      if (!Number.isNaN(year)) set.add(year);
      return set;
    }, new Set<number>()),
  ).sort((a, b) => b - a);

  const competitionMap = new Map(competitions.map((term) => [term.id, term]));

  const filteredPosts = posts.filter((post) => {
    const postYear = new Date(post.date).getFullYear();
    if (yearFilter && postYear !== yearFilter) return false;

    if (competitionFilter) {
      const ids = (post.competitie ?? []) as number[];
      if (!ids.includes(competitionFilter)) return false;
    }

    return true;
  });

  const jsonLd = buildListJsonLd(filteredPosts);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-headline font-bold mb-4">Wedstrijdverslagen</h1>
          <p className="text-xl text-muted-foreground">Al mijn race resultaten en verhalen</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Button asChild variant={yearFilter === null ? "default" : "outline"} className={yearFilter === null ? "gradient-orange" : ""}>
            <Link href={buildFilterHref(null, competitionFilter)}>Alle Jaren</Link>
          </Button>
          {years.map((year) => (
            <Button
              key={year}
              asChild
              variant={yearFilter === year ? "default" : "outline"}
              className={yearFilter === year ? "gradient-orange" : ""}
            >
              <Link href={buildFilterHref(year, competitionFilter)}>{year}</Link>
            </Button>
          ))}
        </div>

        <div className="mb-12 flex flex-wrap gap-3">
          <Button
            asChild
            variant={competitionFilter === null ? "default" : "outline"}
            className={competitionFilter === null ? "gradient-orange" : ""}
          >
            <Link href={buildFilterHref(yearFilter, null)}>Alle Competities</Link>
          </Button>
          {competitions.map((competition) => (
            <Button
              key={competition.id}
              asChild
              variant={competitionFilter === competition.id ? "default" : "outline"}
              className={competitionFilter === competition.id ? "gradient-orange" : ""}
            >
              <Link href={buildFilterHref(yearFilter, competition.id)}>{competition.name}</Link>
            </Button>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground text-lg">
            Geen verslagen gevonden met de geselecteerde filters.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const image = getFeaturedImage(post);
            const year = new Date(post.date).getFullYear();
            const href = `/nieuws/${year}/${post.slug}`;
            const position = typeof post.meta?.positie === "number" ? post.meta.positie : null;
            const competitionLabel = getCompetitionLabel(post, competitionMap);

            return (
              <Card key={post.id} className="group hover:shadow-orange transition-all duration-300 hover-lift overflow-hidden">
                <Link href={href}>
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <Image
                      src={image}
                      alt={decodeHtml(post.title.rendered)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {position ? (
                      <div className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm" style={{
                        backgroundColor:
                          position === 1 ? "#FACC15" : position === 2 ? "#D1D5DB" : position === 3 ? "#EA580C" : undefined,
                        color: position === 1 || position === 2 ? "#111827" : undefined,
                      }}>
                        {position}
                      </div>
                    ) : null}
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{post.meta?.circuit || "Onbekend Circuit"}</span>
                    </div>
                    {competitionLabel && <div className="text-xs font-medium text-primary">{competitionLabel}</div>}
                    <h3 className="font-headline font-semibold text-xl group-hover:text-primary transition-colors">
                      {decodeHtml(post.title.rendered)}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {decodeHtml(stripHtml(post.excerpt?.rendered ?? ""))}
                    </p>
                    <div className="pt-2">
                      <span className="text-primary font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                        Lees meer
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
