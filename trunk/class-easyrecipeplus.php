<?php


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
if (!class_exists('EasyRecipeDocument', false)) {
    require_once dirname(__FILE__) . '/lib/EasyRecipeDocument.php';
}
if (!class_exists('EasyRecipeTemplate', false)) {
    require_once dirname(__FILE__) . '/lib/EasyRecipeTemplate.php';
}

if (!class_exists('EasyRecipeSettings', false)) {
    require_once dirname(__FILE__) . '/lib/EasyRecipeSettings.php';
}
if (!class_exists('EasyRecipetyles', false)) {
    require_once dirname(__FILE__) . '/lib/EasyRecipeStyles.php';
}

class EasyRecipePlus {
    const JQUERYJS = "https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
    const JQUERYUIJS = "https://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js";
    const JQUERYUICSS = "http://ajax.googleapis.com/ajax/libs/jqueryui/1/themes/base/jquery-ui.css";
    const UPDATEURL = "http://www.easyrecipeplugin.com/checkUpdates1.php";
    const SWOOPJS = '<script type="text/javascript" id="spxw_script" src="http://ardrone.swoop.com/js/spxw.js" data-domain="%s" data-theme="red" data-serverbase="http://ardrone.swoop.com/"></script>';
    
    /*
     * Constants from Ant build
     */
    private $version = "3.1.06";
    private $pluginName = 'easyrecipe';
    private $settingsName = 'ERSettings';
    private $templateClass = 'EasyRecipeTemplate';
    private $documentClass = 'EasyRecipeDocument';
    private $stylesClass = 'EasyRecipeStyles';
    private $settingsClass = 'EasyRecipeSettings';
    /*
     * For convenience
     */
    private $pluginsURL;
    private $pluginsDIR;
    private $easyrecipeDIR;
    private $easyrecipeURL;
    private $siteURL;
    private $homeURL;
    
    /**
     *
     * @var EasyRecipePlusSettings
     */
    private $settings;
    /**
     *
     * @var EasyRecipePlusStyles
     */
    private $styles;
    private $easyrecipes = array ();
    private $formatting = false;
    private $styleName;
    private $printStyle;
    private $styleData;
    private $printStyleData;
    private $haveProcessed = array ();
    private $slug;
    private $isGuest = false;
    private $postMeta;
    private $languages;
    private static $plugins = array ();
    private $guestPosters = array ();
    private $isEndpoint;
    private $endpointRegex;

    function __construct() {
        global $pagenow;
        
        
        /*
         * For convenience
         */
        $this->pluginsURL = WP_PLUGIN_URL;
        $this->pluginsDIR = WP_PLUGIN_DIR;
        $this->easyrecipeDIR = WP_PLUGIN_DIR . "/$this->pluginName";
        $this->easyrecipeURL = WP_PLUGIN_URL . "/$this->pluginName";
        $this->slug = $this->pluginName;
        $this->siteURL = site_url();
        $this->homeURL = home_url();
        
        
        add_action('admin_menu', array ($this, 'addMenus'));
        add_action('admin_init', array ($this, 'initialiseAdmin'));
        add_action('init', array ($this, 'initialise'));
        
    }

