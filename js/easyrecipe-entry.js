if(typeof EASYRECIPE==="undefined"){var EASYRECIPE={}}if(!EASYRECIPE.widget){EASYRECIPE.widget=jQuery.widget}if(!EASYRECIPE.button){EASYRECIPE.button=jQuery.fn.button}(function(bJ){var G=jQuery.trim;var Q,R,by,bR,bv,k,aw,aW,bm,ar;var w,bc,bs,aT,bx,M=false,P,bC,bV,N,f;var bK=/<!-- START INCLUDEIF (!?)([_a-z][_0-9a-z]{0,19}) -->/i;var o=/^#([_a-z][_0-9a-z]{0,19})#/im;var b=/<!-- START REPEAT ([_a-zA-Z][_0-9a-zA-Z]{0,19}) -->/m;var be=/^([^<]*)/,s=/^(?:([0-9]+) *(?:h|hr|hrs|hour|hours))? *(?:([0-9]+) *(?:m|mn|mns|min|mins|minute|minutes))?$/i,aA=/^([0-9]+)$/;var bU=/(.*)\[amd-(recipeseo|zlrecipe)-recipe:([0-9]+)\](.*)/;var aE=/(.*)\[(yumprint)-recipe\s+id='(\d+)'\](.*)/i;var aM=/(.*)\[(gmc)_recipe\s+([0-9]+)\](.*)/;var ba,a5,bw,bT,U;var at=/PT(?:([0-9]*)+H)?([0-9]+)+M/i;var ak=/\[(?:img) +(?:[^\]]+?)\]/ig;var O=/class\s*=\s*"(?:[^"]+ )?photo[ "]/i;var bi=/src\s*=\s*" *([^"]+?) *"/i;var bW={recipeseo:"Recipe SEO",ziplist:"ZipList",yumprint:"Yumprint Recipe Card",recipress:"ReciPress",gmc:"GetMeCooking"};var bk=[];var bp=[];var bf,aJ,aQ,ah=null,r=0,n,v,bn;var aL='<div class="easyrecipeholder">EasyRecipe</div>',i=".easyrecipeholder",aK="ERSeparator";var bb,L,E,t,aI=null,bo,ab,bO,aX="option",aB="zIndex",d,V,a8,bQ,aF;var aq,y,bE,bu,bP,bA,K,bd,bg,bq,bz;var bj,m,aC,bB,aH,a6,an,bG,e,B,aY,c,u,bD;var aZ=0,bS=false,a1,I=true,C,ay,bH,W,a3;var l="close",ap="click",aN="undefined",H="open",aS="ERPhotoSelected",ae="http://www.easyrecipeplugin.com/checkUpdates.php";var av='<div class="divERNoPhotos">There are no photos in this post<br />Add photos anywhere in the post</div>';var bh,aD=-1,az=-2,D="",bl,ai="&nbsp;",a9,aa,F;var bN=[];"use strict";function al(bZ,b0){var bY;V.show();a3.hide();a8.show();bY=b0.newTab?b0.newTab.index():b0.index;switch(bY){case 0:a3.css("right","10px");a3.show();break;case 3:a3.css("right","inherit");a8.hide();a3.show();break;case 4:V.hide();break}}function bF(bY){if(!bY){return""}bY+="";return bY.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&nbsp;/g," ")}function x(bY){return bY?bJ("<div />").text(bY).html():""}function ax(bY){return bJ.trim(x(bY.val()))||false}function a(bZ,b0){var bY=d.tabs("option","active");d.tabs("option","active",++bY)}function ag(bZ){var b1,bY=/\[img +(.*?) *\/?\]/i,b0=/\[url ([^\]]+)\](.*?\[\/url\])/i;b1=bY.exec(bZ);while(b1!==null){bp.push(b1[1]);bZ=bZ.replace(bY,"[img:"+bp.length+"]");b1=bY.exec(bZ)}b1=b0.exec(bZ);while(b1!==null){bk.push(b1[1]);bZ=bZ.replace(b0,"[url:"+bk.length+"]$2");b1=b0.exec(bZ)}return bZ}function g(bZ){var b2,b1,bY=/\[img:(\d+)\]/i,b0=/\[url:(\d+)\](.*?)\[\/url\]/i;b1=bY.exec(bZ);while(b1!==null){b2=bp[b1[1]-1];bZ=bZ.replace(bY,"[img "+b2+"]");b1=bY.exec(bZ)}b1=b0.exec(bZ);while(b1!==null){b2=bk[b1[1]-1];bZ=bZ.replace(b0,"[url "+b2+"]$2[/url]");b1=b0.exec(bZ)}return bZ}function aV(cs,ce){var ck=0,cf=1,bY=2,cu;var cl,cc,b5,cb=0,ca="",cn,bZ,b2,cm,cp;var co="<!-- START REPEAT ",cw="<!-- START INCLUDEIF ",cv="<!-- END INCLUDEIF ";var b1,b0,b7,cr,ci,b6,cd,cj,ct,b9;var b3,ch,cq;var b8,cg,b4;cu=cs;ce=ce||{};while(true){cn=cu.length;bZ=cu.indexOf("#",cb);if(bZ!==-1){cn=bZ;b2=ck}cm=cu.indexOf(co,cb);if(cm!==-1&&cm<cn){cn=cm;b2=cf}cp=cu.indexOf(cw,cb);if(cp!==-1&&cp<cn){cn=cp;b2=bY}if(cn===cu.length){return ca+cu.substr(cb)}b1=cn-cb;ca+=cu.substr(cb,b1);cb=cn;switch(b2){case bY:cc=cu.substr(cb,44);b5=bK.exec(cc);if(b5!==null){b0=b5[1];b7=b0!=="!";cr=b5[2]}else{break}ci=cv+b0+cr+" -->";b6=ci.length;cd=cu.indexOf(ci);if(cd===-1){cb++;break}cj=typeof ce[cr]!==aN&&ce[cr]!==false;if(cj===b7){ct="<!-- START INCLUDEIF "+b0+cr+" -->";b9=ct.length;cu=cu.substr(0,cb)+cu.substr(cb+b9,cd-cb-b9)+cu.substr(cd+b6)}else{cu=cu.substr(0,cb)+cu.substr(cd+b6)}break;case ck:cc=cu.substr(cb,22);b5=o.exec(cc);if(b5===null){ca+="#";cb++;continue}b3=b5[1];if(ce[b3]!==""&&!ce[b3]){ca+="#"+b3+"#";cb+=b3.length+2;continue}ca+=ce[b3];cb+=b3.length+2;break;case cf:cc=cu.substr(cb,45);b5=b.exec(cc);if(b5===null){ca+="<";cb++;continue}ch=b5[1];if(!ce[ch]||!(ce[ch] instanceof Array)){ca+="<";cb++;continue}cb+=ch.length+22;cq=cu.indexOf("<!-- END REPEAT "+ch+" -->",cb);if(cq===-1){ca+="<!-- START REPEAT "+ch+" -->";continue}b8=cq-cb;cg=cu.substr(cb,b8);b4=ce[ch];for(cl=0;cl<b4.length;cl++){ca+=aV(cg,b4[cl])}cb+=ch.length+b8+20;break}}}function S(b2){var bY=bJ.trim(b2.val()),bZ=0,b1=0,b0,b3;bx.hide();if(bY===""){return true}bO=s.exec(bY);if(bO===null){bO=aA.exec(bY);if(bO===null){bx.show();return false}bZ=0;b1=bO[1]}else{bZ=bO[1]?parseInt(bO[1],10):0;b1=bO[2]?parseInt(bO[2],10):0}if(bZ===0&&b1===0){b2.val("")}else{b0=bZ>0?bZ+" hour":"";if(bZ>1){b0+="s"}b3=b1>0?b1+" min":"";if(b1>1){b3+="s"}b2.val(bJ.trim(b0+" "+b3))}return true}function p(b2){var bZ,bY,b0,b1="";for(bZ=0;bZ<b2.length;bZ++){bY=b2[bZ];if(bY.nodeType===3){b0=bJ.trim(bY.nodeValue);if(b0!==""){b1+=b0+"\n"}continue}if(bY.nodeType!==1){continue}if(bY.childNodes.length>0){b1+=p(bY.childNodes)}}return b1}function bL(){var bY;bJ(i,aI).remove();bY=Q.selection.getNode();if(bY.nodeName==="#document"){bY=bo[0]}if(bY.nodeName.toUpperCase()==="BODY"){if(!bJ(bY).hasClass("mceContentBody")){bY=bo[0]}bJ(bY).append("&nbsp;"+aL)}else{while(bY.parentNode&&bY.parentNode.nodeName.toUpperCase()!=="BODY"){bY=bY.parentNode}if(!bY.parentNode){bY=bo[0];bJ(bY).append("&nbsp;"+aL)}else{if(bY.nodeName.toUpperCase()==="DIV"||bY.nodeName.toUpperCase()==="SPAN"){bJ(bY,aI).after(aL)}else{bJ(bY,aI).before(aL)}}}a1=-1;return bJ(i,aI)}function X(bY,b0,bZ){}function Y(bY){switch(bY.type){case"js":bJ("head").append(bJ('<script type="text/javascript">'+bY.js+"<\/script>"));v[bY.f]();break;case"html":bJ(bY.dest).html(bY.html);break}}function bX(){bE.unbind(ap);bu.unbind(ap);t.dialog(l);M=true;bw()}function J(b3,bZ){var b2,bY="";var b1,b0;b1=b3.recipe;if(bZ!=="success"){t.dialog(l);M=true;bw()}by.val(bF(b1.recipe_title));D=b1.recipe_image;bc.val("");if(b1.author){w.val(bF(b1.author))}else{w.val("")}bs.val(b1.cuisine||"");bc.val(b1.mealType||"");aT.val("");bR.val(bF(b1.summary));bO=at.exec(b1.prep_time);if(bO!==null){b2=bO[1]?bO[1]+"h ":"";aw.val(b2+bO[2]+"m")}else{aw.val(bF(b1.prep_time))}bO=at.exec(b1.cook_time);if(bO!==null){b2=bO[1]?bO[1]+"h ":"";aW.val(b2+bO[2]+"m")}else{aW.val(bF(b1.cook_time))}bm.val(bF(b1.yield));bj.val(bF(b1.serving_size));if(b1.nutrition){b0=b1.nutrition;m.val(bF(b0.calories));aC.val(bF(b0.totalFat));bB.val(bF(b0.saturatedFat));aH.val(bF(b0.unsaturatedFat));a6.val(bF(b0.transFat));an.val(bF(b0.totalCarbohydrates));bG.val(bF(b0.sugars));e.val(bF(b0.sodium));B.val(bF(b0.dietaryFiber));aY.val(bF(b0.protein));c.val(bF(b0.cholesterol))}else{m.val(bF(b1.calories));aC.val(bF(b1.fat))}for(b2=0;b2<b3.ingredients.length;b2++){bY+=G(bF(b3.ingredients[b2]))+"\n"}bv.val(bY);k.val(bF(b1.instructions.replace("\r","")));u.val(bF(b1.notes));bb.dialog("option","title","Update Recipe");t.dialog(l);bP.hide();bA.show();aq.hide();if(D!==""){aa(D,bQ.length,true)}bV=bL();bb.dialog(aX,aB,ab);bb.dialog(H)}function a0(){var bY;y.show();bE.unbind(ap);bu.unbind(ap);bY={action:"easyrecipeConvert",id:ba,type:a5};bJ.post(ajaxurl,bY,J,"json")}function z(b8){var b7,ch,b9,b3=0,cd,b2="",bY="",bZ="",b5="";var b6=["instruction","method","cooking method","procedure"];var ci=["ingredients?"];var b0=["note","cooking note"];var cj;var ce;var b1;var cf,ca,cc;var cg,b4,cb;cg=bJ.parseJSON(v.ingredients);b4=bJ.parseJSON(v.instructions);cb=bJ.parseJSON(v.notes);if(bJ.inArray(cg,ci)===-1){ci.push(cg)}ce="^\\s*(?:"+ci.join("|")+")";ca=new RegExp(ce,"i");if(bJ.inArray(b4,b6)===-1){ci.push(b4)}cj="^\\s*(?:"+b6.join("|")+")";cf=new RegExp(cj,"i");if(bJ.inArray(cb,b0)===-1){b0.push(cb)}b1="^\\s*(?:"+b0.join("|")+")\\s*$";cc=new RegExp(b1,"i");cd=bJ("<div>"+b8+"</div>");b7=p(cd[0].childNodes);b7=b7.split("\n");for(ch=0;ch<b7.length;ch++){b9=bJ.trim(b7[ch]);if(b9===""){continue}if(cf.test(b9)){b3=2;continue}if(ca.test(b9)){b3=1;continue}if(cc.test(b9)){b3=3;continue}switch(b3){case 0:b2+=b9+"\n";break;case 1:bY+=b9+"\n";break;case 2:bZ+=b9+"\n";break;case 3:b5+=b9+"\n";break}}return{summary:b2,ingredients:bY,instructions:bZ,notes:b5}}function au(){L.dialog(aX,aB,ab);L.dialog(H)}function Z(b1,bY,bZ){var b0;var b2=function(){var b3,b7,b6,b4,b5=bJ.data(this,"index");b3=this.width/150;b7=this.height/112;b3=b3>b7?b3:b7;b6=Math.floor(this.height/b3);b4=Math.floor(this.width/b3);bQ[b5].height(b6);bQ[b5].width(b4);bQ[b5].css("top",(112-b6)/2);bQ[b5].attr("src",this.src);if(b5===0){bJ("#ERDTabs").find(".divERNoPhotos").remove()}};aF.append('<div class="ERPhoto"><img style="position:relative" id="ERPhoto_'+bY+'" /></div>');bQ[bY]=bJ("#ERPhoto_"+bY,aF);bQ[bY].data("src",b1);if(bZ){bJ(".ERPhoto",aF).removeClass(aS);bQ[bY].parent().addClass(aS);bH=bY;D=b1}if(bl===""){bl=b1}b0=new Image();bJ.data(b0,"index",bY);b0.onload=b2;b0.src=b1}function ad(){Z(ay.val(),bQ.length,true);ay.val("");C.hide();bJ(".divERNoPhotos").remove()}function ac(cg,cj){var b2;var cl;var b7,b4;var ch;var b3;var ck,bY,cf,ce,b9,b6,ca,cb,cm;var b1={},b5="",b0="",bZ="",cd="",ci;var b8,cc;if(cj===aD&&aZ!==0){au();return}if(cg&&cg.data===az){cj=az;cg=cg.delegateTarget}if(typeof cj===aN&&typeof cg===aN){a1=0}aZ=1;a1=0;bV=bJ(".easyrecipe:first",aI);if(cj!==aD&&bV.length>1){bV=bJ(bV[cj]);a1=cj}cl=0;ca=bJ.support.cors?"json":"jsonp";bJ.ajax(ae,{dataType:ca,data:{v:v.version,p:cl,u:v.wpurl},success:Y,error:X});R=false;if(typeof tinyMCE!==aN){if(tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden()){R=true}}if(!R){alert("You must use the Visual Editor to add or update an EasyRecipe");return}by.val("");bc.val("");bs.val("");aT.val("");w.val("");bR.val("");aw.val("");aW.val("");bm.val("");bv.val("");k.val("");bj.val("");m.val("");aC.val("");bB.val("");aH.val("");a6.val("");an.val("");bG.val("");e.val("");B.val("");aY.val("");c.val("");u.val("");if(cj!==aD&&bV.length===1){bb.dialog("option","title","Update Recipe");aq.hide();bP.hide();bA.show();N=true}else{bC=Q.getContent();if(!M){b9=bU.exec(bC)||aE.exec(bC)||aM.exec(bC);if(!b9){b2=bJ("#hasRecipe").is(":checked")}if(b9||b2){if(b2){a5="recipress";ba=v.postID}else{a5=b9[2];ba=b9[3]}y.hide();bE.click(bX);bu.click(a0);b3=bW[a5];ce=bJ("#txtERCNVText1",t);ce.html(ce.html().replace("#plugin#",b3));aF.html("");bH=-1;bQ=[];aF.html(av);t.dialog(aX,aB,ab);t.dialog(H);return}}if(v.isGuest){b8=bJ("#inpERAuthor").val()||"";w.val(b8)}bP.show();bA.hide();aq.show();bb.dialog("option","title","Add a New Recipe");N=false;if(U!==false){b1=z(U)}else{ci=Q.selection.getContent();if(ci.length>20){b1=z(ci)}}if(b1.summary){b5=b1.summary}if(b1.ingredients){b0=b1.ingredients}if(b1.instructions){bZ=b1.instructions}if(b1.notes){cd=b1.notes}bV=bL()}cc=bV;bV=bJ("<div>"+bV.html()+"</div>");bJ("#inpERCuisine").autocomplete({source:bJ.parseJSON(v.cuisines)}).autocomplete("widget").wrap('<div class="easyrecipeUI" />');bJ("#inpERType").autocomplete({source:bJ.parseJSON(v.recipeTypes)}).autocomplete("widget").wrap('<div class="easyrecipeUI" />');P=false;if(bJ(".hrecipe",aI).length>0){if(confirm("This post is already hrecipe microformatted\n\nDo you want me to try to convert it to an EasyRecipe?")){P=true}}bh=(cj!==aD)?bV.find(".endeasyrecipe").text():v.version;if(bh===""){bh="2.2"}D=bJ('link[itemprop="image"]',bV).attr("href")||"";aF.html("");bH=-1;bl="";bQ=[];aI.find("img").each(function(cn){var co=false;if(bh<"3"){if(bJ(this).hasClass("photo")){co=true}}else{co=this.src===D}Z(this.src,cn,co)});ch=aI.contents().text();b9=ak.exec(ch);cb=bQ.length;while(b9!==null){b4=bi.exec(b9[0]);if(b4!==null){b7=b4[1];Z(b7,cb);if(bh>"3"){if(D===b7){bQ[cb].parent().addClass(aS);bH=cb}}else{if(O.test(b9[0])){bQ[cb].parent().addClass(aS);bH=cb;D=b7}}cb++}b9=ak.exec(ch)}if(D!==""){bY=false;for(ck=0;ck<bQ.length;ck++){if(bQ[ck].data("src")===D){bY=true;break}}if(!bY){Z(D,bQ.length,true)}}if(bH===-1&&bQ.length>0){bH=0;D=bl;bQ[0].parent().addClass(aS)}aF.click(function(){L.dialog(aX,aB,ab);L.dialog(H)});if(bQ.length===0){aF.html(av)}else{if(bH===-1){bQ[0].parent().addClass(aS)}}bp=[];bk=[];cm=bV.find(".ERName .fn").html()||bV.find(".ERName").html();if(!cm||cm===""){by.val(ag(bF(bJ("#title").val())))}else{by.val(ag((bF(cm))))}bc.val(ag(bF(bV.find(".type").html())));w.val(ag(bF(bV.find(".author").html())));if(w.val()===""){w.val(ag(bJ.parseJSON(v.author)))}bs.val(ag(bF(bV.find(".cuisine").html())));bR.val(ag(b5+bF(bV.find(".summary").html())));if(bh>"3"){b6=bV.find('time[itemprop="prepTime"]').html()||"";aw.val(bF(b6));b6=bV.find('time[itemprop="cookTime"]').html()||"";aW.val(bF(b6))}else{b6=bV.find(".preptime").html()||"";b9=be.exec(b6);if(b9!==null){aw.val(bF(b9[1]))}else{aw.val("")}b6=bV.find(".cooktime").html()||"";b9=be.exec(b6);if(b9!==null){aW.val(bF(b9[1]))}else{aW.val("")}}bm.val(bF(bV.find(".yield").html()));bV.find(".ingredients li").each(function(co,cn){if(bJ(cn).hasClass(aK)){b0+="!"+ag(bF(cn.innerHTML))+"\n"}else{b0+=ag(bF(cn.innerHTML))+"\n"}});bv.val(b0);bV.find(".instructions li, .instructions .ERSeparator").each(function(co,cn){cf=bJ.trim(cn.innerHTML.replace(/^[ 0-9.]*(.*)$/ig,"$1"));if(bJ(cn).hasClass(aK)){bZ+="!"+cf+"\n"}else{bZ+=cf+"\n"}});k.val(ag(bF(bZ)));bj.val(bF(bV.find(".servingSize").html()));m.val(bF(bV.find(".calories").html()));aC.val(bF(bV.find(".fat").html()));bB.val(bF(bV.find(".saturatedFat").html()));aH.val(bF(bV.find(".unsaturatedFat").html()));a6.val(bF(bV.find(".transFat").html()));an.val(bF(bV.find(".carbohydrates").html()));bG.val(bF(bV.find(".sugar").html()));e.val(bF(bV.find(".sodium").html()));B.val(bF(bV.find(".fiber").html()));aY.val(bF(bV.find(".protein").html()));c.val(bF(bV.find(".cholesterol").html()));cf=(bF(bV.find(".ERNotes").html())||"").replace(/<\/p>\n*<p>/ig,"\n\n").replace(/(?:<p>|<\/p>)/ig,"").replace(/<br *\/?>/ig,"\n");if(cf===""&&cd!==""){cf=cd}cf=ag(cf);cf=cf.replace(/\[br(?: ?\/)?\]/ig,"\n");u.val(ag(cf));if(F){if(F.name){by.val(ag((bF(F.name))))}if(F.author){w.val(ag(F.author))}if(F.summary){bR.val(ag(F.summary))}if(F.yield){bm.val(bF(F.yield))}if(F.type){bc.val(ag(bF(F.type)))}if(F.cuisine){bs.val(ag(bF(F.cuisine)))}if(F.prepTime){aw.val(bF(F.prepTime))}if(F.cookTime){aW.val(bF(F.cookTime))}if(F.summary){bR.val(ag(F.summary))}}bV=cc;bb.dialog(aX,aB,ab);bb.dialog(H);bb.dialog("option","position","center")}function A(bY){aZ=bJ(".easyrecipe",aI).length;if(I||aZ===0){ac(bY,aD);return}L.dialog(aX,aB,ab);L.dialog(H)}function a4(){bb.dialog(l)}function q(){var bY=confirm("Are you sure you want to delete this recipe?");if(bY){bV.remove();bV=false}bb.dialog(l)}function aj(){var bZ=bJ("#inpERPaste");var bY,b0=bZ.val();bY=z(b0);if(bY.ingredients.length===0&&bY.instructions.length===0){return}U=b0;bZ.val("");F={name:g(x(by.val())),author:g((ax(w))),yield:ax(bm),type:g((ax(bc))),cuisine:g((ax(bs))),summary:g(ax(bR)),servesize:ax(bj),prepTime:aw.val(),cookTime:aW.val()};bb.dialog(l);A(null)}function bI(bZ){var bY=bJ(bZ.target).parent();var b0=bY.parent();if(bY.hasClass("easyrecipeAbove")){b0.before(ai)}else{b0.after(ai)}bY.remove();af()}function af(){var b0;var bZ;var bY;bZ=bJ("<div>"+aI[0].body.innerHTML+"</div>");bZ.find(".easyrecipeAbove,.easyrecipeBelow").remove();b0=bZ.find(".easyrecipe");b0.each(function(){var b1=bJ(this);if(b1.parent().hasClass("easyrecipeWrapper")){b1.unwrap()}a9(b1)});bY=bZ.html();Q.setContent(bY);b0=aI.find(".easyrecipe");b0.on("mousedown",null,az,ac);aI.find(".ERInsertLine").on(ap,bI)}function bM(b4){var b1;var bZ,bY,b2,b0;b2=b4.prev();b0=b4.next();bZ=(b2.length===0||b2.hasClass("easyrecipe")||b2.hasClass("easyrecipeWrapper"));if(bZ){try{bZ=!(b4[0].previousSibling&&b4[0].previousSibling.nodeType===3)}catch(b3){}}bY=(b0.length===0||b0.hasClass("easyrecipe")||b0.hasClass("easyrecipeWrapper"));if(bY){try{bY=!(b4[0].nextSibling&&b4[0].nextSibling.nodeType===3)}catch(b3){}}if(!bZ&&!bY){return}b4.wrap('<div class="easyrecipeWrapper mceNonEditable" />');b1=b4.parent();if(bZ){b1.prepend('<div class="easyrecipeAbove mceNonEditable"><input class="ERInsertLine mceNonEditable" type="button" value="Insert line above" /></div>');b1.find("input").on(ap,bI);bN.push(b1.find(".easyrecipeAbove")[0])}if(bY){b1.append('<div class="easyrecipeBelow mceNonEditable"><input class="ERInsertLine mceNonEditable" type="button" value="Insert line below" /></div>');b1.find("input").on(ap,bI)}}function h(bY){bJ(".easyrecipeAbove,.easyrecipeBelow",bY).remove();bJ(".easyrecipe",bY).unwrap()}function bt(){var bY=bJ(".easyrecipe",aI);if(bY.length===0){return}bY.on("mousedown",null,az,ac);af()}function aU(){var ca,b4="",b1,b9="",bY=0,ce="";var cg,cc,b8,b2,cf,b5,cb,bZ=[],b3;var b0,cd,b7,b6;if(!S(aw)){return}if(!S(aW)){return}b1=bJ.trim(aw.val());if(b1!==""){bO=s.exec(b1);cg=bO[1]?parseInt(bO[1],10):0;cc=bO[2]?parseInt(bO[2],10):0;bY=cg*60+cc;b8=cg>0?cg+"H":"";b2=cc>0?cc+"M":"";b9="PT"+b8+b2}else{b1=false}ca=bJ.trim(aW.val());if(ca!==""){bO=s.exec(ca);cg=bO[1]?parseInt(bO[1],10):0;cc=bO[2]?parseInt(bO[2],10):0;b8=cg>0?cg+"H":"";b2=cc>0?cc+"M":"";bY+=cg*60+cc;b4="PT"+b8+b2}else{ca=false}if(bY>0){cg=Math.floor(bY/60);cc=bY%60;b8=cg>0?cg+" hour":"";if(cg>1){b8+="s"}b2=cc>0?cc+" min":"";if(cc>1){b2+="s"}bY=bJ.trim(b8+" "+b2);b8=cg>0?cg+"H":"";b2=cc>0?cc+"M":"";ce="PT"+b8+b2}else{bY=false}cf=bv.val().split("\n");for(cb=0;cb<cf.length;cb++){b5=cf[cb];if(b5!==""){if(b5.charAt(0)==="!"){b3=true;b5=b5.substr(1)}else{b3=false}bZ.push({ingredient:g(x(b5)),hasHeading:b3})}}cf=k.val().split("\n");cd=[];b0={INSTRUCTIONS:[]};for(cb=0;cb<cf.length;cb++){b5=bJ.trim(cf[cb].replace(/^[ 0-9\.]*(.*)$/ig,"$1"));if(b5!==""){if(b5.charAt(0)==="!"){if(b0.INSTRUCTIONS.length>0||b0.heading){cd.push(b0)}b5=b5.substr(1);b0={};b0.INSTRUCTIONS=[];b0.heading=x(b5)}else{b0.INSTRUCTIONS.push({instruction:g(x(b5))})}}}if(b0.INSTRUCTIONS.length>0||b0.heading){cd.push(b0)}b5=ax(u);if(b5){if(v.wpVersion<"3.5"){b5="<p>"+b5.replace(/\n\n/ig,"</p><p>").replace(/\n/ig,"<br />")+"</p>"}b5=b5.replace(/\n/g,"[br]")}b7={version:v.version,hasPhoto:D!=="",photoURL:D,name:g(x(by.val())),author:g((ax(w))),preptime:b1,cooktime:ca,totaltime:bY,preptimeISO:b9,cooktimeISO:b4,totaltimeISO:ce,yield:ax(bm),type:g((ax(bc))),cuisine:g((ax(bs))),summary:g(ax(bR)),servesize:ax(bj),calories:ax(m),fat:ax(aC),satfat:ax(bB),unsatfat:ax(aH),transfat:ax(a6),carbs:ax(an),sugar:ax(bG),sodium:ax(e),fiber:ax(B),protein:ax(aY),cholesterol:ax(c),notes:g(b5),INGREDIENTS:bZ,STEPS:cd};if(b7.name===""){b7.name=false}b6=aV(v.recipeTemplate,b7);if(P){bJ(".hrecipe",aI).remove()}if(a1===-1){bV=bJ(i,aI)}else{bV=bJ(".easyrecipe",aI);if(bV.length>0){bV=bJ(bV[a1])}}bV.before(b6);bV.remove();bV=false;bD.show();bb.dialog(l);aZ=bJ(".easyrecipe",aI).length;bt()}function br(b1,bY,b2){var bZ;var b0;F=false;if(bY.editorId!==ar&&bY.editorId!=="wp_mce_fullscreen"){bJ("#"+bY.editorId+"_easyrecipeTest").hide();bJ("#"+bY.editorId+"_easyrecipeEdit").hide();bJ("#"+bY.editorId+"_easyrecipeAdd").hide();return}if(bY.editorId===ar){aI=bJ("#"+ar+"_ifr").contents();ab=10000;bZ=bJ("#"+ar+"_easyrecipeTest");bD=bJ("#"+ar+"_easyrecipeEdit")}else{aI=bJ("#wp_mce_fullscreen_ifr").contents();ab=200001;bZ=bJ("#mce_fullscreen_easyrecipeTest");bD=bJ("#mce_fullscreen_easyrecipeEdit")}bo=bJ("body",aI);b0=bJ(".easyrecipe",aI);Q=tinyMCE.activeEditor;b0.each(function(){bJ(this).addClass("mceNonEditable");bJ(".ERRatingOuter",this).remove();bJ(".ERHDPrint",this).remove();bJ(".ERLinkback",this).remove()});aZ=b0.length;if(aZ>0&&v.testURL!==""){bZ.show()}else{bZ.hide()}if(aZ>0){bD.show()}else{bD.hide()}if(!aI.hasERCSS){bJ("head",aI).append('<link rel="stylesheet" type="text/css" href="'+v.easyrecipeURL+'/css/easyrecipe-entry.css" />');aI.hasERCSS=true}bt()}function aR(){bd.toggleClass("ERNone");bg.toggleClass("ERContract")}function a7(){bq.toggleClass("ERNone");bz.toggleClass("ERContract")}function aO(){if(window.getSelection){return window.getSelection()}if(document.getSelection){return document.getSelection()}if(document.selection){return document.selection.createRange().text}return null}function T(b2,b0){var b3,bZ,b1,bY=/(?:<a( .*?")>)?<img( (?:.*?)?src="([^"]*?)"(?:.*)) \/>/i;bZ=bY.exec(b0);b3=bJ("#ertmp_"+r,aI);if(bZ!==null){Z(bZ[3],bQ.length);b1=aQ.substring(0,bf);if(!bZ[1]){bp.push(bZ[2]);b1+="[img:"+bp.length+"]"}else{bk.push(bZ[1]);bp.push(bZ[2]);b1+="[url:"+bk.length+"][img:"+bp.length+"][/url]"}b1+=aQ.substring(aJ);n.val(b1)}n[0].focus();b3.remove()}function j(b1){var bY,bZ,b0,b4,b3,b2;if(!v.isEntryDialog){return}bY=bJ("#ertmp_"+r,aI);if(typeof b1==="string"){b0=bJ(b1)}else{b2=bY.html();if(b2==="link"){b0=bY.parent("a");bY=b0}else{b0=bJ(bY.html())}}if(b0.is("a")){bZ=b0.attr("href");b4=b0.attr("title");b3=b0.attr("target");b4=b4?' title="'+b4+'"':"";b3=b3?' target="'+b3+'"':"";b1='href="'+bZ+'"'+b3+b4;bk.push(b1);n.val(aQ.substring(0,bf)+"[url:"+bk.length+"]"+aQ.substring(bf,aJ)+"[/url]"+aQ.substring(aJ))}n[0].focus();bY.remove()}function am(){var b0,b1,bZ=false,bY;au()}function ao(){F=false;A()}function aP(){F=false;ac()}function a2(){if(aZ>0&&!bS){bS=true;bn.dialog(aX,aB,ab);bn.dialog(H)}}function aG(b3){var b0,b1,b2,bZ;var bY=bJ("#wp-preview",b3.target).val();if(bY==="dopreview"){return true}if(aZ===0){return true}b2=tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden();if(b2){b1=bJ("<div>"+Q.getContent()+"</div>")}else{bZ=bJ("#wp-content-editor-container").find("textarea");b1=bJ("<div>"+bZ.val()+"</div>")}h(bJ(".easyrecipeWrapper",b1));bJ(".easyrecipe",b1).removeClass("mceNonEditable");b0=bJ.trim(b1.html());if(b2){Q.setContent(b0)}else{bZ.val(b0)}return true}bJ(function(){var b1;var bZ;var b0;var bY=null;v=EASYRECIPE;if(v.button!==bJ.fn.button){bY=bJ.fn.button;bJ.fn.button=v.button}bb=bJ("#easyrecipeEntry");L=bJ("#easyrecipeUpgrade");bn=bJ("#easyrecipeHTMLWarn");ar=v.isGuest?"guestpost":"content";bb.dialog({autoOpen:false,width:655,modal:true,dialogClass:"easyrecipeEntry",close:function(){v.isEntryDialog=false;if(bV&&!N){bV.remove()}bV=false;bJ(".easyrecipeEntry").filter(function(){return bJ(this).text()===""}).remove()},open:function(){v.isEntryDialog=true;bJ(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />');d.tabs({active:0,beforeActivate:al});setTimeout(function(){var b2=bJ(".easyrecipeEntry");var b3=b2.offset();if(b3.top<W){b3.top=W;b2.offset(b3)}},250)}});bb.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');bJ("#divERContainer").show();bn.dialog({autoOpen:false,width:420,modal:true,dialogClass:"easyrecipeHTMLWarn",close:function(){bJ(".easyrecipeHTMLWarn").filter(function(){return bJ(this).text()===""}).remove()},open:function(){bJ(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});bn.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');bJ(".divERHTMLWarnContainer").show();L.dialog({autoOpen:false,width:420,modal:true,dialogClass:"easyrecipeUpgrade",close:function(){bJ(".easyrecipeUpgrade").filter(function(){return bJ(this).text()===""}).remove()},open:function(){bJ(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});L.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');bJ(".divERUPGContainer").show();t=bJ("#easyrecipeConvert");y=bJ("#divERCNVSpinner");bE=bJ("#btnERCNVCancel");bu=bJ("#btnERCNVOK");y.hide();t.dialog({autoOpen:false,width:390,modal:true,dialogClass:"easyrecipeConvert",close:function(){bJ(".easyrecipeConvert").filter(function(){return bJ(this).text()===""}).remove()},open:function(){bJ(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});bJ("#divERCNVContainer").show();t.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');bJ(window).bind("easyrecipeadd",ao);bJ(window).bind("easyrecipeedit",aP);bJ(window).bind("easyrecipeload",br);bJ(window).bind("easyrecipeimage",T);bJ(window).bind("easyrecipeguestimageuploaded",T);a8=bJ("#divERNext");V=bJ("#btnERButtons");d=bJ("#ERDTabs");aF=bJ("#divERPhotos");bJ("input:submit",".easyrecipeUI").button();f=bJ("#ed_toolbar");by=bJ("#inpERName");w=bJ("#inpERAuthor");bc=bJ("#inpERType");bs=bJ("#inpERCuisine");aT=bJ("#inpERTags");bR=bJ("textarea#taERSummary");bv=bJ("textarea#taERIngredients");k=bJ("textarea#taERInstructions");aw=bJ("#inpERPrepTime");aW=bJ("#inpERCookTime");bm=bJ("#inpERYield");bj=bJ("#inpERServeSize");m=bJ("#inpERCalories");aC=bJ("#inpERFat");bB=bJ("#inpERSatFat");aH=bJ("#inpERUnsatFat");a6=bJ("#inpERTransFat");an=bJ("#inpERCarbs");bG=bJ("#inpERSugar");e=bJ("#inpERSodium");B=bJ("#inpERFiber");aY=bJ("#inpERProtein");c=bJ("#inpERCholesterol");u=bJ("textarea#taERNotes");C=bJ("#divERAddImageURL");b0=bJ("#lnkERPhotoURL");bx=bJ(".ERTimeError");bP=bJ("#divERAdd");bA=bJ("#divERChange");K=bJ("#divERHeader");bd=bJ("#divEROther");bg=bJ("#divEROtherLabel");bq=bJ("#divERNotes");bz=bJ("#divERNotesLabel");aq=bJ("#ERDPasteTab");ay=bJ("#fldERAPUImageURL");bJ("#btnERAdd").click(aU);bJ("#btnERNext").click(a);bJ("#btnERChange").click(aU);bJ("#btnERDelete").click(q);bJ("#btnERCancel").click(a4);b0.click(function(){L.dialog(aX,aB,ab);L.dialog(H)});bJ("#btnERAIUCancel").click(function(){C.hide()});bJ("#btnERAIUOK").click(ad);bg.click(aR);bz.click(a7);aw.change(function(b2){S(bJ(b2.target))});aW.change(function(b2){S(bJ(b2.target))});bJ("#btnERPaste").click(aj);W=bJ("#wpadminbar").height();a3=bJ("#divEREditBtns").on("mousedown","li",am);bJ('#divERContainer input[type="text"], #divERContainer textarea').on("blur",function(){ah=null}).on("focus",function(){ah=bJ(this)});bJ("#wp-link").bind("wpdialogclose",j);bw=A;bT=ac;U=false;v.insertLink=j;v.insertUploadedImage=T;a9=bM;aa=Z;v.addListener=bt;bn.find("input").on(ap,function(){bn.dialog(l)});bJ("#wp-content-editor-tools").on(ap,"#content-html",a2);bJ("#post").on("submit",aG);if(bY!==null){bJ.fn.button=bY}})}(jQuery));