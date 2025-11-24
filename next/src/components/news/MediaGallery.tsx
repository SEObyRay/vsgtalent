"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import cloudwaysImageLoader from "./imageLoader";

const VIDEO_FILE_EXTENSIONS = ["mp4", "webm", "ogg", "ogv", "mov", "m4v"] as const;
const WP_UPLOAD_PATH = "/wp-content/uploads/";
const WP_SIZE_PATTERN = /-\d+x\d+\./;

/**
 * NOODOPLOSSING: Directe Cloudways URLs gebruiken voor alle omgevingen
 * 
 * Deze functie forceert alle afbeelding URLs naar de directe Cloudways server,
 * wat CORS-problemen omzeilt maar de Next.js rewrites negeert.
 */
/**
 * Voegt een WordPress image size toe aan een afbeelding URL
 * Bijvoorbeeld: mijnfoto.jpg -> mijnfoto-800x450.jpg voor de racing-gallery size
 */
const addSizeToImageUrl = (url: string, size: 'racing-gallery' | 'thumbnail' | 'medium' | 'large' | string): string => {
  if (!url) return '';
  
  try {
    // Parse de URL
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/');
    const filename = pathParts[pathParts.length - 1];
    
    // Check of deze URL al een size bevat
    if (WP_SIZE_PATTERN.test(filename)) {
      // Vervang bestaande size met nieuwe size
      const newFilename = filename.replace(WP_SIZE_PATTERN, size === 'racing-gallery' ? '-800x450.' : '-150x150.');
      pathParts[pathParts.length - 1] = newFilename;
      parsedUrl.pathname = pathParts.join('/');
      return parsedUrl.toString();
    } else {
      // Voeg size toe aan de bestandsnaam
      const lastDot = filename.lastIndexOf('.');
      if (lastDot !== -1) {
        const name = filename.substring(0, lastDot);
        const extension = filename.substring(lastDot);
        const sizePostfix = size === 'racing-gallery' ? '-800x450' : '-150x150';
        const newFilename = `${name}${sizePostfix}${extension}`;
        pathParts[pathParts.length - 1] = newFilename;
        parsedUrl.pathname = pathParts.join('/');
        return parsedUrl.toString();
      }
    }
  } catch (error) {
    console.error('Error adding size to image URL:', error);
  }
  
  // Fallback bij fouten: originele URL terugsturen
  return url;
};

const normalizeMediaSource = (source: string): string => {
  // Altijd debug output tonen voor troubleshooting
  console.log("Media Gallery received URL:", source);

  // 1. Negeer lege URLs of numerieke IDs
  if (!source) return source;
  if (/^\d+$/.test(source)) {
    console.warn("Media Gallery: Ignoring numeric ID:", source);
    return "";
  }

  // 2. vsgtalent.nl URLs ALTIJD direct omzetten naar Cloudways URLs
  if (source.includes("vsgtalent.nl/wp-content/uploads")) {
    const cloudwaysUrl = source.replace(
      "vsgtalent.nl/wp-content/uploads", 
      "wordpress-474222-5959679.cloudwaysapps.com/wp-content/uploads"
    );
    console.log("Media Gallery: Converted vsgtalent.nl URL to Cloudways:", cloudwaysUrl);
    return cloudwaysUrl;
  }

  // 3. Lokale URLs of relatieve paden ALTIJD omzetten naar volledige Cloudways URLs
  if (source.startsWith("/wp-content/uploads/") || 
      source.startsWith("wp-content/uploads/") ||
      source.startsWith("./wp-content/uploads/")) {
    // Strip any leading slashes or ./ for consistency
    const cleanPath = source.replace(/^(\/|\.\/)*/, "");
    const cloudwaysUrl = `https://wordpress-474222-5959679.cloudwaysapps.com/${cleanPath}`;
    console.log("Media Gallery: Converted relative path to direct Cloudways URL:", cloudwaysUrl);
    return cloudwaysUrl;
  }

  // 4. Andere absolute URLs (inclusief Cloudways URLs) ongewijzigd laten
  if (source.startsWith("http://") || source.startsWith("https://")) {
    console.log("Media Gallery: Keeping absolute URL as-is:", source);
    return source;
  }

  // 5. Fallback: probeer altijd een pad aan te vullen met de Cloudways basis URL
  console.log("Media Gallery: Unknown URL format, trying Cloudways base URL:", source);
  return `https://wordpress-474222-5959679.cloudwaysapps.com/wp-content/uploads/${source.replace(/^(\/|\.\/)*/, "")}`;
};

const ensureArray = (value?: string[] | string | null): (string | null | undefined)[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return [value];
  }

  return [];
};

type MediaGalleryProps = {
  images?: string[] | string | null;
  videos?: string[] | string | null;
  title?: string;
};

type GalleryItem = {
  type: "image" | "video";
  source: string;
};

