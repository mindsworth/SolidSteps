<?php
class UberGrid_Jetpack_Hacks{
	function __construct(){
		add_action('wp_ajax_get_attachment_comments', array($this, '_get_attachment_comments'), 1);
		add_action('wp_ajax_nopriv_get_attachment_comments', array($this, '_get_attachment_comments'), 1);
	}

	function _get_attachment_comments(){
		if (isset($_REQUEST['id']) && $_REQUEST['id'] == 'asg-hack' ||
				isset($_REQUEST['attachment_id']) && $_REQUEST['attachment_id'] == 'asg-hack'){
			header('Content-type: text/json');
			echo json_encode(array());
			exit;
		}

	}
}

new UberGrid_Jetpack_Hacks;