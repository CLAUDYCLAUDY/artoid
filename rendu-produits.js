/* ═══════════════════════════════════════════════════════════════════════
   ARTOID — moteur d'affichage du catalogue
   Ne rien modifier ici. Tout se règle dans l'éditeur.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  var MAXP = 12, EXT = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG"];
  var TOUS = (window.PRODUITS || []).filter(function (p) { return p.enLigne !== false; });

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function epuise(p) { return p.statut === "Épuisé"; }

  function photo(ref, n, ok, ko) {
    var num = (n < 10 ? "0" : "") + n, i = 0;
    (function suite() {
      if (i >= EXT.length) return ko();
      var im = new Image();
      im.onload = function () { ok(im.src); };
      im.onerror = function () { i++; suite(); };
      im.src = "images/" + ref + "/" + num + "." + EXT[i];
    })();
  }
  function galerie(ref, fini) {
    var t = [];
    (function suite(n) {
      if (n > MAXP) return fini(t);
      photo(ref, n, function (s) { t.push(s); suite(n + 1); }, function () { fini(t); });
    })(1);
  }

  /* couvertures dessinées, par collection */
  function dessin(p) {
    var N = "#0A1A47";
    if (p.categorie === "Objet") {
      return '<svg viewBox="0 0 200 200" role="img" aria-label="' + esc(p.titre) + '">' +
        '<rect width="200" height="200" fill="#F5F5EF"/>' +
        '<rect x="56" y="46" width="88" height="112" fill="#ECEDE2" stroke="' + N + '" stroke-width="3"/>' +
        '<path d="M56 90h88M56 122h60" stroke="' + N + '" stroke-width="2.4"/></svg>';
    }
    if (p.collection === "The Stories") {
      return '<svg viewBox="0 0 300 400" role="img" aria-label="' + esc(p.titre) + '">' +
        '<rect width="300" height="400" fill="#DFE0D0"/><rect width="26" height="400" fill="' + N + '"/>' +
        '<circle cx="150" cy="152" r="56" fill="' + N + '" opacity=".88"/>' +
        '<path d="M96 250C110 208 190 208 204 250Z" fill="#5D5B3C" opacity=".85"/>' +
        '<circle cx="228" cy="98" r="18" fill="#A8A874" opacity=".9"/>' +
        '<path d="M66 312h168" stroke="' + N + '" stroke-width="2.6"/></svg>';
    }
    return '<svg viewBox="0 0 300 400" role="img" aria-label="' + esc(p.titre) + '">' +
      '<rect width="300" height="400" fill="#E9E9DC"/><rect width="26" height="400" fill="' + N + '"/>' +
      '<rect x="66" y="76" width="180" height="140" fill="#D6D8C4"/>' +
      '<path d="M66 176Q116 140 156 176T246 168" stroke="' + N + '" stroke-width="3" fill="none"/>' +
      '<circle cx="206" cy="116" r="20" fill="none" stroke="' + N + '" stroke-width="3"/>' +
      '<path d="M66 274h180M66 296h130" stroke="' + N + '" stroke-width="2.4"/></svg>';
  }

  function carteLivre(p) {
    return '<article class="livre reveal" data-p="' + esc(p.ref) + '">' +
      '<a class="visuel" href="produit.html?ref=' + esc(p.ref) + '">' +
        (p.public ? '<span class="etiquette">' + esc(p.public) + '</span>' : '') + dessin(p) + '</a>' +
      '<p class="coll-nom">' + esc(p.collection) + '</p>' +
      '<h3><a href="produit.html?ref=' + esc(p.ref) + '">' + esc(p.titre) + '</a></h3>' +
      '<p class="detail">' + esc(p.accroche) + ' ' + esc(p.pages) + (p.format ? ', ' + esc(p.format) : '') + '.</p>' +
      '<div class="bas"><span class="prix">' + (epuise(p) ? 'Épuisé' : esc(p.prix)) + '</span>' +
      '<a class="ajout" href="produit.html?ref=' + esc(p.ref) + '">' + (epuise(p) ? 'Voir' : 'Découvrir') + '</a></div>' +
    '</article>';
  }
  function carteObjet(p) {
    return '<article class="objet reveal" data-p="' + esc(p.ref) + '">' +
      '<a class="visuel" href="produit.html?ref=' + esc(p.ref) + '">' + dessin(p) + '</a>' +
      '<h3><a href="produit.html?ref=' + esc(p.ref) + '">' + esc(p.titre) + '</a></h3>' +
      '<p class="prix">' + (epuise(p) ? 'Épuisé' : esc(p.prix)) + '</p>' +
      '<a class="ajout" href="produit.html?ref=' + esc(p.ref) + '">Découvrir</a></article>';
  }

  function couvrir(liste) {
    liste.forEach(function (p) {
      var z = document.querySelector('[data-p="' + p.ref + '"] .visuel');
      if (!z) return;
      photo(p.ref, 1, function (src) {
        var et = z.querySelector(".etiquette");
        z.innerHTML = '<img src="' + src + '" alt="' + esc(p.titre) + ', ' + esc(p.collection) +
          '" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;display:block">';
        z.style.padding = "0";
        if (et) z.appendChild(et);
      }, function () {});
    });
  }
  function reveler(zone) {
    if (!zone) return;
    if (window.IntersectionObserver) {
      var o = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("vu"); o.unobserve(e.target); } });
      }, { threshold: .12 });
      zone.querySelectorAll(".reveal").forEach(function (e) { o.observe(e); });
    } else zone.querySelectorAll(".reveal").forEach(function (e) { e.classList.add("vu"); });
  }

  /* ---------- grilles ---------- */
  var zL = document.getElementById("liste-ouvrages");
  if (zL) {
    var filtre = zL.getAttribute("data-collection");
    var livres = TOUS.filter(function (p) {
      return p.categorie === "Ouvrage" && (!filtre || p.collection === filtre); });
    zL.innerHTML = livres.map(carteLivre).join("");
    couvrir(livres); reveler(zL);
  }
  var zO = document.getElementById("liste-objets");
  if (zO) {
    var objets = TOUS.filter(function (p) { return p.categorie === "Objet"; });
    zO.innerHTML = objets.map(carteObjet).join("");
    couvrir(objets); reveler(zO);
  }

  /* ---------- fiche produit ---------- */
  var fiche = document.getElementById("fiche-produit");
  if (!fiche) return;
  var ref = new URLSearchParams(location.search).get("ref");
  var p = TOUS.filter(function (x) { return x.ref === ref; })[0];

  if (!p) {
    fiche.innerHTML = '<div class="page-tete"><h1>Ouvrage introuvable</h1></div>' +
      '<div class="wrap" style="text-align:center;padding:70px 0 90px">' +
      '<p style="color:var(--gris);margin-bottom:28px">Il a peut-être été retiré du catalogue.</p>' +
      '<a class="btn" href="index.html#ouvrages">Voir le catalogue</a></div>';
    return;
  }

  document.title = p.titre + " — " + p.collection + " · Artoid, maison d'édition";
  var m = document.querySelector('meta[name="description"]');
  if (m) m.setAttribute("content", p.accroche + " " + p.pages + (p.format ? ", " + p.format : "") +
    ". Collection " + p.collection + ", éditions Artoid. " + (epuise(p) ? "Épuisé." : p.prix + "."));
  var cn = document.querySelector('link[rel="canonical"]');
  if (cn) cn.setAttribute("href", "https://www.maisonartoid.com/produit.html?ref=" + p.ref);

  var ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify(p.categorie === "Ouvrage" ? {
    "@context": "https://schema.org", "@type": "Book", name: p.titre, description: p.description,
    bookFormat: "https://schema.org/Hardcover", inLanguage: "fr", numberOfPages: (p.pages || "").replace(/\D+/g, "") || undefined,
    isbn: p.isbn || undefined, isPartOf: { "@type": "BookSeries", name: p.collection },
    publisher: { "@type": "Organization", name: "Artoid" },
    offers: { "@type": "Offer", price: (p.prix || "").replace(/[^\d]/g, ""), priceCurrency: "EUR",
      availability: epuise(p) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock" }
  } : {
    "@context": "https://schema.org", "@type": "Product", name: p.titre, description: p.description,
    brand: { "@type": "Brand", name: "Artoid" },
    offers: { "@type": "Offer", price: (p.prix || "").replace(/[^\d]/g, ""), priceCurrency: "EUR",
      availability: epuise(p) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock" }
  });
  document.head.appendChild(ld);

  var pts = (p.points || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
  var carac = [["Collection", p.collection], ["Format", p.format], ["Pagination", p.pages],
    ["Fabrication", p.fabrication], ["Tirage", p.tirage], ["Public", p.public], ["ISBN", p.isbn]]
    .filter(function (l) { return l[1]; })
    .map(function (l) { return "<div><dt>" + esc(l[0]) + "</dt><dd>" + esc(l[1]) + "</dd></div>"; }).join("");

  fiche.innerHTML =
    '<div class="page-tete">' +
      '<p class="fil"><a href="index.html">Accueil</a> &nbsp;/&nbsp; ' +
      '<a href="' + (p.collection === "The Stories" ? "the-stories.html" :
        (p.collection === "Archives Sélectives" ? "archives-selectives.html" : "index.html#objets")) + '">' +
      esc(p.collection) + '</a> &nbsp;/&nbsp; ' + esc(p.titre) + '</p>' +
      '<h1>' + esc(p.titre) + '</h1>' +
      '<p class="date">' + esc(p.collection) + (p.public ? " — " + esc(p.public) : "") + '</p>' +
    '</div>' +
    '<div class="wrap">' +
      '<div class="fiche-grid">' +
        '<div class="fiche-images"><div class="grande" id="grande">' + dessin(p) + '</div>' +
        '<div class="vignettes" id="vignettes"></div></div>' +
        '<div class="fiche-texte">' +
          '<p class="accroche">' + esc(p.accroche) + '</p>' +
          '<p>' + esc(p.description) + '</p>' +
          (pts ? '<h2>Ce qu\'il faut savoir</h2><ul class="points">' + pts + '</ul>' : '') +
          '<h2>Caractéristiques</h2><dl class="carac">' + carac + '</dl>' +
          '<div class="achat">' +
            '<p class="prix-grand">' + (epuise(p) ? "Épuisé" : esc(p.prix)) + '</p>' +
            (epuise(p)
              ? '<p class="rappel">Cet ouvrage n\'est plus disponible. Les tirages numérotés ne sont pas réimprimés à l\'identique.</p>' +
                '<a class="btn" href="index.html#ouvrages">Voir le catalogue</a>'
              : '<button class="btn plein" id="cmd">Commander</button>' +
                '<p class="rappel">Expédition sous 48 h depuis la Côte d\'Azur. Retours 14 jours. ' +
                'Libraires et institutions : <a href="mailto:contact@maisonartoid.com">conditions dédiées</a>.</p>') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="suite"><div class="wrap"><h2 class="titre-sec" style="font-size:clamp(20px,3vw,28px)">À découvrir aussi</h2>' +
    '<div class="livres" id="autres" style="margin-top:36px"></div></div></div>';

  galerie(p.ref, function (ph) {
    if (!ph.length) return;
    var g = document.getElementById("grande"), v = document.getElementById("vignettes");
    function montrer(i) {
      g.innerHTML = '<img src="' + ph[i] + '" alt="' + esc(p.titre) + ' — vue ' + (i + 1) +
        '" style="width:100%;height:100%;object-fit:cover;display:block">';
      Array.prototype.forEach.call(v.children, function (b, j) {
        b.setAttribute("aria-current", j === i ? "true" : "false"); });
    }
    v.innerHTML = ph.map(function (s, i) {
      return '<button type="button" aria-label="Vue ' + (i + 1) + '"><img src="' + s + '" alt="" loading="lazy"></button>'; }).join("");
    Array.prototype.forEach.call(v.children, function (b, i) { b.onclick = function () { montrer(i); }; });
    montrer(0);
  });

  var cmd = document.getElementById("cmd");
  if (cmd) cmd.onclick = function () {
    cmd.textContent = "Ajouté ✓";
    setTimeout(function () { cmd.textContent = "Commander"; }, 1500);
  };

  var autres = TOUS.filter(function (x) { return x.ref !== p.ref && x.categorie === p.categorie; }).slice(0, 3);
  var za = document.getElementById("autres");
  if (za) { za.innerHTML = autres.map(carteLivre).join(""); couvrir(autres); }
})();
