/* Тотем — меню, окно связи с мессенджерами, ленивая карта, появление блоков */
(function () {
  'use strict';

  var PHONE = '375293795261';

  // ---------- Мобильное меню ----------
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }

  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // ---------- Кнопки связи с заготовленным текстом ----------
  // Без JS кнопки ведут в WhatsApp; с JS — открывается выбор мессенджера.
  var dialog = document.getElementById('contact-dialog');
  var dialogMsg = document.getElementById('dialog-msg');
  var dialogWa = document.getElementById('dlg-wa');
  var dialogHint = document.getElementById('dialog-hint');
  var hintDefault = dialogHint.textContent;
  var currentMsg = '';

  function waLink(text) {
    return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text);
  }

  document.querySelectorAll('[data-msg]').forEach(function (el) {
    el.href = waLink(el.dataset.msg);
    if (el.closest('.messengers')) return; // прямая кнопка WhatsApp в контактах

    el.addEventListener('click', function (e) {
      if (typeof dialog.showModal !== 'function') return;
      e.preventDefault();
      setMenu(false);
      currentMsg = el.dataset.msg;
      dialogMsg.textContent = currentMsg;
      dialogWa.href = waLink(currentMsg);
      dialogHint.textContent = hintDefault;
      dialogHint.classList.remove('is-copied');
      dialog.showModal();
    });
  });

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close(); // клик по подложке
  });

  dialog.querySelectorAll('[data-copy]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(currentMsg).then(function () {
        dialogHint.textContent = 'Текст скопирован — вставьте его в чат.';
        dialogHint.classList.add('is-copied');
      }).catch(function () {});
    });
  });

  // ---------- Карта: загружается по клику ----------
  var mapBtn = document.querySelector('.map__btn');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = mapBtn.dataset.mapSrc;
      iframe.title = 'Карта: г. Минск, ул. М. Богдановича, 78';
      iframe.loading = 'lazy';
      iframe.allowFullscreen = true;
      var map = document.getElementById('map');
      map.innerHTML = '';
      map.appendChild(iframe);
    });
  }

  // ---------- Появление блоков при скролле ----------
  if ('IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.section__head, .card, .why__list li, .zone, .offer__body, .plan, .massage');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
