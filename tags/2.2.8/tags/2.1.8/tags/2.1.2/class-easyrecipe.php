<?php

  /**
   * Handles all the Easy Recipe plugin processing
   *
   * @author John
   */
  require_once 'class-ERDOMDocument.php';

  class EasyRecipe {

    private $pluginsURL;
    private $pluginsDIR;
    private $settings = array();
    private $easyrecipes = array();
    private $version = "2.1.2";
    private $formatting = false;

    function __construct() {

      /*
       * For convenience
       */
      $this->pluginsURL = WP_PLUGIN_URL;
      $this->pluginsDIR = WP_PLUGIN_DIR;

      /*
       * If we're in admin, only load the easyrecipe stuff on the easyrecipe options and diaolog pages
       */

      if (is_admin()) {

        global $concatenate_scripts;
        $concatenate_scripts = false;

        add_action('admin_menu', array($this, 'addMenus'));
        add_filter('plugin_action_links', array($this, 'pluginActionLinks'), 10, 2);

        wp_enqueue_script('jquery');
        wp_enqueue_script('jquery-ui-widget');
        wp_enqueue_script('jquery-ui-dialog');

        if ($GLOBALS["pagenow"] == "options-general.php") {
          if ($_REQUEST['page'] !== "easyrecipe") {
            return;
          }
          wp_enqueue_script('easyrecipe-options', "$this->pluginsURL/easyrecipe/easyrecipe-options.js", array(), $this->version);
        } else {
          wp_enqueue_style("easyrecipe-admin", "$this->pluginsURL/easyrecipe/easyrecipe-admin.css", array(), $this->version);
          wp_enqueue_script('easyrecipeadmin', "$this->pluginsURL/easyrecipe/easyrecipe-admin.js", array('jquery-ui-dialog'), $this->version, true);

          add_action('wp_ajax_customCSS', array($this, 'updateCustomCSS'));
          add_action('admin_footer', array($this, 'addDialogHTML'));
          add_filter('mce_external_plugins', array($this, 'mcePlugins'));
          add_filter('mce_buttons', array($this, 'mceButtons'));
          add_action('publish_post', array($this, 'pingMBRB'), 10, 2);
        }

        add_action('wp_ajax_ERconvertRecipeSEO', array($this, 'convertRecipeSEO'));
        add_action('wp_ajax_ERsendDiagnostics', array($this, 'sendDiagnostics'));

        if (isset($_GET["page"]) && $_GET["page"] == "erdiagnostics") {
          wp_enqueue_style("easyrecipe-diagnostics", "$this->pluginsURL/easyrecipe/easyrecipe-diagnostics.css", array(), $this->version);
          wp_enqueue_script('easyrecipediag', "$this->pluginsURL/easyrecipe/easyrecipe-diagnostics.js", array(), $this->version, true);
        }

        add_filter('plugin_action_links', array($this, 'pluginActionLinks'), 10, 2);
      } else {
        wp_enqueue_script('easyrecipe', "$this->pluginsURL/easyrecipe/easyrecipe.js", array('jquery'), $this->version);

        wp_enqueue_style("easyrecipe", "$this->pluginsURL/easyrecipe/easyrecipe.css", array(), $this->version);
        if (isset($_REQUEST['erprint'])) {
          wp_enqueue_style("easyrecipe-print", "$this->pluginsURL/easyrecipe/easyrecipe-print.css", array(), $this->version);
        } else {
          add_action('comment_form', array($this, 'commentForm'));
          add_action('comment_post', array($this, 'ratingSave'));

          add_action('comment_text', array($this, 'ratingDisplay'));
          add_action('wp_print_scripts', array($this, 'extraCSS'));
        }

        /*
         * It's critical we get to process the posts before anything else has a
         * chance to mess with them so specify a ridiculously high priority here
         */
        add_action('the_posts', array($this, 'thePosts'), -32767);
        add_action('init', array($this, 'initialise'));
        add_action('wp_before_admin_bar_render', array($this, 'adminBarMenu'));

        $this->getSettings();
      }
    }

    function adminBarMenu() {
      global $wp_admin_bar;
      $root_menu = array(
          'parent' => false,
          'id' => 'ERFormatMenu',
          'title' => 'Easy Recipe Format',
          'href' => admin_url('my-new-menu.php'),
          'meta' => array('onclick' => 'EASYRECIPE.openFormat(); return false')
      );

      $wp_admin_bar->add_menu($root_menu);
    }

    function initialise() {

      if (current_user_can("administrator")) {

        wp_deregister_script('jquery');
        wp_register_script('jquery', ("https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"), false, '');
        wp_enqueue_script('jquery');

        add_action('wp_ajax_customCSS', array($this, 'updateCustomCSS'));

        wp_deregister_script('jquery-ui');
        wp_register_script('jquery-ui', ("https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js"), false, '');
        wp_enqueue_script('jquery-ui');

        wp_enqueue_style("jquery-ui-base", "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/themes/base/jquery-ui.css");
        wp_enqueue_script('json2');

        wp_enqueue_style("easyrecipeformat", "$this->pluginsURL/easyrecipe/easyrecipe-format.css", array(), $this->version);

        wp_enqueue_script('easyrecipeformat', "$this->pluginsURL/easyrecipe/easyrecipe-format.js", array('jquery-ui'), $this->version);

        add_action('wp_footer', array($this, 'addFormatDialog'));
      }
    }

    /**
     * Process the update from the format javascript via ajax
     */
    public function updateCustomCSS() {
      if (current_user_can("administrator")) {
        $css = isset($_POST['css']) ? $_POST['css'] : "";
        $settings = get_option("ERSettings", array());
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
EASYRECIPE.pluginsURL = '$this->pluginsURL';
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

      $data = http_build_query(array('id' => $postID, 'link' => get_permalink($postID)));


      $this->socketIO("POST", "www.mybigrecipebox.com", 80, "/pingback.php", $data);
    }

    function extraCSS() {
      echo "<style type=\"text/css\">\n";
      $css = json_decode(stripslashes($this->settings["customCSS"]));

      foreach ($css AS $selector => $style) {
        $style = addslashes($style);
        echo "$selector { $style }\n";
      }
      echo "</style>\n";
    }

    public function urlShortcode($attributes, $content) {
      $attributes = shortcode_atts(array("href" => "#", "target" => "_self"), $attributes);
      return '<a href="' . $attributes['href'] . '" target="' . $attributes['target'] . '">' . $content . '</a>';
    }

    public function imgShortcode($attributes, $content=null) {
      $width = isset($attributes['width']) ? '" width="' . $attributes['width'] . '"' : "";
      $height = isset($attributes['height']) ? '" height="' . $attributes['height'] . '"' : "";
      return '<img src="' . $attributes['src'] . '"' . "$width$height" . ' />';
    }

    public function brShortcode($attributes, $content=null) {
      return '<br>';
    }

    public function bShortcode($attributes, $content=null) {
      return "<strong>$content</strong>";
    }

    public function iShortcode($attributes, $content=null) {
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
//      $content = wpautop($post->post_content);
//      $content =  $post->post_content;
      $vars = array();
      $vars["recipe"] = do_shortcode(ERDOMDocument::getPrintRecipe($post->post_content));

      /*
       * Look for an image and try to scale it proportionally
       * Pretty crap way of doing it - we really should create a thumb so it only needs to be done once ever - in a later version maybe!
       */
      $vars["pluginsURL"] = $this->pluginsURL;

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
           * If it exists on the server's doc root, and it's a file, try reading it
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
       * Display the screen and exit
       * The JS will take care of the print and closing the window
       */
      $vars["title"] = $post->post_title;
      $vars["blogname"] = get_option("blogname");
      $vars["recipeurl"] = get_permalink($post->ID);
      if (current_user_can("administrator") && isset($_REQUEST['erformat'])) {
        $siteURL = site_url();
        $vars['cssjs'] = <<<EOD
      <link rel='stylesheet' href='http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/themes/base/jquery-ui.css?ver=$this->version' type='text/css' />
<link rel='stylesheet' href='$this->pluginsURL/easyrecipe/easyrecipe-format.css?ver=$this->version' type='text/css' />
<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js'></script>
<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js'></script>
<script type='text/javascript' src='$siteURL/wp-includes/js/json2.js?ver=2011-02-23'></script>
<script type='text/javascript' src='$this->pluginsURL/easyrecipe/easyrecipe-format.js?ver=$this->version'></script>
EOD;
      } else {
        $vars['cssjs'] = <<<EOD
<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js'></script>
<script type="text/javascript" src="$this->pluginsURL/easyrecipe/easyrecipe-print.js?ver=$this->version"></script>
EOD;
      }

      $customCSS = "<style type=\"text/css\">\n";
      $css = json_decode(stripslashes($this->settings["customPrintCSS"]));

      foreach ($css AS $selector => $style) {
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
      exit;
    }

    function thePosts($posts) {

      $newPosts = array();
      /*
       * Process each post and replace placeholders with relevant data
       */

      foreach ($posts AS $post) {

        /*
         * Suppress warnings and errors and then reset it to whatever is was
         */
        if (!isset($_REQUEST['erdebug'])) {
          $oldErrors = error_reporting(0);
          $oldDisplay = ini_get("display_errors");
          ini_set("display_errors", 0);
        } else {
          $oldErrors = error_reporting(E_ALL);
          $oldDisplay = ini_get("display_errors");
          ini_set("display_errors", 1);
        }
        $easyrecipe = new ERDOMDocument($post->post_content);
        error_reporting($oldErrors);
        ini_set("display_errors", $oldDisplay);

        if (!$easyrecipe->isEasyRecipe) {
          $newPosts[] = $post;
          continue;
        }
        $this->easyrecipes[$post->ID] = true;
        /*
         * Insert the page's permalink for the print button and make the print button visible
         * The visibilities are hardcoded in the post so we degrade gracefully if EasyRecipe is deactivated
         * Allow for the editor to mess about with the spacing
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
        $easyrecipe->setParentValueByClassName("carbohydrates", $this->settings['lblCarbohydrates'], "Carbohydrates");
        $easyrecipe->setParentValueByClassName("sugar", $this->settings['lblSugar'], "Sugar");
        $easyrecipe->setParentValueByClassName("fiber", $this->settings['lblFiber'], "Fiber");
        $easyrecipe->setParentValueByClassName("protein", $this->settings['lblProtein'], "Protein");
        $easyrecipe->setParentValueByClassName("cholesterol", $this->settings['lblCholesterol'], "Cholesterol");

        // Oops!  Fix early version typo
        $easyrecipe->setParentValueByClassName("cholestrol", $this->settings['lblCholesterol'], "Cholestrol");

        /*
         * Find the ratings - could be done better with a DB JOIN, but for the
         * small numbers we're going to have it's not gonna make much difference
         */

        $comments = get_comments(array('status' => 'approve', 'post_id' => $post->ID));
        $totalRating = 0;
        $nRatings = 0;
        foreach ($comments AS $comment) {
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
         * Add a published date and wrap the whole EasyRecipe with an hrecipe class, and replace the post content with the result
         */
        $pDate = '<span class="published"><span class="value-title" title="' . substr($post->post_date, 0, 10) . '"></span></span>';
        $post->post_content = '<div class="hrecipe">' . "$pDate$content" . '</div>';
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
      if (!$this->easyrecipes[$postID]) {
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
      add_options_page('Easy Recipe Settings', 'Easy Recipe', 'administrator', 'easyrecipe', array($this, 'settingsPage'));
      add_submenu_page("tools.php", "Easy Recipe Diagnostics", "Easy Recipe", "administrator", "erdiagnostics", array($this, "diagnostics"));
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
        foreach ($user->capabilities AS $cap => $allowed) {
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
      usort($plugins, array($this, "sortPlugins"));
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
            $vars ["hookdata"] .= <<<EOD
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
      $vars["pluginsURL"] = $this->pluginsURL;
      $html = $this->getTemplate("easyrecipe-diagnostics.html", $vars);

      echo $html;
    }

    function sendDiagnostics() {
      $data = new stdClass();
      $data->vars = $this->getDiagnostics();
      $data->email = stripslashes($_POST['email']);
      $data->problem = stripslashes($_POST['problem']);
      $data = "data=" . urlencode(json_encode($data));
      $status = $this->socketIO("POST", "www.orgasmicchef.com", 80, "/easyrecipe/diagnostics.php", $data);
      echo json_encode(array("status" => $status));
      exit;
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
      $this->settings["recipeBackground"] = trim($settings["recipeBackground"]);
      $this->settings["borderStyle"] = trim($settings["borderStyle"]);
      $this->settings["borderWidth"] = (int) $settings["borderWidth"];
      $this->settings["borderColor"] = trim($settings["borderColor"]);
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
       * The options page doesn't have customCSS so don't update it if it's not set
       */
      if (isset($settings["customCSS"])) {
        $this->settings["customCSS"] = trim($settings["customCSS"]);
      }

      if (isset($settings["customPrintCSS"])) {
        $this->settings["customPrintCSS"] = trim($settings["customPrintCSS"]);
      }

      return $this->settings;
    }

    function getSettings() {

      $settings = get_option("ERSettings", array());
      $this->settings["allowLink"] = isset($settings["allowLink"]) ? $settings["allowLink"] : false;
      $this->settings["ingredientHead"] = isset($settings["ingredientHead"]) ? $settings["ingredientHead"] : "Ingredients";
      $this->settings["instructionHead"] = isset($settings["instructionHead"]) ? $settings["instructionHead"] : "Instructions";
      $this->settings["notesHead"] = isset($settings["notesHead"]) ? $settings["notesHead"] : "Notes";
      $this->settings["recipeBackground"] = isset($settings["recipeBackground"]) ? $settings["recipeBackground"] : "#f7f7f7";
      $this->settings["borderStyle"] = isset($settings["borderStyle"]) ? $settings["borderStyle"] : "dashed";
      $this->settings["borderWidth"] = isset($settings["borderWidth"]) ? $settings["borderWidth"] : 1;
      $this->settings["borderColor"] = isset($settings["borderColor"]) ? $settings["borderColor"] : "#000000";
      $this->settings["pingMBRB"] = isset($settings["pingMBRB"]) ? $settings["pingMBRB"] : false;

      $this->settings["lblRecipeType"] = isset($settings["lblRecipeType"]) ? $settings["lblRecipeType"] : "Recipe type";
      $this->settings["lblAuthor"] = isset($settings["lblAuthor"]) ? $settings["lblAuthor"] : "Author";
      $this->settings["lblPrepTime"] = isset($settings["lblPrepTime"]) ? $settings["lblPrepTime"] : "Prep time";
      $this->settings["lblCookTime"] = isset($settings["lblCookTime"]) ? $settings["lblCookTime"] : "Cook time";
      $this->settings["lblTotalTime"] = isset($settings["lblTotalTime"]) ? $settings["lblTotalTime"] : "Total time";
      $this->settings["lblServes"] = isset($settings["lblServes"]) ? $settings["lblServes"] : "Serves";
      $this->settings["lblServeSize"] = isset($settings["lblServeSize"]) ? $settings["lblServeSize"] : "Serving size";
      $this->settings["lblCalories"] = isset($settings["lblCalories"]) ? $settings["lblCalories"] : "Calories";
      $this->settings["lblSugar"] = isset($settings["lblSugar"]) ? $settings["lblSugar"] : "Sugar";
      $this->settings["lblFat"] = isset($settings["lblFat"]) ? $settings["lblFat"] : "Fat";
      $this->settings["lblSatFat"] = isset($settings["lblSatFat"]) ? $settings["lblSatFat"] : "Saturated fat";
      $this->settings["lblUnsatFat"] = isset($settings["lblUnsatFat"]) ? $settings["lblUnsatFat"] : "Unsaturated fat";
      $this->settings["lblCarbs"] = isset($settings["lblCarbs"]) ? $settings["lblCarbs"] : "Carbohydrates";
      $this->settings["lblFiber"] = isset($settings["lblFiber"]) ? $settings["lblFiber"] : "Fiber";
      $this->settings["lblProtein"] = isset($settings["lblProtein"]) ? $settings["lblProtein"] : "Protein";
      $this->settings["lblCholesterol"] = isset($settings["lblCholesterol"]) ? $settings["lblCholesterol"] : "Cholesterol";
      $this->settings["lblRateRecipe"] = isset($settings["lblRateRecipe"]) ? $settings["lblRateRecipe"] : "Rate this recipe";
      if (isset($settings["customCSS"])) {
        $this->settings["customCSS"] = $settings["customCSS"];
      } else {
        $this->settings["customCSS"] = '{".easyrecipe":"background-color:' . $this->settings["recipeBackground"] .
                ';border-style:dashed;border-color:' . $this->settings["borderColor"] . ';border-width:' . $this->settings["borderWidth"] . 'px"}';
      }
      if (isset($settings["customPrintCSS"])) {
        $this->settings["customPrintCSS"] = $settings["customPrintCSS"];
      } else {
        $this->settings["customPrintCSS"] = "{}";
      }
    }

    function settingsPage() {

      $this->getSettings();
      $vars = $this->settings;
      $vars["allowLinkChecked"] = $this->settings["allowLink"] ? 'checked="checked"' : '';
      $vars["mbrbLinkChecked"] = $this->settings["pingMBRB"] ? 'checked="checked"' : '';
      $vars["pluginsURL"] = $this->pluginsURL;
      $vars['siteurl'] = home_url();
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
      $plugins["easyrecipe"] = WP_PLUGIN_URL . '/easyrecipe/easyrecipe-mce.js?v=' . $this->version;
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
     * Insert the easyrecipe edit dialog and template HTML at the end of the page - they're display:none by default
     */
    function addDialogHTML() {
      global $post;

      wp_enqueue_script("easyrecipeadmin", "$this->pluginsURL/easyrecipe/easyrecipe-admin01.js");
      $html = $this->getTemplate("easyrecipe-dialog.html");
      echo "<div id=\"easyrecipeDialog\">$html</div>";

      $vars = array("pluginsURL" => $this->pluginsURL);
      $html = $this->getTemplate("easyrecipe-convert.html", $vars);
      echo "<div id=\"easyrecipeConvert\">$html</div>";

      $html = $this->getTemplate("easyrecipe-template.html");
      $html = str_replace("\n", "", $html);
      $html = trim(str_replace("'", "\'", $html));

      $testURL = $post->post_status == 'publish' ? urlencode(get_permalink($post->ID)) : "";

      echo <<<EOD
<script type="text/javascript">
/* <![CDATA[ */

if (typeof EASYRECIPE == "undefined") {
  var EASYRECIPE = {};
}
EASYRECIPE.version = '$this->version';
EASYRECIPE.pluginsURL = '$this->pluginsURL';
EASYRECIPE.recipeTemplate = '$html';
EASYRECIPE.testURL = '$testURL';
/* ]]> */
</script>
EOD;
    }

    /*
     * Get template HTML and do substitution
     */

    function getTemplate($template, $vars=array()) {
      $html = @file_get_contents("$this->pluginsDIR/easyrecipe/templates/$template");
      if (!$html) {
        return '';
      }
      if (preg_match('/<!-- START PAGE -->(.*)<!-- END PAGE -->/si', $html, $regs)) {
        $html = trim($regs[1]);
      }
      foreach ($vars AS $key => $value) {
        $html = str_replace("#$key#", $value, $html);
      }
      $html = preg_replace('/[\s]{2,}/', ' ', $html);
      return $html;
    }

    /*
     * Return RecipeSEO data
     */

    function convertRecipeSEO() {
      global $wpdb;

      $id = (int) $_POST['id'];
      $result = new stdClass();

      $result->recipe = $wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "amd_recipeseo_recipes WHERE recipe_id=" . $id);
      $ingredients = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "amd_recipeseo_ingredients WHERE recipe_id=" . $id . " ORDER BY ingredient_id");

      $result->ingredients = array
              ();
      foreach ($ingredients as $ingredient) {

        $result->ingredients[] = $ingredient->amount . " " . $ingredient->name;
      }

      echo json_encode($result);
      exit;
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
      while ($data = @fread($fp, 4096)) {
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
