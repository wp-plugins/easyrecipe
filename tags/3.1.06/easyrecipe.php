<?php
/*
Plugin Name: Easy Recipe
Plugin URI: http://www.easyrecipeplugin.com/
Description: The Wordpress recipe plugin for non-geeks. EasyRecipe makes it easy to enter, format and print your recipes, as well as automagically doing all the geeky stuff needed for Google's Recipe View.
Author: The Orgasmic Chef
Version: 3.1.06
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

if (!function_exists('easyrecipePlusNeedPHP5')) {

    function easyrecipePlusNeedPHP5() {
        wp_die("EasyRecipe requires PHP 5+.  Your server is running PHP" . phpversion() . '<br /><a href="/wp-admin/plugins.php">Go back</a>');
    }
}

if (!function_exists('easyrecipePlusNeedDOM')) {

    function easyrecipePlusNeedDOM() {
        wp_die("EasyRecipe requires the PHP DOMDocument extension but it has been disabled in your server's PHP" . phpversion() . '<br /><a href="/wp-admin/plugins.php">Go back</a>');
    }
}

if (phpversion() < '5') {
    register_activation_hook(__FILE__, "easyrecipePlusNeedPHP5");
    return;
}

if (!class_exists("DOMDocument", false)) {
    register_activation_hook(__FILE__, "easyrecipePlusNeedDOM");
    return;
}

/*
 * Ignore ajax requests that don't concern us
*/
global $pagenow;
if (isset($pagenow)) {
    if ($pagenow == 'admin-ajax.php') {
        $action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';
        if (stripos($action, 'easyrecipe') !== 0) {
            return;
        }
    }
}

if (!class_exists('EasyRecipePlus', false)) {
    require_once dirname(__FILE__) . '/class-easyrecipeplus.php';
    $easyrecipe = new EasyRecipePlus();
    /*
     * A little weirdness to handle WP's inability to get the plugin basename correct if wp-content/plugins is a symlink
     * Only required because our own test servers symlink the plugins directory
     */
    $f = basename(dirname(__FILE__)) . '/' . basename(__FILE__);
    register_activation_hook($f, array ($easyrecipe, "easyrecipeActivated"));
    register_deactivation_hook($f, array ($easyrecipe, "easyrecipeDeactivated"));
}
?>