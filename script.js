/**
 * script.js — Rishi Kumar Portfolio
 * Universal scroll-animation engine using [data-anim] attributes.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 0. Lucide icons ──────────────────────────── */
    function renderIcons() {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    renderIcons();

    /* ── 1. Theme toggle ──────────────────────────── */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', savedTheme || (prefersDark ? 'dark' : 'light'));

    themeToggleBtn?.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    /* ── 2. Mobile menu ───────────────────────────── */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu    = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        mobileMenu?.classList.toggle('active', isMenuOpen);
        if (mobileMenuBtn) {
            mobileMenuBtn.innerHTML = isMenuOpen
                ? '<i data-lucide="x"></i>'
                : '<i data-lucide="menu"></i>';
            renderIcons();
        }
    }
    mobileMenuBtn?.addEventListener('click', toggleMenu);
    document.querySelectorAll('.mobile-link').forEach(l =>
        l.addEventListener('click', () => { if (isMenuOpen) toggleMenu(); })
    );

    /* ── 3. Navbar shrink on scroll ───────────────── */
    const navbar = document.getElementById('navbar');

    /* ── Resume FAB ───────────────────────────────── */
    const resumeFab = document.getElementById('resume-fab');

    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
        // Show resume FAB after scrolling past hero (~400px)
        resumeFab?.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    // Render the lucide icon inside the FAB
    renderIcons();

    /* ── 4. Scroll progress bar ───────────────────── */
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        }, { passive: true });
    }

    /* ── 5. Particle canvas ───────────────────────── */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx   = canvas.getContext('2d');
        let   parts = [];
        const N     = 55;

        const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        const rnd = (a, b) => a + Math.random() * (b - a);

        const newPart = () => ({
            x: rnd(0, canvas.width),  y: rnd(0, canvas.height),
            r: rnd(0.8, 2.2),
            dx: rnd(-0.25, 0.25),     dy: rnd(-0.4, -0.1),
            op: rnd(0.2, 0.55),
            life: 0,                   max: rnd(200, 420)
        });

        parts = Array.from({ length: N }, newPart);

        (function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = html.getAttribute('data-theme') !== 'light';
            const c = isDark ? '6,182,212' : '37,99,235';

            parts.forEach((p, i) => {
                p.life++;
                if (p.life > p.max) { parts[i] = newPart(); return; }
                const lr = p.life / p.max;
                const fade = lr < 0.1 ? lr * 10 : lr > 0.9 ? (1 - lr) * 10 : 1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${c},${p.op * fade})`;
                ctx.fill();
                p.x += p.dx; p.y += p.dy;
            });
            requestAnimationFrame(draw);
        })();
    }

    /* ── 6. Universal scroll-animation engine ─────── */
    /*
     * Elements carry: data-anim="type"  data-anim-delay="ms"
     * CSS holds the start states; JS adds .in-view to play them.
     */
    const animEls = document.querySelectorAll('[data-anim]');

    animEls.forEach(el => {
        const delay = el.dataset.animDelay;
        if (delay) el.style.transitionDelay = delay + 'ms';
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        animEls.forEach(el => observer.observe(el));
    } else {
        animEls.forEach(el => el.classList.add('in-view'));
    }

    /* ── 7. Stat counter count-up ─────────────────── */
    const statNums = document.querySelectorAll('.stat-num[data-count]');

    if (statNums.length && 'IntersectionObserver' in window) {
        const countObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el     = entry.target;
                const target = +el.dataset.count;
                const suffix = el.dataset.suffix || '';
                const dur    = 1400;
                const start  = performance.now();

                el.classList.add('counted');

                (function tick(now) {
                    const p = Math.min((now - start) / dur, 1);
                    const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
                    el.textContent = Math.round(e * target) + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                })(start);

                countObs.unobserve(el);
            });
        }, { threshold: 0.5 });

        statNums.forEach(el => countObs.observe(el));
    }

    /* ── 8. Terminal typing animation ─────────────── */
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const msg = "I'm a B.Tech CSE (Full Stack) student specializing in building exceptional digital experiences. Currently exploring the intersection of modern web development and AI.";
        let i = 0;
        const type = () => {
            if (i < msg.length) {
                typingText.innerHTML += msg[i++];
                setTimeout(type, 30);
            }
        };
        setTimeout(type, 1000);
    }

    /* ── 9. 3D Project Coverflow Carousel ─────────── */
    const track   = document.getElementById('project-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track && prevBtn && nextBtn) {
        let cur    = 0;
        const slides = Array.from(track.children);
        const total  = slides.length;

        const update = () => {
            const half    = Math.floor(total / 2);
            const mobile  = innerWidth < 768;
            slides.forEach((s, i) => {
                let diff = i - cur;
                if (diff > half) diff -= total;
                else if (diff < -half + (total % 2 === 0 ? 1 : 0)) diff += total;

                let z = 0, sc = 1, tx = 0, ry = 0, op = 1;
                if (diff === 0)       { z=5; sc=1;              tx=0;              ry=0;  op=1;   s.style.pointerEvents='auto'; }
                else if (diff === -1) { z=4; sc=mobile ? 0.8 : 0.85; tx=mobile ? -80 : -105; ry=35;  op=0.5; s.style.pointerEvents='none'; }
                else if (diff === 1)  { z=4; sc=mobile ? 0.8 : 0.85; tx=mobile ?  80 :  105; ry=-35; op=0.5; s.style.pointerEvents='none'; }
                else                  { z=1; sc=0.6;             tx=0;              ry=0;  op=0;   s.style.pointerEvents='none'; }

                s.style.transform = `translateX(${tx}%) perspective(1200px) rotateY(${ry}deg) scale(${sc})`;
                s.style.zIndex    = z;
                s.style.opacity   = op;
            });
        };

        nextBtn.addEventListener('click', () => { cur = (cur + 1) % total; update(); });
        prevBtn.addEventListener('click', () => { cur = (cur - 1 + total) % total; update(); });
        window.addEventListener('resize', update);
        update();
    }

    /* ── 10. Skill card 3-D tilt on hover ─────────── */
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
            const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
            card.style.transform = `perspective(600px) rotateX(${-dy*12}deg) rotateY(${dx*12}deg) scale(1.08)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    /* ── 11. Magnetic buttons ─────────────────────── */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r  = btn.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width  / 2) * 0.15;
            const dy = (e.clientY - r.top  - r.height / 2) * 0.15;
            btn.style.transform = `translate(${dx}px,${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    /* ── 12. Cursor glow ──────────────────────────── */
    const cg = document.createElement('div');
    Object.assign(cg.style, {
        position:'fixed', width:'320px', height:'320px', borderRadius:'50%',
        background:'radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)',
        pointerEvents:'none', zIndex:'0',
        transform:'translate(-50%,-50%)',
        transition:'left 0.1s ease,top 0.1s ease',
        willChange:'left,top',
    });
    document.body.appendChild(cg);
    document.addEventListener('mousemove', e => {
        cg.style.left = e.clientX + 'px';
        cg.style.top  = e.clientY + 'px';
    });

});
