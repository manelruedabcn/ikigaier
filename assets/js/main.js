/**
 * IKIGAIER · Main JavaScript
 * Newsletter confirmation + Mobile menu
 * Los textos se eligen según el idioma de la página (<html lang>).
 */
(function() {
  var lang = (document.documentElement.lang || 'es').slice(0, 2);
  var T = {
    es: { open: 'Abrir menú', close: 'Cerrar menú', thanks: 'Gracias. Te avisaré cuando haya novedades.' },
    ca: { open: 'Obrir el menú', close: 'Tancar el menú', thanks: 'Gràcies. T’avisaré quan hi hagi novetats.' },
    en: { open: 'Open menu', close: 'Close menu', thanks: 'Thank you. I’ll let you know when there’s news.' }
  }[lang] || null;
  if (!T) T = { open: 'Abrir menú', close: 'Cerrar menú', thanks: 'Gracias. Te avisaré cuando haya novedades.' };

  /* ---- Newsletter confirmation on return from Formspree ---- */
  var params = new URLSearchParams(window.location.search);
  if (params.get('success') === '1') {
    var msg = document.getElementById('newsletter-msg');
    if (msg) {
      msg.textContent = T.thanks;
      msg.style.color = '#FDFBF7';
      msg.style.display = 'block';
    }
    // Clean URL parameter without reloading
    var url = new URL(window.location.href);
    url.searchParams.delete('success');
    window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
  }

  /* ---- Mobile hamburger menu ---- */
  var toggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  var overlay = document.getElementById('nav-overlay');
  if (!toggle || !navLinks || !overlay) return;

  var links = navLinks.querySelectorAll('a');

  function openMenu() {
    toggle.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('visible');
    toggle.setAttribute('aria-label', T.close);
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (links[0]) links[0].focus();
  }

  function closeMenu(returnFocus) {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('visible');
    toggle.setAttribute('aria-label', T.open);
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', function() {
    navLinks.classList.contains('open') ? closeMenu(false) : openMenu();
  });

  overlay.addEventListener('click', function() { closeMenu(false); });

  links.forEach(function(link) {
    link.addEventListener('click', function() { closeMenu(false); });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu(true);
  });
})();
