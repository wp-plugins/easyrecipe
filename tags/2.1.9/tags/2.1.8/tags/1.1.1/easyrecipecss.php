<?php

  $settings = get_option("ERSettings", array());
  $css = file_get_contents("easyrecipe.css");
  $css .= ".easyrecipe {  background-color : {$settings["recipeBackground"]}}";
  
  header("Content-Type: text/css");
  header("Content-Length: " . strlen($css));
  echo $css;
  exit;
?>
