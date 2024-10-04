document.addEventListener('DOMContentLoaded', function () {
    // Funktion für sanftes Scrollen nach oben
    document.getElementById("backToTop")?.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Funktion zur Aktivierung des aktuellen Links im Header
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href').split('?')[0];
        if (currentPage === linkPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    restoreHeaderScrollPosition();

    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || localStorage.getItem('language') || 'de';
    changeLanguage(lang);

    // Asynchrones Absenden des Kontaktformulars
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Verhindert das Standardformular-Verhalten (Seitenneuladen)
            console.log('Formular-Submit abgefangen');

            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('input[type="submit"]');

            // Setze den Button-Text auf "Wird gesendet..."
            submitButton.value = localStorage.getItem('language') === 'en' ? 'Sending...' : 'Wird gesendet...';

            // Sende die Daten asynchron mit fetch
            fetch('send_mail.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(data => {
                    console.log('Serverantwort:', data);

                    // Setze den Button-Text basierend auf der Antwort des PHP-Skripts
                    if (data.trim() === 'success') {
                        submitButton.value = localStorage.getItem('language') === 'en' ? 'Email sent!' : 'E-Mail gesendet!';
                    } else if (data.trim() === 'empty_fields') {
                        submitButton.value = localStorage.getItem('language') === 'en' ? 'Please fill out all fields.' : 'Bitte alle Felder ausfüllen.';
                    } else {
                        submitButton.value = localStorage.getItem('language') === 'en' ? 'Error: Email not sent.' : 'Fehler: E-Mail konnte nicht gesendet werden.';
                    }
                })
                .catch(error => {
                    console.error('Fehler beim Senden der Anfrage:', error);
                    submitButton.value = localStorage.getItem('language') === 'en' ? 'Error: Email not sent.' : 'Fehler: E-Mail konnte nicht gesendet werden.';
                });
        });
    }
});

// Funktion, um die Header-Scrollposition zu speichern
function saveHeaderScrollPosition() {
    const headerBar = document.querySelector('.header-bar');
    if (headerBar) {
        localStorage.setItem('headerScrollPosition', headerBar.scrollLeft.toString());
    }
}

// Funktion, um die Header-Scrollposition wiederherzustellen
function restoreHeaderScrollPosition() {
    const headerBar = document.querySelector('.header-bar');
    if (headerBar) {
        const scrollPosition = localStorage.getItem('headerScrollPosition');
        if (scrollPosition) {
            headerBar.scrollLeft = parseInt(scrollPosition, 10);
        }
    }
}

// Funktion, um die Sprache zu wechseln
function changeLanguage(language) {
    document.querySelectorAll('[data-en]').forEach(element => {
        if (element.tagName === 'INPUT' && element.type === 'submit') {
            element.value = element.getAttribute(`data-${language}`);
        } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = element.getAttribute(`data-${language}`);
        } else {
            element.textContent = element.getAttribute(`data-${language}`);
        }
    });

    localStorage.setItem('language', language);
    updateLinks(language);

    if (language === 'en') {
        document.querySelector('.header-bar').classList.add('english-header');
    } else {
        document.querySelector('.header-bar').classList.remove('english-header');
    }
}

// Sprachumschalter-Event-Listener
document.getElementById('de-flag')?.addEventListener('click', () => changeLanguage('de'));
document.getElementById('en-flag')?.addEventListener('click', () => changeLanguage('en'));

// Funktion, um die Links im Header zu aktualisieren
function updateLinks(language) {
    document.querySelectorAll('.nav-link').forEach(link => {
        let href = link.getAttribute('href').split('?')[0];
        link.setAttribute('href', `${href}?lang=${language}`);
    });
    document.querySelectorAll('a').forEach(link => {
        let href = link.getAttribute('href').split('?')[0];
        link.setAttribute('href', `${href}?lang=${language}`);
    });
}
