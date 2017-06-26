<?php

function uber_grid_get_active_lightbox(){
	$default_lightbox = 'uberbox';
	$selected_lightbox = get_option('uber_grid_lightbox', $default_lightbox);
	if (!$selected_lightbox)
		$selected_lightbox = $default_lightbox;
	$availability_function = str_replace('-', '_', "uber_grid_is_{$selected_lightbox}_available");
	return $availability_function() ? $selected_lightbox : $default_lightbox;
}


function uber_grid_array_insert(&$input, $offset, $element, $key = null){
	if ($key == null)
		$key = $offset;
	if ($offset > count($input))
		$offset = count($input);
	else if ($offset < 0)
		$offset = 0;
	$input = array_merge(array_slice($input, 0, $offset), array($key => $element), array_slice($input, $offset));
}

function uber_grid_render_scripts(){
	?>
	<script type="text/javascript" src="<?php echo includes_url() . "/js/underscore.min.js?ver=" . UBERGRID_VERSION ?>"></script>
	<script type="text/javascript" src="<?php echo includes_url() . "/js/backbone.min.js?ver=" . UBERGRID_VERSION ?>"></script>
	<script type="text/javascript" src="<?php echo UBERGRID_URL . "vendor/backbone.marionette.js?ver=" . UBERGRID_VERSION ?>"></script>
	<script type="text/javascript" src="<?php echo UBERGRID_URL . "assets/js/packery.pkgd.min.js?ver=" . UBERGRID_VERSION ?>"></script>
			<?php switch(uber_grid_get_active_lightbox()){
				case 'uberbox':
					?>
					<script type="text/javascript" src="<?php echo includes_url() . "/js/underscore.min.js?ver=" . UBERGRID_VERSION ?>"></script>
					<script type="text/javascript" src="<?php echo includes_url() . "/js/backbone.min.js?ver=" . UBERGRID_VERSION ?>"></script>
					<script type="text/javascript" src="<?php echo UBERGRID_URL . "vendor/backbone.marionette.js?ver=" . UBERGRID_VERSION ?>"></script>
					<script type="text/javascript" src="<?php echo UBERGRID_URL . "vendor/uberbox/dist/templates.js?ver=" . UBERGRID_VERSION ?>"></script>
					<script type="text/javascript" src="<?php echo UBERGRID_URL . "vendor/uberbox/dist/uberbox.js?ver=" . UBERGRID_VERSION ?>"></script><?php

				case 'magnific-popup':
					?><script type="text/javascript" src="<?php echo UBERGRID_URL . "assets/js/jquery.magnific-popup.js?ver=" . UBERGRID_VERSION ?>"></script><?php
					break;
				case 'prettyphoto':
					?><script type="text/javascript" src="<?php echo UBERGRID_URL . "vendor/prettyphoto/jquery.prettyPhoto.js?ver=" . UBERGRID_VERSION ?>"></script><?php
					break;
				case 'swipebox':
					?><script type="text/javascript" src="<?php echo UBERGRID_URL . "vendor/swipebox/jquery.swipebox.js?ver=" . UBERGRID_VERSION ?>"></script><?php
					break;
				default:
			}?>

			<script type="text/javascript" src="<?php echo UBERGRID_URL . "assets/js/uber-grid.js?ver=" . UBERGRID_VERSION ?>"></script>
			<?php
}

function uber_grid_get_timthumb_url($file, $options = array()) {
	$options = wp_parse_args($options, array('pixel_ratio' => 1));
	$timthumb_options = array('src' => $file);
	if (isset($options['width']) && (int)$options['width']){
		$timthumb_options['w'] = $options['width'] * $options['pixel_ratio'];
	}
	if (isset($options['height']) && (int)$options['height']){
		$timthumb_options['h'] = $options['height']  * $options['pixel_ratio'];
	}
	if (isset($options['width']) && (int)$options['width'] && isset($options['height']) && $options['height']){
		$timthumb_options['zc'] = 1;
	}
	return add_query_arg(urlencode_deep($timthumb_options), uber_grid_get_timthumb_file_url());
}

function uber_grid_is_photon_active(){
	$jetpack_active_modules = get_option('jetpack_active_modules');
	return class_exists( 'Jetpack', false ) && $jetpack_active_modules && in_array( 'photon', $jetpack_active_modules );
}

function uber_grid_get_timthumb_file_url(){
	if (!($cdn = trim(get_option('uber_grid_cdn_host')))){
		return UBERGRID_TIMTHUMB_URL;
	}
	if (!preg_match("|^https?://|", $cdn))
		$cdn = "//" . $cdn;
	return preg_replace("/^" . preg_quote(home_url(), '/') . "/", $cdn, UBERGRID_TIMTHUMB_URL);
}

