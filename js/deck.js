(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prev = document.querySelector("[data-prev]");
  const next = document.querySelector("[data-next]");

  if (!slides.length || !prev || !next) return;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  slides.forEach(function (slide, i) {
    slide.querySelectorAll("[data-num]").forEach(function (el) {
      el.textContent = pad(i + 1);
    });
  });

  let current = 0;

  function show(index, focusSlide) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach(function (slide, i) {
      const active = i === current;
      slide.classList.toggle("is-active", active);
      if (active) {
        slide.removeAttribute("hidden");
        slide.scrollTop = 0;
      } else {
        slide.setAttribute("hidden", "");
      }
    });
    prev.hidden = current === 0;
    next.hidden = current === slides.length - 1;
    if (!focusSlide) return;
    const heading = slides[current].querySelector("h1, h2");
    if (!heading) return;
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  document.addEventListener("click", function (event) {
    const link = event.target.closest("[data-goto]");
    if (!link) return;
    const index = slides.findIndex(function (slide) {
      return slide.id === link.getAttribute("data-goto");
    });
    if (index === -1) return;
    event.preventDefault();
    show(index, true);
  });

  prev.addEventListener("click", function () {
    show(current - 1);
  });

  next.addEventListener("click", function () {
    show(current + 1);
  });

  window.addEventListener("keydown", function (event) {
    const blocked = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "PageDown", "PageUp", "Home", "End", " "];
    if (blocked.indexOf(event.key) === -1) return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (event.key === " " && (tag === "BUTTON" || tag === "A")) return;
    event.preventDefault();
  });

  window.addEventListener("wheel", function (event) {
    const slide = slides[current];
    const inside = slide.contains(event.target);
    const canScroll = slide.scrollHeight > slide.clientHeight + 1;
    if (!inside || !canScroll) event.preventDefault();
  }, { passive: false });

  show(0);
})();
