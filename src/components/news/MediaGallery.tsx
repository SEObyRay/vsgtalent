import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";
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
import { useEffect, useRef, useState } from "react";

const VIDEO_FILE_EXTENSIONS = ["mp4", "webm", "ogg", "ogv", "mov", "m4v"] as const;
const WP_UPLOAD_PATH = "/wp-content/uploads/";

const CLOUDWAYS_BASE = "https://wordpress-474222-5959679.cloudwaysapps.com";

const normalizeMediaSource = (source: string): string => {
  if (!source) return source;

  // 1) Absolute URLs
  if (source.startsWith("http://") || source.startsWith("https://")) {
    // Convert vsgtalent.nl to Cloudways
    if (source.includes("vsgtalent.nl")) {
      return source
        .replace("https://vsgtalent.nl", CLOUDWAYS_BASE)
        .replace("http://vsgtalent.nl", CLOUDWAYS_BASE);
    }
    // Keep Cloudways as-is
    if (source.includes("wordpress-474222-5959679.cloudwaysapps.com")) {
      return source;
    }
    // If absolute but contains /wp-content/uploads, force Cloudways base
    if (source.includes("/wp-content/uploads/")) {
      try {
        const u = new URL(source);
        const idx = u.pathname.indexOf(WP_UPLOAD_PATH);
        if (idx !== -1) {
          const rel = u.pathname.slice(idx);
          return `${CLOUDWAYS_BASE}${rel}`;
        }
      } catch {}
    }
    // Otherwise leave as-is
    return source;
  }

  // 2) Relative paths: always serve from Cloudways
  if (source.startsWith(WP_UPLOAD_PATH)) {
    return `${CLOUDWAYS_BASE}${source}`;
  }
  if (source.includes("/wp-content/uploads/")) {
    const rel = source.substring(source.indexOf("/wp-content/uploads/"));
    return `${CLOUDWAYS_BASE}${rel}`;
  }

  return source;
};

type MediaGalleryProps = {
  images?: (string | null | undefined)[] | null;
  videos?: (string | null | undefined)[] | null;
  title?: string;
  videoPoster?: string | null;
  imageAlt?: string;
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
    .map((source) => ({ type: "image", source: normalizeMediaSource(source) } as const));

  const videoItems = (videos ?? [])
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((source) => ({ type: "video", source: normalizeMediaSource(source) } as const));

  return Array.from(new Map([...imageItems, ...videoItems].map((item) => [item.source, item])).values());
};

