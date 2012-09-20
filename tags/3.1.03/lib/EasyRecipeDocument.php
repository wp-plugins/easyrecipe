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

if (!class_exists('EasyRecipeDOMDocument', false)) {
    require_once dirname(__FILE__) . '/EasyRecipeDOMDocument.php';
}

class EasyRecipeDocument extends EasyRecipeDOMDocument {
    public $isEasyRecipe = false;
    public $recipeVersion = 0;
    private $easyrecipeDiv;
    private $hasFractions = false;
    private $easyrecipes = array ();
    private $easyrecipesHTML = array ();
    private $postImage = false;
    const regexEasyRecipe = '/<div\s+class\s*=\s*["\'](?:[^>]*\s+)?easyrecipe[ \'"]/si';
    const regexDOCTYPE = '%^<!DOCTYPE.*?</head>\s*<body>\s*(.*?)</body>\s*</html>\s*%si';
    const regexTime = '/^(?:([0-9]+) *(?:hours|hour|hrs|hr|h))? *(?:([0-9]+) *(?:minutes|minute|mins|min|mns|mn|m))?$/i';
    const regexImg = '%<img ([^>]*?)/?>%si';
    const regexPhotoClass = '/class\s*=\s*["\'](?:[a-z0-9-_]+ )*?photo[ \'"]/si';
    
    /*@formatter:off */
    private $fractions = array (
        1 => array (2 => '&frac12;', 3 => '&#8531;', 4 => '&frac14;', 5 => '&#8533;', 6 => '&#8537;', 8 => '&#8539;'),
        2 => array (3 => '&#8532;'),
        3 => array (4 => '&frac34;'),
        4 => array (5 => '&#8536;'),
        5 => array (6 => '&#8538;', 8 => '&#8541;'),
        7 => array (8 => '&#8342;')
    );

    /*
     * @formatter:on
    */
    
    /**
     * If there's an EasyRecipe in the content, load the HTML and pre-process, else just return
     *
     * @param $content string
     *            The post content
     *            
     */
    public function __construct($content, $load = true) {
        /**
         * If there's no EasyRecipe, just return
         */
        if (!@preg_match(self::regexEasyRecipe, $content)) {
            return;
        }
        
        /**
         * Load the html - make sure we could parse it
         */
        parent::__construct($content, $load);
        
        if (!$this->isValid()) {
            return;
        }
        
        /**
         * Find the easyrecipe(s)
         */
        $this->easyrecipes = $this->getElementsByClassName('easyrecipe');
        
        /**
         * Sanity check - make sure we could actually find at least one
         */
        if (count($this->easyrecipes) == 0) {
            echo "<!-- ER COUNT = 0 -->\n";
            return;
        }
        
        /**
         * This is a valid easyrecipe post
         * Find a version number - the version will be the same for every recipe in a multi recipe post so just get the first
         */
        $this->isEasyRecipe = true;
        
        $node = $this->getElementByClassName("endeasyrecipe", "div", $this->easyrecipes[0], false);
        
        $this->recipeVersion = $node->nodeValue;
    }

    /**
     * Process the shotcodes.
     * Called as the preg_replace callback
     *
     * @param $match array
     *            The match array returned by the regex
     * @return string The replacement code, or the original complete match if we don't recognise the shortcode
     */
    private function shortCodes($match) {
        switch ($match[1]) {
            case "i" :
                return "<em>{$match[2]}</em>";
            
            case "b" :
                return "<strong>{$match[2]}</strong>";
            
            case "img" :
                return "<img {$match[2]} />";
            
            case "url" :
                return "<a {$match[2]}>{$match[3]}</a>";
        }
        return $match[0];
    }

    /**
     * The original ER template didn't explicitly identify by class the individual
     * labels for various significant tags, just the tags themselves.
     * This method modifies the labels for those tags
     *
     * @param $className string
     *            The class of the tag
     * @param $value string
     *            The text value to set for the label (which will be the parent of $className)
     * @param $currentValue string
     *            The value to replace
     */
    public function setParentValueByClassName($className, $value, $currentValue = "") {
        $nodes = $this->getElementsByClassName($className);
        for ($i = 0; $i < count($nodes); $i++) {
            $nodes[$i] = $nodes[$i]->parentNode;
        }
        for ($i = 0; $i < count($nodes); $i++) {
            $v = $nodes[$i]->nodeValue;
            $v = $nodes[$i]->firstChild->nodeValue;
            if ($currentValue == "") {
                $nodes[$i]->nodeValue = $value;
            } else {
                if (preg_match("/^$currentValue(.*)$/", $nodes[$i]->firstChild->nodeValue, $regs)) {
                    $nodes[$i]->firstChild->nodeValue = $value . $regs[1];
                }
            }
        }
    }

