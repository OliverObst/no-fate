(() => {
  document.querySelectorAll("[data-nf-gallery]").forEach((gallery) => {
    const links = Array.from(gallery.querySelectorAll("a[href]"));
    if (links.length < 2) return;

    gallery.classList.add("is-enhanced");
    gallery.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const current = links.indexOf(document.activeElement);
      if (current === -1) return;

      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      links[(current + direction + links.length) % links.length].focus();
    });
  });
})();
