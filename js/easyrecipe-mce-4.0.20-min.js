/*! EasyRecipe 3.3.2998 Copyright (c) 2015 BoxHill LLC */
!function(e){var t,n,i="mceNonEditable";tinymce.create("tinymce.plugins.EasyRecipe",{init:function(o,r){t=tinymce.VK||tinymce.util.VK,r=r.replace(/js$/g,"images/"),o.onSaveContent.add(function(e,t){}),o.onLoadContent.add(function(t,n){"mce_fullscreen"!==t.editorId&&e(window).trigger("easyrecipeload",[t,n])}),o.onSetContent.add(function(t,n){"mce_fullscreen"!==t.editorId||n.initial||e(window).trigger("easyrecipeload",[t,n])}),o.addButton("easyrecipeEdit",{title:"Edit an EasyRecipe",image:r+"chef20edit.png",onclick:function(){e(window).trigger("easyrecipeedit")}}),o.addButton("easyrecipeAdd",{title:"Add an EasyRecipe",image:r+"chef20add.png",onclick:function(){e(window).trigger("easyrecipeadd")}}),o.addButton("easyrecipeTest",{title:"Test Rich Snippet Formatting at Google",image:r+"google-dev.png",onclick:function(){""!==n.testURL&&window.open("https://developers.google.com/webmasters/structured-data/testing-tool?url="+encodeURIComponent(n.testURL))}}),o.onKeyDown.addToTop(function(n,o){function r(e){for(;e;){if(e.id===f)return e;e=e.parentNode}}function a(e){var t;if(1===e.nodeType){if(t=e.getAttribute(p),t&&"inherit"!==t)return t;if(t=e.contentEditable,"inherit"!==t)return t}return null}function c(e){for(var t;e;){if(t=a(e))return"false"===t?e:null;e=e.parentNode}}function d(e){function t(){var t,i,r=n.schema.getNonEmptyElements();for(i=new tinymce.dom.TreeWalker(o,n.getBody());(t=e?i.prev():i.next())&&!r[t.nodeName.toLowerCase()]&&!(3===t.nodeType&&tinymce.trim(t.nodeValue).length>0);)if("false"===a(t))return!0;return c(t)?!0:!1}var i,o,d;if(u.isCollapsed()){if(i=u.getRng(!0),o=i.startContainer,d=i.startOffset,o=r(o)||o,c(o))return!1;if(3==o.nodeType&&(e?d>0:d<o.nodeValue.length))return!0;if(1==o.nodeType&&(o=o.childNodes[d]||o),t())return!1}return!0}var s,l,u=n.selection,f="mce_noneditablecaret",g="contenteditable",p="data-mce-"+g;return o.keyCode!=t.BACKSPACE&&o.keyCode!=t.DELETE||d(o.keyCode==t.BACKSPACE)?o.keyCode!=t.LEFT&&o.keyCode!=t.RIGHT&&o.keyCode!=t.UP&&o.keyCode!=t.DOWN&&(s=n.selection.getNode(),l=e(s),l.hasClass(i))?tinymce.dom.Event.cancel(o):!0:(o.preventDefault(),!1)}),o.on("BeforeExecCommand",function(t){var i,r,a,c;return"mceInsertLink"===t.command&&n.isEntryDialog?(n.insertLink(t.value),void t.preventDefault()):void("mceInsertContent"===t.command&&(i=o.selection.getNode(),r=e(i),a=r.hasClass("easyrecipe")?r:r.parents(".easyrecipe"),a.length>0&&(c=e("<p>Stuff</p>").insertAfter(a),o.selection.select(c[0]))))}),o.onPreProcess.add(function(t,n){n.get&&e(".value-title, .ERRatingInner",n.node).html("#ERDeleteMe#")}),o.onPostProcess.add(function(e,t){t.get&&(t.content=t.content.replace(/#ERDeleteMe#/gi," "))})},getInfo:function(){return{longname:"EasyRecipe",author:"The Orgasmic Chef",authorurl:"http://www.orgasmicchef.com",infourl:"http://www.easyrecipeplugin.com/",version:"1.2"}}}),n=EASYRECIPE,tinymce.PluginManager.add("easyrecipe",tinymce.plugins.EasyRecipe)}(jQuery);