    /**
     * Sets the URL in the print button <a> tag href
     *
     * Later versions of tinyMCE may silently remove the <a> tag altogether, so we need to put it back if it's not there
     *
     * @param $url string
     *            The print URL
     */
    
    /**
     *
     * @param $url string
     *            The post's URL
     * @param $formatting boolean
     *            If TRUE, we're an admin so add the option to set the formatting
     */
    function formatRecipe($recipe, $template, $data, $nRecipe = 0) {
        $data = $this->extractData($recipe, $data, $nRecipe);
        $html = $template->replace($data);
        

        /**
         * Convert fractions if asked to
         */
        if ($data->convertFractions) {
            $html = preg_replace_callback('%(. |^|>)([1-457])/([2-68])([^\d]|$)%', array ($this, 'convertFractionsCallback'), $html);
        }
        
        /**
         * Handle our own shortcodes because Wordpress's braindead implementation can't handle consecutive shortcodes (!)
         *
         * Do a simple string replace for breaks
         */
        $html = str_replace("[br]", "<br />", $html);
        
        /**
         * There's probably a really smart regex that could handle everything at once but
         * it's much easier and more robust to handle the cases separately.
         * WP does it in one regex - but then WP's implementation doesn't actually work
         * Don't bother with the regex's if there's no need - saves a few cycles
         */
        if (strpos($html, "[") !== false) {
            $html = preg_replace_callback('%\[(i|b)\](.*?)\[/\1\]%si', array ($this, "shortCodes"), $html);
            $html = preg_replace_callback('%\[(img) +(.*?) */?\]%i', array ($this, "shortCodes"), $html);
            $html = preg_replace_callback('%\[(url) +([^\]]+?)\](.*?)\[/url\]%si', array ($this, "shortCodes"), $html);
        }
        
        /**
         * Remove leftover template comments and then remove linebreaks and blank lines so wpauto() doesn't mangle the HTML
         */
        
        $html = preg_replace('/<!-- .*? -->/', '', $html);
        $lines = explode("\n", $html);
        $html = '';
        foreach ($lines as $line) {
            if (($trimmed = trim($line)) != '') {
                $html .= "$trimmed ";
            }
        }
        
        return $html;
    }

    /**
     * Replaces the raw easyrecipe(s) with the formatted version
     *
     * @param $template EasyRecipePlusTemplate
     *            The template to use
     * @param $data Object
     *            The base data
     */
    function applyStyle(EasyRecipeTemplate $template, $data, $recipe = null) {
        $nRecipe = 0;
        $recipes = ($recipe == null) ? $this->easyrecipes : array ($recipe);
        foreach ($recipes as $recipe) {
            $this->easyrecipesHTML[$nRecipe] = trim($this->formatRecipe($recipe, $template, $data, $nRecipe));
            $placeHolder = $this->createElement("div");
            $placeHolder->setAttribute("id", "_easyrecipe_" . $nRecipe);
            

            try {
                $recipe->parentNode->replaceChild($placeHolder, $recipe);
            } catch (Exception $e) {
            }
            
            $nRecipe++;
        }
        
        $html = $this->getHTML();
        

        for ($i = 0; $i < $nRecipe; $i++) {
            $html = str_replace("<div id=\"_easyrecipe_$i\"></div>", $this->easyrecipesHTML[$i], $html);
        }
        return $html;
    }

    /**
     * Find the first <img> in $html and add the class name "photo" to it
     *
     * If no <img> is found, returns false
     *
     * @param $html string
     *            The html to search
     * @return boolean/string The adjusted html if an <img> was found, else false
     */
    private function makePhotoClass($html) {
        if (!@preg_match('/^(.*?)<img ([^>]+>)(.*)$/si', $html, $regs)) {
            return false;
        }
        $preamble = $regs[1];
        $imgTag = $regs[2];
        $postscript = $regs[3];
        /*
       * If there's no "class", add one else add "photo" to the existing one
       * Don't bother checking if "photo" already exists if there's an existing class
       */
        if (@preg_match('/^(.*)class="([^"]*".*)$/si', $imgTag, $regs)) {
            $imgTag = "<img " . $regs[1] . 'class="photo ' . $regs[2];
        } else {
            $imgTag = '<img class="photo" ' . $imgTag;
        }
        /*
       * Re-assemble the content
       */
        return "$preamble$imgTag$postscript";
    }

