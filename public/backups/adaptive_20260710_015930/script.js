// Bloody Scissors - Главный скрипт
document.addEventListener('DOMContentLoaded', function() {

    // ============ VHS ТАЙМКОД ============
    function updateTimestamp() {
        const timestamp = document.querySelector('.vhs-timestamp');
        if (timestamp) {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            timestamp.textContent = `REC ● ${h}:${m}:${s}`;
        }
    }
    setInterval(updateTimestamp, 1000);
    updateTimestamp();

    // ============ СЛУЧАЙНЫЕ ГЛИТЧИ ============
    function randomGlitch() {
        const overlay = document.querySelector('.vhs-overlay');
        if (overlay && Math.random() < 0.1) {
            overlay.style.transform = `translateX(${Math.random() * 10 - 5}px)`;
            setTimeout(() => { overlay.style.transform = 'translateX(0)'; }, 50 + Math.random() * 100);
        }
    }
    setInterval(randomGlitch, 500);

    // ============ ВИДЕО-ФОН ============
    const concertVideo = document.querySelector('.concert-video');
    if (concertVideo) {
        concertVideo.addEventListener('error', () => {
            const videoBg = document.querySelector('.video-background');
            if (videoBg) videoBg.style.background = 'radial-gradient(circle, #1a0000 0%, #0a0a0a 70%)';
        });
        const playPromise = concertVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                const welcome = document.getElementById('welcome');
                if (welcome) {
                    const btn = document.createElement('button');
                    btn.textContent = '▶ ВКЛЮЧИТЬ ВИДЕО';
                    btn.style.cssText = 'position:absolute;bottom:60px;left:50%;transform:translateX(-50%);z-index:10;padding:10px 20px;background:rgba(255,23,68,0.8);border:1px solid #ff1744;color:#fff;font-family:Metal Mania,cursive;font-size:14px;cursor:pointer;';
                    btn.addEventListener('click', () => { concertVideo.muted = false; concertVideo.play(); btn.remove(); });
                    welcome.appendChild(btn);
                }
            });
        }
        // Пауза когда не видно
        const welcomeSection = document.getElementById('welcome');
        if (welcomeSection) {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) concertVideo.play().catch(() => {});
                    else concertVideo.pause();
                });
            }, { threshold: 0.1 });
            obs.observe(welcomeSection);
        }
        // Глитчи видео
        setInterval(() => {
            if (Math.random() < 0.08) {
                concertVideo.style.filter = `brightness(0.6) contrast(1.5) saturate(0.8) hue-rotate(${Math.random()*20-10}deg)`;
                concertVideo.style.transform = 'translate(-50%, -50%) scale(1.05)';
                setTimeout(() => {
                    concertVideo.style.filter = 'brightness(0.6) contrast(1.2) saturate(0.8)';
                    concertVideo.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 100 + Math.random() * 200);
            }
        }, 2000);
    }

    // ============ ФОНОВЫЕ ИЗОБРАЖЕНИЯ ============
    const bgImages = document.querySelectorAll('.section-bg-image');
    bgImages.forEach(bg => {
        bg.style.opacity = '0';
        bg.style.transition = 'opacity 1s ease-in-out';
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) setTimeout(() => { bg.style.opacity = '1'; }, 200); });
        }, { threshold: 0.1 });
        obs.observe(bg);
        const bgUrl = bg.style.backgroundImage;
        if (bgUrl && bgUrl !== 'none') {
            const img = new Image();
            img.src = bgUrl.replace(/url\(['"]?|['"]?\)/g, '');
        }
    });

    // ============ ПАРАЛЛАКС ============
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const welcome = document.getElementById('welcome');
        if (welcome) {
            const koza = welcome.querySelector('.koza-text');
            if (koza && scrollPosition < window.innerHeight) koza.style.transform = `scale(${1 + scrollPosition * 0.001})`;
        }
        document.querySelectorAll('.section-bg-image').forEach(bg => {
            const parent = bg.closest('.fullscreen');
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                bg.style.transform = `translateY(${progress * 20 - 10}px)`;
            }
        });
    });

    // ============ АУДИОПЛЕЕР ============
    let currentAudio = null, currentBtn = null, currentProgress = null, currentTime = null, animationId = null;
    document.querySelectorAll('.track-cell').forEach(cell => {
        const audio = cell.querySelector('.track-audio');
        const playBtn = cell.querySelector('.track-play-btn');
        const progressFill = cell.querySelector('.track-progress-fill');
        const timeDisplay = cell.querySelector('.track-time');
        const progressBar = cell.querySelector('.track-progress');
        if (!audio || !playBtn) return;

        function formatTime(seconds) {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }

        function updateProgress() {
            if (audio.duration) {
                progressFill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
                timeDisplay.textContent = formatTime(audio.currentTime);
            }
            if (!audio.paused) animationId = requestAnimationFrame(updateProgress);
        }

        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause(); currentAudio.currentTime = 0;
                    if (currentBtn) { currentBtn.textContent = '▶ ИГРАТЬ'; currentBtn.classList.remove('playing'); }
                    if (currentProgress) currentProgress.style.width = '0%';
                    if (currentTime) currentTime.textContent = '00:00';
                    if (animationId) cancelAnimationFrame(animationId);
                }
                audio.play().then(() => {
                    playBtn.textContent = '⏸ ПАУЗА'; playBtn.classList.add('playing');
                    currentAudio = audio; currentBtn = playBtn; currentProgress = progressFill; currentTime = timeDisplay;
                    updateProgress();
                }).catch(() => {});
            } else {
                audio.pause(); playBtn.textContent = '▶ ИГРАТЬ'; playBtn.classList.remove('playing');
                if (animationId) cancelAnimationFrame(animationId);
            }
        });

        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const seekTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
                audio.currentTime = seekTime;
                progressFill.style.width = ((e.clientX - rect.left) / rect.width) * 100 + '%';
                timeDisplay.textContent = formatTime(seekTime);
            });
        }

        audio.addEventListener('ended', () => {
            playBtn.textContent = '▶ ИГРАТЬ'; playBtn.classList.remove('playing');
            progressFill.style.width = '0%'; timeDisplay.textContent = '00:00';
            currentAudio = null; currentBtn = null;
            if (animationId) cancelAnimationFrame(animationId);
        });

        audio.addEventListener('error', () => {
            playBtn.textContent = '⚠ НЕТ ФАЙЛА';
            playBtn.style.color = '#888'; playBtn.style.borderColor = '#888';
        });
    });

    // ============ ШОРТСЫ ============
    document.querySelectorAll('.short-video-preview').forEach(video => {
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

    document.querySelectorAll('.short-item').forEach(item => {
        item.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-video');
            const title = this.querySelector('.short-title').textContent;
            const desc = this.querySelector('.short-desc').textContent;
            if (modal && modalVideo && videoSrc) {
                modalVideo.src = videoSrc;
                modalTitle.textContent = title + ' — ' + desc;
                modal.classList.add('active');
                modalVideo.play().catch(() => {});
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        if (modal && modalVideo) {
            modalVideo.pause(); modalVideo.src = '';
            modal.classList.remove('active'); document.body.style.overflow = '';
        }
    }
    const modalClose = modal ? modal.querySelector('.short-modal-close') : null;
    const modalBackdrop = modal ? modal.querySelector('.short-modal-backdrop') : null;
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // Скорость карусели
    const carousel = document.querySelector('.shorts-carousel');
    const container = document.querySelector('.shorts-carousel-container');
    if (container && carousel) {
        container.addEventListener('mouseenter', () => { carousel.style.animationPlayState = 'paused'; });
        container.addEventListener('mouseleave', () => { carousel.style.animationPlayState = 'running'; });
    }

    // ============ КЛИП ============
    const clipVideo = document.querySelector('.clip-video');
    if (clipVideo) {
        clipVideo.addEventListener('error', () => {
            const frame = document.querySelector('.clip-frame');
            if (frame) {
                const msg = document.createElement('div');
                msg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#ff1744;font-family:Metal Mania,cursive;font-size:2vw;z-index:3;';
                msg.textContent = '⚠ ВИДЕО НЕ НАЙДЕНО';
                frame.appendChild(msg);
            }
        });
    }

    // ============ КАПЛИ КРОВИ ПРИ КЛИКЕ ============
    document.addEventListener('click', function(e) {
        for (let i = 0; i < 3; i++) {
            const drop = document.createElement('div');
            drop.style.cssText = `position:fixed;width:${4+Math.random()*8}px;height:${4+Math.random()*8}px;background:#ff1744;border-radius:50%;pointer-events:none;z-index:99999;left:${e.clientX+(Math.random()-0.5)*20}px;top:${e.clientY+(Math.random()-0.5)*20}px;animation:bloodDrop ${0.5+Math.random()}s ease-out forwards;box-shadow:0 0 ${5+Math.random()*15}px #ff1744;`;
            document.body.appendChild(drop);
            setTimeout(() => drop.remove(), 800);
        }
    });

    const style = document.createElement('style');
    style.textContent = '@keyframes bloodDrop{0%{transform:translateY(0)scale(1)rotate(0deg);opacity:1}100%{transform:translateY(100px)scale(3)rotate(360deg);opacity:0}}';
    document.head.appendChild(style);

    // ============ ПЛАВНОЕ ПОЯВЛЕНИЕ СЕКЦИЙ ============
    const sections = document.querySelectorAll('.fullscreen');
    const sectionObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(s => {
        s.style.opacity = '0'; s.style.transform = 'translateY(50px)'; s.style.transition = 'all 1s ease';
        sectionObs.observe(s);
    });
    setTimeout(() => {
        const first = document.getElementById('welcome');
        if (first) { first.style.opacity = '1'; first.style.transform = 'translateY(0)'; }
    }, 100);

    console.log('🔪 Bloody Scissors - КОЗААА!');
    console.log('📼 VHS | 🎬 Видео-фон | 🎵 Аудиоплеер | 📽️ Шортсы | 🎸 Клип');
});
