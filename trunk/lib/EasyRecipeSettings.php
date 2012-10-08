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
class EasyRecipeSettings {
    /*
    * Constants from Phing build
    */
    private $templateClass = 'EasyRecipeTemplate';
    private $stylesClass = 'EasyRecipeStyles';
    private $settingsName = 'ERSettings';
    private $pluginName = 'easyrecipe';

    /*
    * For convenience
    */
    private $easyrecipeDIR;
    private $easyrecipeURL;

    /*
    * Default settings
    * @formatter:off
    */
    private $defaultSettings = array(

        'licenseKey' => '',

        'style' => 'style001', 'printStyle' => 'style001',

        'customCSS' => '', 'customPrintCSS' => '', 'extraCSS' => '', 'extraPrintCSS' => '',

        'displayPrint' => true, 'allowLink' => false, 'convertFractions' => true, 'removeMicroformat' => false, 'pingMBRB' => false,

        'enableSwoop' => false, 'swoopSiteID' => '',

        'saveButton' => 'None', 'ziplistPartnerKey' => '', 'saltyfigPartnerKey' => '',

        'author' => '',

        'cuisines' => 'African|American|French|Greek|Indian|Italian|Kosher|Mexican|Middle Eastern|Spanish',

        'recipeTypes' => 'Appetiser|Breakfast|Brunch|Dessert|Drinks|Entree|Main',

        'ratings' => 'EasyRecipe',

        'lblIngredients' => 'Ingredients', 'lblInstructions' => 'Instructions', 'lblNotes' => 'Notes', 'lblNutrition' => 'Nutrition Information', 'lblAuthor' => 'Author', 'lblCuisine' => 'Cuisine', 'lblRecipeType' => 'Recipe type', 'lblPrepTime' => 'Prep time', 'lblCookTime' => 'Cook time', 'lblTotalTime' => 'Total time', 'lblServes' => 'Serves', 'lblServeSize' => 'Serving size', 'lblCalories' => 'Calories', 'lblSugar' => 'Sugar', 'lblSodium' => 'Sodium', 'lblFat' => 'Fat', 'lblSatFat' => 'Saturated fat', 'lblUnsatFat' => 'Unsaturated fat', 'lblTransFat' => 'Trans fat', 'lblCarbs' => 'Carbohydrates', 'lblFiber' => 'Fiber', 'lblProtein' => 'Protein', 'lblCholesterol' => 'Cholesterol', 'lblRateRecipe' => 'Rate this recipe',

        'gpUserID' => 0, 'gpDetailsPage' => 0, 'gpEntryPage' => 0, 'gpThanksPage' => 0, 'gpHideFooter' => true,

        'erSubscribe' => false, 'erEmailAddress' => '', 'erFirstName' => '',

        'customTemplates' => '',

        'forcejQuery' => false,

        'lastFlushVersion' => 0);

    private $settings;
    private $style;

    private $printStyle;
    private $styleData;
    private $printStyleData;


    /*
     * @formatter:on
    */
    function __construct() {

        /*
        * For convenience
        */
        $this->easyrecipeDIR = WP_PLUGIN_DIR . "/$this->pluginName";
        $this->easyrecipeURL = WP_PLUGIN_URL . "/$this->pluginName";

        $settings = get_option($this->settingsName, array());
        foreach ($this->defaultSettings as $setting => $default) {
            $this->settings[$setting] = isset($settings[$setting]) ? $settings[$setting] : $default;
        }
    }

    /**
     * Return the value of a setting
     *
     * @param string $settingName
     *            The setting to retrieve
     *
     * @return mixed The setting value
     */

    /**
     * @param bool $settingName
     * @return null
     */
    public function get($settingName = false) {
        if ($settingName) {
            return isset($this->settings[$settingName]) ? $this->settings[$settingName] : null;
        } else {
            return $this->settings;
        }
    }