    /**
     * Set up stuff we need if we're on an admin page
     */
    function initialiseAdmin() {
        /*
         * Need to be able to edit posts at a minimum
         */
        if (!current_user_can('edit_posts')) {
            return;
        }
        
        /*
         * Only someone who can edit plugins can change the styling
         */
        if (current_user_can('edit_plugins')) {
            add_action('wp_ajax_easyrecipeCustomCSS', array ($this, 'updateCustomCSS'));
            add_action('wp_ajax_easyrecipeSaveStyle', array ($this, 'saveStyle'));
        }
        
        add_action("load-post.php", array ($this, 'loadPostAdmin'));
        add_action("load-post-new.php", array ($this, 'loadPostAdmin'));
        
        add_action('admin_enqueue_scripts', array ($this, 'enqueAdminScripts'));
        add_action('publish_post', array ($this, 'pingMBRB'), 10, 2);
        add_filter('plugin_action_links', array ($this, 'pluginActionLinks'), 10, 2);
        // add_filter('wp_insert_post_data', array ($this, 'postSave'), 10, 2);
        
        add_action('wp_ajax_easyrecipeConvert', array ($this, 'convertRecipe'));
        
        add_action('wp_ajax_easyrecipeSupport', array ($this, 'sendSupport'));
        add_action('update-custom_easyrecipe-update', array ($this, 'forceUpdate'));
    }

    
    /**
     * Set up stuff we'll need on non-admin pages and stuff we'll need in both admin and non-admin
     */
    function initialise() {
        wp_register_style("easyrecipe-UI", "$this->easyrecipeURL/ui/easyrecipeUI.css", array ('wp-admin', 'wp-pointer'), $this->version);
        

        $this->settings = new $this->settingsClass();
        
        
        
        /*
         * Check to see if we've been updated since the last time we did a rewrite rules flush,
         * since an automatic update doesn't call the activation hook when the plugin is re-activated on update
         */
        $lastFlushVersion = $this->settings->get('lastFlushVersion');
        if ($lastFlushVersion != $this->version) {
            flush_rewrite_rules();
            $this->settings->put('lastFlushVersion', $this->version);
            $this->settings->update();
        }
        
        $this->endpointRegex = '%/easyrecipe-(print|diagnostics)(?:/([^?/]+))?%';
        
        $this->isEndpoint = preg_match('%/easyrecipe-(print|diagnostics|style|printstyle)(?:/([^?/]+))?%', $_SERVER['REQUEST_URI']);
        
        /*
         * Everything past here is not needed on admin pages
         */
        if (is_admin()) {
            return;
        }
        
        add_action('wp_enqueue_scripts', array ($this, 'enqueueScripts'));
        

        if ($this->isEndpoint) {
            add_action('template_redirect', array ($this, 'checkRewrites'), -1);
        } else {
            add_action('the_posts', array ($this, 'thePosts'), 0);
            add_action('wp_before_admin_bar_render', array ($this, 'adminBarMenu'));
            
            /*
             * Hook into the comment save if we're using EasyRecipe ratings
             */
            if ($this->settings->get('ratings') == 'EasyRecipe') {
                add_action('comment_post', array ($this, 'ratingSave'));
            }
        }
        /*
         * Override the default style for preview?
         */
        if (isset($_REQUEST['style']) && current_user_can("edit_plugins")) {
            $this->styleName = $_REQUEST['style'];
        } else {
            $this->styleName = $this->settings->get('style');
        }
        
        /*
         * Make sure our head gets run before the enqueued stuff is output
        */
        add_action('wp_head', array ($this, 'addHead'), 0);
        /*
         * Add the custom CSS very late so it overrides everything else
         */
        add_action('wp_head', array ($this, 'addExtraCSS'), 100);
    }

    /**
     * Add the "EasyRecipe Format" option to the admin bar if the current user is an admin
     */
    function adminBarMenu() {
        global $wp_admin_bar;
        $root_menu = array ('parent' => false, 'id' => 'ERFormatMenu', 'title' => 'EasyRecipe Format', 'href' => admin_url('#'), 'meta' => array ('onclick' => 'EASYRECIPE.openFormat(); return false'));
        $wp_admin_bar->add_menu($root_menu);
    }

    /**
     * Load the EasyRecipe settings page
     */
    function loadSettingsPage() {
        wp_enqueue_style("easyrecipe-UI");
        wp_enqueue_style("easyrecipe-settings", "$this->easyrecipeURL/css/easyrecipe-settings.css", array ('easyrecipe-UI'), $this->version);
        
        wp_enqueue_script('easyrecipe-settings', "$this->easyrecipeURL/js/easyrecipe-settings.js", array ('jquery-ui-dialog', 'jquery-ui-slider', 'jquery-ui-autocomplete', 'jquery-ui-tabs', 'jquery-ui-button'), $this->version, true);
        
        
        $this->settings = new $this->settingsClass();
    }

    /**
     */
    function addMenus() {
        $this->settings = new $this->settingsClass();
        $hook = add_menu_page('EasyRecipe Settings', 'EasyRecipe', 'manage_options', $this->pluginName, array ($this->settings, 'showPage'), "$this->pluginsURL/$this->pluginName/images/chef16.png");
        add_action("load-$hook", array ($this, 'loadSettingsPage'));
    }

