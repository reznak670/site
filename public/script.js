// Bloody Scissors — главный скрipt. Одна точка входа, именованные init-функции.
document.addEventListener('DOMContentLoaded', () => {
    initTimestamp();
    initGlitch();
    initNav();
    initHeroVideo();
    initSectionBackgrounds();
    initSectionReveal();
    initParallax();
    initAudioPlayer();
    initShorts();
    initClip();
    initBloodClicks();
    initSaveData();

    console.log('Bloody Scissors — КОЗААА!');
});

// ============ VHS ТАЙМКОД ============
function initTimestamp() {
    const el = document.getElementById('vhsTimestamp');
    if (!el) return;
    const tick = () => {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        el.textContent = `${h}:${m}:${s}`;
    };
    tick();
    setInterval(tick, 1000);
}

// ============ СЛУЧАЙНЫЕ ГЛИТЧИ ГЛОБАЛЬНОГО ОВЕРЛЕЯ ============
function initGlitch() {
    const grain = document.querySelector('.vhs-grain');
    if (!grain) return;
    setInterval(() => {
        if (Math.random() < 0.1) {
            grain.style.transform = `translateX(${Math.random() * 10 - 5}px)`;
            setTimeout(() => { grain.style.transform = ''; }, 50 + Math.random() * 100);
        }
    }, 500);
}

// ============ НАВИГАЦИЯ ============
function initNav() {
    const toggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('navMobile');
    if (toggle && mobileMenu) {
        const closeMobile = () => {
            toggle.classList.remove('is-active');
            toggle.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('is-open');
            document.body.style.overflow = '';
        };
        toggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('is-open');
            toggle.classList.toggle('is-active', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        mobileMenu.querySelectorAll('.nav-mobile-link').forEach(link => {
            link.addEventListener('click', closeMobile);
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section[id]');
    if (!navLinks.length || !sections.length) return;

    const setActive = (id) => {
        navLinks.forEach(link => link.classList.toggle('is-active', link.dataset.section === id));
    };

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(s => obs.observe(s));
}

// ============ ВИДЕО-ФОН ХИРО ============
function initHeroVideo() {
    const video = document.querySelector('.hero-video');
    const hero = document.getElementById('hero');
    if (!video || !hero) return;

    video.addEventListener('error', () => {
        const media = document.querySelector('.hero-media');
        if (media) media.style.background = 'radial-gradient(circle, #1a0000 0%, #0a0a0a 70%)';
    });

    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.style.cssText = 'position:absolute;bottom:70px;left:50%;transform:translateX(-50%);z-index:10;';
            btn.innerHTML = '<svg class="icon icon--solid"><use href="#icon-play"/></svg>ВКЛЮЧИТЬ ВИДЕО';
            btn.addEventListener('click', () => { video.muted = false; video.play(); btn.remove(); });
            hero.appendChild(btn);
        });
    }

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
        });
    }, { threshold: 0.1 });
    obs.observe(hero);

    setInterval(() => {
        if (Math.random() < 0.08) {
            video.style.filter = `brightness(0.55) contrast(1.6) saturate(0.75) hue-rotate(${Math.random() * 20 - 10}deg)`;
            video.style.transform = 'translate(-50%, -50%) scale(1.05)';
            setTimeout(() => {
                video.style.filter = '';
                video.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 100 + Math.random() * 200);
        }
    }, 2000);
}

// ============ ФОНОВЫЕ ИЗОБРАЖЕНИЯ СЕКЦИЙ ============
function initSectionBackgrounds() {
    const bgs = document.querySelectorAll('.section-bg');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('is-visible'), 200);
        });
    }, { threshold: 0.1 });

    bgs.forEach(bg => {
        obs.observe(bg);
        const match = bg.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (match) { const img = new Image(); img.src = match[1]; }
    });
}

// ============ ПЛАВНОЕ ПОЯВЛЕНИЕ СЕКЦИЙ ============
function initSectionReveal() {
    const sections = document.querySelectorAll('.section');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(s => {
        if (s.id === 'hero') return;
        s.style.opacity = '0';
        s.style.transform = 'translateY(50px)';
        s.style.transition = 'opacity 1s ease, transform 1s ease';
        obs.observe(s);
    });
}

