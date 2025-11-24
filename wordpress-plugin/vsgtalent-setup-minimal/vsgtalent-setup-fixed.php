<?php
/**
 * Plugin Name: VSGTalent Auto Setup (Fixed)
 * Plugin URI: https://vsgtalent.nl
 * Description: Automatische configuratie voor VSGTalent backend (bugfix versie)
 * Version: 1.7.3
 * Author: Ray Gritter
 * Text Domain: vsgtalent-setup
 */

if (!defined('ABSPATH')) {
    exit;
}

class VSGTalent_Setup_Fixed {
    public function __construct() {
        add_action('init', array($this, 'register_meta_fields'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_gutenberg_assets'));
        add_filter('rest_prepare_post', array($this, 'filter_rest_post_response'), 11, 3);
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_post_vsgtalent_repair_media_gallery', array($this, 'handle_repair_media_gallery'));
        add_action('admin_notices', array($this, 'maybe_show_admin_notice'));
    }
    
    /**
     * Register required meta fields
     */
    public function register_meta_fields() {
        register_post_meta('post', 'media_gallery', array(
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
        ));
        
        register_post_meta('post', 'media_videos', array(
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
        ));
    }
    
    /**
     * Load JavaScript for Gutenberg editor
     */
    public function enqueue_gutenberg_assets() {
        $current_screen = get_current_screen();
        if (!$current_screen || $current_screen->base !== 'post') {
            return;
        }
        
        wp_enqueue_script(
            'vsgtalent-media-fields',
            plugin_dir_url(__FILE__) . 'media-fields.js',
            array('wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data', 'wp-block-editor'),
            '1.7.3' . '.' . time(),
            true
        );
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
        
        wp_redirect(add_query_arg('vsgtalent_repaired', $updated_count, admin_url('edit.php')));
        exit;
    }
    
    /**
     * Admin menu addition
     */
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
        
        add_submenu_page(
            'vsgtalent-setup',
            'Repareer Media Galerij',
            'Repareer Media Galerij',
            'manage_options',
            'vsgtalent-repair-media',
            array($this, 'repair_media_page')
        );
    }
    
    /**
     * Main admin page
     */
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>VSGTalent Instellingen</h1>
            
            <p>VSGTalent Auto Setup plugin is actief.</p>
            <p>Gebruik de optie "Repareer Media Galerij" in het menu om problemen met de media galerij URLs te repareren.</p>
        </div>
        <?php
    }
    
    /**
     * Repair media gallery admin page
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
    
    /**
     * Notification handler
     */
    public function maybe_show_admin_notice() {
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
     * URL converter
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
     * REST API response handler
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
            $data['meta']['media_gallery'] = array_map(array($this, 'maybe_convert_to_external_domain'), $data['meta']['media_gallery']);
        }
        
        if (isset($data['meta']['media_videos']) && is_array($data['meta']['media_videos'])) {
            $data['meta']['media_videos'] = array_map(array($this, 'maybe_convert_to_external_domain'), $data['meta']['media_videos']);
        }
        
        $response->set_data($data);
        
        return $response;
    }
    
    /**
     * Sanitize media arrays
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
}

// Instantiate the class
new VSGTalent_Setup_Fixed();
