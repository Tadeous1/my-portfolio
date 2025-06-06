// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle functionality
const mobileMenu = document.querySelector('.mobile-menu');

function createMobileMenuOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.innerHTML = `
        <div class="mobile-nav-content">
            <div class="mobile-nav-header">
                <div class="logo">ElishaInsights</div>
                <button class="close-mobile-menu" aria-label="Close menu">&times;</button>
            </div>
            <ul class="mobile-nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    `;
    const style = document.createElement('style');
    style.textContent = `
        .mobile-nav-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .mobile-nav-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        .mobile-nav-content {
            text-align: center;
            max-width: 300px;
            width: 100%;
        }
        .mobile-nav-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3rem;
            padding: 0 1rem;
        }
        .close-mobile-menu {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #2E2E2E;
        }
        .mobile-nav-links {
            list-style: none;
            padding: 0;
        }
        .mobile-nav-links li {
            margin: 1.5rem 0;
        }
        .mobile-nav-links a {
            text-decoration: none;
            color: #2E2E2E;
            font-size: 1.2rem;
            font-weight: 600;
            transition: color 0.3s ease;
        }
        .mobile-nav-links a:hover {
            color: #4A90E2;
        }
        @media (min-width: 769px) {
            .mobile-nav-overlay {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
    return overlay;
}

if (mobileMenu) {
    mobileMenu.addEventListener('click', function() {
        let overlay = document.querySelector('.mobile-nav-overlay');
        if (!overlay) {
            overlay = createMobileMenuOverlay();
            document.body.appendChild(overlay);

            overlay.querySelector('.close-mobile-menu').addEventListener('click', function() {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });

            overlay.querySelectorAll('.mobile-nav-links a').forEach(link => {
                link.addEventListener('click', function() {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Typing animation for hero subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

window.addEventListener('load', function() {
    const subtitle = document.querySelector('.hero-content .subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        setTimeout(() => {
            typeWriter(subtitle, originalText, 80);
        }, 1000);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    const floatingElements = document.querySelectorAll('.floating-icon');
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
        floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

// Animate skill tags on scroll
const skillTags = document.querySelectorAll('.skill-tag');
const skillObserver = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.5 });

skillTags.forEach(tag => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(20px)';
    tag.style.transition = 'all 0.5s ease';
    skillObserver.observe(tag);
});

// Project cards hover effects
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'scale(1.05)';
    });
    card.addEventListener('mouseout', () => {
        card.style.transform = 'scale(1)';
    });
});

// Smooth scrolling for project links
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ================================
// Chart.js in Hero Data Viz
// ================================
window.addEventListener('DOMContentLoaded', function() {
  const ctx = document.getElementById('heroChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Sample Data',
          data: [12, 19, 9, 17, 14],
          borderColor: '#4A90E2',
          backgroundColor: 'rgba(74,144,226,0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#eee' }, beginAtZero: true }
        }
      }
    });
  }

  // ============ Theme Toggle (Light/Dark Mode) ============
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  // Set initial mode from localStorage
  if (localStorage.getItem('theme') === 'dark') {
      body.classList.add('dark-mode');
  }
  if (themeToggle) {
      themeToggle.addEventListener('click', () => {
          body.classList.toggle('dark-mode');
          if (body.classList.contains('dark-mode')) {
              localStorage.setItem('theme', 'dark');
          } else {
              localStorage.setItem('theme', 'light');
          }
      });
  }
});
