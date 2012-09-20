<?php

/**
   * Handles all the Easy Recipe plugin processing
   *
   * @author John
   */
require_once 'class-ERDOMDocument.php';

class EasyRecipe {
    
    private $easyrecipeDIR;
    private $easyrecipeURL;
    private $settings = array ();
    private $easyrecipes = array ();
    private $version = "2.2.2";
    private $formatting = false;
    
    /*
	 * Default settings
     * @formatter:off
	 */
    private $defaultSettings = array (
        'allowLink' => false, 
        'ingredientHead' => 'Ingredients', 
        'instructionHead' => 'Instructions', 
        'notesHead' => 'Notes', 
        'pingMBRB' => false, 
        
        'lblRecipeType' => 'Recipe type', 
        'lblAuthor' => 'Author', 
        'lblPrepTime' => 'Prep time', 
        'lblCookTime' => 'Cook time', 
        'lblTotalTime' => 'Total time', 
        'lblServes' => 'Serves', 
        'lblServeSize' => 'Serving size', 
        'lblCalories' => 'Calories', 
        'lblSugar' => 'Sugar', 
        'lblFat' => 'Fat', 
        'lblSatFat' => 'Saturated fat', 
        'lblUnsatFat' => 'Unsaturated fat', 
        'lblCarbs' => 'Carbohydrates', 
        'lblFiber' => 'Fiber', 
        'lblProtein' => 'Protein', 
        'lblCholesterol' => 'Cholesterol', 
        'lblRateRecipe' => 'Rate this recipe', 
        
        'erEmailAddress' => '', 
        'erFirstName' => '');
    /*
     * @formatter:on
     */
    
    function __construct() {
        
        /*
		 * For convenience
		 */
        $this->easyrecipeDIR = dirname(__FILE__);
        $this->easyrecipeURL = WP_PLUGIN_URL . "/" . basename($this->easyrecipeDIR);
        
        $this->getSettings();
        
        /*
		 * If we're in admin, only load the easyrecipe stuff on the easyrecipe
		 * options and diaolog pages
		 */
        
        if (is_admin()) {
            
            if (isset($_REQUEST['ERDEBUG'])) {
                error_reporting(E_ALL);
                ini_set("display_errors", 1);
            }
            
            // global $concatenate_scripts;
            // $concatenate_scripts = false;
            add_action('admin_menu', array ($this, 'addMenus'));
            add_filter('plugin_action_links', array ($this, 'pluginActionLinks'), 10, 2);
            
            if ($GLOBALS["pagenow"] == "options-general.php") {
                if ($_REQUEST['page'] !== "easyrecipe") {
                    return;
                }
            } else {
                add_action('wp_ajax_customCSS', array ($this, 'updateCustomCSS'));
                add_action('admin_footer', array ($this, 'addDialogHTML'));
                add_filter('mce_external_plugins', array ($this, 'mcePlugins'));
                add_filter('mce_buttons', array ($this, 'mceButtons'));
                if ($this->settings['pingMBRB']) {
                    add_action('publish_post', array ($this, 'pingMBRB'), 10, 2);
                }
            }
            
            add_action('wp_ajax_ERconvertRecipe', array ($this, 'convertRecipe'));
            add_action('wp_ajax_ERsendDiagnostics', array ($this, 'sendDiagnostics'));
            add_filter('plugin_action_links', array ($this, 'pluginActionLinks'), 10, 2);
            
            add_action('admin_init', array ($this, 'adminInit'));
        } else {
            if (!isset($_REQUEST['erprint'])) {
                add_action('comment_form', array ($this, 'commentForm'));
                add_action('comment_post', array ($this, 'ratingSave'));
                add_action('comment_text', array ($this, 'ratingDisplay'));
                add_action('wp_print_scripts', array ($this, 'extraCSS'));
            }
            
            /*
			 * It's critical we get to process the posts before anything else
			 * has a chance to mess with them so specify a ridiculously high
			 * priority here
			 */
            add_action('the_posts', array ($this, 'thePosts'), -32767);
            add_action('init', array ($this, 'initialise'));
            add_action('wp_before_admin_bar_render', array ($this, 'adminBarMenu'));
            add_action('wp_head', array ($this, 'addMetaTags'));
        }
    
    }
    
