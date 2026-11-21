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


// Booking form validation
const form = document.getElementById("booking-form");
if (form) {
    const status = form.querySelector(".booking-form__status");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll("input[required]").forEach((input) => {
            const ok = input.value.trim() !== "" && input.checkValidity();
            input.closest(".field").classList.toggle("has-error", !ok);
            if (!ok) valid = false;
        });
        if (!valid) {
            status.textContent = "Please check the highlighted fields.";
            return;
        }
        // TODO: send form data to your backend or form service here
        status.textContent = "Thank you. We will contact you shortly.";
        form.reset();
    });
}