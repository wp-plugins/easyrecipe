/*! EasyRecipe  3.2.1272 Copyright (c) 2013 BoxHill LLC */
(function(d){var a="mceNonEditable";var c=null;var b=false;var e;tinymce.create("tinymce.plugins.EasyRecipe",{init:function(f,g){e=tinymce.VK;g=g.replace(/js$/g,"images/");f.onSaveContent.add(function(h,i){});f.onLoadContent.add(function(h,i){if(h.editorId!=="mce_fullscreen"){d(window).trigger("easyrecipeload",[h,i])}});f.onSetContent.add(function(h,i){if(h.editorId==="mce_fullscreen"&&!i.initial){d(window).trigger("easyrecipeload",[h,i])}});f.addButton("easyrecipeEdit",{title:"Edit an EasyRecipe",image:g+"chef20edit.png",onclick:function(){d(window).trigger("easyrecipeedit")}});f.addButton("easyrecipeAdd",{title:"Add an EasyRecipe",image:g+"chef20add.png",onclick:function(){d(window).trigger("easyrecipeadd")}});f.addButton("easyrecipeTest",{title:"Test Rich Snippet Formatting at Google",image:g+"google.png",onclick:function(){if(EASYRECIPE.testURL!==""){window.open("http://www.google.com/webmasters/tools/richsnippets?url="+EASYRECIPE.testURL)}}});f.onKeyDown.addToTop(function(j,n){var l;var i;var h,m;var k,o;if(n.keyCode===e.BACKSPACE){o=j.dom.getParent(j.selection.getStart(),function(p){return j.dom.hasClass(p,a)});k=j.dom.getParent(j.selection.getEnd(),function(p){return j.dom.hasClass(p,a)});if(o||k){return tinymce.dom.Event.cancel(n)}}else{if(n.keyCode===e.DELETE){h=j.selection.getNode();m=d(h);if(m.hasClass(a)){return tinymce.dom.Event.cancel(n)}c=d(h.nextSibling);if(!c.hasClass(a)){return true}i=j.selection.getRng();l=i.endContainer.length||0;console.log("offset: "+i.endOffset+"  len: "+l);if(i.endOffset===l){return tinymce.dom.Event.cancel(n)}if(h.parentNode.nodeName==="P"&&h.parentNode.children.length==1){if(!b&&d(h.parentNode.nextSibling).hasClass(a)){h.parentNode.parentNode.removeChild(h.parentNode);EASYRECIPE.addListener();return tinymce.dom.Event.cancel(n)}}}}return true});f.onKeyUp.addToTop(function(i,k){var l,j,h;if(k.keyCode===46){h=i.selection.getNode();if(d(h).text().indexOf("_ERSTOP_")!==-1){i.undoManager.undo();EASYRECIPE.addListener()}l=d("#ERStop",i.getDoc());l.remove();b=false}else{if(k.keyCode===8){l=i.dom.getParent(i.selection.getStart(),function(m){return i.dom.hasClass(m,a)});j=i.dom.getParent(i.selection.getEnd(),function(m){return i.dom.hasClass(m,a)});if(l||j){i.undoManager.undo();EASYRECIPE.addListener()}}}});f.onBeforeExecCommand.add(function(i,m,l,o,k){var h,j,n;if(m!=="mceInsertContent"){return}if(EASYRECIPE.isEntryDialog){d(window).trigger("easyrecipeimage",o);k.terminate=true;return false}h=i.selection.getNode();j=d(h).parents(".easyrecipe");if(j.length>0){n=d("<p>").insertAfter(j);i.selection.select(n[0])}});f.onPreProcess.add(function(h,i){if(i.get){d(".value-title, .ERRatingInner",i.node).html("#ERDeleteMe#")}});f.onPostProcess.add(function(h,i){if(i.get){i.content=i.content.replace(/#ERDeleteMe#/ig," ")}})},getInfo:function(){return{longname:"EasyRecipe",author:"The Orgasmic Chef",authorurl:"http://www.orgasmicchef.com",infourl:"http://www.easyrecipeplugin.com/",version:"1.2"}}});tinymce.PluginManager.add("easyrecipe",tinymce.plugins.EasyRecipe)}(jQuery));