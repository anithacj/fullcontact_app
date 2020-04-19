<?php

namespace ElementorModal\Widgets;

use Elementor\Widget_Base;

if(!defined('ABSPATH')) {
	exit;
}

if (!class_exists('ElementorModal\Widgets\GT3_Core_Elementor_Widget_ImageBox')) {
	class GT3_Core_Elementor_Widget_ImageBox extends \ElementorModal\Widgets\GT3_Core_Widget_Base {

		public function get_name(){
			return 'gt3-core-imagebox';
		}

		public function get_title(){
			return esc_html__('Image Box', 'gt3_themes_core');
		}

		public function get_icon(){
            return 'eicon-image-box';
		}

	}
}











