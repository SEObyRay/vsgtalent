<?php
/**
 * Plugin Name: VSGTalent Setup (Minimal Test)
 * Version: 1.0.0
 * Description: Test version
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', function() {
    error_log('VSGTalent plugin loaded successfully');
});
