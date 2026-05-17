/**
 * IKIGAIER · Main JavaScript
 * Newsletter confirmation + Mobile menu
 */
(function() {
  /* ---- Newsletter confirmation on return from Formspree ---- */
  var params = new URLSearchParams(window.location.search);
  if (params.get('success') === '1') {
    var msg = document.getElementById('newsletter-msg');
    if (msg) {
      msg.textContent = 'Gracias. Te avisaré cuando haya novedades.';
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
    toggle.setAttribute('aria-label', 'Cerrar menú');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('visible');
    toggle.setAttribute('aria-label', 'Abrir menú');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function() {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  links.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
  });
})();