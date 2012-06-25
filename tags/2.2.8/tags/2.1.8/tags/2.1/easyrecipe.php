<?php

  /*
    Plugin Name: Easy Recipe
    Plugin URI: http://www.orgasmicchef.com/easyrecipe/
    Description: Create, edit, display and print recipes with hRecipe microformat functionality
    Author: Orgasmic Chef
    Version: 2.1
    Author URI: http://www.orgasmicchef.com
   */

  // Make sure we don't expose any info if called directly
  if (!function_exists('add_action')) {
    echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
    exit;
  }

  function easyrecipeActivation() {
    wp_die("Easy Recipe requires PHP 5+.  Your server is running PHP " . phpversion() . '<br /><a href="/wp-admin/plugins.php">Go back</a>');
  }

  if (phpversion() < '5') {
    register_activation_hook(__FILE__, "easyrecipeActivation");
    return;
  }

  $fp = fopen("/tmp/oc.log", "a");
  fprintf($fp, "uri: %s page: %s 404: %d isadmin: %d\n", $_SERVER['REQUEST_URI'], $GLOBALS["pagenow"], is_404(), is_admin());
  fclose($fp);


  /*
   * If we're in admin, we only care about specific pages/actions
   * Don't waste time with stuff where the plugin isn't needed
   */
  if (is_admin()) {
    if ($GLOBALS["pagenow"] == "admin-ajax.php") {
      if (!isset($_REQUEST["action"]) || ($_REQUEST["action"] != "ERsendDiagnostics" && $_REQUEST["action"] != "customCSS")) {
        return;
      }
    }
  }
  if (!class_exists('EasyRecipe')) {
    require_once 'class-easyrecipe.php';
    new EasyRecipe();
  }
?>
