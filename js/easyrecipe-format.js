/*! EasyRecipe 3.2.2885 Copyright (c) 2014 BoxHill LLC */
window.EASYRECIPE=window.EASYRECIPE||{},function(t){var e=EASYRECIPE;t(function(){var t,i=[],o=["gradient","picker_thumb","trigger","rainbow","hue_thumb"];for(t=0;t<o.length;t++)i.push(new Image),i[t].src=e.easyrecipeURL+"/css/images/format/"+o[t]+".png"}),t.fn.ERColorPicker=function(e,i,o){function n(t){var e;t=t.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);try{return e=("#"+("0"+parseInt(t[1],10).toString(16)).slice(-2)+("0"+parseInt(t[2],10).toString(16)).slice(-2)+("0"+parseInt(t[3],10).toString(16)).slice(-2)).toUpperCase()}catch(i){}return null}function a(t){d=t}function r(t){"none"===t?h.css(i,""):h.css(i,t)}function s(){var t=this.data("color");u.trigger("formatchange"),("none"===t||"transparent"===t)&&this.miniColors("value",""),this.data("oldColor",t)}function l(){h.css(i,this.data("oldColor")),"none"===this.data("oldColor")||"transparent"===this.data("oldColor")?this.miniColors("value",""):this.miniColors("value",this.data("oldColor")),this.data("color",this.data("oldColor"))}var c,d,u=this,h=t(e);o=o||i,d="",c=h.css(o),c&&(d="transparent"!==c?n(c):c,this.val(d)),this.miniColors({change:r,cancel:l,save:s,onShow:a,value:d})}}(jQuery),/*! EasyRecipe 3.2.2885 Copyright (c) 2014 BoxHill LLC */
function(t){t.widget("ui.combobox",{_create:function(){var e,i=this,o=this.element.hide(),n=o.children(":selected"),a=n.val()?n.text():"",r=t("<input />").insertAfter(o).val(a).autocomplete({delay:0,minLength:0,source:function(e,i){var n=new RegExp(t.ui.autocomplete.escapeRegex(e.term),"i");i(o.children("option").map(function(){var i=t(this).text();return!this.value||e.term&&!n.test(i)?void 0:{label:i.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+t.ui.autocomplete.escapeRegex(e.term)+")(?![^<>]*>)(?![^&;]+;)","gi"),"<strong>$1</strong>"),value:i,option:this}}))},select:function(t,e){e.item.option.selected=!0,i._trigger("selected",t,{item:e.item.option})},change:function(e,i){var n,a;return i.item||(n=new RegExp("^"+t.ui.autocomplete.escapeRegex(t(this).val())+"$","i"),a=!1,o.children("option").each(function(){return this.value.match(n)?(this.selected=a=!0,!1):!0}),a)?!0:(t(this).val(""),o.val(""),!1)}}).addClass("ui-widget ui-widget-content ui-corner-left");r.autocomplete("widget").wrap('<div class="easyrecipeFormatUI" />'),e=r.data("uiAutocomplete")?r.data("uiAutocomplete"):r.data("autocomplete"),e._renderItem=function(e,i){return t("<li></li>").data("item.autocomplete",i).append("<a>"+i.label+"</a>").appendTo(e)},t("<button> </button>").attr("tabIndex",-1).attr("title","Show All Items").insertAfter(r).button({icons:{primary:"ui-icon-triangle-1-s"},text:!1}).removeClass("ui-corner-all").addClass("ui-corner-right ui-button-icon").click(function(){return r.autocomplete("widget").is(":visible")?(r.autocomplete("close"),void 0):(r.autocomplete("search",""),r.focus(),void 0)})}})}(jQuery),/*! EasyRecipe 3.2.2885 Copyright (c) 2014 BoxHill LLC */
function(t){function e(t){t.data.target.css("borderStyle",t.target.value)}function i(t,e){var i;for(t="400"===t?"normal":"700"===t?"bold":t,i=0;i<e.length;i++)if(t===e[i].value){e[i].selected=!0;break}}var o=EASYRECIPE;t.fn.ERFontChange=function(n,a){function r(t,e){y.css("fontFamily",e.item.value),S.trigger("formatchange")}function s(t){y.css("fontStyle",t.target.value),S.trigger("formatchange")}function l(t){y.css("fontWeight",t.target.value),S.trigger("formatchange")}function c(t){y.css("listStyleType",t.target.value),S.trigger("formatchange")}function d(t){y.css("listStylePosition",t.target.value),S.trigger("formatchange")}function u(t,e){return t.replace(E,"")===e.replace(E,"")}var h,p,f,g,m,v,C,b=-1,y=t(n),E=/ /g,S=this,w=a||{},F=w.spacing||{};return 0!==y.length?(this.append(o.fontChangeHTML),w.showList||this.find(".divERFFList").hide(),w.showBorder||this.find(".divERFBBorder").hide(),f=o.fonts||["inherit","Arial"],p=y.css("fontFamily")||"",h=this.find(".EFFFamily"),h.each(function(){var t=this.options;for(v=0;v<f.length;v++)u(f[v],p)&&(C=!0,b=v),m=v===b,g=f[v],t[v]=new Option(f[v],g,m,m);C||(t[t.length]=new Option(p,p,!0,!0))}),this.find(".EFFFamily").combobox({selected:r}),this.find(".ERFFColorInput").ERColorPicker(n,"color"),this.find(".ERFFBGColorInput").ERColorPicker(n,"backgroundColor"),i(y.css("fontStyle"),this.find(".lbERFFStyle option")),this.find(".lbERFFStyle").change(s),i(y.css("fontWeight"),this.find(".lbERFFWeight option")),this.find(".lbERFFWeight").change(l),w.showList&&(i(y.css("listStyleType"),this.find(".lbERFListStyle option")),this.find(".lbERFListStyle").change(c),i(y.css("listStylePosition"),this.find(".lbERFListPosition option")),this.find(".lbERFListPosition").change(d)),this.find(".ERFFSize").ERSlider({min:8,max:50,value:parseInt(t(n).css("fontSize"),10),style:"fontSize",selector:n}),t.extend(F,{title:"Margin",type:"margin",min:-30}),this.find(".ERFFMargin").spacing(n,F),t.extend(F,{title:"Padding",type:"padding",min:0}),this.find(".ERFFPadding").spacing(n,F),w.showBorder&&(t(".ERBorderColorPick").ERColorPicker(y,"borderColor","borderTopColor"),i(y.css("borderTopStyle"),t(".ERBorderStyle option")),t(".ERBorderStyle").change({target:y},e),t(".divERFBBorderSliderBox").ERSlider({min:1,max:10,value:parseInt(y.css("borderTopWidth"),10),selector:n,style:"borderWidth"})),this):void 0}}(jQuery),/*! EasyRecipe 3.2.2885 Copyright (c) 2014 BoxHill LLC */
function(t){t.fn.ERSlider=function(e){function i(t){r.slider("value",t.target.value),n.css(l.style,t.target.value+"px"),s.trigger("formatchange")}function o(t,e){a.val(e.value),n.css(l.style,e.value+"px"),s.trigger("formatchange")}var n,a,r,s=this,l={width:120,min:1,max:20,value:1,selector:"",style:""};return t.extend(l,e),n=t(l.selector),a=t('<input class=ERSliderInput" type="text" max="2" size="2" />'),r=t('<span class="ERSliderSlider"></span>'),r.slider({min:l.min,max:l.max,value:l.value,slide:o}),a.val(l.value),a.bind("change",i),t(this).append(a),t(this).append(r),this}}(jQuery),/*! EasyRecipe 3.2.2885 Copyright (c) 2014 BoxHill LLC */
function(t){t.fn.spacing=function(e,i){function o(t){var e,i,o,n=t.data.sliders;E=t.target.checked,i=t.data.input.val();for(e in n)n.hasOwnProperty(e)&&e!==p&&(o=n[e].slider,E?(o.slider(m,i),o.slider("disable"),n[e].input.val(i),n[e].input.attr(g,g),b.css(S.type+e,i+f)):(o.slider("enable"),n[e].input.removeAttr(g)))}function n(e,i){var o,n,a,r=i.value+f;if(C.trigger("formatchange"),n=t.data(e.target,v),b.css(n.style,r),n.input.val(i.value),n.position===p&&E){o=n.sliders;for(a in o)a!==p&&o.hasOwnProperty(a)&&(o[a].input.val(i.value),o[a].slider.slider(m,i.value),b.css(S.type+a,r))}}function a(t){t.data.slider.slider(m,t.target.value),n({target:t.data.slider[0]},{value:t.target.value})}var r,s,l,c,d,u,h,p="Top",f="px",g="disabled",m="value",v="sProperties",C=this,b=t(e),y={Top:0,Bottom:0,Left:0,Right:0},E=!1,S={type:"margin",title:"",min:0,max:50};t.extend(S,i),d=t("<div></div>"),d.append(t('<div class="ERFOptionHeader"><span class="ERFOptionTitle"></span><span class="ERFSpacingSameForAll"><label>Same for all <input type="checkbox" class="ERFSpacingSameCB" /></label></span></div>')),u='<div class="ERFSliderLine"><div class="ERFSliderType"></div><div><input class="ERFSliderValue" type="text" size="2" maxlength="2" /></div><div class="ERFSpacingSlider"></div></div>',h={};for(l in y)y.hasOwnProperty(l)&&(y[l]=parseInt(b.css(S.type+l),10),h[l]={},c=t(u),h[l].input=c.find(".ERFSliderValue"),h[l].input.val(y[l]),h[l].postion=l,c.find(".ERFSliderType").html(l),s={style:S.type+l,input:h[l].input,position:l},h[l].slider=c.find(".ERFSpacingSlider").slider({min:S.min,max:S.max,value:y[l],slide:n}).data(v,s),h[l].input.change({slider:h[l].slider},a),d.append(c));return r=h[p].slider.data(),t.extend(r.sProperties,{sliders:h}),h[p].slider.data(r),d.find(".ERFSpacingSameCB").click(r.sProperties,o),this.append(d),this.find(".ERFOptionTitle").html(S.title),this}}(jQuery),/*! EasyRecipe 3.2.2885 Copyright (c) 2014 BoxHill LLC */
window.EASYRECIPE=window.EASYRECIPE||{},EASYRECIPE.widget=EASYRECIPE.widget||jQuery.widget,function(t){function e(){P=!0}function i(){var e,i,o,n={},a=window.location.href;i=a.split("?"),a=i[0],o=i.length>1?i[1]:"",o.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"),function(t,e,i,o){n[e]=o}),a+="?style="+t("#lbERFStyles").val();for(e in n)n.hasOwnProperty(e)&&"style"!==e&&n.hasOwnProperty(e)&&(a+="&"+e,""!==n[e]&&(a+="="+n[e]));window.location.replace(a)}function o(e){w.removeAttr("disabled"),F.attr("disabled","disabled"),t(".ERFDSStyleSelect img").attr("src",E.styleThumbs[e.target.value])}function n(){""!==Q&&(v.show().html("Saving..."),t.ajax({url:E.ajaxURL+"?action=easyrecipeSaveStyle",type:"POST",data:{style:Q},success:function(){window.location.replace(S)}}))}function a(){var e,i=confirm("This will clear your custom formatting\nAre you sure you want to do this?");i&&(m.show().html("Resetting..."),e="css="+JSON.stringify([]),E.isPrint&&(e+="&isPrint=1"),t.ajax({url:E.ajaxURL+"?action=easyrecipeCustomCSS",type:"POST",data:e,success:function(){window.location.reload()}}))}function r(t,e){var i,o,n=e.newHeader.height();n&&(i=e.newHeader.position().top,n+=e.newPanel?e.newPanel.height()+3:e.newContent.height()+3,f-p>i+n||(o=i-(f-n)/2,g.animate({scrollTop:o},500)))}function s(t,e){var i=e.newTab?e.newTab.index():e.index;0!==i?C.hide():C.show()}function l(){var e;h=t(".ERFormatDialog"),f=h.height(),p=h.find(".ui-dialog-titlebar").height(),e=t("#wpadminbar").height(),"undefined"==typeof e&&(e=0),f>t(window).height()-e-10?(h.css("top",e+5+"px"),h.css("position","absolute")):h.css("position","fixed")}function c(){var e,i,o,n,a={};for(m.show().html("Updating..."),i=0;i<Y.length;i++)R[Y[i]]&&(a[Y[i]]=R[Y[i]]);for(i=0;i<z.length;i++)e=t(z[i]),o=t(z[i]).attr("style"),o&&(a[z[i]]=o);n="css="+JSON.stringify(a),E.isPrint&&(n+="&isPrint=1"),t.ajax({url:E.ajaxURL+"?action=easyrecipeCustomCSS",type:"POST",data:n,success:function(){P=!1,m.hide(),x||(x=!1,g.dialog(I))}})}function d(){return P?(k||(k=t("<div></div>").dialog({resizable:!1,width:375,autoOpen:!1,title:"You have unsaved changes",modal:!0,height:75,buttons:{Cancel:function(){k.dialog(I)},"Ignore Changes":function(){P=!1,k.dialog(I),g.dialog(I),window.location.reload()},"Save Changes":function(){x=!0,c(),k.dialog(I)}},dialogClass:"ERFSaveAlert",close:function(){t(".ERFSaveAlert").filter(function(){return""===t(this).text()}).remove()},open:function(){t(".ui-widget-overlay").wrap('<div id="easyrecipeFormatUI" class="easyrecipeFormatUI" />')}}),k.parent(".ui-dialog").wrap('<div id="easyrecipeFormatUI" class="easyrecipeFormatUI" />')),k.parent(".ui-dialog").css(D,101+L),k.dialog(O,D,101+L),k.dialog(j),!1):!0}function u(e){var i;("wp-admin-bar-ERFormatMenu"===e.currentTarget.id||"A"!==e.target.tagName)&&(0===L&&t("*").each(function(){i=parseInt(t(this).css(D),10)||0,i>L&&(L=i)}),e.preventDefault(),g.parent(".ui-dialog").css(D,100+L),g.dialog(j),g.dialog(O,D,100+L),g.dialog(O,"position",[60,60]))}var h,p,f,g,m,v,C,b,y,E,S,w,F,R,x=!1,P=!1,k=null,I="close",T="Format EasyRecipe",A=".easyrecipe",O="option",D="zIndex",j="open",B="click",M=/\?family=([^&]+)/i,L=0,U=/^.*[?&](style=([^&]+)).*$/i,Q="",Y=[],z=[A];t(function(){var h,p,f,x,P,k,I,O,D=null;b=t(A),E=EASYRECIPE,t("#wp-admin-bar-ERFormatMenu").on(B,u),jQuery.widget!==E.widget&&(D=jQuery.widget,jQuery.widget=E.widget),E.isPrint&&(t("#liERFPrint").remove(),t("#ERFPrint").remove(),T="Format EasyRecipe Print",t("#liERFDisplayTab").find("a").text("Print Format"),t("#liERFDisplayStyles").find("a").text("Print Styles")),O=t(".ERFDialogBox");try{g=O.dialog({resizable:!1,autoOpen:!1,width:350,height:635,title:T,position:[60,60],open:l,dialogClass:"ERFormatDialog",beforeClose:d})}catch(j){}g.parent(".ui-dialog.ERFormatDialog").wrap('<div id="easyrecipeFormatUI" class="easyrecipeFormatUI" />'),m=t("#divERFWait"),v=t("#divERFWaitStyle"),C=t("#ERFButtons"),E.fonts=["Arial, Verdana, sans-serif","Comic Sans MS, cursive","Tahoma, Verdana, sans-serif","'Trebuchet MS', Verdana, sans-serif","'Times New Roman', serif","Verdana, Arial, sans-serif"],I=t("link[rel='stylesheet'][href*='fonts.googleapis.com']"),I.each(function(){var t,e=decodeURIComponent(this.href),i=M.exec(e);if(null!==i)for(t=i[1].split("|"),f=0;f<t.length;f++)E.fonts.push(t[f].replace(/(.*?):.*/gi,"$1").replace(/\+/gi," "))}),E.fonts.sort(),E.fonts.unshift("inherit"),b.on(B,u).addClass("ERPointer").attr("title","Click to open the formatting window"),t("#ERFTabs").tabs({active:0,beforeActivate:s}),t("#ERFAccordion").accordion({active:!1,collapsible:!0,heightStyle:"content",activate:r}),O.bind("formatchange",e);try{R=JSON.parse(E.customCSS)}catch(j){R={}}for(x in R)R.hasOwnProperty(x)&&R&&R[x]&&t(x).attr("style",R[x]);try{y=t.parseJSON(E.formatting)}catch(L){y=[]}for(f=0;f<y.length;f++){switch(P=y[f],p=t("#ER_erf_"+P.id),P.type){case"recipe":k=p.ERFontChange(P.target,{showBorder:!0});break;case"font":case"button":k=p.ERFontChange(P.target);break;case"list":k=p.ERFontChange(P.target,{showList:!0,spacing:{min:-30}})}null===k||void 0==k?Y.push(P.target):z.push(P.target)}t("#btnERFReset").on(B,a),t("#btnERFUpdate").on(B,c),w=t("#btnERFTryStyle").on(B,i),t("#lbERFStyles").on("change",o),E.styleThumbs=t.parseJSON(E.styleThumbs),h=U.exec(window.location.href),null!==h?(Q=h[2],S=h[0].replace(h[1],"").replace("?&","?").replace(/^(.*)&$/g,"$1"),F=t("#btnERFSaveStyle").on(B,n)):F=t("#btnERFSaveStyle").attr("disabled","disabled"),t(".ERSPrintBtn").on(B,function(t){t.stopPropagation()}),null!==D&&(jQuery.widget=D)})}(jQuery),/*! EasyRecipe 3.2.2885 Copyright (c) 2014 BoxHill LLC */
jQuery&&!function(t){t.extend(t.fn,{miniColors:function(e,i){function o(t){var e,i;e=t.data.input,l(e),i=e.data("cancel"),i&&i.call(e)}function n(t){var e,i;e=t.data.input,l(e),i=e.data("save"),i&&i.call(e)}var a=function(e,i){var o,n=y("#FFFFFF"),a="none",r=e.val();e.data("oldColor",r),"#"===r.charAt(0)?(a=g(r),a&&(n=y(a)),e.data("color",a)):(e.val(""),e.data("color",r),a=""),o=t('<a class="miniColors-trigger" style="background-color: #'+a+'" href="#"></a>'),o.insertAfter(e),e.addClass("miniColors").attr("maxlength",7).attr("autocomplete","off"),e.data("trigger",o),e.data("hsb",n),i.change&&e.data("change",i.change),i.cancel&&e.data("cancel",i.cancel),i.save&&e.data("save",i.save),i.onShow&&e.data("onShow",i.onShow),i.readonly&&e.attr("readonly",!0),o.bind("click.miniColors",function(t){t.preventDefault(),e.trigger("focus")}),e.bind("focus.miniColors",function(){s(e)}),e.bind("blur.miniColors",function(){var t=g(e.val());e.val(t?"#"+t:"")}),e.bind("keydown.miniColors",function(t){9===t.keyCode&&l(e)}),e.bind("keyup.miniColors",function(){var t=e.val().replace(/[^A-F0-9#]/gi,"");e.val(t),h(e)||e.data("trigger").css("backgroundColor","#FFF")}),e.bind("paste.miniColors",function(){setTimeout(function(){e.trigger("keyup")},5)})},r=function(e){l(),e=t(e),e.data("trigger").remove(),e.removeAttr("autocomplete"),e.removeData("trigger"),e.removeData("selector"),e.removeData("hsb"),e.removeData("huePicker"),e.removeData("colorPicker"),e.removeData("mousebutton"),e.removeData("moving"),e.unbind("click.miniColors"),e.unbind("focus.miniColors"),e.unbind("blur.miniColors"),e.unbind("keyup.miniColors"),e.unbind("keydown.miniColors"),e.unbind("paste.miniColors"),t(document).unbind("mousedown.miniColors"),t(document).unbind("mousemove.miniColors")},s=function(e){var i,a,r,s,u,h,g,m;return e.attr("disabled")?!1:(l(),i=t('<div id="miniColors" class="miniColors-selector"></div>'),i.append('<div class="miniColors-colors" style="background-color: #FFF;"><div class="miniColors-colorPicker"></div></div>'),i.append('<div class="miniColors-hues"><div class="miniColors-huePicker"></div></div>'),i.append('<div class="cpButtons"><div class="miniColors-none" style="float:left"><label><input type="checkbox" /> None</label></div><div class="miniColors-X" style="float:left;padding-left:6px"><label><input type="checkbox" /> X</label></div><div class="cpCancel"><a></a></div><div class="cpSave"><a></a></div></div>'),i.css({top:e.is(":visible")?e.offset().top+e.outerHeight():e.data("trigger").offset().top+e.data("trigger").outerHeight(),left:e.is(":visible")?e.offset().left:e.data("trigger").offset().left,display:"none",zIndex:1+parseInt(t(".ERFormatDialog").css("zIndex"),10)}).addClass(e.attr("class")),r=e.data("hsb"),h=e.data("color"),"none"===h?(i.find(".miniColors-colors").addClass("miniColors-nocolor"),i.find(".miniColors-none input").attr("checked",!0),i.find(".miniColors-colorPicker").hide(),i.find(".miniColors-huePicker").hide(),i.find(".miniColors-hues").css("opacity",.3)):"transparent"===h?(i.find(".miniColors-colors").addClass("miniColors-transparent"),i.find(".miniColors-X input").attr("checked",!0),i.find(".miniColors-colorPicker").hide(),i.find(".miniColors-huePicker").hide(),i.find(".miniColors-hues").css("opacity",.3)):i.find(".miniColors-colors").css("backgroundColor","#"+E({h:r.h,s:100,b:100})),u=e.data("colorPosition"),u||(u=p(r)),i.find(".miniColors-colorPicker").css("top",u.y+"px").css("left",u.x+"px"),s=e.data("huePosition"),s||(s=f(r)),i.find(".miniColors-huePicker").css("top",s.y+"px"),e.data("selector",i),e.data("huePicker",i.find(".miniColors-huePicker")),e.data("colorPicker",i.find(".miniColors-colorPicker")),e.data("mousebutton",0),t("BODY").append(i),g=function(t){var o;t.target.checked?(i.find(".miniColors-X input").attr("checked",!1),i.find(".miniColors-colors").removeClass("miniColors-transparent"),i.find(".miniColors-colors").addClass("miniColors-nocolor"),i.find(".miniColors-colorPicker").hide(),i.find(".miniColors-huePicker").hide(),i.find(".miniColors-hues").css("opacity",.3),e.data("color","none"),e.data("change")&&e.data("change").call(e,"none")):(i.find(".miniColors-colors").removeClass("miniColors-nocolor"),i.find(".miniColors-colorPicker").show(),i.find(".miniColors-huePicker").show(),i.find(".miniColors-hues").css("opacity",1),o="#"+E({h:r.h,s:100,b:100}),e.data("color",o),i.find(".miniColors-colors").css("backgroundColor",o),e.data("change")&&(o="#"+E({h:r.h,s:r.s,b:r.b}),e.data("change").call(e,o)))},m=function(t){var o;t.target.checked?(i.find(".miniColors-none input").attr("checked",!1),i.find(".miniColors-colors").removeClass("miniColors-nocolor"),i.find(".miniColors-colors").addClass("miniColors-transparent"),i.find(".miniColors-colorPicker").hide(),i.find(".miniColors-huePicker").hide(),i.find(".miniColors-hues").css("opacity",.3),e.data("color","transparent"),e.data("change")&&e.data("change").call(e,"transparent")):(i.find(".miniColors-colors").removeClass("miniColors-transparent"),i.find(".miniColors-colorPicker").show(),i.find(".miniColors-huePicker").show(),i.find(".miniColors-hues").css("opacity",1),o="#"+E({h:r.h,s:100,b:100}),e.data("color",o),i.find(".miniColors-colors").css("backgroundColor",o),e.data("change")&&(o="#"+E({h:r.h,s:r.s,b:r.b}),e.data("change").call(e,o)))},t(".miniColors-none input").bind("click",g),t(".miniColors-X input").bind("click",m),t(".cpCancel").bind("click",{input:e},o),t(".cpSave").bind("click",{input:e},n),i.fadeIn(100),i.bind("selectstart",function(){return!1}),t(document).bind("mousedown.miniColors",function(i){return"none"!==e.data("color")&&"transparent"!==e.data("color")?(e.data("mousebutton",1),t(i.target).parents().andSelf().hasClass("miniColors-colors")&&(i.preventDefault(),e.data("moving","colors"),c(e,i)),t(i.target).parents().andSelf().hasClass("miniColors-hues")&&(i.preventDefault(),e.data("moving","hues"),d(e,i)),t(i.target).parents().andSelf().hasClass("miniColors-selector")?(i.preventDefault(),void 0):(t(i.target).parents().andSelf().hasClass("miniColors")||o({data:{input:e}}),void 0)):void 0}),t(document).bind("mouseup.miniColors",function(){"none"!==e.data("color")&&(e.data("mousebutton",0),e.removeData("moving"))}),t(document).bind("mousemove.miniColors",function(t){"none"!==e.data("color")&&1===e.data("mousebutton")&&("colors"===e.data("moving")&&c(e,t),"hues"===e.data("moving")&&d(e,t))}),a=e.data("onShow"),a&&a.call(e,"#"+E(r)),void 0)},l=function(e){e||(e=".miniColors"),t(e).each(function(){var e=t(this).data("selector");t(this).removeData("selector"),t(e).fadeOut(100,function(){t(this).remove()})}),t(document).unbind("mousedown.miniColors"),t(document).unbind("mousemove.miniColors")},c=function(e,i){var o,n,a,r,s=e.data("colorPicker");s.hide(),r={x:i.clientX-e.data("selector").find(".miniColors-colors").offset().left+t(document).scrollLeft()-5,y:i.clientY-e.data("selector").find(".miniColors-colors").offset().top+t(document).scrollTop()-5},r.x<=-5&&(r.x=-5),r.x>=144&&(r.x=144),r.y<=-5&&(r.y=-5),r.y>=144&&(r.y=144),e.data("colorPosition",r),s.css("left",r.x).css("top",r.y).show(),a=Math.round(.67*(r.x+5)),0>a&&(a=0),a>100&&(a=100),n=100-Math.round(.67*(r.y+5)),0>n&&(n=0),n>100&&(n=100),o=e.data("hsb"),o.s=a,o.b=n,u(e,o,!0)},d=function(e,i){var o,n,a,r=e.data("huePicker");r.hide(),a={y:i.clientY-e.data("selector").find(".miniColors-colors").offset().top+t(document).scrollTop()-1},a.y<=-1&&(a.y=-1),a.y>=149&&(a.y=149),e.data("huePosition",a),r.css("top",a.y).show(),n=Math.round(2.4*(150-a.y-1)),0>n&&(n=0),n>360&&(n=360),o=e.data("hsb"),o.h=n,u(e,o,!0)},u=function(t,e,i){var o;t.data("hsb",e),o=E(e),i&&t.val("#"+o),t.data("trigger").css("backgroundColor","#"+o),t.data("color","#"+o),t.data("selector")&&t.data("selector").find(".miniColors-colors").css("backgroundColor","#"+E({h:e.h,s:100,b:100})),t.data("change")&&t.data("change").call(t,"#"+o,m(e))},h=function(e){var i,o,n,a,r,s,l=g(e.val());return l?(i=y(l),s=e.data("hsb"),i.h===s.h&&i.s===s.s&&i.b===s.b?!0:(r=p(i),a=t(e.data("colorPicker")),a.css("top",r.y+"px").css("left",r.x+"px"),n=f(i),o=t(e.data("huePicker")),o.css("top",n.y+"px"),u(e,i,!1),!0)):!1},p=function(t){var e,i=Math.ceil(t.s/.67);return 0>i&&(i=0),i>150&&(i=150),e=150-Math.ceil(t.b/.67),0>e&&(e=0),e>150&&(e=150),{x:i-5,y:e-5}},f=function(t){var e=150-t.h/2.4;return 0>e&&(e=0),e>150&&(e=150),{y:e-1}},g=function(t){return t=t.replace(/[^A-Fa-f0-9]/,""),3===t.length&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),6===t.length?t:null},m=function(t){var e,i,o,n={},a=Math.round(t.h),r=Math.round(255*t.s/100),s=Math.round(255*t.b/100);return 0===r?n.r=n.g=n.b=s:(o=s,i=(255-r)*s/255,e=(o-i)*(a%60)/60,360===a&&(a=0),60>a?(n.r=o,n.b=i,n.g=i+e):120>a?(n.g=o,n.b=i,n.r=o-e):180>a?(n.g=o,n.r=i,n.b=i+e):240>a?(n.b=o,n.r=i,n.g=o-e):300>a?(n.b=o,n.g=i,n.r=i+e):360>a?(n.r=o,n.g=i,n.b=o-e):(n.r=0,n.g=0,n.b=0)),{r:Math.round(n.r),g:Math.round(n.g),b:Math.round(n.b)}},v=function(e){var i=[e.r.toString(16),e.g.toString(16),e.b.toString(16)];return t.each(i,function(t,e){1===e.length&&(i[t]="0"+e)}),i.join("").toUpperCase()},C=function(t){return t=parseInt(t.indexOf("#")>-1?t.substring(1):t,16),{r:t>>16,g:(65280&t)>>8,b:255&t}},b=function(t){var e={h:0,s:0,b:0},i=Math.min(t.r,t.g,t.b),o=Math.max(t.r,t.g,t.b),n=o-i;return e.b=o,e.s=0!==o?255*n/o:0,e.h=0!==e.s?t.r===o?(t.g-t.b)/n:t.g===o?2+(t.b-t.r)/n:4+(t.r-t.g)/n:-1,e.h*=60,e.h<0&&(e.h+=360),e.s*=100/255,e.b*=100/255,e},y=function(t){var e=b(C(t));return 0===e.s&&(e.h=360),e},E=function(t){return v(m(t))};switch(e){case"readonly":return t(this).each(function(){t(this).attr("readonly",i)}),t(this);case"value":return t(this).each(function(){t(this).val(i).trigger("keyup")}),t(this);case"destroy":return t(this).each(function(){r(t(this))}),t(this);default:return e||(e={}),t(this).each(function(){"input"===t(this)[0].tagName.toLowerCase()&&(t(this).data("trigger")||a(t(this),e,i))}),t(this)}}})}(jQuery);