/**
 * Custom image loader voor Next.js Image component
 * 
 * Deze loader lost CORS-problemen op door alle afbeeldingen
 * direct van de Cloudways server te laden.
 */

import { ImageLoaderProps } from "next/image";

/**
 * Detecteert of een URL relatief of absoluut is
 */
const isAbsoluteUrl = (url: string): boolean => {
  return /^(?:[a-z+]+:)?\/\//i.test(url);
};

/**
 * Converteert elke afbeeldings-URL naar de directe Cloudways URL
 */
const cloudwaysImageLoader = ({ src }: ImageLoaderProps): string => {
  // Als het al een absolute URL is, pas dan alleen width/quality toe indien nodig
  if (isAbsoluteUrl(src)) {
    // Als het al een Cloudways URL is, return ongewijzigd
    if (src.includes('wordpress-474222-5959679.cloudwaysapps.com')) {
      return src;
    }
    
    // Als het een vsgtalent.nl URL is, converteer naar Cloudways
    if (src.includes('vsgtalent.nl')) {
      return src.replace(
        'vsgtalent.nl', 
        'wordpress-474222-5959679.cloudwaysapps.com'
      );
    }
    
    // Andere absolute URLs ongewijzigd laten
    return src;
  }
  
  // Voor relatieve URLs, voeg de Cloudways basis URL toe
  // Strip eventuele voorafgaande slashes voor consistentie
  const cleanPath = src.replace(/^\/+/, '');
  return `https://wordpress-474222-5959679.cloudwaysapps.com/${cleanPath}`;
}

export default cloudwaysImageLoader;
