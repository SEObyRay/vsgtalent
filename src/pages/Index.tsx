import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import LatestNews from "@/components/home/LatestNews";
import AgendaWidget from "@/components/home/AgendaWidget";
import SponsorShowcase from "@/components/home/SponsorShowcase";
import PageSeo from "@/components/seo/PageSeo";
import { SITE_URL } from "@/lib/seo";

const Index = () => {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Levy Opbergen",
    url: SITE_URL,
    jobTitle: "Kart Racing Talent",
    sameAs: [
      "https://www.instagram.com/levyopbergen",
      "https://www.youtube.com/@levyopbergen",
      "https://www.facebook.com/levyopbergen",
    ],
    image: `${SITE_URL}/og-image.jpg`,
    description:
      "Levy Opbergen is een kart coureur actief in meerdere kampioenschappen. Lees raceverslagen, bekijk media en ontdek sponsormogelijkheden.",
  };
  const organizationLdJson = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "Team Levy Opbergen",
    url: SITE_URL,
    member: {
      "@type": "Person",
      name: "Levy Opbergen",
    },
    sameAs: [
      "https://www.instagram.com/levyopbergen",
      "https://www.youtube.com/@levyopbergen",
      "https://www.facebook.com/levyopbergen",
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="VSG Talent | Levy Opbergen Kart Racing Talent"
        description="VSG Talent ondersteunt karttalent Levy Opbergen. Volg zijn raceverslagen, 2026 agenda, media en sponsormogelijkheden."
        path="/"
        jsonLd={[ldJson, organizationLdJson]}
      />
      <Header />
      <main>
        <HeroSection />
        <LatestNews />
        <AgendaWidget />
        <SponsorShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
