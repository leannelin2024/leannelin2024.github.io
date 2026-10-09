(function () {
  "use strict";
  document.querySelectorAll("#year").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  var path = window.location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".site-nav a").forEach(function (a) {
    var href = a.getAttribute("href").replace(/\/$/, "") || "/";
    if (href === path) a.classList.add("active");
  });
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;
  var style = document.createElement("style");
  style.textContent = "@keyframes ll-fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.ll-fade-in{opacity:0;animation:ll-fade-in 600ms ease-out forwards}";
  document.head.appendChild(style);
  var targets = [
    document.querySelector(".hero"), document.querySelector(".page-header")
  ].concat(
    Array.prototype.slice.call(document.querySelectorAll(".bio p, .bio h2, .timeline li, .media-card, .contact-form")),
    [document.querySelector(".accent-line")]
  ).filter(Boolean);
  targets.forEach(function (el, i) {
    el.classList.add("ll-fade-in");
    el.style.animationDelay = Math.min(i * 60, 600) + "ms";
  });
})();

/* Mark Media parent as active when on a sub-page */
(function () {
  var path = window.location.pathname.replace(/\/$/, '');
  if (path.startsWith('/media/')) {
    document.querySelectorAll('.nav-dropdown-toggle').forEach(function (a) {
      a.classList.add('active');
    });
  }
})();

/* Toggle Media dropdown on click (touch devices) */
(function () {
  document.querySelectorAll('.nav-dropdown-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var parent = btn.closest('.nav-dropdown');
      if (!parent) return;
      var wasOpen = parent.classList.contains('open');
      document.querySelectorAll('.nav-dropdown.open').forEach(function (el) {
        el.classList.remove('open');
      });
      if (!wasOpen) parent.classList.add('open');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.nav-dropdown.open').forEach(function (el) {
      el.classList.remove('open');
    });
  });
})();
