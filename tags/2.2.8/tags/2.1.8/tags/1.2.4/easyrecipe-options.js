(function(){var j=jQuery;var v,b,t,k;var p,e,u,c,h;var r=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i,i;j(o);function o(){h=j(".ERSettingError");h.hide();b=j("#ERRecipeBackground");i=b.css("color")||"#fff";v=j("#imgERColorPick");k=j("#divERColorPick");v.click(a);j("#divERCPButtons").click(m);e=j("#ERBorderColor");p=j("#imgERBorderColor");c=j("#divERBorderColor");p.click(d);j("#divERBCButtons").click(q);e.change(g);b.change(g);j("#ERSSubmit").click(g);j(".postbox-container").click(l)}function l(w){h.hide();b.css("color",i);e.css("color",i)}function f(w){h.show();w.css("color","#f00")}function g(w){l();if(w.type=="click"){if(!r.test(b.val())){f(b);w.preventDefault();w.stopPropagation()}if(!r.test(e.val())){f(e);w.preventDefault();w.stopPropagation()}}else{if(!r.test(this.value)){f(j(this));w.preventDefault()}}}function m(w){h.hide();if(w.target.id=="btnERCPCancel"){b.val(t);v.css("backgroundColor",t)}k.hide()}function a(){h.hide();var w;k.show();w=j.farbtastic("#divERFarb1",n);t=b.val();w.setColor(t)}function n(w){v.css("backgroundColor",w);b.val(w)}function q(w){if(w.target.id=="btnERBCCancel"){e.val(t);p.css("backgroundColor",t)}c.hide()}function d(){var w;c.show();j.farbtastic("#divERFarb2",s);u=e.val();w.setcolor(u)}function s(w){p.css("backgroundColor",w);e.val(w)}})();