<?php
/**
 * Plugin Name: VSGTalent Auto Setup
 * Plugin URI: https://vsgtalent.nl
 * Description: Automatische configuratie voor VSGTalent backend
 * Version: 1.8.4
 * Author: Ray Gritter
 * Text Domain: vsgtalent-setup
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define constants
define('VSGTALENT_VERSION', '1.8.4');
define('VSGTALENT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('VSGTALENT_PLUGIN_URL', plugin_dir_url(__FILE__));

class VSGTalent_Setup {
    
    public function __construct() {
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        add_action('init', array($this, 'register_post_types'));
        add_action('init', array($this, 'register_taxonomies'));
        add_action('init', array($this, 'register_meta_fields'));
        add_action('init', array($this, 'setup_racing_image_sizes'));
        add_action('rest_api_init', array($this, 'register_rest_fields'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_gutenberg_assets'));
        add_action('send_headers', array($this, 'add_cors_headers'));
        add_filter('wp_handle_upload', array($this, 'maybe_convert_image_to_avif'));
        add_action('save_post', array($this, 'optimize_media_on_save'), 20, 3);
        add_filter('media_row_actions', array($this, 'add_media_row_actions'), 10, 2);
        add_filter('attachment_fields_to_edit', array($this, 'add_attachment_field_button'), 10, 2);
        add_action('admin_post_vsgtalent_optimize_attachment', array($this, 'handle_optimize_attachment_action'));
        add_action('admin_post_vsgtalent_repair_media_gallery', array($this, 'handle_repair_media_gallery'));
        add_action('admin_post_vsgtalent_regenerate_thumbnails', array($this, 'handle_regenerate_thumbnails'));
        add_action('admin_post_vsgtalent_convert_single_to_16_9', array($this, 'handle_convert_single_to_16_9'));
        add_action('admin_notices', array($this, 'maybe_show_admin_notice'));
        add_filter('rest_prepare_post', array($this, 'filter_rest_post_response'), 11, 3);
        add_filter('image_size_names_choose', array($this, 'add_racing_image_sizes_to_dropdown'));
        add_filter('intermediate_image_sizes_advanced', array($this, 'force_16_9_aspect_ratio'));
    }
    
    /**
     * Registreert het 16:9 afbeeldingsformaat (800x450) voor de galerij
     */
    public function setup_racing_image_sizes() {
        // Voeg een custom image size toe met intelligente crop
        add_image_size('racing-gallery', 800, 450, true);
        
        // Optioneel: maak dit het standaard featured image formaat
        set_post_thumbnail_size(800, 450, true);
    }
    
    /**
     * Voegt het racing-gallery formaat toe aan de dropdown in de media library
     */
    public function add_racing_image_sizes_to_dropdown($sizes) {
        return array_merge($sizes, array(
            'racing-gallery' => __('Race Gallery (800×450)', 'vsgtalent')
        ));
    }
    
    /**
     * Forceert het 16:9 aspect ratio voor alle geüploade afbeeldingen
     * door een intelligentere crop toe te passen
     */
    public function force_16_9_aspect_ratio($sizes) {
        // Voeg een filter toe die de crop-berekening aanpast
        add_filter('image_resize_dimensions', array($this, 'racing_smart_crop_callback'), 10, 6);
        
        return $sizes;
    }
    
    /**
     * Intelligentere crop functie die beter centreert op basis van afbeelding verhoudingen
     */
    public function racing_smart_crop_callback($default_dimensions, $orig_w, $orig_h, $dest_w, $dest_h, $crop) {
        // Als dit geen crop operatie is, gebruik dan de standaard dimensies
        if (!$crop || $orig_w <= 0 || $orig_h <= 0) {
            return $default_dimensions;
        }
        
        // Alleen custom crop toepassen voor onze racing-gallery formaat (800x450)
        if ($dest_w != 800 || $dest_h != 450) {
            return $default_dimensions;
        }
        
        // Bereken aspect ratios
        $orig_ratio = $orig_w / $orig_h;
        $target_ratio = 16 / 9;
        
        // Bepaal crop coördinaten op basis van verhoudingen
        if ($orig_ratio > $target_ratio) {
            // Beeld is breder dan 16:9 - crop horizontaal, centreer verticaal
            $new_w = $orig_h * $target_ratio;
            $new_h = $orig_h;
            $src_x = ($orig_w - $new_w) / 2;
            $src_y = 0;
        } else {
            // Beeld is hoger dan 16:9 - crop verticaal, centreer horizontaal
            $new_w = $orig_w;
            $new_h = $orig_w / $target_ratio;
            $src_x = 0;
            $src_y = ($orig_h - $new_h) / 3; // Plaats focus iets hoger dan midden (1/3 van boven)
        }
        
        // Bereken alle benodigde dimensies voor de resize operatie
        $dst_x = 0;
        $dst_y = 0;
        
        // Vermijd afrondingsproblemen
        $src_x = round($src_x);
        $src_y = round($src_y);
        $new_w = round($new_w);
        $new_h = round($new_h);
        
        // Retourneer berekende dimensies voor de crop
        return array($src_x, $src_y, $dst_x, $dst_y, $new_w, $new_h, $dest_w, $dest_h);
    }
    
    /**
     * Register plugin settings
     */
    public function register_settings() {
        // Registreer de instellingen sectie
        add_settings_section(
            'vsgtalent_image_settings_section',
            'Afbeeldingsinstellingen',
            array($this, 'settings_section_callback'),
            'vsgtalent-settings'
        );

        // Registreer het veld voor het uitschakelen van conversie voor logo's
        add_settings_field(
            'vsgtalent_disable_logo_conversion',
            'Conversie voor logo\'s',
            array($this, 'disable_logo_conversion_callback'),
            'vsgtalent-settings',
            'vsgtalent_image_settings_section'
        );

        // Registreer de instelling zelf
        register_setting('vsgtalent_settings', 'vsgtalent_disable_logo_conversion', array(
            'type' => 'boolean',
            'default' => 1,
            'sanitize_callback' => 'rest_sanitize_boolean',
        ));
    }
    
    /**
     * Callback voor de instellingen sectie
     */
    public function settings_section_callback() {
        echo '<p>Beheer de instellingen voor afbeeldingsconversie.</p>';
    }
    
    /**
     * Callback voor het logo conversie veld
     */
    public function disable_logo_conversion_callback() {
        $option = get_option('vsgtalent_disable_logo_conversion', 1);
        ?>
        <label>
            <input type="checkbox" name="vsgtalent_disable_logo_conversion" value="1" <?php checked(1, $option); ?> />
            Schakel conversie uit voor bestanden met 'logo' in de bestandsnaam
        </label>
        <p class="description">
            Wanneer aangevinkt, worden bestanden met 'logo' in de bestandsnaam niet geconverteerd naar AVIF/WebP/JPEG.
            Dit is aan te raden voor logo's om kwaliteitsverlies te voorkomen.
        </p>
        <?php
    }

    /**
     * Voeg rijacties toe aan de mediabibliotheek.
     */
    public function add_media_row_actions($actions, $post) {
        if ('attachment' !== $post->post_type) {
            return $actions;
        }

        $nonce = wp_create_nonce('vsgtalent_optimize_attachment_' . $post->ID);
        $url = add_query_arg(array(
            'action'        => 'vsgtalent_optimize_attachment',
            'attachment_id' => $post->ID,
            'nonce'         => $nonce,
        ), admin_url('admin-post.php'));

        $actions['vsgtalent_optimize'] = sprintf(
            '<a href="%1$s">%2$s</a>',
            esc_url($url),
            esc_html__('SEO optimaliseren', 'vsgtalent-setup')
        );
        
        // Voeg 16:9 conversie actie toe voor afbeeldingen
        if (wp_attachment_is_image($post->ID)) {
            $nonce_16_9 = wp_create_nonce('vsgtalent_convert_single_to_16_9_' . $post->ID);
            $url_16_9 = add_query_arg(array(
                'action'        => 'vsgtalent_convert_single_to_16_9',
                'attachment_id' => $post->ID,
                'nonce'         => $nonce_16_9,
            ), admin_url('admin-post.php'));
            
            $actions['vsgtalent_convert_16_9'] = sprintf(
                '<a href="%1$s" style="color:#0073aa;font-weight:bold;">%2$s</a>',
                esc_url($url_16_9),
                esc_html__('→ 16:9 formaat', 'vsgtalent-setup')
            );
        }

        return $actions;
    }

    /**
     * Voeg een knop toe op het attachment detailscherm.
     */
    public function add_attachment_field_button($form_fields, $post) {
        $nonce = wp_create_nonce('vsgtalent_optimize_attachment_' . $post->ID);
        $url = add_query_arg(array(
            'action'        => 'vsgtalent_optimize_attachment',
            'attachment_id' => $post->ID,
            'nonce'         => $nonce,
        ), admin_url('admin-post.php'));

        $form_fields['vsgtalent_optimize'] = array(
            'label' => esc_html__('SEO optimalisatie', 'vsgtalent-setup'),
            'input' => 'html',
            'html'  => sprintf(
                '<a class="button" href="%1$s">%2$s</a>',
                esc_url($url),
                esc_html__('Bestandsnaam & metadata optimaliseren', 'vsgtalent-setup')
            ),
        );

        return $form_fields;
    }

    /**
     * Handelt de SEO optimalisatie aanvraag af voor een losse attachment.
     */
    public function handle_optimize_attachment_action() {
        $attachment_id = isset($_GET['attachment_id']) ? absint($_GET['attachment_id']) : 0;
        $nonce         = isset($_GET['nonce']) ? sanitize_text_field(wp_unslash($_GET['nonce'])) : '';

        if (!$attachment_id || !wp_verify_nonce($nonce, 'vsgtalent_optimize_attachment_' . $attachment_id)) {
            wp_safe_redirect(add_query_arg('vsgtalent_optimized', 'error', admin_url('upload.php')));
            exit;
        }

        if (!current_user_can('upload_files')) {
            wp_safe_redirect(add_query_arg('vsgtalent_optimized', 'permission', admin_url('upload.php')));
            exit;
        }

        $attachment = get_post($attachment_id);
        if (!$attachment || 'attachment' !== $attachment->post_type) {
            wp_safe_redirect(add_query_arg('vsgtalent_optimized', 'notfound', admin_url('upload.php')));
            exit;
        }

        $parent = null;
        if (!empty($attachment->post_parent)) {
            $parent = get_post((int) $attachment->post_parent);
        }

        if (!$parent) {
            $parent = $this->find_parent_post_for_attachment($attachment_id);
        }

        if ($parent) {
            $this->optimize_media_on_save($parent->ID, $parent, true);
        } else {
            $optimized = $this->optimize_attachment_standalone($attachment_id, $attachment);
            if (!$optimized) {
                wp_safe_redirect(add_query_arg('vsgtalent_optimized', 'noprimary', admin_url('upload.php')));
                exit;
            }
        }

        $redirect = wp_get_referer();
        if (!$redirect) {
            $redirect = admin_url('upload.php');
        }

        wp_safe_redirect(add_query_arg('vsgtalent_optimized', 'success', $redirect));
        exit;
    }

    /**
     * Voegt admin page toe voor het converteren van originele afbeeldingen naar 16:9 formaat
     */
    public function convert_originals_page() {
        ?>
        <div class="wrap">
            <h1>Converteer Originelen (16:9 formaat)</h1>
            <p>Met deze tool worden de originele afbeeldingen omgezet naar het 16:9 formaat (800×450) en vervangen.</p>
            <p><strong>Let op:</strong> Dit proces kan niet ongedaan worden gemaakt. Maak eerst een backup van je media library als je de originelen wilt bewaren.</p>
            
            <h2>Afbeelding filters</h2>
            <p>De volgende afbeeldingen worden NIET geconverteerd:</p>
            <ul>
                <li>Afbeeldingen met "logo" in de bestandsnaam of titel</li>
                <li>Afbeeldingen met "noresize" in de bestandsnaam of titel</li>
            </ul>
            
            <form method="post" action="<?php echo admin_url('admin-post.php'); ?>">
                <input type="hidden" name="action" value="vsgtalent_convert_originals">
                <?php wp_nonce_field('vsgtalent_convert_originals_nonce'); ?>
                
                <div class="form-field">
                    <label><strong>Minimale afbeeldingsgrootte voor conversie:</strong></label>
                    <p>
                        <input type="number" name="min_width" value="900" min="801" /> pixels breed
                        <span class="description">(Alleen afbeeldingen breder dan deze waarde worden geconverteerd)</span>
                    </p>
                </div>
                
                <div class="form-field">
                    <label><strong>Verwerking limiet:</strong></label>
                    <p>
                        <input type="number" name="batch_size" value="10" min="1" max="50" /> afbeeldingen per keer
                    </p>
                    <p class="description">Bij een groot aantal afbeeldingen kan de verwerking enkele minuten duren.</p>
                </div>
                
                <?php submit_button('Start Conversie', 'primary', 'submit', true, array('data-processing' => 'Dit kan enkele minuten duren...')); ?>
            </form>
            
            <hr>
            <h3>Recent geconverteerde afbeeldingen</h3>
            <div id="conversion-log">
                <?php
                $processed_ids = get_option('vsgtalent_last_converted_ids', array());
                if (empty($processed_ids)) {
                    echo '<p>Geen recente conversies.</p>';
                } else {
                    echo '<ul style="display: flex; flex-wrap: wrap; gap: 10px; list-style: none;">';
                    $count = 0;
                    foreach ($processed_ids as $data) {
                        if (!isset($data['id'])) continue;
                        $attachment_id = $data['id'];
                        $title = get_the_title($attachment_id) ?: 'Onbekende afbeelding';
                        $old_size = isset($data['old_size']) ? $data['old_size'] : 'Onbekend';
                        $new_size = isset($data['new_size']) ? $data['new_size'] : '800×450';
                        $thumb = wp_get_attachment_image($attachment_id, array(150, 150));
                        
                        echo '<li style="border: 1px solid #ddd; padding: 10px; background: #f9f9f9; border-radius: 5px;">';
                        echo $thumb ? $thumb : '[Geen thumbnail]';
                        echo '<div>';
                        echo '<p><strong>' . esc_html($title) . '</strong> (ID: ' . $attachment_id . ')</p>';
                        echo '<p>Van ' . esc_html($old_size) . ' naar ' . esc_html($new_size) . '</p>';
                        echo '</div>';
                        echo '</li>';
                        
                        if (++$count >= 6) break;
                    }
                    echo '</ul>';
                    
                    if (count($processed_ids) > 6) {
                        echo '<p>... en ' . (count($processed_ids) - 6) . ' meer.</p>';
                    }
                }
                ?>
            </div>
        </div>
        <?php
    }
    
    /**
     * Handler voor het converteren van originele afbeeldingen
     */
    public function handle_convert_originals() {
        if (!current_user_can('manage_options') || !check_admin_referer('vsgtalent_convert_originals_nonce')) {
            wp_die('Je hebt niet voldoende rechten om deze actie uit te voeren.');
        }
        
        $batch_size = isset($_POST['batch_size']) ? intval($_POST['batch_size']) : 10;
        $batch_size = max(1, min(50, $batch_size));
        
        $min_width = isset($_POST['min_width']) ? intval($_POST['min_width']) : 900;
        $min_width = max(801, $min_width); // Minimaal 801 pixels breed
        
        // Zoek afbeeldingen die breder zijn dan de minimum breedte
        $large_images = array();
        
        $all_images = get_posts(array(
            'post_type' => 'attachment',
            'post_mime_type' => 'image',
            'posts_per_page' => -1,
            'fields' => 'ids',
        ));
        
        // Filter op afbeeldingen die groter zijn dan de minimale breedte
        foreach ($all_images as $attachment_id) {
            $metadata = wp_get_attachment_metadata($attachment_id);
            if (!empty($metadata['width']) && $metadata['width'] >= $min_width) {
                $large_images[] = $attachment_id;
                if (count($large_images) >= $batch_size) {
                    break;
                }
            }
        }
        
        if (empty($large_images)) {
            wp_redirect(add_query_arg('vsgtalent_converted', '0', admin_url('admin.php?page=vsgtalent-convert-originals')));
            exit;
        }
        
        $processed = 0;
        $processed_ids = array();
        
        foreach ($large_images as $attachment_id) {
            $result = $this->convert_single_image_to_16_9($attachment_id);
            if ($result['success']) {
                $processed++;
            }
            
            $processed_ids[] = array_merge(['id' => $attachment_id], $result);
        }
        
        // Sla de laatst verwerkte IDs op voor het log
        update_option('vsgtalent_last_converted_ids', $processed_ids);
        
        wp_redirect(add_query_arg('vsgtalent_converted', $processed, admin_url('admin.php?page=vsgtalent-convert-originals')));
        exit;
    }
    
    /**
     * Handelt de conversie van een enkele afbeelding naar 16:9 formaat af
     */
    public function handle_convert_single_to_16_9() {
        $attachment_id = isset($_GET['attachment_id']) ? absint($_GET['attachment_id']) : 0;
        $nonce = isset($_GET['nonce']) ? sanitize_text_field(wp_unslash($_GET['nonce'])) : '';
        
        if (!$attachment_id || !wp_verify_nonce($nonce, 'vsgtalent_convert_single_to_16_9_' . $attachment_id)) {
            wp_die('Ongeldige aanvraag.');
        }
        
        if (!current_user_can('upload_files')) {
            wp_die('Je hebt niet voldoende rechten om deze actie uit te voeren.');
        }
        
        // Haal de originele redirect URL op vóór eventuele wijzigingen
        $redirect = wp_get_referer();
        if (!$redirect) {
            $redirect = admin_url('upload.php');
        }
        
        // Voer de conversie uit
        $result = $this->convert_single_image_to_16_9($attachment_id);
        
        // Markeer deze afbeelding als recent geconverteerd voor de log
        $processed_ids = [$result];
        $processed_ids[0]['id'] = $attachment_id;
        update_option('vsgtalent_last_converted_ids', $processed_ids);
        
        // Redirect terug met resultaat
        if ($result['success']) {
            wp_redirect(add_query_arg('vsgtalent_single_converted', '1', $redirect));
        } else {
            $error = isset($result['error']) ? $result['error'] : 'onbekende fout';
            wp_redirect(add_query_arg([
                'vsgtalent_single_converted' => '0',
                'vsgtalent_error' => urlencode($error)
            ], $redirect));
        }
        exit;
    }

    /**
     * Handelt het regenereren van thumbnails af
     */
    public function handle_regenerate_thumbnails() {
        if (!current_user_can('manage_options') || !check_admin_referer('vsgtalent_regenerate_thumbnails_nonce')) {
            wp_die('Je hebt niet voldoende rechten om deze actie uit te voeren.');
        }
        
        $batch_size = isset($_POST['batch_size']) ? intval($_POST['batch_size']) : 20;
        $batch_size = max(1, min(100, $batch_size)); // Limiteer tussen 1-100
        
        // Haal alle afbeelding attachments op
        $attachments = get_posts(array(
            'post_type' => 'attachment',
            'post_mime_type' => 'image',
            'posts_per_page' => $batch_size,
            'fields' => 'ids',
        ));
        
        if (empty($attachments)) {
            wp_redirect(add_query_arg('vsgtalent_regenerated', '0', admin_url('admin.php?page=vsgtalent-regenerate-thumbs')));
            exit;
        }
        
        $processed = 0;
        $processed_ids = array();
        
        // WordPress image processing classes
        require_once ABSPATH . 'wp-admin/includes/image.php';
        
        foreach ($attachments as $attachment_id) {
            $attachment_path = get_attached_file($attachment_id);
            
            if (!$attachment_path || !file_exists($attachment_path)) {
                continue;
            }
            
            // Verwijder bestaande thumbnails
            $metadata = wp_get_attachment_metadata($attachment_id);
            if (!empty($metadata['sizes'])) {
                $this->delete_existing_image_sizes($attachment_id, $attachment_path);
            }
            
            // Regenereer alle thumbnails met onze custom crop functie
            add_filter('image_resize_dimensions', array($this, 'racing_smart_crop_callback'), 10, 6);
            $metadata = wp_generate_attachment_metadata($attachment_id, $attachment_path);
            remove_filter('image_resize_dimensions', array($this, 'racing_smart_crop_callback'), 10);
            
            if (!is_wp_error($metadata) && !empty($metadata)) {
                wp_update_attachment_metadata($attachment_id, $metadata);
                $processed++;
                $processed_ids[] = $attachment_id;
            }
        }
        
        // Sla de laatst verwerkte IDs op voor het log
        update_option('vsgtalent_last_regenerated_ids', $processed_ids);
        
        wp_redirect(add_query_arg('vsgtalent_regenerated', $processed, admin_url('admin.php?page=vsgtalent-regenerate-thumbs')));
        exit;
    }

    /**
     * Toon admin notificatie na optimalisatie of reparatie.
     */
    public function maybe_show_admin_notice() {
        // Media optimalisatie notificaties
        if (isset($_GET['vsgtalent_optimized'])) {
            $status = sanitize_text_field(wp_unslash($_GET['vsgtalent_optimized']));

            switch ($status) {
                case 'success':
                    $class = 'notice notice-success';
                    $message = __('Media succesvol geoptimaliseerd.', 'vsgtalent-setup');
                    break;
                case 'permission':
                    $class = 'notice notice-error';
                    $message = __('Je hebt geen rechten om deze actie uit te voeren.', 'vsgtalent-setup');
                    break;
                case 'notfound':
                    $class = 'notice notice-error';
                    $message = __('De geselecteerde media is niet gevonden of heeft geen gekoppelde post.', 'vsgtalent-setup');
                    break;
                case 'noprimary':
                    $class = 'notice notice-error';
                    $message = __('Kan de gekoppelde post niet vinden voor deze media.', 'vsgtalent-setup');
                    break;
                default:
                    $class = 'notice notice-error';
                    $message = __('Er is een fout opgetreden bij het optimaliseren.', 'vsgtalent-setup');
            }

            printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($class), esc_html($message));
            return;
        }
        
        // Thumbnails regeneratie notificaties
        if (isset($_GET['vsgtalent_regenerated'])) {
            $count = intval($_GET['vsgtalent_regenerated']);
            
            if ($count > 0) {
                $class = 'notice notice-success';
                $message = sprintf(__('%d afbeeldingen zijn opnieuw gegenereerd in het 16:9 formaat.', 'vsgtalent-setup'), $count);
            } else {
                $class = 'notice notice-info';
                $message = __('Geen afbeeldingen gevonden om opnieuw te genereren.', 'vsgtalent-setup');
            }
            
            printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($class), esc_html($message));
            return;
        }
        
        // Originelen conversie notificaties (bulk)
        if (isset($_GET['vsgtalent_converted'])) {
            $count = intval($_GET['vsgtalent_converted']);
            
            if ($count > 0) {
                $class = 'notice notice-success';
                $message = sprintf(__('%d originele afbeeldingen zijn geconverteerd naar het 16:9 formaat (800×450).', 'vsgtalent-setup'), $count);
            } else {
                $class = 'notice notice-info';
                $message = __('Geen originele afbeeldingen gevonden die groter zijn dan de ingestelde minimale breedte.', 'vsgtalent-setup');
            }
            
            printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($class), esc_html($message));
            return;
        }
        
        // Enkele afbeelding conversie notificaties
        if (isset($_GET['vsgtalent_single_converted'])) {
            $success = $_GET['vsgtalent_single_converted'] === '1';
            
            if ($success) {
                $class = 'notice notice-success';
                $message = __('De afbeelding is succesvol geconverteerd naar 16:9 formaat (800×450).', 'vsgtalent-setup');
            } else {
                $class = 'notice notice-error';
                $error = isset($_GET['vsgtalent_error']) ? urldecode($_GET['vsgtalent_error']) : 'onbekende fout';
                $message = sprintf(__('De afbeelding kon niet worden geconverteerd: %s', 'vsgtalent-setup'), $error);
            }
            
            printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($class), esc_html($message));
            return;
        }

        // Media galerij reparatie notificaties
        if (isset($_GET['vsgtalent_repaired'])) {
            $count = intval($_GET['vsgtalent_repaired']);
            
            if ($count > 0) {
                $class = 'notice notice-success';
                $message = sprintf(__('%d posts met media galerijen zijn gerepareerd.', 'vsgtalent-setup'), $count);
            } else {
                $class = 'notice notice-info';
                $message = __('Geen posts gevonden die reparatie nodig hadden.', 'vsgtalent-setup');
            }
            
            printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($class), esc_html($message));
        }
    }

    /**
     * Optimaliseer bestandsnamen en metadata voor media gekoppeld aan een bericht.
     */
    public function optimize_media_on_save($post_id, $post, $update) {
        if (wp_is_post_revision($post_id)) {
            return;
        }

        if ((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $attachments = get_children(array(
            'post_parent' => $post_id,
            'post_type'   => 'attachment',
            'numberposts' => -1,
        ));

        if (!is_array($attachments)) {
            $attachments = array();
        }

        $this->normalize_post_media_gallery($post_id);

        $featured_id = (int) get_post_thumbnail_id($post_id);
        if ($featured_id && !isset($attachments[$featured_id])) {
            $featured = get_post($featured_id);
            if ($featured instanceof WP_Post) {
                $attachments[$featured_id] = $featured;
            }
        }

        $gallery_urls = $this->get_post_media_gallery($post_id);
        if (!empty($gallery_urls) && is_array($gallery_urls)) {
            foreach ($gallery_urls as $gallery_url) {
                $gallery_attachment_id = $this->get_attachment_id_from_any_url($gallery_url);
                if ($gallery_attachment_id && !isset($attachments[$gallery_attachment_id])) {
                    $attachment_post = get_post($gallery_attachment_id);
                    if ($attachment_post instanceof WP_Post) {
                        $attachments[$gallery_attachment_id] = $attachment_post;
                    }
                }
            }
        }

        if (empty($attachments)) {
            return;
        }

        $slug = sanitize_title($post->post_title);
        if (!$slug) {
            $slug = 'post-' . $post_id;
        }

        $counters = array(
            'image' => 1,
            'video' => 1,
        );

        foreach ($attachments as $attachment) {
            $attachment_id = (int) $attachment->ID;
            $mime_type = get_post_mime_type($attachment_id);

            if (empty($mime_type)) {
                continue;
            }

            if (strpos($mime_type, 'image/') === 0) {
                $this->optimize_single_attachment($attachment_id, $post->post_title, $slug, 'image', $counters, $post->ID, $post->post_date);
            } elseif (strpos($mime_type, 'video/') === 0) {
                $this->optimize_single_attachment($attachment_id, $post->post_title, $slug, 'video', $counters, $post->ID, $post->post_date);
            }
        }
    }

    /**
     * Herbenoem een individuele attachment en werk metadata bij.
     *
     * @param int    $attachment_id
     * @param string $post_title
     * @param string $slug
     * @param string $type
     * @param array  $counters
     */
    private function optimize_single_attachment($attachment_id, $post_title, $slug, $type, array &$counters, $post_id = null, $post_date = null) {
        $index = $counters[$type] ?? 1;

        $file_path = get_attached_file($attachment_id);
        if (!$file_path || !file_exists($file_path)) {
            $counters[$type] = $index + 1;
            return;
        }

        $old_url = wp_get_attachment_url($attachment_id);

        if (!$post_date && $post_id) {
            $post_date = get_post_field('post_date', $post_id);
        }

        $extension = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));
        if (!$extension) {
            $counters[$type] = $index + 1;
            return;
        }

        $dir = trailingslashit(dirname($file_path));
        $desired_basename = sprintf('%s-%s-%d.%s', $slug, $type, $index, $extension);
        $unique_basename = wp_unique_filename($dir, $desired_basename);
        $new_file_path = $dir . $unique_basename;

        $should_rename = $file_path !== $new_file_path;

        if ('image' === $type) {
            $this->delete_existing_image_sizes($attachment_id, $file_path);
        }

        if ($should_rename) {
            if (!@rename($file_path, $new_file_path)) {
                $counters[$type] = $index + 1;
                return;
            }
        }

        update_attached_file($attachment_id, $new_file_path);

        $upload_dir = wp_upload_dir();
        $relative_path = str_replace(trailingslashit($upload_dir['basedir']), '', $new_file_path);
        $relative_path = ltrim(str_replace(DIRECTORY_SEPARATOR, '/', $relative_path), '/');
        $new_url = trailingslashit($upload_dir['baseurl']) . $relative_path;

        $media_title = $this->build_media_label($post_title, $type, $index, 'title', $post_date);
        $media_caption = $this->build_media_label($post_title, $type, $index, 'caption', $post_date);
        $media_description = $this->build_media_label($post_title, $type, $index, 'description', $post_date);

        wp_update_post(array(
            'ID'           => $attachment_id,
            'post_title'   => $media_title,
            'post_name'    => sanitize_title($media_title),
            'post_excerpt' => $media_caption,
            'post_content' => $media_description,
            'guid'         => esc_url_raw($new_url),
        ));

        if ('image' === $type) {
            $alt_text = $this->build_media_label($post_title, $type, $index, 'alt', $post_date);
            update_post_meta($attachment_id, '_wp_attachment_image_alt', $alt_text);

            require_once ABSPATH . 'wp-admin/includes/image.php';
            $metadata = wp_generate_attachment_metadata($attachment_id, $new_file_path);
            if (!is_wp_error($metadata) && !empty($metadata)) {
                wp_update_attachment_metadata($attachment_id, $metadata);
            }
        }

        if ($post_id && 'image' === $type && $old_url && $old_url !== $new_url) {
            $gallery = $this->get_post_media_gallery($post_id);

            if (is_array($gallery)) {
                $updated_gallery = array_map(
                    static function ($url) use ($old_url, $new_url) {
                        return ($url === $old_url) ? $new_url : $url;
                    },
                    $gallery
                );

                if ($updated_gallery !== $gallery) {
                    update_post_meta($post_id, 'media_gallery', $updated_gallery);
                }
            } elseif (is_string($gallery) && $gallery !== '') {
                $replaced = str_replace($old_url, $new_url, $gallery);
                if ($replaced !== $gallery) {
                    update_post_meta($post_id, 'media_gallery', $replaced);
                }
            }
        }

        $counters[$type] = $index + 1;
    }

    /**
     * Functie om een enkele afbeelding te converteren naar 16:9 formaat
     */
    private function convert_single_image_to_16_9($attachment_id) {
        // Controleer of het een afbeelding is
        if (!wp_attachment_is_image($attachment_id)) {
            return array('success' => false, 'error' => 'Geen afbeelding');
        }
        
        // Haal bestandspad op
        $file_path = get_attached_file($attachment_id);
        if (!$file_path || !file_exists($file_path)) {
            return array('success' => false, 'error' => 'Bestand niet gevonden');
        }
        
        // Controleer of conversie moet worden overgeslagen
        $file_name = basename($file_path);
        $title = get_the_title($attachment_id);
        
        if (stripos($file_name, 'logo') !== false || stripos($file_name, 'noresize') !== false ||
            stripos($title, 'logo') !== false || stripos($title, 'noresize') !== false) {
            return array('success' => false, 'error' => 'Overgeslagen (logo of noresize)');
        }
        
        // Maak nieuwe afbeelding om de originele niet te beïnvloeden tijdens bewerking
        $image_data = file_get_contents($file_path);
        $upload_dir = wp_upload_dir();
        $temp_file = $upload_dir['basedir'] . '/temp-' . uniqid() . '-' . basename($file_path);
        file_put_contents($temp_file, $image_data);
        
        // Maak image editor met het tijdelijke bestand
        $image = wp_get_image_editor($temp_file);
        if (is_wp_error($image)) {
            @unlink($temp_file); // Verwijder tijdelijk bestand
            return array('success' => false, 'error' => $image->get_error_message());
        }
        
        // Haal originele afmetingen op
        $size = $image->get_size();
        $orig_width = $size['width'];
        $orig_height = $size['height'];
        
        // Bewaar de oude grootte voor de log
        $old_size = $orig_width . 'x' . $orig_height;
        
        // Verbeterde crop logica voor alle afbeeldingsformaten
        $target_ratio = 16 / 9;
        $orig_ratio = $orig_width / $orig_height;
        
        // Check of de afbeelding al (bijna) 16:9 is
        $ratio_tolerance = 0.02; // 2% tolerantie voor afronding
        $ratio_diff = abs($orig_ratio - $target_ratio);
        
        // Als de afbeelding al (bijna) 16:9 is en groter dan 800x450, alleen resizen, niet croppen
        if ($ratio_diff <= $ratio_tolerance && $orig_width >= 800 && $orig_height >= 450) {
            // Skip cropping, alleen resizen naar 800x450
            $image->resize(800, 450, true);
        } else {
            // Afbeelding heeft andere verhoudingen - croppen en resizen
            if ($orig_ratio > $target_ratio) {
                // Afbeelding is breder dan 16:9 - crop horizontaal, centreer verticaal
                $crop_w = $orig_height * $target_ratio;
                $crop_h = $orig_height;
                $crop_x = ($orig_width - $crop_w) / 2;
                $crop_y = 0;
            } else {
                // Afbeelding is hoger dan 16:9 - crop verticaal, centreer horizontaal
                $crop_w = $orig_width;
                $crop_h = $orig_width / $target_ratio;
                $crop_x = 0;
                
                // Verbeterde logica voor portretfoto's - gebaseerd op beeldverhouding
                if ($orig_ratio < 0.4) { // Zeer hoge portretfoto (>2.5:1)
                    $crop_y = ($orig_height - $crop_h) * 0.2; // Focus hoger (20% vanaf top)
                } else if ($orig_ratio < 0.7) { // Typische portretfoto (~1.5:1)
                    $crop_y = ($orig_height - $crop_h) * 0.35; // Focus op 35% vanaf top
                } else { // Bijna vierkant of liggend (ratio 0.7-1.77)
                    $crop_y = ($orig_height - $crop_h) * 0.45; // Focus net boven midden
                }
            }
            
            // Zorg ervoor dat alles gehele getallen zijn
            $crop_x = max(0, (int)round($crop_x));
            $crop_y = max(0, (int)round($crop_y));
            $crop_w = min($orig_width - $crop_x, (int)round($crop_w));
            $crop_h = min($orig_height - $crop_y, (int)round($crop_h));
            
            // Voer de crop uit
            $image->crop($crop_x, $crop_y, $crop_w, $crop_h);
            
            // Resize naar de doelgrootte
            $image->resize(800, 450, true);
        }

        // Stel de hoogste kwaliteit in voor het opslaan
        $image->set_quality(95); // Maximale kwaliteit
        
        // Sla het bewerkte bestand direct op als het origineel
        $result = $image->save($file_path);
        @unlink($temp_file); // Verwijder tijdelijk bestand
        
        if (is_wp_error($result)) {
            return array('success' => false, 'error' => $result->get_error_message());
        }
        
        // Regenereer metadata voor de afbeelding
        $new_metadata = wp_generate_attachment_metadata($attachment_id, $file_path);
        wp_update_attachment_metadata($attachment_id, $new_metadata);
        
        // Verwijder eventuele caches
        clean_attachment_cache($attachment_id);
        
        return array(
            'success' => true, 
            'old_size' => $old_size,
            'new_size' => '800x450'
        );
    }

    /**
     * Optimaliseer een losse attachment zonder gekoppelde post.
     */
    private function optimize_attachment_standalone($attachment_id, $attachment) {
        $mime_type = get_post_mime_type($attachment_id);
        if (empty($mime_type)) {
            return false;
        }

        $type = (strpos($mime_type, 'video/') === 0) ? 'video' : (strpos($mime_type, 'image/') === 0 ? 'image' : 'other');
        if ('other' === $type) {
            return false;
        }

        $file_path = get_attached_file($attachment_id);
        if (!$file_path || !file_exists($file_path)) {
            return false;
        }

        $base_title = $attachment->post_title ?: pathinfo($file_path, PATHINFO_FILENAME);
        $slug = sanitize_title($base_title);
        if (!$slug) {
            $slug = 'media-' . $attachment_id;
        }

        $counters = array(
            'image' => 1,
            'video' => 1,
        );

        $this->optimize_single_attachment($attachment_id, $base_title, $slug, $type, $counters, null, $attachment->post_date ?? null);
        return true;
    }

    /**
     * Zoek de gekoppelde post voor een attachment.
     */
    private function find_parent_post_for_attachment($attachment_id) {
        $attachment = get_post($attachment_id);
        if ($attachment && !empty($attachment->post_parent)) {
            $parent = get_post((int) $attachment->post_parent);
            if ($parent instanceof WP_Post) {
                return $parent;
            }
        }

        $parent_posts = get_posts(array(
            'post_type'      => 'any',
            'post_status'    => 'any',
            'meta_key'       => '_thumbnail_id',
            'meta_value'     => $attachment_id,
            'posts_per_page' => 1,
            'fields'         => 'all',
        ));

        if (!empty($parent_posts)) {
            return $parent_posts[0];
        }

        return null;
    }

    /**
     * Normaliseer de media_gallery URLs voor een bericht.
     */
    private function normalize_post_media_gallery($post_id) {
        $entries = $this->get_post_media_gallery($post_id);

        if (is_string($entries)) {
            $decoded = json_decode($entries, true);
            if (is_array($decoded)) {
                $entries = $decoded;
            } else {
                $entries = array_filter(array_map('trim', preg_split('/[\r\n,]+/', $entries)));
            }
        }

        if (!is_array($entries)) {
            return;
        }

        $normalized = array();

        foreach ($entries as $entry) {
            if (is_array($entry)) {
                if (isset($entry['url'])) {
                    $entry = $entry['url'];
                } elseif (isset($entry['source'])) {
                    $entry = $entry['source'];
                } else {
                    continue;
                }
            }

            if (!is_string($entry)) {
                continue;
            }

            $normalized_url = $this->normalize_media_url($entry);

            if ($normalized_url) {
                $normalized[] = $normalized_url;
            }
        }

        if (empty($normalized)) {
            delete_post_meta($post_id, 'media_gallery');
            return;
        }

        $normalized = array_values(array_unique($normalized));

        if ($normalized !== $entries) {
            update_post_meta($post_id, 'media_gallery', $normalized);
        }
    }

    /**
     * Converteer een willekeurige URL naar de uploads basis URL van de site.
     */
    private function normalize_media_url($url) {
        if (!is_string($url)) {
            return '';
        }

        $url = trim(html_entity_decode($url));

        if ('' === $url) {
            return '';
        }

        $upload_dir = wp_upload_dir();
        $baseurl = trailingslashit($upload_dir['baseurl']);
        $base_host = wp_parse_url($baseurl, PHP_URL_HOST);
        $uploads_path = wp_parse_url($baseurl, PHP_URL_PATH);

        $parsed = wp_parse_url($url);

        if (false === $parsed) {
            return esc_url_raw($url);
        }

        if (empty($parsed['scheme']) && isset($parsed['path']) && 0 === strpos($parsed['path'], '/')) {
            $url = home_url($parsed['path']);
            $parsed = wp_parse_url($url);
        }

        if (!$parsed) {
            return esc_url_raw($url);
        }

        $path = isset($parsed['path']) ? $parsed['path'] : '';

        if ('' === $path) {
            return esc_url_raw($url);
        }

        $lookup_segments = array();

        if ($uploads_path && false !== strpos($path, $uploads_path)) {
            $lookup_segments[] = substr($path, strpos($path, $uploads_path) + strlen($uploads_path));
        }

        if (false !== strpos($path, '/wp-content/uploads/')) {
            $lookup_segments[] = substr($path, strpos($path, '/wp-content/uploads/') + strlen('/wp-content/uploads/'));
        }

        if (empty($lookup_segments)) {
            $lookup_segments[] = ltrim($path, '/');
        }

        foreach ($lookup_segments as $segment) {
            $segment = ltrim(str_replace(array('../', '..\\'), '', $segment), '/');

            if ('' === $segment) {
                continue;
            }

            $segment = preg_replace('#/{2,}#', '/', $segment);
            $segment_parts = explode('/', $segment);
            $segment_parts = array_map(static function ($part) {
                return rawurlencode(rawurldecode($part));
            }, $segment_parts);
            $segment = implode('/', $segment_parts);

            $normalized = esc_url_raw($baseurl . $segment);

            $external = $this->maybe_convert_to_external_domain($normalized);

            if ($external) {
                return $external;
            }

            return $normalized;
        }

        $external = $this->maybe_convert_to_external_domain($url);

        if ($external) {
            return $external;
        }

        return esc_url_raw($url);
    }

    /**
     * Vind de attachment ID op basis van een willekeurige URL (oude of nieuwe domeinen).
     */
    private function get_attachment_id_from_any_url($url) {
        $normalized_url = $this->normalize_media_url($url);

        if ('' === $normalized_url) {
            return 0;
        }

        $attachment_id = attachment_url_to_postid($normalized_url);

        if ($attachment_id) {
            return (int) $attachment_id;
        }

        $upload_dir = wp_upload_dir();
        $baseurl = trailingslashit($upload_dir['baseurl']);

        $relative_path = ltrim(str_replace($baseurl, '', $normalized_url), '/');
        $relative_path = rawurldecode($relative_path);

        if ('' === $relative_path) {
            return 0;
        }

        global $wpdb;

        $attachment_id = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_wp_attached_file' AND meta_value = %s LIMIT 1",
                $relative_path
            )
        );

        if ($attachment_id) {
            return (int) $attachment_id;
        }

        return 0;
    }

    /**
     * Bepaal of media afbeeldingen via een extern domein moeten worden geserveerd.
     * NOTE: Disabled for now as images are hosted on Cloudways, not vsgtalent.nl
     */
    private function maybe_convert_to_external_domain($url) {
        // Check if the URL is already using the correct domain
        if (strpos($url, 'wordpress-474222-5959679.cloudwaysapps.com') !== false) {
            return $url; // Already correct
        }
        
        // If URL has vsgtalent.nl domain, convert to Cloudways URL
        if (strpos($url, 'vsgtalent.nl') !== false) {
            $path = '';
            if (preg_match('#/wp-content/uploads/(.+)$#', $url, $matches)) {
                $path = $matches[0];
                return esc_url_raw('https://wordpress-474222-5959679.cloudwaysapps.com' . $path);
            }
        }
        
        // Handle relative paths and other URLs
        if (strpos($url, '/wp-content/uploads/') !== false) {
            $path = substr($url, strpos($url, '/wp-content/uploads/'));
            return esc_url_raw('https://wordpress-474222-5959679.cloudwaysapps.com' . $path);
        }
        
        // If we couldn't transform the URL, return it unchanged
        return $url;
    }

    /**
     * Haal de media_gallery meta op en normaliseer naar een array van strings.
     */
    private function get_post_media_gallery($post_id) {
        $gallery = get_post_meta($post_id, 'media_gallery', true);

        if (empty($gallery)) {
            return array();
        }

        if (is_array($gallery)) {
            return $gallery;
        }

        if (is_string($gallery)) {
            $decoded = json_decode($gallery, true);
            if (is_array($decoded)) {
                return $decoded;
            }

            return array_filter(array_map('trim', preg_split('/[\r\n,]+/', $gallery)));
        }

        return array();
    }

    /**
     * Zorg dat REST responses altijd het live domein teruggeven voor media.
     */
    public function filter_rest_post_response($response, $post, $request) {
        if (!($response instanceof WP_REST_Response)) {
            return $response;
        }

        $data = $response->get_data();

        if (!isset($data['meta']) || !is_array($data['meta'])) {
            return $response;
        }

        if (isset($data['meta']['media_gallery']) && is_array($data['meta']['media_gallery'])) {
            $data['meta']['media_gallery'] = array_map(function ($url) {
                $normalized = $this->normalize_media_url($url);

                $external = $this->maybe_convert_to_external_domain($normalized);

                return $external ? $external : $normalized;
            }, $data['meta']['media_gallery']);
        }

        if (isset($data['meta']['media_videos']) && is_array($data['meta']['media_videos'])) {
            $data['meta']['media_videos'] = array_map(function ($url) {
                $normalized = $this->normalize_media_url($url);

                $external = $this->maybe_convert_to_external_domain($normalized);

                return $external ? $external : $normalized;
            }, $data['meta']['media_videos']);
        }

        $response->set_data($data);

        return $response;
    }

    /**
     * Verwijder bestaande afbeeldingsformaten voor een attachment.
     */
    private function delete_existing_image_sizes($attachment_id, $file_path) {
        $metadata = wp_get_attachment_metadata($attachment_id);
        if (empty($metadata) || empty($metadata['sizes']) || !is_array($metadata['sizes'])) {
            return;
        }

        $dir = trailingslashit(dirname($file_path));
        foreach ($metadata['sizes'] as $size_data) {
            if (empty($size_data['file'])) {
                continue;
            }

            $size_path = $dir . $size_data['file'];
            if (file_exists($size_path)) {
                @unlink($size_path);
            }
        }
    }

    /**
     * Bouw een SEO-vriendelijke label voor media.
     */
    private function build_media_label($post_title, $type, $index, $context = 'title', $post_date = null) {
        $base_title = trim(wp_strip_all_tags($post_title));
        if ('' === $base_title) {
            $base_title = 'VSGTalent';
        }

        $base_title = wp_specialchars_decode($base_title, ENT_QUOTES);

        if ($post_date) {
            $timestamp = strtotime($post_date);
            if ($timestamp) {
                $date_fragment = date_i18n('j F Y', $timestamp);
                $base_title = sprintf('%s – %s', $base_title, $date_fragment);
            }
        }

        $type_nl = ('video' === $type) ? 'video' : 'afbeelding';
        $type_label = sprintf('%s %d', $type_nl, $index);
        $brand = 'VSGTalent';

        switch ($context) {
            case 'alt':
                return sprintf('%s | %s van %s', $base_title, ucfirst($type_label), $brand);
            case 'caption':
                return sprintf('%s | %s vastgelegd door %s', $base_title, ucfirst($type_label), $brand);
            case 'description':
                return sprintf('%s | %s %s voor %s mediaweergave', $base_title, ucfirst($type_nl), $index, $brand);
            case 'title':
            default:
                return sprintf('%s | %s van %s', $base_title, ucfirst($type_label), $brand);
        }
    }
    
    public function activate() {
        $this->register_post_types();
        $this->register_taxonomies();
        flush_rewrite_rules();
    }
    
    public function deactivate() {
        flush_rewrite_rules();
    }
    
    public function register_post_types() {
        register_post_type('evenement', array(
            'labels' => array(
                'name' => 'Evenementen',
                'singular_name' => 'Evenement',
            ),
            'public' => true,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
            'menu_icon' => 'dashicons-calendar-alt',
        ));
    }
    
    public function register_taxonomies() {
        register_taxonomy('competitie', 'post', array(
            'labels' => array('name' => 'Competities'),
            'show_in_rest' => true,
            'hierarchical' => true,
        ));
        
        register_taxonomy('seizoen', 'post', array(
            'labels' => array('name' => 'Seizoenen'),
            'show_in_rest' => true,
            'hierarchical' => true,
        ));
    }
    
    public function register_meta_fields() {
        $meta_fields = array(
            'media_gallery' => array(
                'type'        => 'array',
                'description' => 'Galerij met afbeelding URLs',
                'single'      => true,
                'show_in_rest'=> array(
                    'schema' => array(
                        'type'  => 'array',
                        'items' => array('type' => 'string'),
                    ),
                ),
                'sanitize_callback' => array($this, 'sanitize_media_array'),
            ),
            'media_videos' => array(
                'type'        => 'array',
                'description' => 'Video URLs',
                'single'      => true,
                'show_in_rest'=> array(
                    'schema' => array(
                        'type'  => 'array',
                        'items' => array('type' => 'string'),
                    ),
                ),
                'sanitize_callback' => array($this, 'sanitize_media_array'),
            ),
            'samenvatting' => array(
                'type'              => 'string',
                'description'       => 'Samenvatting',
                'single'            => true,
                'sanitize_callback' => 'sanitize_text_field',
                'show_in_rest'      => true,
            ),
            'circuit' => array(
                'type'              => 'string',
                'description'       => 'Circuit naam',
                'single'            => true,
                'sanitize_callback' => 'sanitize_text_field',
                'show_in_rest'      => true,
            ),
            'positie' => array(
                'type'              => 'number',
                'description'       => 'Race positie',
                'single'            => true,
                'sanitize_callback' => array($this, 'sanitize_position_meta'),
                'show_in_rest'      => true,
            ),
        );

        foreach ($meta_fields as $field => $args) {
            $result = register_post_meta('post', $field, $args);
            error_log("VSGTalent: Registered meta field '$field': " . ($result ? 'success' : 'failed'));
        }
    }
    
    public function register_rest_fields() {
        // Meta fields are now registered via register_post_meta with show_in_rest
        // No additional REST field registration needed
    }

    public function register_rest_routes() {
        register_rest_route('vsgtalent/v1', '/settings', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_site_settings'),
            'permission_callback' => '__return_true',
        ));
    }

    public function get_site_settings() {
        $icon_url = get_site_icon_url(512);
        $logo_id = (int) get_theme_mod('custom_logo');
        $logo_url = $logo_id ? wp_get_attachment_image_url($logo_id, 'full') : '';

        $icon_data = $icon_url ? array(
            'url'    => esc_url_raw($icon_url),
            'width'  => 512,
            'height' => 512,
        ) : null;

        $logo_data = $logo_url ? array(
            'url'    => esc_url_raw($logo_url),
            'width'  => null,
            'height' => null,
        ) : null;

        return array(
            'title'       => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'icon'        => $icon_data,
            'logo'        => $logo_data,
        );
    }

    /**
     * Sanitize media array values
     */
    public function sanitize_media_array($value) {
        if (is_string($value)) {
            $value = array_map('trim', explode(',', $value));
        }

        if (!is_array($value)) {
            return array();
        }

        $sanitized = array();

        foreach ($value as $item) {
            if (!is_string($item)) {
                continue;
            }

            $item = trim($item);

            if ($item === '') {
                continue;
            }

            $url = esc_url_raw($item);

            if ($url) {
                $sanitized[] = $url;
            }
        }

        return array_values(array_unique($sanitized));
    }

    /**
     * Sanitize numeric race position meta
     */
    public function sanitize_position_meta($value) {
        if (is_numeric($value)) {
            return absint($value);
        }

        return null;
    }

    public function add_admin_menu() {
        add_menu_page(
            'VSGTalent Setup',
            'VSGTalent',
            'manage_options',
            'vsgtalent-setup',
            array($this, 'admin_page'),
            'dashicons-flag',
            3
        );
        
        // Voeg een submenu toe onder VSGTalent voor het repareren van media galerijen
        add_submenu_page(
            'vsgtalent-setup',
            'Repareer Media Galerij',
            'Repareer Media Galerij',
            'manage_options',
            'vsgtalent-repair-media',
            array($this, 'repair_media_page')
        );
        
        // Voeg een submenu item toe voor het regenereren van thumbnails
        add_submenu_page(
            'vsgtalent-setup',
            'Regenereer Thumbnails',
            'Regenereer Thumbnails',
            'manage_options',
            'vsgtalent-regenerate-thumbs',
            array($this, 'regenerate_thumbs_page')
        );
        
        // Voeg een submenu item toe voor het converteren van originele afbeeldingen
        add_submenu_page(
            'vsgtalent-setup',
            'Converteer Originelen',
            'Converteer Originelen',
            'manage_options',
            'vsgtalent-convert-originals',
            array($this, 'convert_originals_page')
        );
    }
    
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>VSGTalent Instellingen</h1>
            
            <form method="post" action="options.php">
                <?php 
                settings_fields('vsgtalent_settings');
                do_settings_sections('vsgtalent-settings');
                submit_button('Instellingen opslaan');
                ?>
            </form>
        </div>
        <?php
    }
    
    public function enqueue_gutenberg_assets() {
        // Only load on post edit screens
        $screen = get_current_screen();
        if (!$screen || !in_array($screen->base, ['post'])) {
            return;
        }
        
        $script_path = VSGTALENT_PLUGIN_DIR . 'media-fields.js';
        
        if (!file_exists($script_path)) {
            error_log('VSGTalent: media-fields.js not found at ' . $script_path);
            return;
        }
        
        try {
            wp_enqueue_script(
                'vsgtalent-media-fields',
                VSGTALENT_PLUGIN_URL . 'media-fields.js',
                array('wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data', 'wp-block-editor'),
                VSGTALENT_VERSION,
                true
            );
        } catch (Exception $e) {
            error_log('VSGTalent: Error loading media-fields.js: ' . $e->getMessage());
        }
    }
    
    public function add_cors_headers() {
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_ORIGIN'])) : '';
        
        $is_localhost = preg_match('/^https?:\/\/localhost(:\d+)?$/', $origin);
        $allowed_origins = array('https://vsgtalent.nl', 'https://www.vsgtalent.nl');
        
        if ($is_localhost || in_array($origin, $allowed_origins, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
            header('Access-Control-Allow-Credentials: true');
        }
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
    }
    
    public function maybe_convert_image_to_avif($upload) {
        if (!empty($upload['error'])) {
            return $upload;
        }
        
        $file_path = $upload['file'];
        $file_name = basename($file_path);
        $mime_type = $upload['type'];
        
        // Controleer of conversie moet worden overgeslagen voor logo's en noresize bestanden
        $disable_for_logos = get_option('vsgtalent_disable_logo_conversion', 1);
        if ($disable_for_logos && (stripos($file_name, 'logo') !== false || stripos($file_name, 'noresize') !== false)) {
            return $upload; // Sla conversie over voor logo's en noresize bestanden
        }
        
        // Check ook de titel als er een attachment ID is
        if (!empty($upload['attachment_id'])) {
            $attachment_title = get_the_title($upload['attachment_id']);
            if ($attachment_title && (stripos($attachment_title, 'logo') !== false || stripos($attachment_title, 'noresize') !== false)) {
                return $upload; // Sla conversie over als de titel 'logo' of 'noresize' bevat
            }
        }
        
        if (!file_exists($file_path) || strpos($mime_type, 'image/') !== 0) {
            return $upload; // Alleen voor afbeeldingen
        }
        
        // Eerste afbeelding converteren naar het gewenste formaat
        $image = wp_get_image_editor($file_path);
        if (is_wp_error($image)) {
            return $upload;
        }
        
        // Haal originele afmetingen op
        $size = $image->get_size();
        $orig_width = $size['width'];
        $orig_height = $size['height'];
        
        // STAP 1: Eerst het bestandstype converteren (avif, webp, jpeg)
        $attempts = array(
            array('ext' => 'avif', 'func' => 'imageavif', 'quality' => 50),
            array('ext' => 'webp', 'func' => 'imagewebp', 'quality' => 80),
            array('ext' => 'jpg', 'func' => 'imagejpeg', 'quality' => 82),
        );
        
        foreach ($attempts as $attempt) {
            if (function_exists($attempt['func'])) {
                $new_path = preg_replace('/\.[^.]+$/', '.' . $attempt['ext'], $file_path);
                $image->set_quality($attempt['quality']);
                $result = $image->save($new_path, $attempt['ext']);
                
                if (!is_wp_error($result) && file_exists($new_path)) {
                    // Alleen het origineel verwijderen als de conversie succesvol was
                    if ($file_path !== $new_path) {
                        @unlink($file_path);
                    }
                    $file_path = $new_path; // Update het pad voor volgende bewerking
                    $upload['file'] = $new_path;
                    $upload['url'] = str_replace(basename($upload['url']), basename($new_path), $upload['url']);
                    break;
                }
            }
        }
        
        // STAP 2: Nu de geconverteerde afbeelding bijsnijden naar 16:9 (800×450)
        $image = wp_get_image_editor($file_path);
        if (is_wp_error($image)) {
            return $upload;
        }
        
        // Bereken de verhoudingen
        $orig_ratio = $orig_width / $orig_height;
        $target_ratio = 16 / 9;
        
        // Check of de afbeelding al (bijna) 16:9 is
        $ratio_tolerance = 0.02; // 2% tolerantie
        $ratio_diff = abs($orig_ratio - $target_ratio);
        
        // Als afbeelding al bijna 16:9 is en minstens 800x450, alleen resizen
        if ($ratio_diff <= $ratio_tolerance && $orig_width >= 800 && $orig_height >= 450) {
            // Alleen resizen, geen crop nodig
            $crop_w = $orig_width;
            $crop_h = $orig_height;
            $crop_x = 0;
            $crop_y = 0;
        } else {
            // Bepaal crop coördinaten
            if ($orig_ratio > $target_ratio) {
                // Afbeelding is breder dan 16:9 - crop horizontaal, centreer verticaal
                $crop_w = $orig_height * $target_ratio;
                $crop_h = $orig_height;
                $crop_x = ($orig_width - $crop_w) / 2;
                $crop_y = 0;
            } else {
                // Afbeelding is hoger dan 16:9 - crop verticaal, centreer horizontaal
                $crop_w = $orig_width;
                $crop_h = $orig_width / $target_ratio;
                $crop_x = 0;
                
                // Verbeterde focus voor portretfoto's
                if ($orig_ratio < 0.4) { // Zeer hoge portretfoto
                    $crop_y = ($orig_height - $crop_h) * 0.2; // Focus hoger (20% vanaf top)
                } else if ($orig_ratio < 0.7) { // Typische portretfoto
                    $crop_y = ($orig_height - $crop_h) * 0.35; // Focus op 35% vanaf top
                } else { // Bijna vierkant
                    $crop_y = ($orig_height - $crop_h) * 0.45; // Net boven midden
                }
            }
        }
        
        // Zorg ervoor dat alle waardes binnen bereik zijn
        $crop_x = max(0, round($crop_x));
        $crop_y = max(0, round($crop_y));
        $crop_w = min($orig_width - $crop_x, round($crop_w));
        $crop_h = min($orig_height - $crop_y, round($crop_h));
        
        // Voer de crop uit als dat nodig is
        if ($ratio_diff > $ratio_tolerance) {
            $image->crop($crop_x, $crop_y, $crop_w, $crop_h);
        }
        
        // Resize naar de doelgrootte 800x450 met hoge kwaliteit
        $image->resize(800, 450, true);
        $image->set_quality(95); // Hoogste kwaliteit
        
        // Sla de afbeelding op en vervang het origineel
        $ext = pathinfo($file_path, PATHINFO_EXTENSION);
        $result = $image->save($file_path, $ext);
        
        if (is_wp_error($result)) {
            // Als er een fout optreedt, behoud de niet-bijgesneden afbeelding
            return $upload;
        }
        
        // Update de bestandsgrootte in de upload array
        $stat = stat($file_path);
        if ($stat) {
            $upload['size'] = $stat['size'];
        }
        
        return $upload;
    }

    /**
     * Repareert alle media_gallery URLs in de database door oude vsgtalent.nl URLs
     * te vervangen door de correcte Cloudways URLs.
     */
    public function handle_repair_media_gallery() {
        if (!current_user_can('manage_options')) {
            wp_die('Je hebt niet voldoende rechten om deze actie uit te voeren.');
        }

        global $wpdb;

        // Haal alle posts op met een media_gallery meta veld
        $meta_query = $wpdb->prepare(
            "SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value IS NOT NULL AND meta_value != ''",
            'media_gallery'
        );

        $results = $wpdb->get_results($meta_query);
        $updated_count = 0;

        foreach ($results as $row) {
            $post_id = (int) $row->post_id;
            $meta_value = $row->meta_value;
            
            // Ontsleutel het meta_value als het een array is
            $gallery = maybe_unserialize($meta_value);
            
            if (is_string($gallery)) {
                // Mogelijk een JSON string
                $decoded = json_decode($gallery, true);
                if (is_array($decoded)) {
                    $gallery = $decoded;
                } else {
                    // Als het geen JSON is, probeer het als door komma's gescheiden waarden te interpreteren
                    $gallery = array_filter(array_map('trim', preg_split('/[\r\n,]+/', $gallery)));
                }
            }
            
            if (!is_array($gallery) || empty($gallery)) {
                continue;
            }
            
            $updated_gallery = array();
            $was_updated = false;
            
            foreach ($gallery as $url) {
                if (!is_string($url) || empty($url)) {
                    continue;
                }
                
                // Converteer de URL naar de Cloudways URL
                $fixed_url = $this->maybe_convert_to_external_domain($url);
                
                if ($fixed_url !== $url) {
                    $was_updated = true;
                }
                
                $updated_gallery[] = $fixed_url;
            }
            
            if ($was_updated && !empty($updated_gallery)) {
                update_post_meta($post_id, 'media_gallery', $updated_gallery);
                $updated_count++;
            }
        }

        // Toon een bericht aan de gebruiker
        $message = $updated_count > 0
            ? sprintf('%d posts met media galerijen zijn gerepareerd.', $updated_count)
            : 'Geen posts gevonden die reparatie nodig hadden.';    

        wp_redirect(add_query_arg('vsgtalent_repaired', $updated_count, admin_url('edit.php')));
        exit;
    }


    /**
     * Voegt admin page toe voor het regenereren van thumbnails in het 16:9 formaat
     */
    public function regenerate_thumbs_page() {
        ?>
        <div class="wrap">
            <h1>Regenereer Thumbnails (16:9 formaat)</h1>
            <p>Met deze tool kun je alle afbeeldingen opnieuw laten verwerken om het nieuwe 16:9 formaat (800×450) te genereren.</p>
            <p>Dit is handig na het toevoegen van een nieuw image size of wanneer afbeeldingen niet correct worden weergegeven in de galerij.</p>
            
            <form method="post" action="<?php echo admin_url('admin-post.php'); ?>">
                <input type="hidden" name="action" value="vsgtalent_regenerate_thumbnails">
                <?php wp_nonce_field('vsgtalent_regenerate_thumbnails_nonce'); ?>
                
                <div class="form-field">
                    <label><strong>Verwerking limiet:</strong></label>
                    <p>
                        <input type="number" name="batch_size" value="20" min="1" max="100" /> afbeeldingen per keer
                    </p>
                    <p class="description">Bij een groot aantal afbeeldingen kan de verwerking enkele minuten duren.</p>
                </div>
                
                <?php submit_button('Start Regeneratie', 'primary', 'submit', true, array('data-processing' => 'Dit kan even duren...')); ?>
            </form>
            
            <hr>
            <h3>Recent gegenereerde thumbnails</h3>
            <div id="regeneration-log">
                <?php
                $processed_ids = get_option('vsgtalent_last_regenerated_ids', array());
                if (empty($processed_ids)) {
                    echo '<p>Geen recente regeneraties.</p>';
                } else {
                    echo '<ul>';
                    $count = 0;
                    foreach ($processed_ids as $attachment_id) {
                        $title = get_the_title($attachment_id) ?: 'Onbekende afbeelding';
                        $url = wp_get_attachment_image_url($attachment_id, 'racing-gallery');
                        $thumb = wp_get_attachment_image($attachment_id, 'thumbnail');
                        
                        echo '<li>';
                        echo $thumb ? $thumb : '[Geen thumbnail]';
                        echo ' ';
                        echo esc_html($title) . ' (ID: ' . $attachment_id . ')';
                        echo '</li>';
                        
                        if (++$count >= 10) break;
                    }
                    echo '</ul>';
                    
                    if (count($processed_ids) > 10) {
                        echo '<p>... en ' . (count($processed_ids) - 10) . ' meer.</p>';
                    }
                }
                ?>
            </div>
        </div>
        <?php
    }
    
    /**
     * De admin pagina voor het repareren van media galerijen
     */
    public function repair_media_page() {
        ?>
        <div class="wrap">
            <h1>Repareer Media Galerij URLs</h1>
            <p>Gebruik deze functie om alle media galerij URLs in de database te repareren die naar verouderde domeinen verwijzen.</p>
            <p>Dit is vooral nuttig als je problemen hebt met afbeeldingen die niet worden weergegeven in de media galerij.</p>
            
            <form method="post" action="<?php echo admin_url('admin-post.php'); ?>">
                <input type="hidden" name="action" value="vsgtalent_repair_media_gallery">
                <?php wp_nonce_field('vsgtalent_repair_media_gallery_nonce'); ?>
                <?php submit_button('Repareer Media Galerij URLs', 'primary', 'submit', true); ?>
            </form>
        </div>
        <?php
    }
}

new VSGTalent_Setup();
