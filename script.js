/**
 * Modern Developer Portfolio - Core JavaScript Logic
 * Contains: Theme Toggle, Bilingual Swapping, Interactive Canvas Particles,
 * Project Filters, Testimonial Carousel, Scroll Reveals, and Form validation.
 *
 * EmailJS Setup (3 steps):
 *  1. Go to https://www.emailjs.com and sign up (free).
 *  2. Add an Email Service → connect your Gmail (yworkdada@gmail.com).
 *  3. Create an Email Template with these variables:
 *       {{from_name}}  {{from_email}}  {{message}}
 *     Copy your Public Key, Service ID, and Template ID into the constants below.
 */

// ── EmailJS credentials ── fill these in after setting up your account ──
const EMAILJS_PUBLIC_KEY = '8ymbH8xGxzZzBUpmS';   // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID = 'service_ts348ns';   // e.g. 'service_xxxxxxx'
const EMAILJS_TEMPLATE_ID = 'template_hee8ew5';  // e.g. 'template_xxxxxxx'

document.addEventListener('DOMContentLoaded', () => {
    // --- EMAILJS INIT ---
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
    // --- STATE MANAGEMENT ---
    let currentTheme = localStorage.getItem('theme') || 'dark';
    let currentLang = 'en'; // default language

    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    // Set current copyright year
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // --- INTERACTIVE PARTICLE CANVAS ---
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    const isMobile = window.innerWidth < 768;
    const numberOfParticles = isMobile ? 35 : 100;

    const mouse = {
        x: null,
        y: null,
        radius: isMobile ? 80 : 150
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Update position
        update() {
            // Check wall collisions
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse interact
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius && mouse.x !== null) {
                const force = (mouse.radius - distance) / mouse.radius;
                const pushX = (dx / distance) * force * 3;
                const pushY = (dy / distance) * force * 3;

                this.x -= pushX;
                this.y -= pushY;
            }

            // Move
            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        const theme = document.documentElement.getAttribute('data-theme');
        // Choose color based on theme
        const color = theme === 'dark' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.15)';

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Link particles with lines
    function connect() {
        let opacityValue = 1;
        const theme = document.documentElement.getAttribute('data-theme');
        const maxDist = isMobile ? 90 : 135;

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDist) {
                    opacityValue = 1 - (distance / maxDist);
                    let strokeColor = theme === 'dark'
                        ? `rgba(99, 102, 241, ${opacityValue * 0.15})`
                        : `rgba(99, 102, 241, ${opacityValue * 0.08})`;

                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    initParticles();
    animateParticles();

    // --- THEME SWITCHER ---
    const themeToggle = document.getElementById('themeToggle');

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);

        // Re-init canvas colors for new theme
        initParticles();
    });

    function updateThemeIcon(theme) {
        const themeIcon = document.getElementById('themeIcon');
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeIcon.style.color = '#f59e0b'; // Gold sun
        } else {
            themeIcon.className = 'fas fa-moon';
            themeIcon.style.color = '#4f46e5'; // Indigo moon
        }
    }

    // --- BILINGUAL TRANSLATION SYSTEM ---
    const languageToggle = document.getElementById('languageToggle');
    const translatableElements = document.querySelectorAll('[data-en], [data-am]');

    languageToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'am' : 'en';

        // Smoothly fade out content
        document.body.style.opacity = '0.9';

        setTimeout(() => {
            translatableElements.forEach(el => {
                const targetText = currentLang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-am');
                if (!targetText) return;

                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    // For submit inputs only
                    if (el.type === 'submit') el.value = targetText;
                } else if (el.children.length === 0) {
                    // ✅ Safe: only update LEAF nodes (no child elements).
                    // This prevents destroying icons/child elements inside
                    // buttons, anchors, or headings that have mixed content.
                    el.textContent = targetText;
                }
                // Elements with child elements are intentionally skipped here;
                // their child leaf nodes carry their own data-en / data-am
                // attributes and are handled individually in this same loop.
            });

            // Update toggle label button
            languageToggle.querySelector('.lang-text').textContent = currentLang === 'en' ? 'አማ' : 'EN';

            // Fade back in
            document.body.style.opacity = '1';
        }, 150);
    });

    // --- SCROLL ACTION NAVBAR AND SECTIONS ACTIVATION ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header effect
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Section Navigation Link Highlight
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // --- MOBILE BURGER SIDEBAR NAVIGATION ---
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');

    mobileNavToggle.addEventListener('click', () => {
        mobileNavToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu when clicking items
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // --- PORTFOLIO PROJECT LIST FILTERS ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active states
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger reflow for animations
                    card.offsetHeight;
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Delay hiding to allow fade out transition
                    setTimeout(() => {
                        if (btn.getAttribute('data-filter') !== 'all' && category !== btn.getAttribute('data-filter')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });

    // --- TESTIMONIALS SLIDER ---
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let testimonialIndex = 0;
    let testimonialTimer = null;

    function showTestimonial(index) {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        testimonialIndex = index;
        testimonials[testimonialIndex].classList.add('active');
        dots[testimonialIndex].classList.add('active');
    }

    function startAutoSlide() {
        testimonialTimer = setInterval(() => {
            let nextIndex = (testimonialIndex + 1) % testimonials.length;
            showTestimonial(nextIndex);
        }, 5000);
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            clearInterval(testimonialTimer);
            showTestimonial(idx);
            startAutoSlide();
        });
    });

    if (testimonials.length > 0) {
        startAutoSlide();
    }

    // --- SCROLL TRIGGERED REVEAL OBSERVER ---
    // --- SVG CIRCULAR SKILL RINGS ANIMATION ---
    function animateSkillRings() {
        const ringFills = document.querySelectorAll('.ring-fill');
        ringFills.forEach(fill => {
            const pct = parseInt(fill.getAttribute('data-pct'));
            const circumference = 2 * Math.PI * 50; // 314.159...
            const offset = circumference - (circumference * pct / 100);
            fill.style.strokeDashoffset = offset;
        });

        const pctTexts = document.querySelectorAll('.ring-center .ring-pct');
        pctTexts.forEach(text => {
            const target = parseInt(text.getAttribute('data-target'));
            let current = 0;
            const steps = 60;
            const increment = target / steps;
            const duration = 1400; // matches CSS transition duration
            const intervalTime = duration / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                text.textContent = Math.round(current) + '%';
            }, intervalTime);
        });
    }

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');

                // If it is the skills section, animate the SVG rings
                if (entry.target.id === 'skills') {
                    animateSkillRings();
                }

                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, revealOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // --- CONTACT FORM SUBMISSION WITH EMAILJS ---
    const contactForm = document.getElementById('contactForm');

    /** Show an animated toast banner. type: 'success' | 'error' */
    function showBanner(type) {
        const isSuccess = type === 'success';

        const banner = document.createElement('div');
        Object.assign(banner.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: isSuccess
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #ef4444, #b91c1c)',
            color: '#ffffff',
            padding: '1rem 1.75rem',
            borderRadius: '10px',
            boxShadow: isSuccess
                ? '0 10px 25px rgba(5,150,105,0.35)'
                : '0 10px 25px rgba(239,68,68,0.35)',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '500',
            fontSize: '0.95rem',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'all 0.4s ease',
            maxWidth: '340px',
            lineHeight: '1.5',
        });

        const icon = isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle';
        const msgEn = isSuccess
            ? 'Message sent! I will get back to you soon.'
            : 'Oops! Something went wrong. Please try again.';
        const msgAm = isSuccess
            ? 'ተሳክቷል! በቅርቡ ምላሽ እሰጣለሁ።'
            : 'ይቅርታ! ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።';

        banner.innerHTML =
            `<i class="fas ${icon}" style="margin-right:8px;"></i>${currentLang === 'en' ? msgEn : msgAm}`;
        document.body.appendChild(banner);

        // Animate in
        setTimeout(() => {
            banner.style.opacity = '1';
            banner.style.transform = 'translateY(0)';
        }, 60);

        // Animate out and remove after 5 s
        setTimeout(() => {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(20px)';
            setTimeout(() => banner.remove(), 400);
        }, 5000);
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameVal = document.getElementById('name').value.trim();
        const emailVal = document.getElementById('email').value.trim();
        const msgVal = document.getElementById('message').value.trim();

        if (!nameVal || !emailVal || !msgVal) return;

        // ── Button loading state ──
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalHTML = submitBtn.innerHTML;
        const sendingLabel = currentLang === 'en' ? 'Sending…' : 'እየተላከ ነው…';
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>${sendingLabel}</span>`;
        submitBtn.disabled = true;

        try {
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS not loaded');
            }

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: nameVal,
                    from_email: emailVal,
                    message: msgVal,
                    to_email: 'yworkdada@gmail.com',
                    reply_to: emailVal,
                }
            );

            showBanner('success');
            contactForm.reset();
            document.querySelectorAll('.form-input').forEach(input => input.blur());

        } catch (err) {
            console.error('EmailJS error:', err);
            showBanner('error');
        } finally {
            // Always restore the button
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    });

    // --- CERTIFICATE LIGHTBOX MODAL ---
    const certModal = document.getElementById('certLightboxModal');
    if (certModal) {
        const modalImg = document.getElementById('certModalImage');
        const modalTitle = document.getElementById('certModalTitleText');
        const modalIssuer = document.getElementById('certModalIssuerText');
        const modalDownload = document.getElementById('certModalDownloadLink');
        const closeBtn = certModal.querySelector('.cert-modal-close-btn');
        const backdrop = certModal.querySelector('.cert-modal-backdrop');

        function openCertModal(imgSrc, title, issuer) {
            if (modalImg) modalImg.src = imgSrc;
            if (modalTitle) modalTitle.textContent = title;
            if (modalIssuer) modalIssuer.textContent = issuer;
            if (modalDownload) {
                modalDownload.href = imgSrc;
                modalDownload.setAttribute('download', title.toLowerCase().replace(/\s+/g, '-') + '-certificate.png');
            }
            certModal.classList.add('active');
            certModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeCertModal() {
            certModal.classList.remove('active');
            certModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        document.querySelectorAll('.open-cert-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const imgSrc = btn.getAttribute('data-img');
                const title = btn.getAttribute('data-title');
                const issuer = btn.getAttribute('data-issuer');
                openCertModal(imgSrc, title, issuer);
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeCertModal);
        if (backdrop) backdrop.addEventListener('click', closeCertModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certModal.classList.contains('active')) {
                closeCertModal();
            }
        });
    }
});