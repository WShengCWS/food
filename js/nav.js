// ============================================================
// nav.js — Injects the shared nav shell into every page
// ============================================================

(function () {
  const NAV_HTML = `
<nav class="bottom-nav" role="navigation" aria-label="Main">
  <div class="bottom-nav__inner">
    <a class="nav__link" href="index.html" aria-label="Dashboard">
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
      Dashboard
    </a>
    <a class="nav__link" href="log.html" aria-label="My Log">
      <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/></svg>
      Log
    </a>
    <a class="nav__link" href="add-food.html" aria-label="Add Food">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      Add
    </a>
    <a class="nav__link" href="foods.html" aria-label="Food Manager">
      <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      Foods
    </a>
    <a class="nav__link" href="settings.html" aria-label="Settings">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      Settings
    </a>
  </div>
</nav>
  `;

  const TOP_BAR_HTML = `
<header class="top-bar">
  <div class="top-bar__inner">
    <div class="top-bar__logo">
      <span class="top-bar__logo-dot"></span>
      FoodTrack
    </div>
    <div class="top-bar__actions" id="topBarActions"></div>
  </div>
</header>
  `;

  // Inject into the app-shell wrapper
  const shell = document.querySelector('.app-shell');
  if (!shell) return;

  shell.insertAdjacentHTML('afterbegin', TOP_BAR_HTML);
  shell.insertAdjacentHTML('beforeend', NAV_HTML);
})();