    function theExcerpt($content) {
        $content = str_replace("#ratingval# from #reviews# reviews Print", "", $content);
        return "blah" . $content;
    }
    
    function adminBarMenu() {
        global $wp_admin_bar;
        $root_menu = array ('parent' => false, 'id' => 'ERFormatMenu', 'title' => 'Easy Recipe Format', 'href' => admin_url('my-new-menu.php'), 'meta' => array ('onclick' => 'EASYRECIPE.openFormat(); return false'));
        
        $wp_admin_bar->add_menu($root_menu);
    }
    
    function adminInit() {
        
        global $concatenate_scripts;
        $concatenate_scripts = false;
        
        add_filter('plugin_action_links', array ($this, 'pluginActionLinks'), 10, 2);
        wp_deregister_script('jquery');
        if (isset($_REQUEST['ERDEBUG'])) {
            wp_register_script('jquery', ("https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js"), false, '');
        } else {
            wp_register_script('jquery', ("https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"), false, '');
        }
        wp_enqueue_script('jquery');
        
        add_action('wp_ajax_customCSS', array ($this, 'updateCustomCSS'));
        
        wp_deregister_script('jquery-ui');
        if (isset($_REQUEST['ERDEBUG'])) {
            wp_register_script('jquery-ui', ("http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.js"), false, '');
        } else {
            wp_register_script('jquery-ui', ("https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"), false, '');
        }
        wp_enqueue_script('jquery-ui');
        wp_enqueue_style("jquery-ui-base", "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/themes/base/jquery-ui.css");
        wp_enqueue_style("easyrecipe-admin-dialog", "$this->easyrecipeURL/dialog/easyrecipeDialog.css", array (), $this->version);
        wp_enqueue_style("easyrecipe-admin", "$this->easyrecipeURL/easyrecipe-admin.css", array (), $this->version);
        
        if ($GLOBALS["pagenow"] == "options-general.php") {
            if ($_REQUEST['page'] !== "easyrecipe") {
                return;
            }
            wp_enqueue_script('easyrecipe-options', "$this->easyrecipeURL/easyrecipe-options.js", array (), $this->version);
        } else {
            wp_enqueue_script('easyrecipeadmin', "$this->easyrecipeURL/easyrecipe-admin.js", array ('jquery-ui-dialog'), $this->version, true);
        }
        
        if (isset($_GET["page"]) && $_GET["page"] == "erdiagnostics") {
            wp_enqueue_style("easyrecipe-diagnostics", "$this->easyrecipeURL/easyrecipe-diagnostics.css", array (), $this->version);
            wp_enqueue_script('easyrecipediag', "$this->easyrecipeURL/easyrecipe-diagnostics.js", array (), $this->version, true);
        }
        
        register_setting('EROptionSettings', 'ERSettings', array ($this, 'validateOptions'));
    }
    function initialise() {
        
        if (!isset($_REQUEST['erprint'])) {
            wp_enqueue_script('easyrecipe', "$this->easyrecipeURL/easyrecipe.js", array ('jquery'), $this->version);
            wp_enqueue_style("easyrecipe", "$this->easyrecipeURL/easyrecipe.css", array (), $this->version);
        }
        
        if (current_user_can("administrator")) {
            
            wp_deregister_script('jquery');
            wp_register_script('jquery', ("https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"), false, '');
            wp_enqueue_script('jquery');
            
            add_action('wp_ajax_customCSS', array ($this, 'updateCustomCSS'));
            
            wp_deregister_script('jquery-ui');
            wp_register_script('jquery-ui', ("https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"), false, '');
            wp_enqueue_script('jquery-ui');
            
            wp_enqueue_style("jquery-ui-base", "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/themes/base/jquery-ui.css");
            wp_enqueue_script('json2');
            
            wp_enqueue_style("easyrecipeformat", "$this->easyrecipeURL/easyrecipe-format.css", array (), $this->version);
            
            wp_enqueue_script('easyrecipeformat', "$this->easyrecipeURL/easyrecipe-format.js", array ('jquery-ui'), $this->version);
            
            add_action('wp_footer', array ($this, 'addFormatDialog'));
        }
    
    }
    
