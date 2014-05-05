window.EASYRECIPE=window.EASYRECIPE||{};
(function(a){function v(b){var d,e;I.hide();if("OK"===b.status)a("#ERDOK").show();else{w.show();e=a("#ERDErrors",x);e.empty();for(d=0;d<b.errors.length;d++)e.append(a("<p>"+b.errors[d]+"</p>"));x.show()}}function l(a){y.tabs({active:a})}function z(b,d){a(d.newTab||d.tab).find("a").hasClass("ERSNoSave")?J.hide():J.show()}function A(){return""===a.trim(B.val())?(B.showErrorRight("Please enter your first name"),!1):!0}function c(){return Q.test(a.trim(C.val()))?!0:(C.showErrorRight("Oops! This doesn't seem to be a valid email address"),
!1)}function m(){return""===a.trim(D.val())?(D.showErrorRight("Please tell us about the problem"),!1):!0}function n(){var b;a(".showError").dialog("destroy").remove();b=A();b=c()&&b;if(b=m()&&b)b={action:"easyrecipeSupport",inpName:encodeURIComponent(a.trim(B.val())),inpEmail:encodeURIComponent(a.trim(C.val())),inpSubject:encodeURIComponent(a.trim(a("#inpERDSubject").val())),inpMessage:encodeURIComponent(a.trim(D.val())),sendDiagnostics:a("#cbERDSendDiagnostics").attr("checked")},w.hide(),x.hide(),
I.show(),a.post(ajaxurl,b,v,"json")}function E(){a("#divERSStyles ").find(".ERSStyle").removeClass("ERSStyleSelected");a(this).addClass("ERSStyleSelected");R.val(a("input",this).val())}function h(){a("#divERSPrintStyles").find(".ERSStyle").removeClass("ERSStyleSelected");a(this).addClass("ERSStyleSelected");S.val(a("input",this).val())}function g(){this.checked?F.removeClass("ERSNoSwoop"):F.addClass("ERSNoSwoop")}function p(){this.checked?K.removeClass("ERSNoSubscribe"):K.addClass("ERSNoSubscribe")}
function k(b,d){var e=a.trim(G.val());return""===e||Q.test(e)?d&&""===e?(l(q),G.showErrorRight("You need to tell us your email address",{clear:"#cbERSSubscribe"}),!1):!0:(l(q),G.showErrorRight("Oops! This doesn't seem to be a valid email address",{clear:"#cbERSSubscribe"}),!1)}function T(b,d){var e,c=a.trim(t.val());if(""!==c){if(!/^SW-\d{8}-/i.test(c))return l(q),t.showErrorLeft("That's not a valid Swoop ID"),!1;a("a",r);e=a("a",r).attr("href");e=e.replace(/site_id=(.*)/ig,"site_id="+c);a("a",r).attr("href",
e);L.addClass(H);r.removeClass(H)}else L.removeClass(H),r.addClass(H);return d&&""===c?(l(q),t.showErrorLeft("You must enter a valid ID to enable Swoop"),!1):!0}function U(){var b,d,c=a.trim(u.val());u.val(c);if(""==c)return!0;b=ba.test(c);if(!b&&!ca.test(c))return l(q),u.showErrorRight("This is not a valid license key"),!1;if(b){d="";for(b=0;8>b;b++)d+=c.substr(4*b,4)+"-";u.val(d.substr(0,39))}return!0}function da(b){var c=!0;a(".showError").dialog("destroy").remove();c=U()&&c;V.is(":checked")&&
(c=k(null,!0));W.is(":checked")&&(c=T(null,!0)&&c);c||b.preventDefault()}function X(){M.html("Version check failed")}function ea(b){if(b.version&&b.msg)switch(M.html(b.msg),b.type){case "js":a("head").append(a('<script type="text/javascript">'+b.js+"\x3c/script>"));f[b.f]();break;case "html":a(b.dest).html(b.html)}else X()}function Y(a){a.preventDefault();a.stopPropagation();s.dialog(fa);f.isWP39||s.parent(".ui-dialog").css("z-index",100)}function ga(){a("#divFDFirstRun").hide();a("#divFDScanScheduled").show();
a("#divFDRetrieving").hide();a("#divFDStatus").hide();(new Date).getTime();a("#inpFDEnable").attr("checked","checked")}function ha(){alert("Schedule failed")}function Z(b){b&&(b.stopPropagation(),b.preventDefault());a.ajax({url:ajaxurl,type:"post",data:{action:"easyrecipeScanSchedule"},success:ga,error:ha})}function ia(){confirm("You normally only need to run a site scan once but it won't do any harm to run it again\n\nPress OK to re-run a site scan")&&Z()}function ja(b){var c,e=b.fields;for(c in e)e.hasOwnProperty(c)&&
(b="#tdFD"+c,a(b).text(e[c]));a("#spnFDLASTSCAN").text(f.lastScan);a("#divFDRetrieving").hide();a("#divFDStatus").show()}function ka(){alert("Site statistics failed")}function $(){a.ajax({url:la,type:"POST",dataType:"json",data:{site:f.wpurl,apikey:f.fdAPIKey},success:ja,error:ka})}function ma(b){b.stopPropagation();b.preventDefault();a("#divFDScanScheduled").hide();a("#divFDRetrieving").show();$()}function na(){a("#inpFDEnable").removeAttr("checked");N.submit()}var R,S,x,w,I,J,F,K,G,s,Q=/^(?:[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)$/i,
t,r,L,u,y,aa,fa="open",ca=/^(?:[a-f\d]{4}-){7}[a-f\d]{4}$/i,ba=/^[a-f\d]{32}$/i,D,B,C,V,W,H="ERSDisplayNone",M,f,O,P,N,la="http://www.fooderific.com/plugin/sitestats.php",q=0;a(function(){f=EASYRECIPE;f.isWP39&&(f.dialogs=a("<div>").addClass("easyrecipeUI").prop("id","easyrecipeUI").appendTo("body"));O=a("#divERSStyles");P=a("#divERSPrintStyles");R=O.find(".ERSSelectedStyle");S=P.find(".ERSSelectedPrintStyle");s=a("#easyrecipeUpgrade");w=a("#btnERSendSupport");y=a("#divERSTabs");y.tabs({active:q,
beforeActivate:z});a(".ERSStyleTabs").tabs({active:0});M=a("#spnERSLatestVersion");O.on("click",".ERSStyle",E);P.on("click",".ERSStyle",h);J=a("#divERSSave").find("input").button();w.button().on("click",n);F=a("#divERSSwoopSettings");K=a("#trERSSubscribe");W=a("#cbERSEnableSwoop").on("click",g);V=a("#cbERSSubscribe").on("click",p);x=a("#ERDFail");I=a("#ERDSending");aa=a(".ERSSaveButtons");aa.on("click",Y);a("#cbDisplayZiplist").on("click",Y);G=a('.ERSSubscribe input[name="ERPlusSettings[erEmailAddress]"]').on("change",
k);a(".ERSSubscribe").on("click",function(){a(".ERSubscribeError").css("visibility","hidden")});t=a('input[name="'+f.settingsName+'[swoopSiteID]"]',F);t.on("change",T);u=a('input[name="'+f.settingsName+'[licenseKey]"]').on("change",U);L=a("#divERSRegisterSwoop");r=a("#divERSLoginSwoop");N=a("#frmERSForm");N.on("submit",da);B=a("#inpERDName").on("change",A);C=a("#inpERDEmail").on("change",c);D=a("#inpERDProblem").on("change",m);f.jQuery=a;a("#btnFDStartScan").button().on("click",Z);a("#spnFDRescan").on("click",
ia);a("#btnFDContinue").button().on("click",ma);a("#divFDDisable").on("click",na);a("#divFDRetrieving").hasClass("FDDisplayNone")||$();f.isWP39?s.dialog({autoOpen:!1,width:420,modal:!0,appendTo:f.dialogs,dialogClass:"easyrecipeUpgrade",close:function(){a(".easyrecipeUpgrade").filter(function(){return""===a(this).text()}).remove()}}):(s.dialog({autoOpen:!1,width:420,modal:!0,dialogClass:"easyrecipeUpgrade",close:function(){a(".easyrecipeUpgrade").filter(function(){return""===a(this).text()}).remove()},
open:function(b,c){a(".ui-widget-overlay").wrap('<div class="easyrecipeUI" />')}}),s.parent(".ui-dialog").wrap('<div class="easyrecipeUI" />'));a(".divERUPGContainer").show();a.ajax({url:"http://www.easyrecipeplugin.com/checkVersion.php",type:"GET",dataType:a.support.cors?"json":"jsonp",data:{a:"check",v:f.pluginVersion,k:f.license,u:f.wpurl,p:0},success:ea,error:X});y.show()})})(jQuery);
(function(a){function v(a){a.data.clear.off(l,v);a.data.errDiv.dialog("destroy");a.data.errDiv.remove()}var l="focus",z;a.fn.showError=function(A,c){var m,n,E,h,g,p,k;c=c||{};c.clear=c.clear||[];"string"===typeof c.clear&&(c.clear=[c.clear]);k={position:"right",container:null,clear:[]};a.extend(k,c);z=k.container||this.closest("div");m=this;for(n=0;n<k.clear.length;n++)m=m.add(k.clear[n]);g='<span class="showError showError-'+k.position+'">';g=g+('<div class="showErrorLeftPtr"></div><div class="showErrorMsg">'+
A)+'</div><div class="showErrorRightPtr"></div></span>';g=a(g).appendTo("body");n=g.outerHeight();h=this.offset();E=h.top+this.outerHeight()/2-12;h=h.left;p=g.outerWidth();h="right"===k.position?h+this.outerWidth():h-p;g.dialog({dialogClass:"showErrorDialog",draggable:!1,resizable:!1,autoOpen:!1,closeText:"",width:p,position:[h,E],minHeight:n});a(z).prepend(g.dialog("widget"));g.dialog("open");m.on(l,{clear:m,errDiv:g},v);g.css("width",p+5)};a.fn.showErrorLeft=function(a,c){c=c||{};this.showError(a,
c)};a.fn.showErrorRight=function(a,c){c=c||{};c.position="right";this.showError(a,c)}})(jQuery);
