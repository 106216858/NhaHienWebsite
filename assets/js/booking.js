// Enquiry form: input safeguards and normalisation.
// This runs in the browser only. Repeat the same checks on the server that receives the form.
(() => {
    const form = document.getElementById("booking-form");
    if (!form) return;

    const MIN_FILL_MS = 3000;      // submissions faster than this are treated as bots
    const COOLDOWN_MS = 30000;     // wait between submissions from the same browser
    const COOLDOWN_KEY = "nh-enquiry-last";
    const loadedAt = Date.now();

    const $ = (id) => document.getElementById(id);
    const fields = {
        fullname: $("fullname"),
        phone: $("phone"),
        email: $("email"),
        activity: $("activity"),
        option: $("option"),
        message: $("message"),
        consent: $("consent"),
    };
    const honeypot = $("website");
    const submitBtn = form.querySelector(".booking-form__submit");
    const status = $("booking-status");

    // ---------- cleaning helpers ----------
    // control characters and zero-width characters
    const HIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200D\u2060\uFEFF]/g;

    const cleanLine = (s) =>
        String(s ?? "").normalize("NFC").replace(HIDDEN, " ").replace(/\s+/g, " ").trim();

    const cleanText = (s) =>
        String(s ?? "")
            .normalize("NFC")
            .replace(/\r\n?/g, "\n")
            .replace(HIDDEN, " ")
            .split("\n")
            .map((line) => line.replace(/[ \t]+/g, " ").trim())
            .join("\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

    // Capitalise names typed all lower case or all upper case; leave mixed case alone (McDonald, Nguyễn)
    const tidyName = (s) => {
        const v = cleanLine(s);
        const hasLower = v !== v.toLocaleUpperCase();
        const hasUpper = v !== v.toLocaleLowerCase();
        if (hasLower && hasUpper) return v;
        return v
            .toLocaleLowerCase("vi")
            .replace(/(^|[\s'\-])(\p{L})/gu, (_, sep, ch) => sep + ch.toLocaleUpperCase("vi"));
    };

    const tidyPhone = (s) => {
        let v = cleanLine(s).replace(/[\s.\-()]/g, "");
        if (v.startsWith("00")) v = "+" + v.slice(2);
        return v;
    };

    const tidyEmail = (s) => cleanLine(s).replace(/\s/g, "").toLowerCase();

    // ---------- validators: return an error message, or "" when fine ----------
    const optionValues = (select) => [...select.options].map((o) => o.value || o.textContent.trim());

    const validators = {
        fullname(v) {
            if (!v) return "Please enter your full name.";
            if (v.length < 2) return "Your name is too short.";
            if (v.length > 80) return "Please keep your name under 80 characters.";
            if (!/^[\p{L}\p{M}][\p{L}\p{M}\s'.\-]*$/u.test(v)) return "Please use letters only in your name.";
            return "";
        },
        phone(v) {
            if (!v) return "Please enter your phone number.";
            if (!/^\+?\d+$/.test(v)) return "Please use numbers only, for example 0912 345 678.";
            const digits = v.replace(/\D/g, "");
            if (digits.length < 9 || digits.length > 15) return "The phone number is the wrong length.";
            return "";
        },
        email(v) {
            if (!v) return "Please enter your email address.";
            if (v.length > 120) return "That email address is too long.";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || v.includes("..")) {
                return "Please enter a valid email, for example name@example.com.";
            }
            return "";
        },
        activity(v) {
            if (!v) return "Please choose an activity.";
            if (!optionValues(fields.activity).includes(v)) return "Please choose an activity from the list.";
            return "";
        },
        option(v) {
            if (v && !optionValues(fields.option).includes(v)) return "Please choose an option from the list.";
            return "";
        },
        message(v) {
            if (v.length > 1000) return "Please keep your message under 1000 characters.";
            return "";
        },
        consent(checked) {
            return checked ? "" : "Please tick the box so we can contact you.";
        },
    };

    const normalisers = {
        fullname: tidyName,
        phone: tidyPhone,
        email: tidyEmail,
        activity: (v) => String(v ?? "").trim(),
        option: (v) => String(v ?? "").trim(),
        message: cleanText,
    };

    // ---------- error display ----------
    const setError = (name, message) => {
        const field = fields[name];
        const box = $(name + "-error");
        if (!field || !box) return;
        box.textContent = message;
        box.hidden = !message;
        if (message) field.setAttribute("aria-invalid", "true");
        else field.removeAttribute("aria-invalid");
    };

    const checkField = (name, writeBack) => {
        const field = fields[name];
        if (name === "consent") {
            const msg = validators.consent(field.checked);
            setError(name, msg);
            return { msg, value: field.checked };
        }
        const value = normalisers[name](field.value);
        if (writeBack && field.value !== value) field.value = value;
        const msg = validators[name](value);
        setError(name, msg);
        return { msg, value };
    };

    // Tidy a field when the person leaves it. Errors are only shown on submit, so the
    // layout does not jump under someone who is still filling in the form.
    Object.keys(fields).forEach((name) => {
        const field = fields[name];
        const isChoice = field.tagName === "SELECT" || field.type === "checkbox";
        if (!isChoice) {
            field.addEventListener("blur", () => {
                if (field.value.trim() !== "") field.value = normalisers[name](field.value);
            });
        }
        field.addEventListener(isChoice ? "change" : "input", () => {
            if (field.getAttribute("aria-invalid")) setError(name, "");
        });
    });

    // ---------- status line ----------
    const say = (text) => {
        status.textContent = text;
    };

    const THANKS_TEXT = "Thank you. We have received your enquiry and will be in touch soon.";

    // ---------- sending (replace the body of this function with your real endpoint) ----------
    const send = async (data) => {
        // Example:
        // const res = await fetch("https://your-form-service/endpoint", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(data),
        // });
        // if (!res.ok) throw new Error("Request failed");
        void data;
    };

    // ---------- submit ----------
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        say("");

        // honeypot: real visitors never see or fill this field
        if (honeypot && honeypot.value.trim() !== "") {
            say(THANKS_TEXT);
            form.reset();
            return;
        }

        const last = Number(sessionStorage.getItem(COOLDOWN_KEY) || 0);
        if (last && Date.now() - last < COOLDOWN_MS) {
            say("Your enquiry was just sent. Please wait a moment before sending another.");
            return;
        }

        const data = {};
        let firstBad = null;
        for (const name of Object.keys(fields)) {
            const { msg, value } = checkField(name, true);
            data[name] = value;
            if (msg && !firstBad) firstBad = fields[name];
        }
        if (firstBad) {
            say("Please check the highlighted fields.");
            firstBad.focus();
            return;
        }

        if (Date.now() - loadedAt < MIN_FILL_MS) {
            say("Please check your details, then press Submit again.");
            return;
        }

        submitBtn.disabled = true;
        say("Sending...");
        try {
            await send(data);
            try { sessionStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch (_) { /* storage blocked */ }
            say(THANKS_TEXT);
            form.reset();
            Object.keys(fields).forEach((n) => setError(n, ""));
        } catch (_) {
            say("Sorry, something went wrong and your enquiry was not sent. Please try again.");
        } finally {
            submitBtn.disabled = false;
        }
    });
})();