    /**
     * Add the "photo" class name to the first image in the html inside or outside the EasyRecipe
     * Check first to see if there is already an image anywhere in the post with the "photo" class
     */
    public function addPhotoClass() {
        /*
       * Check to see if there's an image anywhere in the post that already has a photo class
       */
        @preg_match_all(self::regexImg, $this->preEasyRecipe, $result, PREG_PATTERN_ORDER);
        foreach ($result[1] as $img) {
            if (preg_match(self::regexPhotoClass, $img)) {
                return;
            }
        }
        
        @preg_match_all(self::regexImg, $this->postEasyRecipe, $result, PREG_PATTERN_ORDER);
        foreach ($result[1] as $img) {
            if (preg_match(self::regexPhotoClass, $img)) {
                return;
            }
        }
        
        // if (@preg_match(self::regexPhotoClass, $this->preEasyRecipe)) {
        // return;
        // }
        // if (@preg_match(self::regexPhotoClass, $this->postEasyRecipe)) {
        // return;
        // }
        $photo = $this->getElementsByClassName("photo", "img");
        if (count($photo) > 0) {
            return;
        }
        /*
       * Search for the first image and if there is one, add the photo class to it
       */
        $html = $this->makePhotoClass($this->preEasyRecipe);
        if ($html !== false) {
            $this->preEasyRecipe = $html;
        } else {
            $photos = $this->getElementsByTagName("img");
            if ($photos && $photos->length > 0) {
                $this->addClass($photos->item(0), "photo");
            } else {
                $html = $this->makePhotoClass($this->postEasyRecipe);
                if ($html !== false) {
                    $this->postEasyRecipe = $html;
                }
            }
        }
    }

    /**
     * WP 3.2.1 had a version of tinyMCE that removes without warning perfectly valid HTML which resolved to whitespace
     * (What do they think that "class" stuff is in there for???)
     *
     * This repairs the value-title classes necessary for times
     */
    function fixTimes($timeElement) {
        foreach ($this->easyrecipes as $recipe) {
            $node = $this->getElementByClassName($timeElement, "span", $recipe);
            if (!$node || is_array($node)) {
                continue;
            }
            
            $hasNode = false;
            $h = $m = 0;
            for ($child = $node->firstChild; $child; $child = $child->nextSibling) {
                if ($child->nodeName == "#text") {
                    if (preg_match('/(?:([0-9]+) *hours?)?(?: *([0-9]+) *min)?/i', $node->nodeValue, $regs)) {
                        $h = $regs[1];
                        $m = isset($regs[2]) ? $regs[2] : 0;
                    }
                } else if ($child->nodeName == "span") {
                    if ($child->getAttribute("class") == "value-title") {
                        $hasNode = true;
                        break;
                    }
                }
            }
            
            if (!$hasNode) {
                $valueElement = new DOMElement('span', ' ');
                $node->appendChild($valueElement);
                $valueElement->setAttribute("class", "value-title");
                $ISOTime = "PT";
                if ($h > 0) {
                    $ISOTime .= $h . "H";
                }
                if ($m > 0) {
                    $ISOTime .= $m . "M";
                }
                
                $valueElement->setAttribute("title", $ISOTime);
            }
        }
    }

    private function convertFractionsCallback($match) {
        if (isset($this->fractions[$match[2]][$match[3]])) {
            $pre = $match[1] != '' && is_numeric($match[1][0]) ? $match[1][0] : $match[1];
            return $pre . $this->fractions[$match[2]][$match[3]] . $match[4];
        }
        return $match[1] . $match[2] . '/' . $match[3] . $match[4];
    }

    /**
     * Get the processed html for the post.
     * Needs to remove the extra stuff saveHTML adds
     * The rtrim is needed because pcre regex's can't pick up repeated spaces after repeated "any character" 
     * 
     * @return string The processed post html
     *        
     * TODO - standardise the way body only is done!
     */
    public function getHTML($bodyOnly = false) {
        $html = $this->saveHTML();
        return rtrim(preg_replace(self::regexDOCTYPE, '$1', $html));
    }

