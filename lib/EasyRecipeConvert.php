<?php
/**
 * Handles conversions from other plugins
 */

class EasyRecipeConvert {

    private function yumprintTime($time) {
        $time = (int) $time;

        $minutes = $time % 60;
        $hours = floor(($time - $minutes) / 60);

        return sprintf("PT%dH%dM", $hours, $minutes);
    }

    /*
    * Return RecipeSEO/ZipList data/Yumprint/ReciPress
    */
    function convertRecipe() {
        /** @global $wpdb wpdb */
        global $wpdb;

        $id = (int) $_POST['id'];
        $result = new stdClass();

        switch ($_POST['type']) {

            case 'recipeseo`' :
                $result->recipe = $wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "amd_recipeseo_recipes WHERE recipe_id=" . $id);
                $ingredients = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "amd_recipeseo_ingredients WHERE recipe_id=" . $id . " ORDER BY ingredient_id");

                $result->ingredients = array();
                foreach ($ingredients as $ingredient) {
                    $result->ingredients[] = $ingredient->amount . " " . $ingredient->name;
                }
                break;

            case 'zlrecipe' :
                $result->recipe = $wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "amd_zlrecipe_recipes WHERE recipe_id=" . $id);
                $ingredients = explode("\n", str_replace('\r', "", $result->recipe->ingredients));
                $result->ingredients = array();
                foreach ($ingredients as $ingredient) {
                    $result->ingredients[] = $ingredient;
                }
                unset($result->recipe->ingredients);
                break;

            case 'recipress' :
                $meta = get_post_custom($id);
                $result->recipe = new stdClass();
                $result->ingredients = array();
                $result->recipe->instructions = '';
                /** @noinspection PhpUndefinedFunctionInspection */
                $size = recipress_options('instruction_image_size');

                $result->recipe->recipe_title = $meta['title'][0] ? $meta['title'][0] : '';
                $photo = wp_get_attachment_image_src($meta['photo'][0], 'thumbnail', false);
                $result->recipe->recipe_image = $photo ? $photo[0] : '';
                $result->recipe->summary = $meta['summary'][0] ? $meta['summary'][0] : '';
                $terms = get_the_terms($id, 'cuisine');
                $result->recipe->cuisine = $terms[0]->name;

                $terms = get_the_terms($id, 'course');
                $result->recipe->mealType = $terms[0]->name;

                /** @noinspection PhpUndefinedFunctionInspection */
                $result->recipe->cook_time = $meta['cook_time'][0] ? recipress_time($meta['cook_time'][0], 'iso') : '';
                /** @noinspection PhpUndefinedFunctionInspection */
                $result->recipe->prep_time = $meta['prep_time'][0] ? recipress_time($meta['prep_time'][0], 'iso') : '';

                $result->recipe->yield = $meta['yield'][0] ? $meta['yield'][0] : '';
                $result->recipe->serves = $meta['servings'][0] ? $meta['servings'][0] : '';

                $ingredients = $meta['ingredient'];
                $ingredients = unserialize($ingredients[0]);
                foreach ($ingredients as $ingredient) {
                    $newIngredient = $ingredient['amount'] . ' ' . $ingredient['measurement'] . ' ' . $ingredient['ingredient'];
                    if (!empty($ingredient['notes'])) {
                        $newIngredient .= ', ' . $ingredient['notes'];
                    }
                    $result->ingredients[] = trim(str_replace('  ', ' ', $newIngredient));
                }

                $instructions = $meta['instruction'];
                $instructions = unserialize($instructions[0]);
                foreach ($instructions as $instruction) {
                    $result->recipe->instructions .= $instruction['description'];
                    if (!empty($instruction['image'])) {
                        $result->recipe->instructions .= "[br]" . wp_get_attachment_image($instruction['image'], $size, false);
                        $result->recipe->instructions = str_replace('<', '[', $result->recipe->instructions);
                        $result->recipe->instructions = str_replace('>', ']', $result->recipe->instructions);
                    }
                    $result->recipe->instructions .= "\n";
                }
                break;
            /**
             * Make the Recipe Card data look like RecipeSEO/Ziplist - only because we already have the JS for those
             */
            case 'yumprint' :
                $post = $wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "yumprint_recipe_recipe WHERE id=" . $id);
                $nutrition = json_decode($post->nutrition);
                $result->recipe = json_decode($post->recipe);
                $result->recipe->recipe_title = $result->recipe->title;
                $result->recipe->recipe_image = $result->recipe->image;
                $result->ingredients = $result->recipe->ingredients[0]->lines;
                $result->recipe->instructions = implode("\n", $result->recipe->directions[0]->lines);
                $result->recipe->notes = implode("\n", $result->recipe->notes[0]->lines);

                $result->recipe->prep_time = $this->yumprintTime($result->recipe->prepTime);
                $result->recipe->cook_time = $this->yumprintTime($result->recipe->cookTime);

                $result->recipe->yield = $result->recipe->yields;
                $result->recipe->serving_size = $result->recipe->servings;

                $result->recipe->nutrition = $nutrition;

                $serves = $result->recipe->servings;
                $yields = $result->RCommentrecipe->yields;

                $unit = 1;
                if (!empty($serves)) {
                    $unit = $serves;
                } else if (!empty($yields)) {
                    $unit = $yields;
                }

                $div = !empty($unit) ? $unit : 1;

                /** @noinspection PhpUnusedLocalVariableInspection */
                foreach ($nutrition as $key => &$value) {
                    $value /= $div;
                }

                $nutrition->calories = round($nutrition->calories);
                $nutrition->totalFat = round($nutrition->totalFat) . 'g';
                $nutrition->saturatedFat = round($nutrition->saturatedFat) . 'g';
                $nutrition->transFat = round($nutrition->transFat) . 'g';
                $nutrition->polyunsaturatedFat = round($nutrition->polyunsaturatedFat);
                $nutrition->monounsaturatedFat = round($nutrition->monounsaturatedFat);
                $nutrition->unsaturatedFat = ($nutrition->polyunsaturatedFat + $nutrition->monounsaturatedFat) . 'g';

                $nutrition->cholesterol = round($nutrition->cholesterol) . 'mg';

                $nutrition->sodium = round($nutrition->sodium) . 'mg';
                $nutrition->totalCarbohydrates = round($nutrition->totalCarbohydrates) . 'g';
                $nutrition->dietaryFiber = round($nutrition->dietaryFiber) . 'g';
                $nutrition->sugars = round($nutrition->sugars) . 'g';
                $nutrition->protein = round($nutrition->protein) . 'g';


                unset($result->recipe->prepTime);
                unset($result->recipe->cookTime);
                unset($result->recipe->totalTime);
                unset($result->recipe->yields);
                unset($result->recipe->servings);

                unset($result->recipe->title);
                unset($result->recipe->image);
                unset($result->recipe->ingredients);
                unset($result->recipe->directions);
                break;

            /**
             * Get me cooking
             */
            case 'gmc' :
                /**
                 * If GMC is installed, use it to get ingredients, but turn off error reporting to stop it crashing
                 */
                if (function_exists('print_ingredient_description')) {
                    error_reporting(0);
                    $gmcInstalled = true;
                } else {
                    $gmcInstalled = false;
                }
                $result->recipe = new stdClass();

                $post = get_post($id);

                $result->recipe->recipe_title = html_entity_decode(get_the_title($id), ENT_COMPAT, 'UTF-8');
                $result->recipe->author = get_post_meta($id, 'gmc-source-name', true);
                $result->recipe->summary = get_post_meta($post->ID, "gmc-description", true);

                $thumbID = get_post_thumbnail_id($id);
                $postThumb = $thumbID != 0 ? wp_get_attachment_image_src($thumbID, 'medium') : '';
                if (!empty($postThumb)) {
                    $result->recipe->recipe_image = $postThumb[0];
                }
                $prepHour = (int) get_post_meta($id, "gmc-prep-time-hours", true);
                $prepMinute = (int) get_post_meta($id, "gmc-prep-time-mins", true);
                $cookHour = (int) get_post_meta($id, "gmc-cooking-time-hours", true);
                $cookMinute = (int) get_post_meta($id, "gmc-cooking-time-mins", true);
                $result->recipe->prep_time = "{$prepHour}H{$prepMinute}M";
                $result->recipe->cook_time = "{$cookHour}H{$cookMinute}M";

                $mealTypes = wp_get_object_terms($id, 'gmc_course');

                if (count($mealTypes) > 0) {
                    $result->recipe->mealType = $mealTypes[0]->name;
                }

                $regions = wp_get_object_terms($id, 'gmc_region');
                if (count($regions) > 0) {
                    $result->recipe->cuisine = $regions[0]->name;
                }

                $result->ingredients = array();
                $result->recipe->instructions = '';

                $steps = get_posts('post_status=publish&post_type=gmc_recipestep&nopaging=1&orderby=menu_order&order=ASC&post_parent=' . $id);
                /** @var $step WP_Post */
                foreach ($steps as $step) {
                    if (!empty($step->post_content)) {
                        $result->recipe->instructions .= $step->post_content . "\n";
                    }
                }
                $result->recipe->instructions = rtrim($result->recipe->instructions, "\n");
                $ingredients = get_posts('post_status=publish&post_type=gmc_recipeingredient&nopaging=1&orderby=menu_order&order=ASC&post_parent=' . $id);
                /** @var $ingredient WP_Post */
                foreach ($ingredients as $ingredient) {
                    if ($gmcInstalled) {
                        /** @noinspection PhpUndefinedFunctionInspection */
                        $iLine = trim(print_ingredient_description($ingredient));
                    } else {
                        $quantity = get_post_meta($ingredient->ID, "gmc-ingredientquantity", true);
                        $measurement = get_post_meta($ingredient->ID, 'gmc-ingredientmeasurement', true);
                        $title = $ingredient->post_title;
                        $iLine = trim("$quantity $measurement $title");
                    }
                    if (!empty($iLine)) {
                        $result->ingredients[] = $iLine;
                    }

                }

                $result->recipe->notes = strip_tags($post->post_content);
                $result->recipe->yield = $servings = get_post_meta($post->ID, "gmc-nr-servings", true);
                $nutrition = new stdClass();
                if (get_post_meta($id, "gmc_has_nutrition", true)) {

                    $result->recipe->serving_size = get_post_meta($post->ID, "gmc_gda_servings", true);
                    $nutrition->calories = get_post_meta($post->ID, "gmc_nutrition_kcal_serving", true);
                    if ($nutrition->calories != '') {
                        $nutrition->calories *= 1000;
                    }
                    $nutrition->totalFat = round(get_post_meta($post->ID, "gmc_nutrition_fat_total_serving", true)) . 'g';
                    $nutrition->saturatedFat = round(get_post_meta($post->ID, "gmc_nutrition_fat_sat_serving", true)) . 'g';
                    $nutrition->sodium = round(get_post_meta($post->ID, "gmc_nutrition_salt_sod_serving", true)) . 'mg';
                    $nutrition->totalCarbohydrates = round(get_post_meta($post->ID, "gmc_nutrition_carb_total_serving", true)) . 'g';
                    $nutrition->dietaryFiber = round(get_post_meta($post->ID, "gmc_nutrition_fibre_serving", true)) . 'g';
                    $nutrition->sugars = round(get_post_meta($post->ID, "gmc_nutrition_carb_sugar_serving", true)) . 'g';
                    $nutrition->protein = round(get_post_meta($post->ID, "gmc_nutrition_protein_serving", true)) . 'g';
                }
                $result->recipe->nutrition = $nutrition;

//                $serves = get_post_meta($post->ID,"gmc-nr-servings",true);
//                $yields = $result->RCommentrecipe->yields;

                break;

            case 'kitchebug' :
                break;

        }
        echo json_encode($result);
        die();
    }

}
