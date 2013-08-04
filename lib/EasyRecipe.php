<?php


/*
Copyright (c) 2010-2013 Box Hill LLC

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


class EasyRecipe {
    public static $EasyRecipeDir;
    public static $EasyRecipeURL;

    private $pluginVersion = '3.2.1255';

    private $pluginName = 'EasyRecipe';

    private $slug = 'easyrecipe/easyrecipe';

    const JQUERYJS = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js";
    const JQUERYUIJS = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js";
    const JQUERYUICSS = "http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/themes/base/jquery-ui.css";
    const VERSIONCHECKURL = "http://www.easyrecipeplugin.com/checkVersion.php";

    const DIAGNOSTICS_URL = 'http://www.easyrecipeplugin.com/diagnostics.php';

    const SWOOPJS = '<script type="text/javascript" id="spxw_script" src="http://ardrone.swoop.com/js/spxw.js" data-domain="%s" data-theme="red" data-serverbase="http://ardrone.swoop.com/"></script>';


    const ENDPOINTREGEX = '%/easyrecipe-(print|diagnostics|style|printstyle)(?:/([^?/]+))?%';

    /** @var EasyRecipeSettings */
    private $settings;

    private $postContent;

    private $easyrecipes = array();
    private $formatting = false;
    private $styleName;
    private $printStyle;
    private $styleData;
    private $printStyleData;
    public $isGuest = false;
    private $postMeta;
    private $guestPosters = array();

    private $loadJSInFooter = false;


    function __construct($pluginDir, $pluginURL) {


        self::$EasyRecipeDir = $pluginDir;
        self::$EasyRecipeURL = $pluginURL;

        /*
         * For convenience
         */
        $this->siteURL = site_url();
        $this->homeURL = home_url();



        /**
         * Delay adding any hooks until we check other plugiuns
         */
        add_action('plugins_loaded', array($this, 'pluginsLoaded'));

    }

    /**
     * If this is EasyRecipe Free, make sure we don't already have EasyRecipe Plus running
     * If not, go ahead and add our hooks
     */
    function pluginsLoaded() {

        /**
         * If EasyRecipe Plus is installed and active, this plugin can be uninstalled
         * Don't do any more  processing at all for this (free) version
         */
        $plugins = get_option('active_plugins', array());
        if (in_array("easyrecipeplus/easyrecipeplus.php", $plugins)) {
            add_action('admin_notices', array($this, 'showPlusActive'));
            return;
        }


        add_action('admin_menu', array($this, 'addMenus'));
        add_action('admin_init', array($this, 'initialiseAdmin'));
        add_action('init', array($this, 'initialise'));


        /**
         * Need this to explicitly allow the datetime & link tags when future posts are published
         */
        add_action('publish_future_post', array($this, 'publishFuturePost'), 0, 1);
        /**
         * Hook into the fooderific scan run action
         */
        add_action(EasyRecipeFooderific::FOODERIFIC_SCAN, array($this, 'fdScan'), 10, 1);

    }

    /**
     * Set up stuff we need if we're on an admin page
     */
    function initialiseAdmin() {

        if ($this->settings->enableFooderific) {
            /**
             * Temporary hack to re-scan sites that had done a possibly faulty scan in a previous version
             */
            if ($this->settings->lastScanStarted > 0 && $this->settings->lastScanStarted < 1358472207) {
                $this->fdScanSchedule(false);
            }
            /**
             * Hook into post updates and status transitions as late as possible
             */
            add_action('save_post', array($this, 'fdPostChanged'), 32000, 2);
            add_action('transition_post_status', array($this, 'fdPostStatusChanged'), 32000, 3);
        }

        /**
         * Need to be able to edit posts at a minimum
         */
        if (!current_user_can('edit_posts')) {
            return;
        }

        /**
         * Only someone who can edit theme options can change the styling
         * This is a better capability to check than edit_plugins which is only for super admins
         */
        if (current_user_can('edit_theme_options')) {
            add_action('wp_ajax_easyrecipeCustomCSS', array($this, 'updateCustomCSS'));
            add_action('wp_ajax_easyrecipeSaveStyle', array($this, 'saveStyle'));
        }

        add_action("load-post.php", array($this, 'loadPostAdmin'));
        add_action("load-post-new.php", array($this, 'loadPostAdmin'));

        add_action('admin_enqueue_scripts', array($this, 'enqueAdminScripts'));
        add_filter('plugin_action_links', array($this, 'pluginActionLinks'), 10, 2);

        add_action('wp_ajax_easyrecipeConvert', array($this, 'convertRecipe'));

        add_action('wp_ajax_easyrecipeSupport', array($this, 'sendSupport'));
        add_action('update-custom_easyrecipe-update', array($this, 'forceUpdate'));

        $this->settings = EasyRecipeSettings::getInstance();

        /**
         * Show the Fooderific admin wp_pointer
         */
        add_action('admin_enqueue_scripts', array($this, 'enqueueFooderificWPPointer'));

        /**
         *  Add the hook that will schedule a site scan if it's requested
         *  A request to this also sets the fooderificEnabled setting to TRUE
         */
        add_action('wp_ajax_easyrecipeScanSchedule', array($this, 'fdScanSchedule'));

    }


    /**
     * Set up stuff we'll need on non-admin pages and stuff we'll need in both admin and non-admin
     */
    function initialise() {
        wp_register_style("easyrecipe-UI", self::$EasyRecipeURL . "/ui/easyrecipeUI.css", array('wp-admin', 'wp-pointer'), $this->pluginVersion);


        $this->settings = EasyRecipeSettings::getInstance();


        /*
        * Everything past here is not needed on admin pages
        */
        if (is_admin()) {
            return;
        }

        add_action('wp_enqueue_scripts', array($this, 'enqueueScripts'));

        /**
         * If this is one of our non-existent pages (print, diagnostics or custom styles) hook in early so 404 handlers don't stuff it up
         */
        if (preg_match('%/easyrecipe-(print|diagnostics|style|printstyle)(?:/([^?/]+))?%', $_SERVER['REQUEST_URI'])) {
            add_action('wp_headers', array($this, 'checkRewrites'), 0);
        } else {
            add_action('the_posts', array($this, 'thePosts'), 0);

            /**
             * Insert the admin bar "EasyRecipe Format" menu item if this user can edit theme options
             */
            if (current_user_can('edit_theme_options')) {
                add_action('wp_before_admin_bar_render', array($this, 'adminBarMenu'));
            }
            /**
             * Hook into the comment save if we're using EasyRecipe ratings
             */
            if ($this->settings->ratings == 'EasyRecipe') {
                add_action('comment_post', array($this, 'ratingSave'));
            }
        }
        /*
        * Override the default style for preview?
        */
        if (isset($_REQUEST['style']) && current_user_can("edit_theme_options")) {
            $this->styleName = $_REQUEST['style'];
        } else {
            $this->styleName = $this->settings->style;
        }

        /*
         * Make sure our head gets run before the enqueued stuff is output
        */
        add_action('wp_head', array($this, 'addHead'), 0);
        /*
        * Add the custom CSS very late so it overrides everything else
        */
        add_action('wp_head', array($this, 'addExtraCSS'), 100);
    }

    /**
     * EasyRecipe Plus is active - show a message
     */
    function showPlusActive() {
        echo <<<EOD
<div id="message" class="updated">
<p>EasyRecipe Plus is installed and active. You can now safely uninstall the free version of EasyRecipe</p>
</div>
EOD;
    }


    /**
     * Add the "EasyRecipe Format" option to the admin bar if the current user is an admin
     */
    function adminBarMenu() {
        /** @var $wp_admin_bar WP_Admin_Bar */
        global $wp_admin_bar;

        $root_menu = array('parent' => false, 'id' => 'ERFormatMenu', 'title' => 'EasyRecipe Format', 'href' => admin_url('#'), 'meta' => array('onclick' => 'EASYRECIPE.openFormat(); return false'));
        $wp_admin_bar->add_menu($root_menu);
    }

    /**
     * Load the EasyRecipe settings page
     */
    function loadSettingsPage() {
        wp_enqueue_style("easyrecipe-UI");
        wp_enqueue_style("easyrecipe-settings", self::$EasyRecipeURL . "/css/easyrecipe-settings.css", array('easyrecipe-UI'), $this->pluginVersion);

        wp_enqueue_script('easyrecipe-settings', self::$EasyRecipeURL . "/js/easyrecipe-settings.js", array('jquery-ui-dialog', 'jquery-ui-slider', 'jquery-ui-autocomplete', 'jquery-ui-tabs',
            'jquery-ui-button'), $this->pluginVersion, true);


        $this->settings = EasyRecipeSettings::getInstance();
    }

    /**
     */
    function addMenus() {
        $this->settings = EasyRecipeSettings::getInstance();
        $hook = add_menu_page('EasyRecipe Settings', 'EasyRecipe', 'manage_options', $this->pluginName, array($this->settings, 'showPage'), self::$EasyRecipeURL . "/images/chef16.png");
        add_action("load-$hook", array($this, 'loadSettingsPage'));
    }

    /**
     * Called before the post admin page is loaded
     * Queue up all the stuff we need
     * Remove the post from the object cache
     */
    function loadPostAdmin() {
        wp_enqueue_style("easyrecipe-UI");
        wp_enqueue_style("easyrecipe-entry", self::$EasyRecipeURL . "/css/easyrecipe-entry.css", array('easyrecipe-UI'), $this->pluginVersion);

        wp_enqueue_script('jquery-ui-dialog');
        wp_enqueue_script('jquery-ui-autocomplete');
        wp_enqueue_script('jquery-ui-button');
        wp_enqueue_script('jquery-ui-tabs');
        wp_enqueue_script('easyrecipe-entry', self::$EasyRecipeURL . "/js/easyrecipe-entry.js", array('jquery-ui-dialog', 'jquery-ui-autocomplete', 'jquery-ui-button',
            'jquery-ui-tabs'), $this->pluginVersion, true);

        wp_enqueue_script('easyrecipe-entry', self::$EasyRecipeURL . "/js/easyrecipe-entry.js");

        add_filter('tiny_mce_before_init', array($this, 'mcePreInitialise'));
        add_filter('mce_external_plugins', array($this, 'mcePlugins'));
        add_filter('mce_buttons', array($this, 'mceButtons'));
        add_action('admin_footer', array($this, 'addDialogHTML'));

        /*
        * Remove the object cache for this post because we may have cached the post as modified by thePosts() below.
           * Normally this wouldn't be a problem since object caches aren't normaly persistent and don't survive a page load,
        * but they may be persistent if there's a caching plugin installed (e.g. W3 Total Cache)
        */
        if (isset($_REQUEST['post'])) {
            wp_cache_delete($_REQUEST['post'], 'posts');
        }


    }

    /**
     * Enqueues the scripts to handle guest post stuff on the posts page
     * @param $hook
     */
    function enqueAdminScripts($hook) {
    }

    /**
     */
    function enqueueScripts() {
        /*
        * We only need our stuff if there's an EasyRecipe on the post/page
        */
        if (count($this->easyrecipes) == 0) {
            return;
        }

        /**
         * Hook into the comments stuff to add the rating widget, display rating on individual comments and save a rating
         * and ajax calls don't trigger the wp_enqueue_scripts action where this was done previously
         */
        if ($this->settings->ratings == 'EasyRecipe') {
            add_action('comment_form', array($this, 'commentForm'), 0);
            add_action('comment_post', array($this, 'ratingSave'));
            add_filter('get_comment_text', array($this, 'ratingDisplay'), 100);
        }

        /**
         * Hack that attempts to repair bad jQuery versions loaded from poorly written themes/plugins
         * Allow the user to load it if they specify 'loadjq' in the URL querystring since conflicting plugins may well
         * prevent the EasyRecipe Settings page from functioning
         */
        if ($this->settings->forcejQuery || (current_user_can('edit_theme_options') && isset($_REQUEST['loadjq']))) {
            wp_deregister_script('jquery');
            wp_register_script('jquery', self::JQUERYJS, false);
            wp_enqueue_script('jquery');
        }
        /*
        * Set the translate switch if this isn't in the US
        */
        if (get_locale() != 'en_US') {
            EasyRecipeTemplate::setTranslate('easyrecipe');
        }




        if ($this->settings->removeMicroformat) {
            add_filter('post_class', array($this, 'postClass'), 100);
            ob_start(array($this, 'fixMicroformats'));
        }

        $this->styleData = EasyRecipeStyles::getStyleData($this->styleName, $this->settings->customTemplates);

        wp_enqueue_style('easyrecipestyle-reset', self::$EasyRecipeURL . "/css/easyrecipe-style-reset.css", array(), $this->pluginVersion);
        wp_enqueue_style("easyrecipebuttonUI", self::$EasyRecipeURL . "/ui/easyrecipe-buttonUI.css", array('easyrecipestyle-reset'), $this->pluginVersion);
        /**
         * If the style directory starts with an underscore, it's a custom style
         */
        if ($this->styleData->directory[0] == '_') {
            wp_enqueue_style("easyrecipestyle", "/easyrecipe-style/style.css", array('easyrecipestyle-reset'), "$this->pluginVersion.{$this->styleData->version}");
        } else {
            wp_enqueue_style("easyrecipestyle", self::$EasyRecipeURL . "/styles/$this->styleName/style.css", array('easyrecipestyle-reset'), "$this->pluginVersion.{$this->styleData->version}");
        }

        if (file_exists(self::$EasyRecipeDir . "/styles/$this->styleName/style.js")) {
            wp_enqueue_script('easyrecipestyle', self::$EasyRecipeURL . "/styles/$this->styleName/style.js", array($this->pluginName), "$this->pluginVersion.{$this->styleData->version}", $this->loadJSInFooter);
        }

        wp_enqueue_script($this->pluginName, self::$EasyRecipeURL . "/js/easyrecipe.js", array('jquery', 'jquery-ui-button'), $this->pluginVersion, $this->loadJSInFooter);

        /**
         * Load any fonts used by the style
         * TODO - the enqueue name should be unique
         */
        foreach ($this->styleData->fonts as $font) {
            switch ($font['provider']) {
                case 'google' :
                    wp_enqueue_style("easyrecipefonts-" . $font['provider'], "http://fonts.googleapis.com/css?family=" . $font['fonts']);
                    break;
            }
        }

        /**
         * Load format dialogs and UI CSS if logged in as admin
         * Use our own version of an unobtrusive jQuery UI theme to prevent interference from themes and plugins that override standard stuff
         *
         * edit_theme_options is a better capability to check than edit_plugins (which is limited to super admins)
         *
         */
        if (current_user_can("edit_theme_options")) {
            /*
             * Use an unobtrusive grey scheme for the formatting dialog so it doesn't visually overpower the recipe's styling
            */
            wp_enqueue_style("easyrecipe-FormatUI", self::$EasyRecipeURL . "/formatui/easyrecipeFormatUI.css", array(), $this->pluginVersion);
            wp_enqueue_style("easyrecipeformat", self::$EasyRecipeURL . "/css/easyrecipe-format.css", array('easyrecipe-FormatUI'), $this->pluginVersion);

            wp_enqueue_script('easyrecipeformat', self::$EasyRecipeURL . "/js/easyrecipe-format.js", array('jquery', 'jquery-ui-slider', 'jquery-ui-autocomplete', 'jquery-ui-accordion',
                'jquery-ui-dialog', 'jquery-ui-tabs', 'jquery-ui-button',
                'json2'), $this->pluginVersion, $this->loadJSInFooter);
            add_action('wp_footer', array($this, 'addFormatDialog'), 0);
        }

        if ($this->settings->enableSwoop) {
            add_action('wp_footer', array($this, 'addSwoop'), 32767);
        }
    }


    /**
     *  FOODERIFIC
     *
     *  A site scan has been requested. Normally comes from an ajax call but may be from the temporary hack in initialiseAdmin()
     * If Fooderific is not currently enabled, then enable it
     *  Then schedule the scan and save the time if it was actually scheduled
     *
     */
    function fdScanSchedule($die = true) {

        $this->settings->enableFooderific = true;

        $fooderific = new EasyRecipeFooderific();
        if ($fooderific->scanSchedule()) {
            $this->settings->lastScanStarted = time();
        }
        $this->settings->update();

        if ($die) {
            $result = new stdClass();
            $result->status = 'OK';
            $result->lastScan = $this->settings->lastScanStarted;
            die(json_encode($result));
        }
    }

    /**
     * Actually run the site scan
     */
    function fdScan($postID) {
        $fooderific = new EasyRecipeFooderific();
        $fooderific->scanRun($postID);
    }


    /**
     * A post has changed - Let the Fooderific code decide what to do
     */
    function fdPostChanged($postID, $post = null) {
        $fooderific = new EasyRecipeFooderific();
        $fooderific->postChanged($postID, $post);
    }

    /**
     * A post's status has changed. Let the Fooderific code decide what to do
     */
    function fdPostStatusChanged($newStatus, $oldStatus, $post) {
        $fooderific = new EasyRecipeFooderific();
        $fooderific->postStatusChanged($newStatus, $oldStatus, $post);
    }

    /**
     * Normally Wordpress only checks for plugin updates twice a day
     * The EasyRecipe Settings page always checks for new updates and if one is available it links to the WP plugin update page
     * However Wordpress won't update a plugin if it thinks the current installed version is up to date (which it will if it hasn't checked since the update became available)
     * To force WP to re-check for available updates before the update process, we delete the site_transient record
     *
     * The rationale for doing this is that if a user is on the Support page, we ought to make sure she has the latest version before submitting a support ticket
     */
    function forceUpdate() {
        /** @global  $wpdb wpdb */
        global $wpdb;

        $wpdb->query("DELETE FROM $wpdb->options WHERE option_name = '_site_transient_update_plugins'");


        $nonce = wp_create_nonce('upgrade-plugin_easyrecipe/easyrecipe.php');
        $url = get_bloginfo('wpurl') . "/wp-admin/update.php?action=upgrade-plugin&plugin=easyrecipe/easyrecipe.php&_wpnonce=$nonce";

        header("Location: $url");
    }



    /**
     * Display the admin pointer about fooderific until it gets dismissed
     */
    function enqueueFooderificWPPointer() {
        if (current_user_can('edit_theme_options')) {
            $dismissed = explode(',', (string) get_user_meta(get_current_user_id(), 'dismissed_wp_pointers', true));

            if (!in_array('easyrecipe-fooderific', $dismissed)) {
                wp_enqueue_style('wp-pointer');
                wp_enqueue_script('wp-pointer');
                wp_enqueue_script('easyrecipe-wppointer', self::$EasyRecipeURL . "/js/easyrecipe-wppointer.js", array('wp-pointer'), $this->pluginVersion);

                add_action('admin_print_footer_scripts', array($this, 'adminPostsFooterFooderific'));
            }
        }
    }





    /**
     * Output the stuff for the wp_pointer message after an update
     * Save the new version so we only display the message once
     */
    function adminPostsFooterFooderific() {
        $this->settings->pluginVersion = $this->pluginVersion;
        $this->settings->update();

        $data = new stdClass();
        $data->plus = '';
        $data->version = '3.2.1255';
        $template = new EasyRecipeTemplate(self::$EasyRecipeDir . "/templates/easyrecipe-fooderific.html");
        $html = str_replace("'", '&apos;', $template->replace($data));
        $html = str_replace("\r", "", $html);
        $html = str_replace("\n", " ", $html);
        echo <<<EOD
<script type="text/javascript">
// <![CDATA[
if (typeof EASYRECIPE === "undefined") {
    var EASYRECIPE = {};
}
EASYRECIPE.wppHTML = '$html';
EASYRECIPE.wppWidth = 425;
EASYRECIPE.wppPosition = {edge:'top', align:'center'};
EASYRECIPE.wppSelector = '#wpadminbar';
///]]>
</script>
EOD;
    }



    /**
     * Many (most?) Wordpress themes seem to have have broken implementations of hfeed & hcard microformats
     * These errors prevent the Google Rich Snippet test tool from generating a rich snippet sample
     * We don't know if it affects the Google results or just the test tool - but better to be safe than sorry by removing the broken stuff
     * It appears that removing the broken stuff has no effect on the blog - which makes sense as it's broken anyway!
     */
    function fixMicroformats($page) {
        $page = str_replace("hfeed", "", $page);
        $page = str_replace("hentry", "", $page);
        $page = str_replace("vcard", "", $page);
        $page = str_replace('class=""', "", $page);
        return $page;
    }

    /**
     * Remove hentry from the post classes
     *
     * This *should* get caught by fixMicroformats() above, but some plugins (e.g. Wordpress SEO)
     * stuff up output buffer handlers by arbitrarily doing a buffer clean
     *
     * @param $classes
     * @return mixed
     */
    function postClass($classes) {
        if (($ix = array_search('hentry', $classes)) !== false) {
            unset($classes[$ix]);
        }
        return $classes;
    }

    /**
     * Get the custom and extra CSS
     *
     * Custom CSS is from Live Formatting and is json encoded
     * Extra CSS is from the settings page and is plain text
     *
     * @param string $print
     * @return string
     */
    private function getCSS($print = '') {
        $customCSS = trim($this->settings->{"custom{$print}CSS"});
        if ($customCSS != '') {
            $customCSS = json_decode(stripslashes($customCSS));
            if (!$customCSS) { // TODO- handle this error better
                $customCSS = array();
            }
        } else {
            $customCSS = array();
        }

        // todo - check this construct works *** Should check for empty() - not empty strings
        $extraCSS = trim($this->settings->{"extra{$print}CSS"});
        $css = '';
        if ($customCSS != '' || $extraCSS != '') {
            $css = "<style type=\"text/css\">\n";
            foreach ($customCSS as $selector => $style) {
                $style = addslashes($style);
                /*
                * Make the selectors VERY specific to override theme CSS
                * Aloso make them "important"
                */
                if (stripos($selector, ".easyrecipe") === 0) {
                    $selector = "html body div" . $selector;
                } else {
                    if (stripos($selector, "div.easyrecipe") === 0) {
                        $selector = "html body " . $selector;
                    } else {
                        if (stripos($selector, "html body") === false) {
                            $selector = "html body " . $selector;
                        }
                    }
                }
                /**
                 * Make the custom styles !important to override any very specific theme settings
                 *
                 * But if the current user can use Live Formatting, DON'T make the custom styles !important
                 * When Live Formatting is active the custom styes are applied to elements directly in their style attribute
                 * Making the custom styles CSS !important overrides inherited custom styles when Live Formatting
                 */
                if (!current_user_can("edit_theme_options")) {
                    $styles = explode(';', $style);
                    $style = '';
                    foreach ($styles as $s) {
                        if (!preg_match('/!\s*important\s*/', $s)) {
                            $s .= '!important';
                        }
                        $style .= "$s;";
                    }

                }
                $css .= "$selector { $style }\n";
            }
            $css .= $extraCSS;
            $css .= "</style>\n";
        }
        return $css;
    }

    public function addHead() {


    }

    public function addExtraCSS() {
        echo $this->getCSS();
    }

    /**
     * Process a "Save style" from Live Formatting
     */
    public function saveStyle() {
        if (current_user_can("edit_theme_options")) {
            if (!isset($this->settings)) {
                $this->settings = EasyRecipeSettings::getInstance();
            }


            // FIXME - check that the new system works OK!
            $this->settings->style = isset($_POST['style']) ? $_POST['style'] : '';
            $this->settings->update();
            /*
            $settings = get_option($this->settingsName, array());
            $this->settings->put('style', $style);
            $this->settings->update();
            */
        }
        die('OK');
    }

    /**
     * Process the update from the format javascript via ajax
     */
    public function updateCustomCSS() {
        if (current_user_can("edit_theme_options")) {
            if (!isset($this->settings)) {
                $this->settings = EasyRecipeSettings::getInstance();
            }
            // FIXME - check this works!
            $setting = isset($_POST['isPrint']) ? "customPrintCSS" : "customCSS";
            $this->settings->{$setting} = isset($_POST['css']) ? $_POST['css'] : "";
            $this->settings->update();

        }
        /*
        * The return isn't necessary but it helps with unit testing
        */
        die('OK');
    }

    /**
     * @param bool $isPrint
     * @return string
     */
    function getFormatDialog($isPrint = false) {
        $data = new stdClass();
        $data->SECTIONS = array();
        $id = 0;

        $styleData = $isPrint ? $this->printStyleData : $this->styleData;

        /**
         * Get the formatting data for each formattable element
         * Add more specificity to each target so it should override any specific theme CSS
         */
        $formats = @json_decode($styleData->formatting);
        if ($formats) {
            foreach ($formats as $format) {
                $item = new stdClass();
                if (stripos($format->target, ".easyrecipe") === 0) {
                    $format->target = "html body div" . $format->target;
                } else {
                    if (stripos($format->target, "div.easyrecipe") === 0) {
                        $format->target = "html body " . $format->target;
                    } else {
                        if (stripos($format->target, "html body") === false) {
                            $format->target = "html body " . $format->target;
                        }
                    }
                }

                $item->section = $format->section;
                $format->id = $item->id = $id++;
                $data->SECTIONS[] = $item;
            }
        }

        /*
        * Get all the styles we have
        */
//        $styles = call_user_func(array($this->stylesClass, 'getStyles'), $this->settings->get('customTemplates'), $isPrint);
        $styles = EasyRecipeStyles::getStyles($this->settings->customTemplates, $isPrint);

        $data->STYLES = array();
        $styleThumbs = array();
        foreach ($styles as $style) {
            $item = new stdClass();
            $item->directory = $style->directory;
            $item->selected = $item->directory == $this->styleName ? 'selected="selected"' : '';
            $item->style = $style->style;
            $styleThumbs[$style->directory] = $style->thumbnail;
            $data->STYLES[] = $item;
        }
        $data->stylethumb = $styleData->thumbnail;

        $template = new EasyRecipeTemplate(self::$EasyRecipeDir . "/templates/easyrecipe-format.html");
        $html = $template->replace($data);

        $template = new EasyRecipeTemplate(self::$EasyRecipeDir . "/templates/easyrecipe-fontchange.html");
        $fontChangeHTML = $template->replace($data);
        $fontChangeHTML = str_replace("\r", "", $fontChangeHTML);
        $fontChangeHTML = str_replace("\n", " ", $fontChangeHTML);
        $fontChangeHTML = str_replace("'", '\0x27', $fontChangeHTML);
        $fontChangeHTML = trim(preg_replace('/> \s+</i', '> <', $fontChangeHTML));
        $ajaxURL = admin_url('admin-ajax.php');
        $cssType = $isPrint ? 'customPrintCSS' : 'customCSS';
        $customCSS = $this->settings->$cssType;
        if ($customCSS == '') {
            $customCSS = '{}';
        }
        $formats = json_encode($formats);
        $formats = str_replace("'", '\'', $formats);

        $print = $isPrint ? 'true' : 'false';
        $thumbs = json_encode($styleThumbs);
        $url = self::$EasyRecipeURL;
        $html .= <<<EOD
<script type="text/javascript">
/* <![CDATA[ */

if (typeof EASYRECIPE === "undefined") {
  var EASYRECIPE = {};
}
EASYRECIPE.isPrint = $print;
EASYRECIPE.formatting = '$formats';
EASYRECIPE.customCSS = '$customCSS';
EASYRECIPE.easyrecipeURL = '$url';
EASYRECIPE.version = '$this->pluginVersion';
EASYRECIPE.ajaxURL = '$ajaxURL';
EASYRECIPE.styleThumbs = '$thumbs';
EASYRECIPE.fontChangeHTML = '$fontChangeHTML';
/* ]]> */
</script>
EOD;
        /*
        * Display formatting JS is handled by enqueue scripts
        * The print page exits before enqueues get output so add the script manually now
        */
        if ($isPrint && current_user_can("edit_theme_options")) {
            $html .= sprintf('<script type="text/javascript" src="%s/js/easyrecipe-format.js?version=%s"></script>', self::$EasyRecipeURL, $this->pluginVersion);
        }
        return $html;
    }

    function addFormatDialog() {
        echo $this->getFormatDialog();
    }

    function addSwoop() {
        printf(self::SWOOPJS, $this->settings->swoopSiteID);
    }

    /*
    * Displays just the recipe and exits
    */
    private function printRecipe($postID, $recipeIX) {
        /** @var $wpdb wpdb */
        global $wpdb;

        $post = get_post($postID);
        if (!$post) {
            return;
        }


        $postDOM = new EasyRecipeDocument($post->post_content);

        if (!$postDOM->isEasyRecipe) {
            return;
        }

        /*
        * If the post is formatted already then it came from the Object cache
        * If that's the case we need to re-read the original
        */
        if ($postDOM->isFormatted) {
            $post = $wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "posts WHERE ID = $postID");
            $postDOM = new EasyRecipeDocument($post->post_content);

            if (!$postDOM->isEasyRecipe) {
                return;
            }
        }

        $this->settings = EasyRecipeSettings::getInstance();
        if (isset($_GET['style'])) {
            $this->styleName = $_GET['style'];
        } else {
            $this->styleName = $this->settings->printStyle;
        }


