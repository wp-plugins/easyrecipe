/*! EasyRecipe 3.2.2885 Copyright (c) 2014 BoxHill LLC */
window.EASYRECIPE=window.EASYRECIPE||{},EASYRECIPE.widget=EASYRECIPE.widget||jQuery.widget,EASYRECIPE.button=EASYRECIPE.button||jQuery.fn.button,function(e){function t(e,t){var i;switch(Pt.show(),ui.hide(),Ut.show(),i=t.newTab?t.newTab.index():t.index){case 0:ui.css("right","10px"),ui.show();break;case 3:ui.css("right","inherit"),Ut.hide(),ui.show();break;case 4:Pt.hide()}}function i(){yi.off("change",i),on=!0}function n(e){return e?(e+="",e.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&nbsp;/g," ")):""}function a(t){return t?e("<div />").text(t).html():""}function r(t){return e.trim(a(t.val()))||!1}function s(){var e=At.tabs("option","active");At.tabs("option","active",++e)}function o(e){var t,i=/\[img +(.*?) *\/?]/i,n=/\[url ([^\]]+)](.*?\[\/url])/i,a=/\[cap ([^\]]+)](.*])(.*?)\[\/cap]/i;if(""!==e){for(t=i.exec(e);null!==t;)Di.push(t[1].replace(/</g,"&lt;").replace(/>/g,"&gt;")),e=e.replace(i,"[img:"+Di.length+"]"),t=i.exec(e);for(t=n.exec(e);null!==t;)Oi.push(t[1]),e=e.replace(n,"[url:"+Oi.length+"]$2"),t=n.exec(e);for(t=a.exec(e);null!==t;)Li.push(t[1]),Hi.push(t[3].replace(/</g,"&lt;").replace(/>/g,"&gt;")),e=e.replace(a,"[cap:"+Li.length+"]$2[/cap]"),t=a.exec(e)}return e}function l(e){var t,i,n,a=/\[img:(\d+)]/i,r=/\[url:(\d+)](.*?)\[\/url]/i,s=/\[cap:(\d+)](.*])\[\/cap]/i;if(e){for(n=a.exec(e);null!==n;)t=Di[n[1]-1].replace(/&quot;/g,"&amp;quot;"),e=e.replace(a,"[img "+t+"]"),n=a.exec(e);for(n=r.exec(e);null!==n;)t=Oi[n[1]-1],e=e.replace(r,"[url "+t+"]$2[/url]"),n=r.exec(e);for(n=s.exec(e);null!==n;)t=Li[n[1]-1],i=Hi[n[1]-1],e=e.replace(s,"[cap "+t+"]$2"+i+"[/cap]"),n=r.exec(e)}return e}function c(e,t){var i,n,a,r,s,o,l,p,d,u,h,v,f,g,m,y,E,R,b,w,T,C,x,N,I,k=0,S=1,_=2,A=0,P="",U="<!-- START REPEAT ",M="<!-- START INCLUDEIF ",O="<!-- END INCLUDEIF ";for(i=e,t=t||{};;){if(s=i.length,o=i.indexOf("#",A),-1!==o&&(s=o,l=k),p=i.indexOf(U,A),-1!==p&&s>p&&(s=p,l=S),d=i.indexOf(M,A),-1!==d&&s>d&&(s=d,l=_),s===i.length)return P+i.substr(A);switch(u=s-A,P+=i.substr(A,u),A=s,l){case _:if(a=i.substr(A,44),r=bi.exec(a),null===r)break;if(h=r[1],v="!"!==h,f=r[2],g=O+h+f+" -->",m=g.length,y=i.indexOf(g),-1===y){A++;break}E=typeof t[f]!==Qi&&t[f]!==!1,E===v?(R="<!-- START INCLUDEIF "+h+f+" -->",b=R.length,i=i.substr(0,A)+i.substr(A+b,y-A-b)+i.substr(y+m)):i=i.substr(0,A)+i.substr(y+m);break;case k:if(a=i.substr(A,22),r=wi.exec(a),null===r){P+="#",A++;continue}if(w=r[1],""!==t[w]&&!t[w]){P+="#"+w+"#",A+=w.length+2;continue}P+=t[w],A+=w.length+2;break;case S:if(a=i.substr(A,45),r=Ti.exec(a),null===r){P+="<",A++;continue}if(T=r[1],!(t[T]&&t[T]instanceof Array)){P+="<",A++;continue}if(A+=T.length+22,C=i.indexOf("<!-- END REPEAT "+T+" -->",A),-1===C){P+="<!-- START REPEAT "+T+" -->";continue}for(x=C-A,N=i.substr(A,x),I=t[T],n=0;n<I.length;n++)P+=c(N,I[n]);A+=T.length+x+20}}}function p(t){var i,n,a=e.trim(t.val()),r=0,s=0;if(lt.hide(),""===a)return!0;if(_t=xi.exec(a),null===_t){if(_t=Ni.exec(a),null===_t)return lt.show(),!1;r=0,s=_t[1]}else r=_t[1]?parseInt(_t[1],10):0,s=_t[2]?parseInt(_t[2],10):0;return 0===r&&0===s?t.val(""):(i=r>0?r+" hour":"",r>1&&(i+="s"),n=s>0?s+" min":"",s>1&&(n+="s"),t.val(e.trim(i+" "+n))),!0}function d(t){var i,n,a,r="";for(i=0;i<t.length;i++)n=t[i],3!==n.nodeType?1===n.nodeType&&n.childNodes.length>0&&(r+=d(n.childNodes)):(a=e.trim(n.nodeValue),""!==a&&(r+=a+"\n"));return r}function u(){var t;if(e($i,Bi).remove(),t=q.selection.getNode(),"#document"===t.nodeName&&(t=kt[0]),"BODY"===t.nodeName.toUpperCase())e(t).hasClass("mceContentBody")||(t=kt[0]),/^<p><br[^>]*><\/p>$/.test(t.innerHTML)?e(t).prepend(Yi):e(t).append("&nbsp;"+Yi);else{for(;t.parentNode&&"BODY"!==t.parentNode.nodeName.toUpperCase();)t=t.parentNode;t.parentNode?"DIV"===t.nodeName.toUpperCase()||"SPAN"===t.nodeName.toUpperCase()?e(t,Bi).after(Yi):e(t,Bi).before(Yi):(t=kt[0],e(t).append("&nbsp;"+Yi))}return oi=-1,e($i,Bi)}function h(){}function v(t){switch(t.type){case"js":e("head").append(e('<script type="text/javascript">'+t.js+"</script>")),Tt[t.f]();break;case"html":e(t.dest).html(t.html)}}function f(){Ht.unbind(Ji),zt.unbind(Ji),It.dialog(Gi),Ri=!0,gt()}function g(t,i){var a,r,s,o="";for(r=t.recipe,"success"!==i&&(It.dialog(Gi),Ri=!0,gt()),Q.val(n(r.recipe_title)),r.rating&&e.isNumeric(r.rating)&&J.val(r.rating),an=r.recipe_image,rt.val(""),r.author?at.val(n(r.author)):at.val(""),st.val(r.cuisine||""),rt.val(r.mealType||""),ot.val(""),Z.val(n(r.summary)),_t=_i.exec(r.prep_time),null!==_t?(a=_t[1]?_t[1]+"h ":"",et.val(a+_t[2]+"m")):et.val(n(r.prep_time)),_t=_i.exec(r.cook_time),null!==_t?(a=_t[1]?_t[1]+"h ":"",tt.val(a+_t[2]+"m")):tt.val(n(r.cook_time)),it.val(n(r.yield)),qt.val(n(r.serving_size)),r.nutrition?(s=r.nutrition,Gt.val(n(s.calories)),Jt.val(n(s.totalFat)),Qt.val(n(s.saturatedFat)),Zt.val(n(s.unsaturatedFat)),Kt.val(n(s.transFat)),Xt.val(n(s.totalCarbohydrates)),ei.val(n(s.sugars)),ti.val(n(s.sodium)),ii.val(n(s.dietaryFiber)),ni.val(n(s.protein)),ai.val(n(s.cholesterol))):(Gt.val(n(r.calories)),Jt.val(n(r.fat))),a=0;a<t.ingredients.length;a++)o+=Ei(n(t.ingredients[a]))+"\n";K.val(o),X.val(n(r.instructions.replace("\r",""))),ri.val(n(r.notes)),xt.easyrecipeDialog("option","title","Update Recipe"),It.dialog(Gi),Ft.hide(),jt.show(),Dt.hide(),""!==an&&gi(an,Mt.length,!0),pt=u(),xt.easyrecipeDialog(Zi)}function m(){var t;Lt.show(),Ht.unbind(Ji),zt.unbind(Ji),t={action:"easyrecipeConvert",id:vt,type:ft},e.post(ajaxurl,t,g,"json")}function y(t){var i,n,a,r,s,o,l,c,p,u,h,v,f,g=0,m="",y="",E="",R="",b=["instruction","method","cooking method","procedure","direction"],w=["ingredients?"],T=["note","cooking note"];for(h=e.parseJSON(Tt.ingredients),v=e.parseJSON(Tt.instructions),f=e.parseJSON(Tt.notes),-1===e.inArray(h,w)&&w.push(h),o="^\\s*(?:"+w.join("|")+")",p=new RegExp(o,"i"),-1===e.inArray(v,b)&&w.push(v),s="^\\s*(?:"+b.join("|")+")",c=new RegExp(s,"i"),-1===e.inArray(f,T)&&T.push(f),l="^\\s*(?:"+T.join("|")+")\\s*$",u=new RegExp(l,"i"),r=e("<div>"+t+"</div>"),i=d(r[0].childNodes),i=i.split("\n"),n=0;n<i.length;n++)if(a=e.trim(i[n]),""!==a)if(c.test(a))g=2;else if(p.test(a))g=1;else if(u.test(a))g=3;else switch(g){case 0:m+=a+"\n";break;case 1:y+=a+"\n";break;case 2:E+=a+"\n";break;case 3:R+=a+"\n"}return{summary:m,ingredients:y,instructions:E,notes:R}}function E(){Nt.dialog(Zi)}function R(t,i,n){var a,r=function(){var t,i,n,a,r=e.data(this,"index");t=this.width/150,i=this.height/112,t=t>i?t:i,n=Math.floor(this.height/t),a=Math.floor(this.width/t),Mt[r].height(n),Mt[r].width(a),Mt[r].css("top",(112-n)/2),Mt[r].attr("src",this.src),0===r&&e("#ERDTabs").find(".divERNoPhotos").remove()};Ot.append('<div class="ERPhoto"><img style="position:relative" id="ERPhoto_'+i+'" /></div>'),Mt[i]=e("#ERPhoto_"+i,Ot),Mt[i].data("src",t),n&&(e(".ERPhoto",Ot).removeClass(Ki),Mt[i].parent().addClass(Ki),pi=i,an=t),""===vi&&(vi=t),a=new Image,e.data(a,"index",i),a.onload=r,a.src=t}function b(){R(ci.val(),Mt.length,!0),ci.val(""),li.hide(),e(".divERNoPhotos").remove()}function w(e,t){var i,n=!1;for(i=0;i<Mt.length;i++)if(Mt[i].data("src")===e){n=!0;break}n||R(e,Mt.length,t)}function T(t,a){var r,s,l,c,p,d,g,b,T,C,x,N,I,k,S,_,A,P=!1,U=!1,M={},O="",D="",L="",H="";if(!t||1===t.which){if(a===tn&&0!==Vi)return E(),void 0;if(t&&t.data===nn&&(a=nn,t=t.delegateTarget),typeof a===Qi&&typeof t===Qi&&(oi=0),Vi=1,oi=0,pt=e(".easyrecipe:first",Bi),a!==tn&&pt.length>1&&(pt=e(pt[a]),oi=a),s=0,x=e.support.cors?"json":"jsonp",e.ajax(Xi,{dataType:x,data:{v:Tt.version,p:s,u:Tt.wpurl},success:v,error:h}),G=!1,typeof tinyMCE!==Qi&&tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden()&&(G=!0),!G)return alert("You must use the Visual Editor to add or update an EasyRecipe"),void 0;if(Q.val(""),rt.val(""),st.val(""),ot.val(""),at.val(""),Z.val(""),et.val(""),tt.val(""),it.val(""),K.val(""),X.val(""),qt.val(""),Gt.val(""),Jt.val(""),Qt.val(""),Zt.val(""),Kt.val(""),Xt.val(""),ei.val(""),ti.val(""),ii.val(""),ni.val(""),ai.val(""),ri.val(""),a!==tn&&1===pt.length)xt.easyrecipeDialog("option","title","Update Recipe"),Dt.hide(),Ft.hide(),jt.show(),dt=!0;else{if(ct=q.getContent(),!Ri&&(T=Ii.exec(ct)||ki.exec(ct)||Si.exec(ct),T||(P=e("#hasRecipe").is(":checked")),T||P||(r=Bi.find(".hrecipe").filter(".f1",".f2"),r.length>0&&(U=-1!==r.text().indexOf("recipage.com"))),T||P||U))return P?(ft="recipress",vt=Tt.postID):U?(ft="recipage",vt=Tt.postID):(ft=T[2],vt=T[3]),Lt.hide(),Ht.click(f),zt.click(m),d=Mi[ft],b=e("#txtERCNVText1",It),b.html(b.html().replace("#plugin#",d)),Ot.html(""),pi=-1,Mt=[],Ot.html(en),It.dialog(Zi),void 0;Tt.isGuest&&(S=e("#inpERAuthor").val()||"",at.val(S)),Ft.show(),jt.hide(),Dt.show(),xt.easyrecipeDialog("option","title","Add a New Recipe"),dt=!1,yt!==!1?M=y(yt):(k=q.selection.getContent(),k.length>20&&(M=y(k))),M.summary&&(O=M.summary),M.ingredients&&(D=M.ingredients),M.instructions&&(L=M.instructions),M.notes&&(H=M.notes),pt=u()}for(_=pt,pt=e("<div>"+pt.html()+"</div>"),e("#inpERCuisine").autocomplete({source:e.parseJSON(Tt.cuisines)}).autocomplete("widget").wrap('<div class="easyrecipeUI" />'),e("#inpERType").autocomplete({source:e.parseJSON(Tt.recipeTypes)}).autocomplete("widget").wrap('<div class="easyrecipeUI" />'),on=!1,yi.off("change",i).on("change",i),hi=a!==tn?pt.find(".endeasyrecipe").text():Tt.version,""===hi&&(hi="2.2"),an=e('link[itemprop="image"]',pt).attr("href")||"",Ot.html(""),pi=-1,vi="",Mt=[],Bi.find("img").each(function(t){var i=!1;"3">hi?e(this).hasClass("photo")&&(i=!0):i=this.src===an,R(this.src,t,i)}),p=Bi.contents().text(),T=Ai.exec(p),N=Mt.length;null!==T;)c=Ui.exec(T[0]),null!==c&&(l=c[1],R(l,N),hi>"3"?an===l&&(Mt[N].parent().addClass(Ki),pi=N):Pi.test(T[0])&&(Mt[N].parent().addClass(Ki),pi=N,an=l),N++),T=Ai.exec(p);""!==an&&w(an,!0),ht=e("#set-post-thumbnail").find("img").attr("src"),ht&&w(ht,-1===pi),-1===pi&&Mt.length>0&&(pi=0,an=vi,Mt[0].parent().addClass(Ki)),Ot.click(function(){Nt.dialog(Zi)}),0===Mt.length?Ot.html(en):-1===pi&&Mt[0].parent().addClass(Ki),Di=[],Oi=[],I=pt.find(".ERName .fn").html()||pt.find(".ERName").html(),I&&""!==I?Q.val(o(n(I))):Q.val(o(n(e("#title").val()))),rt.val(o(n(pt.find(".type").html()))),at.val(o(n(pt.find(".author").html()))),""===at.val()&&at.val(o(e.parseJSON(Tt.author))),st.val(o(n(pt.find(".cuisine").html()))),Z.val(o(O+n(pt.find(".summary").html()))),hi>"3"?(C=pt.find('time[itemprop="prepTime"]').html()||"",et.val(n(C)),C=pt.find('time[itemprop="cookTime"]').html()||"",tt.val(n(C))):(C=pt.find(".preptime").html()||"",T=Ci.exec(C),null!==T?et.val(n(T[1])):et.val(""),C=pt.find(".cooktime").html()||"",T=Ci.exec(C),null!==T?tt.val(n(T[1])):tt.val("")),it.val(n(pt.find(".yield").html())),pt.find(".ingredients li").each(function(t,i){D+=e(i).hasClass(Wi)?"!"+o(n(i.innerHTML))+"\n":o(n(i.innerHTML))+"\n"}),K.val(D),pt.find(".instructions li, .instructions .ERSeparator").each(function(t,i){g=e.trim(i.innerHTML.replace(/^[ 0-9.]*(.*)$/gi,"$1")),L+=e(i).hasClass(Wi)?"!"+g+"\n":g+"\n"}),X.val(o(n(L))),qt.val(n(pt.find(".servingSize").html())),Gt.val(n(pt.find(".calories").html())),Jt.val(n(pt.find(".fat").html())),Qt.val(n(pt.find(".saturatedFat").html())),Zt.val(n(pt.find(".unsaturatedFat").html())),Kt.val(n(pt.find(".transFat").html())),Xt.val(n(pt.find(".carbohydrates").html())),ei.val(n(pt.find(".sugar").html())),ti.val(n(pt.find(".sodium").html())),ii.val(n(pt.find(".fiber").html())),ni.val(n(pt.find(".protein").html())),ai.val(n(pt.find(".cholesterol").html())),A=_.parent().prop("data-rating"),J.val(e.isNumeric(A)?A:"5"),g=(n(pt.find(".ERNotes").html())||"").replace(/<\/p>\n*<p>/gi,"\n\n").replace(/(?:<p>|<\/p>)/gi,"").replace(/<br *\/?>/gi,"\n"),""===g&&""!==H&&(g=H),g=o(g),g=g.replace(/\[br(?: ?\/)?]/gi,"\n"),ri.val(o(g)),mi&&(mi.name&&Q.val(o(n(mi.name))),mi.author&&at.val(o(mi.author)),mi.summary&&Z.val(o(mi.summary)),mi.yield&&it.val(n(mi.yield)),mi.type&&rt.val(o(n(mi.type))),mi.cuisine&&st.val(o(n(mi.cuisine))),mi.prepTime&&et.val(n(mi.prepTime)),mi.cookTime&&tt.val(n(mi.cookTime)),mi.summary&&Z.val(o(mi.summary))),pt=_,xt.easyrecipeDialog(Zi),xt.easyrecipeDialog("option","position","center")}}function C(t){return Vi=e(".easyrecipe",Bi).length,qi||0===Vi?(T(t,tn),void 0):(Nt.dialog(Zi),void 0)}function x(){xt.easyrecipeDialog(Gi)}function N(){var e=confirm("Are you sure you want to delete this recipe?");e&&(pt.remove(),pt=!1,on=!1),xt.easyrecipeDialog(Gi)}function I(){var t,i=e("#inpERPaste"),n=i.val();t=y(n),(0!==t.ingredients.length||0!==t.instructions.length)&&(yt=n,i.val(""),mi={name:l(a(Q.val())),author:l(r(at)),yield:r(it),type:l(r(rt)),cuisine:l(r(st)),summary:l(r(Z)),servesize:r(qt),prepTime:et.val(),cookTime:tt.val()},on=!1,xt.easyrecipeDialog(Gi),C(null))}function k(t){var i=e(t.target).parent(),n=i.parent();i.hasClass("easyrecipeAbove")?n.before(rn):n.after(rn),i.remove(),S()}function S(){var t,i,n;i=e("<div>"+Bi[0].body.innerHTML+"</div>"),i.find(".easyrecipeAbove,.easyrecipeBelow").remove(),t=i.find(".easyrecipe"),t.each(function(){var t=e(this);t.parent().hasClass("easyrecipeWrapper")&&t.unwrap(),fi(t)}),n=i.html(),q.setContent(n),t=Bi.find(".easyrecipe"),t.on("mousedown",null,nn,T),Bi.find(".ERInsertLine").on(Ji,k)}function _(e){var t,i,n,a,r;if(a=e.prev(),r=e.next(),i=0===a.length||a.hasClass("easyrecipe")||a.hasClass("easyrecipeWrapper"))try{i=!(e[0].previousSibling&&3===e[0].previousSibling.nodeType)}catch(s){}if(n=0===r.length||r.hasClass("easyrecipe")||r.hasClass("easyrecipeWrapper"))try{n=!(e[0].nextSibling&&3===e[0].nextSibling.nodeType)}catch(s){}(i||n)&&(e.wrap('<div class="easyrecipeWrapper mceNonEditable" />'),t=e.parent(),i&&(t.prepend('<div class="easyrecipeAbove mceNonEditable"><input class="ERInsertLine mceNonEditable" type="button" value="Insert line above" /></div>'),t.find("input").on(Ji,k),sn.push(t.find(".easyrecipeAbove")[0])),n&&(t.append('<div class="easyrecipeBelow mceNonEditable"><input class="ERInsertLine mceNonEditable" type="button" value="Insert line below" /></div>'),t.find("input").on(Ji,k)))}function A(t){e(".easyrecipeAbove,.easyrecipeBelow",t).remove(),e(".easyrecipe",t).unwrap()}function P(){var t=e(".easyrecipe",Bi);0!==t.length&&(t.on("mousedown",null,nn,T),S())}function U(){var t,i,n,s,o,d,u,h,v,f,g,m,y,E,R="",b="",w=0,T="",C=[];if(p(et)&&p(tt)){for(i=e.trim(et.val()),""!==i?(_t=xi.exec(i),n=_t[1]?parseInt(_t[1],10):0,s=_t[2]?parseInt(_t[2],10):0,w=60*n+s,o=n>0?n+"H":"",d=s>0?s+"M":"",b="PT"+o+d):i=!1,t=e.trim(tt.val()),""!==t?(_t=xi.exec(t),n=_t[1]?parseInt(_t[1],10):0,s=_t[2]?parseInt(_t[2],10):0,o=n>0?n+"H":"",d=s>0?s+"M":"",w+=60*n+s,R="PT"+o+d):t=!1,w>0?(n=Math.floor(w/60),s=w%60,o=n>0?n+" hour":"",n>1&&(o+="s"),d=s>0?s+" min":"",s>1&&(d+="s"),w=e.trim(o+" "+d),o=n>0?n+"H":"",d=s>0?s+"M":"",T="PT"+o+d):w=!1,u=K.val().split("\n"),v=0;v<u.length;v++)h=u[v],""!==h&&("!"===h.charAt(0)?(f=!0,h=h.substr(1)):f=!1,C.push({ingredient:l(a(h)),hasHeading:f}));for(u=X.val().split("\n"),m=[],g={INSTRUCTIONS:[]},v=0;v<u.length;v++)h=e.trim(u[v].replace(/^[ 0-9\.]*(.*)$/gi,"$1")),""!==h&&("!"===h.charAt(0)?((g.INSTRUCTIONS.length>0||g.heading)&&m.push(g),h=h.substr(1),g={},g.INSTRUCTIONS=[],g.heading=l(a(h))):g.INSTRUCTIONS.push({instruction:l(a(h))}));(g.INSTRUCTIONS.length>0||g.heading)&&m.push(g),h=r(ri),h&&(h=h.replace(/\n/g,"[br]")),y={version:Tt.version,hasPhoto:""!==an,photoURL:an,name:l(a(Q.val())),author:l(r(at)),preptime:i,cooktime:t,totaltime:w,preptimeISO:b,cooktimeISO:R,totaltimeISO:T,yield:r(it),type:l(r(rt)),cuisine:l(r(st)),summary:l(r(Z)),servesize:r(qt),calories:r(Gt),fat:r(Jt),satfat:r(Qt),unsatfat:r(Zt),transfat:r(Kt),carbs:r(Xt),sugar:r(ei),sodium:r(ti),fiber:r(ii),protein:r(ni),cholesterol:r(ai),notes:l(h),rating:J.length?J.val():"0",INGREDIENTS:C,STEPS:m},""===y.name&&(y.name=!1),E=c(Tt.recipeTemplate,y),-1===oi?pt=e($i,Bi):(pt=e(".easyrecipe",Bi),pt.length>0&&(pt=e(pt[oi]))),pt.before(E),pt.remove(),pt=!1,si.css("display","inline-block"),on=!1,xt.easyrecipeDialog(Gi),Vi=e(".easyrecipe",Bi).length,P()}}function M(t,i){var n,a;if(mi=!1,tinymce.majorVersion>"3"){if(!nt[i.id]&&"wp_mce_fullscreen"!==i.id)return e("#"+i.controlManager.buttons.easyrecipeTest._id).hide(),e("#"+i.controlManager.buttons.easyrecipeEdit._id).hide(),e("#"+i.controlManager.buttons.easyrecipeAdd._id).hide(),void 0;nt[i.id]?(Bi=e("#"+i.id+"_ifr").contents(),St=1e4,n=e("#"+i.controlManager.buttons.easyrecipeTest._id),si=e("#"+i.controlManager.buttons.easyrecipeEdit._id)):(Bi=e("#wp_mce_fullscreen_ifr").contents(),St=200001,n=e("#mce_fullscreen_easyrecipeTest"),si=e("#mce_fullscreen_easyrecipeEdit"))}else{if(!nt[i.editorId]&&"wp_mce_fullscreen"!==i.editorId)return e("#"+i.editorId+"_easyrecipeTest").hide(),e("#"+i.editorId+"_easyrecipeEdit").hide(),e("#"+i.editorId+"_easyrecipeAdd").hide(),void 0;nt[i.editorId]?(Bi=e("#"+i.editorId+"_ifr").contents(),St=1e4,n=e("#"+i.editorId+"_easyrecipeTest"),si=e("#"+i.editorId+"_easyrecipeEdit")):(Bi=e("#wp_mce_fullscreen_ifr").contents(),St=200001,n=e("#mce_fullscreen_easyrecipeTest"),si=e("#mce_fullscreen_easyrecipeEdit"))}kt=e("body",Bi),a=e(".easyrecipe",Bi),q=tinyMCE.activeEditor,a.each(function(){var t=e(this);t.addClass("mceNonEditable"),t.find(".ERRatingOuter").remove(),t.find(".ERHDPrint").remove(),t.find(".ERLinkback").remove(),t.find(".endeasyrecipe").attr("title")}),Vi=a.length,Vi>0&&""!==Tt.testURL?n.show():n.hide(),Vi>0?si.css("display","inline-block"):si.hide(),Bi.hasERCSS||(e("head",Bi).append('<link rel="stylesheet" type="text/css" href="'+Tt.easyrecipeURL+"/css/easyrecipe-entry.css?ver="+Tt.version+'" />'),Bi.hasERCSS=!0),P()}function O(){$t.toggleClass("ERNone"),Wt.toggleClass("ERContract")}function D(){Bt.toggleClass("ERNone"),Vt.toggleClass("ERContract")}function L(t){var i,n,a,r;i=e("#ertmp_"+ji,Bi),n=t.title?' title="'+t.title+'"':"",a=t.target?' target="'+t.target+'"':"",r='href="'+t.href+'"'+a+n,Oi.push(r),wt.val(bt.substring(0,Et)+"[url:"+Oi.length+"]"+bt.substring(Et,Rt)+"[/url]"+bt.substring(Rt)),wt[0].focus(),i.remove()}function H(t){var i,n,a,r,s,o;Tt.isEntryDialog&&(i=e("#ertmp_"+ji,Bi),"string"==typeof t?a=e(t):(o=i.html(),"link"===o?(a=i.parent("a"),i=a):a=e(i.html())),a.is("a")&&(n=a.attr("href"),r=a.attr("title"),s=a.attr("target"),r=r?' title="'+r+'"':"",s=s?' target="'+s+'"':"",t='href="'+n+'"'+s+r,Oi.push(t),wt.val(bt.substring(0,Et)+"[url:"+Oi.length+"]"+bt.substring(Et,Rt)+"[/url]"+bt.substring(Rt))),wt[0].focus(),i.remove())}function z(t,i){var n,a,r,s,o,l,c,p,d,u,h,v,f,g,m;a=t.sizes[i.size],r=a.url,l=a.width,c=a.height,R(r,Mt.length),p=tinymce.html.Entities.encodeAllRaw(e.trim(t.title)),p=p.replace(/&quot;/g,"&amp;quot;"),d=tinymce.html.Entities.encodeAllRaw(e.trim(t.alt)),d=d.replace(/&quot;/g,"&amp;quot;"),u=tinymce.html.Entities.encodeAllRaw(e.trim(t.caption)),p=""!==p?' title="'+p+'"':"",d=""!==d?' alt="'+d+'"':"",h="align"+i.align,o=t.uploadedTo?'id="attachment_'+t.uploadedTo+'" ':"",n=bt.substring(0,Et),""!==u?(Li.push(o+'align="'+h+'" width="'+l+'"'),Hi.push(u),v="[cap:"+Li.length+"]",f="[/cap]",h=""):v=f="","none"===i.link?s=g=m="":"file"===i.link?s=r:"post"===i.link?s=t.link:"custom"===i.link&&(s=i.linkUrl),""!==s&&(Oi.push('href="'+s+'"'),g="[url:"+Oi.length+"]",m="[/url]"),Di.push('src="'+r+'" width="'+l+'" height="'+c+'" class="'+h+" size-"+i.size+'"'+p+d),n+=v+g+"[img:"+Di.length+"]"+m+f,n+=bt.substring(Rt),wt.val(n),wt[0].focus()}function F(e){e.stopPropagation(),E()}function j(){mi=!1,C()}function Y(){mi=!1,T()}function $(){Vi>0&&!Tt.noHTMLWarn&&(Tt.noHTMLWarn=!0,Ct.dialog(Zi))}function W(t){var i,n,a,r,s=e("#wp-preview",t.target).val();return"dopreview"===s?!0:0===Vi?!0:(a=tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden(),a?n=e("<div>"+q.getContent()+"</div>"):(r=e("#wp-content-editor-container").find("textarea"),n=e("<div>"+r.val()+"</div>")),A(e(".easyrecipeWrapper",n)),e(".easyrecipe",n).removeClass("mceNonEditable"),i=e.trim(n.html()),a?q.setContent(i):r.val(i),!0)}function B(t){var i;""!=t.target.innerHTML&&(i=e(t.target).find("img").attr("src"),i&&w(i,!1))}function V(t){var i,n,a,r;for(i=t[0],n=0;n<i.addedNodes.length;n++)if(a=e(i.addedNodes[n].innerHTML),r=a.find("img").attr("src")){w(r,!1);break}}var q,G,J,Q,Z,K,X,et,tt,it,nt,at,rt,st,ot,lt,ct,pt,dt,ut,ht,vt,ft,gt,mt,yt,Et,Rt,bt,wt,Tt,Ct,xt,Nt,It,kt,St,_t,At,Pt,Ut,Mt,Ot,Dt,Lt,Ht,zt,Ft,jt,Yt,$t,Wt,Bt,Vt,qt,Gt,Jt,Qt,Zt,Kt,Xt,ei,ti,ii,ni,ai,ri,si,oi,li,ci,pi,di,ui,hi,vi,fi,gi,mi,yi,Ei=jQuery.trim,Ri=!1,bi=/<!-- START INCLUDEIF (!?)([_a-z][_0-9a-z]{0,19}) -->/i,wi=/^#([_a-z][_0-9a-z]{0,19})#/im,Ti=/<!-- START REPEAT ([_a-zA-Z][_0-9a-zA-Z]{0,19}) -->/m,Ci=/^([^<]*)/,xi=/^(?:([0-9]+) *(?:h|hr|hrs|hour|hours))? *(?:([0-9]+) *(?:m|mn|mns|min|mins|minute|minutes))?$/i,Ni=/^([0-9]+)$/,Ii=/(.*)\[amd-(recipeseo|zlrecipe)-recipe:([0-9]+)](.*)/,ki=/(.*)\[(yumprint)-recipe\s+id='(\d+)'](.*)/i,Si=/(.*)\[(gmc)_recipe\s+([0-9]+)](.*)/,_i=/PT(?:([0-9]*)+H)?([0-9]+)+M/i,Ai=/\[(?:img) +(?:[^\]]+?)]/gi,Pi=/class\s*=\s*"(?:[^"]+ )?photo[ "]/i,Ui=/src\s*=\s*" *([^"]+?) *"/i,Mi={recipeseo:"Recipe SEO",ziplist:"ZipList",zlrecipe:"ZipList",yumprint:"Yumprint Recipe Card",recipress:"ReciPress",gmc:"GetMeCooking",recipage:"ReciPage"},Oi=[],Di=[],Li=[],Hi=[],zi="Switch to the Visual Editor to add or edit an EasyRecipe",Fi=null,ji=0,Yi='<div class="easyrecipeholder">EasyRecipe</div>',$i=".easyrecipeholder",Wi="ERSeparator",Bi=null,Vi=0,qi=!0,Gi="close",Ji="click",Qi="undefined",Zi="open",Ki="ERPhotoSelected",Xi="http://www.easyrecipeplugin.com/checkUpdates.php",en='<div class="divERNoPhotos">There are no photos in this post<br />Add photos anywhere in the post</div>',tn=-1,nn=-2,an="",rn="&nbsp;",sn=[],on=!1;e(function(){var i,n,a,r=null;Tt=EASYRECIPE,Tt.dialogs=e("<div>").addClass("easyrecipeUI").prop("id","easyrecipeUI").appendTo("body"),Tt.isGuest&&Tt.dialogs.addClass("easyrecipeDlgAbsolute"),e.widget("custom.easyrecipeDialog",e.ui.dialog,{_allowInteraction:function(t){return this._super(t)||!!e(t.target).parents(".media-modal-content, #wp-link").length}}),Tt.button!==e.fn.button&&(r=e.fn.button,e.fn.button=Tt.button),xt=e("#easyrecipeEntry"),Nt=e("#easyrecipeUpgrade"),Ct=e("#easyrecipeHTMLWarn"),nt=Tt.isGuest?{guestpost:1}:{content:1,aviaTBcontent:1},xt.easyrecipeDialog({autoOpen:!1,width:655,modal:!0,appendTo:Tt.dialogs,dialogClass:"easyrecipeEntry",beforeClose:function(){if(on){if(!window.confirm("Are you sure you want to close without saving the recipe?"))return!1;on=!1}return!0},close:function(){Tt.isEntryDialog=!1,pt&&!dt&&pt.remove(),pt=!1,e(".easyrecipeEntry").filter(function(){return""===e(this).text()}).remove()},open:function(){Tt.isEntryDialog=!0,At.tabs({active:0,beforeActivate:t}),setTimeout(function(){var t=e(".easyrecipeEntry"),i=t.offset();i.top<di&&(i.top=di,t.offset(i))},250)}}),yi=e("#divERContainer").show(),Ct.dialog({autoOpen:!1,width:420,modal:!0,dialogClass:"easyrecipeHTMLWarn",appendTo:Tt.dialogs,close:function(){e(".easyrecipeHTMLWarn").filter(function(){return""===e(this).text()}).remove()}}),e(".divERHTMLWarnContainer").show(),Nt.dialog({autoOpen:!1,width:420,modal:!0,dialogClass:"easyrecipeUpgrade",appendTo:Tt.dialogs,close:function(){e(".easyrecipeUpgrade").filter(function(){return""===e(this).text()}).remove()}}),e(".divERUPGContainer").show(),It=e("#easyrecipeConvert"),Lt=e("#divERCNVSpinner"),Ht=e("#btnERCNVCancel"),zt=e("#btnERCNVOK"),Lt.hide(),It.dialog({autoOpen:!1,width:390,modal:!0,dialogClass:"easyrecipeConvert",appendTo:Tt.dialogs,close:function(){e(".easyrecipeConvert").filter(function(){return""===e(this).text()}).remove()}}),e("#divERCNVContainer").show(),e(window).bind("easyrecipeadd",j),e(window).bind("easyrecipeedit",Y),e(window).bind("easyrecipeload",M),Ut=e("#divERNext"),Pt=e("#btnERButtons"),At=e("#ERDTabs"),Ot=e("#divERPhotos"),e("input:submit",".easyrecipeUI").button(),ut=e("#ed_toolbar"),J=e("#inpERRating"),Q=e("#inpERName"),at=e("#inpERAuthor"),rt=e("#inpERType"),st=e("#inpERCuisine"),ot=e("#inpERTags"),Z=e("textarea#taERSummary"),K=e("textarea#taERIngredients"),X=e("textarea#taERInstructions"),et=e("#inpERPrepTime"),tt=e("#inpERCookTime"),it=e("#inpERYield"),qt=e("#inpERServeSize"),Gt=e("#inpERCalories"),Jt=e("#inpERFat"),Qt=e("#inpERSatFat"),Zt=e("#inpERUnsatFat"),Kt=e("#inpERTransFat"),Xt=e("#inpERCarbs"),ei=e("#inpERSugar"),ti=e("#inpERSodium"),ii=e("#inpERFiber"),ni=e("#inpERProtein"),ai=e("#inpERCholesterol"),ri=e("textarea#taERNotes"),li=e("#divERAddImageURL"),a=e("#lnkERPhotoURL"),lt=e(".ERTimeError"),Ft=e("#divERAdd"),jt=e("#divERChange"),Yt=e("#divERHeader"),$t=e("#divEROther"),Wt=e("#divEROtherLabel"),Bt=e("#divERNotes"),Vt=e("#divERNotesLabel"),Dt=e("#ERDPasteTab"),ci=e("#fldERAPUImageURL"),e("#btnERAdd").click(U),e("#btnERNext").click(s),e("#btnERChange").click(U),e("#btnERDelete").click(N),e("#btnERCancel").click(x),a.click(function(){Nt.dialog(Zi)}),e("#btnERAIUCancel").click(function(){li.hide()}),e("#btnERAIUOK").click(b),Wt.click(O),Vt.click(D),et.change(function(t){p(e(t.target))}),tt.change(function(t){p(e(t.target))}),e("#btnERPaste").click(I),di=e("#wpadminbar").height(),ui=e("#divEREditBtns").on("mousedown","li",F),yi.find('input[type="text"], textarea').on("blur",function(){Fi=null}).on("focus",function(){Fi=e(this)}),e("#wp-link").bind("wpdialogclose",H),Tt.insertLink=L,gt=C,mt=T,yt=!1,Tt.insertUploadedImage=z,fi=_,gi=R,Tt.addListener=P,Ct.find("input").on(Ji,function(){Ct.dialog(Gi)}),e("#wp-content-editor-tools").on(Ji,"#content-html",$),e("#post").on("submit",W),null!==r&&(e.fn.button=r),i=e("#postimagediv").find(".inside"),window.MutationObserver&&i.length>0?(n=new MutationObserver(V),n.observe(i[0],{childList:!0})):i.on("DOMSubtreeModified",B),window.QTags&&QTags.addButton("easyrecipe","EasyRecipe",function(){alert(zi)},"","","",900)})}(jQuery);