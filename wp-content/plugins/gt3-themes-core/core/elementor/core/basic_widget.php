<?php

namespace ElementorModal\Widgets;

if(!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

use Elementor\Widget_Base;
use Elementor\Modules;
use Elementor\GT3_Core_Elementor_Plugin;

abstract class GT3_Core_Widget_Base extends Widget_Base {

	public function get_categories(){
		return array( 'gt3-core-elements' );
	}

	public function start_controls_section( $section_id, array $args = [] ) {
		$default_args = array(
			'condition' => apply_filters( 'gt3/core/start_controls_section/'.$section_id.'_section', null
			)
		);
		$args = array_merge($default_args, $args);
		parent::start_controls_section( $section_id.'_section', $args );
	}

	/**
	 * GT3_Core_Widget_Base constructor.
	 *
	 * @param array $data
	 * @param null  $args
	 *
	 * @throws \Exception
	 */
	public function __construct(array $data = array(), $args = null){
		parent::__construct($data, $args);

		add_action('elementor/widgets/widgets_registered', array( $this, 'widgets_registered' ));

		$this->construct();
	}

	/**
	 * @param \Elementor\Widgets_Manager $widgets_manager
	 */
	public function widgets_registered($widgets_manager){
		$widgets_manager->register_widget_type($this);
	}

	protected function construct(){
	}

	public function get_repeater_key($setting_key, $repeater_key, $repeater_item_index){
		return $this->get_repeater_setting_key($setting_key, $repeater_key, $repeater_item_index);
	}

	protected function get_controls_template(){
		$name       = explode('_', get_class($this));
		$name_lower = strtolower(end($name));

		$template = locate_template(array( 'widgets/'.$name_lower.'/controls.php', 'elementor/widgets/'.$name_lower.'/controls.php' ));
		if(empty($template) && file_exists(GT3_Core_Elementor_Plugin::$PATH.'widgets/'.$name_lower.'/controls.php')) {
			$template = GT3_Core_Elementor_Plugin::$PATH.'widgets/'.$name_lower.'/controls.php';
		}

		if(!empty($template)) {
			$widget = $this;
			require_once $template;
		}
	}

	protected function get_render_template(){
		$name       = explode('_', get_class($this));
		$name       = end($name);
		$name_lower = strtolower($name);

		$template = locate_template(array( 'widgets/'.$name_lower.'/render.php', 'elementor/widgets/'.$name_lower.'/render.php' ));
		if(empty($template) && file_exists(GT3_Core_Elementor_Plugin::$PATH.'widgets/'.$name_lower.'/render.php')) {
			$template = GT3_Core_Elementor_Plugin::$PATH.'widgets/'.$name_lower.'/render.php';
		}

		if(!empty($template)) {
			$widget = $this;
			require $template;
		}
	}

	protected function _register_controls(){
		do_action('gt3/elementor/register_control/before/'.$this->get_name(), $this);
		$this->get_controls_template();
		do_action('gt3/elementor/register_control/after/'.$this->get_name(), $this);
	}

	// php
	protected function render(){
		do_action('gt3/elementor/render/before/'.$this->get_name(), $this);
		$this->get_render_template();
		do_action('gt3/elementor/render/after/'.$this->get_name(), $this);
	}
}
