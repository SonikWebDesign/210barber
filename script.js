/* ---- Barbers: edit this list to add / remove / reorder ---- */
var BARBERS = [
  { name: 'Ant',     price: 50, via: 'Booksy',  url: 'https://booksy.com/en-us/1280622_blessedbyant_barber-shop_119316_ontario' },
  { name: 'Wavy',    price: 50, via: 'Booksy',  url: 'https://booksy.com/en-us/1277307_wavy-chopz_barber-shop_119316_ontario' },
  { name: 'Vic',     price: 65, via: 'Square',  url: 'https://book.squareup.com/appointments/ptwg7nrfwg6av7/location/LAAN9KJ5NMCS5/services' },
  { name: 'Ryan',    price: 50, via: 'Setmore', url: 'https://ryanfadez.setmore.com/ryan' },
  { name: 'Jesse',   price: 50, via: 'Booksy',  url: 'https://booksy.com/en-us/458632_jessecuttzz_barber-shop_119316_ontario' },
  { name: 'Larry',   price: 50, via: 'Booksy',  url: 'https://booksy.com/en-us/1346591_ontario-barber_barber-shop_119316_ontario' },
  { name: 'Dyno',    price: 45, via: 'Vagaro',  url: 'https://www.vagaro.com/gw3klnh' },
  { name: 'Marcelo', price: 40, via: 'Booksy',  url: 'https://booksy.com/en-us/1366993_mef-barber_barber-shop_119316_ontario' },
  { name: 'Mazin',   price: 40, via: 'Setmore', url: 'https://mazinthebarber.setmore.com/mazinaboabdo' },
  { name: 'Angel',   price: 40, via: 'Booksy',  url: 'https://booksy.com/en-us/659984_zzzcuts_barber-shop_119316_ontario' },
  { name: 'Brandon', price: 45, via: 'Booksy',  url: 'https://booksy.com/en-us/1336707_b2santoss_barber-shop_119316_ontario' },
  { name: 'Nate',    price: 45, via: 'theCut',  url: 'https://app.thecut.co/barbers/nateblendz' },
  { name: 'Jose',    price: 35, via: 'theCut',  url: 'https://search.thecut.co/barbers/jxseblendzz' },
  // No booking link yet — set `url` and `via` once it's agreed, and the card becomes bookable
  { name: 'Mike',    price: 60, via: null,      url: null }
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
    list.forEach(function (b, i) {
      var a = document.createElement(b.url ? 'a' : 'div');
      a.className = 'barber' + (b.url ? '' : ' pending');
      if (b.url) {
        a.href = b.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.setAttribute('aria-label', 'Book ' + b.name + ', starting at $' + b.price + ', on ' + b.via);
      }
      a.style.setProperty('--i', i);
      a.innerHTML =
        '<span class="b-num">' + String(BARBERS.indexOf(b) + 1).padStart(2, '0') + '</span>' +
        '<span class="b-avatar">' + b.name.charAt(0) + '</span>' +
        '<span class="b-name">' + b.name + '</span>' +
        '<span class="b-via">' + (b.url ? 'Books on ' + b.via : 'Booking to be discussed') + '</span>' +
        '<span class="b-foot">' +
          '<span class="b-price"><small>from</small>$' + b.price + '</span>' +
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
      if (mode === 'low') list.sort(function (a, b) { return a.price - b.price; });
      if (mode === 'high') list.sort(function (a, b) { return b.price - a.price; });
      render(list);
    });
  });
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
  var items = Array.prototype.slice.call(document.querySelectorAll('.gitem'));
  var lb = document.getElementById('lightbox');
  if (!items.length || !lb) return;
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
  items.forEach(function (el, i) { el.addEventListener('click', function () { open(i); }); });
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