    /**
     * Called before the post admin page is loaded
     * Queue up all the stuff we need
     * Remove the post from the object cache
     */
    function loadPostAdmin() {
        wp_enqueue_style("easyrecipe-UI");
        wp_enqueue_style("easyrecipe-entry", "$this->easyrecipeURL/css/easyrecipe-entry.css", array ('easyrecipe-UI'), $this->version);
        
        wp_enqueue_script('easyrecipe-entry', "$this->easyrecipeURL/js/easyrecipe-entry.js", array ('jquery-ui-dialog', 'jquery-ui-autocomplete', 'jquery-ui-button', 'jquery-ui-tabs'), $this->version, true);
        
        add_filter('tiny_mce_before_init', array ($this, 'mcepreInitialise'));
        add_filter('mce_external_plugins', array ($this, 'mcePlugins'));
        add_filter('mce_buttons', array ($this, 'mceButtons'));
        add_action('admin_footer', array ($this, 'addDialogHTML'));
        
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
     * Normally Wordpress only checks for plugin updates twice a day
     * The EasyRecipe Settings page always checks for new updates and if one is available it links to the WP plugin update page
     * However Wordpress won't update a plugin if it thinks the current installed version is up to date (which it will if it hasn't checked since the update became available)
     * To force WP to re-check for available updates before the update process, we delete the site_transient record
     *
     * The rationale for doing this is that if a user is on the Support page, we ought to make sure she has the latest version before submitting a support ticket
     */
    function forceUpdate() {
        global $wpdb;
        
        $wpdb->query("DELETE FROM $wpdb->options WHERE option_name = '_site_transient_update_plugins'");
        
        
        $nonce = wp_create_nonce('upgrade-plugin_easyrecipe/easyrecipe.php');
        $url = get_bloginfo('wpurl') . "/wp-admin/update.php?action=upgrade-plugin&plugin=easyrecipe/easyrecipe.php&_wpnonce=$nonce";
        
        header("Location: $url");
    }
    

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
        
        /*
         * Set the translate switch if this isn't in the US
         */
        if (get_locale() != 'en_US') {
            call_user_func(array ($this->templateClass, 'setTranslate'), 'easyrecipe');
        }
        

        
        if ($this->settings->get('ratings') == 'EasyRecipe') {
            add_action('comment_form', array ($this, 'commentForm'), -1);
            add_action('comment_post', array ($this, 'ratingSave'));
            add_action('comment_text', array ($this, 'ratingDisplay'));
        }
        
        // TODO - would this be better elsewhere?
        if ($this->settings->get('removeMicroformat')) {
            ob_start(array ($this, 'fixMicroformats'));
        }
        
        $this->styleData = call_user_func(array ($this->stylesClass, 'getStyleData'), $this->styleName, $this->settings->get('customTemplates'));
        wp_enqueue_style('easyrecipestyle-reset', "$this->easyrecipeURL/css/easyrecipe-style-reset.css", array (), $this->version);
        wp_enqueue_style("easyrecipebuttonUI", "$this->easyrecipeURL/ui/easyrecipe-buttonUI.css", array ('easyrecipestyle-reset'), $this->version);
        /*
         * If the style directory starts with an underscore, it's a custom style 
         */
        if ($this->styleData->directory[0] == '_') {
            wp_enqueue_style("easyrecipestyle", "/easyrecipe-style/style.css/", array ('easyrecipestyle-reset'), "$this->version.{$this->styleData->version}");
        } else {
            wp_enqueue_style("easyrecipestyle", "$this->easyrecipeURL/styles/$this->styleName/style.css", array ('easyrecipestyle-reset'), "$this->version.{$this->styleData->version}");
        }
        
        if (file_exists("$this->easyrecipeDIR/styles/$this->styleName/style.js")) {
            wp_enqueue_script('easyrecipestyle', "$this->easyrecipeURL/styles/$this->styleName/style.js", array ($this->pluginName), "$this->version.{$this->styleData->version}", true);
        }
        
        wp_enqueue_script($this->pluginName, "$this->easyrecipeURL/js/easyrecipe.js", array ('jquery', 'jquery-ui-button'), $this->version, true);
        

        /*
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
        
        /*
         * Load format dialogs and UI CSS if logged in as admin
         * Use our own version of an unobtrusive jQuery UI theme to prevent interference from themes and plugins that override standard stuff
         */
        if (current_user_can("edit_plugins")) {
            
            /*
             * Use an unobtrusive grey scheme for the formatting dialog so it doesn't visually overpower the recipe's styling
            */
            wp_enqueue_style("easyrecipe-FormatUI", "$this->easyrecipeURL/formatui/easyrecipeFormatUI.css", array (), $this->version);
            wp_enqueue_style("easyrecipeformat", "$this->easyrecipeURL/css/easyrecipe-format.css", array ('easyrecipe-FormatUI'), $this->version);
            
            wp_enqueue_script('easyrecipeformat', "$this->easyrecipeURL/js/easyrecipe-format.js", array ('jquery', 'jquery-ui-slider', 'jquery-ui-autocomplete', 'jquery-ui-accordion', 'jquery-ui-dialog', 'jquery-ui-tabs', 'jquery-ui-button', 'json2'), $this->version, true);
            add_action('wp_footer', array ($this, 'addFormatDialog'), 0);
        }
        
