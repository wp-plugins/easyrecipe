<?php
/**
 * Handles the diagnostic stuff for Easy Plugins
 */
class EasyRecipeDiagnostics {

    /**
     * Gets details about the site and installed plugins etc
     *
     * @return stdClass Object containing diagnostics data
     */
    function get() {
        global $wp_version, $wp_filter;

        $data = new stdClass();
        /*
        * Get the php info
        */
        $existingOP = ob_get_clean();
        ob_start();
        phpinfo();
        $phpinfo = ob_get_clean();
        preg_match('%<body>(.*)</body>%si', $phpinfo, $regs);
        $data->phpinfo = $regs[1];

        /*
        * Get our own settings. This is the same for all Easy Plugins and individualised by the build processs
        */
        /** @noinspection PhpUndefinedClassInspection */
        $data->ERSettings = EasyRecipeSettings::getInstance();

        $data->email = get_bloginfo("admin_email");

        $capabilities = "";
        get_currentuserinfo();

        $user = $GLOBALS['current_user'];

        if (isset($user->caps)) {
            foreach ($user->caps as $cap => $allowed) {
                if ($allowed) {
                    $capabilities .= "$cap,";
                }
            }
        }
        $data->wpcapabilities = rtrim($capabilities, ",");
        $data->wpversion = $wp_version;
        $data->wpurl = get_bloginfo("wpurl");
        $data->home = home_url();

        if ($wp_version < '3.4') {
            /** @noinspection PhpDeprecationInspection */
            $themeData = get_theme_data(get_stylesheet_directory() . "/style.css");
            $data->wptheme = $themeData["Name"];
            $data->wpthemeversion = $themeData["Version"];
            $data->wpthemeurl = $themeData["URI"];
        } else {
            $themeData = wp_get_theme();
            $data->wptheme = $themeData->get("Name");
            $data->wpthemeversion = $themeData->get("Version");
            $data->wpthemeurl = $themeData->get("ThemeURI");
        }

        if (!function_exists('get_plugins')) {
            require_once (ABSPATH . 'wp-admin/includes/plugin.php');
        }
        $plugins = get_plugins();
        foreach ($plugins as $pluginFile => $null) {
            $plugins[$pluginFile]["active"] = is_plugin_active($pluginFile) ? "Active" : "Inactive";
        }
        usort($plugins, array($this, "sortPlugins"));
        $data->plugindata = "";
        foreach ($plugins as $plugin) {
            $name = $plugin["Title"];
            $active = $plugin["active"];
            $version = $plugin["Version"];
            $url = $plugin["PluginURI"];
            $style = $active == "Active" ? "" : ' style=color:#888';
            $data->plugindata .= <<<EOD
        <tr$style>
          <td>$name</td>
          <td>$active</td>
          <td>$version</td>
          <td>$url</td>
        </tr>\n
EOD;
        }
        echo $existingOP;
        return $data;
    }

    /** @noinspection PhpUnusedPrivateMethodInspection */
    private function sortPlugins($a, $b) {
        if ($a["active"] != $b["active"]) {
            return strcmp($a["active"], $b["active"]);
        }
        return strcmp($a["Title"], $b["Title"]);
    }

}
