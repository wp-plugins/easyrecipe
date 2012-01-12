<?php
  /*
    Plugin Name: Easy Recipe
    Plugin URI: http://www.orgasmicchef.com/easyrecipe/
    Description: Create, edit, display and print recipes with hRecipe microformat functionality
    Author: Orgasmic Chef
    Version: 1.2.4
    Author URI: http://www.orgasmicchef.com
   */

  // Make sure we don't expose any info if called directly
  if (!function_exists('add_action')) {
    echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
    exit;
  }

  function easyrecipeActivation() {
    wp_die("Easy Recipe requires PHP 5+.  Your server is running PHP " . phpversion().'<br /><a href="/wp-admin/plugins.php">Go back</a>');
  }

  if (phpversion() < '5') {
    register_activation_hook(__FILE__, "easyrecipeActivation");
    return;
  }

  if (is_admin ()) {

    $page = $GLOBALS["pagenow"];
    if ($page == "admin-ajax.php" && (!isset($_POST["action"]) || $_POST["action"] != "ERsendDiagnostics")) {
      return;
    }
    if (!class_exists('EasyRecipe')) {
      require_once 'class-easyrecipe.php';
      new EasyRecipe();
    }
  } else {
    if (!class_exists('EasyRecipe')) {
      require_once 'class-easyrecipe.php';
      new EasyRecipe();
    }
  }
?>
