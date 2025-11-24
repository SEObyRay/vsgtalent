import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getWordPressPosts } from "@/lib/wordpress-data";
import { WPPost } from "@/types/wordpress";

const getFeaturedImage = (post: WPPost): string | null => {
  if (post.featured_image_url) return post.featured_image_url;
  const embedded = post._embedded as any;
  const media = embedded?.["wp:featuredmedia"]?.[0];
  return media?.source_url ?? null;
};

export default async function LatestNews() {
  let items: WPPost[] = [];
  try {
    const res = await getWordPressPosts({ per_page: 3, _embed: true, order: "desc", orderby: "date" }, 300);
    items = res.items;
  } catch {
    items = [];
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">Laatste Verslagen</h2>
            <p className="text-muted-foreground text-lg">De meest recente wedstrijdverslagen en resultaten</p>
          </div>
          <Button asChild variant="outline" className="hidden md:flex">
            <Link href="/nieuws" className="flex items-center gap-2">
              Alle Verslagen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((post) => {
            const img = getFeaturedImage(post) ?? "/placeholder.svg";
            const year = new Date(post.date).getFullYear();
            const href = `/nieuws/${year}/${post.slug}`;
            return (
              <Card key={post.id} className="group hover:shadow-orange hover-lift overflow-hidden bg-card">
                <Link href={href}>
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <Image src={img} alt={post.title?.rendered || ""} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{(post.meta as any)?.circuit ?? ""}</span>
                    </div>
                    <h3 className="font-headline font-semibold text-xl group-hover:text-primary transition-colors duration-300">
                      {post.title?.rendered}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered || "" }} />
                    <div className="pt-2">
                      <span className="text-primary font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
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

        <div className="mt-8 text-center md:hidden">
          <Button asChild variant="outline">
            <Link href="/nieuws" className="flex items-center gap-2">
              Alle Verslagen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
