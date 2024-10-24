document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll to top functionality
    document.getElementById("backToTop")?.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Highlight the current active link in the header
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

    // Set language from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || localStorage.getItem('language') || 'de';
    changeLanguage(lang);

    // Handle form submission asynchronously
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission behavior
            console.log('Form submission intercepted');

            const formData = new FormData(contactForm);
            const feedbackBox = document.getElementById('feedbackBox'); // Feedback box

            // Set feedback message while sending
            feedbackBox.textContent = localStorage.getItem('language') === 'en' ? 'Sending...' : 'Wird gesendet...';

            // Send form data using fetch
            fetch('send_mail.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(data => {
                    console.log('Server response:', data);

                    // Update feedback based on server response
                    if (data.trim() === 'success') {
                        feedbackBox.textContent = localStorage.getItem('language') === 'en' ? 'Email sent!' : 'E-Mail gesendet!';
                    } else if (data.trim() === 'empty_fields') {
                        feedbackBox.textContent = localStorage.getItem('language') === 'en' ? 'Please fill out all fields.' : 'Bitte alle Felder ausfüllen.';
                    } else {
                        feedbackBox.textContent = localStorage.getItem('language') === 'en' ? 'Error: Email not sent.' : 'Fehler: E-Mail konnte nicht gesendet werden.';
                    }
                })
                .catch(error => {
                    console.error('Error sending request:', error);
                    feedbackBox.textContent = localStorage.getItem('language') === 'en' ? 'Error: Email not sent.' : 'Fehler: E-Mail konnte nicht gesendet werden.';
                });
        });
    }

    // Prevent reloading the page when clicking on the active link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            const currentPage = window.location.pathname.split("/").pop();
            const linkPage = link.getAttribute('href').split('?')[0];
            if (currentPage === linkPage) {
                event.preventDefault(); // Prevent default behavior if it's the current page
            }
        });
    });

    // Smooth scroll functionality for career timeline sections
    document.querySelectorAll('.career-button').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 100; // Offset for the header
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

// Save header scroll position
function saveHeaderScrollPosition() {
    const headerBar = document.querySelector('.header-bar');
    if (headerBar) {
        localStorage.setItem('headerScrollPosition', headerBar.scrollLeft.toString());
    }
}

// Restore header scroll position
function restoreHeaderScrollPosition() {
    const headerBar = document.querySelector('.header-bar');
    if (headerBar) {
        const scrollPosition = localStorage.getItem('headerScrollPosition');
        if (scrollPosition) {
            headerBar.scrollLeft = parseInt(scrollPosition, 10);
        }
    }
}

// Language switcher function
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

// Event listeners for language switcher
document.getElementById('de-flag')?.addEventListener('click', () => changeLanguage('de'));
document.getElementById('en-flag')?.addEventListener('click', () => changeLanguage('en'));

// Update links based on selected language
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

// Dark/Light mode toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-checkbox');

    // Set initial theme from localStorage
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.checked = true;
    }

    // Listen for changes to the theme toggle
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

// Function to toggle images based on the theme
function toggleImages() {
    const isLightMode = document.body.classList.contains('light-mode');

    // Update images for light or dark mode
    document.querySelectorAll('img').forEach(img => {
        const originalSrc = img.getAttribute('src');

        if (isLightMode) {
            // Switch to light-mode images
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
            } else if (originalSrc.includes('img/octocat.png')) {
                img.setAttribute('src', 'img/octocat2.png');
            }
        } else {
            // Revert to dark-mode images
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
            } else if (originalSrc.includes('img/octocat2.png')) {
                img.setAttribute('src', 'img/octocat.png');
            }
        }
    });
}

// Event listener for theme change to toggle images
document.getElementById('theme-checkbox').addEventListener('change', () => {
    document.body.classList.toggle('light-mode');
    toggleImages(); // Update images according to the theme
});

// Call the image toggle function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('light-mode')) {
        toggleImages();
    }
});
