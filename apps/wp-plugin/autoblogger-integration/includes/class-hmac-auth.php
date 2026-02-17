<?php
/**
 * HMAC Authentication Class
 */

class AutoBlogger_HMAC_Auth {

    /**
     * Verify HMAC signature from request
     *
     * @param WP_REST_Request $request The request object
     * @return bool|WP_Error True if valid, error otherwise
     */
    public function verify_request($request) {
        $key_id = $request->get_header('X-AB-KeyId');
        $timestamp = $request->get_header('X-AB-Timestamp');
        $nonce = $request->get_header('X-AB-Nonce');
        $signature = $request->get_header('X-AB-Signature');

        // Check required headers
        if (empty($key_id) || empty($timestamp) || empty($nonce) || empty($signature)) {
            return new WP_Error(
                'auth_missing_headers',
                'Missing authentication headers',
                array('status' => 401)
            );
        }

        // Check timestamp (must be within ±5 minutes)
        $now = time();
        if (abs($now - intval($timestamp)) > 300) {
            return new WP_Error(
                'auth_invalid_timestamp',
                'Request timestamp is too old or too new',
                array('status' => 401)
            );
        }

        // Check nonce (prevent replay attacks)
        if ($this->is_nonce_used($nonce)) {
            return new WP_Error(
                'auth_nonce_used',
                'Nonce has already been used',
                array('status' => 401)
            );
        }

        // Get the stored secret for this key ID
        $secret = $this->get_secret_by_key_id($key_id);
        if (is_wp_error($secret)) {
            return $secret;
        }

        // Build the signature string
        $method = $request->get_method();
        $path = $request->get_route();
        $body = $request->get_body();

        $signature_string = sprintf(
            "%s\n%s\n%s\n%s\n%s",
            $method,
            $path,
            $timestamp,
            $nonce,
            $body
        );

        // Calculate expected signature
        $expected_signature = hash_hmac('sha256', $signature_string, $secret);

        // Verify signatures match
        if (!hash_equals($expected_signature, $signature)) {
            return new WP_Error(
                'auth_invalid_signature',
                'Invalid signature',
                array('status' => 401)
            );
        }

        // Mark nonce as used
        $this->mark_nonce_used($nonce, 300);

        return true;
    }

    /**
     * Get secret by key ID
     *
     * @param string $key_id The key ID
     * @return string|WP_Error The secret or error
     */
    private function get_secret_by_key_id($key_id) {
        $connections = get_option('autoblogger_connections', array());

        if (!isset($connections[$key_id])) {
            return new WP_Error(
                'auth_invalid_key_id',
                'Invalid key ID',
                array('status' => 401)
            );
        }

        return $connections[$key_id]['secret'];
    }

    /**
     * Check if nonce has been used
     *
     * @param string $nonce The nonce to check
     * @return bool True if used
     */
    private function is_nonce_used($nonce) {
        $used = get_transient('autoblogger_nonce_' . $nonce);
        return $used !== false;
    }

    /**
     * Mark nonce as used
     *
     * @param string $nonce The nonce to mark
     * @param int $expiration Expiration time in seconds
     */
    private function mark_nonce_used($nonce, $expiration = 300) {
        set_transient('autoblogger_nonce_' . $nonce, true, $expiration);
    }

    /**
     * Generate a new key ID and secret pair
     *
     * @return array Key ID and secret
     */
    public static function generate_key_pair() {
        $key_id = wp_generate_password(16, false, false);
        $secret = wp_generate_password(32, false, false);

        return array(
            'key_id' => $key_id,
            'secret' => $secret,
        );
    }
}
