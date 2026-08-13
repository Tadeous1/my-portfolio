(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initialise() {
        const navbar = document.getElementById('navbar');
        const mobileMenu = document.querySelector('.mobile-menu');
        const nav = document.querySelector('nav');
        const navLinks = document.querySelector('.nav-links');
        const themeToggle = document.querySelector('.theme-toggle');
        const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

        const updateScrolledState = () => {
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 10);
            }
        };

        updateScrolledState();
        window.addEventListener('scroll', () => {
            updateScrolledState();

            const heroVisual = document.querySelector('.hero-visual');
            if (heroVisual && !prefersReducedMotion) {
                heroVisual.style.transform = `translateY(${window.scrollY * 0.2}px)`;
            }
        }, { passive: true });

        const closeMobileMenu = () => {
            navLinks?.classList.remove('active');
            nav?.classList.remove('nav-open');
            mobileMenu?.setAttribute('aria-expanded', 'false');
        };

        const toggleMobileMenu = () => {
            const isOpen = navLinks?.classList.toggle('active') ?? false;
            nav?.classList.toggle('nav-open', isOpen);
            mobileMenu?.setAttribute('aria-expanded', String(isOpen));
        };

        if (mobileMenu && nav && navLinks) {
            mobileMenu.setAttribute('aria-expanded', 'false');
            mobileMenu.addEventListener('click', toggleMobileMenu);
            mobileMenu.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleMobileMenu();
                }
            });

            navLinks.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 900) {
                        closeMobileMenu();
                    }
                });
            });
        }

        const setTheme = (theme, persist = true) => {
            const isDark = theme === 'dark';
            document.body.classList.toggle('dark-mode', isDark);
            document.documentElement.classList.toggle('dark-mode', isDark);
            themeToggle?.setAttribute('aria-pressed', String(isDark));
            if (persist) {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            }
        };

        const storedTheme = localStorage.getItem('theme');
        setTheme(storedTheme === 'dark' ? 'dark' : 'light', false);
        themeToggle?.addEventListener('click', () => {
            const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            setTheme(nextTheme);
        });

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') {
                return;
            }

            let target;
            try {
                target = document.querySelector(href);
            } catch (_error) {
                return;
            }

            if (!target) {
                return;
            }

            anchor.addEventListener('click', (event) => {
                event.preventDefault();
                target.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
                window.history.replaceState(null, '', href);
            });
        });

        const fadeInElements = document.querySelectorAll('.fade-in');
        const skillTags = document.querySelectorAll('.skill-tag');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        currentObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            fadeInElements.forEach((element) => observer.observe(element));

            const skillObserver = new IntersectionObserver((entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        currentObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            skillTags.forEach((tag) => {
                tag.style.opacity = '0';
                tag.style.transform = 'translateY(20px)';
                tag.style.transition = prefersReducedMotion ? 'none' : 'opacity 0.5s ease, transform 0.5s ease';
                skillObserver.observe(tag);
            });
        } else {
            fadeInElements.forEach((element) => element.classList.add('visible'));
            skillTags.forEach((tag) => {
                tag.style.opacity = '1';
                tag.style.transform = 'translateY(0)';
            });
        }

        const subtitle = document.querySelector('.hero-content .subtitle');
        if (subtitle && !prefersReducedMotion) {
            const originalText = subtitle.textContent ?? '';
            let index = 0;
            subtitle.textContent = '';

            const typeNextCharacter = () => {
                if (index < originalText.length) {
                    subtitle.textContent += originalText.charAt(index);
                    index += 1;
                    window.setTimeout(typeNextCharacter, 80);
                }
            };

            window.setTimeout(typeNextCharacter, 1000);
        }

        const chartCanvas = document.getElementById('heroChart');
        if (chartCanvas && window.Chart && !window.Chart.getChart(chartCanvas)) {
            new window.Chart(chartCanvas, {
                type: 'bar',
                data: {
                    labels: ['Excel', 'Power BI', 'Python', 'VBA', 'DAX'],
                    datasets: [{
                        label: 'Skill Level',
                        data: [9, 8, 7, 7, 6],
                        backgroundColor: ['#4A90E2', '#00C896', '#F4B942', '#EF476F', '#5C5470'],
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: prefersReducedMotion ? false : undefined,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, max: 10, ticks: { color: '#4A90E2', stepSize: 2 } },
                        x: { ticks: { color: '#4A90E2' } }
                    }
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialise, { once: true });
    } else {
        initialise();
    }
})();
