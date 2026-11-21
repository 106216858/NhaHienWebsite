// Reveal elements when they scroll into view
const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.05, rootMargin: "0px 0px -12% 0px" }
);
revealItems.forEach((el) => revealObserver.observe(el));

// Header shadow after scrolling
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });


// Footer email form
const footerForm = document.getElementById("footer-form");
if (footerForm) {
    const footerStatus = document.querySelector(".footer-form__status");
    footerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = footerForm.querySelector("input[type='email']");
        if (!input.value.trim() || !input.checkValidity()) {
            footerStatus.textContent = "Please enter a valid email address.";
            return;
        }
        // TODO: send the email to your backend or form service here
        footerStatus.textContent = "Thank you. We will be in touch.";
        footerForm.reset();
    });
}

// Experiences filter buttons (one active at a time, deep-linkable via #hash)
const expButtons = document.querySelectorAll(".exp-filter__btn");
if (expButtons.length) {
    const setFilter = (name) => {
        const target = [...expButtons].find((b) => b.dataset.filter === name) || expButtons[0];
        expButtons.forEach((b) => {
            const on = b === target;
            b.classList.toggle("is-active", on);
            b.setAttribute("aria-pressed", on);
        });
        // Show only the cards in the chosen category
        const cards = document.querySelectorAll(".exp-card");
        let visible = 0;
        cards.forEach((card) => {
            const show = target.dataset.filter === "all" || card.dataset.category === target.dataset.filter;
            card.hidden = !show;
            if (show) visible++;
        });
        const empty = document.getElementById("exp-empty");
        if (empty) empty.hidden = visible > 0;
    };

    expButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            setFilter(btn.dataset.filter);
            history.replaceState(null, "", btn.dataset.filter === "all" ? location.pathname : "#" + btn.dataset.filter);
        });
    });

    // Select the right button when arriving from a homepage tile (experience.html#arts)
    const fromHash = () => setFilter(location.hash.slice(1));
    fromHash();
    window.addEventListener("hashchange", fromHash);
}
