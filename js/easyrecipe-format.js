/*! EasyRecipe  3.2.1281 Copyright (c) 2014 BoxHill LLC */
if(typeof EASYRECIPE==="undefined"){var EASYRECIPE={}}(function(a){var b=EASYRECIPE;a(function(){var d,c=[],e=["gradient","picker_thumb","trigger","rainbow","hue_thumb"];for(d=0;d<e.length;d++){c.push(new Image());c[d].src=b.easyrecipeURL+"/css/images/format/"+e[d]+".png"}});a.fn.ERColorPicker=function(h,g,d){var i;var c;var k=this,m=a(h);d=d||g;c="";i=m.css(d);function e(p){var o;p=p.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);try{o=("#"+("0"+parseInt(p[1],10).toString(16)).slice(-2)+("0"+parseInt(p[2],10).toString(16)).slice(-2)+("0"+parseInt(p[3],10).toString(16)).slice(-2)).toUpperCase();return o}catch(q){}return null}function n(o){c=o}function f(o){if(o==="none"){m.css(g,"")}else{m.css(g,o)}}function l(){var o=this.data("color");k.trigger("formatchange");if(o==="none"||o==="transparent"){this.miniColors("value","")}this.data("oldColor",o)}function j(){m.css(g,this.data("oldColor"));if(this.data("oldColor")==="none"||this.data("oldColor")==="transparent"){this.miniColors("value","")}else{this.miniColors("value",this.data("oldColor"))}this.data("color",this.data("oldColor"))}if(i){if(i!=="transparent"){c=e(i)}else{c=i}this.val(c)}this.miniColors({change:f,cancel:j,save:l,onShow:n,value:c})}}(jQuery));
/*! EasyRecipe  3.2.1281 Copyright (c) 2014 BoxHill LLC */
(function(a){a.widget("ui.combobox",{_create:function(){var f;var d=this;var b=this.element.hide(),e=b.children(":selected"),g=e.val()?e.text():"";var c=a("<input />").insertAfter(b).val(g).autocomplete({delay:0,minLength:0,source:function(i,h){var j=new RegExp(a.ui.autocomplete.escapeRegex(i.term),"i");h(b.children("option").map(function(){var k=a(this).text();if(this.value&&(!i.term||j.test(k))){return{label:k.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+a.ui.autocomplete.escapeRegex(i.term)+")(?![^<>]*>)(?![^&;]+;)","gi"),"<strong>$1</strong>"),value:k,option:this}}}))},select:function(h,i){i.item.option.selected=true;d._trigger("selected",h,{item:i.item.option})},change:function(i,j){var k,h;if(!j.item){k=new RegExp("^"+a.ui.autocomplete.escapeRegex(a(this).val())+"$","i");h=false;b.children("option").each(function(){if(this.value.match(k)){this.selected=h=true;return false}return true});if(!h){a(this).val("");b.val("");return false}}return true}}).addClass("ui-widget ui-widget-content ui-corner-left");c.autocomplete("widget").wrap('<div class="easyrecipeFormatUI" />');f=c.data("uiAutocomplete")?c.data("uiAutocomplete"):c.data("autocomplete");f._renderItem=function(h,i){return a("<li></li>").data("item.autocomplete",i).append("<a>"+i.label+"</a>").appendTo(h)};a("<button> </button>").attr("tabIndex",-1).attr("title","Show All Items").insertAfter(c).button({icons:{primary:"ui-icon-triangle-1-s"},text:false}).removeClass("ui-corner-all").addClass("ui-corner-right ui-button-icon").click(function(){if(c.autocomplete("widget").is(":visible")){c.autocomplete("close");return}c.autocomplete("search","");c.focus()})}})}(jQuery));
/*! EasyRecipe  3.2.1281 Copyright (c) 2014 BoxHill LLC */
(function(c){var d=EASYRECIPE;function a(e){e.data.target.css("borderStyle",e.target.value)}function b(g,e){var f;g=g==="400"?"normal":g==="700"?"bold":g;for(f=0;f<e.length;f++){if(g===e[f].value){e[f].selected=true;break}}}c.fn.ERFontChange=function(w,g){var l;var f;var n;var t,s,v=-1;var A=c(w);var e=/ /g;var x,y;var k=this;var m=g||{};var h=m.spacing||{};if(A.length===0){return}this.append(d.fontChangeHTML);if(!m.showList){this.find(".divERFFList").hide()}if(!m.showBorder){this.find(".divERFBBorder").hide()}n=d.fonts||["inherit","Arial"];f=A.css("fontFamily")||"";l=this.find(".EFFFamily");function q(i,B){A.css("fontFamily",B.item.value);k.trigger("formatchange")}function r(i){A.css("fontStyle",i.target.value);k.trigger("formatchange")}function u(i){A.css("fontWeight",i.target.value);k.trigger("formatchange")}function o(i,B){A.css("fontSize",B.value);k.trigger("formatchange")}function z(i){A.css("listStyleType",i.target.value);k.trigger("formatchange")}function j(i){A.css("listStylePosition",i.target.value);k.trigger("formatchange")}function p(B,i){return B.replace(e,"")===i.replace(e,"")}l.each(function(){var i=this.options;for(x=0;x<n.length;x++){if(p(n[x],f)){y=true;v=x}s=x===v;t=n[x];i[x]=new Option(n[x],t,s,s)}if(!y){i[i.length]=new Option(f,f,true,true)}});this.find(".EFFFamily").combobox({selected:q});this.find(".ERFFColorInput").ERColorPicker(w,"color");this.find(".ERFFBGColorInput").ERColorPicker(w,"backgroundColor");b(A.css("fontStyle"),this.find(".lbERFFStyle option"));this.find(".lbERFFStyle").change(r);b(A.css("fontWeight"),this.find(".lbERFFWeight option"));this.find(".lbERFFWeight").change(u);if(m.showList){b(A.css("listStyleType"),this.find(".lbERFListStyle option"));this.find(".lbERFListStyle").change(z);b(A.css("listStylePosition"),this.find(".lbERFListPosition option"));this.find(".lbERFListPosition").change(j)}this.find(".ERFFSize").ERSlider({min:8,max:50,value:parseInt(c(w).css("fontSize"),10),style:"fontSize",selector:w});c.extend(h,{title:"Margin",type:"margin",min:-30});this.find(".ERFFMargin").spacing(w,h);c.extend(h,{title:"Padding",type:"padding",min:0});this.find(".ERFFPadding").spacing(w,h);if(m.showBorder){c(".ERBorderColorPick").ERColorPicker(A,"borderColor","borderTopColor");b(A.css("borderTopStyle"),c(".ERBorderStyle option"));c(".ERBorderStyle").change({target:A},a);c(".divERFBBorderSliderBox").ERSlider({min:1,max:10,value:parseInt(A.css("borderTopWidth"),10),selector:w,style:"borderWidth"})}return this}}(jQuery));
/*! EasyRecipe  3.2.1281 Copyright (c) 2014 BoxHill LLC */
(function(a){a.fn.ERSlider=function(e){var i,b,f,h=this;var c={width:120,min:1,max:20,value:1,selector:"",style:""};a.extend(c,e);i=a(c.selector);b=a('<input class=ERSliderInput" type="text" max="2" size="2" />');f=a('<span class="ERSliderSlider"></span>');function d(j){f.slider("value",j.target.value);i.css(c.style,j.target.value+"px");h.trigger("formatchange")}function g(j,k){b.val(k.value);i.css(c.style,k.value+"px");h.trigger("formatchange")}f.slider({min:c.min,max:c.max,value:c.value,slide:g});b.val(c.value);b.bind("change",d);a(this).append(b);a(this).append(f);return this}}(jQuery));
/*! EasyRecipe  3.2.1281 Copyright (c) 2014 BoxHill LLC */
(function(a){a.fn.spacing=function(w,e){var x;var g;var z="Top",h="px",q="disabled",b="value",c="sProperties",f=this;var m=a(w);var t={Top:0,Bottom:0,Left:0,Right:0};var r,o;var y=false,v;var i={type:"margin",title:"",min:0,max:50};var j,u;a.extend(i,e);v=a("<div></div>");v.append(a('<div class="ERFOptionHeader"><span class="ERFOptionTitle"></span><span class="ERFSpacingSameForAll"><label>Same for all <input type="checkbox" class="ERFSpacingSameCB" /></label></span></div>'));j='<div class="ERFSliderLine"><div class="ERFSliderType"></div><div><input class="ERFSliderValue" type="text" size="2" maxlength="2" /></div><div class="ERFSpacingSlider"></div></div>';u={};function n(A){var C,B,s;var d=A.data.sliders;y=A.target.checked;B=A.data.input.val();for(C in d){if(d.hasOwnProperty(C)){if(C!==z){s=d[C].slider;if(y){s.slider(b,B);s.slider("disable");d[C].input.val(B);d[C].input.attr(q,q);m.css(i.type+C,B+h)}else{s.slider("enable");d[C].input.removeAttr(q)}}}}}function l(s,B){var d;var D;var C,A=B.value+h;f.trigger("formatchange");D=a.data(s.target,c);m.css(D.style,A);D.input.val(B.value);if(D.position===z&&y){d=D.sliders;for(C in d){if(C===z){continue}if(d.hasOwnProperty(C)){d[C].input.val(B.value);d[C].slider.slider(b,B.value);m.css(i.type+C,A)}}}}function k(d){d.data.slider.slider(b,d.target.value);l({target:d.data.slider[0]},{value:d.target.value})}for(r in t){if(t.hasOwnProperty(r)){t[r]=parseInt(m.css(i.type+r),10);u[r]={};o=a(j);u[r].input=o.find(".ERFSliderValue");u[r].input.val(t[r]);u[r].postion=r;o.find(".ERFSliderType").html(r);g={style:i.type+r,input:u[r].input,position:r};u[r].slider=o.find(".ERFSpacingSlider").slider({min:i.min,max:i.max,value:t[r],slide:l}).data(c,g);u[r].input.change({slider:u[r].slider},k);v.append(o)}}x=u[z].slider.data();a.extend(x.sProperties,{sliders:u});u[z].slider.data(x);v.find(".ERFSpacingSameCB").click(x.sProperties,n);this.append(v);this.find(".ERFOptionTitle").html(i.title);return this}}(jQuery));
/*! EasyRecipe  3.2.1281 Copyright (c) 2014 BoxHill LLC */
if(typeof EASYRECIPE==="undefined"){var EASYRECIPE={}}if(!EASYRECIPE.widget){EASYRECIPE.widget=jQuery.widget}(function(A){var x,k,a,m=false,G=false,p=null,H,J,r,L="close",v,d="Format EasyRecipe";var c=".easyrecipe",D,t,f,u="option",l="zIndex",K="open",E="click";var M=/\?family=([^&]+)/i,n=0,b=/^.*[?&](style=([^&]+)).*$/i,s="",O,N,h;var g,e=[];var i=[c];function q(){G=true}function o(){var T,R={},Q=window.location.href,S,P;S=Q.split("?");Q=S[0];P=S.length>1?S[1]:"";P.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"),function(V,U,X,W){R[U]=W});Q+="?style="+A("#lbERFStyles").val();for(T in R){if(R.hasOwnProperty(T)){if(T!=="style"&&R.hasOwnProperty(T)){Q+="&"+T;if(R[T]!==""){Q+="="+R[T]}}}}window.location.replace(Q)}function I(P){N.removeAttr("disabled");h.attr("disabled","disabled");A(".ERFDSStyleSelect img").attr("src",f.styleThumbs[P.target.value])}function z(){if(s!==""){r.show().html("Saving...");A.ajax({url:f.ajaxURL+"?action=easyrecipeSaveStyle",type:"POST",data:{style:s},success:function(){window.location.replace(O)}})}}function F(){var P;var Q=confirm("This will clear your custom formatting\nAre you sure you want to do this?");if(Q){J.show().html("Resetting...");P="css="+JSON.stringify([]);if(f.isPrint){P+="&isPrint=1"}A.ajax({url:f.ajaxURL+"?action=easyrecipeCustomCSS",type:"POST",data:P,success:function(){window.location.reload()}})}}function w(Q,R){var S,P;var T=R.newHeader.height();if(!T){return}S=(R.newHeader.position()).top;T+=R.newPanel?R.newPanel.height()+3:R.newContent.height()+3;if(a-k>S+T){return}P=S-(a-T)/2;H.animate({scrollTop:P},500)}function y(Q,R){var P=R.newTab?R.newTab.index():R.index;if(P!==0){v.hide()}else{v.show()}}function C(){var P;x=A(".ERFormatDialog");a=x.height();k=x.find(".ui-dialog-titlebar").height();P=A("#wpadminbar").height();if(typeof P==="undefined"){P=0}if(a>(A(window).height()-P-10)){x.css("top",(P+5)+"px");x.css("position","absolute")}else{x.css("position","fixed")}}function B(){var P;var T={};var Q,R,S;J.show().html("Updating...");for(Q=0;Q<e.length;Q++){if(g[e[Q]]){T[e[Q]]=g[e[Q]]}}for(Q=0;Q<i.length;Q++){P=A(i[Q]);R=A(i[Q]).attr("style");if(R){T[i[Q]]=R}}S="css="+JSON.stringify(T);if(f.isPrint){S+="&isPrint=1"}A.ajax({url:f.ajaxURL+"?action=easyrecipeCustomCSS",type:"POST",data:S,success:function(){G=false;J.hide();if(m){m=false;H.dialog(L)}}})}function j(){if(G){if(!p){p=A("<div></div>").dialog({resizable:false,width:375,autoOpen:false,title:"You have unsaved changes",modal:true,height:75,buttons:{Cancel:function(){p.dialog(L)},"Ignore Changes":function(){G=false;p.dialog(L);H.dialog(L);window.location.reload()},"Save Changes":function(){m=true;B();p.dialog(L)}},dialogClass:"ERFSaveAlert",close:function(){A(".ERFSaveAlert").filter(function(){return A(this).text()===""}).remove()},open:function(P,Q){A(".ui-widget-overlay").wrap('<div class="easyrecipeFormatUI" />')}});p.parent(".ui-dialog").wrap('<div class="easyrecipeFormatUI" />')}p.parent(".ui-dialog").css(l,101+n);p.dialog(u,l,101+n);p.dialog(K);return false}return true}A(function(){var T;var Y;var R,Q,X,Z,P;var V;var S=null;D=A(c);f=EASYRECIPE;if(jQuery.widget!==f.widget){S=jQuery.widget;jQuery.widget=f.widget}if(f.isPrint){A("#liERFPrint").remove();A("#ERFPrint").remove();d="Format EasyRecipe Print";A("#liERFDisplayTab").find("a").text("Print Format");A("#liERFDisplayStyles").find("a").text("Print Styles")}f.openFormat=function(){var aa;if(n===0){A("*").each(function(){aa=parseInt(A(this).css(l),10)||0;if(aa>n){n=aa}})}H.parent(".ui-dialog").css(l,100+n);H.dialog(K);H.dialog(u,l,100+n);H.dialog(u,"position",[60,60])};V=A(".ERFDialogBox");try{H=V.dialog({resizable:false,autoOpen:false,width:350,height:635,title:d,position:[60,60],open:C,dialogClass:"ERFormatDialog",beforeClose:j})}catch(U){}H.parent(".ui-dialog.ERFormatDialog").wrap('<div class="easyrecipeFormatUI" />');J=A("#divERFWait");r=A("#divERFWaitStyle");v=A("#ERFButtons");f.fonts=["Arial, Verdana, sans-serif","Comic Sans MS, cursive","Tahoma, Verdana, sans-serif","'Trebuchet MS', Verdana, sans-serif","'Times New Roman', serif","Verdana, Arial, sans-serif"];P=A("link[rel='stylesheet'][href*='fonts.googleapis.com']");P.each(function(){var ac;var aa=decodeURIComponent(this.href);var ab=M.exec(aa);if(ab===null){return}ac=ab[1].split("|");for(R=0;R<ac.length;R++){f.fonts.push(ac[R].replace(/(.*?):.*/ig,"$1").replace(/\+/ig," "))}});f.fonts.sort();f.fonts.unshift("inherit");D.on(E,f.openFormat).addClass("ERPointer").attr("title","Click to open the formatting window");A("#ERFTabs").tabs({active:0,beforeActivate:y});A("#ERFAccordion").accordion({active:false,collapsible:true,heightStyle:"content",activate:w});V.bind("formatchange",q);g=JSON.parse(f.customCSS);for(Q in g){if(g.hasOwnProperty(Q)){if(g&&g[Q]){A(Q).attr("style",g[Q])}}}try{t=A.parseJSON(f.formatting)}catch(W){t=[]}for(R=0;R<t.length;R++){X=t[R];Y=A("#ER_erf_"+X.id);switch(X.type){case"recipe":Z=Y.ERFontChange(X.target,{showBorder:true});break;case"font":case"button":Z=Y.ERFontChange(X.target);break;case"list":Z=Y.ERFontChange(X.target,{showList:true,spacing:{min:-30}});break}if(Z===null||Z==undefined){e.push(X.target)}else{i.push(X.target)}}A("#btnERFReset").on(E,F);A("#btnERFUpdate").on(E,B);N=A("#btnERFTryStyle").on(E,o);A("#lbERFStyles").on("change",I);f.styleThumbs=A.parseJSON(f.styleThumbs);T=b.exec(window.location.href);if(T!==null){s=T[2];O=T[0].replace(T[1],"").replace("?&","?").replace(/^(.*)&$/g,"$1");h=A("#btnERFSaveStyle").on(E,z)}else{h=A("#btnERFSaveStyle").attr("disabled","disabled")}A(".ERSPrintBtn").on(E,function(aa){aa.stopPropagation()});if(S!==null){jQuery.widget=S}})}(jQuery));
/*! EasyRecipe  3.2.1281 Copyright (c) 2014 BoxHill LLC */
if(jQuery){(function(a){a.extend(a.fn,{miniColors:function(p,w){var m=function(z,D,C){var A;var x=h("#FFFFFF"),y="none",B=z.val();z.data("oldColor",B);if(B.charAt(0)==="#"){y=r(B);if(y){x=h(y)}z.data("color",y)}else{z.val("");z.data("color",B);y=""}A=a('<a class="miniColors-trigger" style="background-color: #'+y+'" href="#"></a>');A.insertAfter(z);z.addClass("miniColors").attr("maxlength",7).attr("autocomplete","off");z.data("trigger",A);z.data("hsb",x);if(D.change){z.data("change",D.change)}if(D.cancel){z.data("cancel",D.cancel)}if(D.save){z.data("save",D.save)}if(D.onShow){z.data("onShow",D.onShow)}if(D.readonly){z.attr("readonly",true)}A.bind("click.miniColors",function(o){o.preventDefault();z.trigger("focus")});z.bind("focus.miniColors",function(){u(z)});z.bind("blur.miniColors",function(){var o=r(z.val());z.val(o?"#"+o:"")});z.bind("keydown.miniColors",function(o){if(o.keyCode===9){l(z)}});z.bind("keyup.miniColors",function(){var o=z.val().replace(/[^A-F0-9#]/ig,"");z.val(o);if(!j(z)){z.data("trigger").css("backgroundColor","#FFF")}});z.bind("paste.miniColors",function(){setTimeout(function(){z.trigger("keyup")},5)})};var v=function(o){l();o=a(o);o.data("trigger").remove();o.removeAttr("autocomplete");o.removeData("trigger");o.removeData("selector");o.removeData("hsb");o.removeData("huePicker");o.removeData("colorPicker");o.removeData("mousebutton");o.removeData("moving");o.unbind("click.miniColors");o.unbind("focus.miniColors");o.unbind("blur.miniColors");o.unbind("keyup.miniColors");o.unbind("keydown.miniColors");o.unbind("paste.miniColors");a(document).unbind("mousedown.miniColors");a(document).unbind("mousemove.miniColors")};var u=function(E){var z;var C;var B;var D;var o;var A;var x;var y;if(E.attr("disabled")){return false}l();z=a('<div class="miniColors-selector"></div>');z.append('<div class="miniColors-colors" style="background-color: #FFF;"><div class="miniColors-colorPicker"></div></div>');z.append('<div class="miniColors-hues"><div class="miniColors-huePicker"></div></div>');z.append('<div class="cpButtons"><div class="miniColors-none" style="float:left"><label><input type="checkbox" /> None</label></div><div class="miniColors-X" style="float:left;padding-left:6px"><label><input type="checkbox" /> X</label></div><div class="cpCancel"><a></a></div><div class="cpSave"><a></a></div></div>');z.css({top:E.is(":visible")?E.offset().top+E.outerHeight():E.data("trigger").offset().top+E.data("trigger").outerHeight(),left:E.is(":visible")?E.offset().left:E.data("trigger").offset().left,display:"none",zIndex:1+parseInt(a(".ERFormatDialog").css("zIndex"),10)}).addClass(E.attr("class"));B=E.data("hsb");A=E.data("color");if(A==="none"){z.find(".miniColors-colors").addClass("miniColors-nocolor");z.find(".miniColors-none input").attr("checked",true);z.find(".miniColors-colorPicker").hide();z.find(".miniColors-huePicker").hide();z.find(".miniColors-hues").css("opacity",0.3)}else{if(A==="transparent"){z.find(".miniColors-colors").addClass("miniColors-transparent");z.find(".miniColors-X input").attr("checked",true);z.find(".miniColors-colorPicker").hide();z.find(".miniColors-huePicker").hide();z.find(".miniColors-hues").css("opacity",0.3)}else{z.find(".miniColors-colors").css("backgroundColor","#"+g({h:B.h,s:100,b:100}))}}o=E.data("colorPosition");if(!o){o=d(B)}z.find(".miniColors-colorPicker").css("top",o.y+"px").css("left",o.x+"px");D=E.data("huePosition");if(!D){D=n(B)}z.find(".miniColors-huePicker").css("top",D.y+"px");E.data("selector",z);E.data("huePicker",z.find(".miniColors-huePicker"));E.data("colorPicker",z.find(".miniColors-colorPicker"));E.data("mousebutton",0);a("BODY").append(z);x=function(G){var F;if(!G.target.checked){z.find(".miniColors-colors").removeClass("miniColors-nocolor");z.find(".miniColors-colorPicker").show();z.find(".miniColors-huePicker").show();z.find(".miniColors-hues").css("opacity",1);F="#"+g({h:B.h,s:100,b:100});E.data("color",F);z.find(".miniColors-colors").css("backgroundColor",F);if(E.data("change")){F="#"+g({h:B.h,s:B.s,b:B.b});E.data("change").call(E,F)}}else{z.find(".miniColors-X input").attr("checked",false);z.find(".miniColors-colors").removeClass("miniColors-transparent");z.find(".miniColors-colors").addClass("miniColors-nocolor");z.find(".miniColors-colorPicker").hide();z.find(".miniColors-huePicker").hide();z.find(".miniColors-hues").css("opacity",0.3);E.data("color","none");if(E.data("change")){E.data("change").call(E,"none")}}};y=function(G){var F;if(!G.target.checked){z.find(".miniColors-colors").removeClass("miniColors-transparent");z.find(".miniColors-colorPicker").show();z.find(".miniColors-huePicker").show();z.find(".miniColors-hues").css("opacity",1);F="#"+g({h:B.h,s:100,b:100});E.data("color",F);z.find(".miniColors-colors").css("backgroundColor",F);if(E.data("change")){F="#"+g({h:B.h,s:B.s,b:B.b});E.data("change").call(E,F)}}else{z.find(".miniColors-none input").attr("checked",false);z.find(".miniColors-colors").removeClass("miniColors-nocolor");z.find(".miniColors-colors").addClass("miniColors-transparent");z.find(".miniColors-colorPicker").hide();z.find(".miniColors-huePicker").hide();z.find(".miniColors-hues").css("opacity",0.3);E.data("color","transparent");if(E.data("change")){E.data("change").call(E,"transparent")}}};a(".miniColors-none input").bind("click",x);a(".miniColors-X input").bind("click",y);a(".cpCancel").bind("click",{input:E},f);a(".cpSave").bind("click",{input:E},s);z.fadeIn(100);z.bind("selectstart",function(){return false});a(document).bind("mousedown.miniColors",function(F){if(E.data("color")==="none"||E.data("color")==="transparent"){return}E.data("mousebutton",1);if(a(F.target).parents().andSelf().hasClass("miniColors-colors")){F.preventDefault();E.data("moving","colors");c(E,F)}if(a(F.target).parents().andSelf().hasClass("miniColors-hues")){F.preventDefault();E.data("moving","hues");k(E,F)}if(a(F.target).parents().andSelf().hasClass("miniColors-selector")){F.preventDefault();return}if(a(F.target).parents().andSelf().hasClass("miniColors")){return}f({data:{input:E}})});a(document).bind("mouseup.miniColors",function(){if(E.data("color")==="none"){return}E.data("mousebutton",0);E.removeData("moving")});a(document).bind("mousemove.miniColors",function(F){if(E.data("color")==="none"){return}if(E.data("mousebutton")===1){if(E.data("moving")==="colors"){c(E,F)}if(E.data("moving")==="hues"){k(E,F)}}});C=E.data("onShow");if(C){C.call(E,"#"+g(B))}};function f(x){var o,y;o=x.data.input;l(o);y=o.data("cancel");if(y){y.call(o)}}function s(y){var x,o;x=y.data.input;l(x);o=x.data("save");if(o){o.call(x)}}var l=function(o){if(!o){o=".miniColors"}a(o).each(function(){var x=a(this).data("selector");a(this).removeData("selector");a(x).fadeOut(100,function(){a(this).remove()})});a(document).unbind("mousedown.miniColors");a(document).unbind("mousemove.miniColors")};var c=function(A,C){var z;var x;var B;var o;var y=A.data("colorPicker");y.hide();o={x:C.clientX-A.data("selector").find(".miniColors-colors").offset().left+a(document).scrollLeft()-5,y:C.clientY-A.data("selector").find(".miniColors-colors").offset().top+a(document).scrollTop()-5};if(o.x<=-5){o.x=-5}if(o.x>=144){o.x=144}if(o.y<=-5){o.y=-5}if(o.y>=144){o.y=144}A.data("colorPosition",o);y.css("left",o.x).css("top",o.y).show();B=Math.round((o.x+5)*0.67);if(B<0){B=0}if(B>100){B=100}x=100-Math.round((o.y+5)*0.67);if(x<0){x=0}if(x>100){x=100}z=A.data("hsb");z.s=B;z.b=x;e(A,z,true)};var k=function(y,A){var x;var z;var o;var B=y.data("huePicker");B.hide();o={y:A.clientY-y.data("selector").find(".miniColors-colors").offset().top+a(document).scrollTop()-1};if(o.y<=-1){o.y=-1}if(o.y>=149){o.y=149}y.data("huePosition",o);B.css("top",o.y).show();z=Math.round((150-o.y-1)*2.4);if(z<0){z=0}if(z>360){z=360}x=y.data("hsb");x.h=z;e(y,x,true)};var e=function(x,o,y){var z;x.data("hsb",o);z=g(o);if(y){x.val("#"+z)}x.data("trigger").css("backgroundColor","#"+z);x.data("color","#"+z);if(x.data("selector")){x.data("selector").find(".miniColors-colors").css("backgroundColor","#"+g({h:o.h,s:100,b:100}))}if(x.data("change")){x.data("change").call(x,"#"+z,t(o))}};var j=function(z){var y;var C;var D;var x;var o;var B;var A=r(z.val());if(!A){return false}y=h(A);B=z.data("hsb");if(y.h===B.h&&y.s===B.s&&y.b===B.b){return true}o=d(y);x=a(z.data("colorPicker"));x.css("top",o.y+"px").css("left",o.x+"px");D=n(y);C=a(z.data("huePicker"));C.css("top",D.y+"px");e(z,y,false);return true};var d=function(z){var A;var o=Math.ceil(z.s/0.67);if(o<0){o=0}if(o>150){o=150}A=150-Math.ceil(z.b/0.67);if(A<0){A=0}if(A>150){A=150}return{x:o-5,y:A-5}};var n=function(o){var x=150-(o.h/2.4);if(x<0){x=0}if(x>150){x=150}return{y:x-1}};var r=function(o){o=o.replace(/[^A-Fa-f0-9]/,"");if(o.length===3){o=o[0]+o[0]+o[1]+o[1]+o[2]+o[2]}return o.length===6?o:null};var t=function(o){var z;var C;var D;var y={};var B=Math.round(o.h);var A=Math.round(o.s*255/100);var x=Math.round(o.b*255/100);if(A===0){y.r=y.g=y.b=x}else{D=x;C=(255-A)*x/255;z=(D-C)*(B%60)/60;if(B===360){B=0}if(B<60){y.r=D;y.b=C;y.g=C+z}else{if(B<120){y.g=D;y.b=C;y.r=D-z}else{if(B<180){y.g=D;y.r=C;y.b=C+z}else{if(B<240){y.b=D;y.r=C;y.g=D-z}else{if(B<300){y.b=D;y.g=C;y.r=C+z}else{if(B<360){y.r=D;y.g=C;y.b=D-z}else{y.r=0;y.g=0;y.b=0}}}}}}}return{r:Math.round(y.r),g:Math.round(y.g),b:Math.round(y.b)}};var b=function(o){var x=[o.r.toString(16),o.g.toString(16),o.b.toString(16)];a.each(x,function(y,z){if(z.length===1){x[y]="0"+z}});return x.join("").toUpperCase()};var q=function(o){o=parseInt(((o.indexOf("#")>-1)?o.substring(1):o),16);return{r:o>>16,g:(o&65280)>>8,b:(o&255)}};var i=function(y){var x={h:0,s:0,b:0};var z=Math.min(y.r,y.g,y.b);var o=Math.max(y.r,y.g,y.b);var A=o-z;x.b=o;x.s=o!==0?255*A/o:0;if(x.s!==0){if(y.r===o){x.h=(y.g-y.b)/A}else{if(y.g===o){x.h=2+(y.b-y.r)/A}else{x.h=4+(y.r-y.g)/A}}}else{x.h=-1}x.h*=60;if(x.h<0){x.h+=360}x.s*=100/255;x.b*=100/255;return x};var h=function(x){var o=i(q(x));if(o.s===0){o.h=360}return o};var g=function(o){return b(t(o))};switch(p){case"readonly":a(this).each(function(){a(this).attr("readonly",w)});return a(this);case"value":a(this).each(function(){a(this).val(w).trigger("keyup")});return a(this);case"destroy":a(this).each(function(){v(a(this))});return a(this);default:if(!p){p={}}a(this).each(function(){if(a(this)[0].tagName.toLowerCase()!=="input"){return}if(a(this).data("trigger")){return}m(a(this),p,w)});return a(this)}}})}(jQuery))};