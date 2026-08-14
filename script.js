(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initialise() {
        const dashboardType = document.body.dataset.dashboard;
        const workflowCopy = {
            olympics: [
                ['Ask', 'How do medal totals, sport participation, and athlete mix compare?'],
                ['Collect', 'Combine a public Rio 2016 athlete dataset with official IOC results context.'],
                ['Clean', 'Standardize country and sport labels and retain the published medal fields.'],
                ['Analyze', 'Aggregate medals by nationality and entries by sport and sex.'],
                ['Visualize', 'Use comparison charts with source attribution and careful interpretation.'],
            ],
            energy: [
                ['Ask', 'How have solar, wind, and hydropower generation changed over time?'],
                ['Collect', 'Use the Our World in Data grapher and its cited Energy Institute series.'],
                ['Clean', 'Filter to World and retain the solar, wind, and hydropower fields in TWh.'],
                ['Analyze', 'Compare checkpoint years and the latest source row without forecasting.'],
                ['Visualize', 'Use a line chart and latest-year comparison with units always visible.'],
            ],
            sales: [
                ['Ask', 'When, where, and across which products does revenue concentrate?'],
                ['Collect', 'Use the UCI Online Retail transaction dataset and its documented fields.'],
                ['Clean', 'Separate cancellations and exclude non-positive quantity or price before revenue calculation.'],
                ['Analyze', 'Aggregate quantity × unit price by month, country, product, customer, and invoice.'],
                ['Visualize', 'Present revenue concentration with labeled currency charts and caveats.'],
            ],
        };
        const workflow = workflowCopy[dashboardType];
        if (workflow && !document.querySelector('.workflow-section')) {
            const section = document.createElement('section');
            section.className = 'workflow-section';
            section.setAttribute('aria-labelledby', `${dashboardType}-workflow-heading`);
            section.innerHTML = `<div class="section-heading-row"><div><p class="eyebrow">DATA WORKFLOW</p><h2 id="${dashboardType}-workflow-heading">From question to decision</h2></div></div><div class="workflow-grid">${workflow.map(([title, copy], index) => `<article><span>0${index + 1}</span><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div>`;
            document.querySelector('.method-section')?.before(section);
        }
        document.querySelectorAll('.source-footer span').forEach((node) => {
            if (node.textContent.includes('Built with HTML, CSS, JavaScript, and Chart.js.')) node.remove();
        });
        const navbar = document.getElementById('navbar');
        const mobileMenu = document.querySelector('.mobile-menu');
        const nav = document.querySelector('nav');
        const navLinks = document.querySelector('.nav-links');
        const themeToggle = document.querySelector('.theme-toggle');
        const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
        let heroChart = null;

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
            if (heroChart) {
                const chartTextColor = isDark ? '#99F6E4' : '#0F766E';
                heroChart.options.scales.y.ticks.color = chartTextColor;
                heroChart.options.scales.x.ticks.color = chartTextColor;
                heroChart.update('none');
            }
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
            const chartTextColor = document.body.classList.contains('dark-mode') ? '#99F6E4' : '#0F766E';
            heroChart = new window.Chart(chartCanvas, {
                type: 'bar',
                data: {
                    labels: ['Excel', 'Power BI', 'Python', 'VBA', 'DAX'],
                    datasets: [{
                        label: 'Skill Level',
                        data: [9, 8, 7, 7, 6],
                        backgroundColor: ['#0F766E', '#14B8A6', '#38BDF8', '#F59E0B', '#64748B'],
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
                        y: { beginAtZero: true, max: 10, ticks: { color: chartTextColor, stepSize: 2 } },
                        x: { ticks: { color: chartTextColor } }
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
