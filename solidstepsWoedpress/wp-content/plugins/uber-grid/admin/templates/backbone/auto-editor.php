<script type="text/template" id="auto-mode-template">
	<div class="ug-post-query-wrapper"></div>
	<div class="ug-categories-wrapper"></div>
	<div class="ug-cell-template"></div>
</script>

<script type="text/template" id="ug-auto-mode-query-template">
	<h3><?php _e('Build from posts', 'uber-grid')?></h3>
	<div class="inside">
		<div class="ug-section-wrapper">
			<label for="auto-post-type" class="huge"><?php _e('Post type')?></label>
			<div class="ug-column-1">
				<?php _e('Fetch', 'uber-grid')?>
				<select rv-value="model:post_type" id="auto-post-type">
					<?php global $wp_post_types?>
					<?php foreach($wp_post_types as $type => $args): ?>
						<?php if (!in_array($type, array('revision', 'nav_menu_item', 'uber-grid', 'media'))): ?>
							<option value="<?php echo esc_attr($type) ?>"><?php echo (isset($args->labels) && isset($args->labels->plural_name)) ? esc_html($args->labels->plural_name) : (isset($args->label) ? esc_html($args->label): $type) ?></option>
						<?php endif ?>
					<?php endforeach ?>
				</select>
				<?php _e('order by', 'uber-grid')?>
				<select rv-value="model:orderby">
					<?php foreach(array('date' => __('Date', 'uber-grid'), 'none' => __('None', 'uber-grid'), 'ID' => 'ID', 'author' => __('Author', 'uber-grid'), 'title' => __('Title', 'uber-grid'), 'name' => __('Name', 'uber-grid'), 'modified' => __('Modification date', 'uber-grid'), 'rand' => __('Rand', 'uber-grid'), 'comment_count' => __('Comment count', 'uber-grid'), 'menu_order' => __('Menu position')) as $value => $label): ?>
						<option value="<?php echo esc_attr($value) ?>"><?php echo esc_html($label) ?></option>
					<?php endforeach ?>
				</select>
				<select rv-value="model:order">
					<option value="DESC">DESC</option>
					<option value="ASC">ASC</option>
				</select><br> <?php _e('Limit to', 'uber-grid') ?> <input type="number" rv-value="model:limit" id="auto-limit"> cells, offset
				<input type="number" rv-value="model:offset" id="auto-offset" step="1"> posts.
			</div>
			<br class="clear">
		</div>
		<div class="ug-section-wrapper ug-taxonomy-filters-wrapper"></div>
		<div class="ug-section-wrapper ug-custom-field-filters-wrapper"></div>
	</div>
</script>

<script type="text/template" id="ug-auto-mode-filters-source">
	<h3><?php _e('Filtering Categories', 'uber-grid') ?></h3>
	<div class="inside">
		<div class="ug-section-wrapper">
			<label class="huge"><?php _e('Categories', 'uber-grid') ?></label>
			<div class="ug-column-1">
				<div class="ug-field">
					<label><?php _e('Take filtering categories from taxonomy:', 'uber-grid') ?></label>
					<select rv-value=":filtering_taxonomy">
						<option value=""><?php _e('Don\'t use categories') ?></option>
						<?php global $wp_taxonomies ?>
						<?php foreach($wp_taxonomies as $taxonomy => $args): ?>
							<?php $labels = get_taxonomy_labels($args) ?>
							<option value="<?php echo esc_attr($taxonomy) ?>" ><?php echo $labels->name ?></option>
						<?php endforeach ?>
					</select>
				</div>
			</div>
			<br class="clear">
		</div>

	</div>
</script>

<script type="text/template"  id="ug-taxonomy-filters-template">
	<label class="huge"><?php _e('Tagged with', 'uber-grid')?></label>
	<div class="ug-column-1">
			<select rv-value=":taxonomy_filters_relation">
				<option value="AND">AND &mdash; <?php _e('post should match all the taxonomy filters', 'uber-grid')?></option>
				<option value="OR">OR &mdash; <?php _e('post should match any of the filters', 'uber-grid')?></option>
			<select>
			<ul class="ug-filters"></ul>
			<button class="button" data-action="add"><?php _e('Add filter', 'uber-grid')?></button>
	</div>
	<br class="clear">
