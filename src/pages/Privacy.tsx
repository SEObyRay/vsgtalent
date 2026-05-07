import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageSeo from "@/components/seo/PageSeo";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <PageSeo
      title="Privacyverklaring | VSG Talent"
      description="Lees hoe VSG Talent omgaat met persoonsgegevens, contactaanvragen, media en sponsorcommunicatie."
      path="/privacy"
    />
    <Header />
    <main className="pt-32 pb-20">
      <article className="container mx-auto px-4 max-w-3xl prose prose-invert">
        <h1>Privacyverklaring</h1>
        <p>
          VSG Talent gaat zorgvuldig om met persoonsgegevens van bezoekers, partners, sponsoren en mediarelaties.
          We gebruiken gegevens alleen om contactvragen te beantwoorden, partnerships te bespreken en updates rond
          Levy Opbergen en VSG Talent te verzorgen.
        </p>
        <h2>Welke gegevens gebruiken we?</h2>
        <p>
          Wanneer je contact opneemt kunnen we je naam, e-mailadres, telefoonnummer, bedrijfsnaam en bericht bewaren.
          We gebruiken deze gegevens uitsluitend voor de opvolging van je vraag of samenwerking.
        </p>
        <h2>Bewaartermijn en delen van gegevens</h2>
        <p>
          Gegevens worden niet langer bewaard dan nodig en worden niet verkocht aan derden. Delen gebeurt alleen als
          dit nodig is voor uitvoering van een samenwerking of wanneer de wet dit verplicht.
        </p>
        <h2>Contact</h2>
        <p>
          Wil je gegevens laten aanpassen of verwijderen? Neem contact op via <a href="mailto:info@levyopbergen.nl">info@levyopbergen.nl</a>.
        </p>
      </article>
    </main>
    <Footer />
  </div>
);

export default Privacy;
