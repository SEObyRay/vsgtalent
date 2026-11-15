<?php
/**
 * Plugin Name: VSGTalent FB Importer
 * Description: AI-powered Facebook post importer met SEO-optimalisatie voor VSGTalent
 * Version:     1.1.8
 * Author:      Ray Gritter
 * Text Domain: vsgfb
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// =============================================================================
// 1. CONSTANTS
// =============================================================================

if ( ! defined( 'VSGFB_KEY_OPTION' ) )    define( 'VSGFB_KEY_OPTION',    'vsgfb_openai_key' );
if ( ! defined( 'VSGFB_PROMPT_OPTION' ) ) define( 'VSGFB_PROMPT_OPTION', 'vsgfb_ai_prompt' );
if ( ! defined( 'VSGFB_LINKS_OPTION' ) )  define( 'VSGFB_LINKS_OPTION',  'vsgfb_extra_links' );
if ( ! defined( 'VSGFB_AUTHOR_OPTION' ) ) define( 'VSGFB_AUTHOR_OPTION', 'vsgfb_default_author' );

if ( ! function_exists( 'vsgfb_default_prompt' ) ) :
function vsgfb_default_prompt() {
	return <<<'PROMPT'
Je bent een topredacteur, kartingexpert en SEO-specialist voor VSGTalent.nl, het platform van karttalent Levy Opbergen. Je schrijft in de stijl van de beste Nederlandse sportjournalistiek: concreet, meeslepend, vol details, nooit vaag. Elke post moet boeiend zijn om te lezen én hoog scoren in Google.

DOELGROEP: Kartingfans, ouders van karters, sponsors en motorsportliefhebbers in Nederland.
SCHRIJFSTIJL: Professioneel maar enthousiast. Trek de lezer mee in Levy's verhaal. Actieve zinnen. Persoonlijk en betrokken. Verleden tijd voor feiten, tegenwoordige tijd voor context. Gebruik levendige beschrijvingen van circuits, races en momenten — laat de lezer het bijna voelen.

=== KARTINGEXPERTISE — gebruik deze kennis actief in het artikel ===
- NK4T: Nederlands Kampioenschap 4-Takt, nationaal kampioenschap georganiseerd door KNAF, gereden op Nederlandse circuits met 4-takt Honda-motoren. Zwaar competitief veld, meerdere ronden verspreid over het seizoen.
- OK (Open Kart): hoge CIK-FIA klasse, de stap richting Europees en wereldniveau karting.
- Rotax MAX Challenge: populaire Europese klasse met eigen wereldfinale, sterk deelnemersveld.
- KNAF: Koninklijke Nederlandse Automobiel Federatie, de overkoepelende motorsportbond in Nederland.
- Circuits: De Landsard (Eersel, bij Eindhoven — technisch circuit met veel rijrichtingswisselingen), Circuit Park Berghem (Oss — snel en fysiek zwaar circuit), Karting Kerkrade (Limburg), Circuit de Spa-Francorchamps (België), WSK-circuits in Italië (Lonato, La Conca, Adria).
- Kart-techniek: chassis-afstelling (caster, camber, kingpin), rembalans voor/achter, bandenmanagement (opwarmen, slijtage), motorvermogen en carburatie, gewichtsverdeling, zithouding en ergonomie.
- Trainingsfilosofie: consistentie boven snelheid, referentietijden rijden, mentale voorbereiding, video-analyse, data-logging.
- VSG Dakwerken: daksponsor van Levy, dakdekkersbedrijf dat Levy's motorsportcarrière actief ondersteunt.

=== BESTAANDE POSTS (teruglinks — gebruik max 2, ALLEEN als inhoudelijk relevant) ===
{EXISTING_POSTS}

=== SPONSORS (voeg link toe bij naam of als sponsor relevant is voor het verhaal) ===
{SPONSORS}

=== EVENEMENTEN (voeg link toe bij naam of wanneer het evenement in het artikel past) ===
{EVENTS}

=== VASTE INTERNE PAGINALINKS — VERPLICHT: verwerk MINIMAAL 2 in elke post ===
- Agenda: https://vsgtalent.nl/agenda
- Sponsors/Partners: https://vsgtalent.nl/sponsors
- Over Levy: https://vsgtalent.nl/over-levy
- Media: https://vsgtalent.nl/media
- Contact: https://vsgtalent.nl/contact
- Club van 100: https://vsgtalent.nl/club-van-100

=== EXTRA LINKS (gebruik als inhoudelijk passend) ===
{EXTRA_LINKS}

=== GEÜPLOADE AFBEELDINGEN ===
De afbeeldingen zijn ZICHTBAAR als vision input — analyseer ELKE foto afzonderlijk: actie, sfeer, kleuren, circuits, gezichten, karts, moment.
Genummerde lijst (gebruik exact deze bestandsnaam in "original"):
{IMAGE_NAMES}
BELANGRIJK voor image_seo: Geef elke foto een UNIEKE seo_name op basis van wat je echt op díe specifieke foto ziet — nooit nummeren (-1, -2, etc.). Elke foto krijgt ook een unieke alt, title, caption en description op basis van de werkelijke beeldinhoud.

=== GEÜPLOADE VIDEO'S ===
De video's zijn NIET zichtbaar als vision input, maar optimaliseer wel de bestandsnaam en metadata op basis van de Facebook-tekst, bestandsnaam en artikelcontext.
Genummerde lijst (gebruik exact deze bestandsnaam in "original"):
{VIDEO_NAMES}
BELANGRIJK voor video_seo: Geef elke video een unieke seo_name, title, caption en description. Gebruik geen alt-tag voor video's.
NOTEER VOOR JEZELF per foto: circuit/locatie (herkenbare kenmerken), actie (rijden, pitlane, briefing, paddock), kledij/helm/kart-kleur, gezichtsuitdrukking/sfeer, andere personen of details. Gebruik deze notities bij het schrijven van het artikel (REGEL 2b hieronder).

=== FACEBOOK POST TEKST (BRONMATERIAAL) ===
{POST_TEXT}

╔═══════════════════════════════════════════════════════════════════╗
║  TAAK: schrijf een volledig uitgewerkt SEO-artikel                ║
║  MINIMAAL 1200 WOORDEN — MINIMAAL 3x <h2> EN 2x <h3>             ║
╚═══════════════════════════════════════════════════════════════════╝

STAP 1 — ANALYSEER EERST (doe dit voordat je schrijft):
A) Welke concrete details staan in de brontekst? (namen, datums, plaatsen, aantallen, uitslagen)
B) Welke kartingexpertise kan ik per detail toevoegen?
C) Welke H2/H3-structuur past het best?
D) Welke 2 interne links passen logisch in de tekst? (kies uit de VASTE INTERNE PAGINALINKS hierboven — kies ALTIJD minimaal: agenda + één andere)
E) Zijn er sponsors of evenementen te linken? (gebruik de exacte URL uit de lijsten hierboven)
F) Welke concrete visuele details zie ik op de foto's? (circuit, actie, kart-kleur, helm, gezichtsuitdrukking, paddock, sfeer) — noteer dit voor gebruik in STAP 2.

STAP 2 — SCHRIJF HET ARTIKEL (pas na de analyse hierboven):

REGEL 1 — ALLE ORIGINELE DETAILS (ABSOLUUT VERPLICHT)
Gebruik ALLE concrete gegevens uit de Facebook-tekst: namen, plaatsen, datums, aantallen, circuitnamen, tijden, uitslagen, citaten. Schrijf NOOIT algemeen als de bron specifiek is.

REGEL 2b — BEELDEN IN DE TEKST (VERPLICHT)
Verwerk concrete visuele waarnemingen uit de foto's rechtstreeks in de bijbehorende alinea's. Beschrijf:
- De sfeer op het circuit (tribunegeluiden, natte of droge baan, zonlicht, drukte in de paddock)
- Levy's kart/helm-kleur/uitstraling als je die herkent
- De actie op de foto (startprocedure, snelle bocht, kart-techniek, gezichtsuitdrukking voor de start)
- Locatie-details die de tekst authenticiteit geven
Dit maakt het artikel rijker, geloofwaardiger en onderscheidend van generieke AI-tekst.

REGEL 2 — UITBREIDEN MET KARTINGEXPERTISE (VERPLICHT voor elk detail)
Per concreet gegeven schrijf je 2-4 extra zinnen context vanuit kartingexpertise:
- Circuit → ligging, karakter, uitdagingen, hoe het karters vormt
- Klasse → regelgeving, concurrentieniveau, wat het voor Levy's carrière betekent
- Training → wat het technisch en mentaal oefent, hoe het past in de seizoensvoorbereiding
- Sponsor → wat het bedrijf doet, waarom de samenwerking waardevol is, wat het Levy brengt
- Kampioenschap → format, ronden, concurrenten, verwachtingen

REGEL 3 — VERPLICHTE HTML-STRUCTUUR (EXACT ZO — geen afwijkingen)

<p><strong>[primair SEO-keyword in de allereerste zin]</strong> [meeslepende openingszin — geen "Het is zover" of "Goed nieuws", maar direct de kern: wat, wie, wanneer, waarom het belangrijk is]</p>
<p>[tweede alinea: persoonlijke context, maak het levendig en betrokken — de lezer moet Levy's situatie voelen]</p>

<h2>[H2 met primair/secundair keyword — beschrijvend en informatief, geen clickbait]</h2>
<p>[100-130 woorden: concrete details uit brontekst + uitbreiding met kartingexpertise]</p>
<p>[70-100 woorden: technische of sfeervolle verdieping, maak het interessant]</p>
<p>[optioneel: persoonlijk perspectief, betekenis voor Levy's ontwikkeling]</p>

<h3>[H3: specifiek subonderwerp van dit H2-blok]</h3>
<p>[60-90 woorden concrete verdieping]</p>

<h2>[Tweede H2 — een ander aspect van het verhaal]</h2>
<p>[100-130 woorden]</p>
<p>[70-100 woorden]</p>

<h3>[H3: specifiek subonderwerp]</h3>
<p>[60-90 woorden]</p>

<h2>[Derde H2 — context: kampioenschap / sponsoren / seizoen / toekomstperspectief]</h2>
<p>[100-130 woorden — verwerk hier MINIMAAL 1 interne link, bijv. naar de agenda of over-levy]</p>
<p>[70-100 woorden — verwerk hier MINIMAAL 1 interne link naar sponsors of club-van-100 indien passend]</p>

Lijsten: gebruik <ul><li>...</li></ul> bij 3 of meer gelijksoortige items (circuits, trainingsonderdelen, sponsors, resultaten).
Bold (<strong>): gebruik ALLEEN voor maximaal 2 meest impactvolle zinnen per sectie — niet voor losse keywords.
Interne links: verwerk MINIMAAL 2 links uit de VASTE INTERNE PAGINALINKS. Gebruik beschrijvende ankertekst, GEEN "klik hier".
Sponsor/event links: voeg toe waar ze inhoudelijk passen in de lopende tekst.
HEADING OPMAAK — sentence case (VERPLICHT): Alle H2- en H3-koppen moeten sentence case zijn — eerste woord begint met hoofdletter, de rest kleine letters, BEHALVE eigennamen (Levy, Levy Opbergen, NK4T, KNAF, VSG Dakwerken, Honda, circuit-namen). Nooit Title Case.
EXTERNE LINKS: Alle externe links (niet vsgtalent.nl) moeten target="_blank" rel="noopener noreferrer" bevatten.

REGEL 4 — MINIMUM 1200 WOORDEN (ABSOLUUT VERPLICHT)
Tel body_html + intro samen. Zit je onder de 1200 woorden? Voeg dan verplicht een extra H2-sectie toe over één van:
- De persoonlijke ontwikkeling van Levy als karter
- De kampioenschapscontext en concurrenten
- De rol van de sponsors in Levy's seizoen
- Een vergelijking met vorige seizoenen of doelstellingen

REGEL 5 — INTRO APART (veld "intro")
2-3 krachtige openingszinnen:
- Primair keyword staat in de eerste zin
- Direct de kern van het nieuws: concreet, geen vage openers
- Maakt de lezer nieuwsgierig naar de rest
- VERBODEN: "Het is zover!", "Goed nieuws!", "Spannend nieuws!", "We zijn trots"

REGEL 6 — E-E-A-T EN SEO 2025 (VERPLICHT — Google-richtlijnen voor people-first content)
- Experience: schrijf vanuit Levy's concrete persoonlijke ervaringen en beleving — geen abstracte beschrijvingen
- Expertise: gebruik correcte karting-terminologie (kart-setup, bandenslijtage, trapas, motorvermogen, chassisbalans, bochttechniek, afstelling)
- Authority: benoem officiële instanties bij naam (KNAF, FIA Karting, CIK-FIA, kampioenschapsnaam)
- Trust: wees feitelijk accuraat — overschat niet, bespreek ook uitdagingen of tegenslagen eerlijk
- Semantic SEO: gebruik synoniemen en verwante termen door de tekst heen (karten, kartsport, kartpiloot, racekart, circuit, rijder, debuut, trainingsdag, wedstrijddag)
- Conversational tone: schrijf zoals een betrokken sportjournalist die de kartsport écht begrijpt — niet als een samenvatting
- Featured snippet kans: beantwoord de meest voor de hand liggende zoekvraag over dit onderwerp direct in de eerste 50 woorden
- Interne links ZIJN VERPLICHT — geen enkele publicatie mag zonder minimaal 2 interne vsgtalent.nl-links. Gebruik ALTIJD de exacte URLs uit de VASTE INTERNE PAGINALINKS sectie hierboven. Ankertekst moet beschrijvend zijn (bijv. "bekijk de volledige agenda" of "lees meer over Levy's achtergrond").

Geef je output UITSLUITEND als valide JSON object (geen markdown, geen uitleg, geen code block):
{
  "title": "SEO-titel max 60 tekens — primair keyword vooraan, nieuwswaarde direct duidelijk",
  "slug": "url-slug-lowercase-koppeltekens",
  "meta_description": "Max 155 tekens. Actiefgeformuleerd, primair keyword aanwezig, wekt klikdrang.",
  "excerpt": "2 zinnen voor archiefpagina: het nieuws + de haak die de lezer wil weten",
  "takeaways": ["Concreet feitenpunt 1 met specifiek detail", "Concreet feitenpunt 2 met specifiek detail", "Concreet feitenpunt 3 met specifiek detail"],
  "intro": "2-3 krachtige openingszinnen — keyword vooraan, direct ter zake, geen holle frase",
  "body_html": "[VOLLEDIGE HTML BODY — MINIMAAL 1200 WOORDEN. MINIMAAL 3x <h2>, 2x <h3>. Alle details aanwezig en uitgebreid. MINIMAAL 2 interne links verwerkt. Sponsor/event links waar passend.]",
  "has_results_table": false,
  "results_table": [{"positie": "P1", "rijder": "naam", "team": "team", "tijd": "1:23.456"}],
  "faq": [
    {"q": "Specifieke vraag die een lezer over dit onderwerp zou googlen?", "a": "Direct, informatief antwoord in 2-3 zinnen met concrete details."},
    {"q": "Tweede specifieke vraag?", "a": "Antwoord met feitelijke informatie en context."},
    {"q": "Derde vraag over kartingtechniek of kampioenschap?", "a": "Antwoord met kartingexpertise."}
  ],
  "circuit": "Volledige naam van het circuit of de locatie (bijv. 'De Landsard, Eersel' of 'Circuit Park Berghem, Oss'). Leid dit af uit de Facebook-tekst én de foto's. Laat leeg als het circuit echt niet te bepalen is.",
  "cta": "Afsluitende alinea — enthousiast en persoonlijk, oproep tot actie, met 1 relevante interne link als HTML-anker",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7"],
  "image_seo": [
    VERPLICHT: één volledig ingevuld object PER geupload foto — evenveel als het aantal bestandsnamen hierboven. Alle 5 velden (seo_name, alt, title, caption, description) MOETEN ingevuld zijn voor ELKE foto. Nooit een veld leeg laten.
    {
      "original": "exact-originele-bestandsnaam.jpg",
      "seo_name": "levy-opbergen-[unieke-beschrijving-van-wat-ik-zie-op-deze-specifieke-foto]-2026.jpg",
      "alt": "Levy Opbergen [concrete beschrijving van actie/locatie/moment op deze foto]",
      "title": "Korte beschrijvende titel van wat er op de foto te zien is",
      "caption": "Bijschrift: concrete omschrijving van het moment, locatie en context op de foto",
      "description": "Volledige SEO-beschrijving: wat er te zien is, waar, wanneer en de betekenis voor Levy's seizoen"
    },
    {
      "original": "tweede-bestandsnaam.jpg",
      "seo_name": "levy-opbergen-[andere-unieke-beschrijving-van-foto-2]-2026.jpg",
      "alt": "Levy Opbergen [beschrijving foto 2]",
      "title": "Titel foto 2",
      "caption": "Bijschrift foto 2",
      "description": "Beschrijving foto 2"
    }
  ],
  "video_seo": [
    VERPLICHT: één volledig ingevuld object PER geüploade video — evenveel als het aantal videobestandsnamen hierboven. Alle 4 velden (seo_name, title, caption, description) MOETEN ingevuld zijn voor ELKE video. Nooit een veld leeg laten.
    {
      "original": "exact-originele-videobestandsnaam.mp4",
      "seo_name": "levy-opbergen-[korte-context-uit-facebooktekst]-2026.mp4",
      "title": "Korte beschrijvende videotitel",
      "caption": "Bijschrift: concrete omschrijving van de video en context",
      "description": "Volledige SEO-beschrijving: wat deze video waarschijnlijk toont, waar dit bij hoort en waarom het relevant is voor Levy's seizoen"
    }
  ]
}
PROMPT;
}

endif; // vsgfb_default_prompt

// =============================================================================
// 1b. LINK HELPER
// =============================================================================

if ( ! function_exists( 'vsgfb_process_links' ) ) :
function vsgfb_process_links( string $html ): string {
	if ( ! $html ) return $html;
	return preg_replace_callback(
		'/<a\b([^>]*)>/i',
		function ( $m ) {
			$attrs = $m[1];
			/* Only touch external hrefs — not vsgtalent.nl */
			if ( preg_match( '/href=["\']https?:\/\/(?!(?:www\.)?vsgtalent\.nl)/i', $attrs ) ) {
				if ( strpos( $attrs, 'target=' ) === false ) {
					$attrs .= ' target="_blank" rel="noopener noreferrer"';
				}
			}
			return '<a' . $attrs . '>';
		},
		$html
	);
}
endif; // vsgfb_process_links