</script>

<script type="text/template" id="ug-taxonomy-filter-template">
	<?php global $wp_taxonomies ?>
	<select rv-value="model:taxonomy" role="taxonomy">
		<?php foreach($wp_taxonomies as $taxonomy => $args): ?>
			<option value="<?php echo esc_attr($taxonomy) ?>"><?php echo esc_html((isset($args->label) && isset($args->labels->name)) ? $args->labels->name : $taxonomy) ?></option>
		<?php endforeach ?>
	</select>
	<input type="text" rv-value="model:tags" placeholder="<?php _e('comma-separated tags', 'uber-grid')?>">
	<select rv-value="model:operator">
		<option value="IN">IN</option>
		<option value="NOT IN">NOT IN</option>
		<option value="OR">OR</option>
		<option value="AND">AND</option>
	</select>
	<button class="button"><?php _e('Remove', 'uber-grid')?></button>
</script>

<script type="text/template" id="ug-custom-fields-filters-template">
	<label class="huge"><?php _e('Custom fields filters', 'uber-grid')?></label>
	<div class="ug-column-1">
		<div class="ug-field">
			<select rv-value=":custom_field_filters_relation">
				<option value="AND">AND &mdash; <?php _e('post should match all filters', 'uber-grid')?></option>
				<option value="OR">OR &mdash; <?php _e('post should match any of the filters', 'uber-grid')?></option>
			<select>
		</div>
		<div class="ug-field">
			<ul class="ug-filters"></ul>
			<button class="button" data-action="add" id="add-custom-field-filter"><?php _e('Add filter', 'uber-grid')?></button>
		</div>
	</div>
	<br class="clear">
</script>

<script type="text/template" id="ug-custom-fields-filter-template">
	<?php global $wpdb ?>
	<select rv-value="model:key" role="key">
		<?php foreach($wpdb->get_results("SELECT DISTINCT(meta_key) FROM `$wpdb->postmeta` ORDER BY meta_key") as $result): ?>
			<option value="<?php echo esc_attr($result->meta_key )?>"><?php echo esc_html($result->meta_key)?></option>
		<?php endforeach ?>
	</select>
	<select rv-value="model:operator">
		<option value="=">=</option>
		<option value="!=">!=</option>
		<option value="<">&lt;</option>
		<option value=">">&gt;</option>
		<option value="<=">&lt;=</option>
		<option value=">=">&gt;=</option>
	</select>
	<input type="text" rv-value="model:value" placeholder="<?php _e('value') ?>">
	<select rv-value="model:type">
		<option value="CHAR">CHAR</option>
		<option value="NUMERIC">NUMERIC</option>
		<option value="BINARY">BINARY</option>
		<option value="DATE">DATE</option>
		<option value="DATETIME">DATETIME</option>
		<option value="DECIMAL">DECIMAL</option>
	</select>
	<button class="button"><?php _e('Remove', 'uber-grid')?></button>

</script>

<script type="text/template" id="ug-auto-cell-templates-wrapper-template">
	<h2 class="cells-header">
		<button class="button" data-action="add-new-after"><?php _e('Add new template', 'uber-grid')?></button>
		<label><?php _e('Use templates:', 'uber-grid') ?></label>
		<select rv-value=":choose_template_method">
			<option value="sequential"><?php _e('Sequentially', 'uber-grid') ?></option>
			<option value="taxonomy"><?php _e('Based on taxonomy', 'uber-grid') ?></option>
			<option value="php"><?php _e('Using PHP code result', 'uber-grid') ?></option>
		</select>
	</h2>
	<ul class="ug-cells"></ul>
</script>