    public static function getPrintRecipe($content) {
        if (!@preg_match(self::regexEasyRecipe, $content, $regs)) {
            return "";
        }
        return $regs[3];
    }

    function getPostVersion() {
        return $this->getElementValueByClassName("endeasyrecipe", "div");
    }

    private function getISOTime($t) {
        if (!preg_match(self::regexTime, $t, $regs)) {
            return false;
        }
        $hr = isset($regs[1]) ? (int) $regs[1] : 0;
        $mn = isset($regs[2]) ? (int) $regs[2] : 0;
        $duration = $hr * 60 + $mn;
        $shr = $hr > 0 ? $hr . "H" : "";
        $smn = $mn > 0 ? $mn . "M" : "";
        return "PT$shr$smn";
    }

    function getRecipe($nRecipe = 0) {
        return $this->easyrecipes[$nRecipe];
    }

    function findPhotoURL($recipe) {
        $v = $this->recipeVersion;
        if ($this->recipeVersion < '3') {
            $photoURL = $this->getElementAttributeByClassName('photo', 'src');
            if (!$photoURL) {
                $images = $this->getElementsByTagName("img");
                if ($images->length > 0) {
                    $photoURL = $images->item(0)->getAttribute('src');
                }
            }
        } else {
            $photoURL = $this->getElementAttributeByTagName('link', 'href', "itemprop", 'image', $recipe);
        }
        return $photoURL;
    }

