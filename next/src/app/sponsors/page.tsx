import type { ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWordPressSponsors } from "@/lib/wordpress-data";
import { WPSponsor } from "@/types/wordpress";
import { Card, CardContent } from "@/components/ui/card";

type SponsorEmbeddedMedia = {
  "wp:featuredmedia"?: Array<{ source_url?: string | null }>;
};

const pickLogo = (s: WPSponsor) => {
  const embedded = s._embedded as SponsorEmbeddedMedia | undefined;
  const media = embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  return s.featured_image_url ?? media ?? "/placeholder.svg";
};

export const metadata = {
  title: "Sponsors",
  description: "Onze partners en sponsors",
};

export default async function SponsorsPage() {
  let sponsors: WPSponsor[] = [];
  try {
    const res = await getWordPressSponsors({ per_page: 100, _embed: true, order: "asc" }, 30);
    sponsors = res.items
      .filter((s) => s.meta?.active !== false)
      .sort((a, b) => (a.meta?.priority ?? 999) - (b.meta?.priority ?? 999));
  } catch {
    sponsors = [];
  }

  const MAX_SLOTS = 6;
  const visibleSponsors = sponsors.slice(0, MAX_SLOTS);
  const placeholderCount = Math.max(0, MAX_SLOTS - visibleSponsors.length);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 text-center">Partners &amp; Sponsoren</h1>
        <p className="text-muted-foreground mb-10 text-center max-w-2xl mx-auto">
          Binnenkort komt hier het overzicht van alle partners die Levy richting de top helpen.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {visibleSponsors.map((s, index) => {
            const logo = pickLogo(s);

            return (
              <Link key={s.id} href={`/sponsors/${s.slug}`}>
                <Card className="group aspect-square bg-card rounded-2xl border border-border/80 overflow-hidden hover:border-primary transition-colors duration-300 hover-lift">
                  <CardContent className="w-full h-full p-6 flex items-center justify-center relative">
                    <Image
                      src={logo}
                      alt={s.title?.rendered || `Sponsor slot ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {Array.from({ length: placeholderCount }).map((_, idx) => {
            const slotNumber = visibleSponsors.length + idx + 1;
            return (
              <Card
                key={`placeholder-${slotNumber}`}
                className="aspect-square rounded-2xl border border-dashed border-border/70 bg-card/40 flex items-center justify-center text-center text-muted-foreground"
              >
                <CardContent className="flex flex-col items-center justify-center gap-2 p-6">
                  <span className="text-[11px] tracking-[0.3em] uppercase font-medium">
                    Sponsor slot {slotNumber}
                  </span>
                  <span className="text-sm">Binnenkort beschikbaar</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
