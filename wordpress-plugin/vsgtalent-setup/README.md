# VSGTalent WordPress Setup Plugin

WordPress plugin voor automatische configuratie van de VSGTalent backend.

## Wat doet deze plugin?

Deze plugin configureert automatisch je WordPress installatie als backend voor de Levy Racing Pulse React app:

- **Custom Post Type "Evenementen"** voor race agenda
- **Taxonomieën** voor Competities en Seizoenen
- **REST API endpoints** volledig geconfigureerd
- **CORS headers** voor localhost development
- **Custom meta fields** voor alle benodigde data
- **Featured image URLs** in REST API responses
- ✅ **Custom Post Type "Evenementen"** voor race agenda
- ✅ **Taxonomieën** voor Competities en Seizoenen
- ✅ **REST API endpoints** volledig geconfigureerd
- ✅ **CORS headers** voor localhost development
- ✅ **Custom meta fields** voor alle benodigde data
- ✅ **Featured image URLs** in REST API responses

## 🚀 Installatie

### Optie 1: Via WordPress Admin (Aanbevolen)

1. **ZIP bestand maken:**
   ```bash
   cd wordpress-plugin
   zip -r levy-racing-setup.zip levy-racing-setup/
   ```

2. **Uploaden in WordPress:**
   - Ga naar **Plugins → Nieuwe plugin toevoegen**
   - Klik op **Plugin uploaden**
   - Selecteer `levy-racing-setup.zip`
   - Klik op **Nu installeren**
   - Klik op **Plugin activeren**

### Optie 2: Handmatig (voor Local)

1. **Kopieer plugin folder:**
   ```bash
   cp -r wordpress-plugin/levy-racing-setup /Users/[jouw-naam]/Local Sites/levy-racing-backend/app/public/wp-content/plugins/
   ```

2. **Activeer in WordPress:**
   - Ga naar **Plugins** in WordPress admin
   - Zoek **Levy Racing Auto Setup**
   - Klik op **Activeren**

## ✅ Na Activatie

Na activatie zie je een nieuw menu item **"Levy Racing"** in de WordPress admin sidebar.

### Wat is er gebeurd?

1. **Custom Post Type "Evenementen"** is geregistreerd
2. **Taxonomieën** zijn aangemaakt:
   - Competities (voor Posts)
   - Seizoenen (voor Posts)
3. **REST API endpoints** zijn actief:
   - `/wp-json/wp/v2/evenementen`
   - `/wp-json/wp/v2/posts`
   - `/wp-json/wp/v2/competities`
   - `/wp-json/wp/v2/seizoenen`
4. **CORS** is geconfigureerd voor:
   - `http://localhost:5173` (Vite default)
   - `http://localhost:3000` (React default)
   - `http://localhost:8080` (alternatief)

## 🔧 Configuratie

### 1. Application Password Aanmaken

Voor authenticatie vanuit de React app:

1. Ga naar **Gebruikers → Profiel**
2. Scroll naar **"Application Passwords"**
3. Vul in: `Levy Racing App`
4. Klik op **Add New Application Password**
5. **Kopieer het wachtwoord** (bijv. `xxxx xxxx xxxx xxxx xxxx xxxx`)
6. Bewaar dit voor de React app `.env` file

### 2. Test Data Toevoegen

#### Competities
1. Ga naar **Berichten → Competities**
2. Voeg toe:
   - Rotax Max Challenge
   - IAME X30 Challenge
   - ONK Karting

#### Seizoenen
1. Ga naar **Berichten → Seizoenen**
2. Voeg toe:
   - 2024
   - 2025

#### Test Evenement
1. Ga naar **Evenementen → Nieuwe toevoegen**
2. Vul in:
   - **Titel:** Rotax Max Challenge - Ronde 3
   - **Datum:** 2025-04-12
   - **Einddatum:** 2025-04-13
   - **Tijd:** 09:00 - 18:00
   - **Locatie:** Circuit Park Berghem
   - **Stad:** Berghem
   - **Adres:** Berghem, Nederland
   - **Klasse:** Senior Max
   - **Volgende Race:** ✓
