(function(h){var g,e,f,c,j,a,d;var b=/^ERGP_(\d+)$/;function i(l){var n,m,k;k=b.exec(l.target.id);if(k!==null){n=e[k[1]];d.html(n.title);f.html(n.name);c.attr("href","mailto:"+n.email);c.text(n.email);j.attr("href",n.url);j.html(n.url);a.html(n.comment);g.dialog("open")}}h(function(){var k=h("body easyrecipeUI:first-child");if(k.length===0){k=h('<div class="easyrecipeUI" />').prependTo("body")}g=h("#divERGPAContainer");h(".spnERGPAClose",g).button();g.dialog({title:"Guest Post Details",autoOpen:false,width:550,resizable:false,dialogClass:"divERGPAContainer"});h("#easyrecipeGPAdmin").show();g.parent(".ui-dialog").appendTo(k);e=h.parseJSON(EASYRECIPE.guestPosters);h(".ERGPAPoster").on("click",i);d=h("#divERGPAPostTitle");f=h("#tdERGPName");c=h("#tdERGPEmail a");j=h("#tdERGPUrl a");a=h("#tdERGPComment");h(".spnERGPAClose",g).on("click",function(){g.dialog("close")})})}(jQuery));