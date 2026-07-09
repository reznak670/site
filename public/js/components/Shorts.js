// /front/js/components/Shorts.js
class ShortsComponent {
    constructor() {
        this.shorts = [];
        this.currentIndex = 0;
        this.isPlaying = true;
        this.container = null;
        this.videoPlayer = null;
        this.progressBar = null;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.isSwiping = false;
        this.autoPlayTimer = null;
        
        this.init();
    }

    init() {
        this.createStyles();
        this.createContainer();
        this.loadShorts();
        this.setupEventListeners();
        this.setupKeyboardControls();
    }

    createStyles() {
        const styles = `
            .shorts-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: #000;
                z-index: 9999;
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                animation: fadeIn 0.3s ease;
            }

            .shorts-container.active {
                display: flex;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }

            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes slideDown {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .shorts-close {
                position: absolute;
                top: 20px;
                right: 20px;
                z-index: 100;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 28px;
                padding: 10px 16px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s;
                backdrop-filter: blur(10px);
                font-family: Arial, sans-serif;
                line-height: 1;
            }

            .shorts-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1) rotate(90deg);
            }

            .shorts-player-wrapper {
                position: relative;
                width: 100%;
                max-width: 400px;
                height: 100vh;
                max-height: 800px;
                background: #1a1a1a;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.8);
            }

            .shorts-video {
                width: 100%;
                height: 100%;
                object-fit: cover;
                cursor: pointer;
            }

            .shorts-info {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 60px 20px 30px;
                background: linear-gradient(transparent, rgba(0,0,0,0.8));
                color: white;
                animation: slideUp 0.3s ease;
            }

            .shorts-title {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 5px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }

            .shorts-description {
                font-size: 14px;
                opacity: 0.8;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }

            .shorts-progress-container {
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                display: flex;
                gap: 4px;
                z-index: 50;
            }

            .shorts-progress-bar {
                flex: 1;
                height: 3px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
                overflow: hidden;
                cursor: pointer;
            }

            .shorts-progress-bar .progress-fill {
                height: 100%;
                background: white;
                border-radius: 2px;
                width: 0%;
                transition: width 0.1s linear;
            }

            .shorts-progress-bar.active .progress-fill {
                animation: progressAnimation 5s linear forwards;
            }

            @keyframes progressAnimation {
                from { width: 0%; }
                to { width: 100%; }
            }

            .shorts-navigation {
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                transform: translateY(-50%);
                display: flex;
                justify-content: space-between;
                padding: 0 10px;
                pointer-events: none;
                z-index: 40;
            }

            .shorts-nav-btn {
                pointer-events: all;
                background: rgba(255,255,255,0.1);
                border: none;
                color: white;
                font-size: 24px;
                padding: 20px 10px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
                backdrop-filter: blur(5px);
                opacity: 0;
            }

            .shorts-player-wrapper:hover .shorts-nav-btn {
                opacity: 0.7;
            }

            .shorts-nav-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1);
            }

            .shorts-counter {
                position: absolute;
                top: 80px;
                right: 20px;
                z-index: 50;
                color: white;
                font-size: 14px;
                background: rgba(0,0,0,0.5);
                padding: 6px 12px;
                border-radius: 20px;
                backdrop-filter: blur(5px);
                font-family: Arial, sans-serif;
            }

            .shorts-actions {
                position: absolute;
                right: 15px;
                bottom: 100px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                z-index: 50;
            }

            .shorts-action-btn {
                background: rgba(255,255,255,0.1);
                border: none;
                color: white;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;
                backdrop-filter: blur(5px);
                font-size: 20px;
                gap: 2px;
            }

            .shorts-action-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1);
            }

            .shorts-action-btn .label {
                font-size: 10px;
                opacity: 0.8;
            }

            .shorts-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 16px;
                z-index: 10;
            }

            .shorts-loading .spinner {
                width: 40px;
                height: 40px;
                margin: 0 auto 10px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            @media (max-width: 768px) {
                .shorts-player-wrapper {
                    max-height: 100vh;
                    border-radius: 0;
                }
                
                .shorts-nav-btn {
                    opacity: 0.3;
                    padding: 15px 8px;
                }
                
                .shorts-info {
                    padding: 40px 15px 20px;
                }
                
                .shorts-title {
                    font-size: 16px;
                }
                
                .shorts-description {
                    font-size: 12px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'shorts-container';
        this.container.innerHTML = `
            <button class="shorts-close" aria-label="Закрыть шортсы">✕</button>
            <div class="shorts-player-wrapper">
                <div class="shorts-loading">
                    <div class="spinner"></div>
                    <div>Загрузка...</div>
                </div>
                <video class="shorts-video" playsinline></video>
                <div class="shorts-progress-container"></div>
                <div class="shorts-counter">1 / 1</div>
                <div class="shorts-navigation">
                    <button class="shorts-nav-btn" data-direction="prev">‹</button>
                    <button class="shorts-nav-btn" data-direction="next">›</button>
                </div>
                <div class="shorts-actions">
                    <button class="shorts-action-btn" data-action="like">
                        ❤️
                        <span class="label">0</span>
                    </button>
                    <button class="shorts-action-btn" data-action="comment">
                        💬
                        <span class="label">0</span>
                    </button>
                    <button class="shorts-action-btn" data-action="share">
                        🔗
                        <span class="label">Поделиться</span>
                    </button>
                </div>
                <div class="shorts-info">
                    <div class="shorts-title">Загрузка...</div>
                    <div class="shorts-description"></div>
                </div>
            </div>
        `;

        document.body.appendChild(this.container);
        
        this.videoPlayer = this.container.querySelector('.shorts-video');
        this.progressContainer = this.container.querySelector('.shorts-progress-container');
        this.counter = this.container.querySelector('.shorts-counter');
        this.titleEl = this.container.querySelector('.shorts-title');
        this.descEl = this.container.querySelector('.shorts-description');
        this.loadingEl = this.container.querySelector('.shorts-loading');
    }

    loadShorts() {
        // Данные для шортсов (можно загружать с сервера)
        this.shorts = [
            {
                id: 1,
                title: "🎮 Крутой момент",
                description: "Невероятный момент в игре!",
                video: "/video/short1.mp4",
                likes: 42,
                comments: 12
            },
            {
                id: 2,
                title: "🔥 Эпичный фрагмент",
                description: "Лучший фрагмент сегодняшней игры",
                video: "/video/short2.mp4",
                likes: 87,
                comments: 23
            },
            {
                id: 3,
                title: "😄 Прикол дня",
                description: "Смешная ситуация на стриме",
                video: "/video/short3.mp4",
                likes: 156,
                comments: 45
            }
        ];

        // Если видео нет, создаем тестовые
        if (this.shorts.length === 0) {
            this.shorts.push({
                id: 1,
                title: "📹 Тестовое видео",
                description: "Добавьте свои видео в папку /front/video/",
                video: "",
                likes: 0,
                comments: 0
            });
        }

        this.updateCounter();
        this.loadShort(0);
    }

    loadShort(index) {
        if (!this.shorts.length) return;
        
        this.currentIndex = Math.max(0, Math.min(index, this.shorts.length - 1));
        const short = this.shorts[this.currentIndex];
        
        this.showLoading();
        
        // Обновляем информацию
        this.titleEl.textContent = short.title || 'Без названия';
        this.descEl.textContent = short.description || '';
        this.updateCounter();
        this.updateLikes(short.likes || 0);
        this.updateComments(short.comments || 0);

        // Загружаем видео
        if (short.video) {
            this.videoPlayer.src = short.video;
            this.videoPlayer.load();
            
            this.videoPlayer.onloadeddata = () => {
                this.hideLoading();
                this.playVideo();
                this.createProgressBars();
            };
            
            this.videoPlayer.onerror = () => {
                this.hideLoading();
                this.showError('Не удалось загрузить видео');
            };
        } else {
            this.hideLoading();
            this.showError('Видео не найдено');
        }
    }

    createProgressBars() {
        this.progressContainer.innerHTML = '';
        for (let i = 0; i < this.shorts.length; i++) {
            const bar = document.createElement('div');
            bar.className = 'shorts-progress-bar';
            if (i === this.currentIndex) {
                bar.classList.add('active');
            }
            bar.innerHTML = '<div class="progress-fill"></div>';
            this.progressContainer.appendChild(bar);
        }
    }

    updateProgress() {
        const bars = this.progressContainer.querySelectorAll('.shorts-progress-bar');
        bars.forEach((bar, index) => {
            bar.classList.toggle('active', index === this.currentIndex);
            const fill = bar.querySelector('.progress-fill');
            if (index === this.currentIndex) {
                fill.style.animation = 'none';
                void fill.offsetHeight; // Trigger reflow
                fill.style.animation = 'progressAnimation 5s linear forwards';
            } else if (index < this.currentIndex) {
                fill.style.width = '100%';
                fill.style.animation = 'none';
            } else {
                fill.style.width = '0%';
                fill.style.animation = 'none';
            }
        });
    }

    playVideo() {
        this.isPlaying = true;
        this.videoPlayer.play().catch(() => {});
        this.updateProgress();
        this.startAutoPlay();
    }

    pauseVideo() {
        this.isPlaying = false;
        this.videoPlayer.pause();
        this.stopAutoPlay();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pauseVideo();
        } else {
            this.playVideo();
        }
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setTimeout(() => {
            this.nextShort();
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    nextShort() {
        if (this.currentIndex < this.shorts.length - 1) {
            this.loadShort(this.currentIndex + 1);
        } else {
            this.closeShorts();
        }
    }

    prevShort() {
        if (this.currentIndex > 0) {
            this.loadShort(this.currentIndex - 1);
        }
    }

    updateCounter() {
        this.counter.textContent = `${this.currentIndex + 1} / ${this.shorts.length}`;
    }

    updateLikes(count) {
        const btn = this.container.querySelector('[data-action="like"]');
        btn.querySelector('.label').textContent = count || 0;
    }

    updateComments(count) {
        const btn = this.container.querySelector('[data-action="comment"]');
        btn.querySelector('.label').textContent = count || 0;
    }

    showLoading() {
        if (this.loadingEl) {
            this.loadingEl.style.display = 'block';
        }
    }

    hideLoading() {
        if (this.loadingEl) {
            this.loadingEl.style.display = 'none';
        }
    }

    showError(message) {
        this.titleEl.textContent = '❌ Ошибка';
        this.descEl.textContent = message;
    }

    openShorts() {
        this.container.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.playVideo();
    }

    closeShorts() {
        this.container.classList.remove('active');
        document.body.style.overflow = '';
        this.pauseVideo();
    }

    setupEventListeners() {
        // Кнопка закрытия
        this.container.querySelector('.shorts-close').addEventListener('click', () => {
            this.closeShorts();
        });

        // Клик по видео для паузы/воспроизведения
        this.videoPlayer.addEventListener('click', () => {
            this.togglePlay();
        });

        // Навигация
        this.container.querySelector('[data-direction="prev"]').addEventListener('click', (e) => {
            e.stopPropagation();
            this.prevShort();
        });

        this.container.querySelector('[data-direction="next"]').addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextShort();
        });

        // Действия
        this.container.querySelector('[data-action="like"]').addEventListener('click', (e) => {
            e.stopPropagation();
            const btn = e.currentTarget;
            const current = parseInt(btn.querySelector('.label').textContent) || 0;
            btn.querySelector('.label').textContent = current + 1;
            btn.style.transform = 'scale(1.3)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 300);
        });

        this.container.querySelector('[data-action="share"]').addEventListener('click', (e) => {
            e.stopPropagation();
            const url = window.location.href;
            if (navigator.share) {
                navigator.share({
                    title: this.shorts[this.currentIndex].title,
                    url: url
                });
            } else {
                navigator.clipboard.writeText(url).then(() => {
                    const btn = e.currentTarget;
                    const label = btn.querySelector('.label');
                    const originalText = label.textContent;
                    label.textContent = '✅ Скопировано!';
                    setTimeout(() => {
                        label.textContent = originalText;
                    }, 2000);
                });
            }
        });

        // Свайпы для мобильных устройств
        const player = this.container.querySelector('.shorts-player-wrapper');
        player.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
            this.isSwiping = true;
        }, { passive: true });

        player.addEventListener('touchmove', (e) => {
            if (!this.isSwiping) return;
            this.touchEndY = e.touches[0].clientY;
        }, { passive: true });

        player.addEventListener('touchend', () => {
            if (!this.isSwiping) return;
            this.isSwiping = false;
            
            const diff = this.touchStartY - this.touchEndY;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextShort();
                } else {
                    this.prevShort();
                }
            }
            
            this.touchStartY = 0;
            this.touchEndY = 0;
        }, { passive: true });

        // Клик по прогресс-бару
        this.progressContainer.addEventListener('click', (e) => {
            const bar = e.target.closest('.shorts-progress-bar');
            if (!bar) return;
            
            const index = Array.from(this.progressContainer.children).indexOf(bar);
            if (index !== -1 && index !== this.currentIndex) {
                this.loadShort(index);
            }
        });

        // Окончание видео
        this.videoPlayer.addEventListener('ended', () => {
            this.nextShort();
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.container.classList.contains('active')) {
                this.closeShorts();
            }
        });
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.container.classList.contains('active')) return;
            
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    this.nextShort();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.prevShort();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePlay();
                    break;
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.shortsComponent = new ShortsComponent();
});

// Функция для открытия шортсов из других мест
function openShorts() {
    if (window.shortsComponent) {
        window.shortsComponent.openShorts();
    }
}
