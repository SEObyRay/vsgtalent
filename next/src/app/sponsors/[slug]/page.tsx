import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWordPressSponsorBySlug } from "@/lib/wordpress-data";
import type { WPSponsor } from "@/types/wordpress";
import { Card, CardContent } from "@/components/ui/card";

type SponsorEmbeddedMedia = {
  "wp:featuredmedia"?: Array<{ source_url?: string | null }>;
};

const pickLogo = (s: WPSponsor) => {
  const embedded = s._embedded as SponsorEmbeddedMedia | undefined;
  const media = embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  return s.featured_image_url ?? media ?? "/placeholder.svg";
};

interface SponsorPageProps {
  params: { slug: string };
}

export default async function SponsorDetailPage({ params }: SponsorPageProps) {
  const sponsor = await getWordPressSponsorBySlug(params.slug);

  if (!sponsor) {
    notFound();
  }

  const logo = pickLogo(sponsor);
  const website = sponsor.meta?.website ?? null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:gap-8">
          <div className="relative w-40 h-40 mb-6 md:mb-0">
            <Card className="w-full h-full flex items-center justify-center">
              <CardContent className="w-full h-full p-4 flex items-center justify-center relative">
                <Image
                  src={logo}
                  alt={sponsor.title?.rendered || "Sponsor"}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold mb-3">
              {sponsor.title?.rendered}
            </h1>
            {website && (
              <p className="text-primary mb-2">
                <Link href={website} target="_blank" rel="noopener noreferrer" className="underline">
                  {website}
                </Link>
              </p>
            )}
          </div>
        </div>

        <article
          className="max-w-none text-base md:text-lg leading-relaxed space-y-4 [&_h2]:text-2xl [&_h2]:font-headline [&_h2]:font-bold [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_li]:pl-1"
          dangerouslySetInnerHTML={{ __html: sponsor.content?.rendered ?? "" }}
        />
      </div>
    </section>
  );
}
