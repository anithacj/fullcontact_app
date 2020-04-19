<?php

namespace ElementorModal\Widgets;

if(!defined('ABSPATH')) {
	exit;
}

if (!class_exists('ElementorModal\Widgets\GT3_Elementor_PhotoGallery')) {
	class GT3_Elementor_PhotoGallery {
		const GALLERY = 'gt3-elementor-gallery';

		public static $JS_URL = 'js';
		public static $CSS_URL = 'css';
		public static $IMAGE_URL = 'css';
		private $min = '';
		const version = GT3_GalleryElementor_VERSION;

		///////////////////
		private $require_widgets = array(
			// Widgets
			'masonry-gt3' => 'Masonry',
			'grid-gt3'    => 'Grid',
		);

		private $controls = array(
			// Controls
			'gt3-elementor-core-gallery' => 'Gallery',
		);

		public function __construct(){
			$this->min       = '';//defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '' : '.min';
			self::$JS_URL    = plugins_url('/assets/js/', __FILE__);
			self::$CSS_URL   = plugins_url('/assets/css/', __FILE__);
			self::$IMAGE_URL = plugins_url('/assets/img/', __FILE__);
			$this->actions();
			if(!function_exists('aq_resize')) {
				include_once __DIR__.'/aq_resizer.php';
			}
			require_once __DIR__.'/elementor/cpt/gallery/init.php';
		}

		private function actions(){
			add_action('elementor/init', array( $this, 'elementor_init' ), 50);
			add_action('elementor/controls/controls_registered', array( $this, 'controls_registered' ));
			add_action('wp_enqueue_scripts', array( $this, 'enqueue_scripts' ));
			add_action('admin_enqueue_scripts', array( $this, 'enqueue_scripts' ));
			add_action('admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ));
			add_action('elementor/editor/after_enqueue_scripts', array( $this, 'editor_after_enqueue_scripts' ));
			add_action('elementor/frontend/after_enqueue_scripts', array( $this, 'frontend_after_enqueue_scripts' ));
			add_action('elementor/editor/after_enqueue_styles', array( $this, 'editor_after_enqueue_styles' ));
			add_action('wp_footer', array( $this, 'wp_footer' ), 1);
		}

		public function wp_footer(){
			if(isset($GLOBALS['gt3_elementor_gallery__footer'])) {
				?>
				<div
						id="popup_gt3_elementor_gallery"
						class="gt3pg_gallery_wrap gt3pg_wrap_controls gt3_gallery_type_lightbox gt3pg_version_lite">
					<div class="gt3pg_slide_header">
						<div class="free-space"></div>
						<div class="gt3pg_close_wrap">
							<div class="gt3pg_close"></div>
						</div>
					</div>

					<div class="gt3pg_slides"></div>
					<div class="gt3pg_slide_footer">
						<div class="gt3pg_title_wrap">
							<div class="gt3pg_title gt3pg_clip"></div>
							<div class="gt3pg_description gt3pg_clip"></div>
						</div>
						<div class="free-space"></div>
						<div class="gt3pg_caption_wrap">
							<div class="gt3pg_caption_current"></div>
							<div class="gt3pg_caption_delimiter"></div>
							<div class="gt3pg_caption_all"></div>
						</div>
					</div>

					<div class="gt3pg_controls">
						<div class="gt3pg_prev_wrap">
							<div class="gt3pg_prev"></div>
						</div>
						<div class="gt3pg_next_wrap">
							<div class="gt3pg_next"></div>
						</div>
					</div>
				</div>
				<?php
				echo $GLOBALS['gt3_elementor_gallery__footer'];
				unset($GLOBALS['gt3_elementor_gallery__footer']);
			};
		}


		public function elementor_init(){
			\Elementor\Plugin::instance()->elements_manager->add_category(
				'gt3-gallery-elements',
				array(
					'title' => 'GT3 Galleries',
					'icon'  => 'fa fa-plug'
				)
			);

			$this->include_files();
		}

		public function controls_registered($controls_manager){
			if(is_array($this->controls) && !empty($this->controls)) {
				foreach($this->controls as $module) {
					/** @var \Elementor\\GT3_Elementor_Core_Control_{$module} $module */
					$module = sprintf('Elementor\\GT3_Core_Elementor_Control_%s', $module);

					if(class_exists($module)) {
						if($controls_manager->get_control($module::type()) === false) {
							$controls_manager->register_control($module::type(), new $module);
						}
					}
				}
			}
		}

		private function include_files(){
			foreach($this->require_widgets as $slug => $module) {
				$dir = __DIR__.'/elementor/widgets/'.strtolower($module).'.php';
				if(file_exists($dir) && is_readable($dir)) {
					require_once $dir;
					$module = sprintf('ElementorModal\\Widgets\\GT3_ElementorPhoto_%s', $module);
					if(class_exists($module)) {
						new $module();
					}
				}
			}

			$this->controls = apply_filters('gt3/elementor/controls/register', $this->controls);

			if(is_array($this->controls) && !empty($this->controls)) {
				foreach($this->controls as $slug => $module) {
					require_once __DIR__.'/elementor/controls/'.strtolower($module).'.php';
				}
			}
		}

		public static function get_galleries(){
			$galleries = array();
			$args      = array(
				'post_status' => 'publish',
				'post_type'   => 'gt3_gallery',
			);

			$gt3_posts = new \WP_Query($args);
			if($gt3_posts->post_count > 0) {
				foreach($gt3_posts->posts as $gallery) {
					/* @var \WP_Post $gallery */
					$galleries[$gallery->ID] = !empty($gallery->post_title) ? $gallery->post_title : esc_html__('(No Title)', 'gt3_elementor_photo_gallery');
				}
			}

			return $galleries;
		}

		public static function get_galleries_categories(){
			$terms  = get_terms(array(
				'taxonomy'   => 'gt3_gallery_category',
				'hide_empty' => true,
			));
			$return = array();
			if(is_array($terms) && count($terms)) {
				foreach($terms as $term) {
					/* @var \WP_Term $term */
					$return[$term->slug] = $term->name.' ('.$term->slug.')';
				}
			}

			return $return;
		}

		public static function get_video_type_from_description($video_url){
			if(strpos($video_url, 'youtu') !== false) {
				return 'youtube';
			}
			if(strpos($video_url, 'vimeo') !== false) {
				return 'vimeo';
			}

			return false;
		}

		public static function get_youtube_id($video_url){
			$result = array( '', '' );
			preg_match("#([\/|\?|&]vi?[\/|=]|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})#", $video_url, $result);
			if(is_array($result) && count($result)) {
				return end($result);
			}

			return false;
		}

		public static function get_vimeo_id($video_url){
			$result = '';
			preg_match('#([0-9]+)#is', $video_url, $result);
			if(is_array($result) && isset($result[1])) {
				$result = $result[1];
			}

			return $result;
		}

		public static function get_video_type_by_link($link){
			$result = wp_remote_head($link);
			if($result instanceof \WP_Error) {
				return 404;
			} else if($result['response']['code'] == 404) {
				return 404;
			} else {
				$result = $result['headers']->getAll();

				return $result['content-type'];
			}
		}

		public function admin_enqueue_scripts(){
//		wp_enqueue_style('cpt-gallery', plugins_url('/assets/css/cpt-gallery'.$this->min.'.css', __FILE__));
//		wp_enqueue_script('cpt-gallery', plugins_url('/assets/js/cpt-gallery'.$this->min.'.js', __FILE__), array(), $this::version, true);
		}

		public function enqueue_scripts(){
			// CSS
			wp_register_style('slick', plugins_url('/assets/css/slick'.$this->min.'.css', __FILE__));

			// JS
//		wp_enqueue_script('gt3-elementor-gallery-frontend', plugins_url('/assets/js/frontend'.$this->min.'.js', __FILE__), array(), $this::version, true);
			// Video
			wp_register_script('youtube-iframe', 'https://www.youtube.com/iframe_api', array(), null, true);
			wp_register_script('vimeo-iframe', 'https://player.vimeo.com/api/player.js', array(), null, true);
			// Local
			wp_register_script('slick', plugins_url('/assets/js/slick.js', __FILE__), array( 'jquery' ), null, true);
			wp_register_script('isotope', plugins_url('/assets/js/jquery.isotope.min.js', __FILE__), array( 'jquery' ), null, true);
			wp_register_script('kenburns', plugins_url('/assets/js/kenburns.js', __FILE__), array( 'jquery' ), null, true);
			wp_register_script('gt3_swipebox_js', plugins_url('/assets/js/swipebox/js/jquery.swipebox.min.js', __FILE__), array(), false, true);
			// Lightbox
			wp_register_script('elementor-blueimp-gallery', plugins_url('/assets/js/gallery/gallery'.$this->min.'.js', __FILE__), array(), '', true);
			wp_enqueue_style('elementor-blueimp-gallery', plugins_url('/assets/css/gallery'.$this->min.'.css', __FILE__));
		}

		public function frontend_after_enqueue_scripts(){
			wp_enqueue_script('gt3-elementor-gallery-frontend', plugins_url('/dist/frontend.js', __FILE__), array(), $this::version, true);
			wp_localize_script(
				'gt3-elementor-gallery-frontend',
				'gt3_ajax_url',
				array( 'ajaxurl' => admin_url('admin-ajax.php') )
			);
			wp_enqueue_style('gt3-elementor-gallery-frontend', plugins_url('/dist/frontend.css', __FILE__), array(), $this::version);
		}

		public function editor_after_enqueue_scripts(){
			wp_enqueue_script('Sortable', plugins_url('/assets/js/Sortable.min.js', __FILE__), array(), '1.7.0', true
			);
			wp_enqueue_script('gt3-elementor-gallery-editor.js', plugins_url('/assets/js/editor'.$this->min.'.js', __FILE__), array(), $this::version, true);

			wp_localize_script('gt3-elementor-gallery-editor.js',
				'gt3_i18l_Elementor_Editor ',
				apply_filters('gt3_cpt_gallery_media_localize_script', array(
						'add'                => esc_html_x('+ Add Media', 'media', 'gt3_elementor_photo_gallery'),
						'clearGallery'       => esc_html_x('Clear Gallery', 'media', 'gt3_elementor_photo_gallery'),
						'single'             => esc_html_x(' file selected', 'media', 'gt3_elementor_photo_gallery'),
						'multiple'           => esc_html_x(' files selected', 'media', 'gt3_elementor_photo_gallery'),
						'remove'             => esc_html_x('Remove', 'media', 'gt3_elementor_photo_gallery'),
						'edit'               => esc_html_x('Edit', 'media', 'gt3_elementor_photo_gallery'),
						'view'               => esc_html_x('View', 'media', 'gt3_elementor_photo_gallery'),
						'noTitle'            => esc_html_x('No Title', 'media', 'gt3_elementor_photo_gallery'),
						'select'             => esc_html_x('Select Files', 'media', 'gt3_elementor_photo_gallery'),
						'or'                 => esc_html_x('or', 'media', 'gt3_elementor_photo_gallery'),
						'uploadInstructions' => esc_html_x('Drop Files Here to Upload', 'media', 'gt3_elementor_photo_gallery'),
						'clearAllConfirm'    => esc_html_x('Are you really want remove all images?', 'media', 'gt3_elementor_photo_gallery'),
						'imagesSelected'     => esc_html_x('Images Selected ', 'media', 'gt3_elementor_photo_gallery'),
						'noImagesSelected'   => esc_html_x('No Images Selected', 'media', 'gt3_elementor_photo_gallery'),
						'clear'              => esc_html_x('Clear', 'media', 'gt3_elementor_photo_gallery'),
						'insertMedia'        => esc_html_x('Insert media', 'media', 'gt3_elementor_photo_gallery'),
					)
				)
			);
		}

		public function editor_after_enqueue_styles(){
			wp_enqueue_style('gt3-elementor-gallery-editor.css', plugins_url('/dist/editor'.$this->min.'.css', __FILE__), array(), $this::version);
		}
	}

	new GT3_Elementor_PhotoGallery();

}


