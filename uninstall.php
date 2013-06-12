<?php
if (!function_exists('add_action')) {
    echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
    exit();
}

if (current_user_can('edit_plugins')) {
    delete_option("EasyRecipe");
    $data = http_build_query(array('action' => 'uninstall', 'site' => get_site_url()));
    $fp = @fopen("http://www.easyrecipeplugin.com/installed.php?$data", "r");
}

