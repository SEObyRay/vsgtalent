import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact op met het team van Levy Opbergen voor sponsoring, media of testdagen.",
  alternates: {
    canonical: "https://levyopbergen.nl/contact",
  },
  openGraph: {
    title: "Contact | Team Levy Opbergen",
    description: "Plan een gesprek met het team van Levy Opbergen voor sponsoring, media of testdagen.",
    url: "https://levyopbergen.nl/contact",
  },
};

const SITE_URL = "https://levyopbergen.nl";

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Levy Opbergen",
  url: `${SITE_URL}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: "Team Levy Opbergen",
    email: "info@levyopbergen.nl",
    telephone: "+31 6 00 00 00 00",
    areaServed: ["Netherlands", "Belgium", "Germany"],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-5xl space-y-16">
        <section className="text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-2 text-sm uppercase tracking-[0.2em]">
            Contact
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
            Plan een gesprek met het team van Levy Opbergen
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Wil je Levy uitnodigen voor een testdag, een sponsorvoorstel bespreken of media-afspraken plannen? Vul de gegevens in
            of neem rechtstreeks contact op via e-mail of telefoon. We reageren doorgaans binnen één werkdag.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="h-full border-border/60">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-headline font-semibold">Direct contact</h2>
              <p className="text-muted-foreground">
                We denken graag mee over partnerships, testdagen en media-optredens. Kies het kanaal dat voor jou het beste werkt.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href="mailto:info@levyopbergen.nl" className="hover:text-foreground transition">
                    info@levyopbergen.nl
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href="tel:+31600000000" className="hover:text-foreground transition">
                    +31 6 00 00 00 00
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  Actief op circuits in Nederland, België en Duitsland
                </div>
              </div>
              <Button asChild className="gradient-orange shadow-orange hover-lift">
                <a href="mailto:info@levyopbergen.nl">Stuur een e-mail</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="h-full border-border/60">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-headline font-semibold">Kennismakingsgesprek plannen</h2>
              <p className="text-muted-foreground">
                Laat weten wat je plannen zijn en we sturen je een voorstel voor een (online) afspraak.
              </p>
              <form className="space-y-3" action="mailto:info@levyopbergen.nl" method="post">
                <input
                  type="text"
                  name="name"
                  placeholder="Naam"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mailadres"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  name="message"
                  placeholder="Vertel kort iets over je vraag of project"
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" className="w-full gradient-orange shadow-orange hover-lift">
                  Verstuur bericht
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/60">
            <CardContent className="p-6 space-y-3">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-headline font-semibold">Race agenda</h3>
              <p className="text-sm text-muted-foreground">
                Bekijk waar Levy binnenkort in actie komt en plan een bezoek of hospitality-pakket.
              </p>
              <Button variant="outline" asChild size="sm">
                <Link href="/agenda">Agenda bekijken</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-6 space-y-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-headline font-semibold">Circuitdagen</h3>
              <p className="text-sm text-muted-foreground">
                Regelmatig rijden we testdagen op Assen, Spa-Francorchamps en Kerpen. Sluit aan voor een meet & greet.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-6 space-y-3">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-headline font-semibold">Media aanvragen</h3>
              <p className="text-sm text-muted-foreground">
                Journalisten en content creators helpen we graag aan quotes, foto’s en videomateriaal.
              </p>
              <Button variant="outline" asChild size="sm">
                <a href="mailto:media@levyopbergen.nl">Mail media team</a>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
    </div>
  );
}