if ( ! function_exists( 'vsgfb_get_attachment_public_url' ) ) :
function vsgfb_get_attachment_public_url( int $attachment_id ): string {
	$attachment_id = (int) $attachment_id;
	if ( ! $attachment_id ) {
		return '';
	}

	$upload_dir = wp_get_upload_dir();
	$base_url   = trailingslashit( $upload_dir['baseurl'] ?? '' );

	// Prefer attachment metadata because it reflects the canonical uploads path
	// even when the absolute file path on disk has been renamed or normalized.
	$meta = wp_get_attachment_metadata( $attachment_id );
	if ( ! empty( $meta['file'] ) && $base_url ) {
		$relative = ltrim( str_replace( DIRECTORY_SEPARATOR, '/', (string) $meta['file'] ), '/\\' );
		return esc_url_raw( $base_url . $relative );
	}

	$file = get_attached_file( $attachment_id );
	if ( $file ) {
		$base_dir = trailingslashit( $upload_dir['basedir'] ?? '' );

		if ( $base_dir && $base_url && strpos( $file, $base_dir ) === 0 ) {
			$relative = ltrim( substr( $file, strlen( $base_dir ) ), '/\\' );
			$relative = str_replace( DIRECTORY_SEPARATOR, '/', $relative );
			return esc_url_raw( $base_url . $relative );
		}
	}

	return esc_url_raw( wp_get_attachment_url( $attachment_id ) ?: '' );
}
endif; // vsgfb_get_attachment_public_url

// =============================================================================
// 1c. ALLOWED MEDIA TYPES
// =============================================================================

add_filter( 'upload_mimes', function ( $mimes ) {
	$mimes['mp4']  = 'video/mp4';
	$mimes['m4v']  = 'video/mp4';
	$mimes['mov']  = 'video/quicktime';
	$mimes['webm'] = 'video/webm';
	return $mimes;
} );

// =============================================================================
// 1d. REST API META REGISTRATION
// =============================================================================

add_action( 'init', function () {
	foreach ( [ '_vsgfb_seo_title', '_vsgfb_meta_desc', 'circuit' ] as $key ) {
		register_post_meta( 'post', $key, [
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'string',
			'auth_callback' => '__return_true',
		] );
	}
} );

// =============================================================================
// 2. ADMIN MENU
// =============================================================================

add_action( 'admin_menu', function () {
	add_menu_page(
		'FB Importer',
		'🏎️ FB Importer',
		'manage_options',
		'vsgfb-importer',
		'vsgfb_render_importer_page',
		'dashicons-share',
		31
	);
	add_submenu_page(
		'vsgfb-importer',
		'FB Importer',
		'FB Importer',
		'manage_options',
		'vsgfb-importer',
		'vsgfb_render_importer_page'
	);
	add_submenu_page(
		'vsgfb-importer',
		'Instellingen',
		'Instellingen',
		'manage_options',
		'vsgfb-settings',
		'vsgfb_render_settings_page'
	);
} );

// =============================================================================
// 3. SETTINGS PAGE
// =============================================================================

if ( ! function_exists( 'vsgfb_render_settings_page' ) ) :
function vsgfb_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	if ( isset( $_POST['vsgfb_save'] ) && check_admin_referer( 'vsgfb_settings_nonce' ) ) {
		update_option( VSGFB_KEY_OPTION,    sanitize_text_field( $_POST['vsgfb_api_key']       ?? '' ) );
		update_option( VSGFB_PROMPT_OPTION, sanitize_textarea_field( $_POST['vsgfb_prompt']    ?? '' ) );
		update_option( VSGFB_LINKS_OPTION,  sanitize_textarea_field( $_POST['vsgfb_extra_links'] ?? '' ) );
		update_option( VSGFB_AUTHOR_OPTION, intval( $_POST['vsgfb_default_author'] ?? 0 ) );
		echo '<div class="notice notice-success is-dismissible"><p>✅ Instellingen opgeslagen.</p></div>';
	}
	if ( isset( $_POST['vsgfb_reset_prompt'] ) && check_admin_referer( 'vsgfb_settings_nonce' ) ) {
		delete_option( VSGFB_PROMPT_OPTION );
		echo '<div class="notice notice-success is-dismissible"><p>✅ Prompt gereset naar standaard.</p></div>';
	}
	$key            = get_option( VSGFB_KEY_OPTION, '' );
	$prompt         = get_option( VSGFB_PROMPT_OPTION, vsgfb_default_prompt() );
	$extra_links    = get_option( VSGFB_LINKS_OPTION, '' );
	$saved_author   = intval( get_option( VSGFB_AUTHOR_OPTION, 0 ) );
	$all_users      = get_users( [ 'orderby' => 'display_name', 'order' => 'ASC' ] );
	?>
	<div class="wrap">
		<h1>⚙️ Importer Instellingen</h1>
		<form method="post">
			<?php wp_nonce_field( 'vsgfb_settings_nonce' ); ?>
			<table class="form-table">
				<tr>
					<th><label for="vsgfb_api_key">OpenAI API Key</label></th>
					<td>
						<input type="password" id="vsgfb_api_key" name="vsgfb_api_key"
						       value="<?php echo esc_attr( $key ); ?>" class="regular-text" autocomplete="off">
						<p class="description">Begint met <code>sk-…</code> — zie <a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com</a></p>
					</td>
				</tr>
				<tr>
					<th><label for="vsgfb_default_author">Standaard auteur</label></th>
					<td>
						<select id="vsgfb_default_author" name="vsgfb_default_author">
							<option value="0">— huidig ingelogde gebruiker —</option>
							<?php foreach ( $all_users as $u ) : ?>
							<option value="<?php echo $u->ID; ?>" <?php selected( $saved_author, $u->ID ); ?>>
								<?php echo esc_html( $u->display_name ); ?> (<?php echo esc_html( $u->user_login ); ?>)
							</option>
							<?php endforeach; ?>
						</select>
						<p class="description">De auteur die op gepubliceerde posts wordt gezet. Selecteer “Ray” voor de juiste weergave op de website.</p>
					</td>
				</tr>
				<tr>
					<th><label for="vsgfb_extra_links">Extra links (optioneel)</label></th>
					<td>
						<textarea id="vsgfb_extra_links" name="vsgfb_extra_links"
						          rows="7" class="large-text"><?php echo esc_textarea( $extra_links ); ?></textarea>
						<p class="description">
							Interne of externe links die de AI kan gebruiken wanneer relevant.<br>
							Formaat: één per regel → <code>Naam of omschrijving: https://url.nl</code><br>
							Voorbeeld:<br>
							<code>Karting Nederland: https://www.kartingnederland.nl</code><br>
							<code>KNAF kartingreglement: https://www.knaf.nl/motorsport/karting</code>
						</p>
					</td>
				</tr>
				<tr>
					<th><label for="vsgfb_prompt">AI Herschrijf Prompt</label></th>
					<td>
						<textarea id="vsgfb_prompt" name="vsgfb_prompt"
						          rows="30" class="large-text code"><?php echo esc_textarea( $prompt ); ?></textarea>
						<p class="description">
							Variabelen: <code>{EXISTING_POSTS}</code> <code>{SPONSORS}</code> <code>{EVENTS}</code>
							<code>{EXTRA_LINKS}</code> <code>{IMAGE_NAMES}</code> <code>{POST_TEXT}</code>
						</p>
					</td>
				</tr>
			</table>
			<p>
				<button type="submit" name="vsgfb_save" class="button button-primary">💾 Opslaan</button>
				&nbsp;
				<button type="submit" name="vsgfb_reset_prompt" class="button"
				        onclick="return confirm('Prompt resetten naar standaard?')">↩ Reset prompt</button>
			</p>
		</form>
	</div>
	<?php
}

