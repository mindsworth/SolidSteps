<?php /*
Plugin Name: Uber Grid
Plugin URI: http://codecanyon.net
Description: Powerful grid plugin for WordPress
Author: Nikolay Karev
Version: 2.1.2
*/
require_once(ABSPATH . "/wp-admin/includes/plugin.php");
load_plugin_textdomain('uber-grid', false, dirname(plugin_basename(__FILE__)) . '/languages/');
$ubergrid_plugin_data = get_plugin_data(__FILE__);
define('UBERGRID_VERSION', $ubergrid_plugin_data['Version']);
define('UBERGRID_MAIN', __FILE__);
define('UBERGRID_REQUIRED_WP', '4.0');
define('UBERGRID_PATH', dirname(__FILE__) . "/");
define('UBERGRID_URL', trailingslashit(plugins_url(basename(dirname((__FILE__))))));
define('UBERGRID_TIMTHUMB_URL', UBERGRID_URL . "timthumb.php");
define('UBERGRID_POST_TYPE', 'uber-grid');

require(UBERGRID_PATH . "constants.php");
require(UBERGRID_PATH . "admin/support.class.php");
require(UBERGRID_PATH . "admin/environment.class.php");

global $ubergrid_environment;
$ubergrid_environment = new UberGrid_Environment();
if ($ubergrid_environment->load_requirements_met()){
	require(UBERGRID_PATH . 'functions.php');
	require(UBERGRID_PATH . 'post-types.php');
	require(UBERGRID_PATH . 'array-helper.class.php');
	require(UBERGRID_PATH . 'grid.class.php');
	require(UBERGRID_PATH . 'cell.class.php');
	require(UBERGRID_PATH . 'templated-cell.class.php');
	require(UBERGRID_PATH . 'shortcodes.php');
	require(UBERGRID_PATH . 'widgets.php');
	require(UBERGRID_PATH . 'jetpack-hacks.class.php');
	if (is_admin()) {
		require(UBERGRID_PATH . 'admin/image-troubleshooting.class.php');
		require(UBERGRID_PATH . 'updater.php');
		require(UBERGRID_PATH . 'ajax.php');
		require(UBERGRID_PATH . 'admin/grid-editor.php');
		require(UBERGRID_PATH . 'admin/grid-list.php');
		require(UBERGRID_PATH . 'admin/settings.class.php');
		require(UBERGRID_PATH . 'admin/pointers.php');
		new Karevn_Updater_2_0('http://api.karevn.com/plugins',
				'uber-grid', plugin_basename(UBERGRID_MAIN));
	}
}
