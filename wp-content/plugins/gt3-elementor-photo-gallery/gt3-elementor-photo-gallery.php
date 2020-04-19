<?php
/*
	Plugin Name: GT3 Elementor Photo Gallery
	Plugin URI: https://gt3themes.com/
	Description: Easy to use GT3 photo gallery for Elementor drag and drop page builder. Build your creative online photo galleries fast.
	Version: 1.0.7
	Author: GT3 Themes
	Author URI: https://gt3themes.com/
*/
function gt3_elementor_photo_gallery__meta_links( $meta_fields, $file ) {
	if ( plugin_basename( __FILE__ ) == $file ) {
		$meta_fields[] = "<a href='https://wordpress.org/support/plugin/gt3-elementor-photo-gallery' target='_blank'>" . esc_html__( 'Support Forum', 'gt3_elementor_photo_gallery' ) . "</a>";
		$meta_fields[] = "<a href='https://wordpress.org/support/plugin/gt3-elementor-photo-gallery/reviews/#new-post' target='_blank' title='" . esc_html__( 'Rate', 'gt3_elementor_photo_gallery' ) . "'>
            <i class='gt3-rate-stars'>"
		                 . "<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-star'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/></svg>"
		                 . "<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-star'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/></svg>"
		                 . "<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-star'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/></svg>"
		                 . "<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-star'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/></svg>"
		                 . "<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-star'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/></svg>"
		                 . "</i></a>";

		$stars_color = "#ffb900";

		echo "<style>"
		     . ".gt3-rate-stars{display:inline-block;color: #ffb900;position:relative;top:3px;}"
		     . ".gt3-rate-stars svg{fill: #ffb900;}"
		     . ".gt3-rate-stars svg:hover{fill: #ffb900}"
		     . ".gt3-rate-stars svg:hover ~ svg{fill:none;}"
		     . "</style>";
	}

	return $meta_fields;
}

add_filter( "plugin_row_meta", 'gt3_elementor_photo_gallery__meta_links', 10, 2 );


if(!version_compare(PHP_VERSION, '5.6', '>=')) {
	add_action('admin_notices', 'gt3_elementor_photo_gallery__fail_php_version');
	return;
} else {
	require_once __DIR__.'/init.php';
}

function gt3_elementor_photo_gallery__fail_php_version() {
	$message      = sprintf('GT3 Elementor Gallery requires PHP version %1$s+, plugin is currently NOT ACTIVE.', '5.6');
	$html_message = sprintf('<div class="error">%s</div>', wpautop($message));
	echo wp_kses_post($html_message);
}
