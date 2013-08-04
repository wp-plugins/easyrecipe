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


/**
 * Class EasyRecipeSettings
 *
 * On the first run, we create an instance and use the defaults.
 * The Plus version reads and merges the Free version's settings (if they exist) and merges them into the Plus defaults
 *
 * The entire class is saved to options, and after the first run, the class is directly instantiated by unserializing the options
 *
 * TODO - remove "@property" when Gravity Forms implemented
 * @property mixed gpUseGravity
 */
class EasyRecipeSettings {

    private static $defaultSettings = array(

        'licenseKey' => '',

        'style' => 'style001', 'printStyle' => 'style001',

        'customCSS' => '', 'customPrintCSS' => '', 'extraCSS' => '', 'extraPrintCSS' => '',

        'useFeaturedImage' => false,

        'displayPrint' => true, 'allowLink' => false, 'convertFractions' => true, 'removeMicroformat' => false,

        'enableSwoop' => false, 'swoopSiteID' => '',

        'saveButton' => 'None', 'ziplistPartnerKey' => '', 'saltyfigPartnerKey' => '',

        'author' => '',

        'cuisines' => 'African|American|French|Greek|Indian|Italian|Kosher|Mexican|Middle Eastern|Spanish',

        'recipeTypes' => 'Appetiser|Breakfast|Brunch|Dessert|Drinks|Entree|Main',

        'ratings' => 'EasyRecipe',

        'lblIngredients' => 'Ingredients', 'lblInstructions' => 'Instructions', 'lblNotes' => 'Notes', 'lblNutrition' => 'Nutrition Information', 'lblAuthor' => 'Author', 'lblCuisine' => 'Cuisine',
        'lblRecipeType' => 'Recipe type', 'lblPrepTime' => 'Prep time', 'lblCookTime' => 'Cook time', 'lblTotalTime' => 'Total time', 'lblServes' => 'Serves', 'lblServeSize' => 'Serving size',
        'lblCalories' => 'Calories', 'lblSugar' => 'Sugar', 'lblSodium' => 'Sodium', 'lblFat' => 'Fat', 'lblSatFat' => 'Saturated fat', 'lblUnsatFat' => 'Unsaturated fat',
        'lblTransFat' => 'Trans fat', 'lblCarbs' => 'Carbohydrates', 'lblFiber' => 'Fiber', 'lblProtein' => 'Protein', 'lblCholesterol' => 'Cholesterol', 'lblRateRecipe' => 'Rate this recipe',

        'lblHour' => 'hour',
        'lblHours' => 'hours',
        'lblMinute' => 'min',
        'lblMinutes' => 'mins',

        'lblPrint' => 'Print',
        'lblSave' => 'Save',

        'gpUserID' => 0,
        'gpDetailsPage' => 0,
        'gpEntryPage' => 0,
        'gpThanksPage' => 0,
        'gpHideFooter' => true,


        'lblGPName' => 'Name:',
        'lblGPEmail' => 'Email:',
        'lblGPWebsite' => 'Website URL:',
        'lblGPContinue' => 'Continue',
        'lblGPPostTitle' => 'Post title:',
        'lblGPHint' => "Hint: Click on the chef's hat icon to enter the recipe part of your post:",
        'lblGPMessage' => 'Leave me a private message (not for publication):',
        'lblGPSubmitPost' => 'Submit Post',

        'erSubscribe' => false,
        'erEmailAddress' => '',
        'erFirstName' => '',

        'customTemplates' => '',

        'forcejQuery' => false,

        'enableFooderific' => '',
        'fooderificAPIKey' => '',
        'lastScanStarted' => 0,
        'lastScanFinished' => 0,
        'scanDelay' => 3,

        'pluginVersion' => '');


    public $licenseKey;
    public $style;
    public $printStyle;
    public $customCSS;
    public $customPrintCSS;
    public $extraCSS;
    public $extraPrintCSS;
    public $displayPrint;
    public $allowLink;

