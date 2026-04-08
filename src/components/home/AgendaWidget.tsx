import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWordPressEvents } from "@/hooks/use-wordpress";
import {
  formatAgendaDate,
  getAgendaEventYear,
  getDaysUntilAgendaEvent,
  mergeAgendaEvents,
} from "@/lib/agenda";

const AgendaWidget = () => {
  const { data } = useWordPressEvents({
    per_page: 100,
    order: "asc",
  });

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return mergeAgendaEvents(data?.items ?? [])
      .filter((event) => new Date(event.startDate) >= today)
      .slice(0, 3);
  }, [data]);

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">Race Agenda</h2>
            <p className="text-muted-foreground text-lg">
              De eerstvolgende races uit de seizoensplanning
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download iCal
            </Button>
            <Button asChild variant="outline">
              <Link to="/agenda" className="flex items-center gap-2">
                Volledige Agenda
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => {
            const daysUntil = getDaysUntilAgendaEvent(event.startDate);
            return (
              <Card
                key={event.id}
                className={`group hover:shadow-orange transition-smooth hover-lift ${
                  event.isNextRace ? "ring-2 ring-primary shadow-orange" : ""
                }`}
              >
                <Link to={`/agenda/${getAgendaEventYear(event)}/${event.slug}`}>
                  <CardContent className="p-6 space-y-4">
                    {event.isNextRace && (
                      <div className="inline-flex px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold animate-pulse-glow">
                        Volgende Race
                      </div>
                    )}

                    <div>
                      <div className="text-xs uppercase tracking-wide text-primary/80 mb-2">
                        {event.klasse || event.series || "Race"}
                      </div>
                      <h3 className="font-headline font-semibold text-xl group-hover:text-primary transition-smooth mb-2">
                        {event.title}
                      </h3>
                      {event.roundLabel && (
                        <div className="text-sm text-muted-foreground mb-3">{event.roundLabel}</div>
                      )}

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                          <div>
                            <div className="font-medium text-foreground">
                              {formatAgendaDate(event.startDate)}
                              {event.endDate ? ` - ${formatAgendaDate(event.endDate)}` : ""}
                            </div>
                            {daysUntil > 0 && (
                              <div className="text-xs">
                                Over {daysUntil} {daysUntil === 1 ? "dag" : "dagen"}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                          <div>
                            <div>{event.venue || "Locatie volgt"}</div>
                            <div className="text-xs">{event.city || event.address || ""}</div>
                          </div>
                        </div>

                        {event.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0 text-primary" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <span className="text-primary font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-smooth text-sm">
                        Bekijk details
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:hidden">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download iCal
          </Button>
          <Button asChild variant="outline">
            <Link to="/agenda" className="flex items-center gap-2">
              Volledige Agenda
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AgendaWidget;