3. Upload een **Uitgelichte afbeelding**
4. Klik op **Publiceren**

#### Test Race Verslag
1. Ga naar **Berichten → Nieuw bericht**
2. Vul in:
   - **Titel:** Podium Finish in Rotax Max Challenge Nederland
   - **Inhoud:** Fantastisch weekend in Lelystad met een 2e plaats in de finale!
   - **Circuit:** Raceway Lelystad
   - **Positie:** 2
   - **Competitie:** Rotax Max Challenge
   - **Seizoen:** 2024
3. Upload een **Uitgelichte afbeelding**
4. Klik op **Publiceren**

## 🧪 REST API Testen

Test de endpoints in je browser:

```
http://levy-racing-backend.local/wp-json/wp/v2/evenementen
http://levy-racing-backend.local/wp-json/wp/v2/posts
http://levy-racing-backend.local/wp-json/wp/v2/competities
http://levy-racing-backend.local/wp-json/wp/v2/seizoenen
```

Je zou JSON data moeten zien!

## 📋 Custom Fields

### Evenementen
- `datum` (string) - Datum van het evenement
- `einddatum` (string) - Einddatum
- `tijd` (string) - Tijd (bijv. "09:00 - 18:00")
- `locatie` (string) - Circuit naam
- `stad` (string) - Stad
- `adres` (string) - Volledig adres
- `klasse` (string) - Race klasse
- `volgende_race` (boolean) - Is dit de volgende race?
- `resultaat` (string) - Resultaat voor afgelopen events

### Posts (Race Verslagen)
- `circuit` (string) - Circuit naam
- `positie` (integer) - Race positie (1, 2, 3, etc.)

## 🔐 Beveiliging

De plugin configureert CORS alleen voor localhost development. Voor productie:

1. Voeg je productie domain toe via filter:
   ```php
   add_filter('levy_racing_cors_origins', function($origins) {
       $origins[] = 'https://jouw-productie-domain.com';
       return $origins;
   });
   ```

2. Of pas de plugin aan voor je specifieke behoeften.

## 🆘 Troubleshooting

### REST API endpoints geven 404
- Ga naar **Instellingen → Permalinks**
- Klik op **Wijzigingen opslaan** (dit flush de rewrite rules)

### CORS errors in browser console
- Check of je React app draait op een toegestane origin
- Voeg je origin toe aan de `$allowed_origins` array in de plugin

### Custom fields verschijnen niet in REST API
- Deactiveer en heractiveer de plugin
- Check of `show_in_rest` op `true` staat voor alle meta fields

## 📚 Voor Developers

### Plugin Hooks

```php
// Voeg extra CORS origins toe
add_filter('levy_racing_cors_origins', function($origins) {
    $origins[] = 'https://staging.levyracing.nl';
    return $origins;
});
```

### REST API Response Voorbeeld

**Evenement:**
```json
{
  "id": 1,
  "title": {
    "rendered": "Rotax Max Challenge - Ronde 3"
  },
  "content": {
    "rendered": "<p>Evenement beschrijving...</p>"
  },
  "meta": {
    "datum": "2025-04-12",
    "einddatum": "2025-04-13",
    "tijd": "09:00 - 18:00",
    "locatie": "Circuit Park Berghem",
    "stad": "Berghem",
    "adres": "Berghem, Nederland",
    "klasse": "Senior Max",
    "volgende_race": true,
    "resultaat": ""
  },
  "featured_image_url": "http://levy-racing-backend.local/wp-content/uploads/2024/10/image.jpg"
}
```

## 📝 Changelog

### 1.0.0 (2024-10-14)
- Initial release
- Custom Post Type "Evenementen"
- Taxonomieën: Competities & Seizoenen
- REST API configuratie
- CORS support
- Custom meta fields
- Admin dashboard

## 👨‍💻 Auteur

**Ray Gritter**  
[SEO by Ray](https://seobyray.com)

## 📄 Licentie

Dit is een custom plugin voor Levy Racing. Alle rechten voorbehouden.
