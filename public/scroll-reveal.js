(function() {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.scroll-reveal').forEach(function(el) {
    obs.observe(el);
  });
})();
