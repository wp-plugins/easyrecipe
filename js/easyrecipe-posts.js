/*! EasyRecipe  3.2.1275 Copyright (c) 2013 BoxHill LLC */
(function(g){var e,d;var b=/^ERGP_(\d+)$/;var h;var a;function f(k,Q){var L=0,p=1,M=2,m;var U,P,o,R=0,j="",B,F,C,r,w;var V="<!-- START REPEAT ",D="<!-- START INCLUDEIF ",N="<!-- END INCLUDEIF ";var n,v,x,t,K,q,O,l,z,u;var y,G,T;var E,A,W;var J=/<!-- START INCLUDEIF (!?)([_a-z][_0-9a-z]{0,19}) -->/i;var I=/^#([_a-z][_0-9a-z]{0,19})#/im;var S=/<!-- START REPEAT ([_a-zA-Z][_0-9a-zA-Z]{0,19}) -->/m;var H="undefined";m=k;Q=Q||{};while(true){B=m.length;F=m.indexOf("#",R);if(F!==-1){B=F;C=L}r=m.indexOf(V,R);if(r!==-1&&r<B){B=r;C=p}w=m.indexOf(D,R);if(w!==-1&&w<B){B=w;C=M}if(B===m.length){return j+m.substr(R)}n=B-R;j+=m.substr(R,n);R=B;switch(C){case M:P=m.substr(R,44);o=J.exec(P);if(o!==null){v=o[1];x=v!=="!";t=o[2]}else{break}K=N+v+t+" -->";q=K.length;O=m.indexOf(K);if(O===-1){R++;break}l=typeof Q[t]!==H&&Q[t]!==false;if(l===x){z="<!-- START INCLUDEIF "+v+t+" -->";u=z.length;m=m.substr(0,R)+m.substr(R+u,O-R-u)+m.substr(O+q)}else{m=m.substr(0,R)+m.substr(O+q)}break;case L:P=m.substr(R,22);o=I.exec(P);if(o===null){j+="#";R++;continue}y=o[1];if(Q[y]!==""&&!Q[y]){j+="#"+y+"#";R+=y.length+2;continue}j+=Q[y];R+=y.length+2;break;case p:P=m.substr(R,45);o=S.exec(P);if(o===null){j+="<";R++;continue}G=o[1];if(!Q[G]||!(Q[G] instanceof Array)){j+="<";R++;continue}R+=G.length+22;T=m.indexOf("<!-- END REPEAT "+G+" -->",R);if(T===-1){j+="<!-- START REPEAT "+G+" -->";continue}E=T-R;A=m.substr(R,E);W=Q[G];for(U=0;U<W.length;U++){j+=f(A,W[U])}R+=G.length+E+20;break}}}function c(m){var l;var k;var n,j,i;j=b.exec(m.target.id);if(j===null){return}i=j[1];n=d[i];l=g("#divERGPAContainer"+i);if(l.length===0){k=f(h.guestTemplate,n);l=g(k);l.attr("id","divERGPAContainer"+i);g(".spnERGPAClose",l).button();g(".spnERGPAClose",l).on("click",function(){l.dialog("close")});l.dialog({title:"Guest Post Details",autoOpen:false,width:550,resizable:false,dialogClass:"divERGPAContainer"});l.parent(".ui-dialog").appendTo(a)}l.dialog("open")}g(function(){a=g("body easyrecipeUI:first-child");if(a.length===0){a=g('<div class="easyrecipeUI" />').prependTo("body")}e=g("#divERGPAContainer");h=EASYRECIPE;d=g.parseJSON(EASYRECIPE.guestPosters);g(".ERGPAPoster").on("click",c)})}(jQuery));