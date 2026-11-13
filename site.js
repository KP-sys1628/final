/* KiwoProductions: small vanilla script for the static site.
   Header on scroll, Services dropdown, mobile menu, reveal animations, enquiry form. */
(function () {
  'use strict';
  window.kiwoReady = true;
  var root = document.documentElement;
  var CONTACT_EMAIL = "kiwoproductions@gmail.com";
  // Service / package slug → name and listed price (used to pre-fill the enquiry form).
  var PREFILL = {"starter-pack":{"name":"Starter Pack","price":"$199.99"},"content-drop":{"name":"Content Drop","price":"$399.99"},"creator-pack":{"name":"Creator Pack","price":"$599.99"},"brand-day":{"name":"Brand Day Package","price":"$849.99"},"edited-stills":{"name":"10 Edited Stills","price":"$99.99"},"short-form-video":{"name":"Short-Form Video","price":"$149.99"},"long-form-video":{"name":"Long-Form Video","price":"from $499.99"},"kiwo-essentials":{"name":"Kiwo Essentials (monthly retainer)","price":"$299.99 / month"},"growth-partner":{"name":"Growth Partner (monthly retainer)","price":"$500.00 / month"},"brand-authority":{"name":"Brand Authority (monthly retainer)","price":"$999.00 / month"},"videography":{"name":"Videography","price":""},"short-form-content":{"name":"Short-Form Content","price":""},"photography":{"name":"Photography","price":""},"advertisement":{"name":"Advertisement","price":""}};

  /* ── Header background once the page scrolls ─────────────────────────── */
  var header = document.querySelector('header');
  var SOLID = ['border-white/[0.06]', 'bg-obsidian/75', 'backdrop-blur-xl'];
  var menuOpen = false;
  function paintHeader() {
    if (!header) return;
    var solid = menuOpen || window.scrollY > 12;
    SOLID.forEach(function (c) { header.classList.toggle(c, solid); });
    header.classList.toggle('border-transparent', !solid);
  }
  window.addEventListener('scroll', paintHeader, { passive: true });
  paintHeader();

  /* ── Desktop "Services" dropdown ────────────────────────────────────── */
  var dropdown = document.getElementById('services-menu');
  if (dropdown) {
    var wrap = dropdown.parentElement;
    var arrow = wrap.querySelector('button[aria-controls="services-menu"]');
    var link = wrap.querySelector('a');
    var wasActive = link && link.classList.contains('text-fg');
    var setDrop = function (open) {
      dropdown.hidden = !open;
      arrow.setAttribute('aria-expanded', String(open));
      arrow.querySelector('svg').classList.toggle('rotate-180', open);
      [arrow, link].forEach(function (el) {
        if (!el) return;
        var on = open || (el === link && wasActive);
        el.classList.toggle('text-fg', on);
        el.classList.toggle('text-muted', !on);
      });
    };
    var hoverOpenedAt = 0;
    wrap.addEventListener('mouseenter', function () { hoverOpenedAt = Date.now(); setDrop(true); });
    wrap.addEventListener('mouseleave', function () { setDrop(false); });
    // A mouse click straight after the hover opened it shouldn't immediately close it again.
    arrow.addEventListener('click', function () { setDrop(dropdown.hidden || Date.now() - hoverOpenedAt < 600); });
    wrap.addEventListener('focusout', function (e) { if (!wrap.contains(e.relatedTarget)) setDrop(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrop(false); });
    document.addEventListener('mousedown', function (e) { if (!wrap.contains(e.target)) setDrop(false); });
  }

  /* ── Mobile menu ────────────────────────────────────────────────────── */
  var mobile = document.getElementById('mobile-menu');
  var burger = document.querySelector('button[aria-controls="mobile-menu"]');
  if (mobile && burger) {
    var bars = burger.querySelectorAll('span');
    // "Services" inside the menu drops down the four services.
    var subBtn = mobile.querySelector('button[aria-controls="mobile-services"]');
    var subList = document.getElementById('mobile-services');
    var setSub = function (open) {
      if (!subBtn || !subList) return;
      subList.hidden = !open;
      subBtn.setAttribute('aria-expanded', String(open));
      var chevron = subBtn.querySelector('svg');
      chevron.classList.toggle('rotate-180', open);
      chevron.classList.toggle('text-accent', open);
      chevron.classList.toggle('text-muted', !open);
    };
    if (subBtn) subBtn.addEventListener('click', function () { setSub(subList.hidden); });
    var setMenu = function (open) {
      if (!open) setSub(false); // starts folded each time the menu opens
      menuOpen = open;
      mobile.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      bars[0].classList.toggle('rotate-45', open);
      bars[0].classList.toggle('-translate-y-1', !open);
      bars[1].classList.toggle('-rotate-45', open);
      bars[1].classList.toggle('translate-y-1', !open);
      document.body.style.overflow = open ? 'hidden' : '';
      paintHeader();
    };
    mobile.querySelectorAll('[data-menu-item]').forEach(function (el, i) { el.style.animationDelay = 0.05 * i + 's'; });
    burger.addEventListener('click', function () { setMenu(mobile.hidden); });
    mobile.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) setMenu(false); });
    window.addEventListener('resize', function () { if (menuOpen && window.innerWidth >= 768) setMenu(false); });
  }

  /* ── Home background video (10 s loop) ──────────────────────────────── */
  // Always plays by itself, muted and on repeat, on every device. If a phone blocks autoplay
  // (iPhone Low Power Mode, Android Data Saver) it starts on the first touch, tap or scroll;
  // if it gets paused (tab switched, phone locked) it starts again.
  document.querySelectorAll('video[loop]').forEach(function (video) {
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    var sync = function () {
      if (!video.paused) return;
      var p = video.play(); if (p && p.catch) p.catch(function () {});
    };
    sync();
    ['touchstart', 'pointerdown', 'click', 'scroll', 'keydown'].forEach(function (ev) {
      window.addEventListener(ev, sync, { passive: true });
    });
    video.addEventListener('pause', sync);
    video.addEventListener('canplay', sync);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') sync(); });
  });

  /* ── Reveal animations ──────────────────────────────────────────────── */
  var animated = Array.prototype.slice.call(document.querySelectorAll('[data-anim]'));
  var word = 0;
  animated.forEach(function (el) {
    if (el.getAttribute('data-anim') === 'word') {
      el.style.setProperty('--d', (0.15 + word++ * 0.08) + 's'); // headline words, one after another
    } else if (el.style.getPropertyValue('--y').trim() === '24px') {
      // Grid items: stagger by position among their animated siblings.
      var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute('data-anim'); });
      el.style.setProperty('--d', Math.min(sibs.indexOf(el), 8) * 0.08 + 's');
    }
  });
  var show = function (el) { el.classList.add('is-in'); };
  if (!('IntersectionObserver' in window)) {
    animated.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    // Wait a frame so the hidden start state paints before animating in.
    // Headline words sit inside overflow-clipped masks (never "intersecting"), so they play on load.
    // (Timers rather than requestAnimationFrame, which never fires in background tabs.)
    setTimeout(function () {
      animated.forEach(function (el) {
        if (el.getAttribute('data-anim') === 'word') show(el);
        else io.observe(el);
      });
    }, 30);
  }

  /* ── Enquiry form (contact page) ────────────────────────────────────── */
  var form = document.getElementById('contact-form');
  if (!form) return;
  var $ = function (sel) { return form.querySelector(sel); };
  var params = new URLSearchParams(window.location.search);
  var kindLabels = form.querySelectorAll('[data-kind]');
  var messageLabel = form.querySelector('label[for="message"]');
  var message = $('#message');
  var submit = form.querySelector('button[type="submit"]');
  var status = document.getElementById('form-status');
  var ON = ['border-accent', 'bg-accent-dim', 'text-accent'];
  var OFF = ['border-line', 'text-muted', 'hover:text-fg'];
  var kind = 'enquiry';

  // "Get a quote" only lists the "Our services" and "Other" groups. Optgroups are removed/re-added
  // (hiding them with CSS doesn't work in every browser's dropdown).
  var serviceSel = $('#service');
  var QUOTE_GROUPS = ['Our services', 'Other'];
  var allGroups = [].slice.call(serviceSel.querySelectorAll('optgroup'));
  var placeholder = serviceSel.options[0];
  function showGroups(k, byHand) {
    var current = serviceSel.value;
    var currentOpt = serviceSel.options[serviceSel.selectedIndex];
    var currentGroup = currentOpt && currentOpt.parentNode.tagName === 'OPTGROUP' ? currentOpt.parentNode.label : '';
    allGroups.forEach(function (g) {
      var show = k !== 'quote' || QUOTE_GROUPS.indexOf(g.label) !== -1;
      if (show && !g.parentNode) serviceSel.appendChild(g);
      if (!show && g.parentNode) g.parentNode.removeChild(g);
    });
    // keep the groups in their original order, with any extra (linked) option last
    allGroups.forEach(function (g) { if (g.parentNode) serviceSel.appendChild(g); });
    [].slice.call(serviceSel.querySelectorAll(':scope > option')).forEach(function (o) { if (o !== placeholder) serviceSel.appendChild(o); });
    placeholder.textContent = k === 'quote' ? 'Choose a service' : 'Choose a retainer, package or service';
    var stillThere = [].some.call(serviceSel.options, function (o) { return o.value === current; });
    if (current && !stillThere) {
      if (byHand) current = '';
      // A choice that came from a link stays selectable as its own option.
      else serviceSel.add(new Option(currentOpt ? currentOpt.textContent : current, current));
    }
    serviceSel.value = current;
    if (typeof syncTerm === 'function') syncTerm();
    return currentGroup;
  }

  function setKind(k, byHand) {
    kind = k;
    showGroups(k, byHand);
    kindLabels.forEach(function (label) {
      var on = label.getAttribute('data-kind') === k;
      label.querySelector('input').checked = on;
      ON.forEach(function (c) { label.classList.toggle(c, on); });
      OFF.forEach(function (c) { label.classList.toggle(c, !on); });
    });
    messageLabel.textContent = messageLabel.getAttribute('data-label-' + k);
    message.placeholder = k === 'quote' ? message.getAttribute('data-placeholder-quote') : 'How can we help?';
    submit.textContent = submit.getAttribute('data-text-' + k);
  }
  kindLabels.forEach(function (label) {
    label.querySelector('input').addEventListener('change', function () { setKind(label.getAttribute('data-kind'), true); });
  });

  // "Enquire" / "Get a quote" links: contact.html?type=quote&service=brand-day#enquiry-form
  var picked = PREFILL[params.get('service') || ''];
  var serviceSelect = $('#service');
  if (picked) {
    // A name the dropdown doesn't list (older link): add it so it stays selected.
    var exists = [].some.call(serviceSelect.options, function (o) { return o.value === picked.name; });
    if (!exists) serviceSelect.add(new Option(picked.name, picked.name));
    serviceSelect.value = picked.name;
  }
  // Contract length only shows (and is only sent) when a monthly retainer is chosen.
  var termSelect = $('#term');
  var termWrap = document.getElementById('term-wrap');
  function syncTerm() {
    if (!termSelect) return;
    var opt = serviceSelect.options[serviceSelect.selectedIndex];
    var retainer = !!(opt && opt.hasAttribute('data-retainer'));
    termWrap.hidden = !retainer;
    termSelect.disabled = !retainer;
    if (!retainer) termSelect.value = '';
  }
  serviceSelect.addEventListener('change', syncTerm);
  syncTerm();
  // &term=3|6|12 from the Pricing page's contract buttons.
  var months = params.get('term');
  if (termSelect && !termSelect.disabled && months && termSelect.querySelector('option[value="' + months + ' months"]')) termSelect.value = months + ' months';
  setKind(params.get('type') === 'quote' ? 'quote' : 'enquiry');

  // Validation (same rules as the original site).
  var fields = ['#name', '#email', '#message'].map($);
  function fieldError(input) {
    var v = input.value.trim();
    if (input.id === 'name' && v.length < 2) return input.getAttribute('data-error');
    if (input.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return input.getAttribute('data-error');
    if (input.id === 'message' && v.length < 10) return input.getAttribute('data-error');
    return '';
  }
  function showError(input, text) {
    var id = input.id + '-error';
    var el = document.getElementById(id);
    if (text) {
      if (!el) {
        el = document.createElement('p');
        el.id = id;
        el.className = 'field-error';
        el.setAttribute('role', 'alert');
        input.insertAdjacentElement('afterend', el);
      }
      el.textContent = text;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', id);
    } else {
      if (el) el.remove();
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  }
  fields.forEach(function (input) {
    input.addEventListener('input', function () { if (input.hasAttribute('aria-invalid')) showError(input, fieldError(input)); });
  });

  function setStatus(text) {
    status.hidden = !text;
    status.textContent = text || '';
  }

  form.addEventListener('submit', function (e) {
    var firstBad = null;
    fields.forEach(function (input) {
      var err = fieldError(input);
      showError(input, err);
      if (err && !firstBad) firstBad = input;
    });
    if (firstBad) {
      e.preventDefault();
      setStatus('Please check the highlighted fields.');
      firstBad.focus();
      return;
    }
    setStatus('');

    // Subject + listed price for the email in your inbox.
    var name = $('#name').value.trim();
    var service = $('#service').value.trim();
    var term = termSelect && !termSelect.disabled ? termSelect.value : '';
    form.elements['_subject'].value = (kind === 'quote'
      ? 'New quote request: ' + (service || 'custom project') + ' – ' + name
      : 'New enquiry from ' + name) + (term ? ' (' + term.split(' ')[0] + '-month retainer)' : '');
    var match = null;
    Object.keys(PREFILL).forEach(function (k) {
      if (!match && PREFILL[k].name.toLowerCase() === service.toLowerCase()) match = PREFILL[k];
    });
    form.elements['Listed price'].value = match && match.price ? match.price : '';
    if (/^https?:$/.test(window.location.protocol)) {
      form.elements['_next'].value = new URL('thanks.html', window.location.href).href;
    }

    // Send in the background (old browsers without fetch just post the form and land on thanks.html).
    if (!window.fetch || !window.FormData) return;
    e.preventDefault();
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    submit.textContent = 'Sending…';
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (String(res.success) !== 'true') throw new Error(res.message || 'Not sent');
        var done = document.createElement('div');
        done.className = 'card p-8';
        done.setAttribute('role', 'status');
        done.innerHTML = '<h2 class="font-display text-3xl font-bold">Message sent.</h2><p class="mt-3 text-muted"></p>';
        done.querySelector('p').textContent = 'Got it. We’ll get back to you within one business day.';
        form.replaceWith(done);
      })
      .catch(function () {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        submit.textContent = submit.getAttribute('data-text-' + kind);
        setStatus('Sorry, that didn’t send. Please try again, or email us at ' + CONTACT_EMAIL + '.');
      });
  });
})();