endif; // vsgfb_render_settings_page

// =============================================================================
// 4. IMPORTER PAGE
// =============================================================================

if ( ! function_exists( 'vsgfb_render_importer_page' ) ) :
function vsgfb_render_importer_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$categories    = get_categories( [ 'hide_empty' => false ] );
	$all_posts     = get_posts( [ 'post_type' => 'post', 'post_status' => 'publish,draft', 'posts_per_page' => 100, 'orderby' => 'date', 'order' => 'DESC' ] );
	$js_config  = wp_json_encode( [
		'ajaxUrl'        => admin_url( 'admin-ajax.php' ),
		'nonce'          => wp_create_nonce( 'vsgfb_nonce' ),
		'maxUploadBytes' => wp_max_upload_size(),
		'maxUploadLabel' => size_format( wp_max_upload_size() ),
	] );
	?>
	<div class="wrap" id="vsgfb-app">
	<h1>🏎️ VSGTalent FB Importer</h1>
	<p style="color:#666">Upload afbeeldingen → plak Facebook tekst → AI herschrijft SEO-geoptimaliseerd → publiceer direct.</p>

	<style>
	#vsgfb-app { max-width: 1060px; }
	.vsgfb-card { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
	.vsgfb-card h2 { margin: 0 0 14px; font-size: 1.05em; color: #1d2327; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px; }
	#vsgfb-drop-zone { border: 3px dashed #b0b0b0; border-radius: 8px; padding: 36px; text-align: center; cursor: pointer; color: #555; background: #fafafa; transition: .2s; }
	#vsgfb-drop-zone:hover, #vsgfb-drop-zone.dragover { border-color: #2271b1; background: #f0f6fc; color: #2271b1; }
	#vsgfb-thumbnails { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
	.vsgfb-thumb { position:relative; width:90px; height:90px; border-radius:6px; overflow:hidden; border:2px solid transparent; background:#eee; cursor:grab; }
	.vsgfb-thumb.featured { border-color:#2271b1; }
	.vsgfb-thumb.video { background:#1d2327; color:#fff; }
	.vsgfb-video-icon { height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; padding:8px; text-align:center; box-sizing:border-box; }
	.vsgfb-video-icon strong { font-size:24px; line-height:1; }
	.vsgfb-video-icon span { max-width:74px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:10px; opacity:.9; }
	.vsgfb-thumb.dragging  { opacity:.35; }
	.vsgfb-thumb.drag-over { border-color:#f0a500; box-shadow:0 0 0 2px #f0a500; }
	.vsgfb-thumb label { display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 11px; margin-top: 5px; cursor: pointer; color: #444; }
	.vsgfb-thumb .vsgfb-remove { position: absolute; top: 3px; right: 3px; background: rgba(200,0,0,.75); color: #fff; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 13px; line-height: 20px; padding: 0; text-align: center; }
	.vsgfb-uploading { position: absolute; inset: 0; background: rgba(255,255,255,.8); display: flex; align-items: center; justify-content: center; border-radius: 5px; font-size: 20px; }
	#vsgfb-post-text { width: 100%; min-height: 140px; font-size: 14px; resize: vertical; }
	.vsgfb-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; }
	.vsgfb-field { margin-bottom: 14px; }
	.vsgfb-field label { display: block; font-weight: 600; margin-bottom: 4px; font-size: 13px; }
	.vsgfb-field input[type=text], .vsgfb-field textarea, .vsgfb-field select { width: 100%; font-size: 13px; }
	.vsgfb-field textarea { min-height: 100px; resize: vertical; }
	.vsgfb-char { font-weight: normal; color: #888; font-size: 12px; margin-left: 6px; }
	#vsgfb-btn-rewrite { background: #2271b1; color: #fff; border: none; border-radius: 5px; padding: 10px 22px; font-size: 14px; font-weight: 600; cursor: pointer; }
	#vsgfb-btn-rewrite:disabled { opacity: .55; cursor: not-allowed; }
	#vsgfb-btn-publish { background: #00a32a; color: #fff; border: none; border-radius: 5px; padding: 12px 28px; font-size: 15px; font-weight: 700; cursor: pointer; }
	#vsgfb-btn-publish:disabled { opacity: .55; cursor: not-allowed; }
	.vsgfb-status { display: none; padding: 10px 14px; border-radius: 5px; margin: 10px 0; font-size: 13px; }
	.vsgfb-status.info { background: #ddeeff; color: #0a5080; }
	.vsgfb-status.ok   { background: #d4edda; color: #155724; }
	.vsgfb-status.err  { background: #f8d7da; color: #721c24; }
	#vsgfb-preview { display: none; }
	.vsgfb-img-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
	.vsgfb-img-tbl th { background: #f0f0f1; padding: 6px 8px; text-align: left; font-size: 12px; }
	.vsgfb-img-tbl td { padding: 5px 8px; border-bottom: 1px solid #eee; vertical-align: middle; }
	.vsgfb-img-tbl td img { width: 48px; height: 36px; object-fit: cover; border-radius: 3px; display: block; }
	.vsgfb-img-tbl td input { width: 100%; font-size: 12px; }
	.vsgfb-faq-item { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; padding: 8px; background: #f9f9f9; border-radius: 4px; }
	.vsgfb-faq-item input, .vsgfb-faq-item textarea { font-size: 12px; width: 100%; }
	.vsgfb-sep { margin: 20px 0; border: none; border-top: 1px solid #eee; }
	.vsgfb-tabs { display: flex; gap: 0; margin-bottom: 20px; border-radius: 7px; overflow: hidden; border: 1px solid #2271b1; width: fit-content; }
	.vsgfb-tabs button { padding: 9px 22px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; background: #fff; color: #2271b1; transition: .15s; }
	.vsgfb-tabs button.active { background: #2271b1; color: #fff; }
	.vsgfb-tabs button:not(.active):hover { background: #f0f6fc; }
	#vsgfb-existing-card { display: none; }
	.vsgfb-publish-mode { display: none; margin-bottom: 14px; padding: 12px 14px; background: #fff8e5; border: 1px solid #f0c842; border-radius: 5px; font-size: 13px; }
	.vsgfb-publish-mode label { font-weight: 600; display: block; margin-bottom: 6px; }
	.vsgfb-publish-mode select { font-size: 13px; }
	</style>

	<!-- TABS -->
	<div class="vsgfb-tabs">
		<button id="tab-new" class="active" onclick="vsgfbTab('new')">✨ Nieuwe post</button>
		<button id="tab-existing" onclick="vsgfbTab('existing')">🔄 Bestaande post optimaliseren</button>
	</div>

	<!-- BESTAANDE POST LADEN -->
	<div class="vsgfb-card" id="vsgfb-existing-card">
		<h2>🔄 Bestaande post laden</h2>
		<div class="vsgfb-row">
			<div class="vsgfb-field">
				<label>Kies een post om te optimaliseren</label>
				<select id="vsgfb-existing-select">
					<option value="">— selecteer een post —</option>
					<?php foreach ( $all_posts as $ep ) : ?>
					<option value="<?php echo $ep->ID; ?>"><?php echo esc_html( $ep->post_title ); ?> (<?php echo $ep->post_status; ?>)</option>
					<?php endforeach; ?>
				</select>
			</div>
			<div class="vsgfb-field" style="display:flex;align-items:flex-end">
				<button class="button button-secondary" onclick="vsgfbLoadPost()" id="vsgfb-btn-load">📂 Post laden</button>
			</div>
		</div>
		<p style="margin:4px 0 0;font-size:12px;color:#888">De originele tekst en afbeeldingen worden ingeladen. Daarna herschrijf je alles met AI.</p>
	</div>

	<!-- STAP 1: MEDIA -->
	<div class="vsgfb-card">
		<h2>📸 Stap 1 — Media uploaden</h2>
		<div id="vsgfb-drop-zone" onclick="document.getElementById('vsgfb-file-inp').click()">
			<input type="file" id="vsgfb-file-inp" multiple accept="image/*,video/*" style="display:none">
			<div style="font-size:36px;margin-bottom:8px">📁</div>
			<strong>Klik of sleep foto's en video's hierheen</strong>
			<p style="margin:4px 0 0;font-size:13px;color:#888">JPG · PNG · WebP · MP4 · MOV · WebM — meerdere tegelijk mogelijk</p>
		</div>
		<div id="vsgfb-thumbnails"></div>
		<div class="vsgfb-status info" id="vsgfb-media-notice" style="display:none;margin-top:14px"></div>
	</div>

	<!-- STAP 2: TEKST -->
	<div class="vsgfb-card">
		<h2>📝 Stap 2 — Facebook tekst plakken</h2>
		<textarea id="vsgfb-post-text" placeholder="Kopieer en plak hier de tekst van de Facebook post…"></textarea>
	</div>

	<!-- STAP 3: OPTIES -->
	<div class="vsgfb-card">
		<h2>⚙️ Stap 3 — Opties</h2>
		<div class="vsgfb-row">
			<div class="vsgfb-field">
				<label>Categorie</label>
				<select id="vsgfb-cat">
					<?php foreach ( $categories as $c ) : ?>
					<option value="<?php echo $c->term_id; ?>"><?php echo esc_html( $c->name ); ?></option>
					<?php endforeach; ?>
				</select>
			</div>
			<div class="vsgfb-field">
				<label>Publicatiestatus</label>
				<select id="vsgfb-pub-status">
					<option value="publish">Direct publiceren</option>
					<option value="draft">Opslaan als concept</option>
				</select>
			</div>
		</div>
		<div class="vsgfb-field" style="margin-top:14px">
			<label>Publicatiedatum <span style="font-weight:normal;font-size:12px;color:#888">(leeg = vandaag)</span></label>
			<input type="date" id="vsgfb-post-date" value="<?php echo date('Y-m-d'); ?>" style="font-size:13px">
		</div>
	</div>

	<!-- HERSCHRIJVEN -->
	<div class="vsgfb-card">
		<div class="vsgfb-status" id="vsgfb-status"></div>
		<button id="vsgfb-btn-rewrite" onclick="vsgfbRewrite()">✨ Herschrijven met AI</button>
		<span style="margin-left:12px;font-size:12px;color:#888">Kan 30–60 seconden duren</span>
	</div>

	<!-- STAP 4: PREVIEW -->
	<div class="vsgfb-card" id="vsgfb-preview">
		<h2>👁️ Stap 4 — Preview &amp; bewerken</h2>

		<div class="vsgfb-row">
			<div class="vsgfb-field">
				<label>SEO Titel <span class="vsgfb-char" id="cnt-title"></span></label>
				<input type="text" id="vsgfb-title" maxlength="80" oninput="vsgfbCount(this,'cnt-title',60)">
			</div>
			<div class="vsgfb-field">
				<label>URL Slug</label>
				<input type="text" id="vsgfb-slug">
			</div>
		</div>

		<div class="vsgfb-field">
			<label>Meta Description <span class="vsgfb-char" id="cnt-meta"></span></label>
			<input type="text" id="vsgfb-meta" maxlength="200" oninput="vsgfbCount(this,'cnt-meta',155)">
		</div>

		<div class="vsgfb-field">
			<label>Excerpt <span style="font-weight:normal;font-size:12px;color:#888">(archiefpagina)</span></label>
			<textarea id="vsgfb-excerpt" rows="2"></textarea>
		</div>

		<div class="vsgfb-field">
			<label>Key Takeaways <span style="font-weight:normal;font-size:12px;color:#888">(3 punten — één per regel)</span></label>
			<textarea id="vsgfb-takeaways" rows="3"></textarea>
		</div>

		<div class="vsgfb-field">
			<label>Posttekst (HTML)</label>
			<textarea id="vsgfb-body" rows="16"></textarea>
		</div>

		<div class="vsgfb-field">
			<label>FAQ (3 vragen)</label>
			<div id="vsgfb-faq-wrap"></div>
		</div>

		<div class="vsgfb-field">
			<label>CTA-alinea</label>
			<textarea id="vsgfb-cta" rows="3"></textarea>
		</div>

		<div class="vsgfb-field">
			<label>Tags <span style="font-weight:normal;font-size:12px;color:#888">(komma-gescheiden)</span></label>
			<input type="text" id="vsgfb-tags">
		</div>

		<div class="vsgfb-field">
			<label>Afbeelding SEO-namen &amp; alt tags</label>
			<table class="vsgfb-img-tbl">
				<thead><tr><th>Afb</th><th>SEO bestandsnaam</th><th>Alt tag</th><th>Titel</th><th>Bijschrift</th><th>Beschrijving</th></tr></thead>
				<tbody id="vsgfb-img-seo-tbody"></tbody>
			</table>
		</div>

		<div class="vsgfb-field">
			<label>Video SEO-namen &amp; metadata</label>
			<table class="vsgfb-img-tbl">
				<thead><tr><th>Video</th><th>SEO bestandsnaam</th><th>Titel</th><th>Bijschrift</th><th>Beschrijving</th></tr></thead>
				<tbody id="vsgfb-video-seo-tbody"></tbody>
			</table>
		</div>

		<input type="hidden" id="vsgfb-has-table" value="false">
		<input type="hidden" id="vsgfb-table-data" value="[]">
		<input type="hidden" id="vsgfb-circuit" value="">
		<input type="hidden" id="vsgfb-update-post-id" value="">

		<hr class="vsgfb-sep">
		<div class="vsgfb-publish-mode" id="vsgfb-publish-mode-wrap">
			<label>Publicatie-modus</label>
			<select id="vsgfb-publish-mode">
				<option value="update">✏️ Bestaande post updaten (vervangt origineel)</option>
				<option value="new">➕ Nieuwe post aanmaken (origineel blijft behouden)</option>
			</select>
		</div>
		<button id="vsgfb-btn-publish" onclick="vsgfbPublish()">🚀 Publiceer op website</button>
	</div>

	</div><!-- #vsgfb-app -->

	<script>
	var VSGFB = <?php echo $js_config; ?>;
	VSGFB.images     = [];
	VSGFB.videos     = [];
	VSGFB.featuredId = null;
	VSGFB.mode       = 'new'; // 'new' | 'existing'
	VSGFB.loadedPostId = 0;

	/* ── TAB SWITCHING ───────────────────────── */
	function vsgfbTab(mode) {
		VSGFB.mode = mode;
		document.getElementById('tab-new').classList.toggle('active',      mode === 'new');
		document.getElementById('tab-existing').classList.toggle('active', mode === 'existing');
		document.getElementById('vsgfb-existing-card').style.display = mode === 'existing' ? 'block' : 'none';
		var modeWrap = document.getElementById('vsgfb-publish-mode-wrap');
		if (modeWrap) modeWrap.style.display = mode === 'existing' ? 'block' : 'none';
		if (mode === 'new') {
			VSGFB.loadedPostId = 0;
			document.getElementById('vsgfb-update-post-id').value = '';
		}
	}

	/* ── LOAD EXISTING POST ────────────────────── */
	function vsgfbLoadPost() {
		var sel    = document.getElementById('vsgfb-existing-select');
		var postId = sel ? sel.value : '';
		if (!postId) { vsgfbStatus('Selecteer eerst een post.', 'err'); return; }
		var btn = document.getElementById('vsgfb-btn-load');
		btn.disabled = true; btn.textContent = '⏳ Laden…';
		vsgfbStatus('Post ophalen…', 'info');
		fetch(VSGFB.ajaxUrl, {
			method:  'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body:    new URLSearchParams({ action: 'vsgfb_load_post', nonce: VSGFB.nonce, post_id: postId })
		})
		.then(function (r) { return r.json(); })
		.then(function (resp) {
			btn.disabled = false; btn.textContent = '📂 Post laden';
			if (!resp.success) { vsgfbStatus('❌ ' + (resp.data.message || 'Fout'), 'err'); return; }
			var d = resp.data;
			/* Prefill text area */
			document.getElementById('vsgfb-post-text').value = d.content || '';
			/* Set category */
			if (d.category_id) {
				var catSel = document.getElementById('vsgfb-cat');
				if (catSel) { for (var i=0; i<catSel.options.length; i++) { if (catSel.options[i].value == d.category_id) { catSel.selectedIndex = i; break; } } }
			}
			/* Load existing media */
			VSGFB.images = [];
			VSGFB.videos = [];
			VSGFB.featuredId = null;
			document.getElementById('vsgfb-thumbnails').innerHTML = '';
			if (d.images && d.images.length) {
				d.images.forEach(function (img, i) {
					VSGFB.images.push({ id: img.id, url: img.url, thumb: img.thumb, filename: img.filename });
					vsgfbAddThumb(img.id, img.thumb, img.filename, false, 'image');
					var el = document.getElementById('vt_' + img.id);
					if (el) {
						el.dataset.imgId = img.id;
						el.dataset.mediaId = img.id;
						el.dataset.mediaType = 'image';
						el.querySelector('.vsgfb-radio').value = img.id;
					}
					if (i === 0) {
						VSGFB.featuredId = img.id;
						if (el) { el.classList.add('featured'); el.querySelector('.vsgfb-radio').checked = true; }
					}
				});
			}
			if (d.videos && d.videos.length) {
				d.videos.forEach(function (vid) {
					VSGFB.videos.push({ id: vid.id, url: vid.url, thumb: vid.thumb, filename: vid.filename });
					vsgfbAddThumb(vid.id, vid.thumb || '', vid.filename, false, 'video');
					var el = document.getElementById('vt_' + vid.id);
					if (el) {
						el.dataset.mediaId = vid.id;
						el.dataset.mediaType = 'video';
					}
				});
			}
			vsgfbUpdateMediaNotice();
			/* Store post ID for update */
			VSGFB.loadedPostId = d.post_id;
			document.getElementById('vsgfb-update-post-id').value = d.post_id;
			/* Pre-fill original publish date so it is preserved on re-publish */
			if (d.post_date) {
				var dateEl = document.getElementById('vsgfb-post-date');
				if (dateEl) { dateEl.value = d.post_date; }
			}
			/* Force publish mode to update so re-optimising never accidentally creates a duplicate */
			var modeSelect = document.getElementById('vsgfb-publish-mode');
			if (modeSelect) { modeSelect.value = 'update'; }
			vsgfbStatus('✅ Post geladen: "' + d.title + '" — pas de tekst aan en klik Herschrijven met AI.', 'ok');
		})
		.catch(function (e) { btn.disabled = false; btn.textContent = '📂 Post laden'; vsgfbStatus('❌ Fout: ' + e.message, 'err'); });
	}

	/* ── DRAG & DROP ─────────────────────────────────────── */
	(function () {
		var dz = document.getElementById('vsgfb-drop-zone');
		var fi = document.getElementById('vsgfb-file-inp');
		dz.addEventListener('dragover',  function (e) { e.preventDefault(); dz.classList.add('dragover'); });
		dz.addEventListener('dragleave', function ()  { dz.classList.remove('dragover'); });
		dz.addEventListener('drop', function (e) {
			e.preventDefault(); dz.classList.remove('dragover');
			vsgfbUploadFiles(e.dataTransfer.files);
		});
		fi.addEventListener('change', function () { vsgfbUploadFiles(fi.files); fi.value = ''; });
	})();

	function vsgfbUploadFiles(files) {
		Array.from(files).forEach(function (file) {
			var isImage = file.type.startsWith('image/');
			var isVideo = file.type.startsWith('video/');
			if (!isImage && !isVideo) return;
			if (VSGFB.maxUploadBytes && file.size > VSGFB.maxUploadBytes) {
				vsgfbStatus('❌ "' + vsgfbEsc(file.name) + '" is te groot. Uploadlimiet op deze site: ' + VSGFB.maxUploadLabel + '.', 'err');
				return;
			}
			var tid = 'tmp_' + Date.now() + '_' + Math.floor(Math.random() * 99999);
			vsgfbAddThumb(tid, isImage ? URL.createObjectURL(file) : '', file.name, true, isVideo ? 'video' : 'image');
			var fd = new FormData();
			fd.append('action', 'vsgfb_upload_image');
			fd.append('nonce',  VSGFB.nonce);
			fd.append('file',   file);
			fetch(VSGFB.ajaxUrl, { method: 'POST', body: fd })
				.then(function (r) { return r.json(); })
				.then(function (resp) {
					var el = document.getElementById('vt_' + tid);
					if (!resp.success) {
						if (el) el.remove();
						vsgfbStatus('❌ Upload mislukt voor "' + vsgfbEsc(file.name) + '": ' + ((resp.data && resp.data.message) ? resp.data.message : 'onbekende fout'), 'err');
						vsgfbUpdateMediaNotice();
						return;
					}
					var d = resp.data;
					var mediaType = d.type === 'video' ? 'video' : 'image';
					if (el) {
						el.dataset.imgId = d.id;
						el.dataset.mediaId = d.id;
						el.dataset.mediaType = mediaType;
						var ov = el.querySelector('.vsgfb-uploading');
						if (ov) ov.remove();
						var img = el.querySelector('img');
						if (img) img.src = d.thumb;
						var radio = el.querySelector('.vsgfb-radio');
						if (radio) radio.value = d.id;
					}
					if (mediaType === 'video') {
						VSGFB.videos.push({ id: d.id, url: d.url, thumb: d.thumb, filename: d.filename });
						vsgfbUpdateMediaNotice();
						return;
					}
					VSGFB.images.push({ id: d.id, url: d.url, thumb: d.thumb, filename: d.filename });
					if (VSGFB.images.length === 1 && !VSGFB.featuredId) {
						VSGFB.featuredId = d.id;
						if (el) { el.classList.add('featured'); el.querySelector('.vsgfb-radio').checked = true; }
					}
					vsgfbUpdateMediaNotice();
				})
				.catch(function () {
					var el = document.getElementById('vt_' + tid);
					if (el) el.remove();
					vsgfbStatus('❌ Upload mislukt voor "' + vsgfbEsc(file.name) + '".', 'err');
					vsgfbUpdateMediaNotice();
				});
		});
	}

	var vsgfbDragSrc = null;

	function vsgfbAddThumb(tid, src, name, uploading, mediaType) {
		var wrap = document.getElementById('vsgfb-thumbnails');
		var div  = document.createElement('div');
		mediaType          = mediaType === 'video' ? 'video' : 'image';
		div.className      = 'vsgfb-thumb ' + mediaType;
		div.id             = 'vt_' + tid;
		div.draggable      = true;
		div.dataset.imgId  = String(tid);
		div.dataset.mediaId = String(tid);
		div.dataset.mediaType = mediaType;
		if (mediaType === 'video') {
			div.innerHTML =
				'<div class="vsgfb-video-icon"><strong>🎬</strong><span>' + vsgfbEsc(name) + '</span></div>' +
				(uploading ? '<div class="vsgfb-uploading">⏳</div>' : '') +
				'<button class="vsgfb-remove" onclick="vsgfbRemoveImg(\'' + tid + '\')" type="button">×</button>';
		} else {
			div.innerHTML =
				'<img src="' + src + '" alt="' + vsgfbEsc(name) + '">' +
				(uploading ? '<div class="vsgfb-uploading">⏳</div>' : '') +
				'<button class="vsgfb-remove" onclick="vsgfbRemoveImg(\'' + tid + '\')" type="button">×</button>' +
				'<label><input type="radio" name="vsgfb_feat" class="vsgfb-radio" value="' + tid + '" ' +
				'onchange="vsgfbSetFeatured(this,\'' + tid + '\')"> Featured</label>';
		}

		div.addEventListener('dragstart', function (e) {
			vsgfbDragSrc = this;
			e.dataTransfer.effectAllowed = 'move';
			setTimeout(function () { div.classList.add('dragging'); }, 0);
		});
		div.addEventListener('dragend', function () {
			document.querySelectorAll('.vsgfb-thumb').forEach(function (t) {
				t.classList.remove('dragging', 'drag-over');
			});
			vsgfbDragSrc = null;
		});
		div.addEventListener('dragover', function (e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'move';
			if (vsgfbDragSrc && vsgfbDragSrc !== this) { this.classList.add('drag-over'); }
		});
		div.addEventListener('dragleave', function () { this.classList.remove('drag-over'); });
		div.addEventListener('drop', function (e) {
			e.preventDefault();
			this.classList.remove('drag-over');
			if (!vsgfbDragSrc || vsgfbDragSrc === this) return;
			var w    = document.getElementById('vsgfb-thumbnails');
			var kids = Array.from(w.children);
			var si   = kids.indexOf(vsgfbDragSrc);
			var di   = kids.indexOf(this);
			if (si < di) { w.insertBefore(vsgfbDragSrc, this.nextSibling); }
			else         { w.insertBefore(vsgfbDragSrc, this); }
			vsgfbSyncMediaOrder();
		});

		wrap.appendChild(div);
	}

	function vsgfbSetFeatured(radio, tid) {
		document.querySelectorAll('.vsgfb-thumb').forEach(function (t) { t.classList.remove('featured'); });
		radio.closest('.vsgfb-thumb').classList.add('featured');
		VSGFB.featuredId = radio.value;
	}

	function vsgfbRemoveImg(tid) {
		var el    = document.getElementById('vt_' + tid);
		if (!el) return;
		var mediaId = el.dataset.mediaId || el.dataset.imgId;
		VSGFB.images = VSGFB.images.filter(function (i) { return String(i.id) !== String(mediaId); });
		VSGFB.videos = VSGFB.videos.filter(function (i) { return String(i.id) !== String(mediaId); });
		if (String(VSGFB.featuredId) === String(mediaId)) VSGFB.featuredId = null;
		el.remove();
		vsgfbUpdateMediaNotice();
	}

	function vsgfbSyncMediaOrder() {
		var w = document.getElementById('vsgfb-thumbnails');
		var kids = Array.from(w.children);
		VSGFB.images = kids.filter(function (el) {
			return el.dataset.mediaType === 'image';
		}).map(function (el) {
			var mediaId = el.dataset.mediaId || el.dataset.imgId;
			return VSGFB.images.find(function (i) { return String(i.id) === String(mediaId); });
		}).filter(Boolean);
		VSGFB.videos = kids.filter(function (el) {
			return el.dataset.mediaType === 'video';
		}).map(function (el) {
			var mediaId = el.dataset.mediaId || el.dataset.imgId;
			return VSGFB.videos.find(function (i) { return String(i.id) === String(mediaId); });
		}).filter(Boolean);
		vsgfbUpdateMediaNotice();
	}

	function vsgfbUpdateMediaNotice() {
		var el = document.getElementById('vsgfb-media-notice');
		if (!el) return;
		if (VSGFB.videos.length > 0 && VSGFB.images.length === 0) {
			el.innerHTML = '⚠️ Je hebt alleen video geselecteerd. Upload ook minimaal 1 foto als uitgelichte afbeelding voor nieuwskaarten en social previews.';
			el.style.display = 'block';
			return;
		}
		if (VSGFB.maxUploadLabel) {
			el.innerHTML = 'Uploadlimiet op deze site: ' + VSGFB.maxUploadLabel + ' per bestand.';
			el.style.display = 'block';
			return;
		}
		el.style.display = 'none';
	}

	/* ── HELPERS ──────────────────────────────────────────── */
	function vsgfbCount(el, cntId, max) {
		var n   = el.value.length;
		var cnt = document.getElementById(cntId);
		cnt.textContent = '(' + n + '/' + max + ')';
		cnt.style.color = n > max ? '#d63638' : '#888';
	}

	function vsgfbStatus(msg, type) {
		var el = document.getElementById('vsgfb-status');
		el.innerHTML   = msg;
		el.className   = 'vsgfb-status ' + type;
		el.style.display = 'block';
	}

	function vsgfbEsc(s) {
		return String(s || '')
			.replace(/&/g, '&amp;').replace(/</g, '&lt;')
			.replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	/* ── REWRITE ──────────────────────────────────────────── */
	function vsgfbRewrite() {
		var text = document.getElementById('vsgfb-post-text').value.trim();
		if (!text) { vsgfbStatus('❌ Plak eerst de Facebook-posttekst.', 'err'); return; }
		if (VSGFB.videos.length > 0 && VSGFB.images.length === 0) {
			vsgfbStatus('⚠️ Je hebt alleen video geüpload. Dat kan, maar upload liever ook 1 foto voor de uitgelichte afbeelding.', 'info');
		}
		var btn = document.getElementById('vsgfb-btn-rewrite');
		btn.disabled    = true;
		btn.textContent = '⏳ AI is aan het schrijven…';
		vsgfbStatus('🔍 Context ophalen en post herschrijven… (30–60 sec)', 'info');

		fetch(VSGFB.ajaxUrl, {
			method:  'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body:    new URLSearchParams({
				action:      'vsgfb_rewrite',
				nonce:       VSGFB.nonce,
				post_text:   text,
				image_ids:   JSON.stringify(VSGFB.images.map(function (i) { return i.id; })),
				video_ids:   JSON.stringify(VSGFB.videos.map(function (i) { return i.id; })),
				category_id: document.getElementById('vsgfb-cat').value
			})
		})
		.then(function (r) { return r.json(); })
		.then(function (resp) {
			btn.disabled    = false;
			btn.textContent = '✨ Herschrijven met AI';
			if (!resp.success) {
				vsgfbStatus('❌ ' + ((resp.data && resp.data.message) ? resp.data.message : 'Onbekende fout'), 'err');
				return;
			}
			vsgfbPopulate(resp.data);
			vsgfbStatus('✅ Post herschreven! Controleer de preview hieronder en publiceer.', 'ok');
		})
		.catch(function (e) {
			btn.disabled    = false;
			btn.textContent = '✨ Herschrijven met AI';
			vsgfbStatus('❌ Netwerkfout: ' + e.message, 'err');
		});
	}

	/* ── POPULATE PREVIEW ─────────────────────────────────── */
	function vsgfbPopulate(d) {
		document.getElementById('vsgfb-title').value     = d.title            || '';
		document.getElementById('vsgfb-slug').value      = d.slug             || '';
		document.getElementById('vsgfb-meta').value      = d.meta_description || '';
		document.getElementById('vsgfb-excerpt').value   = d.excerpt          || '';
		document.getElementById('vsgfb-takeaways').value = (d.takeaways || []).join('\n');
		document.getElementById('vsgfb-body').value      = (d.intro ? d.intro + '\n\n' : '') + (d.body_html || '');
		document.getElementById('vsgfb-cta').value       = d.cta              || '';
		document.getElementById('vsgfb-tags').value      = (d.tags || []).join(', ');
		document.getElementById('vsgfb-has-table').value = d.has_results_table ? 'true' : 'false';
		document.getElementById('vsgfb-table-data').value = JSON.stringify(d.results_table || []);
		document.getElementById('vsgfb-circuit').value = d.circuit || '';

		vsgfbCount(document.getElementById('vsgfb-title'), 'cnt-title', 60);
		vsgfbCount(document.getElementById('vsgfb-meta'),  'cnt-meta',  155);

		/* FAQ */
		var fwrap = document.getElementById('vsgfb-faq-wrap');
		fwrap.innerHTML = '';
		(d.faq || []).forEach(function (item, i) {
			var div = document.createElement('div');
			div.className = 'vsgfb-faq-item';
			div.innerHTML =
				'<input  type="text" id="fq_' + i + '" placeholder="Vraag"    value="' + vsgfbEsc(item.q) + '">' +
				'<textarea            id="fa_' + i + '" rows="2" placeholder="Antwoord">' + vsgfbEsc(item.a) + '</textarea>';
			fwrap.appendChild(div);
		});

		/* Image SEO table */
		var tbody   = document.getElementById('vsgfb-img-seo-tbody');
		tbody.innerHTML = '';
		var imageSeo = d.image_seo || [];
		/* Build a slug from title for fallback naming */
		var titleSlug = (d.title || 'levy-opbergen').toLowerCase()
			.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 60);
		VSGFB.images.forEach(function (img, i) {
			var seo = imageSeo.find(function (s) { return s.original === img.filename; }) || imageSeo[i] || {};
			/* Auto-generate fallback if AI didn't fill this image */
			var ext = img.filename.split('.').pop().toLowerCase() || 'jpg';
			var fallbackName = titleSlug + '-foto-' + (i + 1) + '.' + ext;
			var fallbackAlt  = (d.title || 'Levy Opbergen') + ' — foto ' + (i + 1);
			var tr  = document.createElement('tr');
			tr.innerHTML =
				'<td><img src="' + img.thumb + '" alt=""></td>' +
				'<td><input type="text" id="isn_' + img.id + '" value="' + vsgfbEsc(seo.seo_name    || fallbackName) + '"></td>' +
				'<td><input type="text" id="iat_' + img.id + '" value="' + vsgfbEsc(seo.alt         || fallbackAlt)  + '"></td>' +
				'<td><input type="text" id="iti_' + img.id + '" value="' + vsgfbEsc(seo.title       || '')           + '"></td>' +
				'<td><input type="text" id="ica_' + img.id + '" value="' + vsgfbEsc(seo.caption     || '')           + '"></td>' +
				'<td><textarea          id="ide_' + img.id + '" rows="2" style="font-size:12px;width:100%">' + vsgfbEsc(seo.description || '') + '</textarea></td>';
			tbody.appendChild(tr);
		});

		var videoTbody = document.getElementById('vsgfb-video-seo-tbody');
		videoTbody.innerHTML = '';
		var videoSeo = d.video_seo || [];
		VSGFB.videos.forEach(function (vid, i) {
			var seo = videoSeo.find(function (s) { return s.original === vid.filename; }) || videoSeo[i] || {};
			var ext = vid.filename.split('.').pop().toLowerCase() || 'mp4';
			var fallbackName = titleSlug + '-video-' + (i + 1) + '.' + ext;
			var tr = document.createElement('tr');
			tr.innerHTML =
				'<td><div style="display:flex;align-items:center;gap:6px"><div class="vsgfb-video-icon" style="width:44px;height:36px;background:#1d2327;border-radius:3px;color:#fff;flex:none"><strong style="font-size:16px">🎬</strong></div><span style="font-size:11px;color:#555;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + vsgfbEsc(vid.filename) + '</span></div></td>' +
				'<td><input type="text" id="vsn_' + vid.id + '" value="' + vsgfbEsc(seo.seo_name    || fallbackName) + '"></td>' +
				'<td><input type="text" id="vti_' + vid.id + '" value="' + vsgfbEsc(seo.title       || (d.title || 'Levy Opbergen video')) + '"></td>' +
				'<td><input type="text" id="vca_' + vid.id + '" value="' + vsgfbEsc(seo.caption     || '') + '"></td>' +
				'<td><textarea          id="vde_' + vid.id + '" rows="2" style="font-size:12px;width:100%">' + vsgfbEsc(seo.description || '') + '</textarea></td>';
			videoTbody.appendChild(tr);
		});

		document.getElementById('vsgfb-preview').style.display = 'block';
		document.getElementById('vsgfb-preview').scrollIntoView({ behavior: 'smooth' });
	}

	/* ── PUBLISH ──────────────────────────────────────────── */
	function vsgfbPublish() {
		var btn = document.getElementById('vsgfb-btn-publish');
		btn.disabled    = true;
		btn.textContent = '⏳ Publiceren…';
		vsgfbStatus('Post wordt aangemaakt…', 'info');
		if (VSGFB.videos.length > 0 && VSGFB.images.length === 0) {
			vsgfbStatus('⚠️ Publiceren zonder uitgelichte afbeelding. De video komt wel in de galerij, maar nieuwskaarten kunnen leeg ogen.', 'info');
		}

		var faqItems = [];
		document.querySelectorAll('[id^="fq_"]').forEach(function (el) {
			var i = el.id.replace('fq_', '');
			var a = document.getElementById('fa_' + i);
			if (el.value) faqItems.push({ q: el.value, a: a ? a.value : '' });
		});

		var imgSeo = VSGFB.images.map(function (img) {
			return {
				id:          img.id,
				seo_name:    (document.getElementById('isn_' + img.id) || {}).value || '',
				alt:         (document.getElementById('iat_' + img.id) || {}).value || '',
				title:       (document.getElementById('iti_' + img.id) || {}).value || '',
				caption:     (document.getElementById('ica_' + img.id) || {}).value || '',
				description: (document.getElementById('ide_' + img.id) || {}).value || ''
			};
		});

		var videoSeo = VSGFB.videos.map(function (vid) {
			return {
				id:          vid.id,
				seo_name:    (document.getElementById('vsn_' + vid.id) || {}).value || '',
				title:       (document.getElementById('vti_' + vid.id) || {}).value || '',
				caption:     (document.getElementById('vca_' + vid.id) || {}).value || '',
				description: (document.getElementById('vde_' + vid.id) || {}).value || ''
			};
		});

		var pubMode      = (document.getElementById('vsgfb-publish-mode') || {}).value || 'new';
		var updatePostId = document.getElementById('vsgfb-update-post-id').value || '';
		fetch(VSGFB.ajaxUrl, {
			method:  'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body:    new URLSearchParams({
				action:          'vsgfb_publish',
				nonce:           VSGFB.nonce,
				title:           document.getElementById('vsgfb-title').value,
				slug:            document.getElementById('vsgfb-slug').value,
				meta_desc:       document.getElementById('vsgfb-meta').value,
				excerpt:         document.getElementById('vsgfb-excerpt').value,
				takeaways:       document.getElementById('vsgfb-takeaways').value,
				body:            document.getElementById('vsgfb-body').value,
				cta:             document.getElementById('vsgfb-cta').value,
				tags:            document.getElementById('vsgfb-tags').value,
				category_id:     document.getElementById('vsgfb-cat').value,
				post_status:     document.getElementById('vsgfb-pub-status').value,
				post_date:       document.getElementById('vsgfb-post-date').value || '',
				featured_id:     VSGFB.featuredId || '',
				image_ids:       JSON.stringify(VSGFB.images.map(function (i) { return i.id; })),
				video_ids:       JSON.stringify(VSGFB.videos.map(function (i) { return i.id; })),
				image_seo:       JSON.stringify(imgSeo),
				video_seo:       JSON.stringify(videoSeo),
				faq:             JSON.stringify(faqItems),
				has_table:       document.getElementById('vsgfb-has-table').value,
				table_data:      document.getElementById('vsgfb-table-data').value,
				circuit:         document.getElementById('vsgfb-circuit').value || '',
				publish_mode:    pubMode,
				update_post_id:  updatePostId
			})
		})
		.then(function (r) { return r.json(); })
		.then(function (resp) {
			btn.disabled    = false;
			btn.textContent = '🚀 Publiceer op website';
			if (!resp.success) {
				vsgfbStatus('❌ ' + ((resp.data && resp.data.message) ? resp.data.message : 'Fout'), 'err');
				return;
			}
			vsgfbStatus(
				'✅ Gepubliceerd! <a href="' + resp.data.url + '" target="_blank"><strong>Bekijk post →</strong></a>' +
				' &nbsp; <a href="' + resp.data.edit_url + '" target="_blank">Bewerken in WP</a>',
				'ok'
			);
		})
		.catch(function (e) {
			btn.disabled    = false;
			btn.textContent = '🚀 Publiceer op website';
			vsgfbStatus('❌ Netwerkfout: ' + e.message, 'err');
		});
	}
	</script>
	<?php
}

endif; // vsgfb_render_importer_page

// =============================================================================
// 5. AJAX — MEDIA UPLOAD
// =============================================================================

add_action( 'wp_ajax_vsgfb_upload_image', function () {
	check_ajax_referer( 'vsgfb_nonce', 'nonce' );
	if ( ! current_user_can( 'upload_files' ) ) {
		wp_send_json_error( [ 'message' => 'Geen rechten om bestanden te uploaden.' ] );
	}
	if ( empty( $_FILES['file'] ) ) {
		wp_send_json_error( [ 'message' => 'Geen bestand ontvangen.' ] );
	}

	require_once ABSPATH . 'wp-admin/includes/image.php';
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';

	$att_id = media_handle_upload( 'file', 0 );
	if ( is_wp_error( $att_id ) ) {
		wp_send_json_error( [ 'message' => $att_id->get_error_message() ] );
	}

	$mime       = get_post_mime_type( $att_id );
	$media_type = ( is_string( $mime ) && strpos( $mime, 'video/' ) === 0 ) ? 'video' : 'image';
	$thumb      = wp_get_attachment_image_url( $att_id, 'thumbnail' );
	if ( ! $thumb && $media_type === 'video' ) {
		$thumb = wp_mime_type_icon( $att_id );
	}

	wp_send_json_success( [
		'id'       => $att_id,
		'url'      => vsgfb_get_attachment_public_url( $att_id ),
		'thumb'    => $thumb ?: vsgfb_get_attachment_public_url( $att_id ),
		'filename' => basename( get_attached_file( $att_id ) ),
		'type'     => $media_type,
	] );
} );

// =============================================================================
// 6. AJAX — AI REWRITE
// =============================================================================

add_action( 'wp_ajax_vsgfb_rewrite', function () {
	check_ajax_referer( 'vsgfb_nonce', 'nonce' );
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_send_json_error( [ 'message' => 'Geen rechten.' ] );
	}

	$api_key = get_option( VSGFB_KEY_OPTION, '' );
	if ( ! $api_key ) {
		wp_send_json_error( [ 'message' => 'OpenAI API key niet ingesteld → VSGTalent → Importer Instellingen' ] );
	}

	$post_text = sanitize_textarea_field( $_POST['post_text'] ?? '' );
	$image_ids = json_decode( stripslashes( $_POST['image_ids'] ?? '[]' ), true );
	$video_ids = json_decode( stripslashes( $_POST['video_ids'] ?? '[]' ), true );

	/* Helper: replace Cloudways domain with public vsgtalent.nl in any URL */
	$vsgfb_pub_url = function ( $url ) {
		return str_replace(
			[ 'https://wordpress-474222-5959679.cloudwaysapps.com', 'http://wordpress-474222-5959679.cloudwaysapps.com' ],
			'https://vsgtalent.nl',
			$url
		);
	};

	/* ── Existing posts context ── */
	$existing_posts = get_posts( [
		'post_type'      => 'post',
		'post_status'    => 'publish',
		'posts_per_page' => 10,
		'orderby'        => 'date',
		'order'          => 'DESC',
	] );
	$existing_text = '';
	foreach ( $existing_posts as $ep ) {
		$exc = wp_strip_all_tags( get_the_excerpt( $ep ) );
		if ( ! $exc ) {
			$exc = wp_trim_words( wp_strip_all_tags( $ep->post_content ), 20 );
		}
		$existing_text .= '- "' . $ep->post_title . '" (' . $vsgfb_pub_url( get_permalink( $ep ) ) . '): ' . $exc . "\n";
	}
	if ( ! $existing_text ) {
		$existing_text = '(nog geen bestaande posts)';
	}

	/* ── Sponsors context ── */
	$sponsors_text = '';
	foreach ( [ 'sponsors', 'sponsor', 'sponsoren' ] as $stype ) {
		$items = get_posts( [ 'post_type' => $stype, 'post_status' => 'publish', 'posts_per_page' => 50, 'orderby' => 'title', 'order' => 'ASC' ] );
		if ( ! empty( $items ) ) {
			foreach ( $items as $sp ) {
				$url = get_post_meta( $sp->ID, '_sponsor_url', true )
				    ?: get_post_meta( $sp->ID, 'sponsor_url', true )
				    ?: get_post_meta( $sp->ID, 'website', true )
				    ?: $vsgfb_pub_url( get_permalink( $sp ) );
				$sponsors_text .= '- ' . $sp->post_title . ': ' . $url . "\n";
			}
			break;
		}
	}
	if ( ! $sponsors_text ) {
		$sponsors_text = '(geen sponsors gevonden in database)';
	}

	/* ── Events context ── */
	$events_text = '';
	foreach ( [ 'evenementen', 'evenement', 'events', 'event' ] as $etype ) {
		$items = get_posts( [ 'post_type' => $etype, 'post_status' => 'publish', 'posts_per_page' => 20, 'orderby' => 'date', 'order' => 'DESC' ] );
		if ( ! empty( $items ) ) {
			foreach ( $items as $ev ) {
				$events_text .= '- "' . $ev->post_title . '": ' . $vsgfb_pub_url( get_permalink( $ev ) ) . "\n";
			}
			break;
		}
	}
	if ( ! $events_text ) {
		$events_text = '(geen evenementen gevonden in database)';
	}

	/* ── Extra links ── */
	$extra_links_text = get_option( VSGFB_LINKS_OPTION, '' ) ?: '(geen extra links ingesteld)';

	/* ── Image filenames ── */
	$img_names = [];
	foreach ( (array) $image_ids as $iid ) {
		$f = get_attached_file( (int) $iid );
		if ( $f ) {
			$img_names[] = basename( $f );
		}
	}
	$img_names_text = '';
	if ( $img_names ) {
		foreach ( $img_names as $idx => $name ) {
			$img_names_text .= ( $idx + 1 ) . '. ' . $name . "\n";
		}
	} else {
		$img_names_text = '(geen afbeeldingen geüpload)';
	}

	$video_names = [];
	foreach ( (array) $video_ids as $vid ) {
		$f = get_attached_file( (int) $vid );
		if ( $f ) {
			$video_names[] = basename( $f );
		}
	}
	$video_names_text = '';
	if ( $video_names ) {
		foreach ( $video_names as $idx => $name ) {
			$video_names_text .= ( $idx + 1 ) . '. ' . $name . "\n";
		}
	} else {
		$video_names_text = '(geen video\'s geüpload)';
	}

	/* ── Build prompt ── */
	$prompt = get_option( VSGFB_PROMPT_OPTION, vsgfb_default_prompt() );
	$prompt = str_replace(
		[ '{EXISTING_POSTS}', '{SPONSORS}', '{EVENTS}', '{EXTRA_LINKS}', '{IMAGE_NAMES}', '{VIDEO_NAMES}', '{POST_TEXT}' ],
		[ $existing_text,     $sponsors_text, $events_text, $extra_links_text, $img_names_text, $video_names_text, $post_text ],
		$prompt
	);

	/* ── Build user message (text + vision images) ── */
	$user_content   = [];
	$user_content[] = [ 'type' => 'text', 'text' => $prompt ];
	foreach ( (array) $image_ids as $iid ) {
		$img_url = wp_get_attachment_url( (int) $iid );
		if ( $img_url ) {
			$user_content[] = [ 'type' => 'image_url', 'image_url' => [ 'url' => $img_url, 'detail' => 'low' ] ];
		}
	}
	$message_content = count( $user_content ) > 1 ? $user_content : $prompt;

	/* ── Call OpenAI ── */
	$response = wp_remote_post( 'https://api.openai.com/v1/chat/completions', [
		'timeout' => 180,
		'headers' => [
			'Authorization' => 'Bearer ' . $api_key,
			'Content-Type'  => 'application/json',
		],
		'body' => wp_json_encode( [
			'model'           => 'gpt-4o',
			'messages'        => [
				[
					'role'    => 'system',
					'content' => 'Je bent een professionele Nederlandse sportjournalist en SEO-specialist. Geef ALTIJD een valide JSON object terug, zonder markdown, zonder uitleg, zonder code blocks.',
				],
				[
					'role'    => 'user',
					'content' => $message_content,
				],
			],
			'temperature'     => 0.72,
			'max_tokens'      => 10000,
			'response_format' => [ 'type' => 'json_object' ],
		] ),
	] );

	if ( is_wp_error( $response ) ) {
		wp_send_json_error( [ 'message' => 'OpenAI API fout: ' . $response->get_error_message() ] );
	}

	$body   = json_decode( wp_remote_retrieve_body( $response ), true );
	$status = (int) wp_remote_retrieve_response_code( $response );

	if ( $status !== 200 || ! empty( $body['error'] ) ) {
		wp_send_json_error( [ 'message' => 'OpenAI fout: ' . ( $body['error']['message'] ?? 'HTTP ' . $status ) ] );
	}

	$raw = $body['choices'][0]['message']['content'] ?? '';
	$raw = preg_replace( '/^```(?:json)?\s*/i', '', trim( $raw ) );
	$raw = preg_replace( '/\s*```$/i', '', $raw );

	$parsed = json_decode( $raw, true );
	if ( json_last_error() !== JSON_ERROR_NONE || ! is_array( $parsed ) ) {
		wp_send_json_error( [ 'message' => 'Kon AI-antwoord niet verwerken. Probeer opnieuw.', 'preview' => substr( $raw, 0, 400 ) ] );
	}

	wp_send_json_success( $parsed );
} );

// =============================================================================
// 7. AJAX — PUBLISH POST
// =============================================================================

add_action( 'wp_ajax_vsgfb_publish', function () {
	check_ajax_referer( 'vsgfb_nonce', 'nonce' );
	if ( ! current_user_can( 'publish_posts' ) ) {
		wp_send_json_error( [ 'message' => 'Geen rechten om te publiceren.' ] );
	}

	$title      = sanitize_text_field( $_POST['title']      ?? '' );
	$slug       = sanitize_title( $_POST['slug']             ?? $title );
	$meta_desc  = sanitize_text_field( $_POST['meta_desc']  ?? '' );
	$excerpt    = sanitize_textarea_field( $_POST['excerpt'] ?? '' );
	$takeaways  = sanitize_textarea_field( $_POST['takeaways'] ?? '' );
	$body       = wp_kses_post( $_POST['body']               ?? '' );
	$cta        = wp_kses_post( $_POST['cta']                ?? '' );
	$tags_str   = sanitize_text_field( $_POST['tags']        ?? '' );
	$cat_id     = intval( $_POST['category_id']              ?? 0 );
	$pub_status = in_array( $_POST['post_status'] ?? '', [ 'publish', 'draft' ], true )
	              ? $_POST['post_status'] : 'publish';
	$feat_id    = intval( $_POST['featured_id']              ?? 0 );
	$image_ids  = json_decode( stripslashes( $_POST['image_ids']  ?? '[]' ), true );
	$video_ids  = json_decode( stripslashes( $_POST['video_ids']  ?? '[]' ), true );
	$image_seo  = json_decode( stripslashes( $_POST['image_seo']  ?? '[]' ), true );
	$video_seo  = json_decode( stripslashes( $_POST['video_seo']  ?? '[]' ), true );
	$faq_items  = json_decode( stripslashes( $_POST['faq']        ?? '[]' ), true );
	$has_table      = ( $_POST['has_table'] ?? '' ) === 'true';
	$table_data     = json_decode( stripslashes( $_POST['table_data'] ?? '[]' ), true );
	$post_date_raw  = sanitize_text_field( $_POST['post_date'] ?? '' );
	$default_author = intval( get_option( VSGFB_AUTHOR_OPTION, 0 ) );
	$post_author_id = $default_author ?: get_current_user_id();

	$media_url_replacements = [];

	/* ── Update image alt tags + rename files ── */
	foreach ( (array) $image_seo as $img_data ) {
		$iid = intval( $img_data['id'] ?? 0 );
		if ( ! $iid ) {
			continue;
		}
		$previous_attachment_url = vsgfb_get_attachment_public_url( $iid );
		$original_attachment_guid = get_post_field( 'guid', $iid );
		if ( ! empty( $img_data['alt'] ) ) {
			update_post_meta( $iid, '_wp_attachment_image_alt', sanitize_text_field( $img_data['alt'] ) );
		}
		$seo_name = sanitize_file_name( $img_data['seo_name'] ?? '' );
		/* Only rename once: skip if this attachment was already renamed by the plugin */
		$already_renamed = get_post_meta( $iid, '_vsgfb_renamed', true );
		if ( $seo_name && ! $already_renamed ) {
			$old_file = get_attached_file( $iid );
			if ( $old_file ) {
				$ext      = strtolower( pathinfo( $old_file, PATHINFO_EXTENSION ) );
				$basename = pathinfo( $seo_name, PATHINFO_FILENAME );
				$new_name = $basename . '.' . $ext;
				$new_file = trailingslashit( dirname( $old_file ) ) . $new_name;
				if ( $old_file !== $new_file && ! file_exists( $new_file ) ) {
					if ( @rename( $old_file, $new_file ) ) {
						update_attached_file( $iid, $new_file );
						$meta = wp_get_attachment_metadata( $iid );
						if ( is_array( $meta ) ) {
							$meta['file'] = str_replace( basename( $old_file ), $new_name, $meta['file'] ?? '' );
							wp_update_attachment_metadata( $iid, $meta );
						}
						/* Mark as renamed so future re-publishes skip the rename */
						update_post_meta( $iid, '_vsgfb_renamed', '1' );
					}
				} else {
					/* Target name already matches or file already exists — still mark as done */
					update_post_meta( $iid, '_vsgfb_renamed', '1' );
				}
				/* Always flush attachment cache so the next wp_get_attachment_url() returns fresh data */
				clean_attachment_cache( $iid );
			}
		}

		$att_title = ! empty( $img_data['title'] )
			? sanitize_text_field( $img_data['title'] )
			: ( $seo_name ? pathinfo( $seo_name, PATHINFO_FILENAME ) : '' );

		$att_update = [ 'ID' => $iid ];
		if ( $att_title ) {
			$att_update['post_title'] = $att_title;
			$att_update['post_name']  = sanitize_title( $att_title );
		}
		if ( ! empty( $img_data['caption'] ) ) {
			$att_update['post_excerpt'] = sanitize_text_field( $img_data['caption'] );
		}
		if ( ! empty( $img_data['description'] ) ) {
			$att_update['post_content'] = sanitize_textarea_field( $img_data['description'] );
		}
		if ( count( $att_update ) > 1 ) {
			wp_update_post( $att_update );
		}
		/* Keep inline media in sync with SEO-renamed attachment files. */
		$current_attachment_url = vsgfb_get_attachment_public_url( $iid );
		foreach ( [ $previous_attachment_url, $original_attachment_guid ] as $previous_url ) {
			if ( $previous_url && $current_attachment_url && $previous_url !== $current_attachment_url ) {
				$media_url_replacements[ $previous_url ] = $current_attachment_url;
			}
		}

	}

	/* ── Update video titles/captions/descriptions + rename files ── */
	foreach ( (array) $video_seo as $vid_data ) {
		$vid = intval( $vid_data['id'] ?? 0 );
		if ( ! $vid ) {
			continue;
		}

		$previous_attachment_url = vsgfb_get_attachment_public_url( $vid );
		$original_attachment_guid = get_post_field( 'guid', $vid );
		$seo_name = sanitize_file_name( $vid_data['seo_name'] ?? '' );
		$already_renamed = get_post_meta( $vid, '_vsgfb_video_renamed', true );
		if ( $seo_name && ! $already_renamed ) {
			$old_file = get_attached_file( $vid );
			if ( $old_file ) {
				$ext      = strtolower( pathinfo( $old_file, PATHINFO_EXTENSION ) );
				$basename = pathinfo( $seo_name, PATHINFO_FILENAME );
				$new_name = $basename . '.' . $ext;
				$new_file = trailingslashit( dirname( $old_file ) ) . $new_name;
				if ( $old_file !== $new_file && ! file_exists( $new_file ) ) {
					if ( @rename( $old_file, $new_file ) ) {
						update_attached_file( $vid, $new_file );
						update_post_meta( $vid, '_vsgfb_video_renamed', '1' );
					}
				} else {
					update_post_meta( $vid, '_vsgfb_video_renamed', '1' );
				}
				clean_attachment_cache( $vid );
			}
		}

		$att_title = ! empty( $vid_data['title'] )
			? sanitize_text_field( $vid_data['title'] )
			: ( $seo_name ? pathinfo( $seo_name, PATHINFO_FILENAME ) : '' );

		$att_update = [ 'ID' => $vid ];
		if ( $att_title ) {
			$att_update['post_title'] = $att_title;
			$att_update['post_name']  = sanitize_title( $att_title );
		}
		if ( ! empty( $vid_data['caption'] ) ) {
			$att_update['post_excerpt'] = sanitize_text_field( $vid_data['caption'] );
		}
		if ( ! empty( $vid_data['description'] ) ) {
			$att_update['post_content'] = sanitize_textarea_field( $vid_data['description'] );
		}
		if ( count( $att_update ) > 1 ) {
			wp_update_post( $att_update );
		}
		/* Keep inline media in sync with SEO-renamed attachment files. */
		$current_attachment_url = vsgfb_get_attachment_public_url( $vid );
		foreach ( [ $previous_attachment_url, $original_attachment_guid ] as $previous_url ) {
			if ( $previous_url && $current_attachment_url && $previous_url !== $current_attachment_url ) {
				$media_url_replacements[ $previous_url ] = $current_attachment_url;
			}
		}

	}

	/* ── Post date ── */
	$post_date_arr = [];
	if ( $post_date_raw ) {
		$ts = strtotime( $post_date_raw );
		if ( $ts ) {
			$local         = date( 'Y-m-d H:i:s', $ts );
			$post_date_arr = [
				'post_date'     => $local,
				'post_date_gmt' => get_gmt_from_date( $local ),
			];
		}
	}

	/* ── Build Gutenberg blocks ── */
	$blocks = '';

	/* Key Takeaways */
	$lines = array_values( array_filter( array_map( 'trim', explode( "\n", $takeaways ) ) ) );
	if ( $lines ) {
		$li = implode( '', array_map( function( $l ) { return '<li style="margin-bottom:6px">' . esc_html( $l ) . '</li>'; }, $lines ) );
		$blocks .= "<!-- wp:html -->\n";
		$blocks .= '<div style="background:rgba(255,255,255,0.06);border-left:4px solid #f97316;border-radius:8px;padding:20px 24px;margin:24px 0">' . "\n";
		$blocks .= '<p style="margin:0 0 10px;font-weight:700;font-size:0.95em;color:inherit">&#128204; Belangrijkste punten</p>' . "\n";
		$blocks .= '<ul style="margin:0;padding-left:20px;line-height:1.8;color:inherit">' . $li . '</ul>' . "\n";
		$blocks .= "</div>\n<!-- /wp:html -->\n\n";
	}

	/* Main body: apply attachment renames to image/video URLs before saving HTML. */
	if ( $media_url_replacements ) {
		$body = strtr( $body, $media_url_replacements );
	}
	$body = vsgfb_process_links( $body );
	if ( $body ) {
		$blocks .= "<!-- wp:html -->\n{$body}\n<!-- /wp:html -->\n\n";
	}

	/* Results table */
	if ( $has_table && ! empty( $table_data ) && is_array( $table_data ) ) {
		$cols  = array_keys( (array) ( $table_data[0] ?? [] ) );
		$thead = implode( '', array_map( function( $c ) { return '<th>' . esc_html( ucfirst( $c ) ) . '</th>'; }, $cols ) );
		$tbody = '';
		foreach ( $table_data as $row ) {
			$row_ref = $row;
			$cells   = implode( '', array_map( function( $c ) use ( $row_ref ) { return '<td>' . esc_html( $row_ref[ $c ] ?? '' ) . '</td>'; }, $cols ) );
			$tbody .= "<tr>{$cells}</tr>";
		}
		$blocks .= "<!-- wp:table {\"hasFixedLayout\":true} -->\n";
		$blocks .= "<figure class=\"wp-block-table\"><table><thead><tr>{$thead}</tr></thead><tbody>{$tbody}</tbody></table></figure>\n";
		$blocks .= "<!-- /wp:table -->\n\n";
	}

	/* FAQ */
	$faq_html = '';
	foreach ( (array) $faq_items as $item ) {
		$q = wp_kses_post( $item['q'] ?? '' );
		$a = wp_kses_post( $item['a'] ?? '' );
		if ( ! $q ) {
			continue;
		}
		$faq_html .= '<div style="border-bottom:1px solid #e5e7eb;padding:14px 0">' . "\n";
		$faq_html .= '<h3 style="margin:0 0 8px;font-size:1em;font-weight:700;color:inherit">' . $q . '</h3>' . "\n";
		$faq_html .= '<p style="margin:0;opacity:0.85;line-height:1.65">' . $a . '</p>' . "\n";
		$faq_html .= "</div>\n";
	}
	if ( $faq_html ) {
		$blocks .= "<!-- wp:html -->\n";
		$blocks .= '<div style="background:rgba(255,255,255,0.06);border-radius:10px;padding:24px 28px;margin:28px 0">' . "\n";
		$blocks .= '<h2 style="margin:0 0 16px;font-size:1.25em;font-weight:800;color:inherit">Veelgestelde vragen</h2>' . "\n";
		$blocks .= $faq_html;
		$blocks .= "</div>\n<!-- /wp:html -->\n\n";
	}

	/* CTA */
	$cta = vsgfb_process_links( $cta );
	if ( $cta ) {
		$blocks .= "<!-- wp:paragraph {\"className\":\"vsgfb-cta\"} --><p class=\"vsgfb-cta\">{$cta}</p><!-- /wp:paragraph -->\n\n";
	}

	/* Gallery → collect URLs for media_gallery meta (displayed by MediaGallery component in frontend) */
	$gids         = array_values( array_filter( array_map( 'intval', (array) $image_ids ) ) );
	$vids         = array_values( array_filter( array_map( 'intval', (array) $video_ids ) ) );
	$gallery_urls = [];
	foreach ( $gids as $gid ) {
		/* Flush cache once more to guarantee a fresh URL after potential renames above */
		clean_attachment_cache( $gid );
		$gurl       = vsgfb_get_attachment_public_url( $gid );
		$local_path = get_attached_file( $gid );
		/* If the stored URL points to a file that no longer exists on disk, skip it so we
		   don't write a broken URL into media_gallery. wp_get_attachment_url() will reflect
		   whatever _wp_attached_file says, so we trust the filesystem as the source of truth. */
		if ( $gurl && $local_path && file_exists( $local_path ) ) {
			$gallery_urls[] = $gurl;
		}
		/* Skip if local file is missing or path is unknown — avoids storing phantom 404 URLs */
	}

	$video_urls = [];
	foreach ( $vids as $vid ) {
		clean_attachment_cache( $vid );
		$vurl       = vsgfb_get_attachment_public_url( $vid );
		$local_path = get_attached_file( $vid );
		if ( $vurl && $local_path && file_exists( $local_path ) ) {
			$video_urls[] = $vurl;
		}
	}

	/* Rebuild managed inline photo grids from the current attachment URLs.
	 * Selected attachments may have been renamed or re-uploaded by optimisation. */
	if ( false !== strpos( $blocks, 'class="vsg-photo-grid"' ) ) {
		$inline_gallery = '<div class="vsg-photo-grid">';
		foreach ( $gids as $gid ) {
			$photo_url = vsgfb_get_attachment_public_url( $gid );
			if ( ! in_array( $photo_url, $gallery_urls, true ) ) {
				continue;
			}
			$photo_alt = get_post_meta( $gid, '_wp_attachment_image_alt', true );
			$photo_caption = wp_get_attachment_caption( $gid );
			$inline_gallery .= '<figure class="wp-block-image"><img class="wp-image-' . intval( $gid ) . '" src="' . esc_url( $photo_url ) . '" alt="' . esc_attr( $photo_alt ) . '" loading="lazy" />';
			if ( $photo_caption ) {
				$inline_gallery .= '<figcaption>' . wp_kses_post( $photo_caption ) . '</figcaption>';
			}
			$inline_gallery .= '</figure>';
		}
		$inline_gallery .= '</div>';
		$blocks = preg_replace_callback( '~<div class="vsg-photo-grid">.*?</div>~s', function () use ( $inline_gallery ) {
			return $inline_gallery;
		}, $blocks );
	}

	/* ── Create or update post ── */
	$publish_mode    = sanitize_text_field( $_POST['publish_mode']    ?? 'new' );
	$update_post_id  = intval( $_POST['update_post_id'] ?? 0 );
	$do_update       = ( $publish_mode === 'update' && $update_post_id > 0 && get_post( $update_post_id ) );

	if ( $do_update ) {
		/* BELANGRIJK: post_name NIET meesturen bij update — URL mag niet wijzigen (breekt bestaande links) */
		$post_id = wp_update_post( array_merge( [
			'ID'            => $update_post_id,
			'post_title'    => $title,
			'post_content'  => $blocks,
			'post_excerpt'  => $excerpt,
			'post_status'   => $pub_status,
			'post_author'   => $post_author_id,
			'post_category' => $cat_id ? [ $cat_id ] : [],
		], $post_date_arr ), true );
	} else {
		$post_id = wp_insert_post( array_merge( [
			'post_title'    => $title,
			'post_name'     => $slug,
			'post_content'  => $blocks,
			'post_excerpt'  => $excerpt,
			'post_status'   => $pub_status,
			'post_author'   => $post_author_id,
			'post_category' => $cat_id ? [ $cat_id ] : [],
		], $post_date_arr ), true );
	}

	if ( is_wp_error( $post_id ) ) {
		wp_send_json_error( [ 'message' => $post_id->get_error_message() ] );
	}

	/* Tags */
	if ( $tags_str ) {
		wp_set_post_tags( $post_id, array_map( 'trim', explode( ',', $tags_str ) ) );
	}

	/* Featured image */
	if ( $feat_id ) {
		set_post_thumbnail( $post_id, $feat_id );
	}

	/* Attach images to post */
	foreach ( $gids as $gid ) {
		wp_update_post( [ 'ID' => $gid, 'post_parent' => $post_id ] );
	}

	/* Attach videos to post */
	foreach ( $vids as $vid ) {
		wp_update_post( [ 'ID' => $vid, 'post_parent' => $post_id ] );
	}

	/* Store gallery image URLs in media_gallery meta for frontend MediaGallery component */
	update_post_meta( $post_id, 'media_gallery', $gallery_urls );
	update_post_meta( $post_id, 'media_videos', $video_urls );

	/* Store FAQ items for Schema output */
	if ( ! empty( $faq_items ) ) {
		update_post_meta( $post_id, '_vsgfb_faq', wp_json_encode( $faq_items ) );
	}

	/* SEO meta */
	update_post_meta( $post_id, '_vsgfb_seo_title',  $title );
	update_post_meta( $post_id, '_vsgfb_meta_desc',  $meta_desc );

	/* Circuit / locatie */
	$circuit_val = sanitize_text_field( $_POST['circuit'] ?? '' );
	if ( $circuit_val ) {
		update_post_meta( $post_id, 'circuit', $circuit_val );
	}

	wp_send_json_success( [
		'post_id'  => $post_id,
		'url'      => get_permalink( $post_id ),
		'edit_url' => get_edit_post_link( $post_id, 'raw' ),
	] );
} );

// =============================================================================
// 8. AJAX — LOAD EXISTING POST
// =============================================================================

add_action( 'wp_ajax_vsgfb_load_post', function () {
	check_ajax_referer( 'vsgfb_nonce', 'nonce' );
	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_send_json_error( [ 'message' => 'Geen rechten.' ] );
	}

	$post_id = intval( $_POST['post_id'] ?? 0 );
	$post    = get_post( $post_id );
	if ( ! $post ) {
		wp_send_json_error( [ 'message' => 'Post niet gevonden.' ] );
	}

	/* Strip Gutenberg block markup, return clean readable text */
	$raw_content = $post->post_content;
	/* Remove block comment markers */
	$clean = preg_replace( '/<!-- \/?wp:[^>]+ -->/', '', $raw_content );
	/* Strip HTML tags */
	$clean = wp_strip_all_tags( $clean );
	/* Collapse whitespace */
	$clean = preg_replace( '/\n{3,}/', "\n\n", trim( $clean ) );

	/* Category */
	$cats       = wp_get_post_categories( $post_id, [ 'fields' => 'ids' ] );
	$category_id = ! empty( $cats ) ? $cats[0] : 0;

	/* Attached images (featured first, then gallery) */
	$images     = [];
	$videos     = [];
	$feat_id    = (int) get_post_thumbnail_id( $post_id );

	$collect_img = function ( $att_id ) use ( &$images ) {
		$att_id = (int) $att_id;
		if ( ! $att_id ) return;
		foreach ( $images as $img ) {
			if ( (int) $img['id'] === $att_id ) return; // already added
		}
		$images[] = [
			'id'       => $att_id,
			'url'      => vsgfb_get_attachment_public_url( $att_id ),
			'thumb'    => wp_get_attachment_image_url( $att_id, 'thumbnail' ) ?: vsgfb_get_attachment_public_url( $att_id ),
			'filename' => basename( get_attached_file( $att_id ) ),
		];
	};

	$collect_vid = function ( $att_id ) use ( &$videos ) {
		$att_id = (int) $att_id;
		if ( ! $att_id ) return;
		foreach ( $videos as $vid ) {
			if ( (int) $vid['id'] === $att_id ) return; // already added
		}
		$videos[] = [
			'id'       => $att_id,
			'url'      => vsgfb_get_attachment_public_url( $att_id ),
			'thumb'    => wp_mime_type_icon( $att_id ),
			'filename' => basename( get_attached_file( $att_id ) ),
		];
	};

	if ( $feat_id ) {
		$collect_img( $feat_id );
	}

	/* All images attached to this post */
	$attached = get_posts( [
		'post_type'      => 'attachment',
		'post_mime_type' => 'image',
		'post_parent'    => $post_id,
		'posts_per_page' => 30,
		'orderby'        => 'menu_order',
		'order'          => 'ASC',
	] );
	foreach ( $attached as $att ) {
		$collect_img( $att->ID );
	}

	/* All videos attached to this post */
	$attached_videos = get_posts( [
		'post_type'      => 'attachment',
		'post_mime_type' => 'video',
		'post_parent'    => $post_id,
		'posts_per_page' => 30,
		'orderby'        => 'menu_order',
		'order'          => 'ASC',
	] );
	foreach ( $attached_videos as $att ) {
		$collect_vid( $att->ID );
	}

	/* Also scan post content for image IDs */
	if ( preg_match_all( '/wp-image-(\d+)/', $raw_content, $matches ) ) {
		foreach ( $matches[1] as $img_id ) {
			$collect_img( (int) $img_id );
		}
	}

	/* Format as YYYY-MM-DD to match type="date" input */
	$post_date_formatted = $post->post_date ? date( 'Y-m-d', strtotime( $post->post_date ) ) : '';

	wp_send_json_success( [
		'post_id'     => $post_id,
		'title'       => $post->post_title,
		'content'     => $clean,
		'excerpt'     => $post->post_excerpt,
		'category_id' => $category_id,
		'images'      => $images,
		'videos'      => $videos,
		'post_date'   => $post_date_formatted,
	] );
} );

// =============================================================================
// 9. SEO META + SCHEMA OUTPUT IN <head>
// =============================================================================

/* Override <title> tag */
add_filter( 'pre_get_document_title', function ( $title ) {
	if ( is_singular( 'post' ) ) {
		$seo = get_post_meta( get_the_ID(), '_vsgfb_seo_title', true );
		if ( $seo ) {
			return esc_html( $seo ) . ' | ' . get_bloginfo( 'name' );
		}
	}
	return $title;
} );

/* Meta tags, OpenGraph, Twitter Card, NewsArticle + FAQ Schema */
add_action( 'wp_head', function () {
	if ( ! is_singular( 'post' ) ) {
		return;
	}

	$pid       = get_the_ID();
	$seo_title = get_post_meta( $pid, '_vsgfb_seo_title', true );
	$meta_desc = get_post_meta( $pid, '_vsgfb_meta_desc', true );
	$faq_raw   = get_post_meta( $pid, '_vsgfb_faq', true );
	$featured  = get_the_post_thumbnail_url( $pid, 'large' );
	$permalink = get_permalink( $pid );
	$post_obj  = get_post( $pid );
	$author    = get_the_author_meta( 'display_name', $post_obj->post_author );

	if ( $meta_desc ) {
		echo '<meta name="description" content="' . esc_attr( $meta_desc ) . '">' . "\n";
	}

	/* OpenGraph */
	echo '<meta property="og:type"      content="article">' . "\n";
	echo '<meta property="og:url"       content="' . esc_url( $permalink ) . '">' . "\n";
	echo '<meta property="og:site_name" content="' . esc_attr( get_bloginfo( 'name' ) ) . '">' . "\n";
	if ( $seo_title ) echo '<meta property="og:title"       content="' . esc_attr( $seo_title ) . '">' . "\n";
	if ( $meta_desc ) echo '<meta property="og:description" content="' . esc_attr( $meta_desc ) . '">' . "\n";
	if ( $featured )  echo '<meta property="og:image"       content="' . esc_url( $featured ) . '">' . "\n";

	/* Twitter Card */
	echo '<meta name="twitter:card"        content="summary_large_image">' . "\n";
	if ( $seo_title ) echo '<meta name="twitter:title"       content="' . esc_attr( $seo_title ) . '">' . "\n";
	if ( $meta_desc ) echo '<meta name="twitter:description" content="' . esc_attr( $meta_desc ) . '">' . "\n";
	if ( $featured )  echo '<meta name="twitter:image"       content="' . esc_url( $featured ) . '">' . "\n";

	/* NewsArticle Schema */
	$schema = [
		'@context'      => 'https://schema.org',
		'@type'         => 'NewsArticle',
		'headline'      => $seo_title ?: get_the_title( $pid ),
		'description'   => $meta_desc,
		'url'           => $permalink,
		'datePublished' => get_the_date( 'c', $pid ),
		'dateModified'  => get_the_modified_date( 'c', $pid ),
		'author'        => [ '@type' => 'Person', 'name' => $author ],
		'publisher'     => [
			'@type' => 'Organization',
			'name'  => get_bloginfo( 'name' ),
			'url'   => home_url(),
		],
	];
	if ( $featured ) {
		$schema['image'] = [ '@type' => 'ImageObject', 'url' => $featured ];
	}
	echo '<script type="application/ld+json">'
	     . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE )
	     . '</script>' . "\n";

	/* FAQ Schema */
	if ( $faq_raw ) {
		$faq_items = json_decode( $faq_raw, true );
		if ( is_array( $faq_items ) && ! empty( $faq_items ) ) {
			$entities = [];
			foreach ( $faq_items as $item ) {
				if ( empty( $item['q'] ) ) continue;
				$entities[] = [
					'@type'          => 'Question',
					'name'           => wp_strip_all_tags( $item['q'] ),
					'acceptedAnswer' => [
						'@type' => 'Answer',
						'text'  => wp_strip_all_tags( $item['a'] ?? '' ),
					],
				];
			}
			if ( $entities ) {
				$faq_schema = [
					'@context'   => 'https://schema.org',
					'@type'      => 'FAQPage',
					'mainEntity' => $entities,
				];
				echo '<script type="application/ld+json">'
				     . wp_json_encode( $faq_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE )
				     . '</script>' . "\n";
			}
		}
	}
}, 5 );