function uber_grid_get_photon_url($url, $options){
	$photon_options = array();
	if (isset($options['width']) && (int)$options['width'] && isset($options['height']) && (int)$options['height']){
		$photon_options['resize'] = array($options['width'], $options['height']);
	} else {
		if (isset($options['width']) && (int)$options['width']){
			$photon_options['w'] = $options['width'];
		}
		if (isset($options['height']) && (int)$options['height']){
			$photon_options['h'] = $options['height'];
		}
	}
	//$photon_options['zoom'] = $options['pixel_ratio'];
	return jetpack_photon_url($url, $photon_options);
}

function uber_grid_is_photon_enabled(){
	return uber_grid_is_photon_active() && get_option('uber_grid_processing_engine', 'timthumb') == 'photon';
}

function uber_grid_get_image_url($url, $options){
	if (uber_grid_is_photon_enabled())
		return uber_grid_get_photon_url($url, $options);
	return uber_grid_get_timthumb_url($url, $options);
}


function uber_grid_is_uberbox_available(){return true;}
function uber_grid_is_foobox_available(){return class_exists('fooboxV2');}
function uber_grid_is_magnific_popup_available(){return true;}
function uber_grid_is_swipebox_available(){return true;}
function uber_grid_is_prettyphoto_available(){return true;}
function uber_grid_is_jetpack_available(){return class_exists('Jetpack') && Jetpack::is_module_active('carousel');}
function uber_grid_is_ilightbox_available(){return class_exists('iLightBox');}
function uber_grid_is_custom_available(){return true;}


function uber_grid_hex2rgba($hex, $opacity = 1){
	if (empty($hex))
		return 'transparent';
	$hex = preg_replace("/^#/", "", trim($hex));
	$color = array();
	if(strlen($hex) == 3) {
		$color['r'] = hexdec(substr($hex, 0, 1) . substr($hex, 0, 1));
		$color['g'] = hexdec(substr($hex, 1, 1) . substr($hex, 1, 1));
		$color['b'] = hexdec(substr($hex, 2, 1) . substr($hex, 2, 1));
	}
	else if(strlen($hex) == 6) {
		$color['r'] = hexdec(substr($hex, 0, 2));
		$color['g'] = hexdec(substr($hex, 2, 2));
		$color['b'] = hexdec(substr($hex, 4, 2));
	}
	return "rgba(" . implode(', ', $color) . ", " . $opacity . ")";
}


function uber_grid_color($hex, $opacity = 1.0){
	$hex = strtolower($hex);
	if (preg_match("/^#?(\d|[abcdef]){3,6}$/i", $hex)){
		if ((float)$opacity < 1.0)
			return uber_grid_hex2rgba($hex, $opacity);
		if (preg_match("/^#(\d|[abcdef]){3,6}$/i", $hex))
			return $hex;
		if (preg_match("/^(\d|[abcdef]){3,6}$/i", $hex))
			return "#" . $hex;
	}
	return $hex;
}

function ubergrid_get_main_cache_dir(){
	return trailingslashit(WP_CONTENT_DIR) . UBERGRID_CACHE_DIR;
}

function ubergrid_get_backup_cache_dir(){
	$dir = wp_upload_dir();
	return trailingslashit($dir['basedir']) . UBERGRID_CACHE_DIR;
}

function uber_grid_ajax_url(){
	return admin_url('admin-ajax.php', 'relative');
}

function uber_grid_get_builtin_image($file, $option_name){
	if (false === ($image = get_option($option_name))){
		$id = uber_grid_add_image($file);
		if (is_wp_error($id))
			return null;
		update_option($option_name, $id);
		return $id;
	}
	if (false !== wp_get_attachment_image_src($image))
		return $image;
	$id = uber_grid_add_image($file);
	if (is_wp_error($id))
		return null;
	update_option($option_name, $id);
	return $id;
}

function uber_grid_add_image($path){
	$upload_dir = wp_upload_dir();
	$file = wp_unique_filename($upload_dir['path'], basename($path));
	$file_path = $upload_dir['path'] . "/" . $file;
	$plus_contents = file_get_contents($path);
	file_put_contents($file_path, $plus_contents);
	$attachment = array(
			'post_mime_type' => 'image/png',
			'guid' => $upload_dir['url'] . "/" . $file,
			'post_title' => __('Plus', 'uber-grid'),
			'post_content' => '',
	);
	$id = wp_insert_attachment($attachment, $file_path);

	if ( !is_wp_error($id) ) {
		wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $file_path ) );
	}
	return $id;
}

function uber_grid_get_test_image(){
	return uber_grid_get_builtin_image(UBERGRID_PATH . "assets/admin/images/image-troubleshooting/demo.jpg", 'uber_grid_demo_image');
}