        if ($this->settings->get('enableSwoop')) {
            add_action('wp_footer', array ($this, 'addSwoop'), 32767);
        }
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
     * Get the custom and extra CSS
     *
     * Custom CSS is from Live Formatting and is json encoded
     * Extra CSS is from th settings page and is plain text
     *
     * @param string $print
     *            'print' if this for print fromatting
     */
    private function getCSS($print = '') {
        $customCSS = trim($this->settings->get("custom{$print}CSS"));
        if ($customCSS != '') {
            $customCSS = json_decode(stripslashes($customCSS));
            if (!$customCSS) { // TODO- handle this error better
                $customCSS = array ();
            }
        } else {
            $customCSS = array ();
        }
        
        $extraCSS = trim($this->settings->get("extra{$print}CSS"));
        $css = '';
        if ($customCSS != '' || $extraCSS != '') {
            $css = "<style type=\"text/css\">\n";
            foreach ($customCSS as $selector => $style) {
                $style = addslashes($style);
                /*
                 * Make the selectors VERY specific to override theme CSS
                 */
                if (stripos($selector, ".easyrecipe") === 0) {
                    $selector = "html body div" . $selector;
                } else if (stripos($selector, "div.easyrecipe") === 0) {
                    $selector = "html body " . $selector;
                } else if (stripos($selector, "html body") === false) {
                    $selector = "html body " . $selector;
                }
                
                $css .= "$selector { $style }\n";
            }
            $css .= $extraCSS;
            $css .= "</style>\n";
        }
        return $css;
    }

    public function addHead() {
        
        
        // TODO - figure out a standards compliant way to do this
        $mbrb = $this->settings->get("pingMBRB") === true ? 'on' : 'off';
        echo "<meta name=\"mybigrecipebox\" content=\"$mbrb\" />\n";
    }

    public function addExtraCSS() {
        echo $this->getCSS();
    }

    /**
     * Process a "Save style" from Live Formatting
     */
    public function saveStyle() {
        if (current_user_can("edit_plugins")) {
            $style = isset($_POST['style']) ? $_POST['style'] : '';
            if (!isset($this->settings)) {
                $this->settings = new $this->settingsClass();
            }
            $settings = get_option($this->settingsName, array ());
            $this->settings->put('style', $style);
            $this->settings->update();
        }
        die('OK');
    }

    /**
     * Process the update from the format javascript via ajax
     */
    public function updateCustomCSS() {
        if (current_user_can("edit_plugins")) {
            $css = isset($_POST['css']) ? $_POST['css'] : "";
            if (!isset($this->settings)) {
                $this->settings = new $this->settingsClass();
            }
            $settings = get_option($this->settingsName, array ());
            $setting = isset($_POST['isPrint']) ? "customPrintCSS" : "customCSS";
            $this->settings->put($setting, $css);
            $this->settings->update();
        }
        /*
         * The return isn't necessary but it helps with unit testing
         */
        die('OK');
    }

    /**
     *
     * @param string $print            
     */
    function getFormatDialog($isPrint = false) {
        $data = new stdClass();
        $data->SECTIONS = array ();
        $id = 0;
        
        $styleData = $isPrint ? $this->printStyleData : $this->styleData;
        
        /*
         * Get the formatting data for each formattable element
         * Add more specificity to each target so it should override any specific theme CSS 
         */
        $formats = @json_decode($styleData->formatting);
        if ($formats) {
            foreach ($formats as $format) {
                $item = new stdClass();
                if (stripos($format->target, ".easyrecipe") === 0) {
                    $format->target = "html body div" . $format->target;
                } else if (stripos($format->target, "div.easyrecipe") === 0) {
                    $format->target = "html body " . $format->target;
                } else if (stripos($format->target, "html body") === false) {
                    $format->target = "html body " . $format->target;
                }
                
                $item->section = $format->section;
                $format->id = $item->id = $id++;
                $data->SECTIONS[] = $item;
            }
        }
        
        /*
         * Get all the styles we have
         */
        
        $styles = call_user_func(array ($this->stylesClass, 'getStyles'), $this->settings->get('customTemplates'), $isPrint);
        $data->STYLES = array ();
        $styleThumbs = array ();
        foreach ($styles as $style) {
            $item = new stdClass();
            $item->directory = $style->directory;
            $item->selected = $item->directory == $this->styleName ? 'selected="selected"' : '';
            $item->style = $style->style;
            $styleThumbs[$style->directory] = $style->thumbnail;
            $data->STYLES[] = $item;
        }
        $data->stylethumb = $styleData->thumbnail;
        /* @var $template EasyRecipePlusTemplate */
        $template = new $this->templateClass("$this->easyrecipeDIR/templates/easyrecipe-format.html");
        $html = $template->replace($data);
        
        $template = new $this->templateClass("$this->easyrecipeDIR/templates/easyrecipe-fontchange.html");
        $fontChangeHTML = $template->replace($data);
        $fontChangeHTML = str_replace("\r", "", $fontChangeHTML);
        $fontChangeHTML = str_replace("\n", " ", $fontChangeHTML);
        $fontChangeHTML = str_replace("'", '\0x27', $fontChangeHTML);
        $fontChangeHTML = trim(preg_replace('/> \s+</i', '> <', $fontChangeHTML));
        $ajaxURL = admin_url('admin-ajax.php');
        $cssType = $isPrint ? 'customPrintCSS' : 'customCSS';
        $customCSS = $this->settings->get($cssType);
        if ($customCSS == '') {
            $customCSS = '{}';
        }
        $formats = json_encode($formats);
        $formats = str_replace("'", '\'', $formats);
        
        $print = $isPrint ? 'true' : 'false';
        $thumbs = json_encode($styleThumbs);
        $html .= <<<EOD
<script type="text/javascript">
/* <![CDATA[ */

if (typeof EASYRECIPE == "undefined") {
  EASYRECIPE = {};
}
EASYRECIPE.isPrint = $print;
EASYRECIPE.formatting = '$formats';
EASYRECIPE.customCSS = '$customCSS';
EASYRECIPE.pluginsURL = '$this->pluginsURL';
EASYRECIPE.easyrecipeURL = '$this->easyrecipeURL';
EASYRECIPE.version = '$this->version';
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
        if ($isPrint && current_user_can("edit_plugins")) {
            $html .= sprintf('<script type="text/javascript" src="%s/js/easyrecipe-format.js?version=%s"></script>', $this->easyrecipeURL, $this->version);
        }
        return $html;
    }