// ============ ПАРАЛЛАКС ============
function initParallax() {
    const bgs = document.querySelectorAll('.section-bg');
    const kozaText = document.querySelector('#hero .koza-text');
    let ticking = false;

    function update() {
        ticking = false;
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        if (kozaText && scrollY < viewportHeight) {
            kozaText.style.transform = `scale(${1 + scrollY * 0.001})`;
        }

        bgs.forEach(bg => {
            const parent = bg.closest('.section');
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            if (rect.top < viewportHeight && rect.bottom > 0) {
                const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
                bg.style.transform = `translateY(${progress * 20 - 10}px)`;
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
}

// ============ АУДИОПЛЕЕР ============
function initAudioPlayer() {
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    function setIcon(btn, playing) {
        const use = btn.querySelector('use');
        if (use) use.setAttribute('href', playing ? '#icon-pause' : '#icon-play');
    }

    let current = null;

    document.querySelectorAll('.track-card').forEach(card => {
        const audio = card.querySelector('.track-audio');
        const playBtn = card.querySelector('.track-play');
        const progressFill = card.querySelector('.track-progress-fill');
        const progressBar = card.querySelector('.track-progress');
        const timeDisplay = card.querySelector('.track-time');
        if (!audio || !playBtn) return;

        let raf = null;
        function updateProgress() {
            if (audio.duration) {
                progressFill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
                timeDisplay.textContent = formatTime(audio.currentTime);
            }
            if (!audio.paused) raf = requestAnimationFrame(updateProgress);
        }
        function reset() {
            audio.pause(); audio.currentTime = 0;
            playBtn.classList.remove('is-playing'); setIcon(playBtn, false);
            progressFill.style.width = '0%'; timeDisplay.textContent = '00:00';
            if (raf) cancelAnimationFrame(raf);
        }

        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                if (current && current !== reset) current();
                audio.play().then(() => {
                    playBtn.classList.add('is-playing'); setIcon(playBtn, true);
                    updateProgress();
                    current = reset;
                }).catch(() => {});
            } else {
                reset();
                current = null;
            }
        });

        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                if (!audio.duration) return;
                const rect = progressBar.getBoundingClientRect();
                const ratio = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
                audio.currentTime = ratio * audio.duration;
                progressFill.style.width = ratio * 100 + '%';
                timeDisplay.textContent = formatTime(audio.currentTime);
            });
            progressBar.addEventListener('touchstart', (e) => seekTouch(e), { passive: true });
            progressBar.addEventListener('touchmove', (e) => seekTouch(e));
            function seekTouch(e) {
                if (!audio.duration) return;
                const rect = progressBar.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                const ratio = x / rect.width;
                audio.currentTime = ratio * audio.duration;
                progressFill.style.width = ratio * 100 + '%';
                timeDisplay.textContent = formatTime(audio.currentTime);
            }
        }

        audio.addEventListener('ended', () => { reset(); current = null; });
        audio.addEventListener('error', () => {
            playBtn.disabled = true;
            playBtn.style.opacity = '0.4';
        });
    });
}

// ============ ШОРТСЫ (карусель + модалка) ============
function initShorts() {
    document.querySelectorAll('.short-video').forEach(video => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) video.play().catch(() => {});
                else video.pause();
            });
        }, { threshold: 0.3 });
        obs.observe(video);
        video.addEventListener('error', () => { video.style.display = 'none'; });
    });

    const modal = document.getElementById('shortModal');
    const modalVideo = modal ? modal.querySelector('.short-modal-video') : null;
    const modalTitle = modal ? modal.querySelector('.short-modal-title') : null;
    if (!modal || !modalVideo) return;

    function closeModal() {
        modalVideo.pause();
        modalVideo.src = '';
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.short-card').forEach(card => {
        card.addEventListener('click', () => {
            const videoSrc = card.dataset.video;
            const title = card.dataset.title || '';
            const desc = card.dataset.desc || '';
            if (!videoSrc) return;
            modalVideo.src = videoSrc;
            if (modalTitle) modalTitle.textContent = `${title} — ${desc}`;
            modal.classList.add('is-active');
            modalVideo.play().catch(() => {});
            document.body.style.overflow = 'hidden';
        });
    });

    const closeBtn = modal.querySelector('.short-modal-close');
    const backdrop = modal.querySelector('.short-modal-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    let touchStartY = 0;
    modal.addEventListener('touchstart', (e) => {
        if (e.target === backdrop) touchStartY = e.touches[0].clientY;
    }, { passive: true });
    modal.addEventListener('touchmove', (e) => {
        if (e.target === backdrop && e.touches[0].clientY - touchStartY > 50) closeModal();
    }, { passive: true });
}

// ============ КЛИП ============
function initClip() {
    const video = document.querySelector('.clip-video');
    const frame = document.querySelector('.clip-frame');
    if (video && frame) {
        video.addEventListener('error', () => {
            const msg = document.createElement('div');
            msg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#ff1744;font-family:var(--font-display);font-size:1.2vw;z-index:3;display:flex;align-items:center;gap:0.5em;white-space:nowrap;';
            msg.innerHTML = '<svg class="icon" style="width:1.4em;height:1.4em;"><use href="#icon-warning"/></svg>ВИДЕО НЕ НАЙДЕНО';
            frame.appendChild(msg);
        });
    }
    const fullscreenBtn = document.getElementById('clipFullscreenBtn');
    if (fullscreenBtn && video) {
        fullscreenBtn.addEventListener('click', () => video.requestFullscreen?.());
    }
}

// ============ КАПЛИ КРОВИ ПРИ КЛИКЕ ============
function initBloodClicks() {
    const style = document.createElement('style');
    style.textContent = '@keyframes bloodDrop{0%{transform:translateY(0) scale(1) rotate(0deg);opacity:1}100%{transform:translateY(100px) scale(3) rotate(360deg);opacity:0}}';
    document.head.appendChild(style);

    document.addEventListener('click', (e) => {
        for (let i = 0; i < 3; i++) {
            const drop = document.createElement('div');
            drop.style.cssText = `position:fixed;width:${4 + Math.random() * 8}px;height:${4 + Math.random() * 8}px;background:#ff1744;border-radius:50%;pointer-events:none;z-index:99999;left:${e.clientX + (Math.random() - 0.5) * 20}px;top:${e.clientY + (Math.random() - 0.5) * 20}px;animation:bloodDrop ${0.5 + Math.random()}s ease-out forwards;box-shadow:0 0 ${5 + Math.random() * 15}px #ff1744;`;
            document.body.appendChild(drop);
            setTimeout(() => drop.remove(), 800);
        }
    });
}

// ============ ЭКОНОМИЯ ТРАФИКА НА МЕДЛЕННОЙ СВЯЗИ ============
function initSaveData() {
    if (!('connection' in navigator)) return;
    const connection = navigator.connection;
    if (!(connection.saveData || connection.effectiveType === '2g')) return;

    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) { heroVideo.pause(); heroVideo.style.display = 'none'; }
    document.querySelectorAll('.short-video').forEach(v => { v.pause(); v.style.display = 'none'; });
}
