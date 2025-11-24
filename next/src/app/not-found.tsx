import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, Calendar, FileText, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Pagina niet gevonden - 404",
  description: "De pagina die je zoekt bestaat niet of is verplaatst. Bekijk onze belangrijkste pagina's.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const quickLinks = [
    {
      title: "Home",
      description: "Terug naar de homepagina",
      href: "/",
      icon: Home,
    },
    {
      title: "Wedstrijdverslagen",
      description: "Bekijk alle race resultaten",
      href: "/nieuws",
      icon: FileText,
    },
    {
      title: "Race Agenda",
      description: "Aankomende evenementen",
      href: "/agenda",
      icon: Calendar,
    },
    {
      title: "Sponsors",
      description: "Onze partners en sponsors",
      href: "/sponsors",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center space-y-8 mb-16">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 text-primary">
            <Search className="w-16 h-16" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-headline font-bold text-primary">404</h1>
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Pagina niet gevonden</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              De pagina die je zoekt bestaat niet, is verplaatst of tijdelijk niet beschikbaar.
              Bekijk hieronder de belangrijkste pagina&apos;s of ga terug.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild variant="default" className="gradient-orange gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                Naar homepagina
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                Ga terug
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-headline font-semibold text-center">Populaire pagina&#39;s</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Card key={link.href} className="group hover:shadow-orange hover-lift transition-all">
                  <Link href={link.href}>
                    <CardContent className="p-6 flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-headline font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                          {link.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{link.description}</p>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Probleem blijft bestaan?{" "}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              Neem contact met ons op
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
