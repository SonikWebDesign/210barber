/* ============================================================
   Content lives in the JSON files next to this script and is
   edited through Pages CMS (.pages.yml):
     site.json         texts, stats, address, phone
     barbers.json      barber cards
     haircuts.json     haircut gallery
     competition.json  competition & awards gallery
     hours.json        opening hours
   The HTML keeps the same texts as a fallback.
   ============================================================ */

document.getElementById('yr').textContent = new Date().getFullYear();

function loadJSON(name) {
  return fetch(name, { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(name + ' ' + r.status); return r.json(); })
    .catch(function (err) { console.warn('Could not load', name, err); return null; });
}
function asset(p) { return String(p || '').replace(/^\/+/, ''); }
function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/* ---- Header + mobile menu ---- */
(function () {
  var hd = document.getElementById('top');
  var burger = document.getElementById('burger');
  var nl = document.getElementById('navLinks');
  window.addEventListener('scroll', function () { hd.classList.toggle('scrolled', window.scrollY > 30); }, { passive: true });
  function setOpen(open) {
    nl.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  burger.addEventListener('click', function () { setOpen(!nl.classList.contains('open')); });
  nl.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
})();

/* ---- Texts, stats, contact ---- */
function applySite(site) {
  if (!site) return;
  document.querySelectorAll('[data-cms]').forEach(function (node) {
    var v = site[node.getAttribute('data-cms')];
    if (v != null && String(v).trim() !== '') node.textContent = v;
  });
  if (site.starting_price) {
    document.querySelectorAll('[data-cms-price]').forEach(function (node) {
      node.textContent = '$' + site.starting_price + node.getAttribute('data-cms-price');
    });
  }
  var addr = [site.address_line_1, site.address_line_2].filter(Boolean).join(', ');
  if (addr) {
    var maps = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(addr);
    document.querySelectorAll('.js-maps').forEach(function (a) { a.href = maps; });
  }
  if (site.phone) {
    var digits = String(site.phone).replace(/\D/g, '');
    if (digits.length === 10) digits = '1' + digits;
    document.querySelectorAll('.js-tel').forEach(function (a) { a.href = 'tel:+' + digits; });
  }
}

/* ---- Opening hours ---- */
function renderHours(hours) {
  var box = document.getElementById('hoursList');
  if (!box || !hours || !hours.length) return;
  box.innerHTML = '';
  hours.forEach(function (h) {
    var row = el('div');
    row.appendChild(el('span', null, h.day));
    row.appendChild(el('span', null, h.time));
    box.appendChild(row);
  });
}

/* ---- Barber grid ---- */
function renderBarbers(barbers) {
  var grid = document.getElementById('barberGrid');
  if (!grid || !barbers) return;
  var arrow = '<svg class="svg-i" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  barbers = barbers.filter(function (b) { return b && b.name; });

  function render(list) {
    grid.innerHTML = '';
    grid.classList.toggle('few', list.length < 4);
    list.forEach(function (b, i) {
      var url = b.booking_link, via = b.platform || 'Booksy';
      var card = el(url ? 'a' : 'div', 'barber' + (url ? '' : ' pending'));
      if (url) {
        card.href = url;
        card.target = '_blank';
        card.rel = 'noopener';
        card.setAttribute('aria-label', 'Book ' + b.name + (b.price ? ', starting at $' + b.price : '') + ', on ' + via);
      }
      card.style.setProperty('--i', i);
      card.appendChild(el('span', 'b-num', String(barbers.indexOf(b) + 1).padStart(2, '0')));
      var av = el('span', 'b-avatar');
      if (b.photo) {
        var img = el('img');
        img.src = asset(b.photo);
        img.alt = b.name;
        img.loading = 'lazy';
        av.appendChild(img);
        av.classList.add('has-photo');
      } else {
        av.textContent = url ? b.name.charAt(0) : '?';
      }
      card.appendChild(av);
      card.appendChild(el('span', 'b-name', b.name));
      card.appendChild(el('span', 'b-via', url ? 'Books on ' + via : 'Booking link coming soon'));
      var foot = el('span', 'b-foot');
      var price = el('span', 'b-price');
      price.appendChild(el('small', null, 'from'));
      price.appendChild(document.createTextNode(b.price ? '$' + b.price : '—'));
      foot.appendChild(price);
      var cta = el('span', 'b-cta');
      cta.innerHTML = url ? 'Book ' + arrow : 'Soon';
      foot.appendChild(cta);
      card.appendChild(foot);
      grid.appendChild(card);
    });
  }

  render(barbers);

  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      var mode = chip.getAttribute('data-sort');
      var list = barbers.slice();
      if (mode === 'low') list.sort(function (a, b) { return (a.price || 0) - (b.price || 0); });
      if (mode === 'high') list.sort(function (a, b) { return (b.price || 0) - (a.price || 0); });
      render(list);
    });
  });
}

