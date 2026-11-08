
function showPage(id){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));window.scrollTo({top:0,behavior:'smooth'});}
const initialPage = window.location.hash.slice(1);
if (document.getElementById(initialPage)?.classList.contains('page')) showPage(initialPage);
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.go)));

const brandButton = document.querySelector('.brand');
const brandPeriod = brandButton?.querySelector('span');

if (brandButton && brandPeriod) {
    const jumpBrandPeriod = () => {
        brandPeriod.classList.remove('is-jumping');
        void brandPeriod.offsetWidth;
        brandPeriod.classList.add('is-jumping');
    };

    brandButton.addEventListener('pointerenter', jumpBrandPeriod);
    brandButton.addEventListener('focus', jumpBrandPeriod);
    brandPeriod.addEventListener('animationend', () => {
        brandPeriod.classList.remove('is-jumping');
    });
}

const subjectSelect = document.getElementById('contactSubject');
const subjectOptions = document.getElementById('contactSubjectOptions');

if (subjectSelect && subjectOptions) {
    const subjectSelectWrap = subjectSelect.parentElement;
    const optionButtons = Array.from(subjectSelect.options)
        .filter(option => option.value)
        .map(option => {
            const button = document.createElement('button');
            button.type = 'button';
            button.tabIndex = -1;
            button.textContent = option.textContent.trim();
            button.dataset.value = option.value;
            button.setAttribute('role', 'option');
            button.setAttribute('aria-selected', 'false');
            button.addEventListener('click', () => {
                subjectSelect.value = option.value;
                subjectSelect.dispatchEvent(new Event('change', { bubbles: true }));
                subjectSelectWrap.classList.add('is-dismissed');
            });
            subjectOptions.appendChild(button);
            return button;
        });

    subjectSelectWrap.addEventListener('pointerleave', () => {
        subjectSelectWrap.classList.remove('is-dismissed');
    });

    const syncSubjectOptions = () => {
        optionButtons.forEach(button => {
            button.setAttribute('aria-selected', String(button.dataset.value === subjectSelect.value));
        });
    };

    subjectSelect.addEventListener('change', syncSubjectOptions);
    subjectSelect.form?.addEventListener('reset', () => window.setTimeout(syncSubjectOptions));
    syncSubjectOptions();
}

/* =========================================
   A&O CONTACT FORM - EMAILJS INTEGRATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    const submitButton = document.getElementById("contactSubmit");
    const submitText = document.getElementById("submitText");
    const statusMessage = document.getElementById("contactStatus");

    // EmailJS configuration
    const SERVICE_ID = "service_n4hgaok";
    const TEMPLATE_ID = "template_py9dx3q";
    const PUBLIC_KEY = "82nESNpIWJbS_TXp6";

    // Initialise EmailJS
    if (!window.emailjs) {
        statusMessage.hidden = false;
        statusMessage.className = "contact-status error";
        statusMessage.textContent =
            "Our enquiry service is temporarily unavailable. Please email us directly.";
        return;
    }

    emailjs.init({
        publicKey: PUBLIC_KEY
    });

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        // Collect form information
        const templateParams = {
            name: document.getElementById("contactName").value.trim(),
            email: document.getElementById("contactEmail").value.trim(),
            subject: document.getElementById("contactSubject").value,
            message: document.getElementById("contactMessage").value.trim(),
            time: new Date().toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short"
            })
        };

        // Loading state
        submitButton.disabled = true;
        submitButton.classList.add("loading");
        submitText.textContent = "Sending...";

        statusMessage.hidden = true;

        try {

            // Send enquiry through EmailJS
            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                templateParams
            );

            // Success state
            statusMessage.className = "contact-status success";
            statusMessage.textContent =
                "✓ Enquiry submitted successfully! Thank you for reaching out to A&O. We will get back to you shortly.";

            statusMessage.hidden = false;

            // Clear the form
            contactForm.reset();

        } catch (error) {

            console.error("EmailJS Error:", error);

            // Error state
            statusMessage.className = "contact-status error";
            statusMessage.textContent =
                "We couldn't submit your enquiry. Please try again or contact us directly at contact@oabrief.com.";

            statusMessage.hidden = false;

        } finally {

            // Restore button
            submitButton.disabled = false;
            submitButton.classList.remove("loading");
            submitText.textContent = "Send an Enquiry";

        }

    });

});


/* =====================================
   O&A COOKIE CONSENT FUNCTIONALITY
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const banner = document.getElementById("cookie-consent");

    if (!banner) return;

    const acceptButton = document.getElementById("accept-cookies");
    const rejectButton = document.getElementById("reject-cookies");
    const customiseButton = document.getElementById("customise-cookies");
    const saveButton = document.getElementById("save-cookies");

    const preferences = document.getElementById("cookie-preferences");

    const analytics = document.getElementById("analytics-consent");
    const marketing = document.getElementById("marketing-consent");

    const STORAGE_KEY = "oa_cookie_preferences";

    function closeBanner() {
        banner.hidden = true;
    }

    function savePreferences(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                essential: true,
                analytics: data.analytics,
                marketing: data.marketing,
                savedAt: new Date().toISOString()
            }));

            closeBanner();

        } catch (error) {
            console.warn("Cookie preferences could not be saved.", error);
        }
    }

    // Show banner only if no choice has been recorded.

    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            banner.hidden = false;
        }
    } catch (error) {
        banner.hidden = false;
    }

    // Accept all optional categories.

    acceptButton.addEventListener("click", function () {
        analytics.checked = true;
        marketing.checked = true;

        savePreferences({
            analytics: true,
            marketing: true
        });
    });

    // Reject optional categories.

    rejectButton.addEventListener("click", function () {
        analytics.checked = false;
        marketing.checked = false;

        savePreferences({
            analytics: false,
            marketing: false
        });
    });

    // Open custom preferences.

    customiseButton.addEventListener("click", function () {
        preferences.hidden = !preferences.hidden;

        customiseButton.textContent = preferences.hidden
            ? "Customise Preferences"
            : "Hide Preferences";
    });

    // Save selected preferences.

    saveButton.addEventListener("click", function () {
        savePreferences({
            analytics: analytics.checked,
            marketing: marketing.checked
        });
    });

});

