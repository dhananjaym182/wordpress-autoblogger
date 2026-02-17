<?php
/**
 * Plugin Name: AutoBlogger Integration
 * Plugin URI: https://autoblogger.com
 * Description: Secure connection to AutoBlogger SaaS for AI-powered autoblogging
 * Version: 1.0.0
 * Author: AutoBlogger
 * Author URI: https://autoblogger.com
 * License: GPL v2 or later
 * Text Domain: autoblogger-integration
 */

// Prevent direct access
defined('ABSPATH') || exit;

// Define plugin constants
define('AUTOBLOGGER_VERSION', '1.0.0');
define('AUTOBLOGGER_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('AUTOBLOGGER_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Main AutoBlogger Integration Class
 */
class AutoBlogger_Integration {
    private static $instance = null;

    /**
     * Get singleton instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }

    /**
     * Load required files
     */
    private function load_dependencies() {
        require_once AUTOBLOGGER_PLUGIN_DIR . 'includes/class-hmac-auth.php';
        require_once AUTOBLOGGER_PLUGIN_DIR . 'includes/class-rest-api.php';
        require_once AUTOBLOGGER_PLUGIN_DIR . 'includes/class-post-handler.php';
        require_once AUTOBLOGGER_PLUGIN_DIR . 'includes/class-media-handler.php';
        require_once AUTOBLOGGER_PLUGIN_DIR . 'includes/class-admin-ui.php';
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        add_action('rest_api_init', array($this, 'register_routes'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }

    /**
     * Register REST API routes
     */
    public function register_routes() {
        $rest_api = new AutoBlogger_REST_API();
        $rest_api->register_routes();
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        $admin_ui = new AutoBlogger_Admin_UI();
        $admin_ui->add_menu();
    }

    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        if ('toplevel_page_autoblogger' !== $hook) {
            return;
        }

        wp_enqueue_style(
            'autoblogger-admin',
            AUTOBLOGGER_PLUGIN_URL . 'admin/assets/css/admin.css',
            array(),
            AUTOBLOGGER_VERSION
        );

        wp_enqueue_script(
            'autoblogger-admin',
            AUTOBLOGGER_PLUGIN_URL . 'admin/assets/js/admin.js',
            array(),
            AUTOBLOGGER_VERSION,
            true
        );

        wp_localize_script('autoblogger-admin', 'autobloggerData', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('autoblogger_nonce'),
        ));
    }
}

// Initialize plugin
AutoBlogger_Integration::get_instance();

/**
 * Activation hook
 */
register_activation_hook(__FILE__, function() {
    // Set default options
    add_option('autoblogger_plugin_enabled', true);
    add_option('autoblogger_connection_status', 'disconnected');
});

/**
 * Deactivation hook
 */
register_deactivation_hook(__FILE__, function() {
    // Cleanup if needed
});
