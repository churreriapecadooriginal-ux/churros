// Parallax Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.getElementById('heroBg');
    const parallaxSpeed = 0.5;

    if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Fade in on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Modal Logic
document.querySelectorAll('[data-modal]').forEach(function (el) {
    el.addEventListener('click', function (e) {
        e.preventDefault();
        const modalId = el.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'block';
    });
});

document.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', function () {
        const modalId = el.getAttribute('data-close');
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    });
});

['modal-aviso', 'modal-privacidad', 'modal-cookies'].forEach(function (id) {
    const m = document.getElementById(id);
    if (m) {
        m.addEventListener('click', function (e) {
            if (e.target === m) m.style.display = 'none';
        });
    }
});
