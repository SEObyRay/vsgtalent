import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageSeo from "@/components/seo/PageSeo";
import { useWordPressSponsorBySlug } from "@/hooks/use-wordpress";
import type { WPSponsor } from "@/types/wordpress";

const pickLogo = (s: WPSponsor): string | null => {
  if (s.featured_image_url) return s.featured_image_url;
  const embedded = s._embedded as { "wp:featuredmedia"?: Array<{ source_url?: string }> } | undefined;
  return embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
};

const SponsorDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: sponsor, isLoading, isError } = useWordPressSponsorBySlug(slug ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-3xl animate-pulse space-y-4">
            <div className="h-10 bg-card rounded w-1/2" />
            <div className="h-40 bg-card rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !sponsor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 text-center">
          <p className="text-muted-foreground mb-6">Sponsor niet gevonden.</p>
          <Button variant="outline" onClick={() => navigate("/sponsors")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Terug naar partners
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const logo = pickLogo(sponsor);
  const name = sponsor.title?.rendered || "Sponsor";
  const website = sponsor.meta?.website ?? null;
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title={`${name} | Partners VSGTalent`}
        description={sponsor.excerpt?.rendered?.replace(/<[^>]+>/g, "").slice(0, 155) || `${name} is een partner van Levy Opbergen.`}
        path={`/sponsors/${slug}`}
      />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button variant="ghost" className="mb-8 -ml-2" onClick={() => navigate("/sponsors")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Alle partners
          </Button>

          <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
            <div className="w-40 h-40 border border-border rounded-2xl flex items-center justify-center p-6 bg-card shrink-0">
              {logo ? (
                <img src={logo} alt={name} className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-4xl font-headline font-bold text-primary">{initials}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-headline font-bold mb-3">{name}</h1>
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary underline underline-offset-4 text-sm"
                >
                  {website} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <article
            className="prose prose-invert max-w-none text-base md:text-lg leading-relaxed [&_h2]:text-2xl [&_h2]:font-headline [&_h2]:font-bold [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_li]:pl-1"
            dangerouslySetInnerHTML={{ __html: sponsor.content?.rendered ?? "" }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SponsorDetail;
