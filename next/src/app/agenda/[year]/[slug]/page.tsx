import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getWordPressEventBySlug } from "@/lib/wordpress-data";
import { decodeHtml } from "@/lib/utils";
import { buildCanonical, SITE_URL } from "@/lib/seo";
import { buildBreadcrumbsJsonLd } from "@/lib/breadcrumbs";
import type { WPEvent } from "@/types/wordpress";

interface AgendaDetailParams {
  params: {
    slug: string;
    year: string;
  };
}

type AgendaEmbeddedMedia = {
  "wp:featuredmedia"?: Array<{ source_url?: string | null }>;
};

const extractFeaturedImage = (event: WPEvent | null) => {
  const embedded = event?._embedded as AgendaEmbeddedMedia | undefined;
  const media = embedded?.["wp:featuredmedia"]?.[0];
  return media?.source_url || null;
};

const formatDate = (date?: string) => {
  if (!date) return "Onbekende datum";
  return new Date(date).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export async function generateMetadata({ params }: AgendaDetailParams): Promise<Metadata> {
  const event = await getWordPressEventBySlug(params.slug);
  if (!event) {
    return {
      title: "Evenement | Levy Opbergen",
    };
  }

  const featuredImage = extractFeaturedImage(event) ?? `${SITE_URL}/og-image.jpg`;
  const title = `${decodeHtml(event.title.rendered)} | Race Agenda Levy Opbergen`;
  const location = event?.meta?.locatie ? decodeHtml(event.meta.locatie ?? "") : "Onbekend circuit";
  const city = event?.meta?.stad ? decodeHtml(event.meta.stad ?? "") : "";
  const description = `${formatDate(event.meta?.datum ?? undefined)} • ${location}${city ? ` (${city})` : ""}`;
  const canonicalPath = `/agenda/${params.year}/${params.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: buildCanonical(canonicalPath),
    },
    openGraph: {
      title,
      description,
      url: buildCanonical(canonicalPath),
      type: "article",
      images: [featuredImage],
    },
  };
}

export default async function AgendaDetailPage({ params }: AgendaDetailParams) {
  const event = await getWordPressEventBySlug(params.slug);
  if (!event) {
    notFound();
  }

  const featuredImage = extractFeaturedImage(event);
  const location = event?.meta?.locatie ? decodeHtml(event.meta.locatie ?? "") : "Onbekend circuit";
  const address = event?.meta?.adres ? decodeHtml(event.meta.adres ?? "") : "";
  const city = event?.meta?.stad ? decodeHtml(event.meta.stad ?? "") : "";
  const klasse = event?.meta?.klasse ? decodeHtml(event.meta.klasse ?? "") : "";
  const time = event?.meta?.tijd ? decodeHtml(event.meta.tijd ?? "") : "Tijd nog niet bekend";
  const canonicalPath = `/agenda/${params.year}/${params.slug}`;
  const description = `${formatDate(event.meta?.datum ?? undefined)} • ${location}${city ? ` (${city})` : ""}`;

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: decodeHtml(event.title.rendered),
    startDate: event.meta?.datum ? new Date(event.meta.datum).toISOString() : undefined,
    endDate: event.meta?.einddatum ? new Date(event.meta.einddatum).toISOString() : undefined,
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
  };
  
  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: "Home", url: "/" },
    { name: "Agenda", url: "/agenda" },
    { name: decodeHtml(event.title.rendered) },
  ]);

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 gap-2">
          <Link href="/agenda">
            <ArrowLeft className="w-4 h-4" /> Terug naar agenda
          </Link>
        </Button>

        <article className="space-y-10">
          <header className="space-y-4">
            <div className="space-y-2">
              {klasse && (
                <span className="text-sm uppercase tracking-wide text-primary/80">{klasse}</span>
              )}
              <h1 className="text-4xl md:text-5xl font-headline font-bold">
                {decodeHtml(event.title.rendered)}
              </h1>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(event.meta?.datum ?? undefined)}
                {event.meta?.einddatum ? ` – ${formatDate(event.meta.einddatum ?? undefined)}` : ""}
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
                <Image
                  src={featuredImage}
                  alt={decodeHtml(event.title.rendered)}
                  width={1280}
                  height={720}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            )}
          </header>

          <Card className="border-border/60">
            <CardContent
              className="prose prose-invert max-w-none p-8"
              dangerouslySetInnerHTML={{ __html: event.content?.rendered ?? "" }}
            />
          </Card>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Plan je bezoek of neem contact op voor hospitality-arrangementen.
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/agenda">
                <ArrowLeft className="w-4 h-4" /> Terug naar agenda
              </Link>
            </Button>
          </div>
        </article>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
    </div>
  );
}
