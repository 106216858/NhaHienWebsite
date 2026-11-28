// Membership detail page: renders the selected plan and switches tabs in place.
(() => {
    const card = document.getElementById("md-card");
    if (!card) return;

    const price = (n) => "VND " + n.toLocaleString("en-US");
    const common = [
        "Transportation available at an additional charge.",
        "Extra Care is an optional service with separate registration and fees."
    ];

    const plans = {
        "single-session": {
            tag: "À la carte",
            name: "Single Session",
            intro: "An invitation to experience the Nhã Hiên lifestyle, one memorable session at a time.",
            price: price(1300000),
            duration: "One experience",
            allocation: "1 session",
            privileges: [
                "One curated workshop or activity",
                "Access to the designated experience space",
                "Complimentary refreshments",
                "Guidance from an experienced facilitator",
                "No membership commitment"
            ],
            details: [
                "Duration: One experience. Allocation: 1 session. All experiences require advance reservation and are subject to availability.",
                ...common
            ]
        },
        bamboo: {
            tag: "Essential",
            name: "Bamboo",
            intro: "A graceful introduction to a more enriching lifestyle.",
            price: price(13500000),
            duration: "1 month",
            allocation: "12 sessions",
            sectionBg: "img/membership/bamboo.jpeg",
            privileges: [
                "12 curated experiences",
                "Flexible scheduling across available sessions",
                "Standard booking access",
                "Complimentary refreshments",
                "Scheduled transportation within designated service areas"
            ],
            details: [
                "Duration: 1 month. Allocation: 12 sessions. All experiences require advance reservation and are subject to availability.",
                "Scheduled transportation included within designated service areas.",
                "Extra Care is an optional service with separate registration and fees."
            ]
        },
        "wisteria-3": {
            tag: "Preferred",
            name: "Wisteria",
            intro: "For those who wish to make meaningful experiences part of everyday life.",
            price: price(40500000),
            duration: "3 months",
            allocation: "36 sessions",
            sectionBg: "img/membership/wisteria.jpeg",
            privileges: [
                "36 curated experiences",
                "Enhanced booking priority",
                "Flexible transfers between weekly schedule groups, subject to availability",
                "Complimentary refreshments",
                "Scheduled transportation within designated service areas"
            ],
            details: [
                "Duration: 3 months. Allocation: 36 sessions. All experiences require advance reservation and are subject to availability.",
                "Scheduled transportation included within designated service areas.",
                "Extra Care is an optional service with separate registration and fees."
            ]
        },
        "wisteria-6": {
            tag: "Preferred",
            name: "Wisteria",
            intro: "A six month journey for those who want a steady, personal rhythm.",
            price: price(81000000),
            duration: "6 months",
            allocation: "24 sessions",
            sectionBg: "img/membership/wisteria.jpeg",
            privileges: [
                "Curated workshops and activities across all categories",
                "Access to the designated experience space",
                "Complimentary refreshments",
                "Guidance from an experienced facilitator",
                "Invitations to member gatherings"
            ],
            details: [
                "Duration: 6 months. Allocation to be confirmed. All experiences require advance reservation and are subject to availability.",
                ...common
            ]
        },
        bonsai: {
            tag: "Signature",
            name: "Bonsai",
            intro: "A year of unhurried growth, with a personalised programme.",
            price: price(162000000),
            duration: "12 months",
            allocation: "144 session credits",
            sectionBg: "img/membership/bonsai.jpeg",
            sectionPosition: "center 18%",
            privileges: [
                "Personalised programme of experiences",
                "Access to the designated experience space",
                "Complimentary refreshments",
                "Dedicated facilitator guidance",
                "Priority reservation and member events"
            ],
            details: [
                "Duration: 12 months. Allocation to be confirmed. All experiences require advance reservation and are subject to availability.",
                ...common
            ]
        },
        lotus: {
            tag: "Premier",
            name: "Lotus",
            intro: "Our most attentive membership, with a fully tailored experience.",
            price: price(162000000),
            duration: "12 months",
            allocation: "144 sessions",
            sectionBg: "img/membership/lotus.jpeg",
            eligibility: "Reserved for the Top 20 eligible members who renew at least six months before their current membership expires. Renewal is subject to confirmation and availability.",
            details: [
                "144 sessions",
                "Premier Circle membership recognition",
                "Highest membership booking priority",
                "Early renewal qualification",
                "Scheduled transportation included"
            ]
        }
    };

    const key = new URLSearchParams(location.search).get("plan");
    const planKey = Object.prototype.hasOwnProperty.call(plans, key) ? key : "single-session";
    const plan = plans[planKey];

    const text = (id, value) => { document.getElementById(id).textContent = value; };
    const fillList = (id, items) => {
        const ul = document.getElementById(id);
        ul.textContent = "";
        items.forEach((t) => {
            const li = document.createElement("li");
            li.textContent = t;
            ul.appendChild(li);
        });
    };

    text("md-tag", plan.tag);
    text("md-name", plan.name);
    text("md-intro", plan.intro);
    text("md-price", plan.price);
    text("md-duration", plan.duration);
    text("md-allocation", plan.allocation);
    const eligibility = document.getElementById("md-eligibility");
    const privileges = document.getElementById("md-privileges");
    const firstTab = card.querySelector(".md-tab");
    if (plan.eligibility) {
        eligibility.textContent = plan.eligibility;
        eligibility.hidden = false;
        privileges.hidden = true;
        firstTab.textContent = "Eligibility";
    } else {
        eligibility.hidden = true;
        privileges.hidden = false;
        fillList("md-privileges", plan.privileges);
        firstTab.textContent = "Privileges";
    }
    fillList("md-details", plan.details);
    const section = card.closest(".md");
    if (plan.sectionBg) {
        const sectionBg = new URL(plan.sectionBg, document.baseURI).href;
        section.style.setProperty("--md-section-bg", 'url("' + sectionBg + '")');
    }
    if (plan.sectionPosition) section.style.setProperty("--md-section-position", plan.sectionPosition);
    if (plan.sectionOverlay) section.style.setProperty("--md-section-overlay", plan.sectionOverlay);
    document.title = plan.name + " | Membership | Nhã Hiên";

    // Enquiry link keeps the plan name
    document.getElementById("md-cta").href =
        "booking.html?option=" + encodeURIComponent(planKey);

    // Tabs: change colour and swap the box in the same frame
    const tabs = [...card.querySelectorAll(".md-tab")];
    const show = (tab) => {
        tabs.forEach((t) => {
            const on = t === tab;
            t.classList.toggle("is-active", on);
            t.setAttribute("aria-selected", String(on));
            t.tabIndex = on ? 0 : -1;
            document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
        });
    };

    tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => show(tab));
        tab.addEventListener("keydown", (e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
            show(next);
            next.focus();
        });
    });
})();