<?php
/**
 * Media Handler Class
 */

class AutoBlogger_Media_Handler {

    /**
     * Import media from URL
     *
     * @param WP_REST_Request $request The request
     * @return WP_REST_Response|WP_Error Response or error
     */
    public function import($request) {
        $source_url = esc_url_raw($request->get_param('source_url'));
        $filename = sanitize_file_name($request->get_param('filename'));
        $alt = sanitize_text_field($request->get_param('alt'));

        // Validate URL
        if (!filter_var($source_url, FILTER_VALIDATE_URL)) {
            return new WP_Error(
                'invalid_url',
                'Invalid source URL',
                array('status' => 400)
            );
        }

        // Download file
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');

        $tmp_file = download_url($source_url);

        if (is_wp_error($tmp_file)) {
            return new WP_Error(
                'download_failed',
                'Failed to download file: ' . $tmp_file->get_error_message(),
                array('status' => 400)
            );
        }

        // Prepare file for WordPress
        $file_array = array(
            'name' => $filename,
            'tmp_name' => $tmp_file,
        );

        // Check file type
        $filetype = wp_check_filetype_and_ext($file_array['tmp_name'], $filename);
        if (!$filetype['type'] || strpos($filetype['type'], 'image/') !== 0) {
            @unlink($tmp_file);
            return new WP_Error(
                'invalid_file_type',
                'File must be an image',
                array('status' => 400)
            );
        }

        // Upload to media library
        $media_id = media_handle_sideload($file_array, 0);

        if (is_wp_error($media_id)) {
            @unlink($tmp_file);
            return $media_id;
        }

        // Set alt text
        if (!empty($alt)) {
            update_post_meta($media_id, '_wp_attachment_image_alt', $alt);
        }

        return array(
            'media_id' => $media_id,
            'url' => wp_get_attachment_url($media_id),
        );
    }
}