    function addFormatDialog() {
        echo $this->getFormatDialog();
    }

    function addSwoop() {
        printf(self::SWOOPJS, $this->settings->get('swoopSiteID'));
    }
    /*
   * Notify MBRB when we publish or update
   */
    function pingMBRB($postID, $thisPost) {
        /*
         * Only ping back if this is an EasyRecipe
         */
        if (strpos($thisPost->post_content, 'class="easyrecipe"') === false) {
            return;
        }
        
        $data = http_build_query(array ('id' => $postID, 'link' => get_permalink($postID)));
        $this->socketIO("POST", "www.mybigrecipebox.com", 80, "/pingback.php", $data);
    }
    
    /*
     * Displays just the recipe and exits
     */
    private function printRecipe($postID, $recipeIX) {
        $post = get_post($postID);
        if (!$post) {
            return;
        }
        
        /* @var $postDOM EasyRecipePlusDocument */
        $postDOM = new $this->documentClass($post->post_content);
        
        if (!$postDOM->isEasyRecipe) {
            return;
        }
        
        $this->settings = new $this->settingsClass();
        if (isset($_GET['style'])) {
            $this->styleName = $_GET['style'];
        } else {
            $this->styleName = $this->settings->get('printStyle');
        }
        

        $this->printStyleData = call_user_func(array ($this->stylesClass, 'getStyleData'), $this->styleName, $this->settings->get('customTemplates'), true);
        
        if (get_locale() != 'en_US') {
            call_user_func(array ($this->templateClass, 'setTranslate'), 'easyrecipe');
        }
        
        /**
         * Fix possibly broken times in older posts
         * Fix the Cholesterol oops in early versions
         */
        
        if ($postDOM->recipeVersion < '3') {
            $postDOM->fixTimes("preptime");
            $postDOM->fixTimes("cooktime");
            $postDOM->fixTimes("duration");
            $postDOM->setParentValueByClassName("cholestrol", $this->settings->get('lblCholesterol'), "Cholestrol");
        }
        
        $data = new stdClass();
        $data->hasRating = false;
        
        $this->settings->getLabels($data);
        $data->hasLinkback = $this->settings->get('allowLink');
        $data->title = $post->post_title;
        $data->blogname = get_option("blogname");
        $data->recipeurl = get_permalink($post->ID);
        
        $data->customCSS = $this->getCSS('Print');
        
        $data->easyrecipeURL = $this->easyrecipeURL;
        
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
            $data->css = $this->easyrecipeURL . "/printstyles/$data->style";
            $templateFile = "$this->easyrecipeDIR/printstyles/$data->style/style.html";
        }
        
        $data->css .= "/style.css?version=$this->version.{$this->printStyleData->version}";
        
        /* @var $template EasyRecipePlusTemplate */
        $template = new $this->templateClass($templateFile);
        
