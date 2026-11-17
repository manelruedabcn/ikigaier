/**
 * ikigaier · Formularios
 * Envía los formularios marcados con data-formulario a la app
 * (https://app.ikigaier.com/api/web/contacto), que guarda el contacto en el CRM
 * y avisa a Manel por Telegram y por correo. Antes iban a Formspree con la
 * dirección de correo en la URL, un formato que ya no funciona.
 *
 * Si el envío va bien, se va a la dirección del campo _next (la misma página
 * con ?success=1 u ?ok=…), donde cada página ya muestra su «gracias» y mide la
 * conversión. Si falla, se muestra un aviso con el correo de contacto.
 * Los textos se eligen según el idioma de la página (<html lang>).
 */
(function () {
  var ENDPOINT = 'https://app.ikigaier.com/api/web/contacto';
  var lang = (document.documentElement.lang || 'es').slice(0, 2);
  if (lang !== 'ca' && lang !== 'en') lang = 'es';
  var T = {
    es: { sending: 'Enviando…', error: 'No se ha podido enviar. Escríbenos a <a href="mailto:hola@ikigaier.com">hola@ikigaier.com</a>.' },
    ca: { sending: 'Enviant…', error: 'No s’ha pogut enviar. Escriu-nos a <a href="mailto:hola@ikigaier.com">hola@ikigaier.com</a>.' },
    en: { sending: 'Sending…', error: 'It couldn’t be sent. Write to us at <a href="mailto:hola@ikigaier.com">hola@ikigaier.com</a>.' }
  }[lang];

  function aviso(form, html) {
    var p = form.querySelector('.form-error');
    if (!p) {
      p = document.createElement('p');
      p.className = 'form-error';
      p.setAttribute('role', 'alert');
      p.style.marginTop = '0.8rem';
      form.appendChild(p);
    }
    p.innerHTML = html;
  }

  document.querySelectorAll('form[data-formulario]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var boton = form.querySelector('[type="submit"]');
      var textoBoton = boton ? boton.textContent : '';
      var datos = { formulario: form.getAttribute('data-formulario'), lang: lang, pagina: location.pathname };
      new FormData(form).forEach(function (v, k) {
        if (k === '_next' || k === '_subject') return;
        if (k === '_gotcha') { datos.website = v; return; }
        if (k === 'privacidad') { datos.privacidad = true; return; }
        datos[k] = v;
      });
      var siguiente = form.querySelector('input[name="_next"]');
      if (boton) { boton.disabled = true; boton.textContent = T.sending; }

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })
        .then(function (r) { return r.json().then(function (j) { return r.ok && j && j.ok; }); })
        .catch(function () { return false; })
        .then(function (ok) {
          if (ok) {
            location.href = siguiente ? siguiente.value : location.pathname + '?success=1';
            return;
          }
          if (boton) { boton.disabled = false; boton.textContent = textoBoton; }
          aviso(form, T.error);
        });
    });
  });
})();