    function extractData($recipe, $data, $nRecipe = 0) {
        $photoURL = $this->findPhotoURL($recipe);
        if ($photoURL) {
            $data->hasPhoto = true;
            $data->photoURL = $photoURL;
        }
        $data->recipeIX = $nRecipe;
        // FIXME - IMPORTANT!! - don't rely on tags!! No gaurantee that templates will use a particular tag for anything
        $data->version = $this->recipeVersion;
        
        $data->name = $this->getElementValueByClassName("ERName", "span", $recipe);
        $data->cuisine = $this->getElementValueByClassName("cuisine", "span", $recipe);
        
        $data->type = $this->getElementValueByClassName("type", "span", $recipe);
        // FIXME - oops for OC
        if (!$data->type) {
            $data->type = $this->getElementValueByClassName("tag", "span", $recipe);
        }
        $data->author = $this->getElementValueByClassName("author", "span", $recipe);
        
        if ($this->recipeVersion < '3') {
            $data->preptime = $this->getElementValueByClassName("preptime", "span", $recipe);
            $data->cooktime = $this->getElementValueByClassName("cooktime", "span", $recipe);
            $data->totaltime = $this->getElementValueByClassName("duration", "span", $recipe);
        } else {
            $data->preptime = $this->getElementValueByProperty('time', 'itemprop', 'prepTime');
            $data->cooktime = $this->getElementValueByProperty('time', 'itemprop', 'cookTime');
            $data->totaltime = $this->getElementValueByProperty('time', 'itemprop', 'totalTime');
        }
        
        $data->preptimeISO = $this->getISOTime($data->preptime);
        $data->cooktimeISO = $this->getISOTime($data->cooktime);
        $data->totaltimeISO = $this->getISOTime($data->totaltime);
        $data->yield = $this->getElementValueByClassName("yield", "span", $recipe);
        $data->summary = $this->getElementValueByClassName("summary", "span", $recipe);
        
        $data->servingSize = $this->getElementValueByClassName("servingSize", "span", $recipe);
        $data->calories = $this->getElementValueByClassName("calories", "span", $recipe);
        $data->fat = $this->getElementValueByClassName("fat", "span", $recipe);
        $data->saturatedFat = $this->getElementValueByClassName("saturatedFat", "span", $recipe);
        $data->unsaturatedFat = $this->getElementValueByClassName("unsaturatedFat", "span", $recipe);
        $data->transFat = $this->getElementValueByClassName("transFat", "span", $recipe);
        $data->carbohydrates = $this->getElementValueByClassName("carbohydrates", "span", $recipe);
        $data->sugar = $this->getElementValueByClassName("sugar", "span", $recipe);
        $data->sodium = $this->getElementValueByClassName("sodium", "span", $recipe);
        $data->fiber = $this->getElementValueByClassName("fiber", "span", $recipe);
        $data->protein = $this->getElementValueByClassName("protein", "span", $recipe);
        $data->cholesterol = $this->getElementValueByClassName("cholesterol", "span", $recipe);
        $data->hasNutrition = $data->servingSize || $data->calories || $data->fat || $data->saturatedFat || $data->unsaturatedFat || $data->carbohydrates || $data->sugar || $data->fiber || $data->protein || $data->cholesterol || $data->sodium || $data->transFat;
        
        $data->notes = $this->getElementValueByClassName("ERNotes", "div", $recipe);
        
        $data->INGREDIENTSECTIONS = array ();
        $section = null;
        // $ingredientsList = $this->getElementByClassName('ingredients', 'ul', $recipe);
        $ingredientsLists = $this->getElementsByClassName('ingredients', 'ul', $recipe);
        
        foreach ($ingredientsLists as $ingredientsList) {
            $ingredients = $this->getElementsByClassName("ingredient|ERSeparator", "*", $ingredientsList);
            
            foreach ($ingredients as $ingredient) {
                $hasHeading = $this->hasClass($ingredient, 'ERSeparator');
                if ($hasHeading || $section == null) {
                    if ($section != null) {
                        $data->INGREDIENTSECTIONS[] = $section;
                    }
                    $section = new stdClass();
                    $section->INGREDIENTS = array ();
                    if ($hasHeading) {
                        $section->heading = $ingredient->nodeValue;
                        continue;
                    }
                }
                $item = new stdClass();
                $item->ingredient = $ingredient->nodeValue;
                $item->isImage = preg_match('/^\s*(?:\[[^]]+\])*\s*\[img /i', $ingredient->nodeValue) != 0;
                $section->INGREDIENTS[] = $item;
            }
        }
        // TODO what if NO ingredients
        $data->INGREDIENTSECTIONS[] = $section;
        
        $data->INSTRUCTIONSTEPS = array ();
        $section = null;
        $instructionsList = $this->getElementByClassName('instructions', 'div', $recipe);
        $instructions = $this->getElementsByClassName("instruction|ERSeparator", "*", $instructionsList);
        foreach ($instructions as $instruction) {
            $hasHeading = $this->hasClass($instruction, 'ERSeparator');
            if ($hasHeading || $section == null) {
                if ($section != null) {
                    $data->INSTRUCTIONSTEPS[] = $section;
                }
                $section = new stdClass();
                $section->INSTRUCTIONS = array ();
                if ($hasHeading) {
                    $section->heading = $instruction->nodeValue;
                    continue;
                }
            }
            $item = new stdClass();
            $item->instruction = $instruction->nodeValue;
            $item->isImage = preg_match('/^\s*(?:\[[^]]+\])*\s*\[img /i', $instruction->nodeValue) != 0;
            $section->INSTRUCTIONS[] = $item;
        }
        // FIXME - allow for NO instructions
        $data->INSTRUCTIONSTEPS[] = $section;
        
        return $data;
    }

    /**
     * Strips wrappers around recipes that the entry javascript added to enable inserting lines before and after a recipe
     *
     * @return string The post content with the wrappers stripped out or null if there were errors
     */
    function stripWrappers() {
        $wrappers = $this->getElementsByClassName("easyrecipeWrapper");
        foreach ($wrappers as $wrapper) {
            /*
             * First take out possible "above" and "below" divs
             */
            $nodes = $this->getElementsByClassName("easyrecipeAbove", "div", $wrapper);
            foreach ($nodes as $node) {
                try {
                    $wrapper->removeChild($node);
                } catch (Exception $e) {
                    return null;
                }
            }
            $nodes = $this->getElementsByClassName("easyrecipeBelow", "div", $wrapper);
            foreach ($nodes as $node) {
                try {
                    $wrapper->removeChild($node);
                } catch (Exception $e) {
                    return null;
                }
            }
            /*
             * Then insert the recipe itself into the DOM just above the wrapper
             */
            $recipe = $this->getElementByClassName("easyrecipe", "div", $wrapper);
            try {
                $wrapper->parentNode->insertBefore($recipe, $wrapper);
            } catch (Exception $e) {
                return null;
            }
            
            /*
             * Finally remove the wrapper itself
             */
            try {
                $wrapper->parentNode->removeChild($wrapper);
            } catch (Exception $e) {
                return null;
            }
        }
        return $this->getHTML(true);
    }
}


?>