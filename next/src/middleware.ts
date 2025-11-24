import { NextResponse, NextRequest } from 'next/server';

/**
 * Middleware voor het afhandelen van rewrites in de lokale ontwikkelomgeving
 * 
 * In productiemodus (Vercel) werkt de rewrite in next.config.ts correct,
 * maar lokaal moet deze explicieter worden toegepast.
 */
export function middleware(request: NextRequest) {
  // Controleer of het verzoek naar een uploadsbestand gaat
  if (request.nextUrl.pathname.startsWith('/wp-content/uploads/')) {
    // Log voor debugging
    console.log(`Rewriting ${request.nextUrl.pathname} to Cloudways`);
    
    // Construct de nieuwe URL naar de Cloudways server
    const cloudwaysUrl = new URL(
      request.nextUrl.pathname,
      'https://wordpress-474222-5959679.cloudwaysapps.com'
    );
    
    // Zorg ervoor dat we een Response returnen die naar de juiste URL verwijst
    return NextResponse.rewrite(cloudwaysUrl);
  }
  
  return NextResponse.next();
}

/**
 * Configuratie voor de middleware: alleen toepassen op specifieke paden
 */
export const config = {
  // Alleen toepassen op /wp-content/uploads/ paden
  matcher: ['/wp-content/uploads/:path*'],
};
