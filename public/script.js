// Bloody Scissors — главный скрipt. Одна точка входа, именованные init-функции.

// На мобильной версии оставляем только эффект VHS — остальные декоративные
// анимации (параллакс, капли крови, плавное появление секций, авто-прокрутка
// ленты шортсов) там просто не запускаем.
function isMobileView() {
    return window.matchMedia('(max-width: 768px)').matches;
}

document.addEventListener('DOMContentLoaded', () => {
    initTimestamp();
    initGlitch();
    initNav();
    initHeroVideo();
    initSectionBackgrounds();
    initSectionReveal();
    initParallax();
    initAudioPlayer();
    initDynamicTracks();
    initShorts();
    initClip();
    initBloodClicks();
    initSaveData();
    initAdminGesture();

    console.log('Bloody Scissors — КОЗААА!');
});

// ============ СЕКРЕТНЫЙ ВХОД В АДМИНКУ ============
// Десктоп: 5x буква "g" с клавиатуры. Мобильная версия (клавиатуры нет):
// 5 тапов по букве "К" в приветственной надписи "КОЗААА" на главном экране.
function initAdminGesture() {
    const RESET_MS = 1200;

    let count = 0;
    let lastTime = 0;
    document.addEventListener('keydown', (e) => {
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || (document.activeElement && document.activeElement.isContentEditable)) return;
        if (e.key.toLowerCase() !== 'g') { count = 0; return; }

        const now = Date.now();
        if (now - lastTime > RESET_MS) count = 0;
        lastTime = now;
        count++;

        if (count >= 5) {
            count = 0;
            window.location.href = '/admin';
        }
    });

    const kozaK = document.getElementById('kozaK');
    if (!kozaK) return;
    let tapCount = 0;
    let lastTap = 0;
    kozaK.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastTap > RESET_MS) tapCount = 0;
        lastTap = now;
        tapCount++;

        if (tapCount >= 5) {
            tapCount = 0;
            window.location.href = '/admin';
        }
    });
}

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
    if (isMobileView()) return;
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
    if (isMobileView()) return;
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

// ============ АУДИОПЛЕЕР (список в духе Spotify/VK + нижний бар "сейчас играет") ============
// bindTrackRow вынесена на уровень модуля, чтобы строки, добавленные позже через
// initDynamicTracks (треки из админки), тоже получали плеер и делили один и тот же
// "текущий проигрываемый трек" со статичными строками — play/pause/timeupdate/ended
// у самого <audio> это единственный источник истины и для строки, и для нижнего бара.
let __trackPlayerCurrent = null;
let __nowPlayingAudio = null;
const __nowPlayingEls = {};

