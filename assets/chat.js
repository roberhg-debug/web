/* Chat con IA de Eina Nova Studio. Sin dependencias, sin cookies ni almacenamiento:
   la conversación vive solo en memoria y desaparece al cerrar o recargar la página.
   Configuración (atributos data-* de la etiqueta <script>):
     data-endpoint  URL del Worker (…/chat). Si contiene "PENDIENTE", el chat NO se muestra.
     data-whatsapp  número en formato internacional sin "+" (si vacío o PENDIENTE: solo correo).
     data-email     correo de contacto. */
(function () {
  var me = document.currentScript;
  if (!me) return;
  var endpoint = me.getAttribute('data-endpoint') || '';
  var wa = (me.getAttribute('data-whatsapp') || '').replace(/\D/g, '');
  var email = me.getAttribute('data-email') || 'einanovastudio@gmail.com';
  if (!/^(https:\/\/|http:\/\/localhost)/.test(endpoint) || /PENDIENTE/i.test(endpoint)) return; // aún sin configurar

  var MAX_CHARS = 500, MAX_TURNS = 8;
  var history = [], busy = false;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  var launch = el('button', 'ec-launch', 'Pregúntanos');
  launch.type = 'button';
  launch.setAttribute('aria-expanded', 'false');
  launch.setAttribute('aria-controls', 'ec-panel');
  launch.setAttribute('data-umami-event', 'chat-abrir');

  var panel = el('section', 'ec-panel');
  panel.id = 'ec-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chat con el asistente de Eina Nova Studio');

  var head = el('div', 'ec-head');
  head.appendChild(el('strong', null, 'Asistente de Eina Nova'));
  var close = el('button', 'ec-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Cerrar el chat');
  head.appendChild(close);

  var notice = el('p', 'ec-ia', 'Hablas con una inteligencia artificial, no con una persona. Puede equivocarse: no compartas datos personales. Los mensajes se envían a un proveedor de IA para responderte (ver ');
  var pl = el('a', null, 'privacidad');
  pl.href = '/privacidad.html';
  notice.appendChild(pl);
  notice.appendChild(document.createTextNode(').'));

  var log = el('div', 'ec-log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');
  log.setAttribute('aria-label', 'Conversación');

  var human = el('div', 'ec-human');
  human.appendChild(document.createTextNode('¿Prefieres hablar con una persona? '));
  if (wa && !/PENDIENTE/i.test(me.getAttribute('data-whatsapp') || '')) {
    var a1 = el('a', null, 'WhatsApp');
    a1.href = 'https://wa.me/' + wa;
    a1.target = '_blank';
    a1.rel = 'noopener noreferrer';
    a1.setAttribute('data-umami-event', 'chat-whatsapp');
    human.appendChild(a1);
    human.appendChild(document.createTextNode(' · '));
  }
  var a2 = el('a', null, 'Correo');
  a2.href = 'mailto:' + email + '?subject=Consulta%20desde%20la%20web';
  a2.setAttribute('data-umami-event', 'chat-correo');
  human.appendChild(a2);

  var form = el('form', 'ec-form');
  var label = el('label', null, 'Escribe tu pregunta');
  label.htmlFor = 'ec-input';
  label.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
  var input = el('textarea');
  input.id = 'ec-input';
  input.rows = 1;
  input.maxLength = MAX_CHARS;
  input.placeholder = 'Escribe tu pregunta…';
  var send = el('button', 'ec-send', 'Enviar');
  send.type = 'submit';
  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(send);
  var count = el('div', 'ec-count', '0/' + MAX_CHARS);
  count.setAttribute('aria-hidden', 'true');

  [head, notice, log, human, count, form].forEach(function (n) { panel.appendChild(n); });
  document.body.appendChild(launch);
  document.body.appendChild(panel);

  // Solo se convierten en enlace las URL de estos dominios (el resto queda como texto).
  var LINK_OK = /^https:\/\/(apps\.apple\.com|play\.google\.com|www\.eina-nova\.es|roberhg-debug\.github\.io)\//;
  function fill(m, text, links) {
    if (!links) { m.textContent = text; return; }
    text.split(/(https:\/\/[^\s)]+)/g).forEach(function (part) {
      if (LINK_OK.test(part)) {
        var a = el('a', null, part);
        a.href = part; a.target = '_blank'; a.rel = 'noopener noreferrer';
        m.appendChild(a);
      } else if (part) { m.appendChild(document.createTextNode(part)); }
    });
  }
  function add(cls, text) {
    var m = el('div', 'ec-msg ' + cls);
    fill(m, text, cls === 'ec-bot');
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }

  function open() {
    panel.classList.add('ec-open');
    launch.setAttribute('aria-expanded', 'true');
    if (!log.children.length) add('ec-bot', 'Hola, soy el asistente virtual (una IA) de Eina Nova Studio. Puedo contarte qué hacemos y cómo están nuestras apps. ¿En qué te ayudo?');
    input.focus();
  }
  function shut() {
    panel.classList.remove('ec-open');
    launch.setAttribute('aria-expanded', 'false');
    launch.focus();
  }

  launch.addEventListener('click', open);
  close.addEventListener('click', shut);
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
  input.addEventListener('input', function () { count.textContent = input.value.length + '/' + MAX_CHARS; });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || busy) return;
    busy = true;
    send.disabled = true;
    add('ec-user', text);
    history.push({ role: 'user', content: text });
    input.value = '';
    count.textContent = '0/' + MAX_CHARS;
    var typing = el('div', 'ec-typing', 'Escribiendo…');
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;

    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 30000);
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-MAX_TURNS) }),
      signal: ctrl.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer-when-downgrade'
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j.reply) {
          history.push({ role: 'assistant', content: res.j.reply });
          add('ec-bot', res.j.reply);
        } else {
          history.pop();
          add('ec-err', (res.j && res.j.error) || 'No he podido responder. Escríbenos por correo o WhatsApp.');
        }
      })
      .catch(function () {
        history.pop();
        add('ec-err', 'No hay conexión con el asistente. Escríbenos por correo o WhatsApp.');
      })
      .then(function () {
        clearTimeout(timer);
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        busy = false;
        send.disabled = false;
        input.focus();
      });
  });
})();