    /**
     * Save the settings
     *
     * @param array $settings
     *            key/value array of settings
     */
    public function save($settings) {
        if (!isset($settings)) {
            return;
        }

        $subscribeChange = ($this->settings['erSubscribe']) ? !isset($settings['erSubscribe']) : isset($settings['erSubscribe']);

        $subscribeChange = $subscribeChange || ($settings["erFirstName"] != $this->settings["erFirstName"]);
        $subscribeChange = $subscribeChange || ($settings["erEmailAddress"] != $this->settings["erEmailAddress"]);
        $oldEmail = $this->settings["erEmailAddress"];

//        $allowedHTML = array('a' => array('href' => array(), 'target' => array()));
        foreach ($this->defaultSettings as $key => $nil) {
            switch ($key) {
                case 'displayPrint' :
                case 'allowLink' :
                case 'convertFractions' :
                case 'removeMicroformat' :
                case 'pingMBRB' :
                case 'enableSwoop' :
                case 'erSubscribe' :
                case 'gpHideFooter' :
                case 'forcejQuery' :
                    $this->settings[$key] = isset($settings[$key]);
                    break;

                case 'cuisines' :
                case 'recipeTypes' :
                    /*
                    * Replace CRLF, CR with LF and implode
                    */
                    $values = isset($settings[$key]) ? preg_replace('/[\r\n]+/', "\n", trim($settings[$key])) : '';
                    $this->settings[$key] = stripslashes(preg_replace('/ *\n+ */', '|', $values));
                    break;

                case 'customCSS' :
                case 'customPrintCSS' :
                    break;

                case 'extraCSS' :
                case 'extraPrintCSS' :
                    $this->settings[$key] = trim($settings[$key]);
                    break;

                case 'erFirstName' :
                case 'erEmailAddress' :
                    $this->settings[$key] = stripslashes(trim(wp_filter_nohtml_kses($settings[$key])));
                    break;

                default :
                    if (isset($settings[$key])) {
                        //$this->settings[$key] = stripslashes(trim(wp_filter_nohtml_kses($settings[$key])));
                        $this->settings[$key] = htmlentities(stripslashes(trim($settings[$key])));
                    }
                    break;
            }
        }
        update_option($this->settingsName, $this->settings);

        if ($subscribeChange) {
            $body = array();
            if ($this->settings['erSubscribe']) {
                $body['subscribe'] = 'yes';
                $body['email'] = $this->settings["erEmailAddress"];
            } else {
                $body['subscribe'] = 'no';
                $body['email'] = $oldEmail;
            }
            $body['first'] = $settings["erFirstName"];
            $body['site'] = get_site_url();
            $url = "http://www.easyrecipeplugin.com/mailing.php";
            wp_remote_post($url, array('method' => 'POST', 'timeout' => 20, 'redirection' => 0, 'httpversion' => '1.1', 'blocking' => true, 'headers' => array(), 'body' => $body, 'cookies' => array()));
        }
    }

    /**
     * Echo the html needed for the admin settings page
     */
    public function showPage() {
        if (isset($_POST['action']) && $_POST['action'] == 'save') {
            $this->save($_POST[$this->settingsName]);
        }

        $data = (object)$this->settings;
        $data->settingsname = $this->settingsName;

        $data->wpurl = get_bloginfo("wpurl");
        $data->editURL = "$data->wpurl/wp-admin/edit.php";
        $data->pluginversion = '3.1.09';
        $data->license = $this->settings['licenseKey'];

        $data->displayPrintChecked = $this->settings["displayPrint"] ? 'checked="checked"' : '';
        $data->allowLinkChecked = $this->settings["allowLink"] ? 'checked="checked"' : '';
        $data->convertFractionsChecked = $this->settings["convertFractions"] ? 'checked="checked"' : '';
        $data->removeMFChecked = $this->settings["removeMicroformat"] ? 'checked="checked"' : '';
        $data->mbrbLinkChecked = $this->settings["pingMBRB"] ? 'checked="checked"' : '';
        $data->enableSwoopChecked = $this->settings["enableSwoop"] ? 'checked="checked"' : '';
        $data->swoopclass = $this->settings["enableSwoop"] ? '' : 'ERSNoSwoop';
        $data->forcejQueryChecked = $this->settings["forcejQuery"] ? 'checked="checked"' : '';

        $data->saveButtonZiplistChecked = $data->saveButtonSaltyFigChecked = $data->saveButtonNoneChecked = '';
        $data->ziplistclass = $data->saltyfigclass = "ERSDisplayNone";

        switch ($data->saveButton) {
            case 'Ziplist':
                $data->saveButtonZiplistChecked = 'checked="checked"';
                $data->ziplistclass = '';
                break;

            case 'SaltyFig':
                $data->saveButtonSaltyFigChecked = 'checked="checked"';
                $data->saltyfigclass = '';
                break;

            default:
                $data->saveButtonNoneChecked = 'checked="checked"';
                break;
        }


        $data->ratingEasyRecipeChecked = $data->ratingDisabledChecked = '';
        $ratingChecked = "rating" . $this->settings['ratings'] . "Checked";
        $data->{$ratingChecked} = 'checked="checked"';
        $data->erSubscribeChecked = $this->settings["erSubscribe"] ? 'checked="checked"' : '';
        $data->subscribeclass = $this->settings["erSubscribe"] ? '' : 'ERSNoSubscribe';

        /*
         * Set up Swoop stuff
        */
        if ($data->swoopSiteID != '') {
            $data->registerswoop = 'ERSDisplayNone';
            $data->loginswoop = '';
        } else {
            $data->registerswoop = '';
            $data->loginswoop = 'ERSDisplayNone';
        }
        /*
         * Set up the register data even if we're already registered in case we remove the current ID
        */
        $swoopData = new stdClass();
        $swoopData->email = get_bloginfo("admin_email");
        $swoopData->blog_url = get_bloginfo("wpurl");
        $swoopData->blog_title = get_bloginfo("description");
        $swoopData->rss_url = get_bloginfo("rss_url");
        $swoopData->tz = get_option('timezone_string');
        $data->swoopqs = http_build_query($swoopData);

        $data->easyrecipeURL = $this->easyrecipeURL = WP_PLUGIN_URL . "/$this->pluginName";
        $data->siteurl = get_site_url();

        $data->erplus = '';
        $data->author = $this->settings["author"];
        $data->cuisines = str_replace('|', "\n", $this->settings["cuisines"]);
        $data->recipeTypes = str_replace('|', "\n", $this->settings["recipeTypes"]);
        $data->plus = $this->pluginName == 'easyrecipeplus' ? "Plus" : "";
        $data->pluginName = $this->settingsName;
        $optionsHTML = "<input type='hidden' name='option_page' value='EROptionSettings' />";
        $optionsHTML .= '<input type="hidden" name="action" value="update" />';
        $optionsHTML .= wp_nonce_field("EROptionSettings-options", '_wpnonce', true, false);
        $optionsHTML .= wp_referer_field(false);

        $styles = call_user_func(array($this->stylesClass, 'getStyles'), $this->settings['customTemplates']);

        $data->styleDirectory = $this->settings['style'];
        $styleNum = 0;
        $styleTab = 1;
        $styleItem = false;
        $data->STYLETABS = array();
        foreach ($styles as $style) {
            if ($styleNum % 3 == 0) {
                if ($styleItem !== false) {
                    $styleItem->styleTab = $styleTab++;
                    $data->STYLETABS[] = $styleItem;
                }
                $styleItem = new stdClass();
                $styleItem->STYLES = array();
            }
            $style->selected = $data->style == $style->directory ? 'ERSStyleSelected' : '';

            $styleItem->STYLES[] = $style;
            $styleNum++;
        }
        $styleItem->styleTab = $styleTab;
        $data->STYLETABS[] = $styleItem;

        $styles = call_user_func(array($this->stylesClass, 'getStyles'), $this->settings['customTemplates'], constant("$this->stylesClass::ISPRINT"));

        $data->printStyleDirectory = $this->settings['printStyle'];
        $styleNum = 0;
        $styleTab = 1;
        $styleItem = false;
        $data->PRINTSTYLETABS = array();
        foreach ($styles as $style) {
            if ($styleNum % 3 == 0) {
                if ($styleItem !== false) {
                    $styleItem->styleTab = $styleTab++;
                    $data->PRINTSTYLETABS[] = $styleItem;
                }
                $styleItem = new stdClass();
                $styleItem->PRINTSTYLES = array();
            }
            $style->selected = $data->printStyle == $style->directory ? 'ERSStyleSelected' : '';
            $styleItem->PRINTSTYLES[] = $style;
            $styleNum++;
        }
        $styleItem->styleTab = $styleTab;
        $data->PRINTSTYLETABS[] = $styleItem;

        $data->optionsHTML = $optionsHTML;

        $data->customTemplates = $this->settings['customTemplates'];


        /*
         * We need to preserve whitespace on this template because newlines in the the textareas are significant
        */

        $template = new $this->templateClass(WP_PLUGIN_DIR . "/$this->pluginName/templates/easyrecipe-settings.html", constant("$this->templateClass::PAGE"), true);
        $html = $template->replace($data, constant("$this->templateClass::PRESERVEWHITESPACE"));
        echo $html;

        $data = new stdClass();
        $data->easyrecipeURL = $this->easyrecipeURL;
        $template = new $this->templateClass("$this->easyrecipeDIR/templates/easyrecipe-upgrade.html");
        echo $template->replace($data);

    }

