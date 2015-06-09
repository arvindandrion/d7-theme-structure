<aside class="right-off-canvas-menu">
  <div class="off-canvas-list">
    <!-- Mobile Search -->
  	<div class="mobile-search">
    <?php
    	$menu = menu_navigation_links('menu-top-menu');
    	print theme('links__menu-top-menu', array(
    		'links' => $menu,
    	));
    ?>
    <?php print $content; ?>
    </div>
    <!-- END Mobile Search -->
  </div>
 </aside>

