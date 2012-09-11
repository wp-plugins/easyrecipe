=== Easy Recipe ===
Contributors: Jayce53
Tags: recipe, seo, hrecipe, Recipe View, microformatting, easy recipe, rich snippet, microdata
Requires at least: 3.2
Tested up to: 3.4.2
Stable tag: 3.1.01
License: GPLv2 or later

EasyRecipe makes it easy to enter, format and print recipes, as well as automagically doing the geeky stuff needed for Google's Recipe View.

== Description ==

The most fully featured recipe plugin that doesn't require a degree in geek! 

EasyRecipe makes recipe entry a breeze, with features like cut and paste, auto conversion of your plain text recipe posts, live custom formatting, Google Recipe View formatting and preview button, automatic ratings, conversion from other recipe plugins like ZipList and RecipeSEO, and more.

Adding a recipe and getting the [Recipe View](http://googleblog.blogspot.com/2011/02/slice-and-dice-your-recipe-search.html) microdata correct is not only time consuming but it's also pretty geeky and most cooks prefer to cook and share, not code webpages.

Enter EasyRecipe.

EasyRecipe gives you all the advantages of microdata, without any of the messy coding. We've done all the geeky work for you.

Enter your post, upload your photos and enter your recipe.  EasyRecipe formats it all and allows your visitors to view your recipe in the format YOU create - there's no messy CSS or PHP editing required.

And of course there's a print button that allows your visitors to print your recipes in a format you can change to be just how you want it. 

It's quick. It's easy. The recipes look great.  Your recipes will have ratings and print features and most importantly you have a much better chance for your recipes showing up in Google's Recipe View search results.

To convert an existing plain text recipe post to EasyRecipe, edit the post, select the Ingredients and Instructions with your mouse and click the EasyRecipe icon. As long as there's an appropriate header above the ingredients and instructions, EasyRecipe can import your post directly.

To convert a ZipList or RecipeSEO post to EasyRecipe, edit the post and click the EasyRecipe icon. That's it!  How easy was that?

Requires PHP 5+

== Installation ==

You can download and install the EasyRecipe plugin using the built in WordPress plugin installer. If you download the EasyRecipe plugin manually, just upload it to your Wordpress plugins directory and unzip it.

Activate the EasyRecipe plugin in the "Plugins" admin panel using the "Activate" link.

To use the plugin, click the EasyRecipe button (the chef icon) on the "Add Post" or "Edit Post" pages, right next to the editor formatting buttons. Then enter (or cut and paste) your recipe into EasyRecipe.  Any ingredient or instruction line beginning with an exclamation mark (!) is formatted as a heading. Click the "Add Recipe" button and it will save your recipe and insert it into your blog post.

== Frequently Asked Questions ==

= Why do you put a placeholder into my Edit Post page, instead of the actual recipe? =

Because of the way the WordPress editor works, if you make changes to your recipe using the html editor, you're at risk of messing up the microdata and then you'll be upset with us.  We want you to show up in Google so EasyRecipe requires that you make changes by clicking the placeholder and changing your previous entry.

= Why Is EasyRecipe Better? =

Because not only is EasyRecipe an easy way to let the search engines get your recipes in the format that helps you get the most exposure for your recipes, it really IS easy to use.  Simply cut and paste your recipe in EasyRecipe and hit publish. The options on our EasyRecipe screen are the ones Google looks for.

= How can I request a feature to be added in future versions of EasyRecipe Plugin? =

You can [contact us](http://www.easyrecipeplugin.com/support.php) with your requests.  We may not be able to implement every request, but we want to make this the easiest recipe plugin for everyone to use.

= Can You Convert Your Recipes From Plain Text or Another Plugin? =

We CAN but it all depends on what's in the text and/or what other things another plugin has added.  We can't guarantee that you won't need to do a little additional manual editing, but EasyRecipe can usually do 95% of the work for you.

= Where Can I Get Help? =

We'll do our best to help you with any problem you have with EasyRecipe.  You can [contact me](http://www.easyrecipeplugin.com/support.php) and we'll answer you as quickly as we can.

== Screenshots ==
1. Simple recipe entry. You don't have to pre-define ingredients, enter quantities separately or worry about taxonomies 
2. You can optionally enter nutrition data if you want. If you leave it out, EasyRecipe just suppresses that section on your post. 
3. You can enter optional notes. EasyRecipe is smart enough to hide the notes section on your post if you don't have any.
4. You can even cut and paste a plain text recipe and have EasyRecipe convert it for you.
5. Just one of the display styles  available. You can choose from a range of pre-defined styles, or create your own (in [EasyRecipe PLUS](http://www.easyrecipeplugin.com))
6. If the style isn't quite what you wanted, you can tweak it with EasyRecipe's "Live Formatting". Change the colors, spacing, border, fonts and more right on your blog and see exactly how it will look as you change it. No fussing with CSS or other geeky stuff.
7. Set up EasyRecipe just how you want it so it's easy to enter your recipes.
8. Select from a range of pre-defined recipe templates (or make your own with [EasyRecipe PLUS](http://www.easyrecipeplugin.com)). All of the templates can be tweaked with EasyRecipe's Live Formatting
9. We take support seriously. You can even add a ticket to our support database right from your blog admin.

== Changelog ==
= 3.1.01 =
* Fix print redirect being broken by automatic updates
* Fix minor glitches in style templates

= 3.1 =
* This is a major update!
* Uses microdata (schema.org) instead of microformatting (hrecipe)
* Added template based output
* Choose from a range of display and print styles
* Added "Cut and paste" plain text recipe entry
* Added Swoop integration
* Added Default Author
* Added Cuisine type
* Added Recipe type defaults
* Added Trans Fat and Sodium to nutrition data
* Added "Disable ratings"
* Option to convert fractions (e.g. 1/2 becomes &frac12;)
= Available in EasyRecipe PLUS: =
* Multiple recipes per page/post
* Select the image to use as the "main" image
* Easy insertion of images and links in recipes
* Guest posts
* Import from cookbooks
* Custom recipe templates

= 2.2.7 =
* Fix broken formatting link in admin menu bar
* Fix bad formatting on font change dropdowns
* Changes for new EasyRecipe site

= 2.2.6 =
* Fix for broken ratings on some themes
* Fix incompatibility with some other plugin "Tools"

= 2.2.5 =
* Fix for the Live Formatting window opening too high on the page on small screens
 
= 2.2.4 =
* Fix corrupt css images

= 2.2.3 =
* Fixed some incompatibilities with some other themes/plugins

= 2.2.2 =
* Added ZipList conversion
* Updated RecipeSEO conversion
* Added meta tag for MyBigRecipeBox.com crawler permissions
* Fixed some options not being correctly saved 
* Fix "Recipe Details" formatting not saved
* Fix "Carbs" label not displaying

= 2.2.1 =
* Fix My Big Recipe Box ping (hung on publish) 

= 2.2.0 =
* Fix fatal error in extra CSS processing 

= 2.1.9 =
* Fix changelog 

= 2.1.8 =
* Updated for WP 3.3.1
* Fixed invalid time formats
* Fixed defaults not handled correctly in WP 3.3.1
* Added "noindex" to print page
* Added &lt;div&gt; wrappers around Ingredients and Instructions for easier own formatting
* No longer strips leading non alphanumerics from pasted ingredient lists

= 2.1.7 =
* Added the ability to select "transparent" as a color
* Fix occasional PHP error when linkback removed
* Fix for Notes and Nutrition format customizations not saved


= 2.1.6 =
* Fix problem when an image in the EasyRecipe itself is used as the microformat photo

= 2.1.5 =
* Allow any photo to be used as the microformat photo
* Added mailing list subscription option
* Fixed some problems with excerpts
* Fixed Print loading the wrong url

= 2.1.4 =
* Fix for excerpts not displaying correctly

= 2.1.3 =
* Fix for options not being saved correctly

= 2.1.2 =
* Fix character encoding - fixes weird characters being displayed
* Correctly identify EasyRecipe posts - fixes ratings on non-EasyRecipe posts
* Check for DOMDocument existence at plugin registration
* Disable PHP errors for DOM parse and manipulation

= 2.1.1 =
* Fix for fatal error on corrupted posts
* Fix for jQuery noconflict conflict

= 2.1 =
* Added comprehensive formatting options
* Added embedded image and link capability
* Extended the template customization for non-english languages or other specific text
* Fixed occasional loss of print capability in WP 3.2
* Fixed occasional loss of time microformatting in WP 3.2

= 2.0 =
* Beta release of version 2

= 1.3 =
* Added the ability to replace labels with language or other specific text
* Fixed an issue of the Print button sometimes not being displayed
* Fix Cholesterol typo

= 1.2.4 =
* Fix EasyRecipe not being inserted into the post on some browsers when there is no initial editor content and/or the cursor is not in the editor body
* Only ping MyBigRecipeBox.com if the published post contains an EasyRecipe
* Fix typo on RecipeSEO posts conversion

= 1.2.3 =
* Fix for images that somehow got corrupted in 1.2.2

= 1.2.2 =
* Added diagnostics
* Fixed the removal of the linkback when requested

= 1.2.1 =
* Fix for settings not being stored correctly

= 1.2 =
* Added blog title and URL to the bottom of the printed recipe
* Added a button to the html editor toolbar to prevent confusion
* Added checks for valid color values in settings to prevent the recipe border and background not displaying correctly when colors were invalid
* Added a workaround for a bug in the WP editor which inconsistently removes empty HTML tags. This sometimes resulted in the total cooking time not being recognised by Google
* Only display stars on comments if the comment actually has a non-zero rating
* Removes the ratings microformat information if there are no ratings to keep the Google test page happy

= 1.1.2 =
* Fix for image not printing on servers with allow_url_fopen off

= 1.1.1 =
* Only accept and display comment ratings if the post is an EasyRecipe

= 1.1 =
* Fixed a problem when Wordpress autosave adds spurious paragraphs

== Upgrade Notice ==
= 2.1.3 =
Various bug fixes for version 2