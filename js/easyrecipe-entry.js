/*! EasyRecipe  3.2.1284 Copyright (c) 2014 BoxHill LLC */
if(!window.EASYRECIPE){var EASYRECIPE={}}if(!EASYRECIPE.widget){EASYRECIPE.widget=jQuery.widget}if(!EASYRECIPE.button){EASYRECIPE.button=jQuery.fn.button}(function(bQ){var J=jQuery.trim;var T,U,bF,bZ,bB,l,az,a0,bs,av;var x,bh,by,aX,bD,P=false,S,bJ,b3,Q,f;var bR=/<!-- START INCLUDEIF (!?)([_a-z][_0-9a-z]{0,19}) -->/i;var p=/^#([_a-z][_0-9a-z]{0,19})#/im;var b=/<!-- START REPEAT ([_a-zA-Z][_0-9a-zA-Z]{0,19}) -->/m;var br;var bj=/^([^<]*)/,t=/^(?:([0-9]+) *(?:h|hr|hrs|hour|hours))? *(?:([0-9]+) *(?:m|mn|mns|min|mins|minute|minutes))?$/i,aD=/^([0-9]+)$/;var b2=/(.*)\[amd-(recipeseo|zlrecipe)-recipe:([0-9]+)\](.*)/;var aH=/(.*)\[(yumprint)-recipe\s+id='(\d+)'\](.*)/i;var aQ=/(.*)\[(gmc)_recipe\s+([0-9]+)\](.*)/;var be,a9,bC,b1,X;var ax=/PT(?:([0-9]*)+H)?([0-9]+)+M/i;var an=/\[(?:img) +(?:[^\]]+?)\]/ig;var R=/class\s*=\s*"(?:[^"]+ )?photo[ "]/i;var bn=/src\s*=\s*" *([^"]+?) *"/i;var b4={recipeseo:"Recipe SEO",ziplist:"ZipList",zlrecipe:"ZipList",yumprint:"Yumprint Recipe Card",recipress:"ReciPress",gmc:"GetMeCooking"};var bp=[];var bv=[];var G="Switch to the Visual Editor to add or edit an EasyRecipe";var bk,aN,aU,ak=null,s=0,o,w,bt;var aP='<div class="easyrecipeholder">EasyRecipe</div>',i=".easyrecipeholder",aO="ERSeparator";var bg,O,H,u,aM=null,bu,ae,bV,a1="option",aE="zIndex",d,Y,bc,bY,aI;var au,z,bL,bA,bW,bH,N,bi,bl,bw,bG;var bo,n,aF,bI,aL,ba,aq,bN,e,D,a2,c,v,bK;var a3=0,b0=false,a5,L=true,E,aB,bO,Z,a7;var m="close",at="click",aR="undefined",K="open",aW="ERPhotoSelected",ah="http://www.easyrecipeplugin.com/checkUpdates.php";var ay='<div class="divERNoPhotos">There are no photos in this post<br />Add photos anywhere in the post</div>';var bm,aG=-1,aC=-2,F="",bq,al="&nbsp;",bd,ad,I;var bU=[];var A=false;var bE;"use strict";function ao(b7,b8){var b6;Y.show();a7.hide();bc.show();b6=b8.newTab?b8.newTab.index():b8.index;switch(b6){case 0:a7.css("right","10px");a7.show();break;case 3:a7.css("right","inherit");bc.hide();a7.show();break;case 4:Y.hide();break}}function j(){bE.off("change",j);A=true}function bM(b6){if(!b6){return""}b6+="";return b6.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&nbsp;/g," ")}function y(b6){return b6?bQ("<div />").text(b6).html():""}function aA(b6){return bQ.trim(y(b6.val()))||false}function a(b7,b8){var b6=d.tabs("option","active");d.tabs("option","active",++b6)}function aj(b7){var b9,b6=/\[img +(.*?) *\/?\]/i,b8=/\[url ([^\]]+)\](.*?\[\/url\])/i;b9=b6.exec(b7);while(b9!==null){bv.push(b9[1]);b7=b7.replace(b6,"[img:"+bv.length+"]");b9=b6.exec(b7)}b9=b8.exec(b7);while(b9!==null){bp.push(b9[1]);b7=b7.replace(b8,"[url:"+bp.length+"]$2");b9=b8.exec(b7)}return b7}function g(b7){var ca,b9,b6=/\[img:(\d+)\]/i,b8=/\[url:(\d+)\](.*?)\[\/url\]/i;b9=b6.exec(b7);while(b9!==null){ca=bv[b9[1]-1];b7=b7.replace(b6,"[img "+ca+"]");b9=b6.exec(b7)}b9=b8.exec(b7);while(b9!==null){ca=bp[b9[1]-1];b7=b7.replace(b8,"[url "+ca+"]$2[/url]");b9=b8.exec(b7)}return b7}function aZ(cA,cm){var cs=0,cn=1,b6=2,cC;var ct,ck,cd,cj=0,ci="",cv,b7,ca,cu,cx;var cw="<!-- START REPEAT ",cE="<!-- START INCLUDEIF ",cD="<!-- END INCLUDEIF ";var b9,b8,cf,cz,cq,ce,cl,cr,cB,ch;var cb,cp,cy;var cg,co,cc;cC=cA;cm=cm||{};while(true){cv=cC.length;b7=cC.indexOf("#",cj);if(b7!==-1){cv=b7;ca=cs}cu=cC.indexOf(cw,cj);if(cu!==-1&&cu<cv){cv=cu;ca=cn}cx=cC.indexOf(cE,cj);if(cx!==-1&&cx<cv){cv=cx;ca=b6}if(cv===cC.length){return ci+cC.substr(cj)}b9=cv-cj;ci+=cC.substr(cj,b9);cj=cv;switch(ca){case b6:ck=cC.substr(cj,44);cd=bR.exec(ck);if(cd!==null){b8=cd[1];cf=b8!=="!";cz=cd[2]}else{break}cq=cD+b8+cz+" -->";ce=cq.length;cl=cC.indexOf(cq);if(cl===-1){cj++;break}cr=typeof cm[cz]!==aR&&cm[cz]!==false;if(cr===cf){cB="<!-- START INCLUDEIF "+b8+cz+" -->";ch=cB.length;cC=cC.substr(0,cj)+cC.substr(cj+ch,cl-cj-ch)+cC.substr(cl+ce)}else{cC=cC.substr(0,cj)+cC.substr(cl+ce)}break;case cs:ck=cC.substr(cj,22);cd=p.exec(ck);if(cd===null){ci+="#";cj++;continue}cb=cd[1];if(cm[cb]!==""&&!cm[cb]){ci+="#"+cb+"#";cj+=cb.length+2;continue}ci+=cm[cb];cj+=cb.length+2;break;case cn:ck=cC.substr(cj,45);cd=b.exec(ck);if(cd===null){ci+="<";cj++;continue}cp=cd[1];if(!cm[cp]||!(cm[cp] instanceof Array)){ci+="<";cj++;continue}cj+=cp.length+22;cy=cC.indexOf("<!-- END REPEAT "+cp+" -->",cj);if(cy===-1){ci+="<!-- START REPEAT "+cp+" -->";continue}cg=cy-cj;co=cC.substr(cj,cg);cc=cm[cp];for(ct=0;ct<cc.length;ct++){ci+=aZ(co,cc[ct])}cj+=cp.length+cg+20;break}}}function V(ca){var b6=bQ.trim(ca.val()),b7=0,b9=0,b8,cb;bD.hide();if(b6===""){return true}bV=t.exec(b6);if(bV===null){bV=aD.exec(b6);if(bV===null){bD.show();return false}b7=0;b9=bV[1]}else{b7=bV[1]?parseInt(bV[1],10):0;b9=bV[2]?parseInt(bV[2],10):0}if(b7===0&&b9===0){ca.val("")}else{b8=b7>0?b7+" hour":"";if(b7>1){b8+="s"}cb=b9>0?b9+" min":"";if(b9>1){cb+="s"}ca.val(bQ.trim(b8+" "+cb))}return true}function q(ca){var b7,b6,b8,b9="";for(b7=0;b7<ca.length;b7++){b6=ca[b7];if(b6.nodeType===3){b8=bQ.trim(b6.nodeValue);if(b8!==""){b9+=b8+"\n"}continue}if(b6.nodeType!==1){continue}if(b6.childNodes.length>0){b9+=q(b6.childNodes)}}return b9}function bS(){var b6;bQ(i,aM).remove();b6=T.selection.getNode();if(b6.nodeName==="#document"){b6=bu[0]}if(b6.nodeName.toUpperCase()==="BODY"){if(!bQ(b6).hasClass("mceContentBody")){b6=bu[0]}bQ(b6).append("&nbsp;"+aP)}else{while(b6.parentNode&&b6.parentNode.nodeName.toUpperCase()!=="BODY"){b6=b6.parentNode}if(!b6.parentNode){b6=bu[0];bQ(b6).append("&nbsp;"+aP)}else{if(b6.nodeName.toUpperCase()==="DIV"||b6.nodeName.toUpperCase()==="SPAN"){bQ(b6,aM).after(aP)}else{bQ(b6,aM).before(aP)}}}a5=-1;return bQ(i,aM)}function aa(b6,b8,b7){}function ac(b6){switch(b6.type){case"js":bQ("head").append(bQ('<script type="text/javascript">'+b6.js+"<\/script>"));w[b6.f]();break;case"html":bQ(b6.dest).html(b6.html);break}}function b5(){bL.unbind(at);bA.unbind(at);u.dialog(m);P=true;bC()}function M(cb,b7){var ca,b6="";var b9,b8;b9=cb.recipe;if(b7!=="success"){u.dialog(m);P=true;bC()}bF.val(bM(b9.recipe_title));F=b9.recipe_image;bh.val("");if(b9.author){x.val(bM(b9.author))}else{x.val("")}by.val(b9.cuisine||"");bh.val(b9.mealType||"");aX.val("");bZ.val(bM(b9.summary));bV=ax.exec(b9.prep_time);if(bV!==null){ca=bV[1]?bV[1]+"h ":"";az.val(ca+bV[2]+"m")}else{az.val(bM(b9.prep_time))}bV=ax.exec(b9.cook_time);if(bV!==null){ca=bV[1]?bV[1]+"h ":"";a0.val(ca+bV[2]+"m")}else{a0.val(bM(b9.cook_time))}bs.val(bM(b9.yield));bo.val(bM(b9.serving_size));if(b9.nutrition){b8=b9.nutrition;n.val(bM(b8.calories));aF.val(bM(b8.totalFat));bI.val(bM(b8.saturatedFat));aL.val(bM(b8.unsaturatedFat));ba.val(bM(b8.transFat));aq.val(bM(b8.totalCarbohydrates));bN.val(bM(b8.sugars));e.val(bM(b8.sodium));D.val(bM(b8.dietaryFiber));a2.val(bM(b8.protein));c.val(bM(b8.cholesterol))}else{n.val(bM(b9.calories));aF.val(bM(b9.fat))}for(ca=0;ca<cb.ingredients.length;ca++){b6+=J(bM(cb.ingredients[ca]))+"\n"}bB.val(b6);l.val(bM(b9.instructions.replace("\r","")));v.val(bM(b9.notes));bg.dialog("option","title","Update Recipe");u.dialog(m);bW.hide();bH.show();au.hide();if(F!==""){ad(F,bY.length,true)}b3=bS();bg.parent(".ui-dialog").css(aE,ae);bg.dialog(a1,aE,ae);bg.dialog(K)}function a4(){var b6;z.show();bL.unbind(at);bA.unbind(at);b6={action:"easyrecipeConvert",id:be,type:a9};bQ.post(ajaxurl,b6,M,"json")}function B(cg){var cf,cp,ch,cb=0,cl,ca="",b6="",b7="",cd="";var ce=["instruction","method","cooking method","procedure","direction"];var cq=["ingredients?"];var b8=["note","cooking note"];var cr;var cm;var b9;var cn,ci,ck;var co,cc,cj;co=bQ.parseJSON(w.ingredients);cc=bQ.parseJSON(w.instructions);cj=bQ.parseJSON(w.notes);if(bQ.inArray(co,cq)===-1){cq.push(co)}cm="^\\s*(?:"+cq.join("|")+")";ci=new RegExp(cm,"i");if(bQ.inArray(cc,ce)===-1){cq.push(cc)}cr="^\\s*(?:"+ce.join("|")+")";cn=new RegExp(cr,"i");if(bQ.inArray(cj,b8)===-1){b8.push(cj)}b9="^\\s*(?:"+b8.join("|")+")\\s*$";ck=new RegExp(b9,"i");cl=bQ("<div>"+cg+"</div>");cf=q(cl[0].childNodes);cf=cf.split("\n");for(cp=0;cp<cf.length;cp++){ch=bQ.trim(cf[cp]);if(ch===""){continue}if(cn.test(ch)){cb=2;continue}if(ci.test(ch)){cb=1;continue}if(ck.test(ch)){cb=3;continue}switch(cb){case 0:ca+=ch+"\n";break;case 1:b6+=ch+"\n";break;case 2:b7+=ch+"\n";break;case 3:cd+=ch+"\n";break}}return{summary:ca,ingredients:b6,instructions:b7,notes:cd}}function aw(){O.parent(".ui-dialog").css(aE,ae);O.dialog(a1,aE,ae);O.dialog(K)}function ab(b9,b6,b7){var b8;var ca=function(){var cb,cf,ce,cc,cd=bQ.data(this,"index");cb=this.width/150;cf=this.height/112;cb=cb>cf?cb:cf;ce=Math.floor(this.height/cb);cc=Math.floor(this.width/cb);bY[cd].height(ce);bY[cd].width(cc);bY[cd].css("top",(112-ce)/2);bY[cd].attr("src",this.src);if(cd===0){bQ("#ERDTabs").find(".divERNoPhotos").remove()}};aI.append('<div class="ERPhoto"><img style="position:relative" id="ERPhoto_'+b6+'" /></div>');bY[b6]=bQ("#ERPhoto_"+b6,aI);bY[b6].data("src",b9);if(b7){bQ(".ERPhoto",aI).removeClass(aW);bY[b6].parent().addClass(aW);bO=b6;F=b9}if(bq===""){bq=b9}b8=new Image();bQ.data(b8,"index",b6);b8.onload=ca;b8.src=b9}function ag(){ab(aB.val(),bY.length,true);aB.val("");E.hide();bQ(".divERNoPhotos").remove()}function bX(b6,b8){var b7,b9=false;for(b7=0;b7<bY.length;b7++){if(bY[b7].data("src")===b6){b9=true;break}}if(!b9){ab(b6,bY.length,b8)}}function af(cn,cq){var b9;var cs;var ce,cb;var co;var ca;var cr,cm,cl,cg,cd,ch,ci,ct;var b8={},cc="",b7="",b6="",ck="",cp;var cf,cj;if(cq===aG&&a3!==0){aw();return}if(cn&&cn.data===aC){cq=aC;cn=cn.delegateTarget}if(typeof cq===aR&&typeof cn===aR){a5=0}a3=1;a5=0;b3=bQ(".easyrecipe:first",aM);if(cq!==aG&&b3.length>1){b3=bQ(b3[cq]);a5=cq}cs=0;ch=bQ.support.cors?"json":"jsonp";bQ.ajax(ah,{dataType:ch,data:{v:w.version,p:cs,u:w.wpurl},success:ac,error:aa});U=false;if(typeof tinyMCE!==aR){if(tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden()){U=true}}if(!U){alert("You must use the Visual Editor to add or update an EasyRecipe");return}bF.val("");bh.val("");by.val("");aX.val("");x.val("");bZ.val("");az.val("");a0.val("");bs.val("");bB.val("");l.val("");bo.val("");n.val("");aF.val("");bI.val("");aL.val("");ba.val("");aq.val("");bN.val("");e.val("");D.val("");a2.val("");c.val("");v.val("");if(cq!==aG&&b3.length===1){bg.dialog("option","title","Update Recipe");au.hide();bW.hide();bH.show();Q=true}else{bJ=T.getContent();if(!P){cg=b2.exec(bJ)||aH.exec(bJ)||aQ.exec(bJ);if(!cg){b9=bQ("#hasRecipe").is(":checked")}if(cg||b9){if(b9){a9="recipress";be=w.postID}else{a9=cg[2];be=cg[3]}z.hide();bL.click(b5);bA.click(a4);ca=b4[a9];cl=bQ("#txtERCNVText1",u);cl.html(cl.html().replace("#plugin#",ca));aI.html("");bO=-1;bY=[];aI.html(ay);u.parent(".ui-dialog").css(aE,ae);u.dialog(a1,aE,ae);u.dialog(K);return}}if(w.isGuest){cf=bQ("#inpERAuthor").val()||"";x.val(cf)}bW.show();bH.hide();au.show();bg.dialog("option","title","Add a New Recipe");Q=false;if(X!==false){b8=B(X)}else{cp=T.selection.getContent();if(cp.length>20){b8=B(cp)}}if(b8.summary){cc=b8.summary}if(b8.ingredients){b7=b8.ingredients}if(b8.instructions){b6=b8.instructions}if(b8.notes){ck=b8.notes}b3=bS()}cj=b3;b3=bQ("<div>"+b3.html()+"</div>");bQ("#inpERCuisine").autocomplete({source:bQ.parseJSON(w.cuisines)}).autocomplete("widget").wrap('<div class="easyrecipeUI" />');bQ("#inpERType").autocomplete({source:bQ.parseJSON(w.recipeTypes)}).autocomplete("widget").wrap('<div class="easyrecipeUI" />');A=false;bE.off("change",j).on("change",j);S=false;if(bQ(".hrecipe",aM).length>0){if(confirm("This post is already hrecipe microformatted\n\nDo you want me to try to convert it to an EasyRecipe?")){S=true}}bm=(cq!==aG)?b3.find(".endeasyrecipe").text():w.version;if(bm===""){bm="2.2"}F=bQ('link[itemprop="image"]',b3).attr("href")||"";aI.html("");bO=-1;bq="";bY=[];aM.find("img").each(function(cu){var cv=false;if(bm<"3"){if(bQ(this).hasClass("photo")){cv=true}}else{cv=this.src===F}ab(this.src,cu,cv)});co=aM.contents().text();cg=an.exec(co);ci=bY.length;while(cg!==null){cb=bn.exec(cg[0]);if(cb!==null){ce=cb[1];ab(ce,ci);if(bm>"3"){if(F===ce){bY[ci].parent().addClass(aW);bO=ci}}else{if(R.test(cg[0])){bY[ci].parent().addClass(aW);bO=ci;F=ce}}ci++}cg=an.exec(co)}if(F!==""){bX(F,true)}br=bQ("#set-post-thumbnail").find("img").attr("src");if(br){bX(br,bO===-1)}if(bO===-1&&bY.length>0){bO=0;F=bq;bY[0].parent().addClass(aW)}aI.click(function(){O.parent(".ui-dialog").css(aE,ae);O.dialog(a1,aE,ae);O.dialog(K)});if(bY.length===0){aI.html(ay)}else{if(bO===-1){bY[0].parent().addClass(aW)}}bv=[];bp=[];ct=b3.find(".ERName .fn").html()||b3.find(".ERName").html();if(!ct||ct===""){bF.val(aj(bM(bQ("#title").val())))}else{bF.val(aj((bM(ct))))}bh.val(aj(bM(b3.find(".type").html())));x.val(aj(bM(b3.find(".author").html())));if(x.val()===""){x.val(aj(bQ.parseJSON(w.author)))}by.val(aj(bM(b3.find(".cuisine").html())));bZ.val(aj(cc+bM(b3.find(".summary").html())));if(bm>"3"){cd=b3.find('time[itemprop="prepTime"]').html()||"";az.val(bM(cd));cd=b3.find('time[itemprop="cookTime"]').html()||"";a0.val(bM(cd))}else{cd=b3.find(".preptime").html()||"";cg=bj.exec(cd);if(cg!==null){az.val(bM(cg[1]))}else{az.val("")}cd=b3.find(".cooktime").html()||"";cg=bj.exec(cd);if(cg!==null){a0.val(bM(cg[1]))}else{a0.val("")}}bs.val(bM(b3.find(".yield").html()));b3.find(".ingredients li").each(function(cv,cu){if(bQ(cu).hasClass(aO)){b7+="!"+aj(bM(cu.innerHTML))+"\n"}else{b7+=aj(bM(cu.innerHTML))+"\n"}});bB.val(b7);b3.find(".instructions li, .instructions .ERSeparator").each(function(cv,cu){cm=bQ.trim(cu.innerHTML.replace(/^[ 0-9.]*(.*)$/ig,"$1"));if(bQ(cu).hasClass(aO)){b6+="!"+cm+"\n"}else{b6+=cm+"\n"}});l.val(aj(bM(b6)));bo.val(bM(b3.find(".servingSize").html()));n.val(bM(b3.find(".calories").html()));aF.val(bM(b3.find(".fat").html()));bI.val(bM(b3.find(".saturatedFat").html()));aL.val(bM(b3.find(".unsaturatedFat").html()));ba.val(bM(b3.find(".transFat").html()));aq.val(bM(b3.find(".carbohydrates").html()));bN.val(bM(b3.find(".sugar").html()));e.val(bM(b3.find(".sodium").html()));D.val(bM(b3.find(".fiber").html()));a2.val(bM(b3.find(".protein").html()));c.val(bM(b3.find(".cholesterol").html()));cm=(bM(b3.find(".ERNotes").html())||"").replace(/<\/p>\n*<p>/ig,"\n\n").replace(/(?:<p>|<\/p>)/ig,"").replace(/<br *\/?>/ig,"\n");if(cm===""&&ck!==""){cm=ck}cm=aj(cm);cm=cm.replace(/\[br(?: ?\/)?\]/ig,"\n");v.val(aj(cm));if(I){if(I.name){bF.val(aj((bM(I.name))))}if(I.author){x.val(aj(I.author))}if(I.summary){bZ.val(aj(I.summary))}if(I.yield){bs.val(bM(I.yield))}if(I.type){bh.val(aj(bM(I.type)))}if(I.cuisine){by.val(aj(bM(I.cuisine)))}if(I.prepTime){az.val(bM(I.prepTime))}if(I.cookTime){a0.val(bM(I.cookTime))}if(I.summary){bZ.val(aj(I.summary))}}b3=cj;bg.parent(".ui-dialog").css(aE,ae);bg.dialog(a1,aE,ae);bg.dialog(K);bg.dialog("option","position","center")}function C(b6){a3=bQ(".easyrecipe",aM).length;if(L||a3===0){af(b6,aG);return}O.parent(".ui-dialog").css(aE,ae);O.dialog(a1,aE,ae);O.dialog(K)}function a8(){bg.dialog(m)}function r(){var b6=confirm("Are you sure you want to delete this recipe?");if(b6){b3.remove();b3=false;A=false}bg.dialog(m)}function am(){var b7=bQ("#inpERPaste");var b6,b8=b7.val();b6=B(b8);if(b6.ingredients.length===0&&b6.instructions.length===0){return}X=b8;b7.val("");I={name:g(y(bF.val())),author:g((aA(x))),yield:aA(bs),type:g((aA(bh))),cuisine:g((aA(by))),summary:g(aA(bZ)),servesize:aA(bo),prepTime:az.val(),cookTime:a0.val()};A=false;bg.dialog(m);C(null)}function bP(b7){var b6=bQ(b7.target).parent();var b8=b6.parent();if(b6.hasClass("easyrecipeAbove")){b8.before(al)}else{b8.after(al)}b6.remove();ai()}function ai(){var b8;var b7;var b6;b7=bQ("<div>"+aM[0].body.innerHTML+"</div>");b7.find(".easyrecipeAbove,.easyrecipeBelow").remove();b8=b7.find(".easyrecipe");b8.each(function(){var b9=bQ(this);if(b9.parent().hasClass("easyrecipeWrapper")){b9.unwrap()}bd(b9)});b6=b7.html();T.setContent(b6);b8=aM.find(".easyrecipe");b8.on("mousedown",null,aC,af);aM.find(".ERInsertLine").on(at,bP)}function bT(cc){var b9;var b7,b6,ca,b8;ca=cc.prev();b8=cc.next();b7=(ca.length===0||ca.hasClass("easyrecipe")||ca.hasClass("easyrecipeWrapper"));if(b7){try{b7=!(cc[0].previousSibling&&cc[0].previousSibling.nodeType===3)}catch(cb){}}b6=(b8.length===0||b8.hasClass("easyrecipe")||b8.hasClass("easyrecipeWrapper"));if(b6){try{b6=!(cc[0].nextSibling&&cc[0].nextSibling.nodeType===3)}catch(cb){}}if(!b7&&!b6){return}cc.wrap('<div class="easyrecipeWrapper mceNonEditable" />');b9=cc.parent();if(b7){b9.prepend('<div class="easyrecipeAbove mceNonEditable"><input class="ERInsertLine mceNonEditable" type="button" value="Insert line above" /></div>');b9.find("input").on(at,bP);bU.push(b9.find(".easyrecipeAbove")[0])}if(b6){b9.append('<div class="easyrecipeBelow mceNonEditable"><input class="ERInsertLine mceNonEditable" type="button" value="Insert line below" /></div>');b9.find("input").on(at,bP)}}function h(b6){bQ(".easyrecipeAbove,.easyrecipeBelow",b6).remove();bQ(".easyrecipe",b6).unwrap()}function bz(){var b6=bQ(".easyrecipe",aM);if(b6.length===0){return}b6.on("mousedown",null,aC,af);ai()}function aY(){var ci,cc="",b9,ch="",b6=0,cm="";var co,ck,cg,ca,cn,cd,cj,b7=[],cb;var b8,cl,cf,ce;if(!V(az)){return}if(!V(a0)){return}b9=bQ.trim(az.val());if(b9!==""){bV=t.exec(b9);co=bV[1]?parseInt(bV[1],10):0;ck=bV[2]?parseInt(bV[2],10):0;b6=co*60+ck;cg=co>0?co+"H":"";ca=ck>0?ck+"M":"";ch="PT"+cg+ca}else{b9=false}ci=bQ.trim(a0.val());if(ci!==""){bV=t.exec(ci);co=bV[1]?parseInt(bV[1],10):0;ck=bV[2]?parseInt(bV[2],10):0;cg=co>0?co+"H":"";ca=ck>0?ck+"M":"";b6+=co*60+ck;cc="PT"+cg+ca}else{ci=false}if(b6>0){co=Math.floor(b6/60);ck=b6%60;cg=co>0?co+" hour":"";if(co>1){cg+="s"}ca=ck>0?ck+" min":"";if(ck>1){ca+="s"}b6=bQ.trim(cg+" "+ca);cg=co>0?co+"H":"";ca=ck>0?ck+"M":"";cm="PT"+cg+ca}else{b6=false}cn=bB.val().split("\n");for(cj=0;cj<cn.length;cj++){cd=cn[cj];if(cd!==""){if(cd.charAt(0)==="!"){cb=true;cd=cd.substr(1)}else{cb=false}b7.push({ingredient:g(y(cd)),hasHeading:cb})}}cn=l.val().split("\n");cl=[];b8={INSTRUCTIONS:[]};for(cj=0;cj<cn.length;cj++){cd=bQ.trim(cn[cj].replace(/^[ 0-9\.]*(.*)$/ig,"$1"));if(cd!==""){if(cd.charAt(0)==="!"){if(b8.INSTRUCTIONS.length>0||b8.heading){cl.push(b8)}cd=cd.substr(1);b8={};b8.INSTRUCTIONS=[];b8.heading=y(cd)}else{b8.INSTRUCTIONS.push({instruction:g(y(cd))})}}}if(b8.INSTRUCTIONS.length>0||b8.heading){cl.push(b8)}cd=aA(v);if(cd){if(w.wpVersion<"3.5"){cd="<p>"+cd.replace(/\n\n/ig,"</p><p>").replace(/\n/ig,"<br />")+"</p>"}cd=cd.replace(/\n/g,"[br]")}cf={version:w.version,hasPhoto:F!=="",photoURL:F,name:g(y(bF.val())),author:g((aA(x))),preptime:b9,cooktime:ci,totaltime:b6,preptimeISO:ch,cooktimeISO:cc,totaltimeISO:cm,yield:aA(bs),type:g((aA(bh))),cuisine:g((aA(by))),summary:g(aA(bZ)),servesize:aA(bo),calories:aA(n),fat:aA(aF),satfat:aA(bI),unsatfat:aA(aL),transfat:aA(ba),carbs:aA(aq),sugar:aA(bN),sodium:aA(e),fiber:aA(D),protein:aA(a2),cholesterol:aA(c),notes:g(cd),INGREDIENTS:b7,STEPS:cl};if(cf.name===""){cf.name=false}ce=aZ(w.recipeTemplate,cf);if(S){bQ(".hrecipe",aM).remove()}if(a5===-1){b3=bQ(i,aM)}else{b3=bQ(".easyrecipe",aM);if(b3.length>0){b3=bQ(b3[a5])}}b3.before(ce);b3.remove();b3=false;bK.show();A=false;bg.dialog(m);a3=bQ(".easyrecipe",aM).length;bz()}function bx(b9,b6,ca){var b7;var b8;I=false;if(tinymce.majorVersion>"3"){if(b6.id!==av&&b6.id!=="wp_mce_fullscreen"){bQ("#"+b6.controlManager.buttons.easyrecipeTest._id).hide();bQ("#"+b6.controlManager.buttons.easyrecipeEdit._id).hide();bQ("#"+b6.controlManager.buttons.easyrecipeAdd._id).hide();return}if(b6.id===av){aM=bQ("#"+av+"_ifr").contents();ae=10000;b7=bQ("#"+b6.controlManager.buttons.easyrecipeTest._id);bK=bQ("#"+b6.controlManager.buttons.easyrecipeEdit._id)}else{aM=bQ("#wp_mce_fullscreen_ifr").contents();ae=200001;b7=bQ("#mce_fullscreen_easyrecipeTest");bK=bQ("#mce_fullscreen_easyrecipeEdit")}}else{if(b6.editorId!==av&&b6.editorId!=="wp_mce_fullscreen"){bQ("#"+b6.editorId+"_easyrecipeTest").hide();bQ("#"+b6.editorId+"_easyrecipeEdit").hide();bQ("#"+b6.editorId+"_easyrecipeAdd").hide();return}if(b6.editorId===av){aM=bQ("#"+av+"_ifr").contents();ae=10000;b7=bQ("#"+av+"_easyrecipeTest");bK=bQ("#"+av+"_easyrecipeEdit")}else{aM=bQ("#wp_mce_fullscreen_ifr").contents();ae=200001;b7=bQ("#mce_fullscreen_easyrecipeTest");bK=bQ("#mce_fullscreen_easyrecipeEdit")}}bu=bQ("body",aM);b8=bQ(".easyrecipe",aM);T=tinyMCE.activeEditor;b8.each(function(){bQ(this).addClass("mceNonEditable");bQ(".ERRatingOuter",this).remove();bQ(".ERHDPrint",this).remove();bQ(".ERLinkback",this).remove()});a3=b8.length;if(a3>0&&w.testURL!==""){b7.show()}else{b7.hide()}if(a3>0){bK.show()}else{bK.hide()}if(!aM.hasERCSS){bQ("head",aM).append('<link rel="stylesheet" type="text/css" href="'+w.easyrecipeURL+'/css/easyrecipe-entry.css" />');aM.hasERCSS=true}bz()}function aV(){bi.toggleClass("ERNone");bl.toggleClass("ERContract")}function bb(){bw.toggleClass("ERNone");bG.toggleClass("ERContract")}function aS(){if(window.getSelection){return window.getSelection()}if(document.getSelection){return document.getSelection()}if(document.selection){return document.selection.createRange().text}return null}function W(ca,b8){var cb,b7,b9,b6=/(?:<a( .*?")>)?<img( (?:.*?)?src="([^"]*?)"(?:.*)) \/>/i;b7=b6.exec(b8);cb=bQ("#ertmp_"+s,aM);if(b7!==null){ab(b7[3],bY.length);b9=aU.substring(0,bk);if(!b7[1]){bv.push(b7[2]);b9+="[img:"+bv.length+"]"}else{bp.push(b7[1]);bv.push(b7[2]);b9+="[url:"+bp.length+"][img:"+bv.length+"][/url]"}b9+=aU.substring(aN);o.val(b9)}o[0].focus();cb.remove()}function k(b9){var b6,b7,b8,cc,cb,ca;if(!w.isEntryDialog){return}b6=bQ("#ertmp_"+s,aM);if(typeof b9==="string"){b8=bQ(b9)}else{ca=b6.html();if(ca==="link"){b8=b6.parent("a");b6=b8}else{b8=bQ(b6.html())}}if(b8.is("a")){b7=b8.attr("href");cc=b8.attr("title");cb=b8.attr("target");cc=cc?' title="'+cc+'"':"";cb=cb?' target="'+cb+'"':"";b9='href="'+b7+'"'+cb+cc;bp.push(b9);o.val(aU.substring(0,bk)+"[url:"+bp.length+"]"+aU.substring(bk,aN)+"[/url]"+aU.substring(aN))}o[0].focus();b6.remove()}function ap(){var b8,b9,b7=false,b6;aw()}function ar(){I=false;C()}function aT(){I=false;af()}function a6(){if(a3>0&&!b0){b0=true;bt.parent(".ui-dialog").css(aE,ae);bt.dialog(a1,aE,ae);bt.dialog(K)}}function aJ(cb){var b8,b9,ca,b7;var b6=bQ("#wp-preview",cb.target).val();if(b6==="dopreview"){return true}if(a3===0){return true}ca=tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden();if(ca){b9=bQ("<div>"+T.getContent()+"</div>")}else{b7=bQ("#wp-content-editor-container").find("textarea");b9=bQ("<div>"+b7.val()+"</div>")}h(bQ(".easyrecipeWrapper",b9));bQ(".easyrecipe",b9).removeClass("mceNonEditable");b8=bQ.trim(b9.html());if(ca){T.setContent(b8)}else{b7.val(b8)}return true}function bf(b7){var b6;if(b7.target.innerHTML==""){return}b6=bQ(b7.target).find("img").attr("src");if(b6){bX(b6,false)}}function aK(b6){var b7,ca,b9,b8;b7=b6[0];for(ca=0;ca<b7.addedNodes.length;ca++){b9=bQ(b7.addedNodes[ca].innerHTML);b8=b9.find("img").attr("src");if(b8){bX(b8,false);break}}}bQ(function(){var cb;var b7;var ca;var b8;var b9;var b6=null;w=EASYRECIPE;if(w.button!==bQ.fn.button){b6=bQ.fn.button;bQ.fn.button=w.button}bg=bQ("#easyrecipeEntry");O=bQ("#easyrecipeUpgrade");bt=bQ("#easyrecipeHTMLWarn");av=w.isGuest?"guestpost":"content";bg.dialog({autoOpen:false,width:655,modal:true,dialogClass:"easyrecipeEntry",beforeClose:function(){if(A){if(!window.confirm("Are you sure you want to close without saving the recipe?")){return false}A=false}return true},close:function(){w.isEntryDialog=false;if(b3&&!Q){b3.remove()}b3=false;bQ(".easyrecipeEntry").filter(function(){return bQ(this).text()===""}).remove()},open:function(){w.isEntryDialog=true;bQ(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />');d.tabs({active:0,beforeActivate:ao});setTimeout(function(){var cc=bQ(".easyrecipeEntry");var cd=cc.offset();if(cd.top<Z){cd.top=Z;cc.offset(cd)}},250)}});bg.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');bE=bQ("#divERContainer").show();bt.dialog({autoOpen:false,width:420,modal:true,dialogClass:"easyrecipeHTMLWarn",close:function(){bQ(".easyrecipeHTMLWarn").filter(function(){return bQ(this).text()===""}).remove()},open:function(){bQ(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});bt.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');bQ(".divERHTMLWarnContainer").show();O.dialog({autoOpen:false,width:420,modal:true,dialogClass:"easyrecipeUpgrade",close:function(){bQ(".easyrecipeUpgrade").filter(function(){return bQ(this).text()===""}).remove()},open:function(){bQ(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});O.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');bQ(".divERUPGContainer").show();u=bQ("#easyrecipeConvert");z=bQ("#divERCNVSpinner");bL=bQ("#btnERCNVCancel");bA=bQ("#btnERCNVOK");z.hide();u.dialog({autoOpen:false,width:390,modal:true,dialogClass:"easyrecipeConvert",close:function(){bQ(".easyrecipeConvert").filter(function(){return bQ(this).text()===""}).remove()},open:function(){bQ(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});bQ("#divERCNVContainer").show();u.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');bQ(window).bind("easyrecipeadd",ar);bQ(window).bind("easyrecipeedit",aT);bQ(window).bind("easyrecipeload",bx);bQ(window).bind("easyrecipeimage",W);bQ(window).bind("easyrecipeguestimageuploaded",W);bc=bQ("#divERNext");Y=bQ("#btnERButtons");d=bQ("#ERDTabs");aI=bQ("#divERPhotos");bQ("input:submit",".easyrecipeUI").button();f=bQ("#ed_toolbar");bF=bQ("#inpERName");x=bQ("#inpERAuthor");bh=bQ("#inpERType");by=bQ("#inpERCuisine");aX=bQ("#inpERTags");bZ=bQ("textarea#taERSummary");bB=bQ("textarea#taERIngredients");l=bQ("textarea#taERInstructions");az=bQ("#inpERPrepTime");a0=bQ("#inpERCookTime");bs=bQ("#inpERYield");bo=bQ("#inpERServeSize");n=bQ("#inpERCalories");aF=bQ("#inpERFat");bI=bQ("#inpERSatFat");aL=bQ("#inpERUnsatFat");ba=bQ("#inpERTransFat");aq=bQ("#inpERCarbs");bN=bQ("#inpERSugar");e=bQ("#inpERSodium");D=bQ("#inpERFiber");a2=bQ("#inpERProtein");c=bQ("#inpERCholesterol");v=bQ("textarea#taERNotes");E=bQ("#divERAddImageURL");b9=bQ("#lnkERPhotoURL");bD=bQ(".ERTimeError");bW=bQ("#divERAdd");bH=bQ("#divERChange");N=bQ("#divERHeader");bi=bQ("#divEROther");bl=bQ("#divEROtherLabel");bw=bQ("#divERNotes");bG=bQ("#divERNotesLabel");au=bQ("#ERDPasteTab");aB=bQ("#fldERAPUImageURL");bQ("#btnERAdd").click(aY);bQ("#btnERNext").click(a);bQ("#btnERChange").click(aY);bQ("#btnERDelete").click(r);bQ("#btnERCancel").click(a8);b9.click(function(){O.parent(".ui-dialog").css(aE,ae);O.dialog(a1,aE,ae);O.dialog(K)});bQ("#btnERAIUCancel").click(function(){E.hide()});bQ("#btnERAIUOK").click(ag);bl.click(aV);bG.click(bb);az.change(function(cc){V(bQ(cc.target))});a0.change(function(cc){V(bQ(cc.target))});bQ("#btnERPaste").click(am);Z=bQ("#wpadminbar").height();a7=bQ("#divEREditBtns").on("mousedown","li",ap);bE.find('input[type="text"], textarea').on("blur",function(){ak=null}).on("focus",function(){ak=bQ(this)});bQ("#wp-link").bind("wpdialogclose",k);bC=C;b1=af;X=false;w.insertLink=k;w.insertUploadedImage=W;bd=bT;ad=ab;w.addListener=bz;bt.find("input").on(at,function(){bt.dialog(m)});bQ("#wp-content-editor-tools").on(at,"#content-html",a6);bQ("#post").on("submit",aJ);if(b6!==null){bQ.fn.button=b6}cb=bQ("#postimagediv").find(".inside");if(window.MutationObserver&&cb.length>0){b7=new MutationObserver(aK);b7.observe(cb[0],{childList:true})}else{cb.on("DOMSubtreeModified",bf)}if(window.QTags){QTags.addButton("easyrecipe","EasyRecipe",function(){alert(G)},"","","",900)}})}(jQuery));