function __formatTrackTime(seconds) {
    if (!isFinite(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function initNowPlayingBar() {
    __nowPlayingEls.bar = document.getElementById('nowPlayingBar');
    if (!__nowPlayingEls.bar) return;
    __nowPlayingEls.name = document.getElementById('nowPlayingName');
    __nowPlayingEls.badge = document.getElementById('nowPlayingBadge');
    __nowPlayingEls.playBtn = document.getElementById('nowPlayingPlayBtn');
    __nowPlayingEls.current = document.getElementById('nowPlayingCurrent');
    __nowPlayingEls.duration = document.getElementById('nowPlayingDuration');
    __nowPlayingEls.seek = document.getElementById('nowPlayingSeek');
    __nowPlayingEls.fill = document.getElementById('nowPlayingFill');
    __nowPlayingEls.download = document.getElementById('nowPlayingDownload');
    __nowPlayingEls.close = document.getElementById('nowPlayingClose');

    __nowPlayingEls.playBtn.addEventListener('click', () => {
        if (!__nowPlayingAudio) return;
        if (__nowPlayingAudio.paused) __nowPlayingAudio.play().catch(() => {});
        else __nowPlayingAudio.pause();
    });

    function seek(e) {
        if (!__nowPlayingAudio || !__nowPlayingAudio.duration) return;
        const rect = __nowPlayingEls.seek.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const ratio = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1));
        __nowPlayingAudio.currentTime = ratio * __nowPlayingAudio.duration;
    }
    __nowPlayingEls.seek.addEventListener('click', seek);
    __nowPlayingEls.seek.addEventListener('touchstart', seek, { passive: true });
    __nowPlayingEls.seek.addEventListener('touchmove', seek);

    __nowPlayingEls.close.addEventListener('click', () => {
        if (__nowPlayingAudio) { __nowPlayingAudio.pause(); __nowPlayingAudio.currentTime = 0; }
        hideNowPlaying();
    });
}

function showNowPlaying(row, audio) {
    if (!__nowPlayingEls.bar) return;
    __nowPlayingAudio = audio;
    __nowPlayingEls.name.textContent = row.dataset.name || '';
    __nowPlayingEls.badge.textContent = row.dataset.badge || '';
    __nowPlayingEls.download.href = audio.currentSrc || audio.src;
    __nowPlayingEls.bar.classList.add('is-active');
    document.body.classList.add('has-now-playing');
    updateNowPlayingIcon();
}

function updateNowPlayingIcon() {
    if (!__nowPlayingEls.playBtn) return;
    const use = __nowPlayingEls.playBtn.querySelector('use');
    const playing = __nowPlayingAudio && !__nowPlayingAudio.paused;
    if (use) use.setAttribute('href', playing ? '#icon-pause' : '#icon-play');
}

function updateNowPlayingProgress(audio) {
    if (!__nowPlayingEls.bar || __nowPlayingAudio !== audio || !audio.duration) return;
    __nowPlayingEls.fill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
    __nowPlayingEls.current.textContent = __formatTrackTime(audio.currentTime);
    __nowPlayingEls.duration.textContent = __formatTrackTime(audio.duration);
}

function hideNowPlaying() {
    if (!__nowPlayingEls.bar) return;
    __nowPlayingEls.bar.classList.remove('is-active');
    document.body.classList.remove('has-now-playing');
    __nowPlayingAudio = null;
}

function bindTrackRow(row) {
    const audio = row.querySelector('.track-audio');
    const playBtn = row.querySelector('.track-row-play');
    const progressFill = row.querySelector('.track-progress-fill');
    const progressBar = row.querySelector('.track-progress');
    const timeDisplay = row.querySelector('.track-time');
    if (!audio || !playBtn) return;

    function setRowPlaying(playing) {
        playBtn.classList.toggle('is-playing', playing);
        row.classList.toggle('is-playing', playing);
    }

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            if (__trackPlayerCurrent && __trackPlayerCurrent !== audio) __trackPlayerCurrent.pause();
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    });

    audio.addEventListener('play', () => {
        __trackPlayerCurrent = audio;
        setRowPlaying(true);
        showNowPlaying(row, audio);
    });
    audio.addEventListener('pause', () => {
        setRowPlaying(false);
        if (__nowPlayingAudio === audio) updateNowPlayingIcon();
    });
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            progressFill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
            timeDisplay.textContent = __formatTrackTime(audio.currentTime);
        }
        updateNowPlayingProgress(audio);
    });
    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        setRowPlaying(false);
        progressFill.style.width = '0%';
        timeDisplay.textContent = '00:00';
        if (__nowPlayingAudio === audio) hideNowPlaying();
    });
    audio.addEventListener('error', () => {
        playBtn.disabled = true;
        playBtn.style.opacity = '0.4';
    });

    if (progressBar) {
        function seekRow(e) {
            if (!audio.duration) return;
            const rect = progressBar.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const ratio = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1));
            audio.currentTime = ratio * audio.duration;
        }
        progressBar.addEventListener('click', seekRow);
        progressBar.addEventListener('touchstart', seekRow, { passive: true });
        progressBar.addEventListener('touchmove', seekRow);
    }
}

