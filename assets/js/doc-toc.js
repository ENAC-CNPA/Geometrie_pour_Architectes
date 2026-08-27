(function () {
  var toc = document.querySelector('.doc-toc');
  var pageMain = document.querySelector('.page-main');
  if (!toc || !pageMain) return;
  var body = toc.querySelector('.doc-toc__body');
  var links = body ? Array.prototype.slice.call(body.querySelectorAll('a[href^="#"]')) : [];
  if (!links.length || !('IntersectionObserver' in window)) return;

  var linkByHash = {};
  links.forEach(function (a) { linkByHash[a.getAttribute('href')] = a; });

  var headings = links
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  // On démarre avec la 1ère section marquée comme "en cours" (vrai tant
  // qu'on est en haut du document) plutôt que d'attendre le 1er passage
  // du scrollspy.
  var current = links[0];
  current.classList.add('is-current');

  // Recentre la section en cours dans la fenêtre du sommaire (utile pour
  // les documents à long sommaire, dont .doc-toc__body a son propre
  // défilement interne), pour qu'elle reste repérable — précédente
  // au-dessus, suivante en dessous. On passe par getBoundingClientRect()
  // plutôt que offsetTop : offsetTop se mesure depuis l'ancêtre positionné
  // le plus proche, pas forcément .doc-toc__body (le conteneur qu'on fait
  // défiler) — ambigu et source d'erreurs, alors que getBoundingClientRect
  // donne directement des coordonnées comparables entre les deux.
  function centerCurrent() {
    if (!body) return;
    var bodyRect = body.getBoundingClientRect();
    var itemRect = current.getBoundingClientRect();
    var itemTopInBody = (itemRect.top - bodyRect.top) + body.scrollTop;
    var target = itemTopInBody + itemRect.height / 2 - body.clientHeight / 2;
    body.scrollTop = Math.max(0, target);
  }

  function setCurrent(id) {
    var link = linkByHash['#' + id];
    if (!link || link === current) return;
    current.classList.remove('is-current');
    link.classList.add('is-current');
    current = link;
    centerCurrent();
  }

  // .page-main est l'unique zone à défilement de la page (voir la
  // structure en 3 bandes dans base.css) — le scrollspy observe donc les
  // titres par rapport à elle (root: pageMain), pas la fenêtre entière.
  var spy = new IntersectionObserver(function (entries) {
    var visible = entries.filter(function (e) { return e.isIntersecting; });
    if (!visible.length) return;
    visible.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
    setCurrent(visible[0].target.id);
  }, { root: pageMain, rootMargin: '0px 0px -70% 0px', threshold: 0 });
  headings.forEach(function (h) { spy.observe(h); });

  // .doc-sticky-head (titre + sommaire) est collé (position:sticky) en
  // haut de .page-main — affiché en entier tant qu'on est en haut du
  // document, compressé à ~3 lignes (.is-compact) dès qu'on défile dedans.
  // --sticky-head-h (mesurée ci-dessous) donne aux titres du document le
  // bon scroll-margin-top pour ne jamais se retrouver cachés dessous.
  var stickyHead = document.querySelector('.doc-sticky-head');
  var sentinel = document.querySelector('.doc-sticky-sentinel');
  var expandBtn = toc.querySelector('.doc-toc__expand');

  // Bouton +/− : n'a d'effet visible que combiné à .is-compact (voir
  // base.css) — un clic hors de ce contexte ne devrait jamais arriver
  // puisque le bouton est masqué, mais setExpanded() reste sûr dans tous
  // les cas. "Réduire" (repasser à +) se déclenche depuis 3 endroits : un
  // nouveau clic sur le bouton en mode −, un clic sur une section du
  // sommaire, ou un retour en haut du document (voir stuckSpy plus bas) —
  // pour ne jamais laisser un sommaire agrandi "orphelin".
  function setExpanded(on) {
    if (!stickyHead) return;
    stickyHead.classList.toggle('is-expanded', on);
    if (expandBtn) {
      expandBtn.textContent = on ? '−' : '+';
      expandBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
      expandBtn.setAttribute('aria-label', on ? 'Réduire le sommaire' : 'Agrandir le sommaire');
    }
  }
  if (expandBtn) {
    expandBtn.addEventListener('click', function () {
      setExpanded(!stickyHead.classList.contains('is-expanded'));
    });
  }

  function syncStickyOffset() {
    if (!stickyHead) return;
    var h = stickyHead.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--sticky-head-h', (h + 16) + 'px');
  }

  if (stickyHead) {
    syncStickyOffset();
    if ('ResizeObserver' in window) {
      // N'affecte que la variable CSS, jamais la taille de .doc-sticky-head
      // lui-même — aucun risque de boucle de rétroaction ici.
      new ResizeObserver(syncStickyOffset).observe(stickyHead);
    } else {
      window.addEventListener('resize', syncStickyOffset);
    }
  }

  // Détection classique d'un sticky "accroché" : une sentinelle de 1px
  // juste au-dessus de .doc-sticky-head sort du champ (via
  // IntersectionObserver, root: pageMain) exactement au moment où le
  // bandeau se colle — pas de calcul de scroll à la main.
  if (stickyHead && sentinel) {
    var stuckSpy = new IntersectionObserver(function (entries) {
      var compact = !entries[0].isIntersecting;
      stickyHead.classList.toggle('is-compact', compact);
      if (!compact) setExpanded(false);
      syncStickyOffset();
    }, { root: pageMain, threshold: 0 });
    stuckSpy.observe(sentinel);
  }

  // Clic sur un lien du sommaire : .page-main étant la seule zone à
  // défilement de la page, scrollIntoView() cible sans ambiguïté cette
  // zone (son ancêtre à défilement le plus proche). On compresse
  // .doc-sticky-head et on remesure --sticky-head-h AVANT d'appeler
  // scrollIntoView() — sinon, cliquer depuis tout en haut (sommaire encore
  // déplié, donc plus haut) calculerait la cible de défilement avec une
  // marge trop grande d'un cran, avant que le bandeau n'ait eu la chance
  // de se compresser tout seul au scroll.
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      if (stickyHead) {
        stickyHead.classList.add('is-compact');
        setExpanded(false);
        syncStickyOffset();
      }
      target.scrollIntoView({ block: 'start', behavior: 'smooth' });
      if (history.replaceState) history.replaceState(null, '', '#' + id);
    });
  });
})();
