<?php print render($page['mobile_menu']) ?>
<div class="main-wrapper">
  <?php print render($page['header']); ?>

  <?php if ($show_messages && $messages): ?>
    <?php print $messages; ?>
  <?php endif; ?>

  <?php //if ($page['help']): ?>
    <?php //print render($page['help']); ?>
  <?php //endif; ?>

  <?php if ($page['banner']): ?>
    <?php print render($page['banner']) ?>
  <?php endif; ?>

  <?php if ($page['before_content']): ?>
    <?php print render($page['before_content']) ?>
  <?php endif; ?>

  <div id="section">
    <?php if ($tabs): print render($tabs); endif; ?>
    <div class="row">
      <div class="large-12 columns">
        <h1 class="page-title-II"><?php print $title ?></h1>
      </div>
    </div>
    
    <div class="row">
      <!-- Content -->
      <?php if ($page['sidebar']): ?>
        <div class="large-8 columns">
      <?php else: ?>
        <div class="large-12 columns">
      <?php endif; ?>
        <?php print render($page['content']) ?>
      </div>
      <!-- End Content -->
      <!-- Sidebar -->
      <?php if ($page['sidebar']): ?>
        <div class="large-4 columns">
          <?php print render($page['sidebar']) ?>
        </div>
      <?php endif; ?>
      <!-- End Sidebar -->
    </div>
  </div>

  <?php if ($page['after_content']): ?>
    <?php print render($page['after_content']) ?>
  <?php endif; ?>

  <?php if ($page['footer']): ?>
    <?php print render($page['footer']) ?>
  <?php endif; ?>
</div>








