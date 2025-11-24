# MediaGallery Fix - Productie & Ontwikkeling

## Probleem
De media gallery images werden niet correct weergegeven op de site omdat de URLs in de WordPress database verwezen naar `vsgtalent.nl/wp-content/uploads/...` terwijl de afbeeldingen eigenlijk staan op `wordpress-474222-5959679.cloudwaysapps.com/wp-content/uploads/...`.

## Oplossing 1: WordPress Plugin

We hebben een WordPress plugin gemaakt die:

1. **Media Gallery URLs repareert** in de WordPress database
   - Converteer URLs van `vsgtalent.nl` naar `wordpress-474222-5959679.cloudwaysapps.com`
   - Deze plugin is geïnstalleerd op de productie WordPress (Cloudways)

2. **Media Gallery Sidebar toevoegt** in de WordPress editor
   - Maakt het gemakkelijk om afbeeldingen toe te voegen/verwijderen in posts
   - Zorgt ervoor dat nieuwe afbeeldingen correct worden opgeslagen

## Oplossing 2: Next.js URL Normalisatie

De `MediaGallery.tsx` component is aangepast om alle URL typen correct af te handelen:

1. **Vercel Production**: In productie zijn rewrites geconfigureerd in `next.config.ts`
   - Vercel rewrite: `/wp-content/uploads/:path*` → `https://wordpress-474222-5959679.cloudwaysapps.com/wp-content/uploads/:path*`

2. **Lokale Ontwikkeling**: Expliciete URL-aanpassingen in `normalizeMediaSource`
   - Converteert `vsgtalent.nl/wp-content/uploads/...` naar `wordpress-474222-5959679.cloudwaysapps.com/wp-content/uploads/...`
   - Converteert relatieve paden `/wp-content/uploads/...` naar absolute Cloudways URLs
   - Bevat debugging om problemen sneller op te sporen (check browser console)

## Verschillen tussen Vercel en Lokale Ontwikkeling

- Vercel gebruikt rewrites waardoor URLs automatisch worden omgeleid
- Lokale ontwikkeling heeft deze rewrite-functionaliteit niet op dezelfde manier
- De code is nu aangepast om in beide omgevingen consistent te werken

## Problemen Oplossen

### Controleer de WordPress Database
```bash
curl -s "https://wordpress-474222-5959679.cloudwaysapps.com/wp-json/wp/v2/posts?slug=glorieuze-overwinning-iame-x30-challenge" | grep -o '"media_gallery":\[[^]]*\]'
```

### Controleer of Afbeeldingen Bestaan
```bash
curl -I "https://wordpress-474222-5959679.cloudwaysapps.com/wp-content/uploads/2025/05/afbeeldingnaam.jpg"
```

### Browser Developer Tools
Open de browser console (F12) om de debug logs te bekijken die tonen hoe URLs worden verwerkt.

### Repareer de Database met de Plugin
Als er nog steeds verkeerde URLs in de database staan, gebruik dan de "Repareer Media Galerij" functie in de WordPress admin.
