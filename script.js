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
            const feedbackBox = document.getElementById('feedbackBox'); // Rückmeldungsbox

            // Setze die Rückmeldung auf "Wird gesendet..."
            feedbackBox.textContent = localStorage.getItem('language') === 'en' ? 'Sending...' : 'Wird gesendet...';

            // Sende die Daten asynchron mit fetch
            fetch('send_mail.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(data => {
                    console.log('Serverantwort:', data);

                    // Setze den Text in der Rückmeldungsbox basierend auf der Antwort des PHP-Skripts
                    if (data.trim() === 'success') {
                        feedbackBox.textContent = localStorage.getItem('language') === 'en' ? 'Email sent!' : 'E-Mail gesendet!';
                    } else if (data.trim() === 'empty_fields') {
                        feedbackBox.textContent = localStorage.getItem('language') === 'en' ? 'Please fill out all fields.' : 'Bitte alle Felder ausfüllen.';
                    } else {
                        feedbackBox.textContent = localStorage.getItem('language') === 'en' ? 'Error: Email not sent.' : 'Fehler: E-Mail konnte nicht gesendet werden.';
                    }
                })
                .catch(error => {
                    console.error('Fehler beim Senden der Anfrage:', error);
                    feedbackBox.textContent = localStorage.getItem('language') === 'en' ? 'Error: Email not sent.' : 'Fehler: E-Mail konnte nicht gesendet werden.';
                });
        });
    }

    // Verhindere das Neuladen der Seite beim Klicken auf den aktiven Link im Header
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
        const currentPage = window.location.pathname.split("/").pop();
        const linkPage = link.getAttribute('href').split('?')[0];
        if (currentPage === linkPage) {
            // Wenn der Link zur aktuellen Seite führt, das Standardverhalten verhindern
            event.preventDefault();
        }
    });
});


    // Funktion für die Karriere-Timeline (Beruflicher Werdegang & Schulischer Werdegang)
    document.querySelectorAll('.career-button').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 100; // Die Höhe des Abstands in Pixeln
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
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


document.addEventListener('DOMContentLoaded', function () {
    // Dark/Light Mode Toggle
    const themeToggle = document.getElementById('theme-checkbox');

    // Set initial theme based on localStorage
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.checked = true;
    }

    // Event listener for the theme toggle
    themeToggle.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });
});

// Funktion zum Ändern der Bilder im Light/Dark Mode
function toggleImages() {
    const isLightMode = document.body.classList.contains('light-mode');

    // Bilder austauschen
    document.querySelectorAll('img').forEach(img => {
        const originalSrc = img.getAttribute('src');

        if (isLightMode) {
            // Tausche auf die "light-mode"-Bilder um
            if (originalSrc.includes('img/icon-career.png')) {
                img.setAttribute('src', 'img/icon-career2.png');
            } else if (originalSrc.includes('img/icon-person.png')) {
                img.setAttribute('src', 'img/icon-person2.png');
            } else if (originalSrc.includes('icon-education.png')) {
                img.setAttribute('src', 'img/icon-education2.png');
            } else if (originalSrc.includes('img/icon-skills.png')) {
                img.setAttribute('src', 'img/icon-skills2.png');
            } else if (originalSrc.includes('img/icon-contact.png')) {
                img.setAttribute('src', 'img/icon-contact2.png');
            } else if (originalSrc.includes('img/icon-imprint.png')) {
                img.setAttribute('src', 'img/icon-imprint2.png');
            }
        } else {
            // Setze auf die "dark-mode"-Bilder zurück
            if (originalSrc.includes('img/icon-career2.png')) {
                img.setAttribute('src', 'img/icon-career.png');
            } else if (originalSrc.includes('img/icon-person2.png')) {
                img.setAttribute('src', 'img/icon-person.png');
            } else if (originalSrc.includes('img/icon-education2.png')) {
                img.setAttribute('src', 'img/icon-education.png');
            } else if (originalSrc.includes('img/icon-skills2.png')) {
                img.setAttribute('src', 'img/icon-skills.png');
            } else if (originalSrc.includes('img/icon-contact2.png')) {
                img.setAttribute('src', 'img/icon-contact.png');
            } else if (originalSrc.includes('img/icon-imprint2.png')) {
                img.setAttribute('src', 'img/icon-imprint.png');
            }
        }
    });
}

// Event-Listener für den Toggle-Switch
document.getElementById('theme-checkbox').addEventListener('change', () => {
    document.body.classList.toggle('light-mode');
    toggleImages(); // Aktualisiere die Bilder je nach Modus
});

// Initiales Aufrufen der Funktion beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('light-mode')) {
        toggleImages();
    }
});
