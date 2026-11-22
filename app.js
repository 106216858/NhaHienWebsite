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

// Experiences: filter buttons + slider (6 cards per slide, arrows to pan)
const expButtons = document.querySelectorAll(".exp-filter__btn");
const expGrid = document.getElementById("exp-grid");
if (expButtons.length && expGrid) {
    const PER_SLIDE = 6;
    const allCards = [...expGrid.querySelectorAll(".exp-card")];
    let index = 0;
    let slides = [];
    let track, prevBtn, nextBtn, controls, pageLabel;

    const goTo = (i) => {
        index = Math.max(0, Math.min(i, slides.length - 1));
        track.style.transform = `translateX(-${index * 100}%)`;
        slides.forEach((slide, n) => {
            slide.inert = n !== index; // keep off-screen links out of the tab order
            slide.setAttribute("aria-hidden", n !== index);
        });
        pageLabel.textContent = `Page ${index + 1} of ${slides.length}`;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === slides.length - 1;
    };

    const render = (cards) => {
        expGrid.className = "exp-slider";
        expGrid.setAttribute("role", "region");
        expGrid.setAttribute("aria-roledescription", "carousel");
        expGrid.setAttribute("aria-label", "Experiences");
        expGrid.innerHTML = "";

        const viewport = document.createElement("div");
        viewport.className = "exp-slider__viewport";
        track = document.createElement("div");
        track.className = "exp-slider__track";
        track.setAttribute("aria-live", "polite");
        viewport.appendChild(track);

        slides = [];
        for (let i = 0; i < cards.length; i += PER_SLIDE) {
            const slide = document.createElement("div");
            slide.className = "exp-slide";
            slide.setAttribute("role", "group");
            slide.setAttribute("aria-roledescription", "slide");
            cards.slice(i, i + PER_SLIDE).forEach((c) => slide.appendChild(c));
            track.appendChild(slide);
            slides.push(slide);
        }
        slides.forEach((s, n) => s.setAttribute("aria-label", `${n + 1} of ${slides.length}`));

        controls = document.createElement("div");
        controls.className = "exp-slider__controls";
        controls.hidden = slides.length < 2;

        prevBtn = document.createElement("button");
        prevBtn.type = "button";
        prevBtn.className = "exp-slider__btn";
        prevBtn.innerHTML = "<span aria-hidden='true'>&larr;</span> Previous";
        prevBtn.addEventListener("click", () => goTo(index - 1));

        nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "exp-slider__btn exp-slider__btn--next";
        nextBtn.innerHTML = "More <span aria-hidden='true'>&rarr;</span>";
        nextBtn.addEventListener("click", () => goTo(index + 1));

        pageLabel = document.createElement("p");
        pageLabel.className = "exp-slider__page";
        pageLabel.setAttribute("aria-live", "polite");

        controls.append(prevBtn, pageLabel, nextBtn);
        expGrid.append(viewport, controls);

        // Swipe on touch screens
        let startX = null;
        viewport.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
        viewport.addEventListener("touchend", (e) => {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            startX = null;
            if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
        });

        goTo(0);
    };

    expGrid.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") goTo(index + 1);
        if (e.key === "ArrowLeft") goTo(index - 1);
    });

    const setFilter = (name) => {
        const target = [...expButtons].find((b) => b.dataset.filter === name) || expButtons[0];
        expButtons.forEach((b) => {
            const on = b === target;
            b.classList.toggle("is-active", on);
            b.setAttribute("aria-pressed", on);
        });
        const matching = allCards.filter(
            (card) => target.dataset.filter === "all" || card.dataset.category === target.dataset.filter
        );
        render(matching);
        const empty = document.getElementById("exp-empty");
        if (empty) empty.hidden = matching.length > 0;
    };

    expButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            setFilter(btn.dataset.filter);
            history.replaceState(null, "", btn.dataset.filter === "all" ? location.pathname : "#" + btn.dataset.filter);
        });
    });

    // Select the right button when arriving from a homepage tile (experience.html#arts)
    const fromHash = () => {
        const name = location.hash.slice(1);
        // Ignore unrelated anchors such as #contact so the slider does not reset
        if (name && ![...expButtons].some((b) => b.dataset.filter === name)) return;
        setFilter(name);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
}