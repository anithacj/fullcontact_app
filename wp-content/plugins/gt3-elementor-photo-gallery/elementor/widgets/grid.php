<?php

	namespace ElementorModal\Widgets;

	use Elementor\Group_Control_Image_Size;
	use Elementor\Plugin;
	use Elementor\Repeater;
	use Elementor\Widget_Base;
	use Elementor\Controls_Manager;
	use Elementor\Group_Control_Typography;
	use Elementor\Scheme_Typography;
	use Elementor\Scheme_Color;
	use Elementor\Group_Control_Border;
	use Elementor\Group_Control_Background;
	use Elementor\Group_Control_Box_Shadow;
	use Elementor\Frontend;
	use WP_Query;
	use Elementor\GT3_Core_Elementor_Control_Query;


	if(!defined('ABSPATH')) {
		exit;
	} // Exit if accessed directly

	class GT3_ElementorPhoto_Grid extends Widget_Base {

		public function get_title(){
			return esc_html__('Grid', 'gt3_elementor_photo_gallery');
		}

		public function get_icon(){
			return 'eicon-gallery-grid';
		}

		public function get_name(){
			return 'grid-gt3';
		}

		public function get_categories(){
			return array( 'gt3-gallery-elements' );
		}

		public function __construct(array $data = [], $args = null){
			parent::__construct($data, $args);
			$this->actions();
		}

		private function actions(){
			add_action('elementor/widgets/widgets_registered', function($widgets_manager){
				/* @var \Elementor\Widgets_Manager $widgets_manager */
				$widgets_manager->register_widget_type($this);
			});

			add_action('wp_ajax_gt3_grid_load_images', array( $this, 'ajax_handler' ));
			add_action('wp_ajax_nopriv_gt3_grid_load_images', array( $this, 'ajax_handler' ));
		}

		public function get_script_depends(){
			return array(
				'isotope',
				'elementor-blueimp-gallery',
				'imagesloaded',
			);
		}
		private function serializeImages(&$settings){
			$array = array();
			switch($settings['select_source']) {
				case 'gallery':
					$settings['slides'] = \GT3_Post_Type_Gallery::get_gallery_images($settings['gallery']);
				case 'module':
					if(is_array($settings['slides']) && count($settings['slides'])) {
						foreach($settings['slides'] as $key => $image) {
							$array[] = array( 'id' => $image );
						}
					}
					break;
				case 'categories':
					$args = array(
						'post_status'    => 'publish',
						'post_type'      => \GT3_Post_Type_Gallery::post_type,
						'order'          => 'desc',
						'paged'          => 1,
						'posts_per_page' => -1,
					);
					if(isset($settings['categories']) && !empty($settings['categories'])) {
						$args['tax_query']   = array(
							'relation' => 'AND',
						);
						$args['tax_query'][] = array(
							'field'    => 'slug',
							'taxonomy' => \GT3_Post_Type_Gallery::taxonomy,
							'operator' => 'IN',
							'terms'    => $settings['categories'],
						);
					}
					$module_wp_query = new \WP_Query($args);
					$slides          = array();
					if($module_wp_query->post_count) {
						$max_count = 0;
						while($module_wp_query->have_posts()) {
							$module_wp_query->the_post();
							/* @var \WP_Post $image_post */
							$gallery_id     = get_the_ID();
							$images_gallery = \GT3_Post_Type_Gallery::get_gallery_images($gallery_id);
							if(isset($images_gallery) && is_array($images_gallery) && count($images_gallery)) {
								$categories = get_the_terms($gallery_id, \GT3_Post_Type_Gallery::taxonomy);
								if(!$categories || is_wp_error($categories)) {
									$categories = array();
								}
								if(count($categories)) {
									foreach($categories as $category) {
										/* @var \WP_Term $category */
										if(!isset($settings['filter_array'][$category->slug])
										   && is_array($settings['categories'])
										   && count($settings['categories'])
										   && in_array($category->slug, $settings['categories'])) {
											$settings['filter_array'][$category->slug] = array(
												'slug' => $category->slug,
												'name' => $category->name,
											);
										}
									}
								}
								foreach($images_gallery as $slide) {
									$slides[$gallery_id][] = array(
										'id' => $slide,
										'p'  => $gallery_id,
									);
								}
								if($max_count < count($slides[$gallery_id])) {
									$max_count = count($slides[$gallery_id]);
								}
							}
						}
						for($i = 0; $i < $max_count; $i++) {
							foreach($slides as $slide_array) {
								if(isset($slide_array[$i])) {
									$array[] = $slide_array[$i];
								}
							}
						}

						wp_reset_postdata();
					}
					break;
			}
			$settings['slides'] = $array;
		}

		public function ajax_handler(){
			header('Content-Type: application/json');

			$respond = '';
			if(isset($_POST['lightbox']) && ($_POST['lightbox'] === true || $_POST['lightbox'] == 'true')) {
				$_POST['lightbox'] = true;
			} else {
				$_POST['lightbox'] = false;
			}

			if(isset($_POST['title']) && ($_POST['title'] === true || $_POST['title'] == 'true')) {
				$_POST['title'] = true;
			} else {
				$_POST['title'] = false;
			}

			if(isset($_POST['show_category']) && ($_POST['show_category'] === true || $_POST['show_category'] == 'true')) {
				$_POST['show_category'] = true;
			} else {
				$_POST['show_category'] = false;
			}
			$gallery_items = array();

			foreach($_POST['images'] as $image) {
				if($_POST['lightbox']) {
					$image           = wp_prepare_attachment_for_js($image['id']);
					$gallery_items[] = array(
						'href'        => $image['url'],
						'title'       => $image['title'],
						'thumbnail'   => $image['sizes']['thumbnail']['url'],
						'description' => $image['caption'],
						'is_video'    => 0,
						'image_id'    => $image['id'],
					);
				}
				$respond .= $this->renderItem($image, $_POST['source'], $_POST['lightbox'], $_POST['title'], $_POST['show_category']);
			}

			die(wp_json_encode(array(
				'post_count'    => count($_POST['images']),
				'respond'       => $respond,
				'gallery_items' => $gallery_items,
			)));
		}

		//////////////////////////

		protected function _register_controls(){


			$this->start_controls_section(
				'basic_section',
				array(
					'label' => 'Basic',
				)
			);

			if(post_type_exists('gt3_gallery')) {
				$this->add_control(
					'select_source',
					array(
						'label'       => esc_html__('Select Source', 'gt3_elementor_photo_gallery'),
						'type'        => Controls_Manager::SELECT,
						'options'     => array(
							'module'     => esc_html__('Module Images', 'gt3_elementor_photo_gallery'),
							'gallery'    => esc_html__('Gallery', 'gt3_elementor_photo_gallery'),
						),
						'default'     => 'module',
					)
				);

				$this->add_control(
					'gallery',
					array(
						'label'     => esc_html__('Select Gallery', 'gt3_elementor_photo_gallery'),
						'type'      => Controls_Manager::SELECT2,
						'options'   => \GT3_Post_Type_Gallery::get_galleries(),
						'condition' => array(
							'select_source' => 'gallery',
						),
					)
				);

				$this->add_control(
					'slides',
					array(
						'type'      => \Elementor\GT3_Core_Elementor_Control_Gallery::type(),
						'condition' => array(
							'select_source' => 'module',
						),
					)
				);
			} else {
				$this->add_control(
					'slides',
					array(
						'type'      => \Elementor\GT3_Core_Elementor_Control_Gallery::type(),
					)
				);
			}

			$this->add_control(
				'grid_type',
				array(
					'label'   => esc_html__('Grid Type', 'gt3_elementor_photo_gallery'),
					'type'    => Controls_Manager::SELECT,
					'options' => array(
						'vertical'  => esc_html__('Vertical Align', 'gt3_elementor_photo_gallery'),
						'square'    => esc_html__('Square', 'gt3_elementor_photo_gallery'),
						'rectangle' => esc_html__('Rectangle', 'gt3_elementor_photo_gallery'),
					),
					'default' => 'square',
				)
			);

			$this->add_control(
				'cols',
				array(
					'label'   => esc_html__('Cols', 'gt3_elementor_photo_gallery'),
					'type'    => Controls_Manager::SELECT,
					'options' => array(
						'1' => '1',
						'2' => '2',
						'3' => '3',
						'4' => '4',
					),
					'default' => 4,
				)
			);

			$this->add_responsive_control(
				'grid_gap',
				array(
					'label'     => esc_html__('Grid Gap', 'gt3_elementor_photo_gallery'),
					'type'      => Controls_Manager::SELECT,
					'options'   => array(
						'0'    => '0',
						'1px'  => '1px',
						'2px'  => '2px',
						'3px'  => '3px',
						'4px'  => '4px',
						'5px'  => '5px',
						'10px' => '10px',
						'15px' => '15px',
						'20px' => '20px',
						'25px' => '25px',
						'30px' => '30px',
						'35px' => '35px',

						'2%'    => '2%',
						'4.95%' => '5%',
						'8%'    => '8%',
						'10%'   => '10%',
						'12%'   => '12%',
						'15%'   => '15%',
					),
					'default'   => '0',
					'selectors' => array(
						'{{WRAPPER}} .isotope_wrapper' => 'margin-right:-{{VALUE}}; margin-bottom:-{{VALUE}};',
						'{{WRAPPER}} .isotope_item'    => 'padding-right: {{VALUE}}; padding-bottom:{{VALUE}};',
					)
				)
			);

			$this->add_control(
				'hover',
				array(
					'label'       => esc_html__('Hover Effect', 'gt3_elementor_photo_gallery'),
					'type'        => Controls_Manager::SELECT,
					'options'     => array(
						'none'  => esc_html__('None', 'gt3_elementor_photo_gallery'),
						'type1' => esc_html__('Type 1', 'gt3_elementor_photo_gallery'),
						'type2' => esc_html__('Type 2', 'gt3_elementor_photo_gallery'),
						'type3' => esc_html__('Type 3', 'gt3_elementor_photo_gallery'),
						'type4' => esc_html__('Type 4', 'gt3_elementor_photo_gallery'),
						'type5' => esc_html__('Type 5', 'gt3_elementor_photo_gallery'),
					),
					'default'     => 'type1',
					'label_block' => true,
				)
			);

			$this->add_control(
				'lightbox',
				array(
					'label' => esc_html__('Lightbox', 'gt3_elementor_photo_gallery'),
					'type'  => Controls_Manager::SWITCHER,
				)
			);

			$this->add_control(
				'show_title',
				array(
					'label' => esc_html__('Show Title', 'gt3_elementor_photo_gallery'),
					'type'  => Controls_Manager::SWITCHER,
				)
			);

			$this->add_control(
				'show_category',
				array(
					'label'     => esc_html__('Show Category', 'gt3_elementor_photo_gallery'),
					'type'      => Controls_Manager::SWITCHER,
					'condition' => array(
						'select_source' => 'categories',
					)
				)
			);

			$this->add_control(
				'post_per_load',
				array(
					'label'   => esc_html__('Post Per Load', 'gt3_elementor_photo_gallery'),
					'type'    => Controls_Manager::NUMBER,
					'min'     => 1,
					'step'    => 1,
					'default' => 12,
				)
			);

			$this->add_control(
				'show_view_all',
				array(
					'label' => esc_html__('Show "See More" Button', 'gt3_elementor_photo_gallery'),
					'type'  => Controls_Manager::SWITCHER,
				)
			);

			$this->add_control(
				'load_items',
				array(
					'label'     => esc_html__('See Items', 'gt3_elementor_photo_gallery'),
					'type'      => Controls_Manager::NUMBER,
					'min'       => 1,
					'step'      => 1,
					'default'   => '4',
					'condition' => array(
						'show_view_all!' => ''
					)
				)
			);

			$this->add_control(
				'button_type',
				array(
					'label'     => esc_html__('Button Type', 'gt3_elementor_photo_gallery'),
					'type'      => Controls_Manager::SELECT,
					'options'   => array(
						'default' => esc_html__('Default', 'gt3_elementor_photo_gallery'),
						'icon'    => esc_html__('Icon', 'gt3_elementor_photo_gallery'),
					),
					'default'   => 'default',
					'condition' => array(
						'show_view_all!' => '',
					)
				)
			);

			$this->add_control(
				'button_border',
				array(
					'label'     => esc_html__('Button Border', 'gt3_elementor_photo_gallery'),
					'type'      => Controls_Manager::SWITCHER,
					'condition' => array(
						'show_view_all!' => '',
					),
					'default'   => 'yes',
				)
			);

			$this->add_control(
				'button_icon',
				array(
					'label'     => esc_html__('Button Icon', 'gt3_elementor_photo_gallery'),
					'type'      => Controls_Manager::ICON,
					'condition' => array(
						'button_type'    => 'icon',
						'show_view_all!' => '',
					)
				)
			);

			$this->add_control(
				'button_title',
				array(
					'label'     => esc_html__('Button Title', 'gt3_elementor_photo_gallery'),
					'type'      => Controls_Manager::TEXT,
					'default'   => esc_html__('See More', 'gt3_elementor_photo_gallery'),
					'condition' => array(
						'show_view_all!' => '',
					)
				)
			);

			$this->add_responsive_control(
				'icon_space',
				array(
					'label'     => esc_html__('Icon Spacing', 'gt3_elementor_photo_gallery'),
					'type'      => Controls_Manager::SLIDER,
					'default'   => array(
						'size' => 16,
					),
					'range'     => array(
						'px' => array(
							'min' => 0,
							'max' => 100,
						),
					),
					'selectors' => array(
						'{{WRAPPER}} .widget-button-icon' => 'margin-left: {{SIZE}}{{UNIT}};',
					),
					'condition' => array(
						'button_type!'   => 'none',
						'show_view_all!' => '',
					)
				)
			);

			$this->end_controls_section();

			$this->start_controls_section(
				'title_style_section',
				array(
					'label' => esc_html__('Title', 'gt3_elementor_photo_gallery'),
					'tab'   => Controls_Manager::TAB_STYLE,
				)
			);

			$this->add_control(
				'title_color',
				array(
					'label'     => esc_html__('Title Color', 'gt3_elementor_photo_gallery'),
					'type'      => Controls_Manager::COLOR,
					'selectors' => array(
						'{{WRAPPER}} .isotope_item .title' => 'color: {{VALUE}};'
					)
				)
			);

			$this->add_group_control(
				Group_Control_Typography::get_type(),
				array(
					'name'     => 'title_typography',
					'selector' => '{{WRAPPER}} .isotope_item .title',
				)
			);

			$this->end_controls_section();

			$this->start_controls_section(
				'category_style_section',
				array(
					'label'     => esc_html__('Category', 'gt3_elementor_photo_gallery'),
					'tab'       => Controls_Manager::TAB_STYLE,
					'condition' => array(
						'select_source'  => 'categories',
						'show_category!' => '',
					),
				)
			);

			$this->add_control(
				'category_color',
				array(
					'label'     => esc_html__('Title Color', 'gt3_elementor_photo_gallery'),
					'type'      => Controls_Manager::COLOR,
					'selectors' => array(
						'{{WRAPPER}} .isotope_item .categories' => 'color: {{VALUE}};'
					),

				)
			);

			$this->add_group_control(
				Group_Control_Typography::get_type(),
				array(
					'name'     => 'category_typography',
					'selector' => '{{WRAPPER}} .isotope_item .categories',

				)
			);

			$this->end_controls_section();
		}



		private function renderItem($image, $source, $lightbox, $title, $show_category){
			$item_class    = '';
			$item_category = '';
			if($source == 'categories' && isset($image['p'])) {
				$categories = get_the_terms($image['p'], 'gallerycat');
				if(!$categories || is_wp_error($categories)) {
					$categories = array();
				}
				if(count($categories)) {
					$item_class    = array();
					$item_category = array();

					foreach($categories as $category) {
						/* @var \WP_Term $category */
						$item_class[]    = $category->slug;
						$item_category[] = '<span>'.$category->name.'</span>';
					}
					$item_class    = implode(' ', $item_class);
					$item_category = implode(' ', $item_category);
				}
			}
			$image = wp_prepare_attachment_for_js($image['id']);

			$render = '';
			$render .= '<div class="isotope_item loading '.$item_class.'"><div class="wrapper">';
			if((bool) $lightbox) {
				$render .= '<a href="'.esc_url($image['url']).'" class="lightbox">';
			}

			$render .= '<div class="img_wrap"><div class="img">';
			$render .= wp_get_attachment_image($image['id'], 'full');
			$render .= '</div></div>';

			if((bool) $title || (bool) $show_category && (!empty($image['title']) || !empty($item_category))) {
				$render .= '<div class="text_wrap">';
				if((bool) $title) {
					$render .= '<h4 class="title">'.esc_html($image['title']).'</h4>';
				}
				if((bool) $show_category && !empty($item_category)) {
					$render .= '<div class="categories">'.$item_category.'</div>';
				}
				$render .= '</div>';
			}

			if((bool) $lightbox) {
				$render .= '</a>';
			}
			$render .= '</div></div>';

			return $render;
		}

		// php
		protected function render(){
			$settings = array(
				'select_source' => 'module',
				'slides'        => array(),
				'grid_type'     => 'vertical',
				'cols'          => 4,
				'grid_gap'      => 0,
				'hover'         => 'type1',
				'lightbox'      => false,
				'show_title'    => true,
				'show_category' => false,
				'use_filter'    => false,
				'filter_align'  => 'center',
				'post_per_load' => 12,
				'all_title'     => esc_html__('All', 'gt3_elementor_photo_gallery'),
				'show_view_all' => false,
				'load_items'    => 4,
				'button_type'   => 'default',
				'button_border' => true,
				'button_title'  => esc_html__('Load More', 'gt3_elementor_photo_gallery'),

				'from_elementor' => true,
			);

			$settings                 = wp_parse_args($this->get_settings(), $settings);
			$settings['filter_array'] = array();
			$this->serializeImages($settings);
			if(!is_numeric($settings['post_per_load']) || empty($settings['post_per_load']) || $settings['post_per_load'] < 1) {
				$settings['post_per_load'] = 12;
			}
			if(!is_numeric($settings['load_items']) || empty($settings['load_items']) || $settings['load_items'] < 1) {
				$settings['load_items'] = 4;
			}

			if(isset($settings['slides']) && is_array($settings['slides']) && count($settings['slides'])) {

				$uid      = mt_rand(300, 1000);
				$lightbox = (bool)($settings['lightbox']) ? true : false;
				$this->add_render_attribute('wrapper', 'class', array(
					'isotope_gallery_wrapper',
					esc_attr('items'.$settings['cols']),
					esc_attr('grid_type_'.$settings['grid_type']),
					'hover_'.esc_attr($settings['hover']),
					'source_'.esc_attr($settings['select_source']),
					$settings['from_elementor'] ? 'elementor' : 'not_elementor',
				));
				$load_more_images = array_slice($settings['slides'], $settings['post_per_load']);
				$this->add_render_attribute('wrapper', 'data-images', wp_json_encode($load_more_images));
				$this->add_render_attribute('wrapper', 'data-settings', wp_json_encode(array(
					'cols'          => esc_attr($settings['cols']),
					'lightbox'      => $lightbox,
					'title'         => (bool)($settings['show_title']),
					'show_category' => (bool)($settings['show_category']),
					'source'        => esc_attr($settings['select_source']),
					'filter'        => (bool)($settings['use_filter']),
					'load_items'    => esc_attr($settings['load_items']),
					'grid_type'     => esc_attr($settings['grid_type']),
					'uid'           => $uid,
					'gap_value'     => esc_attr(intval($settings['grid_gap'])),
					'gap_unit'      => esc_attr(substr($settings['grid_gap'], -1) == '%' ? '%' : 'px'),
				)));
				if(!$settings['from_elementor']) {
					echo '<style>
                            .module_wrapper .isotope_wrapper {
                                 margin-right:-'.$settings['grid_gap'].';
                                 margin-bottom:-'.$settings['grid_gap'].';
                            }

    						.module_wrapper .isotope_item {
						        padding-right: '.$settings['grid_gap'].';
						        padding-bottom: '.$settings['grid_gap'].';
					        }
						 </style>';
				}
				?>
				<div <?php $this->print_render_attribute_string('wrapper') ?>>
					<?php if((bool)($settings['use_filter']) && count($settings['filter_array']) > 1) {
						?>
						<div class="isotope-filter">
							<?php
								echo '<a href="javascript:void(0)" class="active" data-filter="*">'.esc_html($settings['all_title']).'</a>';
								ksort($settings['filter_array']);
								foreach($settings['filter_array'] as $cat_slug) {
									echo '<a href="#" data-filter=".'.esc_attr($cat_slug['slug']).'">'.esc_html($cat_slug['name']).'</a>';
								}
							?>
						</div>
					<?php } ?>
					<div class="isotope_wrapper items_list gt3_clear " data-cols="<?php echo esc_attr($settings['cols']) ?>">
						<?php
							$settings['slides'] = array_slice($settings['slides'], 0, $settings['post_per_load']);
							foreach($settings['slides'] as $slide) {
								if($lightbox) {
									$image           = wp_prepare_attachment_for_js($slide['id']);
									$gallery_items[] = array(
										'href'        => $image['url'],
										'title'       => $image['title'],
										'thumbnail'   => $image['sizes']['thumbnail']['url'],
										'description' => $image['caption'],
										'is_video'    => 0,
										'image_id'    => $image['id'],
									);
								}
								echo  $this->renderItem($slide, $settings['select_source'], $settings['lightbox'], $settings['show_title'], $settings['show_category']);
							}
						?>
					</div>
					<?php
						if((bool)($settings['show_view_all']) && count($load_more_images)) {
							if(empty($settings['button_title'])) {
								$settings['button_title'] = esc_html__('Load More', 'gt3_elementor_photo_gallery');
							}
							if((bool)$settings['button_border']) {
								$this->add_render_attribute('view_more_button', 'class', 'bordered');
							}
							$this->add_render_attribute('view_more_button', 'href', 'javascript:void(0)');
							$this->add_render_attribute('view_more_button', 'class', 'view_more_link');
							$this->add_render_attribute('view_more_button', 'class', 'button_type_'.esc_attr($settings['button_type']));
							if($settings['button_type'] == 'icon') {
								$this->add_render_attribute('button_icon', 'class', esc_attr($settings['button_icon']));
							}

							$this->add_render_attribute('button_icon', 'class', 'widget-button-icon');
							if(!empty($settings['button_title'])) {
								$this->add_render_attribute('view_more_button', 'title', esc_attr($settings['button_title']));
							}
							echo '<a '.$this->get_render_attribute_string('view_more_button').'>'.esc_html($settings['button_title']).'<div '.$this->get_render_attribute_string('button_icon').'></div></a>';
						} // End button
					?>
				</div>
				<?php
				if($lightbox) {
					$wrapper = '<script>var images'.$uid.' = '.wp_json_encode($gallery_items).'</script>';

					if(!isset($GLOBALS['gt3_elementor_gallery__footer'])) {
						$GLOBALS['gt3_elementor_gallery__footer'] = '';
					}
					$GLOBALS['gt3_elementor_gallery__footer'] .= $wrapper;
				}
			}
		}

		// js
		protected function _content_template(){

		}

	}