<script type="text/template" id="ug-auto-cell-template-template">
	<h3>
		<span class="handle"></span>
		<a href="#" data-action="clone"><?php _e('clone', 'uber-crid')?></a>
		<a href="#" data-action="remove"><?php _e('remove', 'uber-crid')?></a>
		<span class="heading"><?php _e('Cell template') ?></span>
	</h3>
	<div class="ug-cell-content">
		<div class="ug-cell-application-wrapper ug-section-wrapper"></div>
		<div class="ug-cell-legend-wrapper ug-section-wrapper"></div>
		<div class="ug-cell-main-wrapper ug-section-wrapper"></div>
		<div class="ug-cell-layout-wrapper ug-section-wrapper"></div>
		<div class="ug-cell-linking-wrapper ug-section-wrapper"></div>
		<div class="ug-cell-hover-wrapper ug-section-wrapper"></div>
		<div class="ug-cell-label-wrapper ug-section-wrapper"></div>
	</div>
</script>

<script type="text/template" id="ug-auto-cell-template-php-application-mode">
	<label class="huge"><?php _e('Usage logic', 'uber-grid') ?></label>
	<div class="ug-column-1">
		<p><?php _e('This template will be used if the PHP expression below will return value that evaluates to <code>TRUE</code>', 'uber-grid') ?></p>
		<label><?php _e('PHP code', 'uber-grid') ?></label>
		<small><?php _e('You can use $post, $index local variables. Don\'t forget to return the value.', 'uber-grid')?></small>
		<br>
		<textarea rv-value="model:criteria_php_code" placeholder="return $post->ID == 14;"></textarea>
	</div>
	<br class="clear">
</script>

<script type="text/template" id="ug-auto-cell-template-taxonomy-application-mode">
	<label class="huge"><?php _e('Usage logic', 'uber-grid') ?></label>
	<div class="ug-column-1">
		<div class="ug-field">
			<p><?php _e('This template will be applied if the post is taged with the next tags from the taxonomy:', 'uber-grid') ?></p>
			<label><?php _e('Taxonomy:', 'uber-grid') ?></label>
			<select rv-value="model:criteria_taxonomy">
				<?php global $wp_taxonomies ?>
				<?php foreach($wp_taxonomies as $taxonomy => $args): ?>
					<?php $labels = get_taxonomy_labels($args) ?>
					<option value="<?php echo esc_attr($taxonomy) ?>" ><?php echo $labels->name ?></option>
				<?php endforeach ?>
			</select>
		</div>
		<div class="ug-field">
			<label><?php _e('Tags:', 'uber-grid') ?></label>
			<input type="text" rv-value="model:criteria_tags" placeholder="<?php _e('comma-separated tags here', 'uber-grid')?>">
		</div>
	</div>
	<br class="clear">
</script>

<script type="text/template" id="ug-auto-cell-template-legend-section-template">
	<label class="huge"><?php _e('Pseudo-tags legend', 'uber-grid')?></label>
	<div class="ug-columns-2">
		<div class="ug-column">
			<p>You can use these pseudo-tags to mark places where actual post data should be used.</p>
			<ul>
				<li><strong>%post_title%</strong> = <?php _e('Post title', 'uber-grid')?></li>
				<li><strong>%post_excerpt%</strong> = <?php _e('Post excerpt', 'uber-grid')?></li>
				<li><strong>%post_ID%</strong> = <?php _e('Post ID', 'uber-grid')?></li>
				<li><strong>%post_permalink%</strong> = <?php _e('Post URL', 'uber-grid')?></li>
				<li><strong>%post_content%</strong>=<?php _e('Post content', 'uber-grid') ?></li>
				<li><strong>%post_date%></strong>=<?php _e('Post date', 'uber-grid') ?></li>
				<li><strong>%post_tags%</strong>=<?php _e('Post tags', 'uber-grid') ?></li>
				<li><strong>%post_meta_...%</strong> - <?php _e('Add your meta key name instead of ellipsis to fetch custom field value', 'uber-grid') ?></li>
				<li><strong>%wc_product_price%</strong> - <?php _e('WooCommerce product price', 'uber-grid') ?></li>
				<li><strong>%post_meta__regular_price%</strong> - <?php _e('WooCommerce product regular price', 'uber-grid')?></li>
				<li><strong>%post_meta__sale_price%</strong> - <?php _e('WooCommerce product sale price', 'uber-grid')?></li>
			</ul>
		</div>
	</div>
	<br class="clear">
</script>

