(function(G){var X,l,ad,u,N,s,L,q,b,d;var g=/^(?:[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)$/i;var Q="click",O,j,t,e=EASYRECIPE,f,B,a,y="option",p="zIndex",Y="open";var R=/^(?:[a-f\d]{4}-){7}[a-f\d]{4}$/i,I,x,n,U="change",P,W;var C=0,Z=1,i=2,ac=3,k=4,M=5,z=6,m=7,h;function H(ag){N.hide();if(ag.status==="OK"){G("#ERDOK").show()}else{u.show();ad.show()}}function r(ag){B.tabs({selected:ag})}function af(){if(G.trim(x.val())===""){x.showErrorRight("Please enter your first name");return false}return true}function T(){if(!g.test(G.trim(n.val()))){n.showErrorRight("Oops! This doesn't seem to be a valid email address");return false}return true}function K(){if(G.trim(I.val())===""){I.showErrorRight("Please tell us about the problem");return false}return true}function A(){var ah,ag;G(".showError").dialog("destroy").remove();ag=af();ag=T()&&ag;ag=K()&&ag;if(!ag){return}ah={action:"easyrecipeSupport",name:encodeURIComponent(G.trim(x.val())),email:encodeURIComponent(G.trim(n.val())),problem:encodeURIComponent(G.trim(I.val())),diagnostics:G("#cbERDSendDiagnostics").attr("checked")};u.hide();ad.hide();N.show();G.post(ajaxurl,ah,H,"json")}function V(){G("#divERSStyles .ERSStyle").removeClass("ERSStyleSelected");G(this).addClass("ERSStyleSelected");X.val(G("input",this).val())}function ae(){G("#divERSPrintStyles .ERSStyle").removeClass("ERSStyleSelected");G(this).addClass("ERSStyleSelected");l.val(G("input",this).val())}function ab(){if(this.checked){L.removeClass("ERSNoSwoop")}else{L.addClass("ERSNoSwoop")}}function o(){if(this.checked){q.removeClass("ERSNoSubscribe")}else{q.addClass("ERSNoSubscribe")}}function E(ag,ah){if(ah.index===z||ah.index===M){s.hide()}else{s.show()}}function v(ai,ag){var ah=G.trim(b.val());if(ah!==""&&!g.test(ah)){r(C);b.showErrorRight("Oops! This doesn't seem to be a valid email address",{clear:"#cbERSSubscribe"});return false}if(ag&&ah===""){r(C);b.showErrorRight("You need to tell us your email address",{clear:"#cbERSSubscribe"});return false}return true}function c(aj,ah){var ak=G.trim(O.val());if(ak!==""){if(!/^SW-\d{8}-/i.test(ak)){r(C);O.showErrorLeft("That's not a valid Swoop ID");return false}var ag=G("a",j);var ai=G("a",j).attr("href");ai=ai.replace(/site_id=(.*)/ig,"site_id="+ak);G("a",j).attr("href",ai);t.addClass("ERSDisplayNone");j.removeClass("ERSDisplayNone")}else{t.removeClass("ERSDisplayNone");j.addClass("ERSDisplayNone")}if(ah&&ak===""){r(C);O.showErrorLeft("You must enter a valid ID to enable Swoop");return false}return true}function F(){var ag=G.trim(f.val());if(ag!==""&&!R.test(ag)){r(C);f.showErrorRight("This is not a valid license key");return false}return true}function aa(ah){var ag=true;G(".showError").dialog("destroy").remove();ag=F()&&ag;if(P.is(":checked")){ag=v(null,true)}if(W.is(":checked")){ag=c(null,true)&&ag}if(!ag){ah.preventDefault()}}function J(){h.html("Version check failed")}function D(ag){if(!ag.version||!ag.msg){J();return}h.html(ag.msg)}function S(ag){d.dialog(Y);ag.preventDefault();ag.stopPropagation()}function w(ag){G("div",a).addClass("ERSDisplayNone");G("#divERS"+ag.target.value+"Settings",a).removeClass("ERSDisplayNone")}G(function(){X=G("#divERSStyles .ERSSelectedStyle");l=G("#divERSPrintStyles").find(".ERSSelectedPrintStyle");d=G("#easyrecipeUpgrade");u=G("#btnERSendSupport");B=G("#divERSTabs");B.tabs({selected:C,select:E});G(".ERSStyleTabs").tabs({selected:0});h=G("#spnERSLatestVersion");G("#divERSStyles").on(Q,".ERSStyle",V);G("#divERSPrintStyles").on(Q,".ERSStyle",ae);s=G("#divERSSave input").button();u.button().on(Q,A);L=G("#divERSSwoopSettings");q=G("#trERSSubscribe");W=G("#cbERSEnableSwoop").on(Q,ab);P=G("#cbERSSubscribe").on(Q,o);ad=G("#ERDFail");N=G("#ERDSending");a=G(".ERSSaveButtons");a.on(Q,S);b=G('.ERSSubscribe input[name="ERPlusSettings[erEmailAddress]"]').on(U,v);G(".ERSSubscribe").on(Q,function(){G(".ERSubscribeError").css("visibility","hidden")});O=G('input[name="'+e.settingsName+'[swoopSiteID]"]',L);O.on("change",c);f=G('input[name="'+e.settingsName+'[licenseKey]"]').on(U,F);t=G("#divERSRegisterSwoop");j=G("#divERSLoginSwoop");G("#frmERSForm").on("submit",aa);x=G("#inpERDName").on(U,af);n=G("#inpERDEmail").on(U,T);I=G("#inpERDProblem").on(U,K);e.jQuery=G;d.dialog({autoOpen:false,width:420,modal:true,dialogClass:"easyrecipeUpgrade",close:function(){G(".easyrecipeUpgrade").filter(function(){return G(this).text()===""}).remove()},open:function(ai,aj){G(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}});d.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />');G(".divERUPGContainer").show();var ah=0;var ag=G.support.cors?"json":"jsonp";G.ajax({url:"http://www.easyrecipeplugin.com/checkUpdates1.php",type:"GET",dataType:"jsonp",data:{dType:ag,a:"check",v:e.pluginVersion,k:e.license,u:e.wpurl,p:ah},success:D,error:J})})}(jQuery));(function(d){var c="focus",a;function b(f){f.data.clear.off(c,b);f.data.errDiv.dialog("destroy");f.data.errDiv.remove()}d.fn.showError=function(o,p){var k,m,j,n,f,g,i,e;p=p||{};p.clear=p.clear||[];if(typeof p.clear==="string"){p.clear=[p.clear]}var l={position:"right",container:null,clear:[]};d.extend(l,p);a=l.container||this.closest("div");k=this;for(m=0;m<l.clear.length;m++){k=k.add(l.clear[m])}i='<span class="showError showError-'+l.position+'">';i+='<div class="showErrorLeftPtr"></div><div class="showErrorMsg">'+o;i+='</div><div class="showErrorRightPtr"></div></span>';i=d(i).appendTo("body");j=i.outerHeight();g=this.offset();n=g.top+(this.outerHeight()/2)-12;f=g.left;e=i.outerWidth();if(l.position==="right"){f+=this.outerWidth()}else{f-=e}i.dialog({dialogClass:"showErrorDialog",draggable:false,resizable:false,autoOpen:false,closeText:"",width:e,position:[f,n],maxHeight:j,minHeight:j});d(a).prepend(i.dialog("widget"));i.dialog("open");k.on(c,{clear:k,errDiv:i},b);i.css("width",e+5)};d.fn.showErrorLeft=function(f,e){e=e||{};this.showError(f,e)};d.fn.showErrorRight=function(f,e){e=e||{};e.position="right";this.showError(f,e)}}(jQuery));