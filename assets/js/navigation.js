(() => {
  const menu = document.getElementById("menu");
  if (menu) {
    const savedPosition = localStorage.getItem("menu-scroll-position");
    if (savedPosition) menu.scrollLeft = Number.parseInt(savedPosition, 10);
    menu.addEventListener("scroll", () => {
      localStorage.setItem("menu-scroll-position", String(menu.scrollLeft));
    }, { passive: true });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href").slice(1);
      const target = document.getElementById(decodeURIComponent(id));
      if (!target) return;

      event.preventDefault();
      if (anchor.classList.contains("nf-skip-link")) {
        target.focus({ preventScroll: true });
      }
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });

      if (id === "top") {
        history.replaceState(null, "", `${location.pathname}${location.search}`);
      } else {
        history.pushState(null, "", `#${id}`);
      }
    });
  });

  const topLink = document.getElementById("top-link");
  if (topLink) {
    const updateTopLink = () => {
      topLink.classList.toggle("hidden", window.scrollY <= window.innerHeight);
    };
    window.addEventListener("scroll", updateTopLink, { passive: true });
    updateTopLink();
  }
})();
