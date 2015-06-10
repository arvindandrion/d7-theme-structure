(function ($, Drupal) { Drupal.behaviors.THEMENAME = { attach: function(context, settings) {
var basePath = Drupal.settings.basePath;
var pathToTheme = Drupal.settings.pathToTheme;

// Modulename One Goes Here
 $("test1");

// Modulenametwo Goes Here
$("test2");

// new module
 $("new_module")

}};})(jQuery, Drupal);