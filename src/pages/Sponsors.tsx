import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageSeo from "@/components/seo/PageSeo";
import { useWordPressSponsors } from "@/hooks/use-wordpress";
import type { WPSponsor } from "@/types/wordpress";

const MAX_SLOTS = 6;

const pickLogo = (s: WPSponsor): string | null => {
  if (s.featured_image_url) return s.featured_image_url;
  const embedded = s._embedded as { "wp:featuredmedia"?: Array<{ source_url?: string }> } | undefined;
  return embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
};

const Sponsors = () => {
  const { data, isLoading } = useWordPressSponsors({ per_page: 100, _embed: true, order: "asc" });

  const sponsors = (data?.items ?? [])
    .filter((s) => s.meta?.active !== false)
    .sort((a, b) => (a.meta?.priority ?? 999) - (b.meta?.priority ?? 999))
    .slice(0, MAX_SLOTS);

  const placeholderCount = Math.max(0, MAX_SLOTS - sponsors.length);

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="Partners & Sponsoren | Levy Opbergen"
        description="Ontdek alle partners en sponsoren die de race carrière van Levy Opbergen ondersteunen en word zelf partner."
        path="/sponsors"
      />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <section className="mb-16 text-center">
            <h1 className="text-5xl md:text-6xl font-headline font-bold mb-4">Partners & Sponsoren</h1>
            <p className="text-xl text-muted-foreground">
              {sponsors.length > 0
                ? "De partners en sponsoren die Levy's racecarrière mogelijk maken."
                : "Binnenkort komt hier het overzicht van alle partners die Levy richting de top helpen."}
            </p>
          </section>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border rounded-3xl h-48 animate-pulse bg-card" />
              ))}
            </div>
          ) : (
            <section className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {sponsors.map((s) => {
                const logo = pickLogo(s);
                const name = s.title?.rendered || "Sponsor";
                const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
                return (
                  <Link
                    key={s.id}
                    to={`/sponsors/${s.slug}`}
                    className="group border border-border rounded-3xl h-48 flex flex-col items-center justify-center overflow-hidden hover:border-primary transition-all duration-300"
                  >
                    {logo ? (
                      <img
                        src={logo}
                        alt={name}
                        className="max-h-24 max-w-[80%] object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <>
                        <span className="text-3xl font-headline font-bold text-primary">{initials}</span>
                        <span className="text-sm font-medium text-muted-foreground mt-2 text-center px-4">{name}</span>
                      </>
                    )}
                  </Link>
                );
              })}
              {Array.from({ length: placeholderCount }).map((_, idx) => (
                <div
                  key={`slot-${idx}`}
                  className="border border-dashed border-border rounded-3xl h-48 flex flex-col items-center justify-center text-muted-foreground"
                >
                  <span className="text-sm uppercase tracking-[0.24em] mb-2">Sponsor slot {sponsors.length + idx + 1}</span>
                  <span className="text-lg font-semibold">Binnenkort beschikbaar</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sponsors;
