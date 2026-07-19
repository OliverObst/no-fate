(() => {
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  const root = document.documentElement;
  const updateState = () => {
    button.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
  };

  button.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = theme;
    localStorage.setItem("pref-theme", theme);
    updateState();
    window.dispatchEvent(new CustomEvent("nf-theme-change", { detail: { theme } }));
  });

  updateState();
})();
