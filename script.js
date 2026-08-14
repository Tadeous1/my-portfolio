(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initialise() {
        const brandName = 'E.O. Analytics';
        document.querySelectorAll('.brand-lockup span').forEach((node) => {
            node.textContent = brandName;
        });
        document.querySelectorAll('footer p').forEach((node) => {
            node.innerHTML = node.innerHTML.replaceAll('ElishaInsights', brandName).replaceAll('2025 E.O. Analytics', '2025–2026 E.O. Analytics');
        });
        document.title = document.title.replaceAll('ElishaInsights', brandName);

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
        const detailProfiles = {
            citi: { title: 'Citi Bikes Data Analysis', description: 'A source-linked Jersey City trip-history case study showing when, where, and by whom shared bikes were used.', tools: ['Python', 'Pandas', 'Chart.js'], rows: '6,668 rides', columns: '10 observed days', variables: 'weekday · member type · station · duration', insight: 'Subscribers represent 79.4% of the observed rides.', source: 'https://s3.amazonaws.com/tripdata/JC-201509-citibike-tripdata.csv.zip', sourceLabel: 'Download Dataset ↗' },
            olympics: { title: 'Olympic Historical Data Analysis', description: 'A public-data case study comparing country medal totals, athlete entries, sport participation, and sex mix in Rio 2016.', tools: ['Python', 'Pandas', 'Chart.js'], rows: '11,538 athlete entries', columns: '13 source fields', variables: 'medals · nationality · sport · sex', insight: 'The USA leads the top-country medal totals in this dataset.', source: 'https://datahub.io/core/rio2016', sourceLabel: 'Open Dataset ↗' },
            energy: { title: 'Solar & Wind Power Trends', description: 'A world-level renewable-generation case study comparing solar, wind, and hydropower across 1965–2025.', tools: ['Python', 'Pandas', 'Chart.js'], rows: '61 world-year rows', columns: 'renewable generation fields', variables: 'solar · wind · hydropower · year', insight: 'Solar and wind scale sharply after 2010 while hydropower remains the largest latest-year series.', source: 'https://ourworldindata.org/grapher/renewable-energy-gen', sourceLabel: 'Open Source Chart ↗' },
            sales: { title: 'Sales Performance Dashboard', description: 'A transparent retail case study showing revenue concentration by month, country, and product from the UCI Online Retail dataset.', tools: ['Python', 'Pandas', 'Chart.js'], rows: '541,909 raw lines', columns: '8 source fields', variables: 'quantity · price · country · invoice', insight: 'The United Kingdom contributes £9.03m of the completed-line revenue calculation.', source: 'https://archive.ics.uci.edu/dataset/352/online+retail', sourceLabel: 'Open Dataset ↗' },
            snack: { title: 'LAUTECH Student Snack Preference', description: 'A real survey case study covering student snack preferences, purchase frequency, budgets, satisfaction, and locations.', tools: ['Excel', 'Pandas', 'Chart.js'], rows: '3,500 responses', columns: '13 columns', variables: 'snack · frequency · spend · satisfaction', insight: 'Occasional buying is the largest frequency group with 1,451 responses.', source: 'mailto:elishao2000@gmail.com?subject=LAUTECH%20snack%20survey%20source', sourceLabel: 'Request Source File ↗' },
        };
        const profile = detailProfiles[dashboardType];
        const workflow = workflowCopy[dashboardType];
        if (profile && !document.querySelector('.detail-brief')) {
            const detail = document.createElement('section');
            detail.className = 'detail-brief';
            detail.setAttribute('aria-labelledby', `${dashboardType}-detail-heading`);
            detail.innerHTML = `<div class="detail-brief-main"><p class="eyebrow">01 — PROJECT OVERVIEW</p><h2 id="${dashboardType}-detail-heading">${profile.title}</h2><p>${profile.description}</p></div><div class="detail-brief-tools"><p class="eyebrow">TOOLS</p><div class="detail-tool-list">${profile.tools.map((tool) => `<span>${tool}</span>`).join('')}</div></div><div class="detail-brief-dataset"><p class="eyebrow">02 — DATASET</p><dl><div><dt>Rows</dt><dd>${profile.rows}</dd></div><div><dt>Columns</dt><dd>${profile.columns}</dd></div><div><dt>Key variables</dt><dd>${profile.variables}</dd></div></dl></div><div class="detail-brief-actions"><p class="eyebrow">REPORT ACTIONS</p><a href="#dashboard" class="btn btn-primary">View Full Report →</a><a href="${profile.source}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">${profile.sourceLabel}</a></div><div class="detail-brief-insight"><p class="eyebrow">KEY INSIGHT</p><p>${profile.insight}</p></div>`;
            document.querySelector('.case-study-hero')?.after(detail);
        }
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

        const accentPresets = {
            teal: { label: 'Teal', base: '#14B8A6', strong: '#0F766E', soft: '#CCFBF1', onDark: '#99F6E4', surface: '#134E4A', contrast: '#0F172A', rgb: '20, 184, 166', sky: '#38BDF8', warm: '#F59E0B', slate: '#64748B' },
            blue: { label: 'Signal Blue', base: '#38BDF8', strong: '#0369A1', soft: '#E0F2FE', onDark: '#7DD3FC', surface: '#0C4A6E', contrast: '#0F172A', rgb: '56, 189, 248', sky: '#0EA5E9', warm: '#F59E0B', slate: '#64748B' },
            amber: { label: 'Insight Amber', base: '#F59E0B', strong: '#B45309', soft: '#FEF3C7', onDark: '#FCD34D', surface: '#78350F', contrast: '#1E293B', rgb: '245, 158, 11', sky: '#38BDF8', warm: '#14B8A6', slate: '#64748B' },
            coral: { label: 'Coral Signal', base: '#FB7185', strong: '#BE123C', soft: '#FFE4E6', onDark: '#FDA4AF', surface: '#881337', contrast: '#FFFFFF', rgb: '251, 113, 133', sky: '#38BDF8', warm: '#F59E0B', slate: '#94A3B8' },
        };

        const accentPicker = (() => {
            if (!themeToggle || document.querySelector('.accent-picker')) return null;
            const picker = document.createElement('details');
            picker.className = 'accent-picker';
            picker.innerHTML = `<summary class="accent-picker-toggle" aria-label="Choose accent color" title="Choose accent color"><span class="accent-picker-dot" aria-hidden="true"></span><span class="accent-picker-label">Accent</span></summary><div class="accent-picker-panel" role="group" aria-label="Accent color options"><p>Accent color</p>${Object.entries(accentPresets).map(([key, preset]) => `<button type="button" class="accent-option" data-accent="${key}" aria-pressed="false"><span class="accent-swatch" style="--swatch:${preset.base}" aria-hidden="true"></span><span>${preset.label}</span></button>`).join('')}</div>`;
            themeToggle.insertAdjacentElement('afterend', picker);
            return picker;
        })();

        let activeAccentKey = 'teal';
        const getAccent = () => accentPresets[activeAccentKey] ?? accentPresets.teal;
        const applyAccent = (accentKey, persist = true) => {
            activeAccentKey = accentPresets[accentKey] ? accentKey : 'teal';
            const accent = getAccent();
            const root = document.documentElement;
            root.dataset.accent = activeAccentKey;
            root.style.setProperty('--accent', accent.base);
            root.style.setProperty('--accent-strong', accent.strong);
            root.style.setProperty('--accent-soft', accent.soft);
            root.style.setProperty('--accent-on-dark', accent.onDark);
            root.style.setProperty('--accent-surface', accent.surface);
            root.style.setProperty('--accent-contrast', accent.contrast);
            root.style.setProperty('--accent-rgb', accent.rgb);
            accentPicker?.querySelectorAll('.accent-option').forEach((option) => {
                option.setAttribute('aria-pressed', String(option.dataset.accent === activeAccentKey));
            });
            if (heroChart) {
                const chartTextColor = document.body.classList.contains('dark-mode') ? accent.onDark : accent.strong;
                heroChart.data.datasets[0].backgroundColor = [accent.strong, accent.base, accent.sky, accent.warm, accent.slate];
                heroChart.options.scales.y.ticks.color = chartTextColor;
                heroChart.options.scales.x.ticks.color = chartTextColor;
                heroChart.update('none');
            }
            if (persist) localStorage.setItem('accent', activeAccentKey);
        };

        accentPicker?.querySelectorAll('.accent-option').forEach((option) => {
            option.addEventListener('click', () => {
                applyAccent(option.dataset.accent);
                accentPicker.removeAttribute('open');
            });
        });

        applyAccent(localStorage.getItem('accent'), false);

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
            const accent = getAccent();
            document.body.classList.toggle('dark-mode', isDark);
            document.documentElement.classList.toggle('dark-mode', isDark);
            themeToggle?.setAttribute('aria-pressed', String(isDark));
            themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
            themeToggle?.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
            if (heroChart) {
                const chartTextColor = isDark ? accent.onDark : accent.strong;
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
        if (subtitle?.dataset.typewriter === 'true' && !prefersReducedMotion) {
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
                    backgroundColor: [getAccent().strong, getAccent().base, getAccent().sky, getAccent().warm, getAccent().slate],
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
