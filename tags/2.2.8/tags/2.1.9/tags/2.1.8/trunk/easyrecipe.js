(function(d){var h,b=0,f,c,i;d(k);function k(){var l=d("#ERComment");if(l.length>0){l.insertBefore(l.parent().find(":submit"));h=d("#divRateBG").offset().left;f=d("#divRateStars");i=d("#inpERRating");f.width(0);d("#divRateBG").mousemove(g);d("#divRateBG").mouseleave(e);d("#divRateBG").click(j)}d(".btnERPrint").click(a)}function a(n){n.stopPropagation();var m=d("a",n.target);var l=d("a",n.target).attr("href");window.open(l)}function g(m){var l=Math.floor((((m.clientX-h)*5/95))+1);l=l>5?5:l;if(l!=b){b=l;f.width((l*20)+"%")}}function e(l){b=i.val();f.width((b*20)+"%")}function j(l){i.val(b)}})(jQuery);