    public function getLabels($data) {
        foreach ($this->settings as $key => $value) {
            if (strncmp($key, 'lbl', 3) === 0) {
                $data->$key = $value;
            }
        }
    }

    /**
     * This gets called when both the free and Plus versions of EasyRecipe are active
     */
    function bothActive() {
        $msg = __('EasyRecipe Plus is installed and active - congratulations!  You should deactive and delete the free version before continuing');
        echo "<div class=\"error\"><p>$msg</p></div>";
    }

    /**
     * Merge current version 2 settings into the version 3 defaults and convert the settings that got changed
     *
     * @param array $current
     *            The current V2 settings
     */
    public function mergeV2($current = array()) {
        /*
        * Replace defaults with any matching current V2 values
        */
        foreach ($this->defaultSettings as $key => $value) {
            $this->settings[$key] = isset($current[$key]) ? $current[$key] : $value;
        }

        /*
        * Set the V2 Legacy styles
        */
        $this->settings['style'] = 'style000';
        $this->settings['printStyle'] = 'style000';

        /*
        * Handle the settings keys that changed or got added
        */

        if (isset($current['ingredientHead'])) {
            $this->settings['lblIngredients'] = $current['ingredientHead'];
        }
        if (isset($current['instructionHead'])) {
            $this->settings['lblInstructions'] = $current['instructionHead'];
        }

        if (isset($current['notesHead'])) {
            $this->settings['lblNotes'] = $current['notesHead'];
        }
//        $this->settings['lblNutrition'] = 'Nutrition Information';
    }

    public function put($setting, $value) {
        $this->settings[$setting] = $value;
    }

    public function add() {
        add_option($this->settingsName, $this->settings);
    }

    public function update() {
        update_option($this->settingsName, $this->settings);
    }
}
