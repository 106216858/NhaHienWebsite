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