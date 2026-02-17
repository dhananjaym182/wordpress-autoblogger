<?php
/**
 * REST API Handler
 */

class AutoBlogger_REST_API {

    /**
     * Register REST routes
     */
    public function register_routes() {
        $auth = new AutoBlogger_HMAC_Auth();

        // Pair endpoint (no auth required)
        register_rest_route('autoblogger/v1', '/pair', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_pair'),
            'permission_callback' => '__return_true',
        ));

        // Ping endpoint
        register_rest_route('autoblogger/v1', '/ping', array(
            'methods' => 'GET',
            'callback' => array($this, 'handle_ping'),
            'permission_callback' => function($request) use ($auth) {
                return $auth->verify_request($request);
            },
        ));

        // Post upsert endpoint
        register_rest_route('autoblogger/v1', '/posts/upsert', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_post_upsert'),
            'permission_callback' => function($request) use ($auth) {
                return $auth->verify_request($request);
            },
        ));

        // Media import endpoint
        register_rest_route('autoblogger/v1', '/media/import', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_media_import'),
            'permission_callback' => function($request) use ($auth) {
                return $auth->verify_request($request);
            },
        ));

        // Terms ensure endpoint
        register_rest_route('autoblogger/v1', '/terms/ensure', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_terms_ensure'),
            'permission_callback' => function($request) use ($auth) {
                return $auth->verify_request($request);
            },
        ));
    }

    /**
     * Handle pairing request
     */
    public function handle_pair($request) {
        $pairing_code = $request->get_param('pairing_code');
        $project_id = $request->get_param('project_id');

        // Validate pairing code (check transients)
        $stored = get_transient('autoblogger_pair_' . $pairing_code);

        if ($stored === false) {
            return new WP_Error(
                'invalid_pairing_code',
                'Invalid or expired pairing code',
                array('status' => 400)
            );
        }

        // Generate key pair
        $key_pair = AutoBlogger_HMAC_Auth::generate_key_pair();

        // Store connection
        $connections = get_option('autoblogger_connections', array());
        $connections[$key_pair['key_id']] = array(
            'project_id' => $project_id,
            'secret' => $key_pair['secret'],
            'paired_at' => current_time('mysql'),
        );
        update_option('autoblogger_connections', $connections);

        // Update status
        update_option('autoblogger_connection_status', 'connected');

        // Delete pairing code
        delete_transient('autoblogger_pair_' . $pairing_code);

        return array(
            'key_id' => $key_pair['key_id'],
            'secret' => $key_pair['secret'],
        );
    }

    /**
     * Handle ping request
     */
    public function handle_ping($request) {
        return array(
            'status' => 'ok',
            'version' => AUTOBLOGGER_VERSION,
            'wp_version' => get_bloginfo('version'),
            'site_url' => home_url(),
            'timestamp' => current_time('mysql'),
        );
    }

    /**
     * Handle post upsert request
     */
    public function handle_post_upsert($request) {
        $handler = new AutoBlogger_Post_Handler();
        return $handler->upsert($request);
    }

    /**
     * Handle media import request
     */
    public function handle_media_import($request) {
        $handler = new AutoBlogger_Media_Handler();
        return $handler->import($request);
    }

    /**
     * Handle terms ensure request
     */
    public function handle_terms_ensure($request) {
        $handler = new AutoBlogger_Terms_Handler();
        return $handler->ensure($request);
    }
}
