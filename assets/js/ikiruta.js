/**
 * IKIGAIER · Recorrido interactivo del taller (ikiruta)
 * Compartido por /es/taller/ y /ca/taller/. Los textos de cada estación
 * se leen del bloque <script type="application/json" id="ikiruta-data">.
 * Escritorio: camino sinuoso original. Con menos de 520 px útiles:
 * camino vertical para que números y títulos no se encojan con el dibujo.
 */
(function () {
  var dataEl = document.getElementById('ikiruta-data');
  var P = document.getElementById('ikiruta-p');
  var PR = document.getElementById('ikiruta-prog');
  var G = document.getElementById('ikiruta-stops');
  var body = document.getElementById('ikiruta-body');
  if (!dataEl || !P || !PR || !G || !body) return;

  var D = JSON.parse(dataEl.textContent);
  var ns = 'http://www.w3.org/2000/svg';
  var svg = P.ownerSVGElement;
  var WIDE = 'M20 290 C 140 295, 170 190, 300 200 S 460 280, 540 200 S 660 70, 770 50';
  var NARROW = 'M48 38 C 78 65, 18 100, 48 126 S 78 188, 48 214 S 18 276, 48 302 S 78 364, 48 390';
  var L = P.getTotalLength();
  var F = [0.12, 0.34, 0.57, 0.8, 1];
  var cur = -1;
  var gs = [];

  function el(tag, attrs, parent) {
    var e = document.createElementNS(ns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    (parent || G).appendChild(e);
    return e;
  }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  D.forEach(function (s, i) {
    var last = i === D.length - 1;
    var g = el('g', { 'class': 'ikiruta-stop', tabindex: '0', role: 'button', 'aria-pressed': 'false', 'aria-label': s.t + ' · ' + s.s });
    if (last) {
      el('path', { 'class': 'ikiruta-mastil', stroke: '#272727', 'stroke-width': 2.5 }, g);
      el('path', { 'class': 'ikiruta-bandera', fill: '#C2866B' }, g);
    }
    el('circle', { 'class': 'hit' }, g);   // zona táctil ampliada, invisible
    el('circle', { 'class': 'dot' }, g);
    var n = el('text', { 'class': 'num' }, g);
    n.textContent = last ? '✓' : s.n;
    var t = el('text', { 'class': 'tit' }, g);
    t.textContent = s.t;
    ['mouseenter', 'focus', 'click'].forEach(function (ev) { g.addEventListener(ev, function () { show(i); }); });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); }
    });
    gs.push(g);
  });

  function show(i) {
    if (i === cur) return;
    cur = i;
    var s = D[i];
    gs.forEach(function (g, j) {
      g.classList.toggle('on', j === i);
      g.setAttribute('aria-pressed', j === i ? 'true' : 'false');
    });
    PR.style.strokeDashoffset = L * (1 - F[i]);
    body.innerHTML = '<div class="fade"><div class="k">' + (s.n === '★' ? '' : esc(s.n) + ' · ') + esc(s.s) +
      '</div><h3>' + esc(s.t) + '</h3><p>' + esc(s.d) + '</p></div>';
  }

  function layout() {
    var width = svg.getBoundingClientRect().width;
    if (!width) return;
    var compact = width < 520;
    var path = compact ? NARROW : WIDE;
    svg.setAttribute('viewBox', compact ? '0 0 ' + width + ' 438' : '0 0 800 330');
    P.setAttribute('d', path);
    PR.setAttribute('d', path);
    L = P.getTotalLength();
    F = compact ? [0, 0.25, 0.5, 0.75, 1] : [0.12, 0.34, 0.57, 0.8, 1];
    var scale = compact ? 1 : width / 800;
    gs.forEach(function (g, i) {
      var pt = P.getPointAtLength(L * F[i]);
      var last = i === D.length - 1;
      var c = g.querySelector('.dot'), h = g.querySelector('.hit'), n = g.querySelector('.num'), t = g.querySelector('.tit');
      c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.setAttribute('r', 14 / scale);
      h.setAttribute('cx', pt.x); h.setAttribute('cy', pt.y); h.setAttribute('r', 24 / scale);
      n.setAttribute('x', pt.x); n.setAttribute('y', pt.y + 5.5 / scale); n.style.fontSize = 16 / scale + 'px';
      t.setAttribute('x', compact ? pt.x + 32 : (i === 3 ? pt.x - 32 : last ? pt.x - 22 : pt.x));
      t.setAttribute('y', compact ? pt.y + 7 : (i === 0 || i === 2 ? pt.y + 54 : i === 3 ? pt.y + 9 : last ? pt.y - 30 : pt.y - 36));
      t.style.textAnchor = compact ? 'start' : (i === 3 || last ? 'end' : 'middle');
      t.style.fontSize = (compact ? 23 : 24) / scale + 'px';
      if (last) {
        var m = g.querySelector('.ikiruta-mastil'), b = g.querySelector('.ikiruta-bandera');
        m.setAttribute('d', 'M' + pt.x + ' ' + pt.y + ' v-46');
        b.setAttribute('d', 'M' + pt.x + ' ' + (pt.y - 46) + ' l30 10 l-30 10 z');
        m.style.display = b.style.display = compact ? 'none' : '';
      }
    });
    PR.style.strokeDasharray = L;
    PR.style.strokeDashoffset = L * (1 - F[Math.max(cur, 0)]);
  }

  show(0);
  layout();
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(svg);
  else window.addEventListener('resize', layout);
})();
