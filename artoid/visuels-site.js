/* ═══════════════════════════════════════════════════════════════════
   RAR' — visuels du site (hors biens)
   Remplace les emplacements par les photos déposées dans images/site/
   Si aucune photo, l'illustration d'origine reste affichée.
   ═══════════════════════════════════════════════════════════════════ */
(function(){
  var EXT=["jpg","jpeg","png","webp"];
  document.querySelectorAll("[data-visuel]").forEach(function(zone){
    var nom=zone.getAttribute("data-visuel"), i=0;
    (function essai(){
      if(i>=EXT.length) return;                 // aucune photo : on ne touche à rien
      var img=new Image();
      img.onload=function(){
        var alt=zone.getAttribute("data-alt")||document.title;
        img.alt=alt; img.loading="lazy"; img.decoding="async";
        img.style.cssText="width:100%;height:100%;object-fit:cover;display:block";
        zone.innerHTML=""; zone.style.padding="0";
        zone.classList.add("avec-photo");
        zone.appendChild(img);
      };
      img.onerror=function(){ i++; essai(); };
      img.src="images/site/"+nom+"."+EXT[i];
    })();
  });
})();
