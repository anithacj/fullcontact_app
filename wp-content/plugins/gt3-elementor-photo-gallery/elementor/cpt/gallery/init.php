<?php

if(!defined('ABSPATH')) {
	exit;
}

if(!class_exists('GT3_Post_Type_Gallery')) {
	class GT3_Post_Type_Gallery {
		private static $instance = null;
		const post_type = 'gt3_gallery';
		const taxonomy = 'gt3_gallery_category';
		const VERSION = '1.0.0';

		public static function instance(){
			if(!self::$instance instanceof self) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		private function __construct(){
			if(post_type_exists(self::post_type)) {
				return;
			}
			add_action('init', array( $this, 'init' ));
			add_action('manage_'.self::post_type.'_posts_custom_column', array( $this, 'manage_posts_custom_column' ), 10, 2);

			add_filter('manage_'.self::post_type.'_posts_columns', array( $this, 'manage_posts_columns' ));
			add_action('add_meta_boxes', array( $this, 'add_meta_boxes' ));
			add_action('print_media_templates', array( $this, 'print_media_templates' ));
			add_action('save_post', array( $this, 'save_post' ));
			add_action('admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ));
		}

		public function init(){
			register_post_type(self::post_type,
				array(
					'label'               => esc_html__('GT3 Galleries', 'gt3_elementor_photo_gallery'),
					'show_ui'             => true,
					'rewrite'             => array(
						'slug'       => self::post_type,
						'with_front' => false
					),
					'hierarchical'        => true,
					'menu_position'       => 4,
					'publicly_queryable'  => false,
					'public'              => false,
					'show_in_nav_menus'   => false,
					'exclude_from_search' => true,
					'supports'            => array(
						'title',
						'thumbnail'
					),
					'menu_icon'           => 'dashicons-format-gallery',
				)
			);
			register_taxonomy(
				self::taxonomy,
				self::post_type,
				array(
					'hierarchical'  => true,
					'label'         => esc_html__('Category', 'gt3_elementor_photo_gallery'),
					'singular_name' => esc_html__('Category', 'gt3_elementor_photo_gallery'),
				)
			);
		}

		public function add_meta_boxes(){
			add_meta_box(
				'cpt-'.self::post_type.'_section',
				esc_html__('Gallery Images', 'gt3_elementor_photo_gallery'),
				array( $this, 'render_meta_box' ),
				self::post_type,
				'normal',
				'high'
			);
		}

		public function render_meta_box($post){
			if(get_post_type() === self::post_type) {
				printf(
					'<input class="gt3-image_advanced" name="cpt_%1$s_images" type="hidden" value="%2$s">
			<div class="gt3-media-view" data-mime-type="%3$s" data-max-files="%4$s" data-force-delete="%5$s" data-show-status="%6$s"></div>',
					self::post_type,
					get_post_meta($post->ID, sprintf('_cpt_%s_images', self::post_type), true),
					'image',
					false,
					false,
					1
				);
			}
		}

		public function manage_posts_columns(){
			return array(
				'cb'           => '<input type="checkbox" />',
				'thumbnail'    => esc_html__('Image', 'gt3_elementor_photo_gallery'),
				'title'        => esc_html__('Title', 'gt3_elementor_photo_gallery'),
				self::taxonomy => esc_html__('Category', 'gt3_elementor_photo_gallery'),
				'date'         => esc_html__('Date', 'gt3_elementor_photo_gallery'),
			);
		}

		public function manage_posts_custom_column($column, $post_id){
			$this_url = $_SERVER['REQUEST_URI'];
			switch($column) {
				case 'thumbnail':
					echo '<div class="preview_img" style="width: 50px; height: 50px;">';
					if(get_post_thumbnail_id($post_id)) {
						$img_src = wp_get_attachment_image_src(get_post_thumbnail_id($post_id));
						echo '<img width="50" height="50" src="'.$img_src[0].'" />';
					} else {
						$gallery = self::get_gallery_images(get_the_ID());
						$echo    = '';
						if(is_array($gallery) && count($gallery)) {
							foreach($gallery as $image) {
								$img_src = wp_get_attachment_image_src($image);
								$echo    = '<img width="50" height="50" src="'.$img_src[0].'" />';
								if(!empty($echo)) {
									break;
								}
							}
						}
						if(empty($echo)) {
							$echo = '<img width="50" height="50" src="'.plugins_url('/assets/img/add-images.jpg',__FILE__).'" alt="'.esc_attr__('No Image Selected', 'gt3_elementor_photo_gallery').'"/>';
						}
						echo $echo;
					}
					echo '</div>';
					break;

				case self::taxonomy:
					$this_url  = remove_query_arg($column, $this_url);
					$post_cats = wp_get_post_terms($post_id, self::taxonomy);
					$cats      = array();
					foreach($post_cats as $post_cat_term) {
						if(!empty($_GET[$column]) && $_GET[$column] == $post_cat_term->slug) {
							$cats[] = '<a href="'.$this_url.'">'.$post_cat_term->name.'</a>';
						} else {
							$cats[] = '<a href="'.add_query_arg(array( $column => $post_cat_term->slug ), $this_url).'">'.$post_cat_term->name.'</a>';
						}
					}
					if(count($cats)) {
						echo implode(', ', $cats);
					}
					break;
			}
		}

		public function print_media_templates(){
			if(!defined(self::post_type.'_media_template')) {
				define(self::post_type.'_media_template', true);
				require_once __DIR__.'/media.php';
			}
		}

		public function save_post($post_id){
			if((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)
			   || !current_user_can('edit_post', $post_id)
			   || get_post_type() !== self::post_type) {
				return;
			}
			$field = sprintf('cpt_%s_images', self::post_type);

			$save_data = (!isset($_POST[$field]) || empty($_POST[$field])) ? '' : $_POST[$field];
			update_post_meta($post_id, '_'.$field, $save_data);
		}


		public static function get_gallery_images($post_id, $with_id = false){
			$gallery = trim(get_post_meta($post_id, sprintf('_cpt_%s_images', self::post_type), true));
			if(!empty($gallery)) {
				$gallery = explode(',', $gallery);
			}
			if(!is_array($gallery)) {
				$gallery = array();
			}
			if($with_id !== false && count($gallery)) {
				$gallery_temp = array();
				foreach($gallery as $image) {
					$gallery_temp[] = array(
						'id' => $image,
					);
				}
				$gallery = $gallery_temp;
			}

			return $gallery;
		}

		public static function get_galleries(){
			$galleries = array();
			$args      = array(
				'post_status' => 'publish',
				'post_type'   => self::post_type,
			);

			$posts = new \WP_Query($args);
			if($posts->post_count > 0) {
				foreach($posts->posts as $gallery) {
					/* @var \WP_Post $gallery */
					$galleries[$gallery->ID] = !empty($gallery->post_title) ? $gallery->post_title : esc_html__('(No Title)', 'gt3_elementor_photo_gallery');
				}
			}

			return $galleries;
		}

		public static function get_galleries_categories(){
			$terms  = get_terms(array(
				'taxonomy'   => self::taxonomy,
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

		public function admin_enqueue_scripts(){
			wp_enqueue_style('gt3-cpt-gallery', plugins_url('/assets/cpt-gallery.css', __FILE__), array(), self::VERSION);

			wp_enqueue_script('gt3-cpt-gallery-media', plugins_url('/assets/cpt-gallery.js', __FILE__), array(
				'jquery-ui-sortable',
				'underscore',
				'backbone',
				'media-grid'
			), self::VERSION, true);

			wp_localize_script('gt3-cpt-gallery-media',
				'i18n_GT3Media_Gallery',
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
					)
				)
			);

		}
	}

	if(!function_exists('gt3_post_type_gallery')) {
		/* @return \GT3_Post_Type_Gallery */
		function gt3_post_type_gallery(){
			return \GT3_Post_Type_Gallery::instance();
		}
	}

	gt3_post_type_gallery();
}



