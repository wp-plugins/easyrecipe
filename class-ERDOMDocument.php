<?php

  /**
   * EasyRecipe DOM class
   */
  class ERDOMDocument extends DOMDocument {

    public $isEasyRecipe = false;
    public $version;
    private $easyrecipeDiv;
    private $preEasyRecipe;
    private $postEasyRecipe;

    const regexEasyRecipe = '%^(.*?)(<div +class *= *["\']easyrecipe[^>]>(.*?)<div +class *= *[\'"]endeasyrecipe.*?</div>)(.*?)$%si';

    /**
     * If there's an Easy Recipe in the content, set up the class
     *
     * @param string $content  The post content
     *
     */
    public function __construct($content) {
      /*
       * If there's no Easy Recipe, just return
       */
      if (!@preg_match(self::regexEasyRecipe, $content, $regs)) {
        return;
      }
      /*
       * Found it - construct a DOMDocument
       */
      parent::__construct("1.0", "UTF-8");
      /*
       * Handle our own shortcodes because Wordpress's braindead implementation can't handle consecutive shortcodes (!)
       *
       * Do a simple string replace for breaks
       */
      $content = str_replace("[br]", "<br />", $regs[2]);

      /*
       * Don't bother with the regex's if there's no need - saves a few cycles
       * There's probably a really smart regex that could handle everything at once but
       * it's much easier and more robust to handle the cases separately.
       * WP does it in one regex - but then WP's implentation doesn't actually work
       */
      if (strpos($content, "[") !== false) {
        $content = preg_replace_callback('%\[(i|b)\](.*?)\[/\1\]%si', array($this, "shortCodes"), $content);
        $content = preg_replace_callback('/\[(img) +([^\]]+?)\]/si', array($this, "shortCodes"), $content);
        $content = preg_replace_callback('%\[(url) +([^\]]+?)\](.*?)\[/url\]%si', array($this, "shortCodes"), $content);
      }
      /*
       * Make sure we can parse it
       */

      if (!$this->loadHTML('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' . $content)) {
        return;
      }

      /*
       * Pick up the stuff before and after the recipe
       */
      $this->preEasyRecipe = $regs[1];
      $this->postEasyRecipe = $regs[4];

      /*
       * Get some stuff we'll use later
       */
      $this->isEasyRecipe = true;
      $this->easyrecipeDiv = $this->getElementByClassName("easyrecipe");
      $node = $this->getElementByClassName("endeasyrecipe", "div");
      $this->version = $node->nodeValue;
    }

    /**
     * Process the shotcodes.  Called as the preg_replace callback
     * @param array $match  The match array returned by the regex
     * @return string       The replacement code, or the original complete match if we don't recognise the shortcode
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
     * Get all elements that have a tag of $tag and class of $className
     *
     * @param string $className The class name to search for
     * @param string $tag       Tag of the items to search
     * @return array            Array of DOMNode items that match
     */
    public function getElementsByClassName($className, $tag="*") {
      $nodes = array();
      $domNodeList = $this->getElementsByTagName($tag);
      for ($i = 0; $i < $domNodeList->length; $i++) {
        $item = $domNodeList->item($i)->attributes->getNamedItem('class');
        if ($item) {
          $classes = explode(" ", $item->nodeValue);
          for ($j = 0; $j < count($classes); $j++) {
            if ($classes[$j] == $className) {
              $nodes[] = $domNodeList->item($i);
            }
          }
        }
      }
      return $nodes;
    }

    /**
     * Convenience method to return a single element by class name when we know there's only going to be one
     *
     * @param string $className The class name to search for
     * @param string $tag       Tag of the items to search
     * @return array            Array of DOMNode items that match
     */
    public function getElementByClassName($className, $tag="*") {
      $nodes = $this->getElementsByClassName($className, $tag);
      return count($nodes) == 1 ? $nodes[0] : $nodes;
    }

    /**
     * Sets or hides the rating divs
     *
     * @param int $totalRating  The total rating value
     * @param int $nRatings     The number of indicidual ratings
     */
    public function setRating($totalRating, $nRatings) {
      $outerDiv = $this->getElementByClassName("ERRatingOuter");
      if (!$outerDiv) {
        return;
      }
      if ($totalRating == 0) {
        try {
          $this->easyrecipeDiv->removeChild($outerDiv);
        } catch (Exception $e) {

        }
        return;
      }
      $ratingValue = $nRatings > 0 ? $totalRating / $nRatings : 0;
      $sRatingAverage = sprintf("%3.1f", $ratingValue);
      $width = floor($ratingValue * 20) . "%";

      $this->setValueByClassName("average", $sRatingAverage);
      $this->setValueByClassName("count", $nRatings);
      $innerDiv = $this->getElementsByClassName("ERRatingInner");

      $this->setStyle($innerDiv[0], "width", $width);
      $this->removeStyle($outerDiv, "display");
    }

    /**
     * Show or hide the linkback
     *
     * @param boolean $display  TRUE to show, or false to hide
     */
    public function setLinkback($display) {
      if ($display) {
        $this->removeStyle($this->getElementByClassName("ERLinkback"), "display");
      } else {
        $this->easyrecipeDiv->removeChild($this->getElementByClassName("ERLinkback"));
      }
    }

    /**
     * The original ER template didn't explicitly identify by class the individual
     * labels for various significant tags, just the tags themselves.
     * This method modifies the labels for those tags
     *
     * @param string $className   The class of the tag
     * @param string $value       The text value to set for the label (which will be the parent of $className)
     * @param string $currentValue The value to replace
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
     * Sets the text value for elements of class $className
     * The $currentValue both explicitly identifies an ambigous element, and the actual part of the text to be replaced by $value
     *
     * @param string $className     The class name of the element(s) to adjust
     * @param string $value         The value to set
     * @param string $currentValue  Disambiguator and also the part of the text that is to be replaced by $value
     */
    public function setValueByClassName($className, $value, $currentValue = "") {
      $nodes = $this->getElementsByClassName($className);
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
     * Gets the styles of $element as an associative array of style property/value pairs
     *
     * @param DOMElement $element The element for which to get the styles
     * @return array              An associative array of style property/values
     */
    public function getStyles(DOMElement $element) {
      $result = array();
      $styleString = $element->getAttribute("style");
      if ($styleString == "") {
        return $result;
      }
      $styles = explode(";", $styleString);
      for ($i = 0; $i < count($styles); $i++) {
        if ($styles[$i] != "") {
          $styleEntry = explode(":", $styles[$i]);
          $result[$styleEntry[0]] = $styleEntry[1];
        }
      }
      return $result;
    }

    /**
     * Set style property $style to $value on $element
     *
     * @param DOMElement $element The elemnt to set the style for
     * @param string  $style  The style property name
     * @param string  $value  The value to set
     */
    public function setStyle(DOMElement $element, $style, $value) {
      $styles = $this->getStyles($element);
      $styles[$style] = $value;
      $styleString = "";
      foreach ($styles AS $property => $value) {
        $styleString .= $property . ":" . $value . ";";
      }
      $element->setAttribute("style", rtrim($styleString, ";"));
    }

    /**
     * Remove $style from $element
     * @param DOMElement $element The elemnt to remove the style from
     * @param string $style The style property to remove
     */
    public function removeStyle(DOMElement $element, $style) {
      $styles = $this->getStyles($element);
      if (!isset($styles[$style])) {
        return;
      }
      unset($styles[$style]);
      $styleString = "";
      foreach ($styles AS $property => $value) {
        $styleString .= $property . ":" . $value . ";";
      }
      if ($styleString == "") {
        $element->removeAttribute("style");
      } else {
        $element->setAttribute("style", rtrim($styleString, ";"));
      }
    }

    /**
     * Sets the URL in the print button <a> tag href
     *
     * Later versions of tinyMCE may silently remove the <a> tag altogether, so we need to put it back if it's not there
     *
     * @param string $url The print URL
     */
    public function setPrintButton($url, $formatting) {
      if (strpos($url, "?") !== false) {
        $url .= "&erprint";
      } else {
        $url .= "?erprint";
      }
      if ($formatting) {
        $url .= "&erformat";
      }
      $node = $this->getElementByClassName("btnERPrint", "div");
      if (!$node) {
        return null;
      }
      for ($aNode = $node->firstChild; $aNode; $aNode = $n->nextSibling) {
        if ($aNode->nodeName == "a") {
          break;
        }
      }
      if (!$aNode) {
        $aNode = $this->createElement("a");
        $href = $this->createAttribute("href");
        $aNode->appendChild($href);
        $node->appendChild($aNode);
      }
      $aNode->setAttribute("href", $url);
      $this->removeStyle($node, "display");
      return $node;
    }

    /**
     * Find the first <img> in $html and add the class name "photo" to it
     *
     * If no <img> is found, returns false
     *
     * @param string $html    The html to search
     * @return boolean/string The adjusted html if an <img> was found, else false
     */
    private function makePhotoClass($html) {
      if (!@preg_match('/^(.*?)<img ([^>]+>)(.*)$/si', $this->preEasyRecipe, $regs)) {
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
     * Add the "photo" class name to the first image in the html outside the EasyRecipe
     */
    public function addPhotoClass() {
      $html = $this->makePhotoClass($this->preEasyRecipe);
      if ($html !== false) {
        $this->preEasyRecipe = $html;
      } else {
        $html = $this->makePhotoClass($this->postEasyRecipe);
        if ($html !== false) {
          $this->postEasyRecipe = $html;
        }
      }
    }

    /**
     * WP 3.2.1 has a version of tinyMCE that removes perfectly valid HTML that resolves to whitespace without warning
     * (What do they think that "class" stuff is in there for???)
     *
     * This repairs the value-title classes necessary for times
     */
    function fixTimes($timeElement) {
      $node = $this->getElementByClassName($timeElement, "span");
      if (is_array($node)) {
        return;
      }
      for ($child = $node->firstChild; $child; $child = $child->nextSibling) {
        if ($child->nodeName == "#text") {
          if (preg_match('/(?:([0-9]+) +hours?)?(?: +([0-9]+) +min)?/i', $node->nodeValue, $regs)) {
            $h = $regs[1];
            $m = isset($regs[2]) ? $regs[2] : 0;
          } else {
            $h = $m = 0;
          }
        }
        if ($child->nodeName == "span") {
          if ($child->getAttribute("class") == "value-title") {
            $hasValue = true;
            break;
          }
        }
      }
      if (!$hasValue) {
        $valueElement = new DOMElement('span', ' ');
        $node->appendChild($valueElement);
        $valueElement->setAttribute("class", "value-title");
        $ISOtime = "PT";
        if ($h > 0) {
          $ISOTime .= $h . "H";
        }
        if ($m > 0) {
          $ISOTime .= $m . "M";
        }

        $valueElement->setAttribute("title", $ISOTime);
      }
    }

    /**
     * Get the processed html for the post.  Needs to remove the extra stuff saveHTML adds, and wrap it in the original surrounding code
     *
     * @return string   The processed post html
     */
    public function getHTML() {
      $h = $this->saveHTML();

      preg_match(self::regexEasyRecipe, $this->saveHTML(), $regs);

      return $this->preEasyRecipe . $regs[2] . $this->postEasyRecipe;
    }

    public static function getPrintRecipe($content) {
      if (!@preg_match(self::regexEasyRecipe, $content, $regs)) {
        return "";
      }
      return $regs[3];
    }

    private function dumpNode($node, $offset = 0) {
      echo str_pad("", $offset) . $node->nodeName . " " . $node->nodeType . " " . $node->nodeValue . "\n";
      for ($n = $node->firstChild; $n; $n = $n->nextSibling) {
        $this->dumpNode($n, $offset + 2);
      }
    }

    public function dump($node = null) {
      echo "<pre>\n";
      $this->dumpNode($node ? $node : $this);
      echo "</pre>\n";
    }

  }

?>
