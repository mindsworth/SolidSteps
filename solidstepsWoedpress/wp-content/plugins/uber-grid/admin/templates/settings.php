<div class="wrap">
	<div class="icon32" id="icon-options-general"><br></div>
	<h2><?php _e('UberGrid Settings', 'uber-grid')?></h2>
	<form method="post" action="options.php" id="uber-grid-settings">
		<?php settings_fields( 'uber-grid-options' ) ?>
		<ul>
			<li class="clear-after"><h3><?php _e('General', 'asg') ?></h3></li>
			<li class="clear-after">
				<label class="uber-grid-options-label"><?php _e('Hide buttons at frontend', 'asg') ?></label>
				<p class="inputs">
					<label class="checkbox-label"><input type="checkbox" name="uber_grid_hide_buttons" value="1"
						<?php echo checked(get_option('uber_grid_hide_buttons')) ?>>
					</label>
					<em><?php _e('This will disable the buttons appearing to the admins next to the gallery', 'asg') ?></em>
				</p>
			</li>
			<li class="clear-after"><h3><?php _e('Compatibility', 'uber-grid')?></li>
			<li class="clear-after">
				<label class="uber-grid-options-label"><?php _e('Use shortcode hack', 'uber-grid')?></label>
				<p class="inputs">
					<label class="checkbox-label"><input type="checkbox" name="uber_grid_shortcode_hack" value="1" <?php echo checked(get_option('uber_grid_shortcode_hack')) ?>></label><em><?php _e('Try this if UberGrid looks strange on your site', 'uber-grid')?></em>
				</p>
			</li>
			<li class="clear-after">
				<label class="uber-grid-options-label"><?php _e('Force new jQuery version', 'uber-grid')?></label>
				<p class="inputs">
					<label class="checkbox-label"><input type="checkbox" name="uber_grid_force_new_jquery" value="1" <?php echo checked(get_option('uber_grid_force_new_jquery')) ?>></label><em><?php _e('Try this if UberGrid does not work at your site', 'uber-grid')?></em>
				</p>
			</li>
			<li class="clear-after"><h3><?php _e('Image Processing', 'uber-grid') ?></h3></li>
			<li class="clear-after">
				<label class="asg-options-label"><?php _e('Processing engine', 'uber-grid' )?></label>
				<p class="inputs" style="margin-left: 200px">
					<input type="radio" name="uber_grid_processing_engine" value="timthumb" <?php checked(uber_grid_is_photon_active() ? get_option('uber_grid_processing_engine', 'timthumb') : 'timthumb', 'timthumb') ?>>
					<?php _e("TimThumb", 'uber-grid') ?><br>
					<input type="radio" name="uber_grid_processing_engine" value="photon" <?php checked(get_option('uber_grid_processing_engine', 'timthumb'), 'photon') ?> <?php echo (uber_grid_is_photon_active()) ? '' : 'disabled="disabled"' ?>>
					<?php _e('Photon', 'uber-grid') ?>
					<?php if (!uber_grid_is_photon_active()): ?>
						<strong>
							&mdash; JetPack Photon is not installed or active. <a href="admin.php?page=uber-grid-image-troubleshooting-easy">Learn how to activate it</a>.
						</strong>
					<?php endif ?><br>
				</p>
			</li>
			<li class="clear-after"><h3><?php _e('Lightbox integration', 'uber-grid') ?></h3></li>
			<li class="clear-after">
				<label class="asg-options-label"><?php _e('Lightbox', 'uber-grid')?></label>
				<p class="inputs" style="margin-left: 200px">
					<input type="radio" name="uber_grid_lightbox" value="uberbox" <?php checked('uberbox', uber_grid_get_active_lightbox()) ?>><?php _e('Uberbox', 'uber-grid') ?></input>
					<br>
					<input type="radio" name="uber_grid_lightbox" value="magnific-popup" <?php checked('magnific-popup', uber_grid_get_active_lightbox()) ?>><?php _e('Magnific popup', 'uber-grid') ?></input>
					<br>
					<input type="radio" name="uber_grid_lightbox" value="swipebox" <?php checked('swipebox', uber_grid_get_active_lightbox()) ?>><?php _e('Swipebox', 'uber-grid') ?></input>
					<br>
					<input type="radio" name="uber_grid_lightbox" value="prettyphoto" <?php checked('prettyphoto', uber_grid_get_active_lightbox()) ?>><?php _e('Prettyphoto', 'uber-grid')?></input>
					<br>
					<input type="radio" name="uber_grid_lightbox" value="ilightbox" <?php checked('ilightbox', uber_grid_get_active_lightbox()) ?>>
					<?php _e('iLightbox', 'uber-grid') ?>
					&mdash;
					</input>
					<?php if (uber_grid_is_ilightbox_available()): ?>
						<strong>Installed and active.</strong>
					<?php else: ?>
						<strong><?php _e('Not installed or inactive.', 'uber-grid') ?></strong>
						<?php echo sprintf(__('You can buy iLightbox at the <a href="%s" target="_blank">CodeCanyon</a>, install and activate it', 'uber-grid'), 'http://codecanyon.net/item/ilightbox-revolutionary-lightbox-for-wordpress/3939523') ?>
					<?php endif ?>
					<br>
					<input type="radio" name="uber_grid_lightbox" value="jetpack" <?php checked('jetpack', uber_grid_get_active_lightbox()) ?>>
					<?php _e('JetPack carousel', 'uber-grid') ?>
					&mdash;
					<?php if (uber_grid_is_jetpack_available()): ?>
						<strong>Installed and active.</strong>
					<?php else: ?>
						<strong><?php _e('JetPack not installed, not activated, or Carousel module is inactive', 'uber-grid') ?></strong>
						<a href="admin.php?page=asg-image-troubleshooting-easy"><?php _e('Install Jetpack', 'uber-grid') ?></a>
					<?php endif ?>
					<br>
					<input type="radio" name="uber_grid_lightbox" value="foobox" <?php checked('foobox', uber_grid_get_active_lightbox()) ?>>
					<?php _e('FooBox', 'uber-grid') ?>
					&mdash;
					<?php if (uber_grid_is_foobox_available()): ?>
						<strong>Installed and active.</strong>
					<?php else: ?>
						<strong><?php _e('FooBox is not installed, or was not activated.', 'uber-grid') ?></strong>
						<?php echo sprintf(__('You can buy FooBox at: <a href="%s" target="_blank">its official site</a>', 'uber-grid'), 'http://http://getfoobox.com') ?>
					<?php endif ?>
					<br>
					<input type="radio" name="uber_grid_lightbox" value="custom" <?php checked('custom', uber_grid_get_active_lightbox()) ?>><?php _e('Custom', 'uber-grid')?></input>

				</p>
			</li>
			<li class="clear-after"><h4><?php _e('PrettyPhoto options', 'uber-grid') ?></h4></li>
			<li class="clear-after">
				<label class="asg-options-label"><?php _e('PrettyPhoto skin', 'uber-grid')?></label>
				<p class="inputs">
					<select name="uber_grid_prettyphoto_theme">
						<option value="pp_default" <?php selected('default', get_option('uber_grid_prettyphoto_theme')) ?>><?php _e('Default', 'uber-grid') ?></option>
						<option value="facebook" <?php selected('facebook', get_option('uber_grid_prettyphoto_theme')) ?>><?php _e('Facebook', 'uber-grid') ?></option>
						<option value="dark_rounded" <?php selected('dark_rounded', get_option('uber_grid_prettyphoto_theme')) ?>><?php _e('Dark rounded', 'uber-grid') ?></option>
						<option value="dark_square" <?php selected('dark_square', get_option('uber_grid_prettyphoto_theme')) ?>><?php _e('Dark square', 'uber-grid') ?></option>
						<option value="light_rounded" <?php selected('light_rounded', get_option('uber_grid_prettyphoto_theme')) ?>><?php _e('Light rounded', 'uber-grid') ?></option>
						<option value="light_square" <?php selected('light_square', get_option('uber_grid_prettyphoto_theme')) ?>><?php _e('Light square', 'uber-grid') ?></option>
					</select>
				</p>
			</li>
		</ul>
		<?php submit_button(); ?>
	</form>
</div>
