(function(a){tinymce.create("tinymce.plugins.EasyRecipe",{init:function(b,c){b.onLoadContent.add(function(d,e){if(d.editorId!=="mce_fullscreen"){a(window).trigger("easyrecipeload",[d,e])}});b.onSetContent.add(function(d,e){if(d.editorId==="mce_fullscreen"&&!e.initial){a(window).trigger("easyrecipeload",[d,e])}});b.addButton("easyrecipeLaunch",{title:"Add or Update an Easy Recipe",image:c+"/chef20.png",onclick:function(d){a(window).trigger("easyrecipeopen")}});b.addButton("easyrecipeTest",{title:"Test Rich Snippet Formatting at Google",image:c+"/google.png",onclick:function(d){if(EASYRECIPE.testURL!==""){window.open("http://www.google.com/webmasters/tools/richsnippets?url="+EASYRECIPE.testURL)}}});b.onPreProcess.add(function(d,e){if(e.get){a(".value-title, .ERRatingInner",e.node).html("#ERDeleteMe#")}});b.onPostProcess.add(function(d,e){if(e.get){e.content=e.content.replace(/#ERDeleteMe#/ig," ")}})},getInfo:function(){return{longname:"EasyRecipe",author:"The Orgasmic Chef",authorurl:"http://www.orgasmicchef.com",infourl:"http://www.orgasmicchef.com/easy-recipe/",version:"1.0"}}});tinymce.PluginManager.add("easyrecipe",tinymce.plugins.EasyRecipe)}(jQuery));