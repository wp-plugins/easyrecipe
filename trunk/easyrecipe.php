<?php

/*
Plugin Name: Easy Recipe
Plugin URI: http://www.orgasmicchef.com/easyrecipe/
Description: Create, edit, display and print recipes with hRecipe microformat functionality
Author: The Orgasmic Chef
Version: 2.2.3
Author URI: http://www.orgasmicchef.com
License: GPLv2 or later
*/

/*
  
Copyright (c) 2010-2012 Box Hill LLC  
 
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

if (!function_exists('add_action')) {
    echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
    exit();
}

function easyrecipeNeedPHP5() {
    wp_die("Easy Recipe requires PHP 5+.  Your server is running PHP" . phpversion() . '<br /><a href="/wp-admin/plugins.php">Go back</a>');
}

function easyrecipeNeedDOM() {
    wp_die("Easy Recipe requires the PHP DOMDocument extension but it has been disabled in your server's PHP" . phpversion() . '<br /><a href="/wp-admin/plugins.php">Go back</a>');
}

if (phpversion() < '5') {
    register_activation_hook(__FILE__, "easyrecipeNeedPHP5");
    return;
}

if (!class_exists("DOMDocument")) {
    register_activation_hook(__FILE__, "easyrecipeNeedDOM");
    return;
}

/**
 * We only need to load on ajax calls that we want to trap
 */

if (is_admin()) {
    if ($GLOBALS["pagenow"] == "admin-ajax.php") {
        if (!isset($_REQUEST["action"]) || ($_REQUEST["action"] != "ERsendDiagnostics" && $_REQUEST["action"] != "customCSS" && $_REQUEST["action"] != "ERconvertRecipe")) {
            return;
        }
    }
}

if (!class_exists('EasyRecipe')) {
    require_once 'class-easyrecipe.php';
    $er = new EasyRecipe();
    register_activation_hook(__FILE__, array ($er, "easyrecipeActivated"));
    register_deactivation_hook(__FILE__, array ($er, "easyrecipeDeactivated"));
}
?>