        echo $postDOM->formatRecipe($recipe, $template, $data);
        exit();
    }
    
    
    /**
     * Check if this is one of our rewrite endpoints
     * Process these manually because add_rewrite_endpoint() is useless if pretty permalinks aren't enabled
     */
    function checkRewrites() {
        
        /*
         * Just return if it's nothing we're interested in
         */
        if (!preg_match($this->endpointRegex, $_SERVER['REQUEST_URI'], $regs)) {
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
     *
     * @param array $posts            
     */
    function thePosts($posts) {
        /* @var $wp_rewrite WP_Rewrite */
        global $wp_rewrite;
        
        $newPosts = array ();
        /*
         * Process each post and replace placeholders with relevant data
         */
        foreach ($posts as $post) {
            
            if (isset($this->easyrecipes[$post->ID])) {
                $post->post_content = $this->postContent[$post->ID];
                $newPosts[] = $post;
                continue;
            }
            
            
            /* @var $postDOM EasyRecipePlusDocument */
            $postDOM = new $this->documentClass($post->post_content);
            
            if (!$postDOM->isEasyRecipe) {
                $newPosts[] = $post;
                continue;
            }

            /**
             * Mark this post as an easyrecipe so that the comment and rating processing know
             */
            $this->easyrecipes[$post->ID] = true;
            
            /*
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
                $postDOM->setParentValueByClassName("cholestrol", $this->settings->get('lblCholesterol'), "Cholestrol");
            }
            
            $data = new stdClass();
            
            /**
             * Find the ratings - could be done more efficiently with a DB JOIN, but for
             * the small numbers we're going to have it's not gonna make much
             * difference
             */
            
            if ($this->settings->get('ratings') == 'EasyRecipe') {
                $comments = get_comments(array ('status' => 'approve', 'post_id' => $post->ID));
                $totalRating = 0;
                $data->ratingCount = 0;
                foreach ($comments as $comment) {
                    $rating = get_comment_meta($comment->comment_ID, "ERRating", true);
                    if ($rating < 1 || $rating > 5) {
                        continue;
                    }
                    $data->ratingCount++;
                    $totalRating += $rating;
                }
                if ($data->ratingCount > 0) {
                    $data->ratingValue = number_format($totalRating / $data->ratingCount, 1);
                    $data->ratingPC = $data->ratingValue * 100 / 5;
                    $data->hasRating = true;
                } else {
                    $data->hasRating = false;
                }
            }
            $this->settings->getLabels($data);
            
            $data->hasLinkback = $this->settings->get('allowLink');
            $data->displayPrint = $this->settings->get('displayPrint');
            $data->style = $this->styleName;
            $data->title = $post->post_title;
            $data->blogname = get_option("blogname"); // TODO - do all this stuff at initialise time?
            $data->siteURL = $this->homeURL;
            $data->sitePrintURL = $data->siteURL;
            if (!$wp_rewrite->using_permalinks()) {
                $uri = $_SERVER['REQUEST_URI'];
                if (strpos($uri, '?') !== false) {
                    $data->sitePrintURL .= "$uri&";
                } else {
                    $data->sitePrintURL .= "$uri?";
                }
            }
            
            $data->postID = $post->ID;
            $data->recipeurl = get_permalink($post->ID);
            $data->convertFractions = $this->settings->get('convertFractions');
            
            if ($this->styleName[0] == '_') {
                $styleName = substr($this->styleName, 1);
                $templateFile = $this->settings->get('customTemplates') . "/styles/$styleName/style.html";
            } else {
                $templateFile = "$this->easyrecipeDIR/styles/$this->styleName/style.html";
            }
            /* @var $template EasyRecipePlusTemplate */
            $template = new $this->templateClass($templateFile);
            
            
            /*
             * Replace the original content with the one that has the easyrecipe(s) nicely formatted and marked up
             * Also keep a copy so we don't have to reformat in the case where the theme asks for the same post again
             */
            $this->postContent[$post->ID] = $post->post_content = $postDOM->applyStyle($template, $data);
            /*
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
     * Check to see if the post content contains the wrappers we use to facilitate line insertion above & below a recipe
     *
     * If they exist, strip them out
     */
    function postSave($data, $postarr) {
        return $data;
        
        if (strpos($data['post_content'], 'easyrecipeWrapper') !== false) {
            $content = stripslashes($data['post_content']);
            $dom = new $this->documentClass($content);
            $content = $dom->stripWrappers();
            if ($content !== null) {
                $data['post_content'] = $content;
            }
        }
        return $data;
    }

    function commentForm($postID) {
        
        /*
         * Only add ratings for easy recipes
         */
        if (!isset($this->easyrecipes[$postID]) || !$this->easyrecipes[$postID]) {
            return;
        }
        
        $rateLabel = $this->settings->get('lblRateRecipe');
        
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
        $rating = (int) $_POST['ERRating'];
        if ($rating > 0) {
            add_comment_meta($commentID, 'ERRating', $rating, true);
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
        if ($pluginFile == "$this->pluginName/$this->pluginName.php") {
            $links[] = '<a href="admin.php?page=' . $this->pluginName . '">' . __('Settings') . '</a>';
        }
        return $links;
    }

    function diagnosticsGet() {
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
         * Get our own settings
         */
        $data->ERSettings = $this->settings->get();
        
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
        
        $themeData = get_theme_data(get_stylesheet_directory() . "/style.css");
        $data->wptheme = $themeData["Name"];
        $data->wpthemeversion = $themeData["Version"];
        $data->wpthemeurl = $themeData["URI"];
        
        if (!function_exists('get_plugins')) {
            require_once (ABSPATH . 'wp-admin/includes/plugin.php');
        }
        $plugins = get_plugins();
        foreach ($plugins as $pluginFile => $null) {
            $plugins[$pluginFile]["active"] = is_plugin_active($pluginFile) ? "Active" : "Inactive";
        }
        usort($plugins, array ($this, "sortPlugins"));
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
        /*
        $hooks = $wp_filter;
        ksort($hooks);
        $data->hookdata = "";
        foreach ($hooks as $tag => $priorities) {
            ksort($priorities);
            foreach ($priorities as $priority => $functions) {
                ksort($functions);
                foreach ($functions as $name => $null) {
                    $data->hookdata .= <<<EOD
        <tr>
          <td>$tag</td>
          <td>$priority</td>
          <td>$name</td>
        </tr>\n
EOD;
                }
            }
        }
        */
        
        echo $existingOP;
        return $data;
    }

    /**
     * Display a page showing what diagnostics data will be sent
     */
    function diagnosticsShowData() {
        $data = $this->diagnosticsGet();
        $data->easyrecipeURL = $this->easyrecipeURL;
        $data->version = $this->version;
        
        $data->ERSettings = print_r($data->ERSettings, true);
        
        /* @var $template EasyRecipePlusTemplate */
        $template = new $this->templateClass("$this->easyrecipeDIR/templates/easyrecipe-diagnostics.html");
        $html = $template->replace($data, constant("$this->templateClass::PRESERVEWHITESPACE"));
        echo $html;
        
        exit();
    }

    /**
     * Check to see if we're activating ERPlus and pick up ER settings if need be
     * If EasyRecipe is an version < 3, set the default style to the legacy style
     */
    function easyrecipeActivated() {
        
        
        /*
         * Get the current settings
         */
        $current = get_option('ERSettings');
        $this->settings = new $this->settingsClass();
        
        /*
         * If there are current settings but 'style' doesn't exist then we are updating from v2 to v3 - merge the v2 settings
         */
        if ($current !== false) {
            if (!isset($current['style'])) {
                $this->settings->mergeV2($current);
            }
            $this->settings->update();
        } else {
            /*
             * There were no current settings - this is a new install
             * Write the defaults 
             */
            $this->settings->add();
        }
        
        

        /*
         * Setup the endpoints and rewrite the rules 
         */
        // add_rewrite_endpoint('easyrecipe-print', EP_ALL);
        // add_rewrite_endpoint('easyrecipe-diagnostics', EP_ALL);
        // add_rewrite_endpoint('easyrecipe-import', EP_ALL);
        // add_rewrite_endpoint('easyrecipe-style', EP_ALL);
        // add_rewrite_endpoint('easyrecipe-printstyle', EP_ALL);
        flush_rewrite_rules();
        
        $data = http_build_query(array ('action' => 'activate', 'site' => get_site_url()));
        $status = $this->socketIO("POST", "www.easyrecipeplugin.com", 80, "/installed.php", $data);
    }

    function easyrecipeDeactivated() {
        flush_rewrite_rules();
        $data = http_build_query(array ('action' => 'deactivate', 'site' => get_site_url()));
        $status = $this->socketIO("POST", "www.easyrecipeplugin.com", 80, "/installed.php", $data);
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
            $data->vars = $this->diagnosticsGet();
        }
        $data = "data=" . urlencode(json_encode($data));
        $status = $this->socketIO("POST", "www.easyrecipeplugin.com", 80, "/diagnostics.php", $data);
        echo json_encode(array ("status" => $status));
        exit();
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
        $plugins['easyrecipe'] = "$this->pluginsURL/$this->pluginName/js/easyrecipe-mce.js?v=$this->version";
        $plugins['noneditable'] = "$this->pluginsURL/$this->pluginName/tinymce/noneditable.js?v=$this->version";
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
        
        /* @var $template EasyRecipePlusTemplate */
        $template = new $this->templateClass("$this->easyrecipeDIR/templates/easyrecipe-entry.html");
        echo $template->replace();
        
        $data = new stdClass();
        $data->easyrecipeURL = $this->easyrecipeURL;
        $template = new $this->templateClass("$this->easyrecipeDIR/templates/easyrecipe-upgrade.html");
        echo $template->replace($data);
        
        
        $data = new stdClass();
        $data->easyrecipeURL = $this->easyrecipeURL;
        $template = new $this->templateClass("$this->easyrecipeDIR/templates/easyrecipe-convert.html");
        echo $template->replace($data);
        
        $template = new $this->templateClass("$this->easyrecipeDIR/templates/easyrecipe-htmlwarning.html");
        echo $template->getTemplateHTML();
        
        /*
         * Get the basic data template
         * We need to preserve comments here because the template is processed by the javascript template engine and it needs the INCLUDEIF/REPEATS 
         */
        
        /* @var $template EasyRecipePlusTemplate */
        $template = new $this->templateClass("$this->easyrecipeDIR/templates/easyrecipe-template.html");
        $class = $this->templateClass;
        
        $html = $template->getTemplateHTML(constant("$this->templateClass::PRESERVECOMMENTS"));
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
        
        $author = json_encode($this->settings->get('author'));
        $cuisines = json_encode(explode('|', $this->settings->get('cuisines')));
        $recipeTypes = json_encode(explode('|', $this->settings->get('recipeTypes')));
        
        if (!function_exists('get_upload_iframe_src')) {
            require_once (ABSPATH . 'wp-admin/includes/media.php');
        }
        $upIframeSrc = get_upload_iframe_src();
        $guestPost = $this->isGuest ? 'true' : 'false';
        $wpurl = get_bloginfo('wpurl');
        echo <<<EOD
<script type="text/javascript">
/* <![CDATA[ */

if (typeof EASYRECIPE == "undefined") {
  EASYRECIPE = {};
}
EASYRECIPE.version = '$this->version';
EASYRECIPE.pluginsURL = '$this->pluginsURL';
EASYRECIPE.easyrecipeURL = '$this->easyrecipeURL';
EASYRECIPE.recipeTemplate = '$html';
EASYRECIPE.testURL = '$testURL';
EASYRECIPE.author = '$author';
EASYRECIPE.recipeTypes = '$recipeTypes';
EASYRECIPE.cuisines = '$cuisines';
EASYRECIPE.upIframeSrc = '$upIframeSrc';
EASYRECIPE.isGuest = $guestPost;
EASYRECIPE.wpurl = '$wpurl';
/* ]]> */
</script>
EOD;
    }
    
    /*
   * Return RecipeSEO/ZipList data
   */
    function convertRecipe() {
        global $wpdb;
        
        $id = (int) $_POST['id'];
        $result = new stdClass();
        
        switch ($_POST['type']) {
            
            case 'recipeseo' :
                $result->recipe = $wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "amd_recipeseo_recipes WHERE recipe_id=" . $id);
                $ingredients = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "amd_recipeseo_ingredients WHERE recipe_id=" . $id . " ORDER BY ingredient_id");
                
                $result->ingredients = array ();
                foreach ($ingredients as $ingredient) {
                    $result->ingredients[] = $ingredient->amount . " " . $ingredient->name;
                }
                break;
            
            case 'zlrecipe' :
                $result->recipe = $wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "amd_zlrecipe_recipes WHERE recipe_id=" . $id);
                $ingredients = explode("\n", str_replace('\r', "", $result->recipe->ingredients));
                $result->ingredients = array ();
                foreach ($ingredients as $ingredient) {
                    $result->ingredients[] = $ingredient;
                }
                unset($result->recipe->ingredients);
                
                break;
        }
        echo json_encode($result);
        die();
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
        $path = isset($parsedURL['path']) ? $parsedURL['path'] : '/';
        $path .= isset($parsedURL['query']) ? $parsedURL['query'] : '';
        $port = isset($parsedURL['port']) ? $parsedURL['port'] : "80";
        
        $timeout = 5;
        $image = '';
        
        return $this->socketIO("GET", $host, $port, $path);
    }

    private function sortPlugins($a, $b) {
        if ($a["active"] != $b["active"]) {
            return strcmp($a["active"], $b["active"]);
        }
        return strcmp($a["Title"], $b["Title"]);
    }
}

?>