<?php
/**
 * Plugin Name: VSGTalent Auto Setup
 * Plugin URI: https://vsgtalent.nl
 * Description: Automatische configuratie voor VSGTalent backend
 * Version: 1.6.1
 * Author: Ray Gritter
 * Text Domain: vsgtalent-setup
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define constants
define('VSGTALENT_VERSION', '1.6.1');
define('VSGTALENT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('VSGTALENT_PLUGIN_URL', plugin_dir_url(__FILE__));

class VSGTalent_Setup {
    
    public function __construct() {
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        add_action('init', array($this, 'register_post_types'));
        add_action('init', array($this, 'register_taxonomies'));
        add_action('init', array($this, 'register_meta_fields'));
        add_action('rest_api_init', array($this, 'register_rest_fields'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_gutenberg_assets'));
        add_action('send_headers', array($this, 'add_cors_headers'));
        add_filter('wp_handle_upload', array($this, 'maybe_convert_image_to_avif'));
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
            'media_gallery' => 'Galerij met afbeelding URLs',
            'media_videos' => 'Video URLs',
            'samenvatting' => 'Samenvatting',
            'circuit' => 'Circuit',
            'positie' => 'Positie',
        );
        
        foreach ($meta_fields as $field => $description) {
            $result = register_post_meta('post', $field, array(
                'type' => 'array',
                'description' => $description,
                'single' => true,
                'show_in_rest' => array(
                    'schema' => array(
                        'type' => 'array',
                        'items' => array('type' => 'string'),
                    ),
                ),
            ));
            error_log("VSGTalent: Registered meta field '$field': " . ($result ? 'success' : 'failed'));
        }
    }
    
    public function register_rest_fields() {
        // Meta fields are now registered via register_post_meta with show_in_rest
        // No additional REST field registration needed
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
    }
    
    public function admin_page() {
        echo '<div class="wrap"><h1>VSGTalent Backend Setup</h1>';
        echo '<p>Plugin is actief en geconfigureerd.</p>';
        echo '</div>';
    }
    
    public function enqueue_gutenberg_assets() {
        $script_path = VSGTALENT_PLUGIN_DIR . 'media-fields.js';
        
        if (!file_exists($script_path)) {
            return;
        }
        
        wp_enqueue_script(
            'vsgtalent-media-fields',
            VSGTALENT_PLUGIN_URL . 'media-fields.js',
            array('wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data', 'wp-block-editor'),
            VSGTALENT_VERSION,
            true
        );
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
        
        if (!file_exists($file_path)) {
            return $upload;
        }
        
        $image = wp_get_image_editor($file_path);
        
        if (is_wp_error($image)) {
            return $upload;
        }
        
        $attempts = array(
            array('ext' => 'avif', 'func' => 'imageavif', 'quality' => 50),
            array('ext' => 'webp', 'func' => 'imagewebp', 'quality' => 80),
            array('ext' => 'jpg', 'func' => 'imagejpeg', 'quality' => 82),
        );
        
        foreach ($attempts as $attempt) {
            if (function_exists($attempt['func'])) {
                $new_path = preg_replace('/\.[^.]+$/', '.' . $attempt['ext'], $file_path);
                $image->save($new_path, $attempt['ext']);
                
                if (file_exists($new_path)) {
                    @unlink($file_path);
                    $upload['file'] = $new_path;
                    $upload['url'] = str_replace(basename($upload['url']), basename($new_path), $upload['url']);
                    break;
                }
            }
        }
        
        return $upload;
    }
}

new VSGTalent_Setup();
