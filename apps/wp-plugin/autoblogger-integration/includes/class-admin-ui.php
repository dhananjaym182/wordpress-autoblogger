<?php
/**
 * Admin UI Handler
 */

class AutoBlogger_Admin_UI {

    /**
     * Add admin menu
     */
    public function add_menu() {
        add_menu_page(
            'AutoBlogger',
            'AutoBlogger',
            'manage_options',
            'autoblogger',
            array($this, 'render_page'),
            'dashicons-admin-site-alt3',
            30
        );
    }

    /**
     * Render admin page
     */
    public function render_page() {
        $connection_status = get_option('autoblogger_connection_status', 'disconnected');
        $connections = get_option('autoblogger_connections', array());

        ?>
        <div class="wrap">
            <h1>AutoBlogger Integration</h1>

            <div class="autoblogger-card">
                <h2>Connection Status</h2>
                <p>
                    <strong>Status:</strong>
                    <span class="autoblogger-status autoblogger-status-<?php echo esc_attr($connection_status); ?>">
                        <?php echo ucfirst($connection_status); ?>
                    </span>
                </p>

                <?php if ($connection_status === 'connected' && !empty($connections)): ?>
                    <h3>Active Connections</h3>
                    <table class="wp-list-table widefat fixed striped">
                        <thead>
                            <tr>
                                <th>Key ID</th>
                                <th>Project ID</th>
                                <th>Paired At</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($connections as $key_id => $conn): ?>
                                <tr>
                                    <td><?php echo esc_html($key_id); ?></td>
                                    <td><?php echo esc_html($conn['project_id']); ?></td>
                                    <td><?php echo esc_html($conn['paired_at']); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>

                <h3>Generate Pairing Code</h3>
                <p>Generate a pairing code to connect this site to AutoBlogger:</p>
                <form method="post" action="">
                    <?php wp_nonce_field('autoblogger_generate_pair'); ?>
                    <input type="submit" name="autoblogger_generate_pair" class="button button-primary" value="Generate Pairing Code" />
                </form>

                <?php
                if (isset($_POST['autoblogger_generate_pair']) && check_admin_referer('autoblogger_generate_pair')) {
                    $pairing_code = wp_generate_password(16, false, false);
                    set_transient('autoblogger_pair_' . $pairing_code, true, 10 * MINUTE_IN_SECONDS);
                    ?>
                    <div class="notice notice-success">
                        <p><strong>Pairing Code (valid for 10 minutes):</strong></p>
                        <p class="autoblogger-pairing-code"><?php echo esc_html($pairing_code); ?></p>
                    </div>
                    <?php
                }
                ?>
            </div>

            <div class="autoblogger-card">
                <h2>Diagnostics</h2>
                <?php
                $wp_version = get_bloginfo('version');
                $rest_available = function_exists('rest_get_server');
                $uploads = wp_upload_dir();
                $uploads_writable = is_writable($uploads['basedir']);
                ?>
                <table class="wp-list-table widefat fixed striped">
                    <tbody>
                        <tr>
                            <td>WordPress Version</td>
                            <td><?php echo esc_html($wp_version); ?></td>
                            <td><?php echo version_compare($wp_version, '6.0', '>=') ? '<span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span> OK' : '<span class="dashicons dashicons-warning" style="color: #d63638;"></span> Update recommended'; ?></td>
                        </tr>
                        <tr>
                            <td>REST API</td>
                            <td><?php echo $rest_available ? 'Available' : 'Not available'; ?></td>
                            <td><?php echo $rest_available ? '<span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span> OK' : '<span class="dashicons dashicons-no-alt" style="color: #d63638;"></span> Error'; ?></td>
                        </tr>
                        <tr>
                            <td>Uploads Directory</td>
                            <td><?php echo esc_html($uploads['basedir']); ?></td>
                            <td><?php echo $uploads_writable ? '<span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span> Writable' : '<span class="dashicons dashicons-no-alt" style="color: #d63638;"></span> Not writable'; ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <style>
            .autoblogger-card {
                background: #fff;
                border: 1px solid #ccd0d4;
                box-shadow: 0 1px 1px rgba(0,0,0,.04);
                padding: 20px;
                margin: 20px 0;
                max-width: 800px;
            }
            .autoblogger-status {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 3px;
                font-weight: bold;
            }
            .autoblogger-status-connected {
                background: #46b450;
                color: #fff;
            }
            .autoblogger-status-disconnected {
                background: #d63638;
                color: #fff;
            }
            .autoblogger-pairing-code {
                font-family: monospace;
                font-size: 18px;
                background: #f0f0f1;
                padding: 10px;
                display: inline-block;
                margin-top: 10px;
            }
        </style>
        <?php
    }
}
