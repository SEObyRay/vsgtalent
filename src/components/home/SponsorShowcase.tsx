import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useWordPressSponsors } from "@/hooks/use-wordpress";
import type { WPSponsor } from "@/types/wordpress";

const pickLogo = (s: WPSponsor): string | null => {
  if (s.featured_image_url) return s.featured_image_url;
  const embedded = s._embedded as { "wp:featuredmedia"?: Array<{ source_url?: string }> } | undefined;
  return embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
};

const SponsorShowcase = () => {
  const { data } = useWordPressSponsors({ per_page: 12, _embed: true, order: "asc" });

  const sponsors = (data?.items ?? [])
    .filter((s) => s.meta?.active !== false)
    .sort((a, b) => (a.meta?.priority ?? 999) - (b.meta?.priority ?? 999));

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">
            Mijn Partners
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Deze geweldige bedrijven maken mijn race avonturen mogelijk
          </p>
        </div>

        {sponsors.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {sponsors.map((sponsor) => {
              const logo = pickLogo(sponsor);
              const name = sponsor.title?.rendered || "Sponsor";
              const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
              return (
                <Link
                  key={sponsor.id}
                  to={`/sponsors/${sponsor.slug}`}
                  className="group aspect-square bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-smooth hover-lift flex items-center justify-center p-6"
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={name}
                      className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-smooth"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl font-headline font-bold text-primary">{initials}</span>
                      <span className="text-xs text-center text-muted-foreground leading-tight">{name}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-card to-secondary rounded-2xl p-8 md:p-12 text-center shadow-soft">
          <h3 className="text-3xl md:text-4xl font-headline font-bold mb-4">
            Word Onderdeel van het Team
          </h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Wil jij ook mijn race avonturen steunen? Sluit je aan bij de Club van 100 
            en profiteer van exclusieve voordelen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-orange shadow-orange hover-lift">
              <Link to="/club-van-100" className="flex items-center gap-2">
                Bekijk Mogelijkheden
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/sponsors">Alle Partners</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorShowcase;