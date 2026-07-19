(() => {
  const collator = new Intl.Collator(document.documentElement.lang || undefined, {
    numeric: true,
    sensitivity: "base"
  });

  document.querySelectorAll("table[data-nf-sortable]").forEach((table) => {
    const body = table.tBodies[0];
    const headers = Array.from(table.tHead?.rows[0]?.cells || []);
    if (!body || headers.length === 0) return;

    table.classList.add("is-sortable");
    headers.forEach((header, column) => {
      const label = header.textContent.trim();
      const button = document.createElement("button");
      const sortLabel = table.dataset.nfSortLabel || "Sort by";
      button.type = "button";
      button.className = "nf-table-sort";
      button.textContent = label;
      button.setAttribute("aria-label", `${sortLabel} ${label}`);
      header.replaceChildren(button);

      button.addEventListener("click", () => {
        const direction = header.getAttribute("aria-sort") === "ascending"
          ? "descending"
          : "ascending";

        headers.forEach((candidate) => candidate.removeAttribute("aria-sort"));
        header.setAttribute("aria-sort", direction);

        const rows = Array.from(body.rows).map((row, position) => ({ row, position }));
        rows.sort((left, right) => {
          const a = left.row.cells[column]?.textContent.trim() || "";
          const b = right.row.cells[column]?.textContent.trim() || "";
          const comparison = collator.compare(a, b) || left.position - right.position;
          return direction === "ascending" ? comparison : -comparison;
        });
        rows.forEach(({ row }) => body.append(row));
      });
    });
  });
})();