export const MediaGallery = ({ images, videos, title, videoPoster, imageAlt }: MediaGalleryProps) => {
  const items = buildGalleryItems(images, videos);
  const normalizedVideoPoster = videoPoster ? normalizeMediaSource(videoPoster) : null;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [failedSources, setFailedSources] = useState<Set<string>>(() => new Set());
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
  const [expandedImage, setExpandedImage] = useState<GalleryItem | null>(null);
  const rememberImageSize = (source: string, image: HTMLImageElement) => {
    const ratio = image.naturalWidth / image.naturalHeight;
    if (Number.isFinite(ratio) && ratio > 0) {
      setImageRatios((previous) => previous[source] === ratio ? previous : { ...previous, [source]: ratio });
    }
  };
  const videoRefs = useRef(new Map<string, HTMLVideoElement>());

  const handleMediaError = (src: string) => {
    setFailedSources((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  };

  const visibleItems = items.filter((item) => !failedSources.has(item.source));
  const activeVideoSource = visibleItems[current]?.type === "video" ? visibleItems[current].source : null;

  const setVideoRef = (source: string, node: HTMLVideoElement | null) => {
    if (node) {
      videoRefs.current.set(source, node);
    } else {
      videoRefs.current.delete(source);
    }
  };

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    videoRefs.current.forEach((video, source) => {
      if (source === activeVideoSource) {
        video.muted = true;
        video.play().catch(() => {
          // Some browsers still block autoplay until the user interacts.
        });
      } else {
        video.pause();
      }
    });
  }, [activeVideoSource]);

  if (visibleItems.length === 0) {
    return null;
  }

  const heading = title ?? "Media";
  const portraitGrid = visibleItems.every((item) => item.type === "image" && imageRatios[item.source] < 1);

  if (portraitGrid) {
    return (
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-headline font-semibold">{heading}</h2>
          <span className="text-sm text-muted-foreground">{visibleItems.length} {visibleItems.length === 1 ? "foto" : "foto’s"}</span>
        </div>
        <div className={cn("grid gap-3 sm:gap-4", visibleItems.length === 1 ? "max-w-sm mx-auto" : visibleItems.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
          {visibleItems.map((item, index) => (
            <button
              key={item.source}
              type="button"
              onClick={() => setExpandedImage(item)}
              aria-label={`Vergroot foto ${index + 1}`}
              className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              style={{ aspectRatio: imageRatios[item.source] }}
            >
              <img src={item.source} alt={`${imageAlt ?? heading} – foto ${index + 1}`} loading="lazy" className="h-full w-full object-contain" onError={() => handleMediaError(item.source)} />
              <span className="absolute bottom-3 right-3 rounded-full bg-background/80 p-2 text-foreground backdrop-blur transition-colors group-hover:bg-primary"><ZoomIn className="h-4 w-4" aria-hidden="true" /></span>
            </button>
          ))}
        </div>
        <Dialog open={expandedImage !== null} onOpenChange={(open) => { if (!open) setExpandedImage(null); }}>
          <DialogContent className="w-[calc(100%-2rem)] max-w-4xl border-border p-2 pt-10 sm:rounded-2xl">
            <DialogTitle className="sr-only">{imageAlt ?? heading}</DialogTitle>
            <DialogDescription className="sr-only">Volledige foto. Sluit met Escape of de sluitknop.</DialogDescription>
            {expandedImage && <img src={expandedImage.source} alt={imageAlt ?? heading} className="mx-auto max-h-[80dvh] w-auto max-w-full object-contain" />}
          </DialogContent>
        </Dialog>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-headline font-semibold">{heading}</h2>
        <span className="text-sm text-muted-foreground">{visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'}</span>
      </div>

      <Carousel setApi={setApi} opts={{ align: "center", loop: visibleItems.length > 1 }} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {visibleItems.map((item, index) => (
            <CarouselItem key={`${item.type}-${item.source}`} className="pl-2 md:pl-4">
              <AspectRatio
                ratio={16 / 9}
                className="relative overflow-hidden rounded-2xl border border-border bg-muted shadow-inner"
              >
                {item.type === "image" ? (
                  <img
                    src={item.source}
                    alt={(imageAlt ?? heading) + " – foto " + (index + 1)}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain"
                    onLoad={(event) => rememberImageSize(item.source, event.currentTarget)}
                    onError={() => handleMediaError(item.source)}
                  />
                ) : (
                  <VideoSlide
                    source={item.source}
                    title={`${heading} video ${index + 1}`}
                    poster={normalizedVideoPoster}
                    onError={handleMediaError}
                    setVideoRef={setVideoRef}
                  />
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
        {visibleItems.length > 1 && (
          <div className="hidden sm:block">
            <CarouselPrevious className="-left-6 top-1/2 h-10 w-10 -translate-y-1/2 border-border bg-background/90 shadow-lg hover:bg-background" />
            <CarouselNext className="-right-6 top-1/2 h-10 w-10 -translate-y-1/2 border-border bg-background/90 shadow-lg hover:bg-background" />
          </div>
        )}
      </Carousel>

      {/* Thumbnail grid */}
      {visibleItems.length >= 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-4">
          {visibleItems.map((item, index) => (
            <button
              key={`thumb-${item.source}`}
              onClick={() => api?.scrollTo(index)}
              aria-label={"Bekijk " + (item.type === "image" ? "foto" : "video") + " " + (index + 1)}
              aria-pressed={current === index}
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
                  alt=""
                  className="h-full w-full object-cover"
                  onLoad={(event) => rememberImageSize(item.source, event.currentTarget)}
                  onError={() => handleMediaError(item.source)}
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center bg-muted">
                  {normalizedVideoPoster && (
                    <img
                      src={normalizedVideoPoster}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <span className="absolute inset-0 bg-background/20" />
                  <svg
                    className="relative h-6 w-6 text-foreground drop-shadow"
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

const VideoSlide = ({
  source,
  title,
  poster,
  onError,
  setVideoRef,
}: {
  source: string;
  title: string;
  poster?: string | null;
  onError?: (src: string) => void;
  setVideoRef?: (source: string, node: HTMLVideoElement | null) => void;
}) => {
  const renderer = getVideoRenderer(source);

  if (renderer.type === "video") {
    return (
      <video
        ref={(node) => setVideoRef?.(source, node)}
        controls
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        poster={poster ?? undefined}
        onError={() => onError?.(source)}
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
