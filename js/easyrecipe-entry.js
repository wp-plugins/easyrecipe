window.EASYRECIPE=window.EASYRECIPE||{};EASYRECIPE.widget=EASYRECIPE.widget||jQuery.widget;EASYRECIPE.button=EASYRECIPE.button||jQuery.fn.button;
(function(a){function Fb(a,b){Ra.show();$.hide();Sa.show();switch(b.newTab?b.newTab.index():b.index){case 0:$.css("right","10px");$.show();break;case 3:$.css("right","inherit");Sa.hide();$.show();break;case 4:Ra.hide()}}function Ta(){ya.off("change",Ta);U=!0}function g(a){return a?(a+"").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&nbsp;/g," "):""}function aa(d){return d?a("<div />").text(d).html():""}function n(d){return a.trim(aa(d.val()))||!1}function Gb(a,b){var c=
za.tabs("option","active");za.tabs("option","active",++c)}function x(a){var b,c=/\[img +(.*?) *\/?\]/i,f=/\[url ([^\]]+)\](.*?\[\/url\])/i;for(b=c.exec(a);null!==b;)V.push(b[1]),a=a.replace(c,"[img:"+V.length+"]"),b=c.exec(a);for(b=f.exec(a);null!==b;)F.push(b[1]),a=a.replace(f,"[url:"+F.length+"]$2"),b=f.exec(a);return a}function w(a){var b,c=/\[img:(\d+)\]/i,f=/\[url:(\d+)\](.*?)\[\/url\]/i;for(b=c.exec(a);null!==b;)b=V[b[1]-1],a=a.replace(c,"[img "+b+"]"),b=c.exec(a);for(b=f.exec(a);null!==b;)b=
F[b[1]-1],a=a.replace(f,"[url "+b+"]$2[/url]"),b=f.exec(a);return a}function nb(a,b){var c,f,e,p=0,l="",k,g,h,q,m;c=a;for(b=b||{};;){e=c.length;f=c.indexOf("#",p);-1!==f&&(e=f,k=0);f=c.indexOf("\x3c!-- START REPEAT ",p);-1!==f&&f<e&&(e=f,k=1);f=c.indexOf("\x3c!-- START INCLUDEIF ",p);-1!==f&&f<e&&(e=f,k=2);if(e===c.length)return l+c.substr(p);f=e-p;l+=c.substr(p,f);p=e;switch(k){case 2:e=c.substr(p,44);e=Hb.exec(e);if(null!==e)f=e[1],g="!"!==f,h=e[2];else break;q="\x3c!-- END INCLUDEIF "+f+h+" --\x3e";
e=q.length;q=c.indexOf(q);if(-1===q){p++;break}m=typeof b[h]!==Aa&&!1!==b[h];m===g?(f="\x3c!-- START INCLUDEIF "+f+h+" --\x3e",f=f.length,c=c.substr(0,p)+c.substr(p+f,q-p-f)+c.substr(q+e)):c=c.substr(0,p)+c.substr(q+e);break;case 0:e=c.substr(p,22);e=Ib.exec(e);if(null===e){l+="#";p++;continue}e=e[1];if(""!==b[e]&&!b[e]){l+="#"+e+"#";p+=e.length+2;continue}l+=b[e];p+=e.length+2;break;case 1:e=c.substr(p,45);e=Jb.exec(e);if(null===e){l+="<";p++;continue}e=e[1];if(!(b[e]&&b[e]instanceof Array)){l+=
"<";p++;continue}p+=e.length+22;f=c.indexOf("\x3c!-- END REPEAT "+e+" --\x3e",p);if(-1===f){l+="\x3c!-- START REPEAT "+e+" --\x3e";continue}g=f-p;q=c.substr(p,g);h=b[e];for(f=0;f<h.length;f++)l+=nb(q,h[f]);p+=e.length+g+20}}}function Ba(d){var b=a.trim(d.val()),c=0,f=0;Ua.hide();if(""===b)return!0;m=Va.exec(b);if(null===m){m=Kb.exec(b);if(null===m)return Ua.show(),!1;c=0;f=m[1]}else c=m[1]?parseInt(m[1],10):0,f=m[2]?parseInt(m[2],10):0;0===c&&0===f?d.val(""):(b=0<c?c+" hour":"",1<c&&(b+="s"),c=0<
f?f+" min":"",1<f&&(c+="s"),d.val(a.trim(b+" "+c)));return!0}function ob(d){var b,c,f="";for(b=0;b<d.length;b++)c=d[b],3===c.nodeType?(c=a.trim(c.nodeValue),""!==c&&(f+=c+"\n")):1===c.nodeType&&0<c.childNodes.length&&(f+=ob(c.childNodes));return f}function pb(){var d;a(Wa,r).remove();d=W.selection.getNode();"#document"===d.nodeName&&(d=Ca[0]);if("BODY"===d.nodeName.toUpperCase())a(d).hasClass("mceContentBody")||(d=Ca[0]),a(d).append("&nbsp;"+Da);else{for(;d.parentNode&&"BODY"!==d.parentNode.nodeName.toUpperCase();)d=
d.parentNode;d.parentNode?"DIV"===d.nodeName.toUpperCase()||"SPAN"===d.nodeName.toUpperCase()?a(d,r).after(Da):a(d,r).before(Da):(d=Ca[0],a(d).append("&nbsp;"+Da))}ba=-1;return a(Wa,r)}function Lb(a,b,c){}function Mb(d){switch(d.type){case "js":a("head").append(a('<script type="text/javascript">'+d.js+"\x3c/script>"));t[d.f]();break;case "html":a(d.dest).html(d.html)}}function Nb(){Ea.unbind(I);Fa.unbind(I);G.dialog(M);Xa=!0;Ya()}function Ob(a,b){var c,f="",e;e=a.recipe;"success"!==b&&(G.dialog(M),
Xa=!0,Ya());N.val(g(e.recipe_title));B=e.recipe_image;O.val("");e.author?E.val(g(e.author)):E.val("");X.val(e.cuisine||"");O.val(e.mealType||"");Za.val("");P.val(g(e.summary));m=qb.exec(e.prep_time);null!==m?(c=m[1]?m[1]+"h ":"",C.val(c+m[2]+"m")):C.val(g(e.prep_time));m=qb.exec(e.cook_time);null!==m?(c=m[1]?m[1]+"h ":"",D.val(c+m[2]+"m")):D.val(g(e.cook_time));Y.val(g(e.yield));ca.val(g(e.serving_size));e.nutrition?(c=e.nutrition,da.val(g(c.calories)),ea.val(g(c.totalFat)),ja.val(g(c.saturatedFat)),
ka.val(g(c.unsaturatedFat)),la.val(g(c.transFat)),ma.val(g(c.totalCarbohydrates)),na.val(g(c.sugars)),oa.val(g(c.sodium)),pa.val(g(c.dietaryFiber)),qa.val(g(c.protein)),ra.val(g(c.cholesterol))):(da.val(g(e.calories)),ea.val(g(e.fat)));for(c=0;c<a.ingredients.length;c++)f+=Pb(g(a.ingredients[c]))+"\n";sa.val(f);ta.val(g(e.instructions.replace("\r","")));ua.val(g(e.notes));y.dialog("option","title","Update Recipe");G.dialog(M);Ga.hide();Ha.show();Ia.hide();""!==B&&rb(B,u.length,!0);h=pb();y.parent(".ui-dialog").css(z,
v);y.dialog(Q,z,v);y.dialog(R)}function Qb(){Ja.show();Ea.unbind(I);Fa.unbind(I);a.post(ajaxurl,{action:"easyrecipeConvert",id:$a,type:Ka},Ob,"json")}function ab(d){var b,c,f=0,e="",g="",h="",k="",m=["instruction","method","cooking method","procedure","direction"];c=["ingredients?"];var r=["note","cooking note"],q,n;q=a.parseJSON(t.ingredients);n=a.parseJSON(t.instructions);b=a.parseJSON(t.notes);-1===a.inArray(q,c)&&c.push(q);q="^\\s*(?:"+c.join("|")+")";q=new RegExp(q,"i");-1===a.inArray(n,m)&&
c.push(n);m="^\\s*(?:"+m.join("|")+")";m=new RegExp(m,"i");-1===a.inArray(b,r)&&r.push(b);r="^\\s*(?:"+r.join("|")+")\\s*$";r=new RegExp(r,"i");d=a("<div>"+d+"</div>");d=ob(d[0].childNodes);d=d.split("\n");for(b=0;b<d.length;b++)if(c=a.trim(d[b]),""!==c)if(m.test(c))f=2;else if(q.test(c))f=1;else if(r.test(c))f=3;else switch(f){case 0:e+=c+"\n";break;case 1:g+=c+"\n";break;case 2:h+=c+"\n";break;case 3:k+=c+"\n"}return{summary:e,ingredients:g,instructions:h,notes:k}}function sb(){A.parent(".ui-dialog").css(z,
v);A.dialog(Q,z,v);A.dialog(R)}function fa(d,b,c){J.append('<div class="ERPhoto"><img style="position:relative" id="ERPhoto_'+b+'" /></div>');u[b]=a("#ERPhoto_"+b,J);u[b].data("src",d);c&&(a(".ERPhoto",J).removeClass(ga),u[b].parent().addClass(ga),K=b,B=d);""===La&&(La=d);c=new Image;a.data(c,"index",b);c.onload=function(){var c,b,d=a.data(this,"index");c=this.width/150;b=this.height/112;c=c>b?c:b;b=Math.floor(this.height/c);c=Math.floor(this.width/c);u[d].height(b);u[d].width(c);u[d].css("top",(112-
b)/2);u[d].attr("src",this.src);0===d&&a("#ERDTabs").find(".divERNoPhotos").remove()};c.src=d}function Rb(){fa(bb.val(),u.length,!0);bb.val("");cb.hide();a(".divERNoPhotos").remove()}function Ma(a,b){var c,f=!1;for(c=0;c<u.length;c++)if(u[c].data("src")===a){f=!0;break}f||fa(a,u.length,b)}function Na(d,b){var c,f,e,p,l,k,m,n={},q=l="",w="";e="";if(b===va&&0!==H)sb();else if(d&&d.data===Oa&&(b=Oa,d=d.delegateTarget),typeof b===Aa&&typeof d===Aa&&(ba=0),H=1,ba=0,h=a(".easyrecipe:first",r),b!==va&&1<
h.length&&(h=a(h[b]),ba=b),k=a.support.cors?"json":"jsonp",a.ajax(Sb,{dataType:k,data:{v:t.version,p:0,u:t.wpurl},success:Mb,error:Lb}),db=!1,typeof tinyMCE!==Aa&&tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden()&&(db=!0),db){N.val("");O.val("");X.val("");Za.val("");E.val("");P.val("");C.val("");D.val("");Y.val("");sa.val("");ta.val("");ca.val("");da.val("");ea.val("");ja.val("");ka.val("");la.val("");ma.val("");na.val("");oa.val("");pa.val("");qa.val("");ra.val("");ua.val("");if(b!==va&&1===
h.length)y.dialog("option","title","Update Recipe"),Ia.hide(),Ga.hide(),Ha.show(),eb=!0;else{Pa=W.getContent();if(!Xa&&((k=Tb.exec(Pa)||Ub.exec(Pa)||Vb.exec(Pa))||(c=a("#hasRecipe").is(":checked")),k||c)){c?(Ka="recipress",$a=t.postID):(Ka=k[2],$a=k[3]);Ja.hide();Ea.click(Nb);Fa.click(Qb);e=Wb[Ka];l=a("#txtERCNVText1",G);l.html(l.html().replace("#plugin#",e));J.html("");K=-1;u=[];J.html(tb);G.parent(".ui-dialog").css(z,v);G.dialog(Q,z,v);G.dialog(R);return}t.isGuest&&(k=a("#inpERAuthor").val()||"",
E.val(k));Ga.show();Ha.hide();Ia.show();y.dialog("option","title","Add a New Recipe");eb=!1;!1!==Qa?n=ab(Qa):(k=W.selection.getContent(),20<k.length&&(n=ab(k)));n.summary&&(l=n.summary);n.ingredients&&(q=n.ingredients);n.instructions&&(w=n.instructions);n.notes&&(e=n.notes);h=pb()}n=h;h=a("<div>"+h.html()+"</div>");a("#inpERCuisine").autocomplete({source:a.parseJSON(t.cuisines)}).autocomplete("widget").wrap('<div class="easyrecipeUI" />');a("#inpERType").autocomplete({source:a.parseJSON(t.recipeTypes)}).autocomplete("widget").wrap('<div class="easyrecipeUI" />');
U=!1;ya.off("change",Ta).on("change",Ta);fb=!1;0<a(".hrecipe",r).length&&confirm("This post is already hrecipe microformatted\n\nDo you want me to try to convert it to an EasyRecipe?")&&(fb=!0);ha=b!==va?h.find(".endeasyrecipe").text():t.version;""===ha&&(ha="2.2");B=a('link[itemprop="image"]',h).attr("href")||"";J.html("");K=-1;La="";u=[];r.find("img").each(function(c){var b=!1;"3">ha?a(this).hasClass("photo")&&(b=!0):b=this.src===B;fa(this.src,c,b)});c=r.contents().text();k=ub.exec(c);for(m=u.length;null!==
k;)f=Xb.exec(k[0]),null!==f&&(f=f[1],fa(f,m),"3"<ha?B===f&&(u[m].parent().addClass(ga),K=m):Yb.test(k[0])&&(u[m].parent().addClass(ga),K=m,B=f),m++),k=ub.exec(c);""!==B&&Ma(B,!0);(vb=a("#set-post-thumbnail").find("img").attr("src"))&&Ma(vb,-1===K);-1===K&&0<u.length&&(K=0,B=La,u[0].parent().addClass(ga));J.click(function(){A.parent(".ui-dialog").css(z,v);A.dialog(Q,z,v);A.dialog(R)});0===u.length?J.html(tb):-1===K&&u[0].parent().addClass(ga);V=[];F=[];(k=h.find(".ERName .fn").html()||h.find(".ERName").html())&&
""!==k?N.val(x(g(k))):N.val(x(g(a("#title").val())));O.val(x(g(h.find(".type").html())));E.val(x(g(h.find(".author").html())));""===E.val()&&E.val(x(a.parseJSON(t.author)));X.val(x(g(h.find(".cuisine").html())));P.val(x(l+g(h.find(".summary").html())));"3"<ha?(l=h.find('time[itemprop="prepTime"]').html()||"",C.val(g(l)),l=h.find('time[itemprop="cookTime"]').html()||"",D.val(g(l))):(l=h.find(".preptime").html()||"",k=wb.exec(l),null!==k?C.val(g(k[1])):C.val(""),l=h.find(".cooktime").html()||"",k=wb.exec(l),
null!==k?D.val(g(k[1])):D.val(""));Y.val(g(h.find(".yield").html()));h.find(".ingredients li").each(function(c,b){q=a(b).hasClass(xb)?q+("!"+x(g(b.innerHTML))+"\n"):q+(x(g(b.innerHTML))+"\n")});sa.val(q);h.find(".instructions li, .instructions .ERSeparator").each(function(c,b){p=a.trim(b.innerHTML.replace(/^[ 0-9.]*(.*)$/ig,"$1"));w=a(b).hasClass(xb)?w+("!"+p+"\n"):w+(p+"\n")});ta.val(x(g(w)));ca.val(g(h.find(".servingSize").html()));da.val(g(h.find(".calories").html()));ea.val(g(h.find(".fat").html()));
ja.val(g(h.find(".saturatedFat").html()));ka.val(g(h.find(".unsaturatedFat").html()));la.val(g(h.find(".transFat").html()));ma.val(g(h.find(".carbohydrates").html()));na.val(g(h.find(".sugar").html()));oa.val(g(h.find(".sodium").html()));pa.val(g(h.find(".fiber").html()));qa.val(g(h.find(".protein").html()));ra.val(g(h.find(".cholesterol").html()));p=(g(h.find(".ERNotes").html())||"").replace(/<\/p>\n*<p>/ig,"\n\n").replace(/(?:<p>|<\/p>)/ig,"").replace(/<br *\/?>/ig,"\n");""===p&&""!==e&&(p=e);p=
x(p);p=p.replace(/\[br(?: ?\/)?\]/ig,"\n");ua.val(x(p));s&&(s.name&&N.val(x(g(s.name))),s.author&&E.val(x(s.author)),s.summary&&P.val(x(s.summary)),s.yield&&Y.val(g(s.yield)),s.type&&O.val(x(g(s.type))),s.cuisine&&X.val(x(g(s.cuisine))),s.prepTime&&C.val(g(s.prepTime)),s.cookTime&&D.val(g(s.cookTime)),s.summary&&P.val(x(s.summary)));h=n;y.parent(".ui-dialog").css(z,v);y.dialog(Q,z,v);y.dialog(R);y.dialog("option","position","center")}else alert("You must use the Visual Editor to add or update an EasyRecipe")}
function gb(d){H=a(".easyrecipe",r).length;Zb||0===H?Na(d,va):(A.parent(".ui-dialog").css(z,v),A.dialog(Q,z,v),A.dialog(R))}function $b(){y.dialog(M)}function ac(){confirm("Are you sure you want to delete this recipe?")&&(h.remove(),U=h=!1);y.dialog(M)}function bc(){var d=a("#inpERPaste"),b,c=d.val();b=ab(c);if(0!==b.ingredients.length||0!==b.instructions.length)Qa=c,d.val(""),s={name:w(aa(N.val())),author:w(n(E)),yield:n(Y),type:w(n(O)),cuisine:w(n(X)),summary:w(n(P)),servesize:n(ca),prepTime:C.val(),
cookTime:D.val()},U=!1,y.dialog(M),gb(null)}function hb(d){d=a(d.target).parent();var b=d.parent();d.hasClass("easyrecipeAbove")?b.before(yb):b.after(yb);d.remove();zb()}function zb(){var d,b;b=a("<div>"+r[0].body.innerHTML+"</div>");b.find(".easyrecipeAbove,.easyrecipeBelow").remove();d=b.find(".easyrecipe");d.each(function(){var c=a(this);c.parent().hasClass("easyrecipeWrapper")&&c.unwrap();Ab(c)});d=b.html();W.setContent(d);d=r.find(".easyrecipe");d.on("mousedown",null,Oa,Na);r.find(".ERInsertLine").on(I,
hb)}function cc(a){var b,c;b=a.prev();c=a.next();if(b=0===b.length||b.hasClass("easyrecipe")||b.hasClass("easyrecipeWrapper"))try{b=!(a[0].previousSibling&&3===a[0].previousSibling.nodeType)}catch(f){}if(c=0===c.length||c.hasClass("easyrecipe")||c.hasClass("easyrecipeWrapper"))try{c=!(a[0].nextSibling&&3===a[0].nextSibling.nodeType)}catch(e){}if(b||c)a.wrap('<div class="easyrecipeWrapper mceNonEditable" />'),a=a.parent(),b&&(a.prepend('<div class="easyrecipeAbove mceNonEditable"><input class="ERInsertLine mceNonEditable" type="button" value="Insert line above" /></div>'),
a.find("input").on(I,hb),dc.push(a.find(".easyrecipeAbove")[0])),c&&(a.append('<div class="easyrecipeBelow mceNonEditable"><input class="ERInsertLine mceNonEditable" type="button" value="Insert line below" /></div>'),a.find("input").on(I,hb))}function ib(){var d=a(".easyrecipe",r);0!==d.length&&(d.on("mousedown",null,Oa,Na),zb())}function Bb(){var d,b="",c,f="",e=0,g="",l,k,s,u=[],q,v;if(Ba(C)&&Ba(D)){c=a.trim(C.val());""!==c?(m=Va.exec(c),l=m[1]?parseInt(m[1],10):0,k=m[2]?parseInt(m[2],10):0,e=60*
l+k,f="PT"+(0<l?l+"H":"")+(0<k?k+"M":"")):c=!1;d=a.trim(D.val());""!==d?(m=Va.exec(d),l=m[1]?parseInt(m[1],10):0,k=m[2]?parseInt(m[2],10):0,e+=60*l+k,b="PT"+(0<l?l+"H":"")+(0<k?k+"M":"")):d=!1;0<e?(l=Math.floor(e/60),k=e%60,e=0<l?l+" hour":"",1<l&&(e+="s"),g=0<k?k+" min":"",1<k&&(g+="s"),e=a.trim(e+" "+g),g="PT"+(0<l?l+"H":"")+(0<k?k+"M":"")):e=!1;l=sa.val().split("\n");for(s=0;s<l.length;s++)k=l[s],""!==k&&("!"===k.charAt(0)?(q=!0,k=k.substr(1)):q=!1,u.push({ingredient:w(aa(k)),hasHeading:q}));l=
ta.val().split("\n");v=[];q={INSTRUCTIONS:[]};for(s=0;s<l.length;s++)k=a.trim(l[s].replace(/^[ 0-9\.]*(.*)$/ig,"$1")),""!==k&&("!"===k.charAt(0)?((0<q.INSTRUCTIONS.length||q.heading)&&v.push(q),k=k.substr(1),q={INSTRUCTIONS:[]},q.heading=aa(k)):q.INSTRUCTIONS.push({instruction:w(aa(k))}));(0<q.INSTRUCTIONS.length||q.heading)&&v.push(q);(k=n(ua))&&(k=k.replace(/\n/g,"[br]"));d={version:t.version,hasPhoto:""!==B,photoURL:B,name:w(aa(N.val())),author:w(n(E)),preptime:c,cooktime:d,totaltime:e,preptimeISO:f,
cooktimeISO:b,totaltimeISO:g,yield:n(Y),type:w(n(O)),cuisine:w(n(X)),summary:w(n(P)),servesize:n(ca),calories:n(da),fat:n(ea),satfat:n(ja),unsatfat:n(ka),transfat:n(la),carbs:n(ma),sugar:n(na),sodium:n(oa),fiber:n(pa),protein:n(qa),cholesterol:n(ra),notes:w(k),INGREDIENTS:u,STEPS:v};""===d.name&&(d.name=!1);d=nb(t.recipeTemplate,d);fb&&a(".hrecipe",r).remove();-1===ba?h=a(Wa,r):(h=a(".easyrecipe",r),0<h.length&&(h=a(h[ba])));h.before(d);h.remove();h=!1;Z.show();U=!1;y.dialog(M);H=a(".easyrecipe",
r).length;ib()}}function ec(d,b,c){s=!1;if("3"<tinymce.majorVersion){if(b.id!==L&&"wp_mce_fullscreen"!==b.id){a("#"+b.controlManager.buttons.easyrecipeTest._id).hide();a("#"+b.controlManager.buttons.easyrecipeEdit._id).hide();a("#"+b.controlManager.buttons.easyrecipeAdd._id).hide();return}b.id===L?(r=a("#"+L+"_ifr").contents(),v=1E4,d=a("#"+b.controlManager.buttons.easyrecipeTest._id),Z=a("#"+b.controlManager.buttons.easyrecipeEdit._id)):(r=a("#wp_mce_fullscreen_ifr").contents(),v=200001,d=a("#mce_fullscreen_easyrecipeTest"),
Z=a("#mce_fullscreen_easyrecipeEdit"))}else{if(b.editorId!==L&&"wp_mce_fullscreen"!==b.editorId){a("#"+b.editorId+"_easyrecipeTest").hide();a("#"+b.editorId+"_easyrecipeEdit").hide();a("#"+b.editorId+"_easyrecipeAdd").hide();return}b.editorId===L?(r=a("#"+L+"_ifr").contents(),v=1E4,d=a("#"+L+"_easyrecipeTest"),Z=a("#"+L+"_easyrecipeEdit")):(r=a("#wp_mce_fullscreen_ifr").contents(),v=200001,d=a("#mce_fullscreen_easyrecipeTest"),Z=a("#mce_fullscreen_easyrecipeEdit"))}Ca=a("body",r);b=a(".easyrecipe",
r);W=tinyMCE.activeEditor;b.each(function(){a(this).addClass("mceNonEditable");a(".ERRatingOuter",this).remove();a(".ERHDPrint",this).remove();a(".ERLinkback",this).remove()});H=b.length;0<H&&""!==t.testURL?d.show():d.hide();0<H?Z.show():Z.hide();r.hasERCSS||(a("head",r).append('<link rel="stylesheet" type="text/css" href="'+t.easyrecipeURL+'/css/easyrecipe-entry.css" />'),r.hasERCSS=!0);ib()}function fc(){Cb.toggleClass("ERNone");jb.toggleClass("ERContract")}function gc(){Db.toggleClass("ERNone");
kb.toggleClass("ERContract")}function hc(d){var b;b=a("#ertmp_"+Eb,r);F.push('href="'+d.href+'"'+(d.target?' target="'+d.target+'"':"")+(d.title?' title="'+d.title+'"':""));ia.val(S.substring(0,wa)+"[url:"+F.length+"]"+S.substring(wa,xa)+"[/url]"+S.substring(xa));ia[0].focus();b.remove()}function ic(d){var b,c,f;t.isEntryDialog&&(b=a("#ertmp_"+Eb,r),"string"===typeof d?c=a(d):(d=b.html(),"link"===d?b=c=b.parent("a"):c=a(b.html())),c.is("a")&&(d=c.attr("href"),f=c.attr("title"),c=c.attr("target"),
d='href="'+d+'"'+(c?' target="'+c+'"':"")+(f?' title="'+f+'"':""),F.push(d),ia.val(S.substring(0,wa)+"[url:"+F.length+"]"+S.substring(wa,xa)+"[/url]"+S.substring(xa))),ia[0].focus(),b.remove())}function lb(a,b){var c,f,e,g,h;c=a.sizes[b.size];f=c.url;g=c.width;h=c.height;fa(f,u.length);c=S.substring(0,wa);V.push('src="'+f+'" width="'+g+'" height="'+h+'"class="align'+b.align+'"');"none"===b.link?c+="[img:"+V.length+"]":("file"===b.link?e=f:"post"===b.link?e=a.link:"custom"===b.link&&(e=b.linkUrl),
F.push('href="'+e+'"'),c+="[url:"+F.length+"][img:"+V.length+"][/url]");c+=S.substring(xa);ia.val(c);ia[0].focus()}function jc(){sb()}function kc(){s=!1;gb()}function lc(){s=!1;Na()}function mc(){0<H&&!t.noHTMLWarn&&(t.noHTMLWarn=!0,T.parent(".ui-dialog").css(z,v),T.dialog(Q,z,v),T.dialog(R))}function nc(d){var b,c;if("dopreview"===a("#wp-preview",d.target).val()||0===H)return!0;(d=tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden())?b=a("<div>"+W.getContent()+"</div>"):(c=a("#wp-content-editor-container").find("textarea"),
b=a("<div>"+c.val()+"</div>"));var f=a(".easyrecipeWrapper",b);a(".easyrecipeAbove,.easyrecipeBelow",f).remove();a(".easyrecipe",f).unwrap();a(".easyrecipe",b).removeClass("mceNonEditable");b=a.trim(b.html());d?W.setContent(b):c.val(b);return!0}function oc(d){""!=d.target.innerHTML&&(d=a(d.target).find("img").attr("src"))&&Ma(d,!1)}function pc(d){var b,c;d=d[0];for(b=0;b<d.addedNodes.length;b++)if(c=a(d.addedNodes[b].innerHTML),c=c.find("img").attr("src")){Ma(c,!1);break}}var Pb=jQuery.trim,W,db,
N,P,sa,ta,C,D,Y,L,E,O,X,Za,Ua,Xa=!1,fb,Pa,h,eb,Hb=/\x3c!-- START INCLUDEIF (!?)([_a-z][_0-9a-z]{0,19}) --\x3e/i,Ib=/^#([_a-z][_0-9a-z]{0,19})#/im,Jb=/\x3c!-- START REPEAT ([_a-zA-Z][_0-9a-zA-Z]{0,19}) --\x3e/m,vb,wb=/^([^<]*)/,Va=/^(?:([0-9]+) *(?:h|hr|hrs|hour|hours))? *(?:([0-9]+) *(?:m|mn|mns|min|mins|minute|minutes))?$/i,Kb=/^([0-9]+)$/,Tb=/(.*)\[amd-(recipeseo|zlrecipe)-recipe:([0-9]+)\](.*)/,Ub=/(.*)\[(yumprint)-recipe\s+id='(\d+)'\](.*)/i,Vb=/(.*)\[(gmc)_recipe\s+([0-9]+)\](.*)/,$a,Ka,Ya,Qa,
qb=/PT(?:([0-9]*)+H)?([0-9]+)+M/i,ub=/\[(?:img) +(?:[^\]]+?)\]/ig,Yb=/class\s*=\s*"(?:[^"]+ )?photo[ "]/i,Xb=/src\s*=\s*" *([^"]+?) *"/i,Wb={recipeseo:"Recipe SEO",ziplist:"ZipList",zlrecipe:"ZipList",yumprint:"Yumprint Recipe Card",recipress:"ReciPress",gmc:"GetMeCooking"},F=[],V=[],wa,xa,S,Eb=0,ia,t,T,Da='<div class="easyrecipeholder">EasyRecipe</div>',Wa=".easyrecipeholder",xb="ERSeparator",y,A,G,r=null,Ca,v,m,Q="option",z="zIndex",za,Ra,Sa,u,J,Ia,Ja,Ea,Fa,Ga,Ha,Cb,jb,Db,kb,ca,da,ea,ja,ka,la,ma,
na,oa,pa,qa,ra,ua,Z,H=0,ba,Zb=!0,cb,bb,K,mb,$,M="close",I="click",Aa="undefined",R="open",ga="ERPhotoSelected",Sb="http://www.easyrecipeplugin.com/checkUpdates.php",tb='<div class="divERNoPhotos">There are no photos in this post<br />Add photos anywhere in the post</div>',ha,va=-1,Oa=-2,B="",La,yb="&nbsp;",Ab,rb,s,dc=[],U=!1,ya;"use strict";a(function(){var d,b;b=null;t=EASYRECIPE;t.button!==a.fn.button&&(b=a.fn.button,a.fn.button=t.button);y=a("#easyrecipeEntry");A=a("#easyrecipeUpgrade");T=a("#easyrecipeHTMLWarn");
L=t.isGuest?"guestpost":"content";y.dialog({autoOpen:!1,width:655,modal:!0,dialogClass:"easyrecipeEntry",beforeClose:function(){if(U){if(!window.confirm("Are you sure you want to close without saving the recipe?"))return!1;U=!1}return!0},close:function(){t.isEntryDialog=!1;h&&!eb&&h.remove();h=!1;a(".easyrecipeEntry").filter(function(){return""===a(this).text()}).remove()},open:function(){t.isEntryDialog=!0;a(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />');za.tabs({active:0,beforeActivate:Fb});
setTimeout(function(){var c=a(".easyrecipeEntry"),b=c.offset();b.top<mb&&(b.top=mb,c.offset(b))},250)}});y.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');ya=a("#divERContainer").show();T.dialog({autoOpen:!1,width:420,modal:!0,dialogClass:"easyrecipeHTMLWarn",close:function(){a(".easyrecipeHTMLWarn").filter(function(){return""===a(this).text()}).remove()},open:function(){a(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});T.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');
a(".divERHTMLWarnContainer").show();A.dialog({autoOpen:!1,width:420,modal:!0,dialogClass:"easyrecipeUpgrade",close:function(){a(".easyrecipeUpgrade").filter(function(){return""===a(this).text()}).remove()},open:function(){a(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});A.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');a(".divERUPGContainer").show();G=a("#easyrecipeConvert");Ja=a("#divERCNVSpinner");Ea=a("#btnERCNVCancel");Fa=a("#btnERCNVOK");Ja.hide();G.dialog({autoOpen:!1,
width:390,modal:!0,dialogClass:"easyrecipeConvert",close:function(){a(".easyrecipeConvert").filter(function(){return""===a(this).text()}).remove()},open:function(){a(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});a("#divERCNVContainer").show();G.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');a(window).bind("easyrecipeadd",kc);a(window).bind("easyrecipeedit",lc);a(window).bind("easyrecipeload",ec);a(window).bind("easyrecipeimage",lb);a(window).bind("easyrecipeguestimageuploaded",
lb);Sa=a("#divERNext");Ra=a("#btnERButtons");za=a("#ERDTabs");J=a("#divERPhotos");a("input:submit",".easyrecipeUI").button();a("#ed_toolbar");N=a("#inpERName");E=a("#inpERAuthor");O=a("#inpERType");X=a("#inpERCuisine");Za=a("#inpERTags");P=a("textarea#taERSummary");sa=a("textarea#taERIngredients");ta=a("textarea#taERInstructions");C=a("#inpERPrepTime");D=a("#inpERCookTime");Y=a("#inpERYield");ca=a("#inpERServeSize");da=a("#inpERCalories");ea=a("#inpERFat");ja=a("#inpERSatFat");ka=a("#inpERUnsatFat");
la=a("#inpERTransFat");ma=a("#inpERCarbs");na=a("#inpERSugar");oa=a("#inpERSodium");pa=a("#inpERFiber");qa=a("#inpERProtein");ra=a("#inpERCholesterol");ua=a("textarea#taERNotes");cb=a("#divERAddImageURL");d=a("#lnkERPhotoURL");Ua=a(".ERTimeError");Ga=a("#divERAdd");Ha=a("#divERChange");a("#divERHeader");Cb=a("#divEROther");jb=a("#divEROtherLabel");Db=a("#divERNotes");kb=a("#divERNotesLabel");Ia=a("#ERDPasteTab");bb=a("#fldERAPUImageURL");a("#btnERAdd").click(Bb);a("#btnERNext").click(Gb);a("#btnERChange").click(Bb);
a("#btnERDelete").click(ac);a("#btnERCancel").click($b);d.click(function(){A.parent(".ui-dialog").css(z,v);A.dialog(Q,z,v);A.dialog(R)});a("#btnERAIUCancel").click(function(){cb.hide()});a("#btnERAIUOK").click(Rb);jb.click(fc);kb.click(gc);C.change(function(b){Ba(a(b.target))});D.change(function(b){Ba(a(b.target))});a("#btnERPaste").click(bc);mb=a("#wpadminbar").height();$=a("#divEREditBtns").on("mousedown","li",jc);ya.find('input[type="text"], textarea').on("blur",function(){}).on("focus",function(){a(this)});
a("#wp-link").bind("wpdialogclose",ic);t.insertLink=hc;Ya=gb;Qa=!1;t.insertUploadedImage=lb;Ab=cc;rb=fa;t.addListener=ib;T.find("input").on(I,function(){T.dialog(M)});a("#wp-content-editor-tools").on(I,"#content-html",mc);a("#post").on("submit",nc);null!==b&&(a.fn.button=b);d=a("#postimagediv").find(".inside");if(window.MutationObserver&&0<d.length)b=new MutationObserver(pc),b.observe(d[0],{childList:!0});else d.on("DOMSubtreeModified",oc);window.QTags&&QTags.addButton("easyrecipe","EasyRecipe",function(){alert("Switch to the Visual Editor to add or edit an EasyRecipe")},
"","","",900)})})(jQuery);
