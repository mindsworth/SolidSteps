<?php class UberGrid_Ajax {
	function __construct(){
		add_action('wp_ajax_uber_grid_ping', array($this, '_ping'));
		add_action('wp_ajax_nopriv_uber_grid_ping', array($this, '_ping'));

		add_action('wp_ajax_uber_grid_render_grid', array($this, '_render_grid'));
		add_action('wp_ajax_nopriv_uber_grid_render_grid', array($this, '_render_grid'));
	}

	function _ping(){
		echo 'working';
		exit;
	}

	function _render_grid(){
		$id = (int)$_REQUEST['id'];
		require(dirname(__FILE__) . "/templates/iframe-grid.php");
		exit;
	}

}
new UberGrid_Ajax;
