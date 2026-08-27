(function () {
  // <details class="lang-switch"> gère lui-même l'ouverture/fermeture au
  // clic sur .lang-switch__current — ce script ne fait que le refermer au
  // clic ailleurs sur la page, seul comportement que <details> n'offre pas
  // nativement.
  document.addEventListener('click', function (e) {
    document.querySelectorAll('details.lang-switch[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });
})();
