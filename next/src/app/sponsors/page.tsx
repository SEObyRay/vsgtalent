import type { ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWordPressSponsors } from "@/lib/wordpress-data";
import { WPSponsor } from "@/types/wordpress";
import { Card, CardContent } from "@/components/ui/card";

const pickLogo = (s: WPSponsor) => s.featured_image_url ?? "/placeholder.svg";

export const metadata = {
  title: "Sponsors",
  description: "Onze partners en sponsors",
};

export default async function SponsorsPage() {
  let sponsors: WPSponsor[] = [];
  try {
    const res = await getWordPressSponsors({ per_page: 100, _embed: true, order: "asc" }, 30);
    sponsors = res.items
      .filter((s) => s.meta?.active !== false)
      .sort((a, b) => (a.meta?.priority ?? 999) - (b.meta?.priority ?? 999));
  } catch {
    sponsors = [];
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-6">Sponsors</h1>
        <p className="text-muted-foreground mb-10">Dank aan alle partners die dit mogelijk maken.</p>

        {sponsors.length === 0 ? (
          <div className="text-muted-foreground">Nog geen sponsors gevonden.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sponsors.map((s) => {
              const logo = pickLogo(s);
              const website = s.meta?.website ?? undefined;
              const Wrapper: ElementType = website ? Link : "div";
              const wrapperProps = website ? { href: website, target: "_blank", rel: "noopener noreferrer" } : {};

              return (
                <Wrapper key={s.id} {...wrapperProps}>
                  <Card className="group aspect-square bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-colors duration-300 hover-lift">
                    <CardContent className="w-full h-full p-6 flex items-center justify-center relative">
                      <Image
                        src={logo}
                        alt={s.title?.rendered || "Sponsor"}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </CardContent>
                  </Card>
                </Wrapper>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