function initAudioPlayer() {
    initNowPlayingBar();
    document.querySelectorAll('.track-row:not(.track-row--empty)').forEach(bindTrackRow);
}

// ============ ТРЕКИ ИЗ АДМИНКИ (подгружаются и дорисовываются в список) ============
function escapeHtml(str) {
    return String(str == null ? '' : str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildTrackRow(track, index) {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.dataset.name = track.name || '';
    row.dataset.badge = track.badge || 'НОВЫЙ';
    const num = String(index).padStart(2, '0');
    row.innerHTML = `
        <button class="track-row-play" aria-label="Играть">
            <span class="track-row-num">${num}</span>
            <svg class="icon icon--solid track-row-play-icon"><use href="#icon-play"/></svg>
        </button>
        <div class="track-row-main">
            <div class="track-row-title-line">
                <h3 class="track-row-name">${escapeHtml(track.name)}</h3>
                <span class="track-badge track-badge--${escapeHtml(track.badgeVariant || 'new')}">${escapeHtml(track.badge || 'НОВЫЙ')}</span>
            </div>
            <p class="track-row-desc">${escapeHtml(track.desc || '')}</p>
        </div>
        <div class="track-row-progress">
            <div class="track-progress"><div class="track-progress-fill"></div></div>
            <span class="track-time">00:00</span>
        </div>
        <a class="track-row-download" href="${escapeHtml(track.src)}" download aria-label="Скачать трек">
            <svg class="icon"><use href="#icon-download"/></svg>
        </a>
        <audio class="track-audio" src="${escapeHtml(track.src)}" preload="none"></audio>`;
    return row;
}

async function initDynamicTracks() {
    const list = document.querySelector('.tracks-list');
    if (!list) return;
    try {
        const res = await fetch('/api/tracks');
        if (!res.ok) return;
        const { tracks } = await res.json();
        if (!tracks || !tracks.length) return;

        const emptySlots = Array.from(list.querySelectorAll('.track-row--empty'));
        let nextIndex = list.querySelectorAll('.track-row:not(.track-row--empty)').length + 1;
        tracks.forEach((track) => {
            const row = buildTrackRow(track, nextIndex++);
            const slot = emptySlots.shift();
            if (slot) slot.replaceWith(row);
            else list.appendChild(row);
            bindTrackRow(row);
        });
    } catch {}
}

// ============ ШОРТСЫ (лента с драгом + вертикальная TikTok-лента) ============
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

    const track = document.getElementById('shortsTrack');
    const carousel = document.getElementById('shortsCarousel');
    const feed = document.getElementById('shortsFeed');
    if (!carousel || !feed) return;

    initShortsRibbon(carousel, (card) => {
        const idx = indexByVideo.get(card.dataset.video);
        if (idx != null) openFeed(idx);
    });

    // ---- уникальные шортсы (дедуп по видео) для вертикальной ленты ----
    const seen = new Map();
    Array.from(carousel.querySelectorAll('.short-card')).forEach(card => {
        const src = card.dataset.video;
        if (!src || seen.has(src)) return;
        seen.set(src, { video: src, title: card.dataset.title || '', desc: card.dataset.desc || '' });
    });
    const shorts = Array.from(seen.values());
    const indexByVideo = new Map(shorts.map((s, i) => [s.video, i]));

    const feedScroll = document.getElementById('shortsFeedScroll');
    const feedClose = document.getElementById('shortsFeedClose');
    const feedMuteBtn = document.getElementById('shortsFeedMute');
    const feedPrev = document.getElementById('shortsFeedPrev');
    const feedNext = document.getElementById('shortsFeedNext');
    const feedHint = document.getElementById('shortsFeedHint');
    const feedCounter = document.getElementById('shortsFeedCounter');

    let feedBuilt = false;
    let feedMuted = true;
    let activeVideo = null;
    let currentIndex = 0;
    let hintShown = false;
    let feedObserver = null;

    function setMuteIcon() {
        if (!feedMuteBtn) return;
        feedMuteBtn.innerHTML = `<svg class="icon"><use href="#icon-${feedMuted ? 'mute' : 'sound'}"/></svg>`;
    }

    function updateNavButtons() {
        if (feedPrev) feedPrev.disabled = currentIndex <= 0;
        if (feedNext) feedNext.disabled = currentIndex >= shorts.length - 1;
        if (feedCounter) feedCounter.textContent = `${currentIndex + 1} / ${shorts.length}`;
    }

    function buildFeedSlides() {
        shorts.forEach((s, i) => {
            const slide = document.createElement('div');
            slide.className = 'shorts-feed-slide';
            slide.dataset.index = String(i);

            const bg = document.createElement('video');
            bg.className = 'shorts-feed-slide-bg';
            bg.src = s.video; bg.muted = true; bg.loop = true; bg.playsInline = true; bg.preload = 'none'; bg.setAttribute('aria-hidden', 'true');

            const vid = document.createElement('video');
            vid.className = 'shorts-feed-video';
            vid.src = s.video; vid.loop = true; vid.playsInline = true; vid.preload = 'none';

            const playIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            playIcon.setAttribute('class', 'icon icon--solid shorts-feed-playicon');
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttribute('href', '#icon-play');
            playIcon.appendChild(use);

            const info = document.createElement('div');
            info.className = 'shorts-feed-info';
            const h3 = document.createElement('h3');
            h3.className = 'shorts-feed-title'; h3.textContent = s.title;
            const p = document.createElement('p');
            p.className = 'shorts-feed-desc'; p.textContent = s.desc;
            info.appendChild(h3); info.appendChild(p);

            slide.appendChild(bg); slide.appendChild(vid); slide.appendChild(playIcon); slide.appendChild(info);

            slide.addEventListener('click', () => {
                if (vid.paused) { vid.play().catch(() => {}); slide.classList.remove('is-paused'); }
                else { vid.pause(); slide.classList.add('is-paused'); }
            });

            feedScroll.appendChild(slide);
        });

        feedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const slide = entry.target;
                const vid = slide.querySelector('.shorts-feed-video');
                const bg = slide.querySelector('.shorts-feed-slide-bg');
                if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                    currentIndex = Number(slide.dataset.index);
                    updateNavButtons();
                    if (activeVideo && activeVideo !== vid) activeVideo.pause();
                    vid.muted = feedMuted;
                    vid.play().catch(() => {});
                    bg.play().catch(() => {});
                    activeVideo = vid;
                    slide.classList.remove('is-paused');
                } else {
                    vid.pause();
                    bg.pause();
                }
            });
        }, { root: feedScroll, threshold: [0, 0.6] });

        feedScroll.querySelectorAll('.shorts-feed-slide').forEach(s => feedObserver.observe(s));
        feedBuilt = true;
    }

    function goToSlide(i) {
        const clamped = Math.max(0, Math.min(shorts.length - 1, i));
        const slide = feedScroll.querySelector(`.shorts-feed-slide[data-index="${clamped}"]`);
        if (slide) feedScroll.scrollTo({ top: slide.offsetTop, behavior: 'smooth' });
    }

    function openFeed(index) {
        if (!feedBuilt) buildFeedSlides();
        feed.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        const slide = feedScroll.querySelector(`.shorts-feed-slide[data-index="${index}"]`);
        feedScroll.scrollTop = slide ? slide.offsetTop : 0;
        currentIndex = index;
        updateNavButtons();
        if (feedHint) {
            feedHint.classList.toggle('is-hidden', hintShown);
            if (!hintShown) { hintShown = true; setTimeout(() => feedHint.classList.add('is-hidden'), 2200); }
        }
    }

    function closeFeed() {
        feed.classList.remove('is-active');
        document.body.style.overflow = '';
        feedScroll.querySelectorAll('.shorts-feed-video, .shorts-feed-slide-bg').forEach(v => v.pause());
        activeVideo = null;
    }

    if (feedClose) feedClose.addEventListener('click', closeFeed);
    if (feedMuteBtn) {
        setMuteIcon();
        feedMuteBtn.addEventListener('click', () => {
            feedMuted = !feedMuted;
            if (activeVideo) activeVideo.muted = feedMuted;
            setMuteIcon();
        });
    }
    if (feedPrev) feedPrev.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (feedNext) feedNext.addEventListener('click', () => goToSlide(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (!feed.classList.contains('is-active')) return;
        if (e.key === 'Escape') closeFeed();
        else if (e.key === 'ArrowDown') { e.preventDefault(); goToSlide(currentIndex + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); goToSlide(currentIndex - 1); }
    });
}

