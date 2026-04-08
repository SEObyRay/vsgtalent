import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import { useWordPressEventBySlug } from "@/hooks/use-wordpress";
import type { WPEvent } from "@/types/wordpress";
import PageSeo from "@/components/seo/PageSeo";
import { buildCanonical } from "@/lib/seo";
import { findAgendaEventBySlug, formatAgendaDate } from "@/lib/agenda";

const extractFeaturedImage = (event: WPEvent | null) => {
  if (!event?._embedded) return null;
  const media = (event._embedded["wp:featuredmedia"] as any)?.[0];
  return media?.source_url || null;
};

const AgendaDetail = () => {
  const { slug, year } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading, isError } = useWordPressEventBySlug(slug ?? "");
  const resolvedEvent = useMemo(() => findAgendaEventBySlug(slug ?? "", event), [event, slug]);

  const featuredImage = useMemo(() => extractFeaturedImage(event), [event]);

  const location = resolvedEvent?.venue || "Onbekend Circuit";
  const address = resolvedEvent?.address || "";
  const city = resolvedEvent?.city || "";
  const klasse = resolvedEvent?.series || resolvedEvent?.klasse || "";
  const time = resolvedEvent?.time || "Tijd nog niet bekend";
  const canonicalPath = year && slug ? `/agenda/${year}/${slug}` : "/agenda";
  const description = resolvedEvent
    ? `${formatAgendaDate(resolvedEvent.startDate)} • ${location}${city ? ` (${city})` : ""}`
    : "Bekijk details van dit evenement op de race agenda van Levy Opbergen.";

  const eventJsonLd = resolvedEvent
    ? {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: resolvedEvent.title,
        startDate: resolvedEvent.startDate ? new Date(resolvedEvent.startDate).toISOString() : undefined,
        endDate: resolvedEvent.endDate ? new Date(resolvedEvent.endDate).toISOString() : undefined,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: location,
          address: address || city || undefined,
        },
        url: buildCanonical(canonicalPath),
        description,
        image: featuredImage ? [featuredImage] : undefined,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title={resolvedEvent ? `${resolvedEvent.title} | Race Agenda Levy Opbergen` : "Race agenda evenement"}
        description={description}
        path={canonicalPath}
        type="event"
        image={featuredImage ?? undefined}
        jsonLd={eventJsonLd}
      />
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" /> Terug
          </Button>

          {isLoading && <div className="text-muted-foreground">Evenement wordt geladen...</div>}
          {isError && !isLoading && (
            <div className="text-destructive">WordPress-event kon niet worden opgehaald. De detailpagina toont waar mogelijk de ingevoerde kalenderinformatie.</div>
          )}

          {!isLoading && !resolvedEvent && !isError && (
            <div className="text-muted-foreground">Evenement niet gevonden.</div>
          )}

          {resolvedEvent && (
            <article className="space-y-10">
              <header className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm uppercase tracking-wide text-primary/80">
                    {klasse || "Karting"}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-headline font-bold">
                    {resolvedEvent.title}
                  </h1>
                  {resolvedEvent.roundLabel && (
                    <p className="text-muted-foreground">{resolvedEvent.roundLabel}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatAgendaDate(resolvedEvent.startDate)}
                    {resolvedEvent.endDate ? ` – ${formatAgendaDate(resolvedEvent.endDate)}` : ""}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {location}
                    {(city || address) && (
                      <span className="text-muted-foreground/80">
                        {city && !address ? city : address || ""}
                      </span>
                    )}
                  </div>
                </div>

                {featuredImage && (
                  <div className="overflow-hidden rounded-3xl border border-border">
                    <img
                      src={featuredImage}
                      alt={resolvedEvent.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </header>

              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    event?.content?.rendered ||
                    resolvedEvent.content ||
                    `<p>${resolvedEvent.summary || "Meer informatie over dit raceweekend volgt."}</p>`,
                }}
              />
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgendaDetail;
