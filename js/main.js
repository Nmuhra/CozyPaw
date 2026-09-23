// Header: solid background once the page has scrolled
(function(){
  var header = document.getElementById('top');
  function update(){ header.classList.toggle('scrolled', window.scrollY > 8); }
  update();
  window.addEventListener('scroll', update, {passive: true});
})();

// Scroll-reveal for [data-reveal] blocks (hidden by CSS only when <html> has .js)
(function(){
  var els = document.querySelectorAll('[data-reveal]');
  if(!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
  els.forEach(function(el){ io.observe(el); });
})();

// Mobile menu
(function(){
  var header = document.getElementById('top');
  var toggle = header.querySelector('.menu-toggle');
  function setOpen(open){
    header.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function(){ setOpen(!header.classList.contains('open')); });
  header.querySelectorAll('nav.links a').forEach(function(a){
    a.addEventListener('click', function(){ setOpen(false); });
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setOpen(false); });
})();

// Booking form: build a WhatsApp message from the fields (falls back to mailto without JS)
document.getElementById('booking-form').addEventListener('submit', function(e){
  e.preventDefault();
  var f = e.target;
  var lines = [
    "Hi Cozypaw, I'd like to book a sit.",
    "Name: " + f.elements['name'].value.trim(),
    "Dates: " + f.elements['dates'].value.trim()
  ];
  if(f.elements['suburb'].value.trim()) lines.push("Suburb: " + f.elements['suburb'].value.trim());
  if(f.elements['notes'].value.trim()) lines.push("Notes: " + f.elements['notes'].value.trim());
  window.open('https://wa.me/27603401879?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
});

// "How a booking works": interactive stepper
(function(){
  var steps = document.querySelector('[data-stepper]');
  if(!steps) return;
  var items = [].slice.call(steps.querySelectorAll('.step'));
  var buttons = items.map(function(li){ return li.querySelector('.step-btn'); });

  function activate(i, focus){
    i = Math.max(0, Math.min(items.length - 1, i));
    items.forEach(function(li, n){
      li.classList.toggle('is-active', n === i);
      li.classList.toggle('is-done', n < i);
      buttons[n].setAttribute('aria-expanded', n === i);
    });
    if(focus) buttons[i].focus();
  }

  buttons.forEach(function(btn, n){
    btn.addEventListener('click', function(){ activate(n); });
  });
  steps.querySelectorAll('[data-step-next]').forEach(function(btn){
    btn.addEventListener('click', function(){
      activate(items.indexOf(btn.closest('.step')) + 1, true);
    });
  });
  steps.addEventListener('keydown', function(e){
    var n = buttons.indexOf(document.activeElement);
    if(n < 0) return;
    var to = {ArrowRight:n+1, ArrowDown:n+1, ArrowLeft:n-1, ArrowUp:n-1, Home:0, End:items.length-1}[e.key];
    if(to === undefined) return;
    e.preventDefault();
    activate(to, true);
  });

  steps.classList.add('is-interactive');
  activate(0);

  // Staggered entrance once the list scrolls into view
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting){ steps.classList.add('in-view'); io.disconnect(); }
    }, {threshold: 0.2});
    io.observe(steps);
  } else {
    steps.classList.add('in-view');
  }
})();

// Gallery: staggered entrance and a lightbox (tiles are plain links to the photos without JS)
(function(){
  var grid = document.querySelector('[data-gallery]');
  var box = document.querySelector('.lightbox');
  if(!grid || !box || typeof box.showModal !== 'function') return;
  var links = [].slice.call(grid.querySelectorAll('.tile-link'));
  var img = box.querySelector('.lb-img');
  var tag = box.querySelector('.lb-tag');
  var title = box.querySelector('.lb-title');
  var count = box.querySelector('.lb-count');
  var current = 0;

  function show(i){
    current = (i + links.length) % links.length;
    var a = links[current];
    var thumb = a.querySelector('img');
    img.classList.add('is-loading');
    img.onload = function(){ img.classList.remove('is-loading'); };
    img.src = a.getAttribute('href');
    img.alt = thumb.alt;
    if(img.complete) img.classList.remove('is-loading');
    tag.textContent = a.querySelector('.tile-tag').textContent;
    title.textContent = a.querySelector('.tile-title').textContent;
    count.textContent = (current + 1) + ' / ' + links.length;
    // Warm the cache for the neighbours so arrowing through feels instant
    [current - 1, current + 1].forEach(function(n){
      new Image().src = links[(n + links.length) % links.length].getAttribute('href');
    });
  }

  links.forEach(function(a, n){
    a.addEventListener('click', function(e){
      e.preventDefault();
      show(n);
      box.showModal();
    });
  });
  box.querySelector('.lb-prev').addEventListener('click', function(){ show(current - 1); });
  box.querySelector('.lb-next').addEventListener('click', function(){ show(current + 1); });
  box.querySelector('.lb-close').addEventListener('click', function(){ box.close(); });
  box.addEventListener('close', function(){ links[current].focus(); });
  // Clicking the dark area around the photo closes the viewer
  box.addEventListener('click', function(e){ if(e.target === box) box.close(); });
  box.addEventListener('keydown', function(e){
    if(e.key === 'ArrowLeft'){ e.preventDefault(); show(current - 1); }
    if(e.key === 'ArrowRight'){ e.preventDefault(); show(current + 1); }
  });

  // Swipe left/right on touch screens
  var startX = null;
  box.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; }, {passive: true});
  box.addEventListener('touchend', function(e){
    if(startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  if('IntersectionObserver' in window){
    grid.classList.add('is-enhanced');
    var io = new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting){ grid.classList.add('in-view'); io.disconnect(); }
    }, {threshold: 0.1});
    io.observe(grid);
  }
})();