/* ---- Photo galleries ---- */
function renderGallery(id, list, cls) {
  var grid = document.getElementById(id);
  if (!grid || !list) return;
  var zoom = '<span class="zoom"><svg class="svg-i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg></span>';
  list.forEach(function (p) {
    if (!p || !p.photo) return;
    var src = asset(p.photo), cap = p.caption || '';
    var btn = el('button', cls + ' reveal' + (p.wide ? ' wide' : ''));
    btn.type = 'button';
    btn.setAttribute('data-full', src);
    btn.setAttribute('data-cap', cap);
    btn.setAttribute('aria-label', 'Open larger image: ' + (cap || 'photo'));
    var img = el('img');
    img.src = src;
    img.alt = cap;
    img.loading = 'lazy';
    img.decoding = 'async';
    btn.appendChild(img);
    btn.insertAdjacentHTML('beforeend', zoom);
    grid.appendChild(btn);
  });
}

/* ---- Scroll reveal ---- */
function initReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
}

/* ---- Gallery lightbox ---- */
function initLightbox() {
  var all = Array.prototype.slice.call(document.querySelectorAll('.gitem'));
  var lb = document.getElementById('lightbox');
  if (!all.length || !lb) return;
  var items = all;
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbCount = document.getElementById('lbCount');
  var idx = 0, lastFocus = null;

  function show(i) {
    idx = (i + items.length) % items.length;
    var el = items[idx], img = el.querySelector('img');
    lbImg.src = el.getAttribute('data-full') || img.src;
    lbImg.alt = img ? img.alt : '';
    lbCap.textContent = el.getAttribute('data-cap') || '';
    lbCount.textContent = (idx + 1) + ' / ' + items.length;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('lbClose').focus();
  }
  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  all.forEach(function (el) {
    el.addEventListener('click', function () {
      var grid = el.parentNode;
      items = Array.prototype.slice.call(grid.querySelectorAll('.gitem'));
      open(items.indexOf(el));
    });
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbNext').addEventListener('click', function () { show(idx + 1); });
  document.getElementById('lbPrev').addEventListener('click', function () { show(idx - 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'ArrowLeft') show(idx - 1);
  });
  var sx = 0, sy = 0;
  lb.addEventListener('touchstart', function (e) { var t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(idx + (dx < 0 ? 1 : -1));
    else if (dy > 70 && Math.abs(dy) > Math.abs(dx)) close();
  }, { passive: true });
}

/* ---- Boot: load content, render, then start effects ---- */
Promise.all(['site.json', 'barbers.json', 'haircuts.json', 'competition.json', 'hours.json'].map(loadJSON))
  .then(function (d) {
    applySite(d[0]);
    renderBarbers(d[1]);
    renderGallery('cutsGrid', d[2], 'gitem');
    renderGallery('awardsGrid', d[3], 'gitem aitem');
    renderHours(d[4]);
  })
  .catch(function (err) { console.error(err); })
  .then(function () {
    initReveal();
    initLightbox();
    // Links like ...#barbers (QR code) — jump there once the content has been rendered
    var t = location.hash && document.getElementById(location.hash.slice(1));
    if (t) {
      var moved = false;
      ['wheel', 'touchstart', 'keydown'].forEach(function (ev) { window.addEventListener(ev, function () { moved = true; }, { once: true, passive: true }); });
      var jump = function () { if (!moved) t.scrollIntoView({ behavior: 'instant', block: 'start' }); };
      jump();
      // fonts and images can shift the layout — re-align once they are in
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(jump);
      if (document.readyState === 'complete') setTimeout(jump, 50); else window.addEventListener('load', jump);
    }
  });
