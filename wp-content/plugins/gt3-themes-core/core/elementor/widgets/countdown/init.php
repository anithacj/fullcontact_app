<?php

namespace ElementorModal\Widgets;

use Elementor\Widget_Base;

if(!defined('ABSPATH')) {
	exit;
}

if (!class_exists('ElementorModal\Widgets\GT3_Core_Elementor_Widget_Countdown')) {
	class GT3_Core_Elementor_Widget_Countdown extends \ElementorModal\Widgets\GT3_Core_Widget_Base {

		public function get_name(){
			return 'gt3-core-countdown';
		}

		public function get_title(){
			return esc_html__('Countdown', 'gt3_themes_core');
		}

		public function get_icon(){
			return 'eicon-countdown';
		}

		public function get_script_depends(){
			return array(
				'countdown',
			);
		}

	}
}











