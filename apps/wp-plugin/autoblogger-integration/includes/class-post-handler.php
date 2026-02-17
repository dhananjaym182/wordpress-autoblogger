<?php
/**
 * Post Handler Class
 */

class AutoBlogger_Post_Handler {

    /**
     * Upsert post (create or update)
     *
     * @param WP_REST_Request $request The request
     * @return WP_REST_Response|WP_Error Response or error
     */
    public function upsert($request) {
        $external_id = sanitize_text_field($request->get_param('external_id'));
        $title = sanitize_text_field($request->get_param('title'));
        $content = wp_kses_post($request->get_param('content'));
        $excerpt = sanitize_textarea_field($request->get_param('excerpt'));
        $status = sanitize_text_field($request->get_param('status'));
        $date_gmt = $request->get_param('date_gmt');
        $slug = sanitize_title($request->get_param('slug'));
        $categories = $request->get_param('categories');
        $tags = $request->get_param('tags');
        $featured_media = intval($request->get_param('featured_media'));
        $meta_title = sanitize_text_field($request->get_param('meta_title'));
        $meta_description = sanitize_textarea_field($request->get_param('meta_description'));

        // Find existing post by external_id
        $existing = get_posts(array(
            'meta_key' => 'autoblogger_external_id',
            'meta_value' => $external_id,
            'post_type' => 'post',
            'post_status' => 'any',
            'posts_per_page' => 1,
        ));

        $post_data = array(
            'post_title' => $title,
            'post_content' => $content,
            'post_excerpt' => $excerpt,
            'post_status' => $status,
            'post_name' => $slug,
            'post_date_gmt' => $date_gmt ? gmdate('Y-m-d H:i:s', strtotime($date_gmt)) : null,
        );

        if (!empty($existing)) {
            // Update existing post
            $post_id = $existing[0]->ID;
            $post_data['ID'] = $post_id;
            $result = wp_update_post($post_data, true);
        } else {
            // Create new post
            $post_id = wp_insert_post($post_data, true);
            update_post_meta($post_id, 'autoblogger_external_id', $external_id);
        }

        if (is_wp_error($result)) {
            return $result;
        }

        // Set categories
        if (!empty($categories) && is_array($categories)) {
            $category_ids = array();
            foreach ($categories as $category_name) {
                $term = get_term_by('name', $category_name, 'category');
                if (!$term) {
                    $term = wp_insert_term($category_name, 'category');
                    $category_id = is_wp_error($term) ? 0 : $term['term_id'];
                } else {
                    $category_id = $term->term_id;
                }
                if ($category_id) {
                    $category_ids[] = $category_id;
                }
            }
            wp_set_object_terms($post_id, $category_ids, 'category');
        }

        // Set tags
        if (!empty($tags) && is_array($tags)) {
            $tag_ids = array();
            foreach ($tags as $tag_name) {
                $term = get_term_by('name', $tag_name, 'post_tag');
                if (!$term) {
                    $term = wp_insert_term($tag_name, 'post_tag');
                    $tag_id = is_wp_error($term) ? 0 : $term['term_id'];
                } else {
                    $tag_id = $term->term_id;
                }
                if ($tag_id) {
                    $tag_ids[] = $tag_id;
                }
            }
            wp_set_object_terms($post_id, $tag_ids, 'post_tag');
        }

        // Set featured image
        if ($featured_media) {
            set_post_thumbnail($post_id, $featured_media);
        }

        // Set SEO meta
        if (!empty($meta_title)) {
            update_post_meta($post_id, '_yoast_wpseo_title', $meta_title);
        }
        if (!empty($meta_description)) {
            update_post_meta($post_id, '_yoast_wpseo_metadesc', $meta_description);
        }

        return array(
            'post_id' => $post_id,
            'status' => get_post_status($post_id),
            'edit_url' => get_edit_post_link($post_id, 'db'),
            'public_url' => get_permalink($post_id),
        );
    }
}
