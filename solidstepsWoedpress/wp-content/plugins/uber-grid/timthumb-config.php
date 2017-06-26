<?php
require(dirname(__FILE__) . "/constants.php");
$config_path = dirname(dirname(dirname(__FILE__))) .  "/uber-grid-timthumb-config.php";
if (file_exists($config_path)) require( $config_path );

if (!defined("ALLOW_ALL_EXTERNAL_SITES")) define ('ALLOW_ALL_EXTERNAL_SITES', true);

if (!defined('ALLOW_EXTERNAL')) define ('ALLOW_EXTERNAL', true);
if (!defined('MEMORY_LIMIT')) define ('MEMORY_LIMIT', '128M');

$local_base = dirname(dirname(dirname(dirname(__FILE__))));
$src = stripslashes($_REQUEST['src']);
$url = parse_url($src);
$base = $local_base;
$path = explode('/', $url['path']);
$segments = '';
$trim = false;
foreach($path as $segment){
	if (strlen($segment)){
		$segments = $segments . "/" . $segment;
		if (strpos($base, $segments) === false){
			if ($trim)
				$local_base = substr($local_base, 0, strpos($base, dirname($segments)));
			break;
		} else {
			$trim = true;
		}
	}
}

if (!defined('LOCAL_FILE_BASE_DIRECTORY')) define('LOCAL_FILE_BASE_DIRECTORY', $local_base);
if (!defined('FILE_CACHE_DIRECTORY')){
	$wp_content_dir = dirname(dirname(dirname(__FILE__)));
	$cache_dir = "$wp_content_dir/" . UBERGRID_CACHE_DIR;
	if (!is_writable($cache_dir)){
		$cache_dir = "$wp_content_dir/uploads/uber-grid-cache";
	}
	define('FILE_CACHE_DIRECTORY', $cache_dir);
}

if (isset($_REQUEST['zoom'])){
	$zoom = (float)$_REQUEST['zoom'];
	$_GET['w'] = $_GET['w'] * $zoom;
	$_GET['h'] = $_GET['h'] * $zoom;
}


if (!defined('MAX_FILE_SIZE'))
	define ('MAX_FILE_SIZE', 10485760);

/* Crazy hack to force HTTP image fetching. This fixes issues with sites hosted in mapped directories */
if (!defined('NO_HOST_HACK'))
	$_SERVER['HTTP_HOST'] = 'foo.bar';
