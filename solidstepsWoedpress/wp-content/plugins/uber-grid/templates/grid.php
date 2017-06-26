<?php if ($this->font_families()): ?>
	<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=<?php echo urlencode(implode('|', $this->font_families())) ?>"></link>
<?php endif ?>

<div class="<?php echo $this->get_classes() ?>" id="uber-grid-wrapper-<?php echo $this->id ?>" data-slug="<?php echo esc_attr($this->slug) ?>">
	<?php $tags = $this->get_tags($cells) ?>
	<?php if (count($tags)): ?>
		<div class="uber-grid-filters">
			<?php if (!$this['filters']['exclude_all']): ?>
				<div><a href="#"><?php _e($this['filters']['all'], 'uber-grid')?></a></div>
			<?php endif ?>
			<?php foreach($tags as $tag): ?>
				<div><a href="#<?php echo esc_attr($tag) ?>"><?php echo esc_html($tag)?></a></div>
			<?php endforeach ?>
		</div>
	<?php endif ?>
	<div class="uber-grid-cells-wrapper">
		<div class="<?php echo $this->grid_classes() ?>" id="uber-grid-<?php echo $this->id ?>" data-cell-width="<?php echo $this['layout']['cell_width'] ?>" data-cell-border="<?php echo $this['layout']['cell_border_width'] ?>" data-cell-gap="<?php echo $this['layout']['cell_gap'] ?>">
			<?php $this->render_cells($cells, $options) ?>
		</div>
	</div>
	<?php if ($this['pagination']['enable']): ?>
		<div class="uber-grid-pagination"></div>
	<?php endif ?>
</div>
<script>
(function(){
	var id = '#uber-grid-wrapper-<?php echo $this->id ?>';
	var options = <?php echo json_encode(wp_parse_args(array('lightbox_enable' => $options['lightbox']), $this->js_options())) ?>;
	options.el = jQuery(id);
	var initialize = function(){
		setTimeout(function(){
			new UberGrid(options);
		}, 1);
	};
	if (typeof(UberGrid) != 'undefined' && UberGrid) {
		initialize();
	} else {
		jQuery(initialize);
	}
})();
</script>
