if(typeof EASYRECIPE==="undefined"){EASYRECIPE={}}(function(a){var b=EASYRECIPE;a(function(){var d,c=[],e=["gradient","picker_thumb","trigger","rainbow","hue_thumb"];for(d=0;d<e.length;d++){c.push(new Image());c[d].src=b.easyrecipeURL+"/css/images/format/"+e[d]+".png"}});a.fn.ERColorPicker=function(h,g,e){var k=this,m=a(h);var o=g;e=e||g;var c="";var i=m.css(e);function d(q){var p;q=q.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);try{p=("#"+("0"+parseInt(q[1],10).toString(16)).slice(-2)+("0"+parseInt(q[2],10).toString(16)).slice(-2)+("0"+parseInt(q[3],10).toString(16)).slice(-2)).toUpperCase();return p}catch(r){}return null}function n(p){c=p}function f(p){if(p==="none"){m.css(o,"")}else{m.css(o,p)}}function l(){var p=this.data("color");k.trigger("formatchange");if(p==="none"||p==="transparent"){this.miniColors("value","")}this.data("oldColor",p)}function j(){m.css(o,this.data("oldColor"));if(this.data("oldColor")==="none"||this.data("oldColor")==="transparent"){this.miniColors("value","")}else{this.miniColors("value",this.data("oldColor"))}this.data("color",this.data("oldColor"))}if(i){if(i!=="transparent"){c=d(i)}else{c=i}this.val(c)}this.miniColors({change:f,cancel:j,save:l,onShow:n,value:c})}}(jQuery));(function(a){a.widget("ui.combobox",{_create:function(){var d,c=this,b=this.element.hide(),e=b.children(":selected"),f=e.val()?e.text():"",g=this.wrapper=a("<span>").addClass("ui-combobox").insertAfter(b);d=a("<input>").appendTo(g).val(f).addClass("ui-state-default ui-combobox-input").autocomplete({delay:0,minLength:0,source:function(i,h){var j=new RegExp(a.ui.autocomplete.escapeRegex(i.term),"i");h(b.children("option").map(function(){var k=a(this).text();if(this.value&&(!i.term||j.test(k))){return{label:k.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+a.ui.autocomplete.escapeRegex(i.term)+")(?![^<>]*>)(?![^&;]+;)","gi"),"<strong>$1</strong>"),value:k,option:this}}}))},select:function(h,i){i.item.option.selected=true;c._trigger("selected",h,{item:i.item.option})},change:function(i,j){if(!j.item){var k=new RegExp("^"+a.ui.autocomplete.escapeRegex(a(this).val())+"$","i"),h=false;b.children("option").each(function(){if(a(this).text().match(k)){this.selected=h=true;return false}});if(!h){a(this).val("");b.val("");d.data("autocomplete").term="";return false}}}}).addClass("ui-widget ui-widget-content ui-corner-left");d.autocomplete("widget").wrap('<div class="easyrecipeFormatUI" />');d.data("autocomplete")._renderItem=function(h,i){return a("<li></li>").data("item.autocomplete",i).append("<a>"+i.label+"</a>").appendTo(h)};a("<a>").attr("tabIndex",-1).attr("title","Show All Items").appendTo(g).button({icons:{primary:"ui-icon-triangle-1-s"},text:false}).removeClass("ui-corner-all").addClass("ui-corner-right ui-combobox-toggle").click(function(){if(d.autocomplete("widget").is(":visible")){d.autocomplete("close");return}a(this).blur();d.autocomplete("search","");d.focus()})},destroy:function(){this.wrapper.remove();this.element.show();a.Widget.prototype.destroy.call(this)}})}(jQuery));(function(c){var d=EASYRECIPE;function a(e){e.data.target.css("borderStyle",e.target.value)}function b(g,e){var f;g=g==="400"?"normal":g==="700"?"bold":g;for(f=0;f<e.length;f++){if(g===e[f].value){e[f].selected=true;break}}}c.fn.ERFontChange=function(x,g){var B=c(x);if(B.length===0){return null}var e=/ /g;var y,z;var k=this;var s;var m=g||{};var h=m.spacing||{};this.append(d.fontChangeHTML);if(!m.showList){this.find(".divERFFList").hide()}if(!m.showBorder){this.find(".divERFBBorder").hide()}var n=d.fonts||["inherit","Arial"];var f=B.css("fontFamily")||"";var l=this.find(".EFFFamily");var u,t,w=-1;function q(i,C){B.css("fontFamily",C.item.value);k.trigger("formatchange")}function r(i){B.css("fontStyle",i.target.value);k.trigger("formatchange")}function v(i){B.css("fontWeight",i.target.value);k.trigger("formatchange")}function o(i,C){B.css("fontSize",C.value);k.trigger("formatchange")}function A(i){B.css("listStyleType",i.target.value);k.trigger("formatchange")}function j(i){B.css("listStylePosition",i.target.value);k.trigger("formatchange")}function p(C,i){return C.replace(e,"")===i.replace(e,"")}l.each(function(){var i=this.options;for(y=0;y<n.length;y++){if(p(n[y],f)){z=true;w=y}t=y===w;u=n[y];i[y]=new Option(n[y],u,t,t)}if(!z){i[i.length]=new Option(f,f,true,true)}});this.find(".EFFFamily").combobox({selected:q});this.find(".ERFFColorInput").ERColorPicker(x,"color");this.find(".ERFFBGColorInput").ERColorPicker(x,"backgroundColor");b(B.css("fontStyle"),this.find(".lbERFFStyle option"));this.find(".lbERFFStyle").change(r);b(B.css("fontWeight"),this.find(".lbERFFWeight option"));this.find(".lbERFFWeight").change(v);if(m.showList){b(B.css("listStyleType"),this.find(".lbERFListStyle option"));this.find(".lbERFListStyle").change(A);b(B.css("listStylePosition"),this.find(".lbERFListPosition option"));this.find(".lbERFListPosition").change(j)}this.find(".ERFFSize").ERSlider({min:8,max:50,value:parseInt(c(x).css("fontSize"),10),style:"fontSize",selector:x});c.extend(h,{title:"Margin",type:"margin",min:-30});this.find(".ERFFMargin").spacing(x,h);c.extend(h,{title:"Padding",type:"padding",min:0});this.find(".ERFFPadding").spacing(x,h);if(m.showBorder){c(".ERBorderColorPick").ERColorPicker(B,"borderColor","borderTopColor");b(B.css("borderTopStyle"),c(".ERBorderStyle option"));c(".ERBorderStyle").change({target:B},a);c(".divERFBBorderSliderBox").ERSlider({min:1,max:10,value:parseInt(B.css("borderTopWidth"),10),selector:x,style:"borderWidth"})}return this}}(jQuery));(function(a){a.fn.ERSlider=function(e){var i,b,f,h=this;var c={width:120,min:1,max:20,value:1,selector:"",style:""};a.extend(c,e);i=a(c.selector);b=a('<input class=ERSliderInput" type="text" max="2" size="2" />');f=a('<span class="ERSliderSlider"></span>');function d(j){f.slider("value",j.target.value);i.css(c.style,j.target.value+"px");h.trigger("formatchange")}function g(j,k){b.val(k.value);i.css(c.style,k.value+"px");h.trigger("formatchange")}f.slider({min:c.min,max:c.max,value:c.value,slide:g});b.val(c.value);b.bind("change",d);a(this).append(b);a(this).append(f);return this}}(jQuery));(function(a){a.fn.spacing=function(w,e){var z="Top",h="px",o="disabled",b="value",c="sProperties",f=this;var m=a(w);var t={Top:0,Bottom:0,Left:0,Right:0};var r;var y=false,v;var i={type:"margin",title:"",min:0,max:50};a.extend(i,e);v=a("<div></div>");v.append(a('<div class="ERFOptionHeader"><span class="ERFOptionTitle"></span><span class="ERFSpacingSameForAll"><label>Same for all <input type="checkbox" class="ERFSpacingSameCB" /></label></span></div>'));var j='<div class="ERFSliderLine"><div class="ERFSliderType"></div><div><input class="ERFSliderValue" type="text" size="2" maxlength="2" /></div><div class="ERFSpacingSlider"></div></div>';var u={};function q(A){var d=A.data.sliders;y=A.target.checked;var C,B,s;B=A.data.input.val();for(C in d){if(d.hasOwnProperty(C)){if(C!==z){s=d[C].slider;if(y){s.slider(b,B);s.slider("disable");d[C].input.val(B);d[C].input.attr(o,o);m.css(i.type+C,B+h)}else{s.slider("enable");d[C].input.removeAttr(o)}}}}}function l(s,B){var C,A=B.value+h;f.trigger("formatchange");var D=a.data(s.target,c);m.css(D.style,A);D.input.val(B.value);if(D.position===z&&y){var d=D.sliders;for(C in d){if(C===z){continue}if(d.hasOwnProperty(C)){d[C].input.val(B.value);d[C].slider.slider(b,B.value);m.css(i.type+C,A)}}}}function k(d){d.data.slider.slider(b,d.target.value);l({target:d.data.slider[0]},{value:d.target.value})}for(r in t){if(t.hasOwnProperty(r)){t[r]=parseInt(m.css(i.type+r),10);u[r]={};var n=a(j);u[r].input=n.find(".ERFSliderValue");u[r].input.val(t[r]);u[r].postion=r;n.find(".ERFSliderType").html(r);var g={style:i.type+r,input:u[r].input,position:r};u[r].slider=n.find(".ERFSpacingSlider").slider({min:i.min,max:i.max,value:t[r],slide:l}).data(c,g);u[r].input.change({slider:u[r].slider},k);v.append(n)}}var x=u[z].slider.data();a.extend(x.sProperties,{sliders:u});u[z].slider.data(x);v.find(".ERFSpacingSameCB").click(x.sProperties,q);this.append(v);this.find(".ERFOptionTitle").html(i.title);return this}}(jQuery));if(typeof EASYRECIPE==="undefined"){var EASYRECIPE={}}(function(D){var A,m,a,p=false,K=false,s=null,L,N,u,Q="close",y,d="Format EasyRecipe";var c=".easyrecipe",G,w,f,x="option",o="zIndex",O="open",I="click";var R=/\?family=([^&]+)/i,q=0,b=/(.*)\?style=(.*)/i,l={},v="",T,S,h;var g,e=[];var i=[c];function t(){K=true}function r(){var Y,W={},V=window.location.href,X,U;X=V.split("?");V=X[0];U=X.length>1?X[1]:"";U.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"),function(aa,Z,ac,ab){W[Z]=ab});V+="?style="+D("#lbERFStyles").val();for(Y in W){if(W.hasOwnProperty(Y)){if(Y!=="style"&&W.hasOwnProperty(Y)){V+="&"+Y;if(W[Y]!==""){V+="="+W[Y]}}}}window.location.replace(V)}function M(W){S.removeAttr("disabled");h.attr("disabled","disabled");var V=D("#ERFDSStyleSelect img");var U=f.styleThumbs[W.target.value];D(".ERFDSStyleSelect img").attr("src",f.styleThumbs[W.target.value])}function C(){if(v!==""){u.show().html("Saving...");D.ajax({url:f.ajaxURL+"?action=easyrecipeSaveStyle",type:"POST",data:{style:v},success:function(){window.location.replace(T)}})}}function J(){var U;var V=confirm("This will clear your custom formatting\nAre you sure you want to do this?");if(V){N.show().html("Resetting...");U="css="+JSON.stringify([]);if(f.isPrint){U+="&isPrint=1"}D.ajax({url:f.ajaxURL+"?action=easyrecipeCustomCSS",type:"POST",data:U,success:function(){window.location.reload()}})}}function z(V,W){var Y=W.newHeader.height();if(!Y){return}var X=(W.newHeader.position()).top;Y+=W.newContent.height()+3;if(a-m>X+Y){return}var U=X-(a-Y)/2;L.animate({scrollTop:U},500)}function B(U,V){if(V.index!==0){y.hide()}else{y.show()}}function H(U){}function n(U){}function k(U){D(".easyrecipe").css("borderStyle",U.target.value)}function F(){A=D(".ERFormatDialog");a=A.height();m=A.find(".ui-dialog-titlebar").height();var U=D("#wpadminbar").height();if(U===undefined){U=0}if(a>(D(window).height()-U-10)){A.css("top",(U+5)+"px");A.css("position","absolute")}else{A.css("position","fixed")}}function E(){var Y={};var V,W,X;N.show().html("Updating...");for(V=0;V<e.length;V++){if(g[e[V]]){Y[e[V]]=g[e[V]]}}for(V=0;V<i.length;V++){var U=D(i[V]);W=D(i[V]).attr("style");if(W){Y[i[V]]=W}}X="css="+JSON.stringify(Y);if(f.isPrint){X+="&isPrint=1"}D.ajax({url:f.ajaxURL+"?action=easyrecipeCustomCSS",type:"POST",data:X,success:function(){K=false;N.hide();if(p){p=false;L.dialog(Q)}}})}function j(){if(K){if(!s){s=D("<div></div>").dialog({resizable:false,width:375,autoOpen:false,title:"You have unsaved changes",modal:true,height:75,buttons:{Cancel:function(){s.dialog(Q)},"Ignore Changes":function(){K=false;s.dialog(Q);L.dialog(Q);window.location.reload()},"Save Changes":function(){p=true;E();s.dialog(Q)}},dialogClass:"ERFSaveAlert",close:function(){D(".ERFSaveAlert").filter(function(){return D(this).text()===""}).remove()},open:function(U,V){D(".ui-widget-overlay").wrap('<div class="easyrecipeFormatUI" />')}});s.parent(".ui-dialog").wrap('<div class="easyrecipeFormatUI" />')}s.dialog(x,o,q+100);s.dialog(O);return false}return true}function P(){var Y,V,aa,U,X;G=D(c);f=EASYRECIPE;if(f.isPrint){D("#liERFPrint").remove();D("#ERFPrint").remove();d="Format EasyRecipe Print";D("#liERFDisplayTab a").text("Print Format");D("#liERFDisplayStyles a").text("Print Styles")}f.openFormat=function(){var ab;if(q===0){D("*").each(function(){ab=parseInt(D(this).css("z-Index"),10)||0;if(ab>q){q=ab}})}L.dialog(O);L.dialog(x,o,q+100);L.dialog(x,"position",[60,60])};L=D(".ERFDialogBox").dialog({resizable:false,autoOpen:false,width:350,height:635,title:d,position:[60,60],open:F,dialogClass:"ERFormatDialog",beforeClose:j});L.parent(".ui-dialog.ERFormatDialog").wrap('<div class="easyrecipeFormatUI" />');N=D("#divERFWait");u=D("#divERFWaitStyle");y=D("#ERFButtons");f.fonts=["Arial, Verdana, sans-serif","Comic Sans MS, cursive","Tahoma, Verdana, sans-serif","'Trebuchet MS', Verdana, sans-serif","'Times New Roman', serif","Verdana, Arial, sans-serif"];X=D("link[rel='stylesheet'][href*='fonts.googleapis.com']");X.each(function(){var ab=decodeURIComponent(this.href);var ac=R.exec(ab);if(ac===null){return}var ad=ac[1].split("|");for(Y=0;Y<ad.length;Y++){f.fonts.push(ad[Y].replace(/(.*?):.*/ig,"$1").replace(/\+/ig," "))}});f.fonts.sort();f.fonts.unshift("inherit");G.on(I,f.openFormat).addClass("ERPointer").attr("title","Click to open the formatting window");D("#ERFTabs").tabs({selected:0,select:B});D("#ERFAccordion").accordion({active:false,collapsible:true,clearStyle:true,change:z});D(".ERFDialogBox").bind("formatchange",t);g=JSON.parse(f.customCSS);for(V in g){if(g.hasOwnProperty(V)){if(g&&g[V]){D(V).attr("style",g[V])}}}try{w=D.parseJSON(f.formatting)}catch(Z){w=[]}for(Y=0;Y<w.length;Y++){aa=w[Y];switch(aa.type){case"recipe":U=D("#ER_erf_"+aa.id).ERFontChange(aa.target,{showBorder:true});break;case"font":case"button":U=D("#ER_erf_"+aa.id).ERFontChange(aa.target);break;case"list":U=D("#ER_erf_"+aa.id).ERFontChange(aa.target,{showList:true,spacing:{min:-30}});break}if(U===null){e.push(aa.target)}else{i.push(aa.target)}}D("#btnERFReset").on(I,J);D("#btnERFUpdate").on(I,E);S=D("#btnERFTryStyle").on(I,r);D("#lbERFStyles").on("change",M);f.styleThumbs=D.parseJSON(f.styleThumbs);var W=b.exec(window.location.href);if(W!==null){v=W[2];T=W[1];h=D("#btnERFSaveStyle").on(I,C)}else{h=D("#btnERFSaveStyle").attr("disabled","disabled")}D(".ERSPrintBtn").on(I,function(ab){ab.stopPropagation()})}D(P)}(jQuery));if(jQuery){(function(a){a.extend(a.fn,{miniColors:function(q,x){var n=function(A,E,D){var y=i("#FFFFFF"),z="none",C=A.val();A.data("oldColor",C);if(C.charAt(0)==="#"){z=s(C);if(z){y=i(z)}A.data("color",z)}else{A.val("");A.data("color",C);z=""}var B=a('<a class="miniColors-trigger" style="background-color: #'+z+'" href="#"></a>');B.insertAfter(A);A.addClass("miniColors").attr("maxlength",7).attr("autocomplete","off");A.data("trigger",B);A.data("hsb",y);if(E.change){A.data("change",E.change)}if(E.cancel){A.data("cancel",E.cancel)}if(E.save){A.data("save",E.save)}if(E.onShow){A.data("onShow",E.onShow)}if(E.readonly){A.attr("readonly",true)}if(E.disabled){disable(A)}B.bind("click.miniColors",function(o){o.preventDefault();A.trigger("focus")});A.bind("focus.miniColors",function(o){v(A)});A.bind("blur.miniColors",function(F){var o=s(A.val());A.val(o?"#"+o:"")});A.bind("keydown.miniColors",function(o){if(o.keyCode===9){m(A)}});A.bind("keyup.miniColors",function(o){var F=A.val().replace(/[^A-F0-9#]/ig,"");A.val(F);if(!k(A)){A.data("trigger").css("backgroundColor","#FFF")}});A.bind("paste.miniColors",function(o){setTimeout(function(){A.trigger("keyup")},5)})};var w=function(o){m();o=a(o);o.data("trigger").remove();o.removeAttr("autocomplete");o.removeData("trigger");o.removeData("selector");o.removeData("hsb");o.removeData("huePicker");o.removeData("colorPicker");o.removeData("mousebutton");o.removeData("moving");o.unbind("click.miniColors");o.unbind("focus.miniColors");o.unbind("blur.miniColors");o.unbind("keyup.miniColors");o.unbind("keydown.miniColors");o.unbind("paste.miniColors");a(document).unbind("mousedown.miniColors");a(document).unbind("mousemove.miniColors")};var v=function(F){if(F.attr("disabled")){return false}m();var A=a('<div class="miniColors-selector"></div>');A.append('<div class="miniColors-colors" style="background-color: #FFF;"><div class="miniColors-colorPicker"></div></div>');A.append('<div class="miniColors-hues"><div class="miniColors-huePicker"></div></div>');A.append('<div class="cpButtons"><div class="miniColors-none" style="float:left"><label><input type="checkbox" /> None</label></div><div class="miniColors-X" style="float:left;padding-left:6px"><label><input type="checkbox" /> X</label></div><div class="cpCancel"><a></a></div><div class="cpSave"><a></a></div></div>');A.css({top:F.is(":visible")?F.offset().top+F.outerHeight():F.data("trigger").offset().top+F.data("trigger").outerHeight(),left:F.is(":visible")?F.offset().left:F.data("trigger").offset().left,display:"none"}).addClass(F.attr("class"));var C=F.data("hsb");var B=F.data("color");if(B==="none"){A.find(".miniColors-colors").addClass("miniColors-nocolor");A.find(".miniColors-none input").attr("checked",true);A.find(".miniColors-colorPicker").hide();A.find(".miniColors-huePicker").hide();A.find(".miniColors-hues").css("opacity",0.3)}else{if(B==="transparent"){A.find(".miniColors-colors").addClass("miniColors-transparent");A.find(".miniColors-X input").attr("checked",true);A.find(".miniColors-colorPicker").hide();A.find(".miniColors-huePicker").hide();A.find(".miniColors-hues").css("opacity",0.3)}else{A.find(".miniColors-colors").css("backgroundColor","#"+g({h:C.h,s:100,b:100}))}}var o=F.data("colorPosition");if(!o){o=d(C)}A.find(".miniColors-colorPicker").css("top",o.y+"px").css("left",o.x+"px");var E=F.data("huePosition");if(!E){E=p(C)}A.find(".miniColors-huePicker").css("top",E.y+"px");F.data("selector",A);F.data("huePicker",A.find(".miniColors-huePicker"));F.data("colorPicker",A.find(".miniColors-colorPicker"));F.data("mousebutton",0);a("BODY").append(A);var y=function(H){var G;if(!H.target.checked){A.find(".miniColors-colors").removeClass("miniColors-nocolor");A.find(".miniColors-colorPicker").show();A.find(".miniColors-huePicker").show();A.find(".miniColors-hues").css("opacity",1);G="#"+g({h:C.h,s:100,b:100});F.data("color",G);A.find(".miniColors-colors").css("backgroundColor",G);if(F.data("change")){G="#"+g({h:C.h,s:C.s,b:C.b});F.data("change").call(F,G)}}else{A.find(".miniColors-X input").attr("checked",false);A.find(".miniColors-colors").removeClass("miniColors-transparent");A.find(".miniColors-colors").addClass("miniColors-nocolor");A.find(".miniColors-colorPicker").hide();A.find(".miniColors-huePicker").hide();A.find(".miniColors-hues").css("opacity",0.3);F.data("color","none");if(F.data("change")){F.data("change").call(F,"none")}}};var z=function(H){var G;if(!H.target.checked){A.find(".miniColors-colors").removeClass("miniColors-transparent");A.find(".miniColors-colorPicker").show();A.find(".miniColors-huePicker").show();A.find(".miniColors-hues").css("opacity",1);G="#"+g({h:C.h,s:100,b:100});F.data("color",G);A.find(".miniColors-colors").css("backgroundColor",G);if(F.data("change")){G="#"+g({h:C.h,s:C.s,b:C.b});F.data("change").call(F,G)}}else{A.find(".miniColors-none input").attr("checked",false);A.find(".miniColors-colors").removeClass("miniColors-nocolor");A.find(".miniColors-colors").addClass("miniColors-transparent");A.find(".miniColors-colorPicker").hide();A.find(".miniColors-huePicker").hide();A.find(".miniColors-hues").css("opacity",0.3);F.data("color","transparent");if(F.data("change")){F.data("change").call(F,"transparent")}}};a(".miniColors-none input").bind("click",y);a(".miniColors-X input").bind("click",z);a(".cpCancel").bind("click",{input:F},f);a(".cpSave").bind("click",{input:F},t);A.fadeIn(100);A.bind("selectstart",function(){return false});a(document).bind("mousedown.miniColors",function(G){if(F.data("color")==="none"||F.data("color")==="transparent"){return}F.data("mousebutton",1);if(a(G.target).parents().andSelf().hasClass("miniColors-colors")){G.preventDefault();F.data("moving","colors");c(F,G)}if(a(G.target).parents().andSelf().hasClass("miniColors-hues")){G.preventDefault();F.data("moving","hues");l(F,G)}if(a(G.target).parents().andSelf().hasClass("miniColors-selector")){G.preventDefault();return}if(a(G.target).parents().andSelf().hasClass("miniColors")){return}f({data:{input:F}})});a(document).bind("mouseup.miniColors",function(G){if(F.data("color")==="none"){return}F.data("mousebutton",0);F.removeData("moving")});a(document).bind("mousemove.miniColors",function(G){if(F.data("color")==="none"){return}if(F.data("mousebutton")===1){if(F.data("moving")==="colors"){c(F,G)}if(F.data("moving")==="hues"){l(F,G)}}});var D=F.data("onShow");if(D){D.call(F,"#"+g(C))}};function f(y){var o,z;o=y.data.input;m(o);z=o.data("cancel");if(z){z.call(o)}}function t(z){var y,o;y=z.data.input;m(y);o=y.data("save");if(o){o.call(y)}}var m=function(o){if(!o){o=".miniColors"}a(o).each(function(){var y=a(this).data("selector");a(this).removeData("selector");a(y).fadeOut(100,function(){a(this).remove()})});a(document).unbind("mousedown.miniColors");a(document).unbind("mousemove.miniColors")};var c=function(B,D){var A=B.data("colorPicker");A.hide();var y={x:D.clientX-B.data("selector").find(".miniColors-colors").offset().left+a(document).scrollLeft()-5,y:D.clientY-B.data("selector").find(".miniColors-colors").offset().top+a(document).scrollTop()-5};if(y.x<=-5){y.x=-5}if(y.x>=144){y.x=144}if(y.y<=-5){y.y=-5}if(y.y>=144){y.y=144}B.data("colorPosition",y);A.css("left",y.x).css("top",y.y).show();var C=Math.round((y.x+5)*0.67);if(C<0){C=0}if(C>100){C=100}var o=100-Math.round((y.y+5)*0.67);if(o<0){o=0}if(o>100){o=100}var z=B.data("hsb");z.s=C;z.b=o;e(B,z,true)};var l=function(z,B){var C=z.data("huePicker");C.hide();var o={y:B.clientY-z.data("selector").find(".miniColors-colors").offset().top+a(document).scrollTop()-1};if(o.y<=-1){o.y=-1}if(o.y>=149){o.y=149}z.data("huePosition",o);C.css("top",o.y).show();var A=Math.round((150-o.y-1)*2.4);if(A<0){A=0}if(A>360){A=360}var y=z.data("hsb");y.h=A;e(z,y,true)};var e=function(y,o,z){y.data("hsb",o);var A=g(o);if(z){y.val("#"+A)}y.data("trigger").css("backgroundColor","#"+A);y.data("color","#"+A);if(y.data("selector")){y.data("selector").find(".miniColors-colors").css("backgroundColor","#"+g({h:o.h,s:100,b:100}))}if(y.data("change")){y.data("change").call(y,"#"+A,u(o))}};var k=function(A){var B=s(A.val());if(!B){return false}var z=i(B);var D=A.data("hsb");if(z.h===D.h&&z.s===D.s&&z.b===D.b){return true}var y=d(z);var o=a(A.data("colorPicker"));o.css("top",y.y+"px").css("left",y.x+"px");var E=p(z);var C=a(A.data("huePicker"));C.css("top",E.y+"px");e(A,z,false);return true};var d=function(z){var o=Math.ceil(z.s/0.67);if(o<0){o=0}if(o>150){o=150}var A=150-Math.ceil(z.b/0.67);if(A<0){A=0}if(A>150){A=150}return{x:o-5,y:A-5}};var p=function(o){var z=150-(o.h/2.4);if(z<0){h=0}if(z>150){h=150}return{y:z-1}};var s=function(o){o=o.replace(/[^A-Fa-f0-9]/,"");if(o.length===3){o=o[0]+o[0]+o[1]+o[1]+o[2]+o[2]}return o.length===6?o:null};var u=function(o){var z={};var D=Math.round(o.h);var C=Math.round(o.s*255/100);var y=Math.round(o.b*255/100);if(C===0){z.r=z.g=z.b=y}else{var E=y;var B=(255-C)*y/255;var A=(E-B)*(D%60)/60;if(D===360){D=0}if(D<60){z.r=E;z.b=B;z.g=B+A}else{if(D<120){z.g=E;z.b=B;z.r=E-A}else{if(D<180){z.g=E;z.r=B;z.b=B+A}else{if(D<240){z.b=E;z.r=B;z.g=E-A}else{if(D<300){z.b=E;z.g=B;z.r=B+A}else{if(D<360){z.r=E;z.g=B;z.b=E-A}else{z.r=0;z.g=0;z.b=0}}}}}}}return{r:Math.round(z.r),g:Math.round(z.g),b:Math.round(z.b)}};var b=function(o){var y=[o.r.toString(16),o.g.toString(16),o.b.toString(16)];a.each(y,function(z,A){if(A.length===1){y[z]="0"+A}});return y.join("").toUpperCase()};var r=function(o){o=parseInt(((o.indexOf("#")>-1)?o.substring(1):o),16);return{r:o>>16,g:(o&65280)>>8,b:(o&255)}};var j=function(z){var y={h:0,s:0,b:0};var A=Math.min(z.r,z.g,z.b);var o=Math.max(z.r,z.g,z.b);var B=o-A;y.b=o;y.s=o!==0?255*B/o:0;if(y.s!==0){if(z.r===o){y.h=(z.g-z.b)/B}else{if(z.g===o){y.h=2+(z.b-z.r)/B}else{y.h=4+(z.r-z.g)/B}}}else{y.h=-1}y.h*=60;if(y.h<0){y.h+=360}y.s*=100/255;y.b*=100/255;return y};var i=function(y){var o=j(r(y));if(o.s===0){o.h=360}return o};var g=function(o){return b(u(o))};switch(q){case"readonly":a(this).each(function(){a(this).attr("readonly",x)});return a(this);case"disabled":a(this).each(function(){if(x){disable(a(this))}else{enable(a(this))}});return a(this);case"value":a(this).each(function(){a(this).val(x).trigger("keyup")});return a(this);case"destroy":a(this).each(function(){w(a(this))});return a(this);default:if(!q){q={}}a(this).each(function(){if(a(this)[0].tagName.toLowerCase()!=="input"){return}if(a(this).data("trigger")){return}n(a(this),q,x)});return a(this)}}})}(jQuery))};