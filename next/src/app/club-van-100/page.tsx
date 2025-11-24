import { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Handshake, Gift, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Club van 100",
  description: "Word lid van de Club van 100 en steun Levy Opbergen met trainingen, races en internationale ambities.",
  alternates: {
    canonical: "https://levyopbergen.nl/club-van-100",
  },
  openGraph: {
    title: "Club van 100 | Levy Opbergen",
    description: "Steun Levy Opbergen via de Club van 100 en profiteer van exclusieve voordelen voor partners.",
    url: "https://levyopbergen.nl/club-van-100",
    type: "website",
  },
};

const SITE_URL = "https://levyopbergen.nl";

const benefits = [
  {
    icon: Handshake,
    title: "Netwerk van kartliefhebbers",
    description: "Maak deel uit van een selecte groep supporters, ondernemers en motorsportfans die Levy naar de top helpen.",
  },
  {
    icon: Gift,
    title: "Exclusieve uitnodigingen",
    description: "Ontvang VIP-uitnodigingen voor raceweekenden, hospitality-arrangementen en meet & greets met het team.",
  },
  {
    icon: Sparkles,
    title: "Marketing visibility",
    description: "Je merk zichtbaar op kart, racekleding en social media content voor een groeiend publiek.",
  },
];

const contributionTiers = [
  {
    title: "Club van 100 lid",
    amount: "€100 per maand",
    perks: [
      "Naamvermelding op de website",
      "Maandelijkse update over resultaten en planning",
      "Exclusieve content direct vanuit de pits",
    ],
  },
  {
    title: "Team Partner",
    amount: "€250 per maand",
    perks: [
      "Logo op kart en teamkleding",
      "Social media shout-outs",
      "Toegang tot hospitality tijdens races",
    ],
  },
  {
    title: "Hoofdsponsor",
    amount: "€500 per maand",
    perks: [
      "Alle teampartner voordelen",
      "Persoonlijke hospitality tijdens raceweekenden",
      "Co-branded content shoots en PR exposure",
    ],
  },
];

const offerCatalogJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Club van 100 Partnerships",
  url: `${SITE_URL}/club-van-100`,
  provider: {
    "@type": "SportsTeam",
    name: "Team Levy Opbergen",
  },
  itemListElement: contributionTiers.map((tier, index) => ({
    "@type": "Offer",
    position: index + 1,
    name: tier.title,
    description: tier.perks.join(", "),
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      priceCurrency: "EUR",
      price: Number(tier.amount.replace(/[^0-9]/g, "")) || undefined,
    },
  })),
};

export default function ClubVan100Page() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-5xl space-y-20">
        <section className="text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-2 text-sm uppercase tracking-[0.2em]">
            Club van 100
          </Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-bold leading-tight">
            Word onderdeel van Levy’s support crew
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Bouw mee aan een professionele kartcarrière en ontvang unieke hospitality- en exposuremogelijkheden. Elk lid draagt direct bij aan trainingen, wedstrijddeelname en technische ondersteuning.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild className="gradient-orange shadow-orange hover-lift">
              <Link href="mailto:info@levyopbergen.nl">Doe mee</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sponsors">Bekijk sponsors</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="h-full border-border/60">
              <CardContent className="p-8 space-y-4">
                <benefit.icon className="w-10 h-10 text-primary" />
                <h2 className="text-xl font-headline font-semibold">{benefit.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <header className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Kies jouw bijdrage</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Elke bijdrage helpt om nieuwe stappen te zetten richting internationale kartkampioenschappen.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {contributionTiers.map((tier) => (
              <Card key={tier.title} className="border-border/60 h-full">
                <CardContent className="p-8 space-y-4">
                  <Trophy className="w-8 h-8 text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-semibold">{tier.title}</h3>
                    <p className="text-primary font-semibold">{tier.amount}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {tier.perks.map((perk) => (
                      <li key={perk}>{perk}</li>
                    ))}
                  </ul>
                  <Button asChild className="gradient-orange shadow-orange hover-lift">
                    <Link href="mailto:info@levyopbergen.nl">Word lid</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Samen sneller vooruit</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Levy’s groei vraagt om partners die geloven in ambitie en jeugdige energie. Ontdek hoe jouw merk kan meegroeien met een karttalent dat vastbesloten is om de top te bereiken.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild className="gradient-orange shadow-orange hover-lift">
              <Link href="mailto:info@levyopbergen.nl">Plan een gesprek</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogJsonLd) }} />
    </div>
  );
}