// ---- горизонтальная лента шортсов: авто-прокрутка + перетаскивание рукой ----
// Тап определяется целиком через pointer-события (не полагаемся на нативный
// click после setPointerCapture — в части браузеров он не долетает надёжно).
function initShortsRibbon(carousel, onCardTap) {
    const state = { wasDragged: false };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AUTO_SPEED = (reduceMotion || isMobileView()) ? 0 : 0.032; // px/ms — на мобильной версии только ручной драг, без авто-хода
    const TAP_MAX_DIST = 10; // px — терпимее к дрожанию пальца/мыши
    const TAP_MAX_MS = 600;

    let loopWidth = 0;
    function measure() { loopWidth = carousel.scrollWidth / 2 || 1; }
    measure();
    window.addEventListener('resize', measure);

    let pos = 0;
    let velocity = 0;
    let dragging = false;
    let hovering = false;
    let lastX = 0;
    let lastMoveT = 0;
    let startX = 0;
    let startY = 0;
    let startT = 0;
    let downTarget = null;

    function apply() {
        pos = ((pos % loopWidth) + loopWidth) % loopWidth;
        carousel.style.transform = `translate3d(${-pos}px,0,0)`;
    }

    function frame(t) {
        if (!dragging) {
            if (Math.abs(velocity) > 0.002) {
                pos += velocity * (16.7);
                velocity *= 0.94;
            } else if (!hovering) {
                pos += AUTO_SPEED * 16.7;
            }
        }
        apply();
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    carousel.addEventListener('pointerdown', (e) => {
        dragging = true;
        state.wasDragged = false;
        velocity = 0;
        lastX = e.clientX;
        startX = e.clientX;
        startY = e.clientY;
        startT = performance.now();
        lastMoveT = startT;
        downTarget = e.target.closest ? e.target.closest('.short-card') : null;
        carousel.classList.add('is-dragging');
        try { carousel.setPointerCapture(e.pointerId); } catch {}
    });

    carousel.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const now = performance.now();
        const dx = e.clientX - lastX;
        const totalDist = Math.hypot(e.clientX - startX, e.clientY - startY);
        if (totalDist > TAP_MAX_DIST) state.wasDragged = true;
        pos -= dx;
        const dt = Math.max(1, now - lastMoveT);
        velocity = -dx / dt; // px/ms
        lastX = e.clientX;
        lastMoveT = now;
    });

    function endDrag(e) {
        if (!dragging) return;
        dragging = false;
        carousel.classList.remove('is-dragging');
        try { carousel.releasePointerCapture(e.pointerId); } catch {}
        const duration = performance.now() - startT;
        if (!state.wasDragged && duration < TAP_MAX_MS && downTarget && typeof onCardTap === 'function') {
            onCardTap(downTarget);
        }
    }
    carousel.addEventListener('pointerup', endDrag);
    carousel.addEventListener('pointercancel', () => {
        dragging = false;
        carousel.classList.remove('is-dragging');
    });

    if (window.matchMedia('(hover: hover)').matches) {
        carousel.addEventListener('pointerenter', () => { hovering = true; });
        carousel.addEventListener('pointerleave', () => { hovering = false; });
    }

    return state;
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
    if (isMobileView()) return;
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
