(function(bJ){var H=jQuery.trim;var R,S,by,bR,bv,k,ax,aW,bm,at;var w,bc,bs,aT,bx,N=false,Q,bC,bU,O,f;var bK=/<!-- START INCLUDEIF (!?)([_a-z][_0-9a-z]{0,19}) -->/i;var o=/^#([_a-z][_0-9a-z]{0,19})#/im;var b=/<!-- START REPEAT ([_a-zA-Z][_0-9a-zA-Z]{0,19}) -->/m;var be=/^([^<]*)/,s=/^(?:([0-9]+) *(?:h|hr|hrs|hour|hours))? *(?:([0-9]+) *(?:m|mn|mns|min|mins|minute|minutes))?$/i,aB=/^([0-9]+)$/;var bT=/(.*)\[amd-(recipeseo|zlrecipe)-recipe:([0-9]+)\](.*)/;var ba,a4,bw,bS,V;var au=/PT(?:([0-9]*)+H)?([0-9]+)+M/i;var ak=/\[(?:img) +(?:[^\]]+?)\]/ig;var P=/class\s*=\s*"(?:[^"]+ )?photo[ "]/i;var a1=/(.*)(?:^| )photo(?: |$)(.*)/ig;var am=/class\s*=\s*"([^"]+)"/ig;var bi=/src\s*=\s*" *([^"]+?) *"/i;var bk=[];var bp=[];var aF='<input type="button" class="ed_button" value="EasyRecipe" />',E="Use the Visual Editor to add or edit an EasyRecipe";var bf,aK,aQ,ah=null,r=0,n,v,bn;var aM='<div class="easyrecipeholder">EasyRecipe</div>',i=".easyrecipeholder",aL="ERSeparator";var bb,M,F,t,aJ=null,bo,ac,bN,aX="option",aC="zIndex",d,W,a8,bQ,aG;var ar,y,bE,bu,bP,bA,L,bd,bg,bq,bz;var bj,m,aD,bB,aI,a6,ao,bG,e,B,aY,c,u,bD;var aZ,J=true,C,az,bH,X,a3;var l="close",aq="click",aN="undefined",I="open",aS="ERPhotoSelected",af="http://www.easyrecipeplugin.com/checkUpdates.php";var aw='<div class="divERNoPhotos">There are no photos in this post<br />Add photos anywhere in the post</div>';var bh,aE=-1,aA=-2,D="",bl,ai="&nbsp;",a9,ab,G;function al(bW,bX){W.show();a3.hide();a8.show();switch(bX.index){case 0:a3.css("right","10px");a3.show();break;case 3:a3.css("right","inherit");a8.hide();a3.show();break;case 4:W.hide();break}}function bF(bW){return bW?bW.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&nbsp;/g," "):""}function x(bW){return bW?bJ("<div />").text(bW).html():""}function ay(bW){return bJ.trim(x(bW.val()))||false}function a(bX,bY){var bW=d.tabs("option","selected");d.tabs("option","selected",++bW)}function ag(bX){var bZ,bW=/\[img +(.*?) *\/?\]/i,bY=/\[url ([^\]]+)\](.*?\[\/url\])/i;bZ=bW.exec(bX);while(bZ!==null){bp.push(bZ[1]);bX=bX.replace(bW,"[img:"+bp.length+"]");bZ=bW.exec(bX)}bZ=bY.exec(bX);while(bZ!==null){bk.push(bZ[1]);bX=bX.replace(bY,"[url:"+bk.length+"]$2");bZ=bY.exec(bX)}return bX}function g(bX){var b0,bZ,bW=/\[img:(\d+)\]/i,bY=/\[url:(\d+)\](.*?)\[\/url\]/i;bZ=bW.exec(bX);while(bZ!==null){b0=bp[bZ[1]-1];bX=bX.replace(bW,"[img "+b0+"]");bZ=bW.exec(bX)}bZ=bY.exec(bX);while(bZ!==null){b0=bk[bZ[1]-1];bX=bX.replace(bY,"[url "+b0+"]$2[/url]");bZ=bY.exec(bX)}return bX}function aV(cq,cc){var ci=0,cd=1,bW=2,cs;var cj,ca,b3,b9="",b8="",cl,bX,b0,ck,cn;var cm="<!-- START REPEAT ",cu="<!-- START INCLUDEIF ",ct="<!-- END INCLUDEIF ";var bZ,bY,b5,cp,cg,b4,cb,ch,cr,b7;var b1,cf,co;var b6,ce,b2;cs=cq;cc=cc||{};while(true){cl=cs.length;bX=cs.indexOf("#",b9);if(bX!==-1){cl=bX;b0=ci}ck=cs.indexOf(cm,b9);if(ck!==-1&&ck<cl){cl=ck;b0=cd}cn=cs.indexOf(cu,b9);if(cn!==-1&&cn<cl){cl=cn;b0=bW}if(cl===cs.length){return b8+cs.substr(b9)}bZ=cl-b9;b8+=cs.substr(b9,bZ);b9=cl;switch(b0){case bW:ca=cs.substr(b9,44);b3=bK.exec(ca);if(b3!==null){bY=b3[1];b5=bY!=="!";cp=b3[2]}else{break}cg=ct+bY+cp+" -->";b4=cg.length;cb=cs.indexOf(cg);if(cb===-1){b9++;break}ch=typeof cc[cp]!==aN&&cc[cp]!==false;if(ch===b5){cr="<!-- START INCLUDEIF "+bY+cp+" -->";b7=cr.length;cs=cs.substr(0,b9)+cs.substr(b9+b7,cb-b9-b7)+cs.substr(cb+b4)}else{cs=cs.substr(0,b9)+cs.substr(cb+b4)}break;case ci:ca=cs.substr(b9,22);b3=o.exec(ca);if(b3===null){b8+="#";b9++;continue}b1=b3[1];if(cc[b1]!==""&&!cc[b1]){b8+="#"+b1+"#";b9+=b1.length+2;continue}b8+=cc[b1];b9+=b1.length+2;break;case cd:ca=cs.substr(b9,45);b3=b.exec(ca);if(b3===null){b8+="<";b9++;continue}cf=b3[1];if(!cc[cf]||!(cc[cf] instanceof Array)){b8+="<";b9++;continue}b9+=cf.length+22;co=cs.indexOf("<!-- END REPEAT "+cf+" -->",b9);if(co===-1){b8+="<!-- START REPEAT "+cf+" -->";continue}b6=co-b9;ce=cs.substr(b9,b6);b2=cc[cf];for(cj=0;cj<b2.length;cj++){b8+=aV(ce,b2[cj])}b9+=cf.length+b6+20;break}}}function T(b0){var bW=bJ.trim(b0.val()),bX=0,bZ=0,bY,b1;bx.hide();if(bW===""){return true}bN=s.exec(bW);if(bN===null){bN=aB.exec(bW);if(bN===null){bx.show();return false}bX=0;bZ=bN[1]}else{bX=bN[1]?parseInt(bN[1],10):0;bZ=bN[2]?parseInt(bN[2],10):0}if(bX===0&&bZ===0){b0.val("")}else{bY=bX>0?bX+" hour":"";if(bX>1){bY+="s"}b1=bZ>0?bZ+" min":"";if(bZ>1){b1+="s"}b0.val(bJ.trim(bY+" "+b1))}return true}function p(b0){var bX,bW,bY,bZ="";for(bX=0;bX<b0.length;bX++){bW=b0[bX];if(bW.nodeType===3){bY=bJ.trim(bW.nodeValue);if(bY!==""){bZ+=bY+"\n"}continue}if(bW.nodeType!==1){continue}if(bW.childNodes.length>0){bZ+=p(bW.childNodes)}}return bZ}function bL(){bJ(i,aJ).remove();var bX=tinyMCE.activeEditor;var bW=R.selection.getNode();if(bW.nodeName==="#document"){bW=bo[0]}if(bW.nodeName.toUpperCase()==="BODY"){if(!bJ(bW).hasClass("mceContentBody")){bW=bo[0]}bJ(bW).append("&nbsp;"+aM)}else{while(bW.parentNode&&bW.parentNode.nodeName.toUpperCase()!=="BODY"){bW=bW.parentNode}if(!bW.parentNode){bW=bo[0];bJ(bW).append("&nbsp;"+aM)}else{if(bW.nodeName.toUpperCase()==="DIV"||bW.nodeName.toUpperCase()==="SPAN"){bJ(bW,aJ).after(aM)}else{bJ(bW,aJ).before(aM)}}}return bJ(i,aJ)}function Y(bW,bY,bX){}function Z(bX,bY,bW){switch(bX.type){case"js":bJ("head").append(bJ('<script type="text/javascript">'+bX.js+"<\/script>"));v[bX.f]();break;case"html":bJ(bX.dest).html(bX.html);break}}function bV(){bE.unbind(aq);bu.unbind(aq);t.dialog(l);N=true;bw()}function K(b0,bX){var bZ,bW="",bY=b0.recipe;if(bX!=="success"){t.dialog(l);N=true;bw()}by.val(bF(bY.recipe_title));D=bY.recipe_image;bc.val("");w.val("");bs.val("");aT.val("");bR.val(bF(bY.summary));bN=au.exec(bY.prep_time);if(bN!==null){bZ=bN[1]?bN[1]+"h ":"";ax.val(bZ+bN[2]+"m")}else{ax.val(bF(bY.prep_time))}bN=au.exec(bY.cook_time);if(bN!==null){bZ=bN[1]?bN[1]+"h ":"";aW.val(bZ+bN[2]+"m")}else{aW.val(bF(bY.cook_time))}bm.val(bF(bY.yield));m.val(bF(bY.calories));aD.val(bF(bY.fat));bj.val(bF(bY.serving_size));for(bZ=0;bZ<b0.ingredients.length;bZ++){bW+=H(bF(b0.ingredients[bZ]))+"\n"}bv.val(bW);k.val(bF(bY.instructions.replace("\r","")));u.val(bF(bY.notes));bb.dialog("option","title","Update Recipe");t.dialog(l);bP.hide();bA.show();ar.hide();if(D!==""){ab(D,bQ.length,true)}bU=bL();bb.dialog(aX,aC,ac);bb.dialog(I)}function a0(){y.show();bE.unbind(aq);bu.unbind(aq);var bW={action:"easyrecipeConvert",id:ba,type:a4};bJ.post(ajaxurl,bW,K,"json")}function z(b3){var b4,b1,b5,b2=0,bW,b0="",bY="",bX="",bZ="";bW=bJ("<div>"+b3+"</div>");b4=p(bW[0].childNodes);b4=b4.split("\n");for(b1=0;b1<b4.length;b1++){b5=bJ.trim(b4[b1]);if(b5===""){continue}if(/^(?:instruction|method|cooking method|procedure)/i.test(b5)){b2=2;continue}if(/^Ingredient/i.test(b5)){b2=1;continue}if(/^(?:note|cooking note)s?\s*$/i.test(b5)){b2=3;continue}switch(b2){case 0:b0+=b5+"\n";break;case 1:bY+=b5+"\n";break;case 2:bX+=b5+"\n";break;case 3:bZ+=b5+"\n";break}}return{summary:b0,ingredients:bY,instructions:bX,notes:bZ}}function av(bW){M.dialog(aX,aC,ac);M.dialog(I)}function aa(bZ,bW,bX){var b0=function(){var b1,b5,b4,b2,b3=bJ.data(this,"index");b1=this.width/150;b5=this.height/112;b1=b1>b5?b1:b5;b4=Math.floor(this.height/b1);b2=Math.floor(this.width/b1);bQ[b3].height(b4);bQ[b3].width(b2);bQ[b3].css("top",(112-b4)/2);bQ[b3].attr("src",this.src);if(b3===0){bJ("#ERDTabs .divERNoPhotos").remove()}};aG.append('<div class="ERPhoto"><img style="position:relative" id="ERPhoto_'+bW+'" /></div>');bQ[bW]=bJ("#ERPhoto_"+bW,aG);bQ[bW].data("src",bZ);if(bX){bJ(".ERPhoto",aG).removeClass(aS);bQ[bW].parent().addClass(aS);bH=bW;D=bZ}if(bl===""){bl=bZ}var bY=new Image();bJ.data(bY,"index",bW);bY.onload=b0;bY.src=bZ}function ae(){aa(az.val(),bQ.length,true);az.val("");C.hide();bJ(".divERNoPhotos").remove()}function ad(cb,ce){var cf,bW,ca,b9,b5,b4,b6,b7,cg;var bZ={},b3="",bX="",bY="",b8="",cd;if(ce===aE&&aZ!==0){av();return}if(cb&&cb.data===aA){ce=aA;cb=cb.delegateTarget}aZ=1;bU=bJ(".easyrecipe:first",aJ);if(ce!==aE&&bU.length>1){bU=bJ(bU[ce])}b6=bJ.support.cors?"json":"jsonp";bJ.ajax(af,{dataType:b6,data:{v:v.version},success:Z,error:Y});S=false;if(typeof tinyMCE!==aN){if(tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden()){S=true}}if(!S){alert("You must use the Visual Editor to add or update an EasyRecipe");return}by.val("");bc.val("");bs.val("");aT.val("");w.val("");bR.val("");ax.val("");aW.val("");bm.val("");bv.val("");k.val("");bj.val("");m.val("");aD.val("");bB.val("");aI.val("");a6.val("");ao.val("");bG.val("");e.val("");B.val("");aY.val("");c.val("");u.val("");if(ce!==aE&&bU.length===1){bb.dialog("option","title","Update Recipe");ar.hide();bP.hide();bA.show();O=true}else{bC=R.getContent();if(!N){b5=bT.exec(bC);if(b5){a4=b5[2];ba=b5[3];y.hide();bE.click(bV);bu.click(a0);var b0=a4==="recipeseo"?"RecipeSEO":"ZipList";b9=bJ("#txtERCNVText1",t);b9.html(b9.html().replace("#plugin#",b0));aG.html("");bH=-1;bQ=[];aG.html(aw);t.dialog(aX,aC,ac);t.dialog(I);return}}if(v.isGuest){w.val(bJ("#inpERAuthor").val())}bP.show();bA.hide();ar.show();bb.dialog("option","title","Add a New Recipe");O=false;if(V!==false){bZ=z(V)}else{cd=R.selection.getContent();if(cd.length>20){bZ=z(cd)}}if(bZ.summary){b3=bZ.summary}if(bZ.ingredients){bX=bZ.ingredients}if(bZ.instructions){bY=bZ.instructions}if(bZ.notes){b8=bZ.notes}bU=bL()}bJ("#inpERCuisine").autocomplete({source:bJ.parseJSON(v.cuisines)}).autocomplete("widget").wrap('<div class="easyrecipeUI" />');bJ("#inpERType").autocomplete({source:bJ.parseJSON(v.recipeTypes)}).autocomplete("widget").wrap('<div class="easyrecipeUI" />');Q=false;if(bJ(".hrecipe",aJ).length>0){if(confirm("This post is already hrecipe microformatted\n\nDo you want me to try to convert it to an EasyRecipe?")){Q=true}}bh=(ce!==aE)?bU.find(".endeasyrecipe").text():v.version;if(bh===""){bh="2.2"}D=bJ('link[itemprop="image"]',bU).attr("href")||"";aG.html("");bH=-1;bl="";bQ=[];aJ.find("img").each(function(ch){var ci=false;if(bh<"3"){if(bJ(this).hasClass("photo")){ci=true}}else{ci=this.src===D}aa(this.src,ch,ci)});var cc=aJ.contents().text();b5=ak.exec(cc);b7=bQ.length;while(b5!==null){var b2,b1=bi.exec(b5[0]);if(b1!==null){b2=b1[1];aa(b2,b7);if(bh>"3"){if(D===b2){bQ[b7].parent().addClass(aS);bH=b7}}else{if(P.test(b5[0])){bQ[b7].parent().addClass(aS);bH=b7;D=b2}}b7++}b5=ak.exec(cc)}if(D!==""){bW=false;for(cf=0;cf<bQ.length;cf++){if(bQ[cf].data("src")===D){bW=true;break}}if(!bW){aa(D,bQ.length,true)}}if(bH===-1&&bQ.length>0){bH=0;D=bl;bQ[0].parent().addClass(aS)}aG.click(function(ch){M.dialog(aX,aC,ac);M.dialog(I)});if(bQ.length===0){aG.html(aw)}else{if(bH===-1){bQ[0].parent().addClass(aS)}}bp=[];bk=[];if(bh>"3"){cg=bU.find(".ERName").html()}else{cg=bU.find(".fn").html()}if(typeof cg===aN||!cg){by.val(ag(bF(bJ("#title").val())))}else{by.val(ag((bF(cg))))}bc.val(ag(bF(bU.find(".type").html())));w.val(ag(bF(bU.find(".author").html())));if(w.val()===""){w.val(ag(bJ.parseJSON(v.author)))}bs.val(ag(bF(bU.find(".cuisine").html())));bR.val(ag(b3+bF(bU.find(".summary").html())));if(bh>"3"){b4=bU.find('time[itemprop="prepTime"]').html()||"";ax.val(bF(b4));b4=bU.find('time[itemprop="cookTime"]').html()||"";aW.val(bF(b4))}else{b4=bU.find(".preptime").html()||"";b5=be.exec(b4);if(b5!==null){ax.val(bF(b5[1]))}else{ax.val("")}b4=bU.find(".cooktime").html()||"";b5=be.exec(b4);if(b5!==null){aW.val(bF(b5[1]))}else{aW.val("")}}bm.val(bF(bU.find(".yield").html()));bU.find(".ingredients li").each(function(ci,ch){if(bJ(ch).hasClass(aL)){bX+="!"+ag(bF(ch.innerHTML))+"\n"}else{bX+=ag(bF(ch.innerHTML))+"\n"}});bv.val(bX);bU.find(".instructions li, .instructions .ERSeparator").each(function(ci,ch){ca=bJ.trim(ch.innerHTML.replace(/^[ 0-9.]*(.*)$/ig,"$1"));if(bJ(ch).hasClass(aL)){bY+="!"+ca+"\n"}else{bY+=ca+"\n"}});k.val(ag(bF(bY)));bj.val(bF(bU.find(".servingSize").html()));m.val(bF(bU.find(".calories").html()));aD.val(bF(bU.find(".fat").html()));bB.val(bF(bU.find(".saturatedFat").html()));aI.val(bF(bU.find(".unsaturatedFat").html()));a6.val(bF(bU.find(".transFat").html()));ao.val(bF(bU.find(".carbohydrates").html()));bG.val(bF(bU.find(".sugar").html()));e.val(bF(bU.find(".sodium").html()));B.val(bF(bU.find(".fiber").html()));aY.val(bF(bU.find(".protein").html()));c.val(bF(bU.find(".cholesterol").html()));ca=(bU.find(".ERNotes").html()||"").replace(/<\/p>\n*<p>/ig,"\n\n").replace(/(?:<p>|<\/p>)/ig,"").replace(/<br *\/?>/ig,"\n");if(ca===""&&b8!==""){ca=b8}u.val(ag(ca));if(G){if(G.name){by.val(ag((bF(G.name))))}if(G.author){w.val(ag(G.author))}if(G.summary){bR.val(ag(G.summary))}if(G.yield){bm.val(bF(G.yield))}if(G.type){bc.val(ag(bF(G.type)))}if(G.cuisine){bs.val(ag(bF(G.cuisine)))}if(G.prepTime){ax.val(bF(G.prepTime))}if(G.cookTime){aW.val(bF(G.cookTime))}if(G.summary){bR.val(ag(G.summary))}}bb.dialog(aX,aC,ac);bb.dialog(I);bb.dialog("option","position","center")}function A(bW){aZ=bJ(".easyrecipe",aJ).length;if(J||aZ===0){ad(bW,aE);return}M.dialog(aX,aC,ac);M.dialog(I)}function a5(){bb.dialog(l)}function q(){var bW=confirm("Are you sure you want to delete this recipe?");if(bW){bU.remove();bU=false}bb.dialog(l)}function aj(){var bW,bX=bJ("#inpERPaste").val();bW=z(bX);if(bW.ingredients.length===0&&bW.instructions.length===0){return}V=bX;bJ("#inpERPaste").val("");G={name:g(x(by.val())),author:g((ay(w))),yield:ay(bm),type:g((ay(bc))),cuisine:g((ay(bs))),summary:g(ay(bR)),servesize:ay(bj),prepTime:ax.val(),cookTime:aW.val()};bb.dialog(l);A(null)}function bI(bY){var bX=bJ(bY.target).parent();var bZ=bX.parent();if(bX.hasClass("easyrecipeAbove")){bZ.before(ai)}else{bZ.after(ai)}bJ(".easyrecipeAbove,.easyrecipeBelow",bZ).remove();var bW=bJ(".easyrecipe",bZ).unwrap();a9(bW)}function bM(b0){var bX,bW,bZ,bY;bZ=b0.prev();bY=b0.next();bX=(bZ.length===0||bZ.hasClass("easyrecipe")||bZ.hasClass("easyrecipeWrapper"));if(bX){bX=!(b0[0].previousSibling&&b0[0].previousSibling.nodeType===3)}bW=(bY.length===0||bY.hasClass("easyrecipe")||bY.hasClass("easyrecipeWrapper"));if(bW){bW=!(b0[0].nextSibling&&b0[0].nextSibling.nodeType===3)}if(!bX&&!bW){return}b0.wrap('<div class="easyrecipeWrapper" />');if(bX){b0.parent().prepend('<div class="easyrecipeAbove"><input class="ERInsertLine" type="button" value="Insert line above" /></div>')}if(bW){b0.parent().append('<div class="easyrecipeBelow"><input class="ERInsertLine" type="button" value="Insert line below" /></div>')}bJ(".easyrecipeWrapper .ERInsertLine",aJ).on(aq,bI)}function h(bW){bJ(".easyrecipeAbove,.easyrecipeBelow",bW).remove();bJ(".easyrecipe",bW).unwrap()}function bt(){var bW=bJ(".easyrecipe",aJ);if(bW.length===0){return}bW.on("mousedown",null,aA,ad);h(bJ(".easyrecipeWrapper",aJ));bW.each(function(){bM(bJ(this))})}function aU(){var b8,b2="",bZ,b7="",bW=0,cc="";var ce,ca,b6,b0,cd,b3,b9,bX=[],b1;if(!T(ax)){return}if(!T(aW)){return}bZ=bJ.trim(ax.val());if(bZ!==""){bN=s.exec(bZ);ce=bN[1]?parseInt(bN[1],10):0;ca=bN[2]?parseInt(bN[2],10):0;bW=ce*60+ca;b6=ce>0?ce+"H":"";b0=ca>0?ca+"M":"";b7="PT"+b6+b0}else{bZ=false}b8=bJ.trim(aW.val());if(b8!==""){bN=s.exec(b8);ce=bN[1]?parseInt(bN[1],10):0;ca=bN[2]?parseInt(bN[2],10):0;b6=ce>0?ce+"H":"";b0=ca>0?ca+"M":"";bW+=ce*60+ca;b2="PT"+b6+b0}else{b8=false}if(bW>0){ce=Math.floor(bW/60);ca=bW%60;b6=ce>0?ce+" hour":"";if(ce>1){b6+="s"}b0=ca>0?ca+" min":"";if(ca>1){b0+="s"}bW=bJ.trim(b6+" "+b0);b6=ce>0?ce+"H":"";b0=ca>0?ca+"M":"";cc="PT"+b6+b0}else{bW=false}cd=bv.val().split("\n");for(b9=0;b9<cd.length;b9++){b3=cd[b9];if(b3!==""){if(b3.charAt(0)==="!"){b1=true;b3=b3.substr(1)}else{b1=false}bX.push({ingredient:g(x(b3)),hasHeading:b1})}}cd=k.val().split("\n");var cb=[];var bY={INSTRUCTIONS:[]};for(b9=0;b9<cd.length;b9++){b3=bJ.trim(cd[b9].replace(/^[ 0-9\.]*(.*)$/ig,"$1"));if(b3!==""){if(b3.charAt(0)==="!"){if(bY.INSTRUCTIONS.length>0||bY.heading){cb.push(bY)}b3=b3.substr(1);bY={};bY.INSTRUCTIONS=[];bY.heading=x(b3)}else{bY.INSTRUCTIONS.push({instruction:g(x(b3))})}}}if(bY.INSTRUCTIONS.length>0||bY.heading){cb.push(bY)}b3=ay(u);if(b3){b3="<p>"+b3.replace(/\n\n/ig,"</p><p>").replace(/\n/ig,"<br />")+"</p>"}var b5={version:v.version,hasPhoto:D!=="",photoURL:D,name:g(x(by.val())),author:g((ay(w))),preptime:bZ,cooktime:b8,totaltime:bW,preptimeISO:b7,cooktimeISO:b2,totaltimeISO:cc,yield:ay(bm),type:g((ay(bc))),cuisine:g((ay(bs))),summary:g(ay(bR)),servesize:ay(bj),calories:ay(m),fat:ay(aD),satfat:ay(bB),unsatfat:ay(aI),transfat:ay(a6),carbs:ay(ao),sugar:ay(bG),sodium:ay(e),fiber:ay(B),protein:ay(aY),cholesterol:ay(c),notes:g(b3),INGREDIENTS:bX,STEPS:cb};var b4=aV(v.recipeTemplate,b5);if(Q){bJ(".hrecipe",aJ).remove()}bU.before(b4);bU.remove();bU=false;bD.show();bb.dialog(l);aZ=bJ(".easyrecipe",aJ).length;bt()}function br(bZ,bW,b0){G=false;if(bW.editorId!==at&&bW.editorId!=="wp_mce_fullscreen"){bJ("#"+bW.editorId+"_easyrecipeTest").hide();bJ("#"+bW.editorId+"_easyrecipeEdit").hide();bJ("#"+bW.editorId+"_easyrecipeAdd").hide();return}var bX;if(bW.editorId===at){aJ=bJ("#"+at+"_ifr").contents();ac=10000;bX=bJ("#"+at+"_easyrecipeTest");bD=bJ("#"+at+"_easyrecipeEdit")}else{aJ=bJ("#wp_mce_fullscreen_ifr").contents();ac=200001;bX=bJ("#mce_fullscreen_easyrecipeTest");bD=bJ("#mce_fullscreen_easyrecipeEdit")}bo=bJ("body",aJ);var bY=bJ(".easyrecipe",aJ);R=tinyMCE.activeEditor;bY.each(function(){bJ(this).addClass("mceNonEditable");bJ(".ERRatingOuter",this).remove();bJ(".ERHDPrint",this).remove();bJ(".ERLinkback",this).remove()});aZ=bY.length;if(aZ>0&&v.testURL!==""){bX.show()}else{bX.hide()}if(aZ>0){bD.show()}else{bD.hide()}if(!aJ.hasERCSS){bJ("head",aJ).append('<link rel="stylesheet" type="text/css" href="'+v.easyrecipeURL+'/css/easyrecipe-entry.css" />');aJ.hasERCSS=true}bt()}function aR(){bd.toggleClass("ERNone");bg.toggleClass("ERContract")}function a7(){bq.toggleClass("ERNone");bz.toggleClass("ERContract")}function aO(){if(window.getSelection){return window.getSelection()}if(document.getSelection){return document.getSelection()}if(document.selection){return document.selection.createRange().text}return null}function U(b0,bY){var b1,bX,bZ,bW=/(?:<a( .*?")>)?<img( (?:.*?)?src="([^"]*?)"(?:.*)) \/>/i;bX=bW.exec(bY);b1=bJ("#"+r,aJ);if(bX!==null){aa(bX[3],bQ.length);bZ=aQ.substring(0,bf);if(!bX[1]){bp.push(bX[2]);bZ+="[img:"+bp.length+"]"}else{bk.push(bX[1]);bp.push(bX[2]);bZ+="[url:"+bk.length+"][img:"+bp.length+"][/url]"}bZ+=aQ.substring(aK);n.val(bZ)}n[0].focus();b1.remove()}function j(bZ){var bW,bX,bY,b1,b0;if(!v.isEntryDialog){return}bW=bJ("#ertmp_"+r,aJ);if(typeof bZ==="string"){bY=bJ(bZ)}else{bY=bJ(bW.html())}if(bY.is("a")){bX=bY.attr("href");b1=bY.attr("title");b0=bY.attr("target");b1=b1?' title="'+b1+'"':"";b0=b0?' target="'+b0+'"':"";bZ='href="'+bX+'"'+b0+b1;bk.push(bZ);n.val(aQ.substring(0,bf)+"[url:"+bk.length+"]"+aQ.substring(bf,aK)+"[/url]"+aQ.substring(aK))}n[0].focus();bW.remove()}function an(){av()}function ap(){G=false;A()}function aP(){G=false;ad()}function a2(bW){if(aZ>0){bn.dialog(aX,aC,ac);bn.dialog(I)}}function aH(b0){var bX,bY,bZ,bW;if(aZ===0){return}bZ=tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden();if(bZ){bY=bJ("<div>"+R.getContent()+"</div>")}else{bW=bJ("#post textarea");bY=bJ("<div>"+bW.val()+"</div>")}h(bJ(".easyrecipeWrapper",bY));bJ(".easyrecipe",bY).removeClass("mceNonEditable");bX=bJ.trim(bY.html());if(bZ){R.setContent(bX)}else{bW.val(bX)}return true}function bO(){bb=bJ("#easyrecipeEntry");M=bJ("#easyrecipeUpgrade");bn=bJ("#easyrecipeHTMLWarn");v=EASYRECIPE;at=v.isGuest?"guestpost":"content";bb.dialog({autoOpen:false,width:655,modal:true,dialogClass:"easyrecipeEntry",close:function(){v.isEntryDialog=false;if(bU&&!O){bU.remove()}bU=false;bJ(".easyrecipeEntry").filter(function(){if(bJ(this).text()===""){return true}return false}).remove()},open:function(bX,bY){v.isEntryDialog=true;var bW=bJ(".easyrecipeEntry").offset();bJ(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />');d.tabs({selected:0,select:al});setTimeout(function(){var bZ=bJ(".easyrecipeEntry");var b0=bZ.offset();if(b0.top<X){b0.top=X;bZ.offset(b0)}},250)}});bb.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');bJ("#divERContainer").show();bn.dialog({autoOpen:false,width:420,modal:true,dialogClass:"easyrecipeHTMLWarn",close:function(){bJ(".easyrecipeHTMLWarn").filter(function(){if(bJ(this).text()===""){return true}return false}).remove()},open:function(bW,bX){bJ(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});bn.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');bJ(".divERHTMLWarnContainer").show();M.dialog({autoOpen:false,width:420,modal:true,dialogClass:"easyrecipeUpgrade",close:function(){bJ(".easyrecipeUpgrade").filter(function(){if(bJ(this).text()===""){return true}return false}).remove()},open:function(bW,bX){bJ(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});M.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');bJ(".divERUPGContainer").show();t=bJ("#easyrecipeConvert");y=bJ("#divERCNVSpinner");bE=bJ("#btnERCNVCancel");bu=bJ("#btnERCNVOK");y.hide();t.dialog({autoOpen:false,width:390,modal:true,dialogClass:"easyrecipeConvert",close:function(){bJ(".easyrecipeConvert").filter(function(){if(bJ(this).text()===""){return true}return false}).remove()},open:function(bW,bX){bJ(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});bJ("#divERCNVContainer").show();t.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');bJ(window).bind("easyrecipeadd",ap);bJ(window).bind("easyrecipeedit",aP);bJ(window).bind("easyrecipeload",br);bJ(window).bind("easyrecipeimage",U);bJ(window).bind("easyrecipeguestimageuploaded",U);a8=bJ("#divERNext");W=bJ("#btnERButtons");d=bJ("#ERDTabs");aG=bJ("#divERPhotos");bJ("input:submit",".easyrecipeUI").button();f=bJ("#ed_toolbar");by=bJ("#inpERName");w=bJ("#inpERAuthor");bc=bJ("#inpERType");bs=bJ("#inpERCuisine");aT=bJ("#inpERTags");bR=bJ("textarea#taERSummary");bv=bJ("textarea#taERIngredients");k=bJ("textarea#taERInstructions");ax=bJ("#inpERPrepTime");aW=bJ("#inpERCookTime");bm=bJ("#inpERYield");bj=bJ("#inpERServeSize");m=bJ("#inpERCalories");aD=bJ("#inpERFat");bB=bJ("#inpERSatFat");aI=bJ("#inpERUnsatFat");a6=bJ("#inpERTransFat");ao=bJ("#inpERCarbs");bG=bJ("#inpERSugar");e=bJ("#inpERSodium");B=bJ("#inpERFiber");aY=bJ("#inpERProtein");c=bJ("#inpERCholesterol");u=bJ("textarea#taERNotes");C=bJ("#divERAddImageURL");bx=bJ(".ERTimeError");bP=bJ("#divERAdd");bA=bJ("#divERChange");L=bJ("#divERHeader");bd=bJ("#divEROther");bg=bJ("#divEROtherLabel");bq=bJ("#divERNotes");bz=bJ("#divERNotesLabel");ar=bJ("#ERDPasteTab");az=bJ("#fldERAPUImageURL");bJ("#btnERAdd").click(aU);bJ("#btnERNext").click(a);bJ("#btnERChange").click(aU);bJ("#btnERDelete").click(q);bJ("#btnERCancel").click(a5);bJ("#lnkERPhotoURL").click(function(){M.dialog(aX,aC,ac);M.dialog(I)});bJ("#btnERAIUCancel").click(function(){C.hide()});bJ("#btnERAIUOK").click(ae);bg.click(aR);bz.click(a7);bJ("#inpERPrepTime").change(function(bW){T(bJ(bW.target))});bJ("#inpERCookTime").change(function(bW){T(bJ(bW.target))});bJ("#btnERPaste").click(aj);X=bJ("#wpadminbar").height();a3=bJ("#divEREditBtns").on("mousedown","#divEREditBtns li",an);bJ('#divERContainer input[type="text"], #divERContainer textarea').on("blur",function(){ah=null}).on("focus",function(){ah=bJ(this)});bJ("#wp-link").bind("wpdialogclose",j);bw=A;bS=ad;V=false;v.insertLink=j;v.insertUploadedImage=U;a9=bM;ab=aa;bJ("#easyrecipeHTMLWarn input").on(aq,function(){bn.dialog(l)});bJ("#wp-content-editor-tools").on(aq,"#content-html",a2);bJ("#post").on("submit",aH)}bJ(bO)}(jQuery));