    public $useFeaturedImage;

    public $convertFractions;
    public $removeMicroformat;
//    public $pingMBRB;
    public $enableSwoop;
    public $swoopSiteID;
    public $saveButton;
    public $ziplistPartnerKey;
    public $saltyfigPartnerKey;
    public $author;
    public $cuisines;
    public $recipeTypes;
    public $ratings;
    public $lblIngredients;
    public $lblInstructions;
    public $lblNotes;
    public $lblNutrition;
    public $lblAuthor;
    public $lblCuisine;
    public $lblRecipeType;
    public $lblPrepTime;
    public $lblCookTime;
    public $lblTotalTime;
    public $lblServes;
    public $lblServeSize;
    public $lblCalories;
    public $lblSugar;
    public $lblSodium;
    public $lblFat;
    public $lblSatFat;
    public $lblUnsatFat;
    public $lblTransFat;
    public $lblCarbs;
    public $lblFiber;
    public $lblProtein;
    public $lblCholesterol;
    public $lblRateRecipe;
    public $lblPrint;
    public $lblSave;

    public $lblHour;
    public $lblHours;
    public $lblMinute;
    public $lblMinutes;

    public $gpUserID;
    public $gpCopyDetails;

    public $gpDetailsPage;
    public $gpEntryPage;
    public $gpThanksPage;
    public $gpHideFooter;

    public $lblGPName;
    public $lblGPEmail;
    public $lblGPWebsite;
    public $lblGPContinue;
    public $lblGPPostTitle;
    public $lblGPHint;
    public $lblGPMessage;
    public $lblGPSubmitPost;

    public $erSubscribe;
    public $erEmailAddress;
    public $erFirstName;
    public $customTemplates;
    public $forcejQuery;
    public $enableFooderific;
    public $lastScanStarted;
    public $lastScanFinished;
    public $scanDelay;
    public $fooderificAPIKey;
    public $pluginVersion;


     /**
     * @var EasyRecipeSettings
     */
    private static $instance;


    /**
     * @static
     * @return EasyRecipeSettings
     */
    static function getInstance() {
        $v32Settings = false;
        $updateOptions = false;

        /**
         * If we haven't already instantiated settings, try to do it from the options
         */
        if (!self::$instance) {
            self::$instance = get_option('EasyRecipe', false);
            /**
             * If there were no settings stored, see if we need to merge older style settings
             */
            if (!self::$instance) {
                self::$instance = new EasyRecipeSettings();
                /**
                 * See if we had existing 3.1 style settings
                 */
                $v32Settings = get_option('ERPlusSettings');
                if (!$v32Settings) {
                    $v32Settings = get_option('ERSettings');
                }
            }
            /**
             * Set any defaults which are new in the current version
             */
            foreach (self::$defaultSettings as $setting => $default) {
                if (!isset(self::$instance->$setting)) {
                    self::$instance->$setting = $default;
                }
            }

            /**
             * Check for a non-existent Fooderific setting and pick up the old MBRB setting if that's there
             */
            if (self::$instance->enableFooderific === '' && $v32Settings) {
                self::$instance->enableFooderific = isset($v32Settings['pingMBRB']) ? $v32Settings['pingMBRB'] : false;
                $updateOptions = true;
            }

            /**
             * If we're updating from v3.2, copy those settings which are still relevant
             * Any not set by the default above are deprecated and we can drop them
             */
            if ($v32Settings) {
                foreach ($v32Settings as $setting => $value) {
                    if (isset(self::$instance->$setting)) {
                        self::$instance->$setting = $value;
                    }
                }
                $updateOptions = true;
            }

            if ($updateOptions) {
                update_option('EasyRecipe', self::$instance);
            }
        }
        return self::$instance;
    }

    /**
     * Constructor is only ever called from getInstance
     */
    private function __construct() {
        foreach (self::$defaultSettings as $setting => $default) {
            $this->{$setting} = $default;
        }
    }

