<?php

if(!defined('ABSPATH')) {
	exit;
}

use Elementor\Utils;

/** @var \ElementorModal\Widgets\GT3_Core_Elementor_Widget_Countdown $widget */

$settings = array(
	'countdown_date'	=> '',
	'show_day'			=> true,
	'show_seconds' => true,
	'show_hours' => true,
	'show_minutes' => true,
	'size' => '',
	'align' => '',
);

$settings = wp_parse_args($widget->get_settings(), $settings);



$label_years = esc_html__('Years', 'gt3_themes_core');
$label_months = esc_html__('Months', 'gt3_themes_core');
$label_weeks = esc_html__('Weeks', 'gt3_themes_core');
$label_days = esc_html__('Days', 'gt3_themes_core');
$label_hours = esc_html__('Hours', 'gt3_themes_core');
$label_minutes = esc_html__('Minutes', 'gt3_themes_core');
$label_seconds = esc_html__('Seconds', 'gt3_themes_core');

$label_year = esc_html__('Year', 'gt3_themes_core');
$label_month = esc_html__('Month', 'gt3_themes_core');
$label_week = esc_html__('Week', 'gt3_themes_core');
$label_day = esc_html__('Day', 'gt3_themes_core');
$label_hour = esc_html__('Hour', 'gt3_themes_core');
$label_minute = esc_html__('Minute', 'gt3_themes_core');
$label_second = esc_html__('Second', 'gt3_themes_core');

$format = '';
if ((bool)$settings['show_day']) {
    $format .= 'd';
}
if ((bool)$settings['show_hours']) {
    $format .= 'H';
}
if ((bool)$settings['show_minutes']) {
    $format .= 'M';
}
if ((bool)$settings['show_seconds']) {
    $format .= 'S';
}

if (!empty($format)) {
    $format = ' data-format="'.esc_attr($format).'"';
}



$countdown_date = explode('-',$settings['countdown_date']);

if (!empty($settings['countdown_date'])) {
	$countdown_date = explode('-',$settings['countdown_date']);
	$countdown_day = explode(' ',$countdown_date[2]);
	$countdown_hours = explode(':',$countdown_day[1]);
	$countdown_hour = $countdown_hours[0];
	$countdown_min = $countdown_hours[1];
}

$countdown_year = !empty($countdown_date) ? $countdown_date[0] : '';
$countdown_month = !empty($countdown_date) ? $countdown_date[1] : '';
$countdown_day = !empty($countdown_day) ? $countdown_day[0] : '';
$countdown_hour = !empty($countdown_hour) ? $countdown_hour : '';
$countdown_min = !empty($countdown_min) ? $countdown_min : '';

$widget->add_render_attribute('wrapper', 'class', array(
	'gt3_countdown_wrapper',
));

?>
<div <?php $widget->print_render_attribute_string('wrapper') ?>>
	<div class="gt3_countdown" data-year="<?php echo esc_attr($countdown_year); ?>" data-month="<?php echo esc_attr($countdown_month); ?>" data-day="<?php echo esc_attr($countdown_day); ?>" data-hours="<?php echo esc_attr($countdown_hour); ?>" data-min="<?php echo esc_attr($countdown_min); ?>" data-label_years="<?php echo esc_attr($label_years); ?>" data-label_months="<?php echo esc_attr($label_months); ?>" data-label_weeks="<?php echo esc_attr($label_weeks); ?>" data-label_days="<?php echo esc_attr($label_days); ?>" data-label_hours="<?php echo esc_attr($label_hours); ?>" data-label_minutes="<?php echo esc_attr($label_minutes); ?>" data-label_seconds="<?php echo esc_attr($label_seconds); ?>" data-label_year="<?php echo esc_attr($label_year); ?>" data-label_month="<?php echo esc_attr($label_month); ?>" data-label_week="<?php echo esc_attr($label_week); ?>" data-label_day="<?php echo esc_attr($label_day); ?>" data-label_hour="<?php echo esc_attr($label_hour); ?>" data-label_minute="<?php echo esc_attr($label_minute); ?>" data-label_second="<?php echo esc_attr($label_second); ?>"<?php echo $format; ?>></div>
</div>