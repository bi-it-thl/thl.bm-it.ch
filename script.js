// Funktion für sanftes Scrollen nach oben
document.getElementById("backToTop").addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Sanftes Scrollen nach oben
    });
});

// Funktion zur Aktivierung des aktuellen Links im Header
document.addEventListener("DOMContentLoaded", function() {
    const currentPage = window.location.pathname.split("/").pop(); // Holt die aktuelle Datei (z.B. index.html)

    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href').split('?')[0]; // Entferne vorhandene Query-Parameter

        if (currentPage === linkPage) {
            link.classList.add('active'); // Färbt den aktuellen Link schwarz
        } else {
            link.classList.remove('active'); // Entfernt die aktive Klasse von den anderen
        }
    });
});

// Funktion, um die "out"-Klasse hinzuzufügen und Seite zu wechseln
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (e) {
        const targetUrl = this.getAttribute('href').split('?')[0]; // Ziel-URL holen (ohne Query-Parameter)
        const currentPage = window.location.pathname.split("/").pop(); // Aktuelle Seite ermitteln

        // Überprüfen, ob der geklickte Link zur aktuellen Seite führt
        if (currentPage === targetUrl) {
            // Überprüfen, ob es sich um einen Sprachwechsel handelt
            const urlParams = new URLSearchParams(window.location.search);
            const langParam = urlParams.get('lang');
            const targetLang = this.getAttribute('href').includes('lang=en') ? 'en' : 'de';

            // Wenn der Sprachwechsel durchgeführt wird, keine Animation
            if (langParam !== targetLang) {
                e.preventDefault();
                changeLanguage(targetLang);
                return;
            }

            // Wenn es kein Sprachwechsel ist, nichts tun
            e.preventDefault();
            return;
        }

        // Andernfalls Animation abspielen und Seite wechseln
        e.preventDefault();
        document.querySelector('.page').classList.add('out'); // Füge die "out"-Klasse hinzu

        // Wechsel nach der Animation
        setTimeout(() => {
            window.location.href = this.getAttribute('href');
        }, 500); // Die Zeit sollte zur Animationsdauer passen
    });
});


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

// Funktion, um die Sprache zu wechseln
function changeLanguage(language) {
    document.querySelectorAll('[data-en]').forEach(element => {
        if (element.tagName === 'INPUT' && element.type === 'submit') {
            // Für das Submit-Button-Value-Attribut
            element.value = element.getAttribute(`data-${language}`);
        } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            // Für die Placeholder-Attribute der Eingabefelder
            element.placeholder = element.getAttribute(`data-${language}`);
        } else {
            // Für andere Elemente
            element.textContent = element.getAttribute(`data-${language}`);
        }
    });

    // Fügt die englische Header-Klasse hinzu oder entfernt sie
    if (language === 'en') {
        document.querySelector('.header-bar').classList.add('english-header'); // Klasse für Englisch hinzufügen
    } else {
        document.querySelector('.header-bar').classList.remove('english-header'); // Klasse für Deutsch entfernen
    }

    // Speichere die Sprache in localStorage
    localStorage.setItem('language', language);

    // Aktualisiere alle Links auf der Seite
    updateLinks(language);
}

// Funktion, um die Links im Header und die Icons basierend auf der Sprache zu aktualisieren
function updateLinks(language) {
    // Aktualisiere Links im Header
    document.querySelectorAll('.nav-link').forEach(link => {
        let href = link.getAttribute('href').split('?')[0]; // Entferne vorhandene Query-Parameter
        link.setAttribute('href', `${href}?lang=${language}`);
    });

    // Aktualisiere die Icons im Hauptbereich
    document.querySelectorAll('a').forEach(link => {
        let href = link.getAttribute('href').split('?')[0]; // Entferne vorhandene Query-Parameter
        link.setAttribute('href', `${href}?lang=${language}`);
    });
}

// Sprachumschalter-Event-Listener
document.getElementById('de-flag').addEventListener('click', () => changeLanguage('de'));
document.getElementById('en-flag').addEventListener('click', () => changeLanguage('en'));

// Setze die Sprache beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || localStorage.getItem('language') || 'de'; // Standard auf Deutsch setzen
    changeLanguage(lang);
});
