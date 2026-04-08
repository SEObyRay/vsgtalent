import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Download, MapPin } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PageSeo from "@/components/seo/PageSeo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWordPressEvents } from "@/hooks/use-wordpress";
import {
  formatAgendaDate,
  getAgendaEventYear,
  getDaysUntilAgendaEvent,
  mergeAgendaEvents,
} from "@/lib/agenda";
import { buildCanonical } from "@/lib/seo";

const Agenda = () => {
  const { data, isLoading, isError } = useWordPressEvents({
    per_page: 100,
    order: "asc",
  });

  const events = useMemo(() => {
    return mergeAgendaEvents(data?.items ?? []).filter((item) => item.startDate);
  }, [data]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return events.filter((event) => new Date(event.startDate) >= now).slice(0, 6);
  }, [events]);

  const pastEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return events
      .filter((event) => new Date(event.startDate) < now)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [events]);

  const seriesGroups = useMemo(() => {
    return events.reduce<Record<string, typeof events>>((acc, event) => {
      const key = event.series || event.klasse || "Overige races";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(event);
      return acc;
    }, {});
  }, [events]);

  const eventsJsonLd = useMemo(() => {
    return events.slice(0, 20).map((event) => {
      const startDateIso = new Date(event.startDate).toISOString();
      const endDateIso = event.endDate ? new Date(event.endDate).toISOString() : undefined;
      const location = event.venue || event.address || event.city;
      return {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: event.title,
        startDate: startDateIso,
        endDate: endDateIso,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: location
          ? {
              "@type": "Place",
              name: event.venue || location,
              address: event.address || event.city || "",
            }
          : undefined,
        url: buildCanonical(`/agenda/${getAgendaEventYear(event)}/${event.slug}`),
      };
    });
  }, [events]);

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="Race Agenda | Levy Opbergen"
        description="Bekijk alle aankomende en afgelopen races van Levy Opbergen, netjes ingedeeld per kampioenschap."
        path="/agenda"
        jsonLd={eventsJsonLd}
      />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-headline font-bold mb-4">Race Agenda</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Het seizoen 2026 overzichtelijk ingedeeld per kampioenschap en raceweekend.
            </p>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download iCal Feed
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {Object.entries(seriesGroups).map(([series, seriesEvents]) => (
              <Card key={series} className="border-border/60 bg-card/60">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-headline font-bold">{series}</h2>
                    <span className="text-sm text-muted-foreground">
                      {seriesEvents.length} weekenden
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatAgendaDate(seriesEvents[0]?.startDate)} tot{" "}
                    {formatAgendaDate(
                      seriesEvents[seriesEvents.length - 1]?.endDate ||
                        seriesEvents[seriesEvents.length - 1]?.startDate,
                    )}
                  </p>
                  <div className="space-y-2">
                    {seriesEvents.map((event) => (
                      <div
                        key={event.slug}
                        className="flex items-center justify-between gap-4 rounded-xl border border-border/50 px-4 py-3"
                      >
                        <div>
                          <div className="font-medium">{event.roundLabel || event.title}</div>
                          <div className="text-sm text-muted-foreground">{event.venue}</div>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          {formatAgendaDate(event.startDate)}
                          {event.endDate ? ` - ${formatAgendaDate(event.endDate)}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-headline font-bold mb-8">Aankomende Races</h2>
            {isLoading && <div className="text-muted-foreground">Evenementen worden geladen...</div>}
            {isError && !isLoading && (
              <div className="text-destructive">
                WordPress-events konden niet worden geladen. De agenda toont daarom de ingevoerde seizoenskalender.
              </div>
            )}
            {!isLoading && upcomingEvents.length === 0 && (
              <div className="text-muted-foreground">Geen aankomende evenementen gevonden.</div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => {
                const daysUntil = getDaysUntilAgendaEvent(event.startDate);
                const year = getAgendaEventYear(event);
                return (
                  <Card
                    key={event.id}
                    className={`group hover:shadow-orange transition-smooth hover-lift ${
                      event.isNextRace ? "ring-2 ring-primary shadow-orange" : ""
                    }`}
                  >
                    <Link to={`/agenda/${year}/${event.slug}`}>
                      <CardContent className="p-8 space-y-6">
                        {event.isNextRace && (
                          <div className="inline-flex px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold animate-pulse-glow">
                            Volgende Race
                          </div>
                        )}

                        <div>
                          <div className="text-sm font-medium text-primary mb-2">
                            {event.klasse || event.series || ""}
                          </div>
                          <h3 className="text-2xl font-headline font-bold group-hover:text-primary transition-smooth mb-2">
                            {event.title}
                          </h3>
                          {event.roundLabel && (
                            <div className="text-sm text-muted-foreground mb-4">{event.roundLabel}</div>
                          )}

                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                              <div>
                                <div className="font-semibold text-foreground">
                                  {formatAgendaDate(event.startDate)}
                                  {event.endDate && ` - ${formatAgendaDate(event.endDate)}`}
                                </div>
                                {daysUntil > 0 && (
                                  <div className="text-sm text-muted-foreground">
                                    Over {daysUntil} {daysUntil === 1 ? "dag" : "dagen"}
                                  </div>
                                )}
                              </div>
                            </div>

                            {(event.venue || event.address || event.city) && (
                              <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                                <div>
                                  <div className="font-semibold">{event.venue || "Onbekend circuit"}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {event.address || event.city || ""}
                                  </div>
                                </div>
                              </div>
                            )}

                            {event.time && (
                              <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 flex-shrink-0 text-primary" />
                                <span className="font-medium">{event.time}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-headline font-bold mb-8">Afgelopen Races</h2>
            {!isLoading && pastEvents.length === 0 && (
              <div className="text-muted-foreground">Nog geen afgelopen races in deze kalender.</div>
            )}
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-soft transition-smooth hover-lift">
                  <Link to={`/agenda/${getAgendaEventYear(event)}/${event.slug}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-primary mb-1">
                            {event.klasse || event.series || ""}
                          </div>
                          <h3 className="text-xl font-headline font-semibold group-hover:text-primary transition-smooth mb-2">
                            {event.title}
                          </h3>
                          {event.roundLabel && (
                            <div className="text-sm text-muted-foreground mb-2">{event.roundLabel}</div>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatAgendaDate(event.startDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.venue || event.city || "Locatie volgt"}
                            </div>
                          </div>
                        </div>
                        {event.result && <div className="text-2xl font-bold text-primary">{event.result}</div>}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Agenda;