    public function addMetaTags() {
        $mbrb = isset($this->settings["pingMBRB"]) && $this->settings["pingMBRB"] == true ? 'on' : 'off';
        echo "<meta name=\"mybigrecipebox\" content=\"$mbrb\" />\n";
    }
    
    /**
     * Process the update from the format javascript via ajax
     */
    public function updateCustomCSS() {
        if (current_user_can("administrator")) {
            $css = isset($_POST['css']) ? $_POST['css'] : "";
            $settings = get_option("ERSettings", array ());
            $setting = isset($_POST['erprint']) ? "customPrintCSS" : "customCSS";
            $settings[$setting] = $css;
            $this->settings[$setting] = $css;
            update_option("ERSettings", $settings);
        }
    }
    
    function addFormatDialog() {
        $html = $this->getTemplate("easyrecipe-format.html");
        echo "\n" . $html;
        $fontChangeHTML = $this->getTemplate("easyrecipe-fontchange.html");
        $ajaxURL = admin_url('admin-ajax.php');
        if (isset($_REQUEST['erprint'])) {
            $customCSS = $this->settings['customPrintCSS'];
        } else {
            $customCSS = $this->settings['customCSS'];
        }
        echo <<<EOD
<script type="text/javascript">
/* <![CDATA[ */

if (typeof EASYRECIPE == "undefined") {
  var EASYRECIPE = {};
}
EASYRECIPE.customCSS = '$customCSS';
EASYRECIPE.easyrecipeURL = '$this->easyrecipeURL';
EASYRECIPE.version = '$this->version';
EASYRECIPE.ajaxURL = '$ajaxURL';
EASYRECIPE.fontChangeHTML = '$fontChangeHTML';
/* ]]> */
</script>
EOD;
    }
    
    /*
	 * Notify MBRB when we publish or update
	 */
    
    function pingMBRB($postID, $thisPost) {
        /*
		 * Only ping back if this is an Easy Recipe
		 */
        if (strpos($thisPost->post_content, 'class="easyrecipe"') === false) {
            return;
        }
        
        $data = http_build_query(array ('id' => $postID, 'link' => get_permalink($postID)));
        $this->socketIO("POST", "www.mybigrecipebox.com", 80, "/pingback.php", $data);
    }
    
    function extraCSS() {
        $css = json_decode(stripslashes($this->settings["customCSS"]));
        echo "<style type=\"text/css\">\n";
        foreach ($css as $selector => $style) {
            $style = addslashes($style);
            echo "$selector { $style }\n";
        }
        echo "</style>\n";
    }
    
    public function urlShortcode($attributes, $content) {
        $attributes = shortcode_atts(array ("href" => "#", "target" => "_self"), $attributes);
        return '<a href="' . $attributes['href'] . '" target="' . $attributes['target'] . '">' . $content . '</a>';
    }
    
    public function imgShortcode($attributes, $content = null) {
        $width = isset($attributes['width']) ? '" width="' . $attributes['width'] . '"' : "";
        $height = isset($attributes['height']) ? '" height="' . $attributes['height'] . '"' : "";
        return '<img src="' . $attributes['src'] . '"' . "$width$height" . ' />';
    }
    
    public function brShortcode($attributes, $content = null) {
        return '<br>';
    }
    
    public function bShortcode($attributes, $content = null) {
        return "<strong>$content</strong>";
    }
    
    public function iShortcode($attributes, $content = null) {
        return "<em>$content</em>";
    }
    
    /*
	 * Displays just the recipe and exits
	 */
    
