/**
 * script.js
 * Rishi Kumar's Portfolio Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Helper to safely render icons if internet is available
    function renderIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // 1. Initialize Lucide Icons
    renderIcons();

    // 2. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (mobileMenu) {
            if (isMenuOpen) {
                mobileMenu.classList.add('active');
                if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i data-lucide="x"></i>';
            } else {
                mobileMenu.classList.remove('active');
                if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
            }
        }
        renderIcons(); // Re-render icons on state change
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }
    
    // Close mobile menu when a link is clicked
    if (mobileLinks) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) toggleMenu();
            });
        });
    }

    // 4. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // 5. Scroll Reveal Intersection Observer (Framer Motion alternative)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            });
        }, revealOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // 6. Terminal Typing Animation
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const textToType = "I'm a B.Tech CSE (Full Stack) student specializing in building exceptional digital experiences. Currently exploring the intersection of modern web development and AI.";
        let charIndex = 0;
        
        function typeWriter() {
            if (charIndex < textToType.length) {
                typingText.innerHTML += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 30); // Typing speed
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeWriter, 1000);
    }

    // 7. 3D Project Coverflow Carousel
    const track = document.getElementById('project-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const slides = Array.from(track.children);
        const slideCount = slides.length;
        
        function updateCarousel() {
            const half = Math.floor(slideCount / 2);
            const isMobile = window.innerWidth < 768;
            
            slides.forEach((slide, i) => {
                let offset = i - currentIndex;
                
                // Looping logic
                let diff = offset;
                if (diff > half) diff -= slideCount;
                else if (diff < -half + (slideCount % 2 === 0 ? 1 : 0)) diff += slideCount;
                
                let zIndex = 0;
                let scale = 1;
                let translateX = 0;
                let rotateY = 0;
                let opacity = 1;

                if (diff === 0) { // Center
                    zIndex = 5;
                    scale = 1;
                    translateX = 0;
                    rotateY = 0;
                    opacity = 1;
                    slide.style.pointerEvents = 'auto';
                } else if (diff === -1) { // Left
                    zIndex = 4;
                    scale = isMobile ? 0.8 : 0.85;
                    translateX = isMobile ? -80 : -105;
                    rotateY = 35; 
                    opacity = 0.5;
                    slide.style.pointerEvents = 'none';
                } else if (diff === 1) { // Right
                    zIndex = 4;
                    scale = isMobile ? 0.8 : 0.85;
                    translateX = isMobile ? 80 : 105; 
                    rotateY = -35;
                    opacity = 0.5;
                    slide.style.pointerEvents = 'none';
                } else { // Hidden/Back
                    zIndex = 1;
                    scale = 0.6;
                    translateX = 0;
                    rotateY = 0;
                    opacity = 0;
                    slide.style.pointerEvents = 'none';
                }
                
                // Apply 3D transform
                slide.style.transform = `translateX(${translateX}%) perspective(1200px) rotateY(${rotateY}deg) scale(${scale})`;
                slide.style.zIndex = zIndex;
                slide.style.opacity = opacity;
            });
        }
        
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateCarousel();
        });
        
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateCarousel();
        });
        
        window.addEventListener('resize', updateCarousel);
        
        // Setup initial arrangement
        updateCarousel();
    }
});