//        $this->printStyleData = call_user_func(array($this->stylesClass, 'getStyleData'), $this->styleName, $this->settings->get('customTemplates'), true);
        $this->printStyleData = EasyRecipeStyles::getStyleData($this->styleName, $this->settings->customTemplates, true);
        if (get_locale() != 'en_US') {
            EasyRecipeTemplate::setTranslate('easyrecipe');
        }

        /**
         * Fix possibly broken times in older posts
         * Fix the Cholesterol oops in early versions
         */

        if ($postDOM->recipeVersion < '3') {
            $postDOM->fixTimes("preptime");
            $postDOM->fixTimes("cooktime");
            $postDOM->fixTimes("duration");
            $postDOM->setParentValueByClassName("cholestrol", $this->settings->lblCholesterol, "Cholestrol");
        }

        $postDOM->setSettings($this->settings);
        $data = new stdClass();
        $data->hasRating = false;

        $this->settings->getLabels($data);
        $data->hasLinkback = $this->settings->allowLink;
        $data->title = $post->post_title;
        $data->blogname = get_option("blogname");
        $data->recipeurl = get_permalink($post->ID);

        $data->customCSS = $this->getCSS('Print');

        $data->easyrecipeURL = self::$EasyRecipeURL;

        $recipe = $postDOM->getRecipe($recipeIX);
        $photoURL = $postDOM->findPhotoURL($recipe);
        /**
         * Look for an image and try to scale it proportionally Pretty crap way
         * of doing it - we really should create a thumb so it only needs to be
         * done once ever - in a later version maybe!
         */
        if ($photoURL) {
            $imageSize = 200;

            /**
             * Try for a file on the current server first
             */
            $parsedURL = parse_url($photoURL);
            $fName = $_SERVER['DOCUMENT_ROOT'] . $parsedURL['path'];
            $img = false;
            /**
             * If it exists on the server's doc root, and it's a file, try reading it
             */
            if (@is_file($fName)) {
                $img = @file_get_contents($fName);
            }
            /**
             * If reading the file didn't work, try getting the URL
             */
            if (!$img) {
                $img = @file_get_contents($photoURL);
            }
            /**
             * If still no go, try sockets as a last resort
             */
            if (!$img) {
                $img = $this->getImage($parsedURL);
            }

            if ($img) {
                $image = @imagecreatefromstring($img);
                if ($image) {
                    $x = imagesx($image);
                    $y = imagesy($image);
                    if ($x > $y) {
                        $tx = $imageSize;
                        $ty = floor($y * $imageSize / $x);
                    } else {
                        $ty = $imageSize;
                        $tx = floor($x * $imageSize / $y);
                    }

                    $data->tx = $tx;
                    $data->ty = $ty;
                    $data->hasPhoto = true;
                }
            }
        }
        $data->jqueryjs = self::JQUERYJS;
        $data->jqueryuijs = self::JQUERYUIJS;
        $data->jqueryuicss = self::JQUERYUICSS;

        if (current_user_can('edit_posts')) {
            $data->isAdmin = true;
            $data->formatDialog = $this->getFormatDialog(true);
        } else {
            $data->formatDialog = '';
        }

        $data->style = $this->styleName;

        if ($data->style[0] == '_') {
        } else {
            $data->css = self::$EasyRecipeURL . "/printstyles/$data->style";
            $templateFile = self::$EasyRecipeDir . "/printstyles/$data->style/style.html";
        }

        $data->css .= "/style.css?version=$this->pluginVersion.{$this->printStyleData->version}";

        $template = new EasyRecipeTemplate($templateFile);

        /**
         * Brain dead IE shows "friendly" error pages (i.e. it's non-compliant) so we need to force a 200
         */
        header("HTTP/1.1 200 OK");

        echo $postDOM->formatRecipe($recipe, $template, $data);


        exit();
    }


    /**
     * Check if this is one of our rewrite endpoints (non-existent pages)
     */
    function checkRewrites() {

        /**
         * Just return if it's nothing we're interested in
         */
        if (!preg_match('%/easyrecipe-(print|diagnostics)(?:/([^?/]+))?%', $_SERVER['REQUEST_URI'], $regs)) {
            return;
        }

        switch ($regs[1]) {
            case 'print' :
                if (preg_match('/^([\d]+)-([\d+])$/', $regs[2], $regs)) {
                    $this->printRecipe($regs[1], $regs[2]);
                }
                break;

            case 'diagnostics' :
                if (current_user_can('administrator')) {
                    $this->diagnosticsShowData();
                }
                break;

        }
    }


    /**
     * @param $posts
     * @return array
     */
    function thePosts($posts) {
        /* @var $wp_rewrite WP_Rewrite */
        global $wp_rewrite;

        /** @global  $wpdb wpdb */
        global $wpdb;

        $guestpost = null;
        $newPosts = array();
        /**
         * Process each post and replace placeholders with relevant data
         */
        foreach ($posts as $post) {

            /**
             * Have we already processed this post?
             */
            if (isset($this->easyrecipes[$post->ID])) {
                $post->post_content = $this->postContent[$post->ID];
                $newPosts[] = $post;
                continue;
            }


            $postDOM = new EasyRecipeDocument($post->post_content);

            if (!$postDOM->isEasyRecipe) {
                $newPosts[] = $post;
                continue;
            }

            $postDOM->setSettings($this->settings);
            /**
             * Mark this post as an easyrecipe so that the comment and rating processing know
             */
            $this->easyrecipes[$post->ID] = true;

            /**
             * Make sure we haven't already formatted this post. This can happen in preview mode where WP replaces the post_content
             * of the parent with the autosave content which we've already processed.
             * If this is the case, save the formatted code and mark this post as having been processed
             * TODO - are there implications for the object cache for themes that re-read posts?
             */
            if ($postDOM->isFormatted) {
                $this->postContent[$post->ID] = $post->post_content;
                $newPosts[] = $post;
                continue;
            }

            /**
             * Fix possibly broken times in older posts
             * Fix the Cholesterol typo oops in early versions
             */

            if ($postDOM->recipeVersion < '3') {
                $postDOM->fixTimes("preptime");
                $postDOM->fixTimes("cooktime");
                $postDOM->fixTimes("duration");
                $postDOM->setParentValueByClassName("cholestrol", $this->settings->lblCholesterol, "Cholestrol");
            }

            $data = new stdClass();

            /**
             * Get the ratings from the comment meta table
             */

            if ($this->settings->ratings == 'EasyRecipe') {
                $q = "SELECT COUNT(*) AS count, SUM(meta_value) AS sum FROM $wpdb->comments JOIN $wpdb->commentmeta ON $wpdb->commentmeta.comment_id = $wpdb->comments.comment_ID ";
                $q .= "WHERE comment_approved = 1 AND meta_key = 'ERRating' AND comment_post_ID = $post->ID AND meta_value > 0";
                $ratings = $wpdb->get_row($q);

                if ((int) $ratings->count > 0) {
                    $data->ratingCount = $ratings->count;
                    $data->ratingValue = number_format($ratings->sum / $ratings->count, 1);
                    $data->ratingPC = $data->ratingValue * 100 / 5;
                    $data->hasRating = true;
                } else {
                    $data->hasRating = false;
                }

            }
            $this->settings->getLabels($data);



            $data->hasLinkback = $this->settings->allowLink;
            $data->displayPrint = $this->settings->displayPrint;
            $data->style = $this->styleName;
            $data->title = $post->post_title;
            $data->blogname = get_option("blogname"); // TODO - do all this stuff at initialise time?
            $data->siteURL = $this->homeURL;

            /**
             * If the site isn't using permalinks then just pass the print stuff as a qurerystring param
             */
            if ($wp_rewrite->using_permalinks()) {
                $data->sitePrintURL = $data->siteURL;
            } else {
                $data->sitePrintURL = $data->siteURL . "?";
            }

            $data->postID = $post->ID;
            $data->recipeurl = get_permalink($post->ID);
            $data->convertFractions = $this->settings->convertFractions;

            if ($this->styleName[0] == '_') {
                $styleName = substr($this->styleName, 1);
                $templateFile = $this->settings->customTemplates . "/styles/$styleName/style.html";
            } else {
                $templateFile = self::$EasyRecipeDir . "/styles/$this->styleName/style.html";
            }
            $template = new EasyRecipeTemplate($templateFile);


            /**
             * Replace the original content with the one that has the easyrecipe(s) nicely formatted and marked up
             * Also keep a copy so we don't have to reformat in the case where the theme asks for the same post again

             */
            $this->postContent[$post->ID] = $post->post_content = $postDOM->applyStyle($template, $data);
            /**
             * Some themes do a get_post() again instead of using the posts as modified by plugins
             * So make sure our modified post is in cache so the get_post() picks up the modified version not the original
             * Need to do both add and replace since add doesn't replace and replace doesn't add and we can't be sure if the cache key exists at this point
             */
            wp_cache_add($post->ID, $post, 'posts');
            wp_cache_replace($post->ID, $post, 'posts');

            $newPosts[] = $post;
        }
        return $newPosts;
    }

    /**
     * Explicitly allow the itemprop, datetime and link attributes otherwise WP will strip them
     *
     * @param $postID
     */
    function publishFuturePost($postID) {
        global $allowedposttags;

        $post = get_post($postID);
        if (strpos($post->post_content, 'easyrecipe') !== false) {
            $allowedposttags['time'] = array('itemprop' => true, 'datetime' => true);
            $allowedposttags['link'] = array('itemprop' => true, 'href' => true);
            $this->settings = EasyRecipeSettings::getInstance();
            if ($this->settings->enableFooderific) {
                $this->fdPostStatusChanged('publish', 'future', $post);
            }
        }

    }

    /**
     * Check to see if the post content contains the wrappers we use to facilitate line insertion above & below a recipe
     *
     * If they exist, strip them out FIXME
     */
    function postSave($data, /** @noinspection PhpUnusedParameterInspection */
                      $postarr) {

        /*
                if (strpos($data['post_content'], 'easyrecipeWrapper') !== false) {
                    $content = stripslashes($data['post_content']);
                    $dom = new $this->documentClass($content);
                    $content = $dom->stripWrappers();
                    if ($content !== null) {
                        $data['post_content'] = $content;
                    }
                }
        */
        return $data;

    }

    function commentForm($postID) {

        /*
        * Only add ratings for easy recipes
        */
        if (!isset($this->easyrecipes[$postID]) || !$this->easyrecipes[$postID]) {
            return;
        }

        $rateLabel = $this->settings->lblRateRecipe;

        echo <<<EOD
<span class="ERComment">
<span style="float:left">$rateLabel: </span>
<span class="ERRateBG">
<span class="ERRateStars"></span>
</span>
<input type="hidden" class="inpERRating" name="ERRating" value="0" />
&nbsp;
</span>
EOD;
    }

    function ratingSave($commentID) {
        if (isset($_POST['ERRating'])) {
            $rating = (int) $_POST['ERRating'];
            if ($rating > 0) {
                add_comment_meta($commentID, 'ERRating', $rating, true);
            }
        }
    }

    function ratingDisplay($comment) {
        global $post;

        /*
        * Only display comment ratings if the post is an EasyRecipe
        */
        if (!$this->easyrecipes[$post->ID]) {
            return $comment;
        }

        $rating = get_comment_meta(get_comment_ID(), 'ERRating', true);
        if ($rating == '') {
            $rating = 0;
        }
        $stars = "";
        if ($rating > 0) {
            $rating *= 20;

            $stars = <<<EOD
      <div class="ERRatingComment">
      <div style="width:$rating%" class="ERRatingCommentInner"></div>
      </div >
EOD;
        }
        return $comment . $stars;
    }

    function pluginActionLinks($links, $pluginFile) {
        if ($pluginFile == "easyrecipe/easyrecipe.php") {
            $links[] = '<a href="admin.php?page=EasyRecipe">' . __('Settings') . '</a>';
        }
        return $links;
    }

    /**
     * Send a support question (and possibly diagnostics) to EasyRecipe support
     */
    function sendSupport() {
        $data = new stdClass();
        $data->email = stripslashes($_POST['email']);
        $data->name = stripslashes($_POST['name']);
        $data->problem = stripslashes($_POST['problem']);
        if (isset($_POST['diagnostics'])) {
            $diagnostics = new EasyRecipeDiagnostics();
            $data->vars = $diagnostics->get();
        } else {
            $diags = new stdClass();
            $diags->phpinfo = print_r($_POST, true);
            $data->vars = $diags;
        }
        $data = json_encode($data);

        $args = array('body' => array('data' => $data));
        $response = wp_remote_post(self::DIAGNOSTICS_URL, $args);

        $result = new stdClass();
        $result->status = 'FAIL';
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
     * Display a page showing what diagnostics data will be sent
     */
    function diagnosticsShowData() {
        $diagnostics = new EasyRecipeDiagnostics();
        $data = $diagnostics->get();

        $data->easyrecipeURL = self::$EasyRecipeURL;
        $data->version = $this->pluginVersion;

        $settings = EasyRecipeSettings::getInstance();
        $data->ERSettings = print_r($settings, true);

        $template = new EasyRecipeTemplate(self::$EasyRecipeDir . "/templates/easyrecipe-diagnostics.html");
        $html = $template->replace($data, EasyRecipeTemplate::PRESERVEWHITESPACE);

        header("HTTP/1.1 200 OK");
        echo $html;

        exit();
    }

    /**
     * Create the settings - it will convert from the FREE settings if this is the PLUS version
     */
    function pluginActivated() {

        /**
         * Get the settings and save the current version so we don't trigger the update message on an actual activation
         */
        $this->settings = EasyRecipeSettings::getInstance();
        $this->settings->pluginVersion = $this->pluginVersion;
        $this->settings->update();

        $data = http_build_query(array('action' => 'activate', 'site' => get_site_url()));
        wp_remote_post("http://www.easyrecipeplugin.com/installed.php", array('body' => $data, "blocking" => false));

    }

    function pluginDeactivated() {
        $data = http_build_query(array('action' => 'deactivate', 'site' => get_site_url()));
        wp_remote_post("http://www.easyrecipeplugin.com/installed.php", array('body' => $data, "blocking" => false));
    }

    /**
     * Allow <link> and <time> tags
     */
    function mcePreInitialise($init) {
        $ext = 'link[itemprop|href],time[itemprop|datetime]';

        if (isset($init['extended_valid_elements'])) {
            $init['extended_valid_elements'] .= ',' . $ext;
        } else {
            $init['extended_valid_elements'] = $ext;
        }
        return $init;
    }

    /**
     * Add our tinyMCE plugin
     */
    function mcePlugins($plugins) {
        $plugins = (array) $plugins;
        $plugins['easyrecipe'] = self::$EasyRecipeURL . "/js/easyrecipe-mce.js?v=$this->pluginVersion";
        $plugins['noneditable'] = self::$EasyRecipeURL . "/tinymce/noneditable.js?v=$this->pluginVersion";
        return $plugins;
    }

    /**
     * Add our tinyMCE buttons
     */
    function mceButtons($buttons) {
        if ($this->isGuest) {
            $buttons[] = 'easyrecipeImage';
        }
        $buttons[] = 'easyrecipeEdit';
        $buttons[] = 'easyrecipeAdd';
        $buttons[] = 'easyrecipeTest';
        return $buttons;
    }

    /**
     * Insert the easyrecipe dialogs and template HTML at the end of the
     * page - they're display:none by default
     */
    function addDialogHTML() {
        global $post;

        if (!$this->isGuest && !isset($post)) {
            return;
        }

        $template = new EasyRecipeTemplate(self::$EasyRecipeDir . "/templates/easyrecipe-entry.html");
        echo $template->replace();

        $data = new stdClass();
        $data->easyrecipeURL = self::$EasyRecipeURL;
        $template = new EasyRecipeTemplate(self::$EasyRecipeDir . "/templates/easyrecipe-upgrade.html");
        echo $template->replace($data);


        $data = new stdClass();
        $data->easyrecipeURL = self::$EasyRecipeURL;
        $template = new EasyRecipeTemplate(self::$EasyRecipeDir . "/templates/easyrecipe-convert.html");
        echo $template->replace($data);

        $template = new EasyRecipeTemplate(self::$EasyRecipeDir . "/templates/easyrecipe-htmlwarning.html");
        echo $template->getTemplateHTML();

        /**
         * Get the basic data template
         * We need to preserve comments here because the template is processed by the javascript template engine and it needs the INCLUDEIF/REPEATS
         */

        $template = new EasyRecipeTemplate(self::$EasyRecipeDir . "/templates/easyrecipe-template.html");

        $html = $template->getTemplateHTML(EasyRecipeTemplate::PRESERVECOMMENTS);
        $html = preg_replace('/\n */', ' ', $html);
        $html = trim(str_replace("'", "\"", $html));

        /*
        * Unless this is a guest post, get the URL we can test at Google (as long as it's published)
        */
        if (!$this->isGuest) {
            $testURL = $post->post_status == 'publish' ? urlencode(get_permalink($post->ID)) : '';
        } else {
            $testURL = '';
        }

        if ($this->isGuest) {
            /** @var $guestAuthor WP_User */
            $guestAuthor = get_user_by('id', $this->settings->gpUserID);
            /** @noinspection PhpUndefinedFieldInspection */
            $author = str_replace("'", '\x27', json_encode(str_replace('"', '\\"', $guestAuthor->data->display_name)));
        } else {
            $author = str_replace("'", '\x27', json_encode(str_replace('"', '\\"', $this->settings->author)));
        }


        $cuisines = str_replace("'", '\x27', json_encode(explode('|', str_replace('"', '\\"', $this->settings->cuisines))));
        $recipeTypes = str_replace("'", '\x27', json_encode(explode('|', str_replace('"', '\\"', $this->settings->recipeTypes))));

        $ingredients = str_replace("'", '\x27', json_encode(str_replace('"', '\\"', $this->settings->lblIngredients)));
        $instructions = str_replace("'", '\x27', json_encode(str_replace('"', '\\"', $this->settings->lblInstructions)));
        $notes = str_replace("'", '\x27', json_encode(str_replace('"', '\\"', $this->settings->lblNotes)));
        if (!function_exists('get_upload_iframe_src')) {
            require_once(ABSPATH . 'wp-admin/includes/media.php');
        }
        $upIframeSrc = get_upload_iframe_src();
        $guestPost = $this->isGuest ? 'true' : 'false';
        $wpurl = get_bloginfo('wpurl');
        $url = self::$EasyRecipeURL;
        $wpVersion = $GLOBALS['wp_version'];
        echo <<<EOD
<script type="text/javascript">
/* <![CDATA[ */

if (typeof EASYRECIPE === "undefined") {
  var EASYRECIPE = {};
}
EASYRECIPE.ingredients ='$ingredients';
EASYRECIPE.instructions ='$instructions';
EASYRECIPE.notes ='$notes';
EASYRECIPE.version = '$this->pluginVersion';
EASYRECIPE.easyrecipeURL = '$url';
EASYRECIPE.recipeTemplate = '$html';
EASYRECIPE.testURL = '$testURL';
EASYRECIPE.author = '$author';
EASYRECIPE.recipeTypes = '$recipeTypes';
EASYRECIPE.cuisines = '$cuisines';
EASYRECIPE.upIframeSrc = '$upIframeSrc';
EASYRECIPE.isGuest = $guestPost;
EASYRECIPE.wpurl = '$wpurl';
EASYRECIPE.wpVersion = '$wpVersion';
EASYRECIPE.postID = $post->ID;
/* ]]> */
</script>
EOD;
    }


    /**
     * Convert a recipe from other plugins
     */
    function convertRecipe() {
        $convert = new EasyRecipeConvert();
        $convert->convertRecipe();
    }

    function socketIO($method, $host, $port, $path, $data = "", $timeout = 5) {
        $fp = @fsockopen($host, $port, $errno, $errstr, $timeout);

        if (!$fp) {
            return false;
        }

        @fputs($fp, "$method $path HTTP/1.1\r\nHost: $host\r\n");

        if ($method == "POST") {
            fputs($fp, "Content-type: application/x-www-form-urlencoded\r\n");
            fputs($fp, "Content-length: " . strlen($data) . "\r\n");
            fputs($fp, "Connection: close\r\n\r\n");
            fputs($fp, $data);
        } else {
            fputs($fp, "Connection: close\r\n\r\n");
        }

        $inData = "";
        while (($data = @fread($fp, 4096)) !== '' && $data !== false) {
            $inData .= $data;
        }
        @fclose($fp);

        $endHeaders = strpos($inData, "\r\n\r\n");
        return substr($inData, $endHeaders + 4);
    }

    /*
    * Read image from a URL
    */
    function getImage($parsedURL) {
        $host = $parsedURL['host'];
        $path = isset($parsedURL['path']) ? $parsedURL['path'] : ' / ';
        $path .= isset($parsedURL['query']) ? $parsedURL['query'] : '';
        $port = isset($parsedURL['port']) ? $parsedURL['port'] : "80";

        return $this->socketIO("GET", $host, $port, $path);
    }
}

