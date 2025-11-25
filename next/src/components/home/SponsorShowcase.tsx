import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getWordPressSponsors } from "@/lib/wordpress-data";
import { WPSponsor } from "@/types/wordpress";

type SponsorEmbeddedMedia = {
  "wp:featuredmedia"?: Array<{ source_url?: string | null }>;
};

const pickLogo = (s: WPSponsor) => {
  const embedded = s._embedded as SponsorEmbeddedMedia | undefined;
  const media = embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  return s.featured_image_url ?? media ?? "/placeholder.svg";
};

export default async function SponsorShowcase() {
  let sponsors: WPSponsor[] = [];
  try {
    const res = await getWordPressSponsors({ per_page: 12, _embed: true, order: "asc" }, 0);
    sponsors = res.items
      .filter((s) => s.meta?.active !== false) // show all unless explicitly inactive
      .sort((a, b) => (a.meta?.priority ?? 999) - (b.meta?.priority ?? 999));
  } catch {
    sponsors = [];
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">Mijn Partners</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Deze geweldige bedrijven maken mijn race avonturen mogelijk
          </p>
        </div>

        {/* Sponsor Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {sponsors.map((sponsor) => {
            const logo = pickLogo(sponsor);

            return (
              <Link
                key={sponsor.id}
                href={`/sponsors/${sponsor.slug}`}
                className="group aspect-square bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-colors duration-300 hover-lift"
              >
                <div className="w-full h-full p-6 flex items-center justify-center relative">
                  <Image
                    src={logo}
                    alt={sponsor.title?.rendered || "Sponsor"}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-card to-secondary rounded-2xl p-8 md:p-12 text-center shadow-soft">
          <h3 className="text-3xl md:text-4xl font-headline font-bold mb-4">Word Onderdeel van het Team</h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Wil jij ook mijn race avonturen steunen? Sluit je aan bij de Club van 100 en profiteer van exclusieve voordelen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-orange shadow-orange hover-lift">
              <Link href="/club-van-100" className="flex items-center gap-2">
                Bekijk Mogelijkheden
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sponsors">Alle Sponsors</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
