(function () {
  var KEY = 'gpa-theme';

  function current() {
    // Clair par défaut si le visiteur n'a encore rien choisi lui-même —
    // volontairement indépendant du thème système (prefers-color-scheme).
    var attr = document.documentElement.getAttribute('data-theme');
    return attr === 'dark' ? 'dark' : 'light';
  }

  function updateButton(btn) {
    var isDark = current() === 'dark';
    btn.textContent = isDark ? '☀' : '☾';
    btn.setAttribute('aria-label', isDark ? 'Passer en mode clair' : 'Passer en mode sombre');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    updateButton(btn);
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      updateButton(btn);
    });
  });
})();
