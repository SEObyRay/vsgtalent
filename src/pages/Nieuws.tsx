import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { useWordPressPosts, useWordPressTaxonomy } from "@/hooks/use-wordpress";
import { decodeHtml } from "@/lib/utils";
import type { WPPost } from "@/types/wordpress";
import PageSeo from "@/components/seo/PageSeo";
import { buildCanonical } from "@/lib/seo";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

const extractFeaturedImage = (post: WPPost) => {
  if (!post._embedded) return null;
  const media = (post._embedded["wp:featuredmedia"] as any)?.[0];
  return media?.source_url || null;
};

const getPositionBadge = (position: number | null | undefined) => {
  if (!position) return null;

  const colors = {
    1: "bg-yellow-500 text-black",
    2: "bg-gray-300 text-black",
    3: "bg-orange-600 text-white",
  } as const;

  return (
    <div
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${
        colors[position as keyof typeof colors] || "bg-muted text-foreground"
      }`}
    >
      {position}
    </div>
  );
};

const Nieuws = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<number | null>(null);

  const { data: postsData, isLoading, isError } = useWordPressPosts({
    per_page: 100,
    order: "desc",
    orderby: "date",
    _embed: true,
  });

  const { data: competitionsData } = useWordPressTaxonomy("competities", {
    per_page: 100,
    order: "asc",
    orderby: "name",
  });

  const posts = postsData?.items ?? [];
  const competitions = competitionsData?.items ?? [];

  const competitionMap = useMemo(() => {
    return new Map(competitions.map((competition) => [competition.id, competition]));
  }, [competitions]);

  const years = useMemo(() => {
    const uniqueYears = new Set<number>();
    posts.forEach((post) => {
      const year = new Date(post.date).getFullYear();
      if (!Number.isNaN(year)) {
        uniqueYears.add(year);
      }
    });
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [posts]);

  const filteredNews = useMemo(() => {
    return posts.filter((post) => {
      const postYear = new Date(post.date).getFullYear();
      if (selectedYear && postYear !== selectedYear) return false;

      if (selectedCompetition) {
        const competitionIds = post.competitie ?? [];
        if (!competitionIds.includes(selectedCompetition)) return false;
      }

      return true;
    });
  }, [posts, selectedYear, selectedCompetition]);

  const itemListElements = useMemo(() => {
    return filteredNews.slice(0, 20).map((post, index) => {
      const postYear = new Date(post.date).getFullYear();
      return {
        "@type": "ListItem",
        position: index + 1,
        url: buildCanonical(`/nieuws/${postYear}/${post.slug}`),
        name: decodeHtml(post.title.rendered),
      };
    });
  }, [filteredNews]);

  const getCompetitionLabel = (post: WPPost) => {
    const competitionIds = post.competitie ?? [];
    for (const id of competitionIds) {
      const term = competitionMap.get(id);
      if (term) return term.name;
    }
    return "";
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Wedstrijdverslagen van Levy Opbergen",
    description:
      "Overzicht van alle race verslagen, resultaten en verhalen van kart coureur Levy Opbergen.",
    url: buildCanonical("/nieuws"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: itemListElements,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="Wedstrijdverslagen | Levy Opbergen"
        description="Lees alle wedstrijdverslagen, resultaten en verhalen van kart coureur Levy Opbergen."
        path="/nieuws"
        jsonLd={jsonLd}
      />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-headline font-bold mb-4">
              Wedstrijdverslagen
            </h1>
            <p className="text-xl text-muted-foreground">
              Al mijn race resultaten en verhalen
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Button
              variant={selectedYear === null ? "default" : "outline"}
              onClick={() => setSelectedYear(null)}
              className={selectedYear === null ? "gradient-orange" : ""}
            >
              Alle Jaren
            </Button>
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "outline"}
                onClick={() => setSelectedYear(year)}
                className={selectedYear === year ? "gradient-orange" : ""}
              >
                {year}
              </Button>
            ))}
          </div>

          <div className="mb-12 flex flex-wrap gap-3">
            <Button
              variant={selectedCompetition === null ? "default" : "outline"}
              onClick={() => setSelectedCompetition(null)}
              className={selectedCompetition === null ? "gradient-orange" : ""}
            >
              Alle Competities
            </Button>
            {competitions.map((comp) => (
              <Button
                key={comp.id}
                variant={selectedCompetition === comp.id ? "default" : "outline"}
                onClick={() => setSelectedCompetition(comp.id)}
                className={selectedCompetition === comp.id ? "gradient-orange" : ""}
              >
                {comp.name}
              </Button>
            ))}
          </div>

          {isLoading && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Nieuws items worden geladen...</p>
            </div>
          )}

          {isError && !isLoading && (
            <div className="text-center py-20">
              <p className="text-destructive text-lg">Er ging iets mis bij het laden van de nieuwsberichten.</p>
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <Card
                key={article.id}
                className="group hover:shadow-orange transition-smooth hover-lift overflow-hidden"
              >
                <Link to={`/nieuws/${new Date(article.date).getFullYear()}/${article.slug}`}>
                  <AspectRatio ratio={16 / 9} className="relative bg-muted overflow-hidden rounded-t-[inherit]">
                    <img
                      src={extractFeaturedImage(article) || "/placeholder.svg"}
                      alt={decodeHtml(article.title.rendered)}
                      className="absolute inset-0 h-full w-full object-cover transition-smooth group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4">
                      {getPositionBadge(article.meta.positie ?? null)}
                    </div>
                  </AspectRatio>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.date).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{article.meta.circuit || "Onbekend Circuit"}</span>
                    </div>
                    <div className="text-xs font-medium text-primary">
                      {getCompetitionLabel(article) || ""}
                    </div>
                    <h3 className="font-headline font-semibold text-xl group-hover:text-primary transition-smooth">
                      {decodeHtml(article.title.rendered)}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {decodeHtml(stripHtml(article.excerpt.rendered))}
                    </p>
                    <div className="pt-2">
                      <span className="text-primary font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-smooth">
                        Lees meer
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {!isLoading && filteredNews.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Geen verslagen gevonden met de geselecteerde filters.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Nieuws;