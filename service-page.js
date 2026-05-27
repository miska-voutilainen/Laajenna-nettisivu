/* ================================================================
   LAAJENNA — Service Detail Page JS
   Project accordion toggle
   ================================================================ */

"use strict";

(function initProjectAccordion() {
  const items = document.querySelectorAll(".svc-project-item");
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector(".svc-project-top");
    const body = item.querySelector(".svc-project-body");
    if (!btn || !body) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      items.forEach((i) => {
        i.classList.remove("open");
        const b = i.querySelector(".svc-project-top");
        const p = i.querySelector(".svc-project-body");
        if (b) b.setAttribute("aria-expanded", "false");
        if (p) p.setAttribute("aria-hidden", "true");
      });

      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        body.setAttribute("aria-hidden", "false");
      }
    });
  });
})();
