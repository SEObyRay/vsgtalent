import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, Compass, Target } from "lucide-react";
import PageSeo from "@/components/seo/PageSeo";
import { SITE_URL } from "@/lib/seo";

const highlightItems = [
  { icon: Trophy, title: "Kampioenschappen 2026", description: "Levy rijdt in het Chrono NK 4T en het NXT GP Dutch Open in de Parolin Rocky 200cc-klasse." },
  { icon: Compass, title: "Een volgende stap", description: "Naast de Parolin Rocky bouwt Levy ervaring op in de Rotax Mini Max met startnummer 104." },
  { icon: Target, title: "Plezier en ontwikkeling", description: "Blijven leren, nieuwe dingen proberen en samen race-avonturen beleven staan centraal in zijn ontwikkeling." },
];
const timeline = [
  { year: "2025", title: "Start kartcarrière", description: "Levy begint aan zijn kartavontuur en rijdt in Assen zijn eerste kartrace." },
  { year: "2026", title: "Chrono NK 4T en NXT GP", description: "Wedstrijden in de Parolin Rocky 200cc brengen ervaring op circuits in Nederland, België en Duitsland." },
  { year: "2026", title: "P4 bij de NXT GP-afsluiting in Assen", description: "Levy sluit het laatste NXT GP-weekend af met de vierde plaats en een beker." },
  { year: "2026", title: "Ervaring opbouwen in Rotax Mini Max", description: "Testdagen en wedstrijden met startnummer 104 vormen een volgende stap. Bij Kart4Fun in Berghem meldt zijn team P6 in de Fun-klasse." },
];
const circuits = [
  { name: "TT Junior Track Assen", country: "Nederland", description: "De plek waar Levy zijn eerste kartrace reed en in 2026 zijn NXT GP-seizoen afsloot." },
  { name: "Kartbaan Spa-Francorchamps", country: "België", description: "Tijdens het NK4T-weekend in Spa deed Levy ervaring op met races op een droge en natte baan." },
  { name: "Erftlandring Kerpen", country: "Duitsland", description: "Trainingen en wedstrijden op deze kartbaan vragen om omgaan met veranderende omstandigheden." },
];
const OverLevy = () => {
  const aboutJsonLd = {
    "@context": "https://schema.org", "@type": "AboutPage",
    name: "Levy Opbergen: groeien in de kartsport", url: `${SITE_URL}/over-levy`,
    mainEntity: { "@type": "Person", "@id": `${SITE_URL}/#levy-opbergen`, name: "Levy Opbergen",
      url: `${SITE_URL}/over-levy`, jobTitle: "Kartcoureur",
      description: "Levy Opbergen begon in 2025 met karten en ontwikkelt zich in de Parolin Rocky 200cc en Rotax Mini Max.",
      image: `${SITE_URL}/og-image.jpg`,
      knowsAbout: ["Karting", "Parolin Rocky 200cc", "Rotax Mini Max", "Chrono NK 4T", "NXT GP Dutch Open"] },
  };
  return (
    <div className="min-h-screen bg-background">
      <PageSeo title="Levy Opbergen | Karttalent in Parolin Rocky en Rotax Mini Max"
        description="Maak kennis met Levy Opbergen: zijn kartcarrière, plezier in het racen en ontwikkeling van Parolin Rocky 200cc naar Rotax Mini Max."
        path="/over-levy" jsonLd={aboutJsonLd} />
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-5xl space-y-20">
          <section className="text-center space-y-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm uppercase tracking-[0.2em]">Over Levy Opbergen</Badge>
            <h1 className="text-4xl md:text-6xl font-headline font-bold leading-tight">Levy Opbergen: groeien in de kartsport</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Levy Opbergen begon in 2025 aan zijn kartavontuur. In 2026 rijdt hij wedstrijden in de Parolin Rocky 200cc en bouwt
              hij daarnaast ervaring op in de Rotax Mini Max. Hij combineert wedstrijden met trainingen op circuits in Nederland, België en Duitsland.
            </p>
            <div className="flex justify-center flex-wrap gap-4">
              <Button asChild className="gradient-orange shadow-orange hover-lift"><a href="/nieuws">Zijn wedstrijdverslagen</a></Button>
              <Button variant="outline" asChild><a href="/agenda">Bekijk de raceagenda</a></Button>
            </div>
          </section>
          <section className="grid gap-6 md:grid-cols-3">
            {highlightItems.map((item) => (
              <Card key={item.title} className="h-full border-border/60"><CardContent className="p-8 space-y-4">
                <item.icon className="w-10 h-10 text-primary" /><h2 className="text-xl font-headline font-semibold">{item.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent></Card>
            ))}
          </section>
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Waarom Levy racet</h2>
            <p className="text-muted-foreground leading-relaxed">
              Achter de resultaten staat vooral zijn plezier in het rijden. Levy wil ontdekken wat hij kan leren, beter begrijpen
              hoe zijn kart reageert en zichzelf stap voor stap ontwikkelen. Winnen vindt hij leuk, maar nieuwe dingen proberen
              en samen race-avonturen beleven horen daar net zo goed bij.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              In zijn persoonlijke terugblik van oktober vertelt hij hoe graag hij zijn helm opzet en de baan op gaat.
              Het zoeken naar de juiste bocht, iets nieuws proberen en merken dat het lukt, maken het racen bijzonder voor hem.
            </p>
          </section>
          <section className="grid gap-8 md:grid-cols-2 items-center">
            <figure className="space-y-3">
              <img src="/levy-opbergen-racehelm-tijger-2026.jpg" alt="Racehelm van Levy Opbergen met een witte tijger, groene ogen en zijn naam"
                className="w-full h-auto rounded-2xl border border-border" loading="lazy" width="1080" height="1440" />
              <figcaption className="text-sm text-muted-foreground">Levy’s racehelm met het persoonlijke tijgermotief. Foto uit de Facebook-update van 7 september 2026.</figcaption>
            </figure>
            <div className="space-y-5">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Een helm met een eigen verhaal</h2>
              <p className="text-muted-foreground leading-relaxed">
                De nieuwe racehelm van Levy heeft voor zijn familie een persoonlijke betekenis. Het tijgermotief verwijst naar
                een verhaal van zijn vader Stephan en staat voor vechtlust, verbondenheid en doorgaan na tegenslag.
                Zo neemt Levy ook iets van zijn familieverhaal mee de baan op.
              </p>
            </div>
          </section>
          <section className="space-y-8">
            <header className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Ontwikkeling op en naast de baan</h2>
              <p className="text-muted-foreground max-w-3xl">Testdagen en wedstrijden helpen Levy om ervaring te verzamelen. Begeleiding op de baan en aandacht voor conditie, voeding en mentale voorbereiding ondersteunen die ontwikkeling.</p>
            </header>
            <div className="grid gap-6 md:grid-cols-2">
              <Card><CardContent className="p-8 space-y-4">
                <Calendar className="w-6 h-6 text-primary" /><h3 className="text-2xl font-headline font-semibold">Twee karts, nieuwe ervaringen</h3>
                <p className="text-muted-foreground leading-relaxed">Naast zijn Parolin Rocky rijdt Levy in de Rotax Mini Max met startnummer 104. In november wisselde hij testdagen in Genk en Berghem af met een NK-training op De Landsard.</p>
              </CardContent></Card>
              <Card><CardContent className="p-8 space-y-4">
                <Target className="w-6 h-6 text-primary" /><h3 className="text-2xl font-headline font-semibold">Aandacht voor voorbereiding</h3>
                <p className="text-muted-foreground leading-relaxed">Levy werkt met Françoise bij PerformWell aan conditie, kracht, voeding en mentale voorbereiding. Plezier in zijn sport blijft daarbij belangrijk.</p>
                <a className="text-primary underline" href="/nieuws/2026/performwell-duurzaam-presteren-levy-opbergen">Meer over zijn begeleiding bij PerformWell</a>
              </CardContent></Card>
            </div>
          </section>
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Belangrijke kartbanen</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {circuits.map((circuit) => (
                <Card key={circuit.name}><CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-semibold"><MapPin className="w-5 h-5" />{circuit.country}</div>
                  <h3 className="text-xl font-headline font-semibold">{circuit.name}</h3><p className="text-muted-foreground">{circuit.description}</p>
                </CardContent></Card>
              ))}
            </div>
          </section>
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Stappen in zijn kartcarrière</h2>
            <div className="relative border-l border-border/60 pl-8 space-y-10">
              {timeline.map((item) => (
                <div key={item.title} className="relative"><span className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-primary" />
                  <h3 className="text-xl font-headline font-semibold">{item.year} · {item.title}</h3><p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Volg Levy’s ontwikkeling</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">Lees de verslagen van zijn wedstrijden en ontdek waar Levy de volgende stappen zet.</p>
            <Button asChild className="gradient-orange shadow-orange hover-lift"><a href="/nieuws">Bekijk het kartnieuws</a></Button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default OverLevy;
