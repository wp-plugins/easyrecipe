(function(ao){var S=jQuery.trim;var aK,aq,U,t,w,aj,p,q,R;var aJ,P,E,A=false,am,x,aI,aA,an;var v=/<!-- START INCLUDEIF (!?)([_a-z][_0-9a-z]{0,19}) -->/i;var az=/^#([_a-z][_0-9a-z]{0,19})#/im;var m=/<!-- START REPEAT ([_a-zA-Z][_0-9a-zA-Z]{0,19}) -->/m;var aL=/^([^<]*)/,g=/^(?:([0-9]+) *(?:h|hr|hrs|hour|hours))? *(?:([0-9]+) *(?:m|mn|mns|min|mins|minute|minutes))?$/i,Y=/^([0-9]+)$/;var l=/(.*)\[amd-recipeseo-recipe:([0-9]+)\](.*)/;var C=/(.*)\[amd-(recipeseo|zlrecipe)-recipe:([0-9]+)\](.*)/;var k,aM,aF,s;var ab=/PT(?:([0-9]*)+H)?([0-9]+)+M/i;var aN='<input type="button" class="ed_button" value="Easy Recipe" />',aE="Use the Visual Editor to add or edit an Easy Recipe";var ai='<div class="easyrecipeholder">Easy recipe</div>',aH=".easyrecipeholder",j="ERSeparator";var au,F,av,a,ak,at="option",L="zIndex",aG="http://www.easyrecipeplugin.com/checkUpdates.php";var V,d,M,X,Q,K,T,ap,u,ad;var aB,G,D,ax,c,Z,aa,y,n,I,af;var J="close",o="click",ay="open";function ah(aO){return aO?aO.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&nbsp;/g," "):""}function ae(aO){return aO?ao("<div />").text(aO).html():""}function ac(aO){return ao.trim(ae(aO.val()))||false}function b(){var aO=ao(".easyrecipe",av);aO.mousedown(function(aP){aP.stopPropagation();aF()})}function aD(bi,a4){var ba=0,a5=1,aO=2,bk;var bb,a2,aV,a1="",a0="",bd,aP,aS,bc,bf;var be="<!-- START REPEAT ",bm="<!-- START INCLUDEIF ",bl="<!-- END INCLUDEIF ";var aR,aQ,aX,bh,a8,aW,a3,a9,bj,aZ;var aT,a7,bg;var aY,a6,aU;bk=bi;a4=a4||{};while(true){bd=bk.length;aP=bk.indexOf("#",a1);if(aP!==-1){bd=aP;aS=ba}bc=bk.indexOf(be,a1);if(bc!==-1&&bc<bd){bd=bc;aS=a5}bf=bk.indexOf(bm,a1);if(bf!==-1&&bf<bd){bd=bf;aS=aO}if(bd===bk.length){return a0+bk.substr(a1)}aR=bd-a1;a0+=bk.substr(a1,aR);a1=bd;switch(aS){case aO:a2=bk.substr(a1,44);aV=v.exec(a2);if(aV!==null){aQ=aV[1];aX=aQ!=="!";bh=aV[2]}else{break}a8=bl+aQ+bh+" -->";aW=a8.length;a3=bk.indexOf(a8);if(a3===-1){a1++;break}a9=typeof a4[bh]!=="undefined"&&a4[bh]!==false;if(a9===aX){bj="<!-- START INCLUDEIF "+aQ+bh+" -->";aZ=bj.length;bk=bk.substr(0,a1)+bk.substr(a1+aZ,a3-a1-aZ)+bk.substr(a3+aW)}else{bk=bk.substr(0,a1)+bk.substr(a3+aW)}break;case ba:a2=bk.substr(a1,22);aV=az.exec(a2);if(aV===null){a0+="#";a1++;continue}aT=aV[1];if(a4[aT]!==""&&!a4[aT]){a0+="#"+aT+"#";a1+=aT.length+2;continue}a0+=a4[aT];a1+=aT.length+2;break;case a5:a2=bk.substr(a1,45);aV=m.exec(a2);if(aV===null){a0+="<";a1++;continue}a7=aV[1];if(!a4[a7]||!(a4[a7] instanceof Array)){a0+="<";a1++;continue}a1+=a7.length+22;bg=bk.indexOf("<!-- END REPEAT "+a7+" -->",a1);if(bg===-1){a0+="<!-- START REPEAT "+a7+" -->";continue}aY=bg-a1;a6=bk.substr(a1,aY);aU=a4[a7];for(bb=0;bb<aU.length;bb++){a0+=aD(a6,aU[bb])}a1+=a7.length+aY+20;break}}}function B(){ao(aH,av).remove();var aO=aK.selection.getNode();if(aO.nodeName==="#document"){aO=ao("body",av)[0]}if(aO.nodeName.toUpperCase()==="BODY"){if(!ao(aO).hasClass("mceContentBody")){aO=ao("body",av)[0]}ao(aO).append("&nbsp;"+ai)}else{while(aO.parentNode&&aO.parentNode.nodeName.toUpperCase()!=="BODY"){aO=aO.parentNode}if(!aO.parentNode){aO=ao("body",av)[0];ao(aO).append("&nbsp;"+ai)}else{if(aO.nodeName.toUpperCase()==="DIV"||aO.nodeName.toUpperCase()==="SPAN"){ao(aO,av).after(ai)}else{ao(aO,av).before(ai)}}}return ao(aH,av)}function e(){d.unbind(o);M.unbind(o);F.dialog(J);A=true;aF()}function O(aT,aP){var aS,aO="",aR=aT.recipe;if(aP!=="success"){F.dialog(J);A=true;aF()}U.val(ah(aR.recipe_title));P.val("");aJ.val("");ak=ab.exec(aR.prep_time);if(ak!==null){aS=ak[1]?ak[1]+"h ":"";p.val(aS+ak[2]+"m")}else{p.val(ah(aR.prep_time))}ak=ab.exec(aR.cook_time);if(ak!==null){aS=ak[1]?ak[1]+"h ":"";q.val(aS+ak[2]+"m")}else{q.val(ah(aR.cook_time))}if(aR.notes){af.val(ah(aR.notes))}t.val(ah(aR.summary));R.val(ah(aR.yield));G.val(ah(aR.calories));D.val(ah(aR.fat));aB.val(ah(aR.serving_size));for(aS=0;aS<aT.ingredients.length;aS++){var aQ=ah(aT.ingredients[aS]);aO+=S(aQ)+"\n"}w.val(aO);aj.val(ah(aR.instructions.replace("\r","")));au.dialog("option","title","Update Recipe");F.dialog(J);X.hide();Q.show();aI=B();au.dialog(at,L,a);au.dialog(ay)}function f(){V.show();d.unbind(o);M.unbind(o);var aO={action:"ERconvertRecipe",id:k,type:aM};ao.post(ajaxurl,aO,O,"json")}function ar(aS){var aO=ao.trim(aS.val()),aP=0,aR=0,aQ,aT;E.hide();if(aO===""){return true}ak=g.exec(aO);if(ak===null){ak=Y.exec(aO);if(ak===null){E.show();return false}aP=0;aR=ak[1]}else{aP=ak[1]?parseInt(ak[1],10):0;aR=ak[2]?parseInt(ak[2],10):0}if(aP===0&&aR===0){aS.val("")}else{aQ=aP>0?aP+" hour":"";if(aP>1){aQ+="s"}aT=aR>0?aR+" min":"";if(aR>1){aT+="s"}aS.val(ao.trim(aQ+" "+aT))}return true}function i(aS){var aP,aO,aQ,aR="";for(aP=0;aP<aS.length;aP++){aO=aS[aP];if(aO.nodeType===3){aQ=ao.trim(aO.nodeValue);if(aQ!==""){aR+=aQ+"\n"}continue}if(aO.nodeType!==1){continue}if(aO.childNodes.length>0){aR+=i(aO.childNodes)}}return aR}function H(aO,aQ,aP){}function al(aP,aQ,aO){switch(aP.type){case"js":ao("head").append(ao('<script type="text/javascript">'+aP.js+"<\/script>"));EASYRECIPE[aP.f]();break;case"html":ao(aP.dest).html(aP.html);break}}function N(){var aY,aX,aR,aP,aU;var aS="",aQ="";aU=ao.support.cors?"json":"jsonp";ao.ajax(aG,{dataType:aU,data:{v:EASYRECIPE.version},success:al,error:H});aq=false;if(typeof tinyMCE!=="undefined"){if(tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden()){aq=true}}if(!aq){alert("You must use the Visual Editor to add or update an Easy Recipe");return}aK=tinyMCE.activeEditor;U.val("");P.val("");aJ.val("");t.val("");p.val("");q.val("");R.val("");w.val("");aj.val("");aB.val("");G.val("");D.val("");ax.val("");c.val("");Z.val("");aa.val("");y.val("");n.val("");I.val("");af.val("");aI=ao(".easyrecipe",av);if(aI.length>0){K.html("Update Recipe");X.hide();Q.show();aA=true}else{x=aK.getContent();if(!A){aR=C.exec(x);if(aR){aM=aR[2];k=aR[3];V.hide();d.click(e);M.click(f);var aT=aM==="recipeseo"?"RecipeSEO":"ZipList";aX=ao("#txtERCNVText1",F);aX.html(aX.html().replace("#plugin#",aT));F.dialog(at,L,a);F.dialog(ay);return}}X.show();Q.hide();K.html("Add a New Recipe");aA=false;var aW=aK.selection.getContent();if(aW.length>20){aW=ao("<div>"+aW+"</div>");aX=i(aW[0].childNodes);aX=aX.split("\n");var aV=false;for(aW=0;aW<aX.length;aW++){if(/^(?:instruction|method|cooking method)/i.test(aX[aW])){aV=true;continue}if(/^Ingredient/i.test(aX[aW])){continue}if(!aV){aS+=aX[aW]+"\n"}else{aQ+=aX[aW]+"\n"}}}aI=B()}am=false;if(ao(".hrecipe",av).length>0){if(confirm("This post is already hrecipe microformatted\n\nDo you want me to try to convert it to an EasyRecipe?")){am=true}}var aO=av.find(".fn").html();if(typeof aO==="undefined"||!aO){U.val(ah(ao("#title").val()))}else{U.val(ah(aO))}P.val(ah(av.find(".tag").html()));aJ.val(ah(av.find(".author").html()));t.val(ah(av.find(".summary").html()));aP=av.find(".preptime").html()||"";aR=aL.exec(aP);if(aR!==null){p.val(ah(aR[1]))}else{p.val("")}aP=av.find(".cooktime").html()||"";aR=aL.exec(aP);if(aR!==null){q.val(ah(aR[1]))}else{q.val("")}R.val(ah(av.find(".yield").html()));av.find(".ingredients li").each(function(a0,aZ){if(ao(aZ).hasClass(j)){aS+="!"+ah(aZ.innerHTML)+"\n"}else{aS+=ah(aZ.innerHTML)+"\n"}});w.val(aS);av.find(".instructions li, .instructions .ERSeparator").each(function(a0,aZ){aY=ao.trim(aZ.innerHTML.replace(/^[ 0-9.]*(.*)$/ig,"$1"));if(ao(aZ).hasClass(j)){aQ+="!"+aY+"\n"}else{aQ+=aY+"\n"}});aj.val(ah(aQ));aB.val(ah(av.find(".servingSize").html()));G.val(ah(av.find(".calories").html()));D.val(ah(av.find(".fat").html()));ax.val(ah(av.find(".saturatedFat").html()));c.val(ah(av.find(".unsaturatedFat").html()));Z.val(ah(av.find(".carbohydrates").html()));aa.val(ah(av.find(".sugar").html()));y.val(ah(av.find(".fiber").html()));n.val(ah(av.find(".protein").html()));I.val(ah(av.find(".cholesterol").html()));aY=(ao(".ERNotes",av).html()||"").replace(/<\/p>\n*<p>/ig,"\n\n").replace(/(?:<p>|<\/p>)/ig,"").replace(/<br *\/?>/ig,"\n");af.val(aY);au.dialog(at,L,a);au.dialog(ay)}function aw(){au.dialog(J)}function ag(){var aO=confirm("Are you sure you want to delete this recipe?");if(aO){aI.remove();aI=false}au.dialog(J)}function z(){var a1,aV="",aT,a0="",aP=0,aR="";var a6,a3,aZ,aU,a5,aW,a2,aQ=[],aO;if(!ar(p)){return}if(!ar(q)){return}aT=ao.trim(p.val());if(aT!==""){ak=g.exec(aT);a6=ak[1]?parseInt(ak[1],10):0;a3=ak[2]?parseInt(ak[2],10):0;aP=a6*60+a3;aZ=a6>0?a6+"H":"";aU=a3>0?a3+"M":"";a0="PT"+aZ+aU}else{aT=false}a1=ao.trim(q.val());if(a1!==""){ak=g.exec(a1);a6=ak[1]?parseInt(ak[1],10):0;a3=ak[2]?parseInt(ak[2],10):0;aZ=a6>0?a6+"H":"";aU=a3>0?a3+"M":"";aP+=a6*60+a3;aV="PT"+aZ+aU}else{a1=false}if(aP>0){a6=Math.floor(aP/60);a3=aP%60;aZ=a6>0?a6+" hour":"";if(a6>1){aZ+="s"}aU=a3>0?a3+" min":"";if(a3>1){aU+="s"}aP=ao.trim(aZ+" "+aU);aZ=a6>0?a6+"H":"";aU=a3>0?a3+"M":"";aR="PT"+aZ+aU}else{aP=false}a5=w.val().split("\n");for(a2=0;a2<a5.length;a2++){aW=a5[a2];if(aW!==""){if(aW.charAt(0)==="!"){aO=true;aW=aW.substr(1)}else{aO=false}aQ.push({ingredient:ae(aW),isSeparator:aO})}}a5=aj.val().split("\n");var a4=[];var aS={INSTRUCTIONS:[]};for(a2=0;a2<a5.length;a2++){aW=ao.trim(a5[a2].replace(/^[ 0-9\.]*(.*)$/ig,"$1"));if(aW!==""){if(aW.charAt(0)==="!"){if(aS.INSTRUCTIONS.length>0||aS.separator){a4.push(aS)}aW=aW.substr(1);aS={};aS.INSTRUCTIONS=[];aS.separator=ae(aW)}else{aS.INSTRUCTIONS.push({instruction:ae(aW)})}}}if(aS.INSTRUCTIONS.length>0||aS.separator){a4.push(aS)}aW=ac(af);if(aW){aW="<p>"+aW.replace(/\n\n/ig,"</p><p>").replace(/\n/ig,"<br />")+"</p>"}var aY={version:EASYRECIPE.version,name:ae(U.val()),author:ac(aJ),preptime:aT,cooktime:a1,duration:aP,preptimeISO:a0,cooktimeISO:aV,durationISO:aR,yield:ac(R),type:ac(P),summary:ac(t),servesize:ac(aB),calories:ac(G),fat:ac(D),satfat:ac(ax),unsatfat:ac(c),carbs:ac(Z),sugar:ac(aa),fiber:ac(y),protein:ac(n),cholesterol:ac(I),notes:aW,INGREDIENTS:aQ,STEPS:a4};var aX=aD(EASYRECIPE.recipeTemplate,aY);if(am){ao(".hrecipe",av).remove()}aI.before(aX);aI.remove();aI=false;au.dialog(J);b()}function h(aR,aP,aS){var aQ;if(aP.editorId==="content"){av=ao("#content_ifr").contents();a=1000;aQ=ao("#content_easyrecipeTest")}else{av=ao("#mce_fullscreen_ifr").contents();a=200001;aQ=ao("#mce_fullscreen_easyrecipeTest")}var aO=ao(".easyrecipe",av);if(ao(".easyrecipe",av).length>0&&EASYRECIPE.testURL!==""){aQ.show()}else{aQ.hide()}if(!av.hasERCSS){ao("head",av).append('<link rel="stylesheet" type="text/css" href="'+EASYRECIPE.easyrecipeURL+'/easyrecipe-admin.css" />');av.hasERCSS=true}b()}function r(){T.toggleClass("ERNone");ap.toggleClass("ERContract")}function aC(){u.toggleClass("ERNone");ad.toggleClass("ERContract")}function W(){au=ao("#easyrecipeDialog");au.dialog({autoOpen:false,width:645,modal:true,close:function(){if(aI&&!aA){aI.remove()}aI=false}});ao("#divERContainer").show();F=ao("#easyrecipeConvert");V=ao("#divERCNVSpinner");d=ao("#btnERCNVCancel");M=ao("#btnERCNVOK");ao("#divERCNVContainer").show();V.hide();F.dialog({autoOpen:false,width:350,modal:true});an=ao("#ed_toolbar");U=ao("#inpERName");aJ=ao("#inpERAuthor");P=ao("#inpERType");t=ao("textarea#taERSummary");w=ao("textarea#taERIngredients");aj=ao("textarea#taERInstructions");p=ao("#inpERPrepTime");q=ao("#inpERCookTime");R=ao("#inpERYield");aB=ao("#inpERServeSize");G=ao("#inpERCalories");D=ao("#inpERFat");ax=ao("#inpERSatFat");c=ao("#inpERUnsatFat");Z=ao("#inpERCarbs");aa=ao("#inpERSugar");y=ao("#inpERFiber");n=ao("#inpERProtein");I=ao("#inpERCholesterol");af=ao("textarea#taERNotes");E=ao(".ERTimeError");X=ao("#divERAdd");Q=ao("#divERChange");K=ao("#divERHeader");T=ao("#divEROther");ap=ao("#divEROtherLabel");u=ao("#divERNotes");ad=ao("#divERNotesLabel");var aO=ao("#easyrecipeLaunch");ao("#easyrecipeLaunch").click(N);ao("#btnERAdd").click(z);ao("#btnERChange").click(z);ao("#btnERDelete").click(ag);ao("#btnERCancel").click(aw);ap.click(r);ad.click(aC);ao("#inpERPrepTime").change(function(aP){ar(ao(aP.target))});ao("#inpERCookTime").change(function(aP){ar(ao(aP.target))});an.append(ao(aN).click(function(){alert(aE)}));aF=N}ao(window).bind("easyrecipeopen",N);ao(window).bind("easyrecipeload",h);ao(W)}(jQuery));