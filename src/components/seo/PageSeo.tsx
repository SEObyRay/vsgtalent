import { Helmet } from "react-helmet-async";
import { SITE_URL, buildCanonical } from "@/lib/seo";
import { useEffect } from "react";

type PageSeoProps = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile" | "collection" | string;
  image?: string;
  jsonLd?: unknown | unknown[];
};

const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const PageSeo = ({
  title,
  description,
  path,
  type = "website",
  image,
  jsonLd,
}: PageSeoProps) => {
  const url = buildCanonical(path);
  const imageUrl = image ?? DEFAULT_IMAGE;
  const scripts = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  useEffect(() => {
    const setMeta = (selector: string, attrs: Record<string, string>) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
      }

      Object.entries(attrs).forEach(([key, value]) => {
        element?.setAttribute(key, value);
      });
    };

    const setCanonical = () => {
      let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!element) {
        element = document.createElement("link");
        element.rel = "canonical";
        document.head.appendChild(element);
      }
      element.href = url;
    };

    document.title = title;
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:type"]', { property: "og:type", content: type });
    setMeta('meta[property="og:url"]', { property: "og:url", content: url });
    setMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
    setCanonical();
  }, [description, imageUrl, title, type, url]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {scripts.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default PageSeo;
