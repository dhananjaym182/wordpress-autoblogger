<?php
/**
 * Terms Handler Class
 */

class AutoBlogger_Terms_Handler {

    /**
     * Ensure categories and tags exist
     *
     * @param WP_REST_Request $request The request
     * @return WP_REST_Response Response with term IDs
     */
    public function ensure($request) {
        $categories = $request->get_param('categories');
        $tags = $request->get_param('tags');

        $result = array(
            'categories' => array(),
            'tags' => array(),
        );

        // Ensure categories
        if (!empty($categories) && is_array($categories)) {
            foreach ($categories as $category_name) {
                $term = get_term_by('name', $category_name, 'category');
                if (!$term) {
                    $term = wp_insert_term($category_name, 'category');
                    if (!is_wp_error($term)) {
                        $result['categories'][$category_name] = $term['term_id'];
                    }
                } else {
                    $result['categories'][$category_name] = $term->term_id;
                }
            }
        }

        // Ensure tags
        if (!empty($tags) && is_array($tags)) {
            foreach ($tags as $tag_name) {
                $term = get_term_by('name', $tag_name, 'post_tag');
                if (!$term) {
                    $term = wp_insert_term($tag_name, 'post_tag');
                    if (!is_wp_error($term)) {
                        $result['tags'][$tag_name] = $term['term_id'];
                    }
                } else {
                    $result['tags'][$tag_name] = $term->term_id;
                }
            }
        }

        return $result;
    }
}
