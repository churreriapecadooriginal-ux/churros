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

// Mobile Menu Logic
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Draggable Marquee
const initDraggableMarquee = () => {
    const marquee = document.querySelector('.productos-marquee');
    const track = document.querySelector('.productos-track.core');

    if (!marquee || !track) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let startTime;
    let isMoving = false;

    const start = (e) => {
        isDown = true;
        isMoving = false;
        startTime = Date.now();
        marquee.classList.add('active');
        startX = (e.pageX || e.touches[0].pageX) - marquee.offsetLeft;

        // Get current transform
        const style = window.getComputedStyle(track);
        const matrix = new DOMMatrixReadOnly(style.transform);
        scrollLeft = matrix.m41;

        track.style.animationPlayState = 'paused';
    };

    const end = () => {
        if (!isDown) return;
        isDown = false;
        marquee.classList.remove('active');

        // If we didn't move much, resume animation
        if (!isMoving) {
            track.style.animationPlayState = '';
        } else {
            // Keep it paused for a bit or resume
            // For now, let's resume after interaction
            setTimeout(() => {
                if (!isDown) track.style.animationPlayState = '';
            }, 1000);
        }
    };

    const move = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = (e.pageX || e.touches[0].pageX) - marquee.offsetLeft;
        const walk = (x - startX);

        if (Math.abs(walk) > 5) {
            isMoving = true;
        }

        track.style.transform = `translateX(${scrollLeft + walk}px)`;
    };

    marquee.addEventListener('mousedown', start);
    marquee.addEventListener('touchstart', start, { passive: true });

    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);

    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });

    // Prevent click if moving
    track.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (isMoving) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        });
    });
};

initDraggableMarquee();

// Anime.js Animations
const initAnimeAnimations = () => {
    if (typeof anime === 'undefined') return;

    // ── RITUAL CARDS: entrance + hover ──
    const ritualCards = document.querySelectorAll('.ritual-card');

    anime.set(ritualCards, { opacity: 0, translateY: 30, scale: 0.95 });

    const ritualObserver = new IntersectionObserver((entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
            anime({
                targets: visible.map(e => e.target),
                opacity: [0, 1], translateY: [30, 0], scale: [0.95, 1],
                delay: anime.stagger(150), duration: 1000, easing: 'easeOutQuad'
            });
            visible.forEach(e => ritualObserver.unobserve(e.target));
        }
    }, { threshold: 0.15 });

    ritualCards.forEach(card => {
        ritualObserver.observe(card);

        card.addEventListener('mouseenter', () => {
            anime({ targets: card, scale: 1.05, translateY: -10, duration: 600, easing: 'easeOutElastic(1, .8)', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' });
            ritualCards.forEach(o => { if (o !== card) anime({ targets: o, opacity: 0.5, scale: 0.95, duration: 600, easing: 'easeOutQuad' }); });
        });
        card.addEventListener('mouseleave', () => {
            anime({ targets: card, scale: 1, translateY: 0, duration: 600, easing: 'easeOutElastic(1, .8)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' });
            ritualCards.forEach(o => anime({ targets: o, opacity: 1, scale: 1, duration: 600, easing: 'easeOutQuad' }));
        });
    });

    // ── NOVEDADES CARDS: orbital cycling ──
    const orbitContainer = document.querySelector('.orbit-container');
    if (!orbitContainer) return;

    const orbitItems = Array.from(orbitContainer.querySelectorAll('.orbit-item'));
    if (orbitItems.length === 0) return;

    let globalRotation = 0;
    let orbitTimer = null;
    let isOrbitPaused = false;

    // Radius handled by CSS media queries to prevent inline style conflicts

    const updateOrbit = (instant = false) => {
        orbitItems.forEach((item, index) => {
            const angle = (index * 90) + globalRotation;
            const normalizedAngle = ((angle % 360) + 360) % 360;
            const isTop = normalizedAngle === 0;

            if (instant) {
                item.style.transition = 'none';
            } else {
                item.style.transition = '';
            }

            // Set both the CSS variable AND the explicit transform to ensure it works
            item.style.setProperty('--angle', `${angle}deg`);

            // Re-asserting the basic positioning to be 100% sure
            const radius = window.innerWidth <= 768 ? 200 : 280;
            const scale = isTop ? 1.1 : 0.8;

            // Direct transform fallback/override
            item.style.transform = `rotate(${angle}deg) translateY(${-radius}px) rotate(${-angle}deg) scale(${scale})`;

            if (isTop) {
                item.classList.add('active');
                item.style.zIndex = '10';
            } else {
                item.classList.remove('active');
                item.style.zIndex = '1';
            }
        });
    };

    const rotateToIndex = (index) => {
        globalRotation = -index * 90;
        updateOrbit();
    };

    const rotateNext = () => {
        if (isOrbitPaused) return;
        globalRotation -= 90;
        updateOrbit();
    };

    const startOrbit = () => {
        if (orbitTimer) clearInterval(orbitTimer);
        orbitTimer = setInterval(rotateNext, 4000);
    };

    // 1. Initial setup
    updateOrbit(true);

    // 2. Immediate entrance
    setTimeout(() => {
        orbitItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.classList.add('visible');
            }, index * 100);
        });
        updateOrbit(false);
        startOrbit();
    }, 100);

    orbitItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            isOrbitPaused = true;
        });

        item.addEventListener('mouseleave', () => {
            isOrbitPaused = false;
        });

        // Click a card to bring it directly to the front
        item.addEventListener('click', () => {
            rotateToIndex(index);
        });
    });
};

initAnimeAnimations();

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
