<?php
  /*
    Plugin Name: Easy Recipe
    Plugin URI: http://www.orgasmicchef.com/easyrecipe/
    Description: Create, edit, display and print recipes with hRecipe microformat functionality
    Author: Orgasmic Chef
    Version: 1.2.1
    Author URI: http://www.orgasmicchef.com
   */

  // Make sure we don't expose any info if called directly
  if (!function_exists('add_action')) {
    echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
    exit;
  }

  if (is_admin ()) {
    $page = $GLOBALS["pagenow"];
    if (page == "admin-ajax.php") {
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
