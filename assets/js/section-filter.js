(() => {
  document.querySelectorAll("[data-nf-section-filters]").forEach((form) => {
    const scope = form.closest(".nf-list");
    const entries = Array.from(scope?.querySelectorAll("[data-nf-filter-entry]") || []);
    const selects = Array.from(form.querySelectorAll("[data-nf-filter-field]"));
    const status = form.querySelector(".nf-section-filters__status");
    if (!scope || entries.length === 0 || selects.length === 0) return;

    const update = () => {
      const active = selects
        .filter((select) => select.value)
        .map((select) => ({ field: select.dataset.nfFilterField, value: select.value }));

      let visible = 0;
      entries.forEach((entry) => {
        const matches = active.every(({ field, value }) => {
          const values = (entry.getAttribute(`data-nf-filter-${field}`) || "").split("|");
          return values.includes(value);
        });
        entry.hidden = !matches;
        if (matches) visible += 1;
      });

      if (status) {
        const label = visible === 1
          ? (form.dataset.labelOne || "item")
          : (form.dataset.labelMany || "items");
        status.textContent = `${visible} ${label}`;
      }
    };

    form.hidden = false;
    form.addEventListener("change", update);
    form.addEventListener("reset", () => requestAnimationFrame(update));
    update();
  });
})();
