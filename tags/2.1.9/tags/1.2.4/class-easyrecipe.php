<?php

  /**
   * Handles all the Easy Recipe plugin processing
   *
   * @author John
   */
  class EasyRecipe {

    private $regexEasyrecipe = '%<div class="easyrecipe[^>]>*(.*)<div class="endeasyrecipe[^>]*>([0-9\.]+)</div>%si';
    private $pluginsURL;
    private $pluginsDIR;
    private $settings = array();
    private $easyrecipes = array();
    private $version = "1.2.4";

    function __construct() {

      /*
       * For convenience
       */
      $this->pluginsURL = WP_PLUGIN_URL;
      $this->pluginsDIR = WP_PLUGIN_DIR;

      /*
       * TODO - do better selection of what to load based on what page we're in
       * No point slowing things down if we aren't gonna be used 
       */
      if (is_admin ()) {


        $page = $GLOBALS["pagenow"];

        wp_enqueue_style("wp-jquery-ui-dialog");
        if ($page == "options-general.php") {
          wp_enqueue_style("easyrecipecp", "$this->pluginsURL/easyrecipe/farbtastic/farbtastic.css", array(), $this->version);
        }
        wp_enqueue_style("easyrecipe-admin", "$this->pluginsURL/easyrecipe/easyrecipe-admin.css", array(), $this->version);
        wp_enqueue_style("easyrecipe-diagnostics", "$this->pluginsURL/easyrecipe/easyrecipe-diagnostics.css", array(), $this->version);

        wp_enqueue_script('jquery');
        wp_enqueue_script('jquery-ui-core');
        wp_enqueue_script('jquery-ui-dialog');

        /*
         * Wordpress's javascript dependency processing seems to be seriously dodgy and for some reason loads the jquery ui stuff
         * at the foot of the page. Forcing it to the head by specifying it as a dependency here seems to break some other (badly behaved)
         * recipe related plugins, so we have no choice but to load ourselves at the end
         */
        if ($page == "options-general.php") {
          wp_enqueue_script('farbtastic', "$this->pluginsURL/easyrecipe/farbtastic/farbtastic.js", array(), $this->version, true);
          wp_enqueue_script('easyrecipecp', "$this->pluginsURL/easyrecipe/easyrecipe-options.js", array(), $this->version, true);
        } else {
          wp_enqueue_script('easyrecipeadmin', "$this->pluginsURL/easyrecipe/easyrecipe-admin.js", array(), $this->version, true);
          add_action('admin_footer', array($this, 'addDialogHTML'));
          add_action('wp_ajax_ERconvertRecipeSEO', array($this, 'convertRecipeSEO'));
          add_action('wp_ajax_ERsendDiagnostics', array($this, 'sendDiagnostics'));
          add_filter('mce_external_plugins', array($this, 'mcePlugins'));
          add_filter('mce_buttons', array($this, 'mceButtons'));
          add_action('publish_post', array($this, 'pingMBRB'), 10, 2);
        }
        if ($page == "tools.php" && isset($_GET["page"]) && $_GET["page"] == "erdiagnostics") {
          wp_enqueue_script('easyrecipediag', "$this->pluginsURL/easyrecipe/easyrecipe-diagnostics.js", array(), $this->version, true);
        }
        add_action('admin_menu', array($this, 'addMenus'));
        add_action('admin_init', array($this, 'adminInit'));
        add_filter('plugin_action_links', array($this, 'pluginActionLinks'), 10, 2);
      } else {
        wp_enqueue_script('jquery');
        wp_enqueue_script('easyrecipe', "$this->pluginsURL/easyrecipe/easyrecipe.js", array('jquery'), $this->version);

        wp_enqueue_style("easyrecipe", "$this->pluginsURL/easyrecipe/easyrecipe.css", array(), $this->version);
        if (isset($_REQUEST['erprint'])) {
          wp_enqueue_style("easyrecipe-print", "$this->pluginsURL/easyrecipe/easyrecipe-print.css", array(), $this->version, 'print');
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

        $this->getSettings();
      }
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
      echo <<<EOD
<style type="text/css">
.easyrecipe {
  background-color : {$this->settings["recipeBackground"]};
  border : {$this->settings["borderWidth"]}px {$this->settings["borderStyle"]} {$this->settings["borderColor"]};
}
</style>
EOD;
    }

    /*
     * Displays just the recipe and exits
     */

    function printRecipe($posts) {
      /*
       * We should always be printing a single post!
       */
      if (!is_single()) {
        return $posts;
      }

      $imageSize = 200;

      $recipe = $regs[0];
      $post = $posts[0];

      /*
       * We need the <p>'s for some formatting
       */
      $content = wpautop($post->post_content);

      /*
       *  This should never fail - but check since we need to split up the content anyway
       */
      if (!preg_match($this->regexEasyrecipe, $content, $regs)) {
        return $posts;
      }
      $vars = array();
      $vars["recipe"] = $regs[1];

      /*
       * Look for an image and try to scale it proportionally
       * Pretty crap way of doing it - we really should create a thumb so it only needs to be done once ever - next version!
       */
      $vars["pluginsURL"] = $this->pluginsURL;

      $vars["imageURL"] = "";
      $vars["tx"] = 0;
      $vars["ty"] = 0;
      $vars["imagedisplay"] = "none";
      if (preg_match('/<img ([^>]+)>/si', $content, $regs)) {
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
      $html = $this->getTemplate("easyrecipe-print.html", $vars);
      echo $html;
      exit;
    }

    function thePosts($posts) {

      $newPosts = array();
      /*
       * Process each post and replace placeholders with relevant data
       */

      foreach ($posts AS $post) {
        /*
         * Only interested in easyrecipe posts
         */
        if (!preg_match($this->regexEasyrecipe, $post->post_content, $regs)) {
          $newPosts[] = $post;
          continue;
        }

        /*
         * Handle a print request - normally won't return
         */
        if (isset($_REQUEST['erprint'])) {
          return $this->printRecipe($posts);
        }

        $this->easyrecipes[$post->ID] = true;

        /*
         * Insert the page's permalink for the print button and make the print button visible
         * The visibilities are hardcoded in the post so we degrade gracefully if EasyRecipe is deactivated
         * Allow for the editor to mess about with the spacing
         */
        if (isset($_REQUEST['preview'])) {
          $content = str_replace("#printlink#", $_SERVER['REQUEST_URI'], $post->post_content);
        } else {
          $content = str_replace("#printlink#", get_permalink($post->ID), $post->post_content);
        }
        $content = preg_replace('/class=[\'|"](btnERPrint|ERLinkback)[\'|"]\s+style=[\'|"]display\s*:\s*none;?[\'|"]/si', 'class="$1"', $content);

        /*
         * Adjust the headings
         */
        $content = str_replace('class="ERIngredientsHeader">Ingredients<', "class=\"ERIngredientsHeader\">{$this->settings['ingredientHead']}<", $content);
        $content = str_replace('class="ERInstructionsHeader">Instructions<', "class=\"ERInstructionsHeader\">{$this->settings['instructionHead']}<", $content);
        $content = str_replace('class="ERNotesHeader">Instructions<', "class=\"ERNotesHeader\">{$this->settings['notesHead']}<", $content);

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
         * If we have a rating, the make the ratings visible and insert the values
         * Remove the "#inner#" placeholder which was there to prevent tinyMCE cleaning the inner div out of existence
         *
         * 1.2 Remove the whole thing entirely if there aren't any ratings
         */
        if ($totalRating > 0) {
          $sRating = $nRatings > 0 ? sprintf("%3.1f", $totalRating / $nRatings) : "0.0";
          $content = str_replace("#ratingval#", $sRating, $content);
          $content = preg_replace('/class=(?:"|\')ERRatingInner(?:"|\') style=(?:"|\')width: *(0)%/si', 'class="ERRatingInner" style="width:' . $sRating * 20 . '%', $content);
          $content = str_replace("#reviews#", $nRatings, $content);
          $content = str_replace("#inner#", "", $content);
        } else {
          $content = preg_replace('%<div +class="ERRatingOuter".*?</div>.*?</div>[\s]*</div>%si', '', $content);
        }

        /*
         * Make it display if the rating is > 0
         */
        if ($totalRating > 0) {
          $content = preg_replace('/class=[\'|"]ERRatingOuter[\'|"]\s+style=[\'|"]display\s*:\s*none;?[\'|"]/si', 'class="ERRatingOuter"', $content);
        }

        /*
         * Remove the linkback if we aren't going to display it
         */
        if (!$this->settings["allowLink"]) {
          $content = preg_replace('%<div class="ERLinkback".*?</div>%si', '', $content);
        }
        /*
         * Look for an image and add the "photo" class to the first one found
         */
        if (preg_match('/^(.*?)<img ([^>]+>)(.*)$/si', $content, $regs)) {
          $preamble = $regs[1];
          $imgTag = $regs[2];
          $postscript = $regs[3];
          /*
           * If there's no "class", add one else add "photo" to the existing one
           * Don't bother checking if "photo" already exists if there's an existing class
           */
          if (preg_match('/^(.*)class="([^"]*".*)$/si', $imgTag, $regs)) {
            $imgTag = "<img " . $regs[1] . 'class="photo ' . $regs[2];
          } else {
            $imgTag = '<img class="photo" ' . $imgTag;
          }
          /*
           * Re-assemble the content
           */
          $content = "$preamble$imgTag$postscript";
        }

        /*
         * Add a published date and wrap the whole thing with an hrecipe class
         */
        $pDate = '<span class="published"><span class="value-title" title="' . substr($post->post_date, 0, 10) . '"></span></span>';

        $post->post_content = '<div class="hrecipe">' . "$pDate$content" . '</div>';
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
<div style="float:left">Rate this recipe: </div>
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

    function adminInit() {
      register_setting('EROptionSettings', 'ERSettings', array($this, 'validateOptions'));
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
      $this->settings["allowLink"] = isset($settings["allowLink"]);
      $this->settings["ingredientHead"] = trim(wp_filter_nohtml_kses($settings["ingredientHead"]));
      $this->settings["instructionHead"] = trim(wp_filter_nohtml_kses($settings["instructionHead"]));
      $this->settings["notesHead"] = trim(wp_filter_nohtml_kses($settings["notesHead"]));
      $this->settings["recipeBackground"] = trim($settings["recipeBackground"]);
      $this->settings["borderStyle"] = trim($settings["borderStyle"]);
      $this->settings["borderWidth"] = (int) $settings["borderWidth"];
      $this->settings["borderColor"] = trim($settings["borderColor"]);
      $this->settings["pingMBRB"] = isset($settings["pingMBRB"]);

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
    }

    function settingsPage() {
      $this->getSettings();
      $vars = $this->settings;
      $vars["allowLinkChecked"] = $this->settings["allowLink"] ? 'checked="checked"' : '';
      $vars["mbrbLinkChecked"] = $this->settings["pingMBRB"] ? 'checked="checked"' : '';
      $vars["pluginsURL"] = $this->pluginsURL;

      $vars['noneselected'] = "";
      $vars['solidselected'] = "";
      $vars['dashedselected'] = "";
      $vars['dottedselected'] = "";
      $vars[$this->settings['borderStyle'] . "selected"] = 'selected="selected"';
      $vars['borderWidth'] = $this->settings['borderWidth'];
      $vars['borderColor'] = $this->settings['borderColor'];

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

    /*
     * Insert the dialogs HTML at the end of the page - they're display:none by default
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

      $result->ingredients = array();
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
