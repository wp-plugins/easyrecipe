<?php
/**
 * Copyright (c) 2010-2013 Box Hill LLC
 *
 * All Rights Reserved
 * No part of this software may be reproduced, copied, modified or adapted, without the prior written consent of Box Hill LLC.
 * Commercial use and distribution of any part of this software is not allowed without express and prior written consent of Box Hill LLC.
 */

/**
 * Class EasyRecipeDiagnostics
 *
 * Handles the diagnostic stuff for Easy plugins
 *
 */
class EasyRecipeDiagnostics {

    private $diagnosticsVersion = 2;

    /**
     * Gets details about the site and installed plugins etc
     *
     * @return stdClass Object containing diagnostics data
     */
    function get() {
        global $wp_version;

        $data = new stdClass();

        $data->diagnosticsVersion = $this->diagnosticsVersion;
        /**
         * Get the php info
         */
        $existingOP = ob_get_clean();
        ob_start();
        phpinfo();
        $phpinfo = ob_get_contents();
        ob_end_clean();
        preg_match('%<body>(.*)</body>%si', $phpinfo, $regs);
        $data->phpinfo = $regs[1];

        /**
         * Get our own settings. This is the same for all Easy Plugins and individualised by the build processs
         */
        /** @noinspection PhpUndefinedClassInspection */
        $data->settings = EasyRecipeSettings::getInstance();

        /**
         * Don't send any settings (passwords etc) that we really have no business knowing
         */
        if (isset($data->settings->privateSettings)) {
            foreach ($data->settings->privateSettings as $privateSetting) {
                if (isset($data->settings->$privateSetting)) {
                    unset($data->settings->$privateSetting);
                }
            }
        }
        unset($data->settings->privateSettings);

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

        $data->gmtOffset = get_option('gmt_offset');
        $data->timezone = get_option('timezone_string');

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
            require_once(ABSPATH . 'wp-admin/includes/plugin.php');
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

    /**
     * Display the plugin diagnostics page
     */
    function show() {
        $vars = get_class_vars('EasyRecipe');
        $data = $this->get();

        $data->pluginURL = $vars['EasyRecipeURL'];
        $data->version = '3.2.1272';
        $data->pluginname = 'easyrecipe';

        $data->settings = print_r($data->settings, true);
        $templateText = $this->getTemplate();

        $template = new EasyRecipeTemplate($templateText, EasyRecipeTemplate::TEXT);
        $html = $template->replace($data, EasyRecipeTemplate::PRESERVEWHITESPACE);

        $level = ob_get_level();
        while ($level > 0) {
            ob_end_clean();
            $level = ob_get_level();
        }
        header("HTTP/1.1 200 OK");
        header("Content-Length: " . strlen($html));
        echo $html;

        exit();
    }

    /**
     * Send a support question (and possibly diagnostics) to EasyRecipe support
     */
    function send($diagnosticsURL) {
        $data = new stdClass();
        $data->email = stripslashes($_POST['email']);
        $data->name = stripslashes($_POST['name']);
        $data->problem = stripslashes($_POST['problem']);
        if (isset($_POST['diagnostics'])) {
            $data->vars = $this->get();
            $data->settings = print_r($data->settings, true);
        } else {
            $diags = new stdClass();
            $diags->phpinfo = print_r($_POST, true);
            $data->vars = $diags;
        }
        $data = json_encode($data);

        $args = array('body' => array('data' => $data));
        $response = wp_remote_post($diagnosticsURL, $args);

        $result = new stdClass();
        $result->status = 'FAIL';

        // TODO - try email if direct POST doesn't work
        if (is_a($response, 'WP_Error')) {
            $result->errors = $response->get_error_messages();
        } else if (is_array($response)) {
            if (isset($response['response']) && $response['response']['code'] == 200) {
                $result->status = $response['body'];
            }
        } else {
            $result->errors = array("Unknown error");
        }
        echo json_encode($result);
        exit();
    }

    /**
     * Gets the template for the diagnostics page.
     * This could be done inline, without using Template()... but that is SO messy and error prone!
     *
     * @return string The template text
     */
    private function getTemplate() {
        $template = <<<EOD
<!-- START PAGE -->
<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="robots" content="noindex, noarchive">

    <title>#pluginname# Diagnostics</title>
    <style type="text/css">
        #divDDContainer {
            position: relative;
            width: 950px;
            margin-right: auto;
            margin-left: auto;
            border: 1px solid #666;
            text-align: left;
        }

        #divDDHdr {
            position: relative;
            /* [disabled]height: 100px; */
            margin-bottom: 20px;
        }

