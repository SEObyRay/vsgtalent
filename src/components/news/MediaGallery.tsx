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
import { useEffect, useState } from "react";

const VIDEO_FILE_EXTENSIONS = ["mp4", "webm", "ogg", "ogv", "mov", "m4v"] as const;

type MediaGalleryProps = {
  images?: (string | null | undefined)[] | null;
  videos?: (string | null | undefined)[] | null;
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
  const imageItems = (images ?? [])
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((source) => ({ type: "image", source } as const));

  const videoItems = (videos ?? [])
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((source) => ({ type: "video", source } as const));

  return [...imageItems, ...videoItems];
};

export const MediaGallery = ({ images, videos, title }: MediaGalleryProps) => {
  const items = buildGalleryItems(images, videos);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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
        {items.length > 0 && <span className="text-sm text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'items'}</span>}
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
                  <img
                    src={item.source}
                    alt={`${heading} ${index + 1}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
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

      {/* Thumbnail grid */}
      {items.length >= 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-4">
          {items.map((item, index) => (
            <button
              key={`thumb-${index}`}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "relative aspect-video overflow-hidden rounded-lg border-2 transition-all hover:scale-105",
                current === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border opacity-60 hover:opacity-100"
              )}
            >
              {item.type === "image" ? (
                <img
                  src={item.source}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
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
