// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
    // ===== Smooth scroll =====
    const navbar = $('.navbar');
    const navMenu = $('.nav-menu');
    const hamburger = $('.hamburger');

    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const target = $(href);
            if (!target) return;

            e.preventDefault();

            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({ top: targetPosition, behavior: 'smooth' });

            // close mobile menu
            navMenu?.classList.remove('active');
            hamburger?.classList.remove('active');
        });
    });

    // ===== Mobile menu =====
    hamburger?.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // ===== Navbar shadow on scroll (throttled) =====
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const y = window.pageYOffset || 0;

            // меняем только если реально нужно (меньше перерисовок)
            if (navbar) {
                if (y > 100) {
                    if (navbar.dataset.shadow !== '1') {
                        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
                        navbar.dataset.shadow = '1';
                    }
                } else {
                    if (navbar.dataset.shadow !== '0') {
                        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.10)';
                        navbar.dataset.shadow = '0';
                    }
                }
            }

            ticking = false;
        });
    }, { passive: true });

    // ===== Modal (event delegation instead of many listeners) =====
    const modal = $('#imageModal');
    const modalImg = $('#modalImage');
    const modalCaption = $('#modalCaption');
    const closeModal = $('.close-modal');

    const openModal = (imgSrc, imgAlt, caption) => {
        if (!modal) return;

        if (modalImg) {
            modalImg.src = imgSrc || '';
            modalImg.alt = imgAlt || '';
            modalImg.style.display = imgSrc ? 'block' : 'none';
        }
        if (modalCaption) modalCaption.textContent = caption || '';

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    const hideModal = () => {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    closeModal?.addEventListener('click', hideModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    // ===== Works filter =====
    const filterBar = $('.works-filters');
    if (filterBar) {
        const filterButtons = $$('.filter-btn', filterBar);
        const workItems = $$('#works .gallery .gallery-item');

        const getCourseFromItem = (item) => {
            const title = $('.gallery-info h3', item)?.textContent || '';
            const match = title.match(/курс\s*([1-4])/i);
            return match ? match[1] : null;
        };

        const applyFilter = (course) => {
            workItems.forEach((item) => {
                const itemCourse = getCourseFromItem(item);
                const shouldShow = course === 'all' || itemCourse === course;
                item.classList.toggle('is-hidden', !shouldShow);
            });
        };

        filterButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const course = btn.dataset.course || 'all';
                filterButtons.forEach((button) => {
                    const isActive = button === btn;
                    button.classList.toggle('active', isActive);
                    button.setAttribute('aria-pressed', String(isActive));
                });
                applyFilter(course);
            });
        });

        applyFilter('all');
    }

    // один обработчик на весь документ
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;

        const img = $('.gallery-image', item);
        const titleEl = $('.gallery-info h3', item);
        const descEl = $('.gallery-info p', item);

        const title = titleEl ? titleEl.textContent.trim() : '';
        const desc = descEl ? descEl.textContent.trim() : '';
        const caption = title && desc ? `${title} — ${desc}` : title || desc;

        if (img) {
            openModal(img.src, img.alt || title, caption);
        }
    });

    // ===== Contact form =====
    const contactForm = $('.contact-form');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            name: $('#name')?.value || '',
            email: $('#email')?.value || '',
            message: $('#message')?.value || ''
        };

        console.log('Форма отправлена:', formData);
        alert('Спасибо за ваше сообщение! Я свяжусь с вами в ближайшее время.');
        contactForm.reset();
    });

    // ===== IntersectionObserver animations (one-time, unobserve) =====
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // если пользователь просит меньше анимаций — не грузим вообще
    if (!reduceMotion) {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -30px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target); // важно: один раз и хватит
                }
            });
        }, observerOptions);

        // ВАЖНО: вместо постоянного изменения inline styles
        // используем классы (быстрее и чище)
        const animateTargets = [
            ...$$('.gallery-item'),
            ...$$('.about-content'),
            ...$$('.contact-content')
        ];

        animateTargets.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }
});