    public function showPage() {
        if (isset($_POST['action']) && $_POST['action'] == 'save') {
            $this->save($_POST["EasyRecipe"]);
        }

        $data = new stdClass();
        foreach (self::$defaultSettings as $setting => $default) {
            $data->{$setting} = isset($this->{$setting}) ? $this->{$setting} : $default;
        }

        $data->settingsname = "EasyRecipe";

        $data->wpurl = get_bloginfo("wpurl");
        $data->fdsite = preg_replace('%^(?:http://)(.*)$%i', '$1', $data->wpurl);
//        $data->fdsiteurl = htmlentities($data->wpurl);
        $data->editURL = "$data->wpurl/wp-admin/edit.php";
        $data->pluginversion = '3.2.1255';
        $data->license = $this->licenseKey;

        $data->useFeaturedImageChecked = $this->useFeaturedImage ? 'checked="checked"' : '';
        $data->displayPrintChecked = $this->displayPrint ? 'checked="checked"' : '';
        $data->allowLinkChecked = $this->allowLink ? 'checked="checked"' : '';
        $data->convertFractionsChecked = $this->convertFractions ? 'checked="checked"' : '';
        $data->removeMFChecked = $this->removeMicroformat ? 'checked="checked"' : '';
        $data->fdLinkChecked = $this->enableFooderific ? 'checked="checked"' : '';
        $data->enableSwoopChecked = $this->enableSwoop ? 'checked="checked"' : '';
        $data->swoopclass = $this->enableSwoop ? '' : 'ERSNoSwoop';
        $data->forcejQueryChecked = $this->forcejQuery ? 'checked="checked"' : '';

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
        $ratingChecked = "rating" . $this->ratings . "Checked";
        $data->{$ratingChecked} = 'checked="checked"';
        $data->erSubscribeChecked = $this->erSubscribe ? 'checked="checked"' : '';
        $data->subscribeclass = $this->erSubscribe ? '' : 'ERSNoSubscribe';

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
        /** @noinspection PhpParamsInspection */
        $data->swoopqs = http_build_query($swoopData);

        $data->easyrecipeURL = EasyRecipe::$EasyRecipeURL;
        $data->siteurl = get_site_url();

        $data->erplus = '';
        $data->author = $this->author;
        $data->cuisines = str_replace('|', "\n", $this->cuisines);
        $data->recipeTypes = str_replace('|', "\n", $this->recipeTypes);
        $data->plus = "EasyRecipe" == "easyrecipeplus" ? "Plus" : "";
        $data->pluginName = "EasyRecipe";
        $optionsHTML = "<input type='hidden' name='option_page' value='EROptionSettings' />";
        $optionsHTML .= '<input type="hidden" name="action" value="update" />';
        $optionsHTML .= wp_nonce_field("EROptionSettings-options", '_wpnonce', true, false);
        $optionsHTML .= wp_referer_field(false);

        $styles = EasyRecipeStyles::getStyles($this->customTemplates);
//        $styles = call_user_func(array ($this->stylesClass, 'getStyles'), $this->settings['customTemplates']);

        $data->styleDirectory = $this->style;
        $styleNum = 0;
        $styleTab = 1;
        $styleItem = false;
        $data->STYLETABS = array();
        foreach ($styles as $style) {
            if ($styleNum % 3 == 0) {
                if ($styleItem !== false) {
                    /** @noinspection PhpUndefinedFieldInspection */
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

        $styles = EasyRecipeStyles::getStyles($this->customTemplates, EasyRecipeStyles::ISPRINT);
        //$styles = call_user_func(array ($this->stylesClass, 'getStyles'), $this->settings['customTemplates'], constant("$this->stylesClass::ISPRINT"));

        $data->printStyleDirectory = $this->printStyle;
        $styleNum = 0;
        $styleTab = 1;
        $styleItem = false;
        $data->PRINTSTYLETABS = array();
        foreach ($styles as $style) {
            if ($styleNum % 3 == 0) {
                if ($styleItem !== false) {
                    /** @noinspection PhpUndefinedFieldInspection */
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

        $data->customTemplates = $this->customTemplates;


        /**
         * Figure out what we need to display on the Fooderific tab
         *
         * If we had MBRB enabled but this is the first run, show the welcome (firstRun = true) and hide the "retrieving" splash
         * Otherwise, show the "retrieving" splash
         */
        $data->fdFirstRun = false;
        $data->fdNotEnabled = false;
        $data->fdAPIKey = $this->fooderificAPIKey;
        if (!$this->enableFooderific) {
            $data->fdNotEnabled = true;
            $data->retrieveclass = 'FDDisplayNone';
            $data->lastScan = 0;
        } else if ($this->lastScanStarted == 0) {
            $data->fdFirstRun = true;
            $data->retrieveclass = 'FDDisplayNone';
            $data->lastScan = 0;
        } else {
            $data->retrieveclass = '';
            $tzOffet = get_option('gmt_offset');
            $data->lastScan = date_i18n("j M y g:ia", $this->lastScanStarted + $tzOffet * 3600);
        }

        /*
         * We need to preserve whitespace on this template because newlines in the the textareas are significant
        */

        $template = new EasyRecipeTemplate(EasyRecipe::$EasyRecipeDir . "/templates/easyrecipe-settings.html");
        $html = $template->replace($data, EasyRecipeTemplate::PRESERVEWHITESPACE);

        echo $html;

        $data = new stdClass();
        $data->easyrecipeURL = EasyRecipe::$EasyRecipeURL;
        $template = new EasyRecipeTemplate(EasyRecipe::$EasyRecipeDir . "/templates/easyrecipe-upgrade.html");
        echo $template->replace($data);

    }

    /**
     * @param $data stdClass Updates $data with the current custrom label settings
     */
    public function getLabels($data) {
        foreach (self::$defaultSettings as $key => $nil) {
            if (strncmp($key, 'lbl', 3) === 0) {
                $data->$key = $this->$key;
            }
        }
    }

    /**
     * Save the settings
     * TODO check nonce?
     * @param $settings Array Key/value array of settings
     */
    public function save($settings) {
        if (!isset($settings)) {
            return;
        }

        foreach (self::$defaultSettings as $key => $value) {
            switch ($key) {
                case 'displayPrint' :
                case 'allowLink' :
                case 'useFeaturedImage' :
                case 'convertFractions' :
                case 'removeMicroformat' :
                case 'enableFooderific' :
                case 'enableSwoop' :
                case 'erSubscribe' :
                case 'gpHideFooter' :
//                case 'gpUseGravity' :
                case 'forcejQuery' :
                    $this->$key = isset($settings[$key]);
                    break;

                case 'cuisines' :
                case 'recipeTypes' :
                    /*
                    * Replace CRLF, CR with LF and implode
                    */
                    $values = isset($settings[$key]) ? preg_replace('/[\r\n]+/', "\n", trim($settings[$key])) : '';
                    $this->$key = str_replace('"', "&quot;", stripslashes(preg_replace('/ *\n+ */', '|', $values)));
                    break;

                case 'customCSS' :
                case 'customPrintCSS' :
                    break;

                case 'extraCSS' :
                case 'extraPrintCSS' :
                    $this->$key = trim($settings[$key]);
                    break;

                case 'erFirstName' :
                case 'erEmailAddress' :
                    $this->$key = str_replace('"', "&quot;", trim(stripslashes($settings[$key])));
                    break;

                default :
                    if (isset($settings[$key])) {
                        $this->$key = str_replace('"', "&quot;", trim(stripslashes($settings[$key])));
                    }
                    break;
            }

        }

        update_option('EasyRecipe', $this);
    }

    public function add() {
        add_option('EasyRecipe', $this);
    }

    public function update() {
        update_option('EasyRecipe', $this);
    }


}

