// Partner page: category filter + name search.
(() => {
    const results = document.getElementById("partner-results");
    if (!results) return;
    const cards = [...results.querySelectorAll(".partner-card")];
    const buttons = [...document.querySelectorAll(".partner-filter__btn")];
    const search = document.getElementById("partner-search");
    const empty = document.getElementById("partner-empty");
    let filter = "all";

    const apply = () => {
        const q = (search ? search.value : "").trim().toLowerCase();
        let shown = 0;
        cards.forEach((card) => {
            const matchCat = filter === "all" || card.dataset.category === filter;
            const matchName = !q || card.dataset.name.includes(q);
            const show = matchCat && matchName;
            card.hidden = !show;
            if (show) shown++;
        });
        if (empty) empty.hidden = shown > 0;
    };

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filter = btn.dataset.filter;
            buttons.forEach((b) => {
                const on = b === btn;
                b.classList.toggle("is-active", on);
                b.setAttribute("aria-pressed", on);
            });
            apply();
        });
    });

    if (search) search.addEventListener("input", apply);
    apply();
})();