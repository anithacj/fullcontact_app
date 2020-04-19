<?php

namespace ElementorModal\Widgets;

use Elementor\Widget_Base;

if(!defined('ABSPATH')) {
	exit;
}

if (!class_exists('ElementorModal\Widgets\GT3_Core_Elementor_Widget_ImageCarousel')) {
	class GT3_Core_Elementor_Widget_ImageCarousel extends GT3_Core_Widget_Base {

		public function get_name(){
			return 'gt3-core-image-carousel';
		}

		public function get_title(){
			return esc_html__('Image Carousel', 'gt3_themes_core');
		}

		public function get_icon(){
			return 'eicon-price-table';
		}

		protected function construct() {
			$this->add_script_depends('slick');
			$this->add_style_depends('slick');
		}
	}
}











