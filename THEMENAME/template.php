<?php
// Load Javascript
function THEMENAME_preprocess_page(&$vars, $hook) {
  drupal_add_js(drupal_get_path('theme', 'THEMENAME') . '/assets/js/app.js');
  drupal_add_js('jQuery.extend(Drupal.settings, { "pathToTheme": "' . path_to_theme() . '" });', 'inline');
  drupal_add_library('system', 'jquery.cookie');

  $vars['scripts'] = drupal_get_js();
  if (isset($vars['node']->type)) {
    $nodetype = $vars['node']->type;
    $vars['theme_hook_suggestions'][] = 'page__' . $nodetype;
  }
}

// Force to show Empty Region
/*function THEMENAME_page_alter(&$page) {
	if ( !isset($page["header"]) || empty($page["header"])) {
		$page["header"] = array(
			'#region' => 'header',
			'#weight' => '-10',
			'#theme_wrappers' => array('region'));
	}
}*/

// Overwrite Status Message
function THEMENAME_status_messages($variables) {
  $display = $variables ['display'];
  $output = '';

  $status_heading = array(
    'status' => t('Status message'),
    'error' => t('Error message'),
    'warning' => t('Warning message'),
  );
  foreach (drupal_get_messages($display) as $type => $messages) {
    $output .= "<div class=\"l-messages row comp-full-row\">\n";
    $output .= "<div class=\"large-12 columns messages $type\">\n";
    if (!empty($status_heading [$type])) {
      $output .= '<h2 class="element-invisible">' . $status_heading [$type] . "</h2>\n";
    }
    if (count($messages) > 1) {
      $output .= " <ul>\n";
      foreach ($messages as $message) {
        $output .= '  <li>' . $message . "</li>\n";
      }
      $output .= " </ul>\n";
    }
    else {
      $output .= reset($messages);
    }
    $output .= "</div>\n";
    $output .= "</div>\n";
  }
  return $output;
}

// Overwrite Messages
function THEMENAME_menu_local_tasks(&$variables) {
  $output = '';

  $output .= '<div class="l-tabs row">';
  
  if (!empty($variables ['primary'])) {
    $variables ['primary']['#prefix'] = '<h2 class="element-invisible">' . t('Primary tabs') . '</h2>';
    $variables ['primary']['#prefix'] .= '<ul class="tabs primary">';
    $variables ['primary']['#suffix'] = '</ul>';
    $output .= drupal_render($variables ['primary']);
  }
  if (!empty($variables ['secondary'])) {
    $variables ['secondary']['#prefix'] = '<h2 class="element-invisible">' . t('Secondary tabs') . '</h2>';
    $variables ['secondary']['#prefix'] .= '<ul class="tabs secondary">';
    $variables ['secondary']['#suffix'] = '</ul>';
    $output .= drupal_render($variables ['secondary']);
  }

  $output .= '</div>';

  return $output;
}