/* ---- Barbers: edit this list to add / remove / reorder ----
   Placeholder until the booking links arrive. For each barber fill in:
     name  – shown on the card
     price – starting price as a number (e.g. 35)
     via   – booking platform (Booksy, Square, theCut ...)
     url   – booking link; while it is null the card shows "Soon" and is not clickable
   To grow toward 17, just add more lines. */
var BARBERS = [
  { name: '210blendz', price: 50, via: 'Booksy', url: 'https://210blendz19.booksy.com/k/' },
  { name: 'Cuttinupwitjayy', price: 35, via: 'Booksy', url: 'https://booksy.com/en-us/dl/show-business/1215405' }
];

/* ---- Haircut photos: to add more, drop the file in this folder and add a line ----
   src – image path, cap – caption shown in the full-size viewer */
var CUTS = [
  { src: 'cut-01.jpg', cap: 'Precision fringe cut with skin taper' },
  { src: 'cut-03.jpg', cap: 'Textured crop with highlights & low taper' },
  { src: 'cut-05.jpg', cap: 'High skin fade with sharp lineup' }
];

/* ---- Competition photos (award-XX.jpg). wide: true for landscape shots ---- */
var AWARDS = [
  { src: 'award-01.jpg', cap: 'ATX Barber Madness — Freestyle & Taper winners' },
  { src: 'award-02.jpg', cap: 'Taking the top prize on stage', wide: true },
  { src: 'award-03.jpg', cap: 'World Class Barber Expo 2026' },
  { src: 'award-04.jpg', cap: 'The Royal Battle — Taper King & Dynamic Duo' },
  { src: 'award-05.jpg', cap: 'The Notorious Experience — Best Taper Champion', wide: true },
  { src: 'award-06.jpg', cap: 'Freestyle champions — Drew\'s World Expo' },
  { src: 'award-07.jpg', cap: 'First place in Houston' }
];

document.getElementById('yr').textContent = new Date().getFullYear();

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

/* ---- Barber grid ---- */
(function () {
  var grid = document.getElementById('barberGrid');
  if (!grid) return;
  var arrow = '<svg class="svg-i" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  function render(list) {
    grid.innerHTML = '';
    grid.classList.toggle('few', list.length < 4);
    list.forEach(function (b, i) {
      var a = document.createElement(b.url ? 'a' : 'div');
      a.className = 'barber' + (b.url ? '' : ' pending');
      if (b.url) {
        a.href = b.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.setAttribute('aria-label', 'Book ' + b.name + (b.price ? ', starting at $' + b.price : '') + ', on ' + b.via);
      }
      a.style.setProperty('--i', i);
      a.innerHTML =
        '<span class="b-num">' + String(BARBERS.indexOf(b) + 1).padStart(2, '0') + '</span>' +
        '<span class="b-avatar">' + (b.url ? b.name.charAt(0) : '?') + '</span>' +
        '<span class="b-name">' + b.name + '</span>' +
        '<span class="b-via">' + (b.url ? 'Books on ' + b.via : 'Booking link coming soon') + '</span>' +
        '<span class="b-foot">' +
          '<span class="b-price"><small>from</small>' + (b.price ? '$' + b.price : '—') + '</span>' +
          '<span class="b-cta">' + (b.url ? 'Book ' + arrow : 'Soon') + '</span>' +
        '</span>';
      grid.appendChild(a);
    });
  }

  render(BARBERS);

  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      var mode = chip.getAttribute('data-sort');
      var list = BARBERS.slice();
      if (mode === 'low') list.sort(function (a, b) { return (a.price || 0) - (b.price || 0); });
      if (mode === 'high') list.sort(function (a, b) { return (b.price || 0) - (a.price || 0); });
      render(list);
    });
  });
})();

/* ---- Photo galleries ---- */
(function () {
  var zoom = '<span class="zoom"><svg class="svg-i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg></span>';
  function fill(id, list, cls) {
    var grid = document.getElementById(id);
    if (!grid) return;
    list.forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = cls + ' reveal' + (p.wide ? ' wide' : '');
      btn.setAttribute('data-full', p.src);
      btn.setAttribute('data-cap', p.cap || '');
      btn.setAttribute('aria-label', 'Open larger image: ' + (p.cap || 'photo'));
      var img = document.createElement('img');
      img.src = p.src;
      img.alt = p.cap || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      btn.appendChild(img);
      btn.insertAdjacentHTML('beforeend', zoom);
      grid.appendChild(btn);
    });
  }
  fill('cutsGrid', CUTS, 'gitem');
  fill('awardsGrid', AWARDS, 'gitem aitem');
})();

/* ---- Scroll reveal ---- */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
})();

/* ---- Gallery lightbox ---- */
(function () {
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
})();
