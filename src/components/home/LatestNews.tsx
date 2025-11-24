import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useWordPressPosts } from "@/hooks/use-wordpress";
import { decodeHtml } from "@/lib/utils";
import type { WPPost } from "@/types/wordpress";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

const extractFeaturedImage = (post: WPPost) => {
  if (!post._embedded) return null;
  const media = (post._embedded["wp:featuredmedia"] as any)?.[0];
  return media?.source_url || null;
};

// Mock data - replace with WordPress GraphQL data later
const mockNews = [
  {
    id: 1,
    title: "Podium Finish in Rotax Max Challenge Nederland",
    slug: "podium-rotax-max-challenge-2024",
    excerpt: "Fantastisch weekend in Lelystad met een 2e plaats in de finale!",
    date: "2024-10-15",
    circuit: "Raceway Lelystad",
    position: 2,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Seizoensopener IAME X30 Challenge",
    slug: "seizoensopener-iame-x30-2024",
    excerpt: "Start van het seizoen met een goede 5e plaats ondanks technische problemen.",
    date: "2024-09-20",
    circuit: "Circuit Zandvoort",
    position: 5,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Overwinning in ONK Karting",
    slug: "overwinning-onk-karting-2024",
    excerpt: "Pole position en racewinst! Een perfecte dag op het circuit.",
    date: "2024-08-12",
    circuit: "Kartcircuit Berghem",
    position: 1,
    image: "/placeholder.svg",
  },
];

const LatestNews = () => {
  const { data: postsData } = useWordPressPosts({
    per_page: 3,
    order: "desc",
    orderby: "date",
    _embed: true,
  });

  const wpPosts = postsData?.items ?? [];

  const wpArticles =
    wpPosts.map((post) => ({
      id: post.id,
      title: decodeHtml(post.title.rendered),
      slug: post.slug,
      excerpt: decodeHtml(stripHtml(post.excerpt?.rendered ?? "")),
      date: post.date,
      circuit: (post.meta as any)?.circuit ?? "Onbekend Circuit",
      position: (post.meta as any)?.positie ?? null,
      image: extractFeaturedImage(post) || "/placeholder.svg",
    })) ?? [];

  const articles = wpArticles.length > 0 ? wpArticles : mockNews;

  const getPositionBadge = (position: number) => {
    const colors = {
      1: "bg-yellow-500 text-black",
      2: "bg-gray-300 text-black",
      3: "bg-orange-600 text-white",
    };

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

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">
              Laatste Verslagen
            </h2>
            <p className="text-muted-foreground text-lg">
              De meest recente wedstrijdverslagen en resultaten
            </p>
          </div>
          <Button asChild variant="outline" className="hidden md:flex">
            <Link to="/nieuws" className="flex items-center gap-2">
              Alle Verslagen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="group hover:shadow-orange transition-smooth hover-lift overflow-hidden bg-card"
            >
              <Link to={`/nieuws/${new Date(article.date).getFullYear()}/${article.slug}`}>
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                  <div className="absolute top-4 right-4">
                    {getPositionBadge(article.position)}
                  </div>
                </div>
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
                    <span>{article.circuit}</span>
                  </div>
                  <h3 className="font-headline font-semibold text-xl group-hover:text-primary transition-smooth">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2">
                    {article.excerpt}
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

        <div className="mt-8 text-center md:hidden">
          <Button asChild variant="outline">
            <Link to="/nieuws" className="flex items-center gap-2">
              Alle Verslagen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;