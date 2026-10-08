(function () {
  "use strict";
  document.querySelectorAll("[data-resume-download]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var href = btn.getAttribute("href");
      if (href && href !== "#") return;
      e.preventDefault();
      var kind = btn.getAttribute("data-resume-download").toUpperCase();
      var original = btn.textContent;
      btn.textContent = "Not yet available";
      btn.setAttribute("disabled", "disabled");
      setTimeout(function () {
        btn.textContent = original;
        btn.removeAttribute("disabled");
      }, 1800);
      console.info("[resume] No " + kind + " file linked yet.");
    });
  });
})();
