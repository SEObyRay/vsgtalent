import type { BusinessInfo } from "@/types/business-info";

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "http://levy-racing-backend.local/wp-json";

/**
 * Fetch business information from WordPress
 * This data should be managed via ACF Options Page in WordPress
 */
export async function getBusinessInfo(): Promise<BusinessInfo> {
  try {
    const response = await fetch(`${WP_API_URL}/levy/v1/business-info`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.warn(`Failed to fetch business info from WordPress (status ${response.status}), using defaults.`);
      return getDefaultBusinessInfo();
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching business info:", error);
    
    // Fallback to default data
    return getDefaultBusinessInfo();
  }
}

/**
 * Default business info (fallback when WordPress is unavailable)
 */
function getDefaultBusinessInfo(): BusinessInfo {
  return {
    organizationName: "VSG Talent",
    legalName: "VSG Dakwerken B.V.",
    description: "VSG Talent ondersteunt veelbelovende sporters in Nederland. Altijd 100%, in weer en wind. Een initiatief van VSG Dakwerken.",
    address: {
      street: "Söderblomstraat",
      houseNumber: "181",
      postalCode: "2131 GE",
      city: "Hoofddorp",
      province: "Noord-Holland",
      country: "Nederland",
    },
    coordinates: {
      latitude: 52.30338852113304,
      longitude: 4.671270639907734,
    },
    phone: "+31 6 51664731",
    email: "info@vsgdakwerken.nl",
    socialMedia: {
      instagram: "https://www.instagram.com/vsgdakwerken.nl/",
      linkedin: "https://www.linkedin.com/company/vsg-dakwerken/",
    },
    contacts: [
      {
        name: "Stephan van Opbergen",
        role: "Mede-eigenaar en Verkoop / Administratie",
        email: "stephan@vsgdakwerken.nl",
        phone: "+31 6 51664731",
        linkedin: "https://www.linkedin.com/in/stephan-van-opbergen/",
      },
      {
        name: "Mustafa Guner",
        role: "Mede-eigenaar en Project Leider",
        email: "mustafa@vsgdakwerken.nl",
        phone: "+31 6 34064773",
      },
    ],
    founded: "2010",
  };
}

/**
 * Build Organization Schema using business info
 */
export function buildOrganizationSchema(businessInfo: BusinessInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: businessInfo.organizationName,
    legalName: businessInfo.legalName,
    description: businessInfo.description,
    url: "https://levyopbergen.nl",
    logo: businessInfo.logo || "https://levyopbergen.nl/og-image.jpg",
    image: "https://levyopbergen.nl/og-image.jpg",
    email: businessInfo.email,
    telephone: businessInfo.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${businessInfo.address.street} ${businessInfo.address.houseNumber}`,
      postalCode: businessInfo.address.postalCode,
      addressLocality: businessInfo.address.city,
      addressRegion: businessInfo.address.province,
      addressCountry: businessInfo.address.country,
    },
    geo: businessInfo.coordinates
      ? {
          "@type": "GeoCoordinates",
          latitude: businessInfo.coordinates.latitude,
          longitude: businessInfo.coordinates.longitude,
        }
      : undefined,
    sameAs: Object.values(businessInfo.socialMedia).filter(Boolean),
    foundingDate: businessInfo.founded,
    contactPoint: businessInfo.contacts.map((contact) => ({
      "@type": "ContactPoint",
      contactType: contact.role,
      email: contact.email,
      telephone: contact.phone,
      name: contact.name,
    })),
  };
}