    function printRecipe($post) {
        
        $imageSize = 200;
        
        /*
		 * We need the <p>'s for some formatting
		 */
        // $content = wpautop($post->post_content);
        // $content = $post->post_content;
        $vars = array ();
        $vars["recipe"] = do_shortcode(ERDOMDocument::getPrintRecipe($post->post_content));
        
        /*
		 * Look for an image and try to scale it proportionally Pretty crap way
		 * of doing it - we really should create a thumb so it only needs to be
		 * done once ever - in a later version maybe!
		 */
        $vars["easyrecipeURL"] = $this->easyrecipeURL;
        
        $vars["imageURL"] = "";
        $vars["tx"] = 0;
        $vars["ty"] = 0;
        $vars["imagedisplay"] = "none";
        if (preg_match('/<img ([^>]+)>/si', $post->post_content, $regs)) {
            $img = $regs[1];
            if (preg_match('/src=(?:"|\')?(.*?)(?:"|\'| |>)/si', $img, $regs)) {
                $imageURL = trim($regs[1]);
                /*
				 * Try for a file on the current server first
				 */
                $parsedURL = parse_url($imageURL);
                $fName = $_SERVER['DOCUMENT_ROOT'] . $parsedURL['path'];
                $img = false;
                /*
				 * If it exists on the server's doc root, and it's a file, try
				 * reading it
				 */
                if (is_file($fName)) {
                    $img = @file_get_contents($fName);
                }
                /*
				 * If reading the file didn't work, try getting the URL
				 */
                if (!$img) {
                    $img = @file_get_contents($imageURL);
                }
                /*
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
                        
                        $vars["tx"] = $tx;
                        $vars["ty"] = $ty;
                        
                        $vars["imageURL"] = $imageURL;
                        $vars["imagedisplay"] = "block";
                    }
                }
            }
        }
        
        /*
		 * Display the screen and exit The JS will take care of the print and
		 * closing the window
		 */
        $vars["title"] = $post->post_title;
        $vars["blogname"] = get_option("blogname");
        $vars["recipeurl"] = get_permalink($post->ID);
        if (current_user_can("administrator") && isset($_REQUEST['erformat'])) {
            $siteURL = get_site_url();
            $vars['cssjs'] = <<<EOD
      <link rel='stylesheet' href='http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/themes/base/jquery-ui.css?ver=$this->version' type='text/css' />
<link rel='stylesheet' href='$this->easyrecipeURL/easyrecipe-format.css?ver=$this->version' type='text/css' />
<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js'></script>
<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js'></script>
<script type='text/javascript' src='$siteURL/wp-includes/js/json2.js?ver=2011-02-23'></script>
<script type='text/javascript' src='$this->easyrecipeURL/easyrecipe-format.js?ver=$this->version'></script>
EOD;
        } else {
            $vars['cssjs'] = <<<EOD
<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js'></script>
<script type="text/javascript" src="$this->easyrecipeURL/easyrecipe-print.js?ver=$this->version"></script>
EOD;
        }
        
        $customCSS = "<style type=\"text/css\">\n";
        $css = json_decode(stripslashes($this->settings["customPrintCSS"]));
        
        foreach ($css as $selector => $style) {
            $style = addslashes($style);
            $customCSS .= "$selector { $style }\n";
        }
        $customCSS .= "</style>\n";
        
        $vars['customCSS'] = $customCSS;
        $vars["version"] = $this->version;
        $html = $this->getTemplate("easyrecipe-print.html", $vars);
        echo $html;
        if (current_user_can("administrator") && isset($_REQUEST['erformat'])) {
            $this->addFormatDialog();
        }
        exit();
    }
    
    function thePosts($posts) {
        
        $newPosts = array ();
        /*
		 * Process each post and replace placeholders with relevant data
		 */
        
        foreach ($posts as $post) {
            
            /*
			 * Suppress warnings and errors and then reset it to whatever is was
			 */
            if (!isset($_REQUEST['ERDEBUG'])) {
                $oldErrors = error_reporting(0);
                $oldDisplay = ini_get("display_errors");
                ini_set("display_errors", 0);
            } else {
                $oldErrors = error_reporting(E_ALL);
                $oldDisplay = ini_get("display_errors");
                ini_set("display_errors", 1);
            }
            $easyrecipe = new ERDOMDocument($post->post_content);
            // $easyrecipe->dump();
            // exit;
            
            error_reporting($oldErrors);
            ini_set("display_errors", $oldDisplay);
            
            if (!$easyrecipe->isEasyRecipe) {
                $newPosts[] = $post;
                continue;
            }
            $this->easyrecipes[$post->ID] = true;
            /**
             * Insert the page's permalink for the print button and make the
             * print button visible The visibilities are hardcoded in the post
             * so we degrade gracefully if EasyRecipe is deactivated
             *
             * Allows for the editor to mess about with the spacing
             */
            
            if (isset($_REQUEST['preview'])) {
                $easyrecipe->setPrintButton($_SERVER['REQUEST_URI'], current_user_can("administrator"));
            } else {
                $easyrecipe->setPrintButton(get_permalink($post->ID), current_user_can("administrator"));
            }
            
            $easyrecipe->fixTimes("preptime");
            $easyrecipe->fixTimes("cooktime");
            $easyrecipe->fixTimes("duration");
            $easyrecipe->setValueByClassName("ERIngredientsHeader", $this->settings['ingredientHead']);
            $easyrecipe->setValueByClassName("ERInstructionsHeader", $this->settings['instructionHead']);
            $easyrecipe->setValueByClassName("ERNotesHeader", $this->settings['notesHead']);
            $easyrecipe->setValueByClassName("ERHead", $this->settings['lblRecipeType'], "Recipe Type");
            $easyrecipe->setValueByClassName("ERHead", $this->settings['lblAuthor'], "Author");
            $easyrecipe->setValueByClassName("ERHead", $this->settings['lblPrepTime'], "Prep time");
            $easyrecipe->setValueByClassName("ERHead", $this->settings['lblCookTime'], "Cook time");
            $easyrecipe->setValueByClassName("ERHead", $this->settings['lblTotalTime'], "Total time");
            $easyrecipe->setValueByClassName("ERHead", $this->settings['lblServes'], "Serves");
            
            $easyrecipe->setParentValueByClassName("servingSize", $this->settings['lblServeSize'], "Serving size");
            $easyrecipe->setParentValueByClassName("calories", $this->settings['lblCalories'], "Calories");
            $easyrecipe->setParentValueByClassName("fat", $this->settings['lblFat'], "Fat");
            $easyrecipe->setParentValueByClassName("unsaturatedFat", $this->settings['lblUnsatFat'], "Unsaturated fat");
            $easyrecipe->setParentValueByClassName("saturatedFat", $this->settings['lblSatFat'], "Saturated fat");
            $easyrecipe->setParentValueByClassName("carbohydrates", $this->settings['lblCarbs'], "Carbohydrates");
            $easyrecipe->setParentValueByClassName("sugar", $this->settings['lblSugar'], "Sugar");
            $easyrecipe->setParentValueByClassName("fiber", $this->settings['lblFiber'], "Fiber");
            $easyrecipe->setParentValueByClassName("protein", $this->settings['lblProtein'], "Protein");
            $easyrecipe->setParentValueByClassName("cholesterol", $this->settings['lblCholesterol'], "Cholesterol");
            
            // Oops! Fix early version typo
            $easyrecipe->setParentValueByClassName("cholestrol", $this->settings['lblCholesterol'], "Cholestrol");
            
            /*
			 * Find the ratings - could be done better with a DB JOIN, but for
			 * the small numbers we're going to have it's not gonna make much
			 * difference
			 */
            
            $comments = get_comments(array ('status' => 'approve', 'post_id' => $post->ID));
            $totalRating = 0;
            $nRatings = 0;
            foreach ($comments as $comment) {
                $rating = get_comment_meta($comment->comment_ID, "ERRating", true);
                if ($rating < 1 || $rating > 5) {
                    continue;
                }
                $nRatings++;
                $totalRating += $rating;
            }
            /*
			 * Set or hide the ratings
			 */
            $easyrecipe->setRating($totalRating, $nRatings);
            /*
			 * Show or remove the linkback
			 */
            $easyrecipe->setLinkback($this->settings["allowLink"]);
            
            /*
			 * Add the "photo" class name to the first image if there is one
			 */
            $easyrecipe->addPhotoClass();
            
            /*
			 * Add a published date and wrap the whole EasyRecipe with an
			 * hrecipe class, and replace the post content with the result
			 */
            $pDate = '<span class="published"><span class="value-title" title="' . substr($post->post_date, 0, 10) . '"></span></span>';
            $post->post_content = '<div class="hrecipe">' . $pDate . $easyrecipe->getHTML() . '</div>';
            
            /*
			 * Handle a print request - normally won't return
			 */
            if (isset($_REQUEST['erprint'])) {
                $this->printRecipe($post);
            }
            
            $newPosts[] = $post;
        }
        return $newPosts;
    }
    
    function commentForm($postID) {
        
        /*
		 * Only add ratings for easy recipes
		 */
        if (!isset($this->easyrecipes[$postID]) || !$this->easyrecipes[$postID]) {
            return;
        }
        
        echo <<<EOD
<div id="ERComment">
<div style="float:left">{$this->settings['lblRateRecipe']}: </div>
<div id="divRateBG">
<div id="divRateStars"></div>
</div>
<input type="hidden" id="inpERRating" name="ERRating" value="0" />
&nbsp;
</div>
EOD;
    }
    
    function ratingSave($commentID) {
        add_comment_meta($commentID, 'ERRating', $_POST['ERRating'], true);
    }
    
    function ratingDisplay($comment) {
        global $post;
        
        /*
		 * Only display comment ratings if the post is an Easy Recipe
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
      <div style="width:$rating%" class="ERRatingInner"></div>
      </div >
EOD;
        }
        return $comment . $stars;
    }
    
    function pluginActionLinks($links, $file) {
        if ($file == plugin_basename(dirname(__FILE__) . '/easyrecipe.php')) {
            $links[] = '<a href="options-general.php?page=easyrecipe">' . __('Settings') . '</a>';
        }
        return $links;
    }
    
    function addMenus() {
        add_options_page('Easy Recipe Settings', 'Easy Recipe', 'administrator', 'easyrecipe', array ($this, 'settingsPage'));
        add_submenu_page("tools.php", "Easy Recipe Diagnostics", "Easy Recipe", "administrator", "erdiagnostics", array ($this, "diagnostics"));
    }
    
    function getDiagnostics() {
        global $wp_version, $wp_filter;
        
        /*
		 * Get the php info
		 */
        ob_start();
        phpinfo();
        $phpinfo = ob_get_clean();
        preg_match('%<body>(.*)</body>%si', $phpinfo, $regs);
        $vars["phpinfo"] = $regs[1];
        $vars["email"] = get_bloginfo("admin_email");
        
        $capabilities = "";
        get_currentuserinfo();
        
        $user = $GLOBALS['current_user'];
        
        if (isset($user->capabilities)) {
            foreach ($user->capabilities as $cap => $allowed) {
                if ($allowed) {
                    $capabilities .= "$cap,";
                }
            }
        }
        $vars["wpcapabilities"] = rtrim($capabilities, ",");
        $vars["wpversion"] = $wp_version;
        $vars["wpurl"] = get_bloginfo("wpurl");
        
        $themeData = get_theme_data(get_stylesheet_directory() . "/style.css");
        $vars["wptheme"] = $themeData["Name"];
        $vars["wpthemeversion"] = $themeData["Version"];
        $vars["wpthemeurl"] = $themeData["URI"];
        
        $plugins = get_plugins();
        foreach ($plugins as $pluginFile => $null) {
            $plugins[$pluginFile]["active"] = is_plugin_active($pluginFile) ? "Active" : "Inactive";
        }
        usort($plugins, array ($this, "sortPlugins"));
        $vars["plugindata"] = "";
        foreach ($plugins as $plugin) {
            $name = $plugin["Title"];
            $active = $plugin["active"];
            $version = $plugin["Version"];
            $url = $plugin["PluginURI"];
            $style = $active == "Active" ? "" : ' style=color:#888';
            $vars["plugindata"] .= <<<EOD
        <tr$style>
          <td>$name</td>
          <td>$active</td>
          <td>$version</td>
          <td>$url</td>
        </tr>\n
EOD;
        }
        
        $hooks = $wp_filter;
        ksort($hooks);
        $vars["hookdata"] = "";
        foreach ($hooks as $tag => $priorities) {
            ksort($priorities);
            foreach ($priorities as $priority => $functions) {
                ksort($functions);
                foreach ($functions as $name => $null) {
                    $vars["hookdata"] .= <<<EOD
        <tr>
          <td>$tag</td>
          <td>$priority</td>
          <td>$name</td>
        </tr>\n
EOD;
                }
            }
        }
        return $vars;
    }
    
    /**
     * Display the diagnostics page, collect the data and if requested, send it
     */
    function diagnostics() {
        $existingOP = ob_get_clean();
        $vars = $this->getDiagnostics();
        echo $existingOP;
        $vars["easyrecipeURL"] = $this->easyrecipeURL;
        $html = $this->getTemplate("easyrecipe-diagnostics.html", $vars);
        
        echo $html;
    }
    
    function easyrecipeActivated() {
        $data = http_build_query(array ('action' => 'activate', 'site' => get_site_url()));
        $status = $this->socketIO("POST", "www.orgasmicchef.com", 80, "/easyrecipe/installed.php", $data);
    }
    
    function easyrecipeDeactivated() {
        $data = http_build_query(array ('action' => 'deactivate', 'site' => get_site_url()));
        $status = $this->socketIO("POST", "www.orgasmicchef.com", 80, "/easyrecipe/installed.php", $data);
    }
    
    function sendDiagnostics() {
        $data = new stdClass();
        $data->vars = $this->getDiagnostics();
        $data->email = stripslashes($_POST['email']);
        $data->problem = stripslashes($_POST['problem']);
        $data = "data=" . urlencode(json_encode($data));
        $status = $this->socketIO("POST", "www.orgasmicchef.com", 80, "/easyrecipe/diagnostics.php", $data);
        echo json_encode(array ("status" => $status));
        exit();
    }
    
    /*
	 * Save and "validate" the options - basically just strip HTML
	 */
    
    function validateOptions($settings) {
        $this->getSettings();
        $this->settings["allowLink"] = isset($settings["allowLink"]);
        $this->settings["ingredientHead"] = trim(wp_filter_nohtml_kses($settings["ingredientHead"]));
        $this->settings["instructionHead"] = trim(wp_filter_nohtml_kses($settings["instructionHead"]));
        $this->settings["notesHead"] = trim(wp_filter_nohtml_kses($settings["notesHead"]));
        $this->settings["pingMBRB"] = isset($settings["pingMBRB"]);
        
        $this->settings["lblRecipeType"] = trim($settings["lblRecipeType"]);
        $this->settings["lblAuthor"] = trim($settings["lblAuthor"]);
        $this->settings["lblPrepTime"] = trim($settings["lblPrepTime"]);
        $this->settings["lblCookTime"] = trim($settings["lblCookTime"]);
        $this->settings["lblTotalTime"] = trim($settings["lblTotalTime"]);
        $this->settings["lblServes"] = trim($settings["lblServes"]);
        $this->settings["lblServeSize"] = trim($settings["lblServeSize"]);
        $this->settings["lblCalories"] = trim($settings["lblCalories"]);
        $this->settings["lblSugar"] = trim($settings["lblSugar"]);
        $this->settings["lblFat"] = trim($settings["lblFat"]);
        $this->settings["lblSatFat"] = trim($settings["lblSatFat"]);
        $this->settings["lblUnsatFat"] = trim($settings["lblUnsatFat"]);
        $this->settings["lblCarbs"] = trim($settings["lblCarbs"]);
        $this->settings["lblFiber"] = trim($settings["lblFiber"]);
        $this->settings["lblProtein"] = trim($settings["lblProtein"]);
        $this->settings["lblCholesterol"] = trim($settings["lblCholesterol"]);
        $this->settings["lblRateRecipe"] = trim($settings["lblRateRecipe"]);
        /*
		 * The options page doesn't have customCSS so don't update it if it's
		 * not set
		 */
        if (isset($settings["customCSS"])) {
            $this->settings["customCSS"] = trim($settings["customCSS"]);
        }
        
        if (isset($settings["customPrintCSS"])) {
            $this->settings["customPrintCSS"] = trim($settings["customPrintCSS"]);
        }
        
        /*
		 * Handle the mailing list options Only need to send a notification if
		 * the values have changed
		 */
        $settings["erFirstName"] = trim($settings["erFirstName"]);
        $settings["erEmailAddress"] = trim($settings["erEmailAddress"]);
        if ($settings["erFirstName"] != $this->settings["erFirstName"] || $settings["erEmailAddress"] != $this->settings["erEmailAddress"]) {
            $this->settings["erFirstName"] = $settings["erFirstName"];
            $this->settings["erEmailAddress"] = $settings["erEmailAddress"];
            $data = http_build_query(array ('email' => $settings["erEmailAddress"], 'first' => $settings["erFirstName"], 'site' => get_site_url()));
            $this->socketIO("POST", "www.orgasmicchef.com", 80, "/easyrecipe/mailing.php", $data);
        }
        return $this->settings;
    }
    
    /*
	 * WP 3.3.1 changed the way option settings were stored - now need to check for
	 * empty values as well as "not set" 
	 */
    function getSettings() {
        
        $settings = get_option("ERSettings", array ());
        
        foreach ($this->defaultSettings as $setting => $default) {
            $this->settings[$setting] = isset($settings[$setting]) && $settings[$setting] !== '' ? $settings[$setting] : $default;
        }
        
        if (isset($settings["customCSS"]) && $settings["customCSS"] != '') {
            $this->settings["customCSS"] = $settings["customCSS"];
        } else {
            $this->settings["customCSS"] = '{}';
        }
        if (isset($settings["customPrintCSS"]) && $settings["customPrintCSS"] != '') {
            $this->settings["customPrintCSS"] = $settings["customPrintCSS"];
        } else {
            $this->settings["customPrintCSS"] = "{}";
        }
    }
    
    function settingsPage() {
        $vars = $this->settings;
        $vars["allowLinkChecked"] = $this->settings["allowLink"] ? 'checked="checked"' : '';
        $vars["mbrbLinkChecked"] = $this->settings["pingMBRB"] ? 'checked="checked"' : '';
        $vars["easyrecipeURL"] = $this->easyrecipeURL;
        $vars['siteurl'] = get_site_url();
        $optionsHTML = "<input type='hidden' name='option_page' value='EROptionSettings' />";
        $optionsHTML .= '<input type="hidden" name="action" value="update" />';
        $optionsHTML .= wp_nonce_field("EROptionSettings-options", '_wpnonce', true, false);
        $optionsHTML .= wp_referer_field(false);
        
        $html = $this->getTemplate("easyrecipe-settings.html", $vars);
        $html = str_replace("#optionsHTML#", $optionsHTML, $html);
        
        echo $html;
    }
    
    /*
	 * Add in our tinyMCE plugin
	 */
    
    function mcePlugins($plugins) {
        $plugins = (array) $plugins;
        $plugins["easyrecipe"] = "$this->easyrecipeURL/easyrecipe-mce.js?v=$this->version";
        return $plugins;
    }
    
    /*
	 * Add in our tinyMCE button
	 */
    
    function mceButtons($buttons) {
        $buttons[] = 'easyrecipeLaunch';
        $buttons[] = 'easyrecipeTest';
        return $buttons;
    }
    
    /**
     * Insert the easyrecipe edit dialog and template HTML at the end of the
     * page - they're display:none by default
     */
    function addDialogHTML() {
        global $post;
        
        if (!isset($post)) {
            return;
        }
        wp_enqueue_script("easyrecipeadmin", "$this->easyrecipeURL/easyrecipe-admin01.js");
        $html = $this->getTemplate("easyrecipe-dialog.html");
        echo "<div id=\"easyrecipeDialog\">$html</div>";
        
        $vars = array ("easyrecipeURL" => $this->easyrecipeURL);
        $html = $this->getTemplate("easyrecipe-convert.html", $vars);
        echo "<div id=\"easyrecipeConvert\">$html</div>";
        
        $html = $this->getTemplate("easyrecipe-template.html");
        $html = preg_replace('/\n */', ' ', $html);
        $html = trim(str_replace("'", "\"", $html));
        
        $testURL = $post->post_status == 'publish' ? urlencode(get_permalink($post->ID)) : "";
        
        echo <<<EOD
<script type="text/javascript">
/* <![CDATA[ */

if (typeof EASYRECIPE == "undefined") {
  var EASYRECIPE = {};
}
EASYRECIPE.version = '$this->version';
EASYRECIPE.easyrecipeURL = '$this->easyrecipeURL';
EASYRECIPE.recipeTemplate = '$html';
EASYRECIPE.testURL = '$testURL';
/* ]]> */
</script>
EOD;
    }
    
    /*
	 * Get template HTML and do substitution
	 */
    
    function getTemplate($template, $vars = array()) {
        $html = @file_get_contents("$this->easyrecipeDIR/templates/$template");
        if (!$html) {
            return '';
        }
        if (preg_match('/<!-- START PAGE -->(.*)<!-- END PAGE -->/si', $html, $regs)) {
            $html = trim($regs[1]);
        }
        foreach ($vars as $key => $value) {
            $html = str_replace("#$key#", $value, $html);
        }
        $html = preg_replace('/[\s]{2,}/', ' ', $html);
        return $html;
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
        exit();
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