type VideoRenderer =
  | { type: "iframe"; src: string }
  | { type: "video"; src: string };

const getYoutubeEmbed = (url: URL) => {
  let videoId = "";

  if (url.hostname.includes("youtu.be")) {
    videoId = url.pathname.replace("/", "");
  } else if (url.searchParams.has("v")) {
    videoId = url.searchParams.get("v") ?? "";
  } else if (url.pathname.includes("/embed/")) {
    videoId = url.pathname.split("/embed/")[1] ?? "";
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : url.toString();
};

const getVimeoEmbed = (url: URL) => {
  const segments = url.pathname.split("/").filter(Boolean);
  const videoId = segments[0];
  return videoId ? `https://player.vimeo.com/video/${videoId}` : url.toString();
};

const getVideoRenderer = (source: string): VideoRenderer => {
  try {
    const parsed = new URL(source);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host.includes("youtube.")) {
      return { type: "iframe", src: getYoutubeEmbed(parsed) };
    }

    if (host.includes("youtu.be")) {
      return { type: "iframe", src: getYoutubeEmbed(parsed) };
    }

    if (host.includes("vimeo.com")) {
      return { type: "iframe", src: getVimeoEmbed(parsed) };
    }
  } catch {
    // Ignore parsing errors and fall back to file extension checks below.
  }

  const extension = source.split(".").pop()?.toLowerCase();
  if (extension && VIDEO_FILE_EXTENSIONS.includes(extension as (typeof VIDEO_FILE_EXTENSIONS)[number])) {
    return { type: "video", src: source };
  }

  return { type: "iframe", src: source };
};

const buildGalleryItems = (images?: MediaGalleryProps["images"], videos?: MediaGalleryProps["videos"]): GalleryItem[] => {
  const imageItems = ensureArray(images)
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((source) => ({ type: "image", source: normalizeMediaSource(source) } as const));

  const videoItems = ensureArray(videos)
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((source) => ({ type: "video", source: normalizeMediaSource(source) } as const));

  return [...imageItems, ...videoItems];
};

export const MediaGallery = ({ images, videos, title }: MediaGalleryProps) => {
  const items = buildGalleryItems(images, videos);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Debug logging removed for production

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (items.length === 0) {
    return null;
  }

  const heading = title ?? "Media";

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-headline font-semibold">{heading}</h2>
        {items.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      <Carousel setApi={setApi} opts={{ align: "center", loop: items.length > 1 }} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item, index) => (
            <CarouselItem key={`${item.type}-${index}`} className="pl-2 md:pl-4">
              <AspectRatio
                ratio={16 / 9}
                className="relative overflow-hidden rounded-2xl border border-border bg-muted shadow-inner"
              >
                {item.type === "image" ? (
                  // Gebruik een normale img-tag in plaats van Next.js Image component
                  // om alle optimalisatie en loading issues te omzeilen
                  <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
                    <img 
                      src={addSizeToImageUrl(item.source, 'racing-gallery')}
                      alt={`${heading} ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                      }}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <VideoSlide source={item.source} title={`${heading} video ${index + 1}`} />
                )}
                <span
                  className={cn(
                    "absolute left-4 top-4 inline-flex items-center rounded-full bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground backdrop-blur",
                  )}
                >
                  {item.type === "image" ? "Foto" : "Video"}
                </span>
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        {items.length > 1 && (
          <div className="hidden sm:block">
            <CarouselPrevious className="-left-6 top-1/2 h-10 w-10 -translate-y-1/2 border-border bg-background/90 shadow-lg hover:bg-background" />
            <CarouselNext className="-right-6 top-1/2 h-10 w-10 -translate-y-1/2 border-border bg-background/90 shadow-lg hover:bg-background" />
          </div>
        )}
      </Carousel>

      {items.length >= 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-4">
          {items.map((item, index) => (
            <button
              key={`thumb-${index}`}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "relative aspect-video overflow-hidden rounded-lg border-2 transition-all hover:scale-105",
                current === index ? "border-primary ring-2 ring-primary/20" : "border-border opacity-60 hover:opacity-100",
              )}
            >
              {item.type === "image" ? (
                // Directe img-tag voor thumbnails
                <img 
                  src={addSizeToImageUrl(item.source, 'thumbnail')}
                  alt={`Thumbnail ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <svg
                    className="h-6 w-6 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

const VideoSlide = ({ source, title }: { source: string; title: string }) => {
  const renderer = getVideoRenderer(source);

  if (renderer.type === "video") {
    return (
      <video
        controls
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        poster={undefined}
      >
        <source src={renderer.src} />
        Uw browser ondersteunt de video-tag niet.
      </video>
    );
  }

  return (
    <iframe
      src={renderer.src}
      title={title}
      className="absolute inset-0 h-full w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
    />
  );
};

export default MediaGallery;
