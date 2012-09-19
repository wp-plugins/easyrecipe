(function $main(B){var Q,j,V,r,H,p,G,n,a;var e=/^(?:[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)$/i;var K="click",I,h,q,c=EASYRECIPE,d,w;var L=/^(?:[a-f\d]{4}-){7}[a-f\d]{4}$/i,D,t,k,N="change",J,P;var x=0,R=1,g=2,U=3,i=4,u=5,l=6,f;function C(Y){H.hide();if(Y.status==="OK"){B("#ERDOK").show()}else{r.show();V.show()}}function o(Y){w.tabs({selected:Y})}function X(){if(B.trim(t.val())===""){t.showErrorRight("Please enter your first name");return false}return true}function M(){if(!e.test(B.trim(k.val()))){k.showErrorRight("Oops! This doesn't seem to be a valid email address");return false}return true}function F(){if(B.trim(t.val())===""){D.showErrorRight("Please tell us about the problem");return false}return true}function v(aa){var Z,Y;B(".showError").dialog("destroy").remove();Y=X();Y=M()&&Y;Y=F()&&Y;if(!Y){return}Z={action:"easyrecipeSupport",name:encodeURIComponent(B.trim(t.val())),email:encodeURIComponent(B.trim(k.val())),problem:encodeURIComponent(B.trim(D.val())),diagnostics:B("#cbERDSendDiagnostics").attr("checked")};r.hide();V.hide();H.show();B.post(ajaxurl,Z,C,"json")}function O(){B("#divERSStyles .ERSStyle").removeClass("ERSStyleSelected");B(this).addClass("ERSStyleSelected");Q.val(B("input",this).val())}function W(){B("#divERSPrintStyles .ERSStyle").removeClass("ERSStyleSelected");B(this).addClass("ERSStyleSelected");j.val(B("input",this).val())}function T(){if(this.checked){G.removeClass("ERSNoSwoop")}else{G.addClass("ERSNoSwoop")}}function m(){if(this.checked){n.removeClass("ERSNoSubscribe")}else{n.addClass("ERSNoSubscribe")}}function z(Y,Z){if(Z.tab.text==="Support"||Z.tab.text==="Import"){p.hide()}else{p.show()}}function s(aa,Y){var Z=B.trim(a.val());if(Z!==""&&!e.test(Z)){o(x);a.showErrorRight("Oops! This doesn't seem to be a valid email address",{clear:"#cbERSSubscribe"});return false}if(Y&&Z===""){o(x);a.showErrorRight("You need to tell us your email address",{clear:"#cbERSSubscribe"});return false}return true}function b(ab,Z){var ac=B.trim(I.val());if(ac!==""){if(!/^SW-\d{8}-/i.test(ac)){o(x);I.showErrorLeft("That's not a valid Swoop ID");return false}var Y=B("a",h);var aa=B("a",h).attr("href");aa=aa.replace(/site_id=(.*)/ig,"site_id="+ac);B("a",h).attr("href",aa);q.addClass("ERSDisplayNone");h.removeClass("ERSDisplayNone")}else{q.removeClass("ERSDisplayNone");h.addClass("ERSDisplayNone")}if(Z&&ac===""){o(x);I.showErrorLeft("You must enter a valid ID to enable Swoop");return false}return true}function A(){var Y=B.trim(d.val());if(Y!==""&&!L.test(Y)){o(x);d.showErrorRight("This is not a valid license key");return false}return true}function S(Z){var Y=true;B(".showError").dialog("destroy").remove();Y=A()&&Y;if(J.is(":checked")){Y=s(null,true)}if(P.is(":checked")){Y=b(null,true)&&Y}if(!Y){Z.preventDefault()}}function E(){f.html("Version check failed")}function y(Y){var Z;if(!Y.version||!Y.msg){E();return}f.html(Y.msg)}B(function(){Q=B("#divERSStyles .ERSSelectedStyle");j=B("#divERSPrintStyles .ERSSelectedPrintStyle");r=B("#btnERSendSupport");w=B("#divERSTabs");w.tabs({selected:x,select:z});B(".ERSStyleTabs").tabs({selected:0});f=B("#spnERSLatestVersion");B("#divERSStyles").on(K,".ERSStyle",O);B("#divERSPrintStyles").on(K,".ERSStyle",W);p=B("#divERSSave input").button();r.button().on(K,v);G=B("#divERSSwoopSettings");n=B("#trERSSubscribe");P=B("#cbERSEnableSwoop").on(K,T);J=B("#cbERSSubscribe").on(K,m);V=B("#ERDFail");H=B("#ERDSending");a=B('.ERSSubscribe input[name="ERPlusSettings[erEmailAddress]"]').on(N,s);B(".ERSSubscribe").on(K,function(){B(".ERSubscribeError").css("visibility","hidden")});I=B('input[name="'+c.settingsName+'[swoopSiteID]"]',G);I.on("change",b);d=B('input[name="'+c.settingsName+'[licenseKey]"]').on(N,A);q=B("#divERSRegisterSwoop");h=B("#divERSLoginSwoop");B("#frmERSForm").on("submit",S);t=B("#inpERDName").on(N,X);k=B("#inpERDEmail").on(N,M);D=B("#inpERDProblem").on(N,F);c.jQuery=B;var Z=0;var Y=B.support.cors?"json":"jsonp";B.ajax({url:"http://www.easyrecipeplugin.com/checkUpdates1.php",type:"GET",dataType:"jsonp",data:{dType:Y,a:"check",v:c.pluginVersion,k:c.license,u:c.wpurl,p:Z},success:y,error:E})})}(jQuery));(function(d){var c="focus",a;function b(f){f.data.clear.off(c,b);f.data.errDiv.dialog("destroy");f.data.errDiv.remove()}d.fn.showError=function(o,p){var k,m,j,n,f,g,i,e;p=p||{};p.clear=p.clear||[];if(typeof p.clear==="string"){p.clear=[p.clear]}var l={position:"right",container:null,clear:[]};d.extend(l,p);a=l.container||this.closest("div");k=this;for(m=0;m<l.clear.length;m++){k=k.add(l.clear[m])}i='<span class="showError showError-'+l.position+'">';i+='<div class="showErrorLeftPtr"></div><div class="showErrorMsg">'+o;i+='</div><div class="showErrorRightPtr"></div></span>';i=d(i).appendTo("body");j=i.outerHeight();g=this.offset();n=g.top+(this.outerHeight()/2)-12;f=g.left;e=i.outerWidth();if(l.position==="right"){f+=this.outerWidth()}else{f-=e}i.dialog({dialogClass:"showErrorDialog",draggable:false,resizable:false,autoOpen:false,closeText:"",width:e,position:[f,n],maxHeight:j,minHeight:j});d(a).prepend(i.dialog("widget"));i.dialog("open");k.on(c,{clear:k,errDiv:i},b)};d.fn.showErrorLeft=function(f,e){e=e||{};this.showError(f,e)};d.fn.showErrorRight=function(f,e){e=e||{};e.position="right";this.showError(f,e)}}(jQuery));