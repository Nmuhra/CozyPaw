// Mobile menu
(function(){
  var header = document.getElementById('top');
  var toggle = header.querySelector('.menu-toggle');
  function setOpen(open){
    header.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.textContent = open ? '✕' : '☰';
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
