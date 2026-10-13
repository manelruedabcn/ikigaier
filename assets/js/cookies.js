/* =============================================
   AVISO DE COOKIES — IKIGAIER
   La analítica (Google Analytics vía GTM) no se carga hasta que la persona
   la acepta. La carga real la hace window.ikiCargarAnalitica(), definida en
   el <head> de cada página. La elección se guarda 12 meses.
   ============================================= */
(function () {
  'use strict';

  var CLAVE = 'iki-cookies';
  var DOCE_MESES = 365 * 24 * 60 * 60 * 1000;

  var lang = (document.documentElement.lang || 'es').slice(0, 2);
  var TEXTOS = {
    es: {
      texto: 'Usamos cookies de analítica (Google Analytics) para saber qué páginas se leen y mejorar la web. Solo se activan si las aceptas.',
      politica: 'Política de cookies',
      url: '/es/cookies/',
      aceptar: 'Aceptar',
      rechazar: 'Rechazar',
      etiqueta: 'Aviso de cookies'
    },
    ca: {
      texto: 'Fem servir galetes d’analítica (Google Analytics) per saber quines pàgines es llegeixen i millorar el web. Només s’activen si les acceptes.',
      politica: 'Política de galetes',
      url: '/ca/galetes/',
      aceptar: 'Acceptar',
      rechazar: 'Rebutjar',
      etiqueta: 'Avís de galetes'
    },
    en: {
      texto: 'We use analytics cookies (Google Analytics) to see which pages are read and improve the site. They are only switched on if you accept them.',
      politica: 'Cookie policy',
      url: '/en/cookies/',
      aceptar: 'Accept',
      rechazar: 'Reject',
      etiqueta: 'Cookie notice'
    }
  };
  var t = TEXTOS[lang] || TEXTOS.es;

  function leer() {
    try {
      var v = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (v && (v.e === 'si' || v.e === 'no') && Date.now() - v.t < DOCE_MESES) return v.e;
    } catch (e) {}
    return null;
  }

  function guardar(eleccion) {
    try { localStorage.setItem(CLAVE, JSON.stringify({ e: eleccion, t: Date.now() })); } catch (e) {}
  }

  // Al rechazar después de haber aceptado: borra las cookies de Google Analytics
  function borrarCookiesAnalitica() {
    var dominios = ['', location.hostname, '.' + location.hostname.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (c) {
      var nombre = c.split('=')[0].trim();
      if (/^_ga/.test(nombre) || nombre === '_gid' || /^_gat/.test(nombre)) {
        dominios.forEach(function (d) {
          document.cookie = nombre + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  function estilos() {
    if (document.getElementById('iki-cookies-css')) return;
    var css = document.createElement('style');
    css.id = 'iki-cookies-css';
    css.textContent =
      '.iki-cookies{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:9999;max-width:46rem;margin:0 auto;' +
      'background:#FDFBF7;color:#272727;border:1px solid rgba(39,39,39,.14);box-shadow:0 8px 30px rgba(39,39,39,.12);' +
      'padding:1.1rem 1.3rem;display:flex;flex-wrap:wrap;align-items:center;gap:.8rem 1.4rem;' +
      'font-family:Inter,system-ui,sans-serif;font-size:.9rem;line-height:1.55}' +
      '.iki-cookies p{margin:0;flex:1 1 20rem}' +
      '.iki-cookies a{color:inherit;text-decoration:underline;text-underline-offset:2px}' +
      '.iki-cookies-botones{display:flex;gap:.6rem;flex:0 0 auto}' +
      '.iki-cookies button{font:inherit;font-size:.85rem;letter-spacing:.04em;padding:.55rem 1.2rem;cursor:pointer;' +
      'border:1px solid #272727;background:transparent;color:#272727}' +
      '.iki-cookies button:hover,.iki-cookies button:focus-visible{background:#272727;color:#FDFBF7}' +
      '@media (max-width:480px){.iki-cookies-botones{width:100%}.iki-cookies button{flex:1}}';
    document.head.appendChild(css);
  }

  function cerrar(aviso) {
    if (aviso && aviso.parentNode) aviso.parentNode.removeChild(aviso);
  }

  function mostrar() {
    if (document.querySelector('.iki-cookies')) return;
    estilos();
    var aviso = document.createElement('div');
    aviso.className = 'iki-cookies';
    aviso.setAttribute('role', 'region');
    aviso.setAttribute('aria-label', t.etiqueta);
    aviso.innerHTML =
      '<p>' + t.texto + ' <a href="' + t.url + '">' + t.politica + '</a>.</p>' +
      '<div class="iki-cookies-botones">' +
      '<button type="button" data-eleccion="no">' + t.rechazar + '</button>' +
      '<button type="button" data-eleccion="si">' + t.aceptar + '</button>' +
      '</div>';
    aviso.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-eleccion]');
      if (!b) return;
      var eleccion = b.getAttribute('data-eleccion');
      var anterior = leer();
      guardar(eleccion);
      cerrar(aviso);
      if (eleccion === 'si') {
        if (window.ikiCargarAnalitica) window.ikiCargarAnalitica();
      } else {
        borrarCookiesAnalitica();
        // Si ya estaba cargada, recargar para que deje de medir
        if (anterior === 'si' && window.ikiAnaliticaCargada) location.reload();
      }
    });
    document.body.appendChild(aviso);
  }

  // Enlaces «Configurar cookies» (pie y política) vuelven a abrir el aviso
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest('[data-cookies-config]');
    if (!a) return;
    ev.preventDefault();
    mostrar();
  });

  if (!leer()) mostrar();
})();