        #divDData {
            position: relative;
        }

        #divDiagData {
        }

        .PHPinfo body, .PHPinfo td, .PHPinfo th, .PHPinfo h1, .PHPinfo h2 {
            font-family: sans-serif;
        }

        .PHPinfo pre {
            margin: 0px;
            font-family: monospace;
        }

        .PHPinfo a:link {
            color: #000099;
            text-decoration: none;
            background-color: #ffffff;
        }

        .PHPinfo a:hover {
            text-decoration: underline;
        }

        .PHPinfo table {
            border-collapse: collapse;
        }

        .PHPinfo .center {
            text-align: center;
        }

        .PHPinfo .center table {
            margin-left: auto;
            margin-right: auto;
            text-align: left;
            width: 900px;
        }

        .PHPinfo .center th {
            text-align: center !important;
        }

        .PHPinfo td, .PHPinfo th {
            border: 1px solid #000000;
            vertical-align: baseline;
        }

        .PHPinfo h1 {
            font-size: 150%;
        }

        .PHPinfo h2 {
            font-size: 125%;
        }

        .PHPinfo .p {
            text-align: left;
        }

        .PHPinfo .e {
            background-color: #ccccff;
            font-weight: bold;
            color: #000000;
        }

        .PHPinfo .h {
            background-color: #9999cc;
            font-weight: bold;
            color: #000000;
        }

        .PHPinfo .v {
            background-color: #cccccc;
            color: #000000;
        }

        .PHPinfo .vr {
            background-color: #cccccc;
            text-align: right;
            color: #000000;
        }

        .PHPinfo img {
            float: right;
            border: 0px;
        }

        .PHPinfo hr {
            width: 600px;
            background-color: #cccccc;
            border: 0px;
            height: 1px;
            color: #000000;
        }

        .WPinfo table tr th {
            text-align: left;
        }

        .DPlugins table tr th {
            text-align: left;
        }

        .WPinfo .DTable tr th {
            text-align: left;
        }

        .PHPinfo {
            font-size: 14px;
        }

        .WPinfo {
            font-size: 12px;
        }

        #divDDContainer #divDDHdr table {
            width: 650px;
        }

        #divDDContainer #divDDHdr th {
            text-align: right;
            width: 110px;
        }

        body {
            text-align: center;
            font: 12px Arial, Helvetica, sans-serif;
        }

    </style>


</head>

<body>
<div id="divDDContainer">
    <div id="divDData">
        <div id="divDiagData">
            <div class="WPinfo">
                <h3>Wordpress</h3>
                <table border="0" cellspacing="5">
                    <tr>
                        <th scope="row">Wordpress version</th>
                        <td>#wpversion#</td>
                    </tr>
                    <tr>
                        <th scope="row">Current user capabilities</th>
                        <td>#wpcapabilities#</td>
                    </tr>
                    <tr>
                        <th scope="row">Blog URL</th>
                        <td>#wpurl#</td>
                    </tr>
                    <tr>
                        <th scope="row">Current theme</th>
                        <td>#wptheme#</td>
                    </tr>
                    <tr>
                        <th scope="row">Theme version</th>
                        <td>#wpthemeversion#</td>
                    </tr>
                    <tr>
                        <th scope="row">Theme URL</th>
                        <td>#wpthemeurl#</td>
                    </tr>
                </table>
                <h3>Plugins </h3>
                <table class="Table" border="0">
                    <tr>
                        <th>Plugin</th>
                        <th>Activated</th>
                        <th>Version</th>
                        <th>URL</th>
                    </tr>
                    #plugindata#
                </table>
                <h3>EasyRecipe</h3>
        <pre>
#settings#
</pre>
                <!-- START INCLUDEIF sendHooks -->
                <h3>Hooks</h3>
                <table class="DTable" border="0">
                    <tr>
                        <th scope="col">Hook</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Function</th>
                    </tr>
                    #hookdata#
                </table>
                <!-- END INCLUDEIF sendHooks -->
            </div>
            <h3>PHP</h3>

            <div class="PHPinfo">#phpinfo#</div>
        </div>
    </div>
</div>
</body>
</html>
<!-- END PAGE -->
EOD;

        return $template;
    }

}

