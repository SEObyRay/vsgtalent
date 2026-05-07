import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageSeo from "@/components/seo/PageSeo";

const AlgemeneVoorwaarden = () => (
  <div className="min-h-screen bg-background">
    <PageSeo
      title="Algemene voorwaarden | VSG Talent"
      description="Bekijk de algemene voorwaarden voor informatie, media, sponsorcommunicatie en samenwerkingen met VSG Talent."
      path="/algemene-voorwaarden"
    />
    <Header />
    <main className="pt-32 pb-20">
      <article className="container mx-auto px-4 max-w-3xl prose prose-invert">
        <h1>Algemene voorwaarden</h1>
        <p>
          Deze website informeert bezoekers over VSG Talent, karttalent Levy Opbergen, raceactiviteiten,
          partnerschappen en media-aanvragen. De informatie wordt met zorg samengesteld.
        </p>
        <h2>Gebruik van informatie</h2>
        <p>
          Teksten, foto’s, video’s en logo’s mogen niet zonder toestemming worden gekopieerd, verspreid of commercieel
          gebruikt. Voor media- of sponsorverzoeken kun je contact opnemen met het team.
        </p>
        <h2>Samenwerkingen</h2>
        <p>
          Sponsoring, Club van 100-deelnames en andere samenwerkingen worden pas definitief na schriftelijke bevestiging
          van afspraken, bedragen, looptijd en zichtbaarheid.
        </p>
        <h2>Aansprakelijkheid</h2>
        <p>
          VSG Talent streeft naar actuele en correcte informatie, maar kan niet garanderen dat alle gegevens altijd
          volledig of foutloos zijn. Aan informatie op deze website kunnen geen rechten worden ontleend.
        </p>
      </article>
    </main>
    <Footer />
  </div>
);

export default AlgemeneVoorwaarden;
