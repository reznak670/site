// VHS и глитч эффекты для Bloody Scissors

document.addEventListener('DOMContentLoaded', function() {
    
    // Обновление таймкода VHS
    function updateTimestamp() {
        const timestamp = document.querySelector('.vhs-timestamp');
        if (timestamp) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            timestamp.textContent = `REC ● ${hours}:${minutes}:${seconds}`;
        }
    }
    setInterval(updateTimestamp, 1000);
    updateTimestamp();

    // Случайные глитчи
    function randomGlitch() {
        const overlay = document.querySelector('.vhs-overlay');
        if (overlay && Math.random() < 0.1) {
            overlay.style.transform = `translateX(${Math.random() * 10 - 5}px)`;
            setTimeout(() => {
                overlay.style.transform = 'translateX(0)';
            }, 50 + Math.random() * 100);
        }
        
        // Случайные скачки таймкода
        const timestamp = document.querySelector('.vhs-timestamp');
        if (timestamp && Math.random() < 0.05) {
            timestamp.style.color = '#ff1744';
            timestamp.style.textShadow = '0 0 10px #ff1744';
            setTimeout(() => {
                timestamp.style.color = 'rgba(255, 255, 255, 0.6)';
                timestamp.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.8)';
            }, 100);
        }
    }
    setInterval(randomGlitch, 500);

    // Предзагрузка изображений
    const cellsWithBg = document.querySelectorAll('.cell[style*="background-image"]');
    cellsWithBg.forEach(cell => {
        const bgImage = cell.style.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const img = new Image();
            const url = bgImage.replace(/url\(['"]?|['"]?\)/g, '');
            img.src = url;
            img.onload = function() {
                cell.style.transition = 'all 0.8s ease';
            };
        }
    });

    // Параллакс для фонов
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        const welcome = document.getElementById('welcome');
        if (welcome) {
            const kozaText = welcome.querySelector('.koza-text');
            if (kozaText && scrollPosition < window.innerHeight) {
                kozaText.style.transform = `scale(${1 + scrollPosition * 0.001})`;
            }
        }

        const cells = document.querySelectorAll('.cell[style*="background-image"]');
        cells.forEach(cell => {
            const rect = cell.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const windowCenter = window.innerHeight / 2;
            const offset = (centerY - windowCenter) * 0.05;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                cell.style.backgroundPosition = `center ${50 + offset}%`;
            }
        });
    });

    // Появление ячеек с глитч-эффектом
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach((cell, index) => {
        cell.style.opacity = '0';
        cell.style.transform = 'scale(0.8) skewX(2deg)';
        cell.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1) skewX(0deg)';
                    
                    // Добавляем случайный глитч при появлении
                    if (Math.random() < 0.3) {
                        const originalTransform = entry.target.style.transform;
                        entry.target.style.transform = 'scale(1.05) skewX(-3deg)';
                        setTimeout(() => {
                            entry.target.style.transform = originalTransform;
                        }, 100);
                    }
                }, 200);
            }
        });
    }, { threshold: 0.2 });

    allCells.forEach(cell => observer.observe(cell));

    // Эффект капель крови при клике
    document.addEventListener('click', function(e) {
        for (let i = 0; i < 3; i++) {
            const bloodDrop = document.createElement('div');
            bloodDrop.style.cssText = `
                position: fixed;
                width: ${4 + Math.random() * 8}px;
                height: ${4 + Math.random() * 8}px;
                background: #ff1744;
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                left: ${e.clientX + (Math.random() - 0.5) * 20}px;
                top: ${e.clientY + (Math.random() - 0.5) * 20}px;
                animation: bloodDrop ${0.5 + Math.random()}s ease-out forwards;
                box-shadow: 0 0 ${5 + Math.random() * 15}px #ff1744;
            `;
            document.body.appendChild(bloodDrop);
            
            setTimeout(() => bloodDrop.remove(), 800);
        }
    });

    // Стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bloodDrop {
            0% { 
                transform: translateY(0) scale(1) rotate(0deg); 
                opacity: 1; 
            }
            100% { 
                transform: translateY(${50 + Math.random() * 100}px) scale(3) rotate(${Math.random() * 360}deg); 
                opacity: 0; 
            }
        }
    `;
    document.head.appendChild(style);

    // Плавное появление секций с глитчем
    const sections = document.querySelectorAll('.fullscreen');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Случайный глитч при появлении секции
                if (Math.random() < 0.2) {
                    entry.target.style.transform = 'translateX(-10px)';
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);
                }
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 1s ease';
        sectionObserver.observe(section);
    });

    setTimeout(() => {
        const firstSection = document.getElementById('welcome');
        if (firstSection) {
            firstSection.style.opacity = '1';
            firstSection.style.transform = 'translateY(0)';
        }
    }, 100);

    // Пульсация центральной ячейки
    const centerCell = document.querySelector('.center-cell-bg');
    if (centerCell) {
        setInterval(() => {
            centerCell.style.boxShadow = '0 0 50px rgba(255, 23, 68, 0.5)';
            setTimeout(() => {
                centerCell.style.boxShadow = '0 0 20px rgba(255, 23, 68, 0.2)';
            }, 300);
        }, 1500);
    }

    console.log('📼 VHS EFFECT ENGAGED');
    console.log('👹 Bloody Scissors - КОЗААА!');
    console.log('🖼️ Изображения: img/');
    console.log('🔤 Шрифты: Metal Mania + Nosifer + Creepster');
});

// ============ УПРАВЛЕНИЕ ВИДЕО-ФОНОМ ============
document.addEventListener('DOMContentLoaded', function() {
    const concertVideo = document.querySelector('.concert-video');
    
    if (concertVideo) {
        // Обработка ошибок загрузки видео
        concertVideo.addEventListener('error', function() {
            console.warn('⚠️ Видео concert.mp4 не загрузилось. Использую статичный фон.');
            const videoBg = document.querySelector('.video-background');
            if (videoBg) {
                videoBg.style.background = 'radial-gradient(circle, #1a0000 0%, #0a0a0a 70%)';
                videoBg.style.animation = 'pulse 2s infinite';
            }
        });

        // Запуск видео с проверкой
        const playPromise = concertVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('🎬 Видео-фон запущен');
                concertVideo.style.opacity = '1';
            }).catch(error => {
                console.warn('⚠️ Автовоспроизведение заблокировано:', error);
                // Показываем кнопку включения звука/видео
                const welcome = document.getElementById('welcome');
                if (welcome) {
                    const unmuteBtn = document.createElement('button');
                    unmuteBtn.textContent = '▶ ВКЛЮЧИТЬ ВИДЕО';
                    unmuteBtn.style.cssText = `
                        position: absolute;
                        bottom: 60px;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 10;
                        padding: 10px 20px;
                        background: rgba(255, 23, 68, 0.8);
                        border: 1px solid #ff1744;
                        color: #fff;
                        font-family: 'Metal Mania', cursive;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.3s;
                        letter-spacing: 2px;
                    `;
                    unmuteBtn.addEventListener('click', function() {
                        concertVideo.muted = false;
                        concertVideo.play();
                        this.remove();
                    });
                    welcome.appendChild(unmuteBtn);
                }
            });
        }

        // Пауза видео когда секция не видна (экономия ресурсов)
        const welcomeSection = document.getElementById('welcome');
        if (welcomeSection) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        concertVideo.play().catch(() => {});
                    } else {
                        concertVideo.pause();
                    }
                });
            }, { threshold: 0.1 });
            
            videoObserver.observe(welcomeSection);
        }

        // Случайные глитчи видео
        setInterval(() => {
            if (Math.random() < 0.08) {
                concertVideo.style.filter = `brightness(0.6) contrast(1.5) saturate(0.8) hue-rotate(${Math.random() * 20 - 10}deg)`;
                concertVideo.style.transform = `translate(-50%, -50%) scale(1.05)`;
                
                setTimeout(() => {
                    concertVideo.style.filter = 'brightness(0.6) contrast(1.2) saturate(0.8)';
                    concertVideo.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 100 + Math.random() * 200);
            }
        }, 2000);
    }
    
    console.log('🎬 Видео-фон инициализирован');
});

// ============ ЭФФЕКТЫ ДЛЯ ФОНОВОГО ИЗОБРАЖЕНИЯ СЕКЦИЙ ============
document.addEventListener('DOMContentLoaded', function() {
    const descriptionSection = document.getElementById('description');
    const bgImage = descriptionSection ? descriptionSection.querySelector('.section-bg-image') : null;
    
    if (bgImage) {
        // Предзагрузка изображения
        const bgUrl = bgImage.style.backgroundImage;
        if (bgUrl && bgUrl !== 'none') {
            const img = new Image();
            const url = bgUrl.replace(/url\(['"]?|['"]?\)/g, '');
            img.src = url;
            img.onload = function() {
                console.log('🖼️ Фоновое изображение we.jpg загружено');
                bgImage.style.opacity = '1';
            };
            img.onerror = function() {
                console.warn('⚠️ Фоновое изображение we.jpg не загрузилось');
                bgImage.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)';
            };
        }

        // Эффект параллакса при скролле
        window.addEventListener('scroll', function() {
            if (!descriptionSection) return;
            
            const rect = descriptionSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Проверяем, видна ли секция
            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                const parallaxOffset = scrollProgress * 30 - 15; // От -15 до +15 пикселей
                
                bgImage.style.transform = `scale(1.1) translateY(${parallaxOffset}px)`;
            }
        });

        // Случайные глитчи фона
        setInterval(() => {
            if (Math.random() < 0.05) { // 5% шанс каждые 2 секунды
                bgImage.style.animation = 'bgGlitch 0.3s ease';
                
                setTimeout(() => {
                    bgImage.style.animation = '';
                }, 300);
            }
        }, 2000);

        // Эффект приближения при наведении на секцию
        descriptionSection.addEventListener('mouseenter', function() {
            bgImage.style.transform = 'scale(1.15)';
            bgImage.style.transition = 'transform 3s ease-out';
        });
        
        descriptionSection.addEventListener('mouseleave', function() {
            bgImage.style.transform = 'scale(1.1)';
            bgImage.style.transition = 'transform 2s ease-in';
        });

        // Пульсация кровавых бликов в зависимости от позиции мыши
        descriptionSection.addEventListener('mousemove', function(e) {
            const rect = descriptionSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            // Двигаем кровавые блики за мышью
            const beforePseudo = descriptionSection.style;
            const glowX = x * 60 - 10;
            const glowY = y * 60 - 10;
            
            descriptionSection.style.setProperty('--glow-x', `${glowX}%`);
            descriptionSection.style.setProperty('--glow-y', `${glowY}%`);
        });
    }
    
    console.log('🖼️ Эффекты фонового изображения активированы');
});

// ============ ЭФФЕКТЫ ДЛЯ ФОНОВОГО ИЗОБРАЖЕНИЯ СЕКЦИЙ ============
document.addEventListener('DOMContentLoaded', function() {
    const descriptionSection = document.getElementById('description');
    const bgImage = descriptionSection ? descriptionSection.querySelector('.section-bg-image') : null;
    
    if (bgImage) {
        // Предзагрузка изображения
        const bgUrl = bgImage.style.backgroundImage;
        if (bgUrl && bgUrl !== 'none') {
            const img = new Image();
            const url = bgUrl.replace(/url\(['"]?|['"]?\)/g, '');
            img.src = url;
            img.onload = function() {
                console.log('🖼️ Фоновое изображение we.jpg загружено');
                bgImage.style.opacity = '1';
            };
            img.onerror = function() {
                console.warn('⚠️ Фоновое изображение we.jpg не загрузилось');
                bgImage.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)';
            };
        }

        // Эффект параллакса при скролле
        window.addEventListener('scroll', function() {
            if (!descriptionSection) return;
            
            const rect = descriptionSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Проверяем, видна ли секция
            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                const parallaxOffset = scrollProgress * 30 - 15; // От -15 до +15 пикселей
                
                bgImage.style.transform = `scale(1.1) translateY(${parallaxOffset}px)`;
            }
        });

        // Случайные глитчи фона
        setInterval(() => {
            if (Math.random() < 0.05) { // 5% шанс каждые 2 секунды
                bgImage.style.animation = 'bgGlitch 0.3s ease';
                
                setTimeout(() => {
                    bgImage.style.animation = '';
                }, 300);
            }
        }, 2000);

        // Эффект приближения при наведении на секцию
        descriptionSection.addEventListener('mouseenter', function() {
            bgImage.style.transform = 'scale(1.15)';
            bgImage.style.transition = 'transform 3s ease-out';
        });
        
        descriptionSection.addEventListener('mouseleave', function() {
            bgImage.style.transform = 'scale(1.1)';
            bgImage.style.transition = 'transform 2s ease-in';
        });

        // Пульсация кровавых бликов в зависимости от позиции мыши
        descriptionSection.addEventListener('mousemove', function(e) {
            const rect = descriptionSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            // Двигаем кровавые блики за мышью
            const beforePseudo = descriptionSection.style;
            const glowX = x * 60 - 10;
            const glowY = y * 60 - 10;
            
            descriptionSection.style.setProperty('--glow-x', `${glowX}%`);
            descriptionSection.style.setProperty('--glow-y', `${glowY}%`);
        });
    }
    
    console.log('🖼️ Эффекты фонового изображения активированы');
});

// ============ VHS ЭФФЕКТЫ ДЛЯ ФОНОВ БЕЗ ЗАТЕМНЕНИЯ ============
document.addEventListener('DOMContentLoaded', function() {
    
    // Функция случайных глитчей для фоновых изображений
    function applyRandomGlitch() {
        const bgImages = document.querySelectorAll('.section-bg-image');
        
        bgImages.forEach(bg => {
            if (Math.random() < 0.08) { // 8% шанс
                bg.style.animation = 'randomBgGlitch 0.4s ease';
                
                // Добавляем сдвиг трекинг-линии
                const trackingLine = bg.querySelector('.vhs-tracking-line');
                if (trackingLine) {
                    trackingLine.style.opacity = '0.8';
                    setTimeout(() => {
                        trackingLine.style.opacity = '1';
                    }, 150);
                }
                
                setTimeout(() => {
                    bg.style.animation = '';
                }, 400);
            }
        });
    }
    
    setInterval(applyRandomGlitch, 2500);

    // Параллакс для фонов
    window.addEventListener('scroll', function() {
        const bgImages = document.querySelectorAll('.section-bg-image');
        
        bgImages.forEach(bg => {
            const parent = bg.closest('.fullscreen');
            if (!parent) return;
            
            const rect = parent.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                const parallaxOffset = scrollProgress * 20 - 10;
                
                bg.style.transform = `translateY(${parallaxOffset}px)`;
            }
        });
    });

    // Инициализация фонов
    const bgImages = document.querySelectorAll('.section-bg-image');
    bgImages.forEach(bg => {
        // Плавное появление
        bg.style.opacity = '0';
        bg.style.transition = 'opacity 1s ease-in-out';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        bg.style.opacity = '1';
                    }, 200);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(bg);
        
        // Предзагрузка изображения
        const bgUrl = bg.style.backgroundImage;
        if (bgUrl && bgUrl !== 'none') {
            const img = new Image();
            const url = bgUrl.replace(/url\(['"]?|['"]?\)/g, '');
            img.src = url;
            img.onload = () => console.log('🖼️ Фоновое изображение загружено:', url.split('/').pop());
            img.onerror = () => {
                console.warn('⚠️ Фоновое изображение не загрузилось:', url.split('/').pop());
                bg.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)';
            };
        }
    });
    
    console.log('📼 Чистый VHS эффект активирован для фонов');
    console.log('🖼️ we.jpg - оригинальная яркость + VHS');
    console.log('🖼️ aaa.jpg - оригинальная яркость + VHS');
});

// ============ УЛУЧШЕНИЕ ЧИТАЕМОСТИ ============
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Фон текста затемнён, серый текст осветлён');
    console.log('✅ Все текстовые блоки имеют backdrop-filter: blur()');
    console.log('✅ Контрастность текста повышена');
    console.log('✅ Серые цвета заменены на белые/светлые');
    
    // Добавляем класс для улучшенной читаемости на всех секциях
    const textBlocks = document.querySelectorAll('.description-text, .concert-item, .cell-content, .disclaimers');
    textBlocks.forEach(block => {
        block.style.transition = 'all 0.3s ease';
    });
});

// ============ АУДИОПЛЕЕР ДЛЯ ТРЕКОВ ============
document.addEventListener('DOMContentLoaded', function() {
    const trackCells = document.querySelectorAll('.track-cell');
    let currentAudio = null;
    let currentBtn = null;
    let currentProgress = null;
    let currentTime = null;
    let animationId = null;
    
    trackCells.forEach(cell => {
        const audio = cell.querySelector('.track-audio');
        const playBtn = cell.querySelector('.track-play-btn');
        const progressFill = cell.querySelector('.track-progress-fill');
        const timeDisplay = cell.querySelector('.track-time');
        const progressBar = cell.querySelector('.track-progress');
        
        if (!audio || !playBtn) return;
        
        // Форматирование времени
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        
        // Обновление прогресса
        function updateProgress() {
            if (audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = progress + '%';
                timeDisplay.textContent = formatTime(audio.currentTime);
            }
            
            if (!audio.paused) {
                animationId = requestAnimationFrame(updateProgress);
            }
        }
        
        // Сброс предыдущего трека
        function resetPrevious() {
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                if (currentBtn) {
                    currentBtn.textContent = '▶ ИГРАТЬ';
                    currentBtn.classList.remove('playing');
                }
                if (currentProgress) {
                    currentProgress.style.width = '0%';
                }
                if (currentTime) {
                    currentTime.textContent = '00:00';
                }
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            }
        }
        
        // Кнопка воспроизведения
        playBtn.addEventListener('click', function() {
            if (audio.paused) {
                // Остановить предыдущий трек
                resetPrevious();
                
                // Запустить текущий
                audio.play().then(() => {
                    playBtn.textContent = '⏸ ПАУЗА';
                    playBtn.classList.add('playing');
                    currentAudio = audio;
                    currentBtn = playBtn;
                    currentProgress = progressFill;
                    currentTime = timeDisplay;
                    
                    // Начать обновление прогресса
                    updateProgress();
                }).catch(err => {
                    console.warn('⚠️ Не удалось воспроизвести трек:', err);
                });
            } else {
                // Пауза
                audio.pause();
                playBtn.textContent = '▶ ИГРАТЬ';
                playBtn.classList.remove('playing');
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            }
        });
        
        // Клик по прогресс-бару для перемотки
        if (progressBar) {
            progressBar.addEventListener('click', function(e) {
                const rect = progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const seekTime = (clickX / width) * audio.duration;
                
                audio.currentTime = seekTime;
                progressFill.style.width = (clickX / width) * 100 + '%';
                timeDisplay.textContent = formatTime(seekTime);
            });
        }
        
        // Обновление времени при загрузке метаданных
        audio.addEventListener('loadedmetadata', function() {
            timeDisplay.textContent = formatTime(0);
        });
        
        // Сброс при окончании трека
        audio.addEventListener('ended', function() {
            playBtn.textContent = '▶ ИГРАТЬ';
            playBtn.classList.remove('playing');
            progressFill.style.width = '0%';
            timeDisplay.textContent = '00:00';
            currentAudio = null;
            currentBtn = null;
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
        
        // Обработка ошибок загрузки
        audio.addEventListener('error', function() {
            playBtn.textContent = '⚠ НЕТ ФАЙЛА';
            playBtn.style.color = '#888';
            playBtn.style.borderColor = '#888';
        });
    });
    
    console.log('🎵 Аудиоплеер инициализирован');
    console.log('🎧 Треки готовы к воспроизведению');
});

// ============ ШОРТСЫ - КАРУСЕЛЬ И ПОЛНОЭКРАННОЕ ВИДЕО ============
document.addEventListener('DOMContentLoaded', function() {
    
    // Запуск превью-видео в шортсах
    const previewVideos = document.querySelectorAll('.short-video-preview');
    
    // Наблюдатель для автовоспроизведения превью
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.3 });
    
    previewVideos.forEach(video => {
        videoObserver.observe(video);
        
        // Обработка ошибок загрузки
        video.addEventListener('error', function() {
            video.style.display = 'none';
            const parent = video.closest('.short-preview');
            if (parent) {
                parent.style.background = 'linear-gradient(45deg, #1a0000, #0a0000)';
            }
        });
    });
    
    // ============ МОДАЛЬНОЕ ОКНО ============
    const modal = document.getElementById('shortModal');
    const modalVideo = modal ? modal.querySelector('.short-modal-video') : null;
    const modalTitle = modal ? modal.querySelector('.short-modal-title') : null;
    const modalClose = modal ? modal.querySelector('.short-modal-close') : null;
    const modalBackdrop = modal ? modal.querySelector('.short-modal-backdrop') : null;
    
    // Открытие модального окна при клике на шортс
    const shortItems = document.querySelectorAll('.short-item');
    
    shortItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const videoSrc = this.getAttribute('data-video');
            const title = this.querySelector('.short-title').textContent;
            const desc = this.querySelector('.short-desc').textContent;
            
            if (modal && modalVideo && videoSrc) {
                modalVideo.src = videoSrc;
                modalTitle.textContent = title + ' — ' + desc;
                modal.classList.add('active');
                
                // Запуск видео
                modalVideo.play().catch(() => {});
                
                // Блокировка скролла
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Закрытие модального окна
    function closeModal() {
        if (modal && modalVideo) {
            modalVideo.pause();
            modalVideo.src = '';
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // ============ УПРАВЛЕНИЕ СКОРОСТЬЮ КАРУСЕЛИ ============
    const carousel = document.querySelector('.shorts-carousel');
    
    if (carousel) {
        // Замедление при наведении на контейнер
        const container = document.querySelector('.shorts-carousel-container');
        
        container.addEventListener('mouseenter', function() {
            carousel.style.animationPlayState = 'paused';
        });
        
        container.addEventListener('mouseleave', function() {
            carousel.style.animationPlayState = 'running';
        });
        
        // Случайные глитчи карусели
        setInterval(() => {
            if (Math.random() < 0.05 && carousel.style.animationPlayState === 'running') {
                carousel.style.animationDuration = '0.1s';
                setTimeout(() => {
                    carousel.style.animationDuration = '20s';
                }, 100);
            }
        }, 3000);
    }
    
    console.log('🎬 Шортсы инициализированы');
    console.log('📽️ Карусель вращается');
    console.log('🖥️ Модальное окно готово');
});

// ============ КЛИП ============
document.addEventListener('DOMContentLoaded', function() {
    const clipVideo = document.querySelector('.clip-video');
    
    if (clipVideo) {
        // Обработка ошибок загрузки
        clipVideo.addEventListener('error', function() {
            console.warn('⚠️ Видео megaclip.mp4 не загрузилось');
            const clipFrame = document.querySelector('.clip-frame');
            if (clipFrame) {
                clipFrame.style.background = 'linear-gradient(45deg, #1a0000, #0a0000)';
                clipFrame.innerHTML += '<p style="color:#ff1744;text-align:center;padding:40px;font-family:Metal Mania,cursive;">⚠ ВИДЕО НЕ ЗАГРУЖЕНО</p>';
            }
        });
        
        // Отслеживание воспроизведения
        clipVideo.addEventListener('play', function() {
            console.log('🎥 Клип запущен');
        });
        
        // Анимация рамки при воспроизведении
        clipVideo.addEventListener('playing', function() {
            const clipFrame = document.querySelector('.clip-frame');
            if (clipFrame) {
                clipFrame.style.animation = 'frameGlow 2s infinite';
            }
        });
        
        clipVideo.addEventListener('pause', function() {
            const clipFrame = document.querySelector('.clip-frame');
            if (clipFrame) {
                clipFrame.style.animation = '';
            }
        });
    }
    
    // Добавляем анимацию для рамки
    const style = document.createElement('style');
    style.textContent = `
        @keyframes frameGlow {
            0%, 100% { 
                box-shadow: 0 0 30px rgba(255, 23, 68, 0.3), 0 0 60px rgba(255, 23, 68, 0.1);
            }
            50% { 
                box-shadow: 0 0 50px rgba(255, 23, 68, 0.6), 0 0 100px rgba(255, 23, 68, 0.3);
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎥 Компонент клипа готов');
});

// ============ КЛИП - ОБРАБОТЧИКИ ============
document.addEventListener('DOMContentLoaded', function() {
    const clipVideo = document.querySelector('.clip-video');
    
    if (clipVideo) {
        // Обработка ошибок загрузки
        clipVideo.addEventListener('error', function() {
            console.warn('⚠️ Видео megaclip.mp4 не загрузилось');
            const clipFrame = document.querySelector('.clip-frame');
            if (clipFrame) {
                clipFrame.style.background = 'linear-gradient(45deg, #1a0000, #0a0000)';
                const errorMsg = document.createElement('div');
                errorMsg.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #ff1744;
                    font-family: 'Metal Mania', cursive;
                    font-size: 2vw;
                    text-align: center;
                    z-index: 3;
                `;
                errorMsg.textContent = '⚠ ВИДЕО НЕ НАЙДЕНО';
                clipFrame.appendChild(errorMsg);
            }
        });
        
        // Логирование успешной загрузки
        clipVideo.addEventListener('loadeddata', function() {
            console.log('🎬 Клип megaclip.mp4 загружен');
        });
        
        // Отслеживание полноэкранного режима
        clipVideo.addEventListener('fullscreenchange', function() {
            if (document.fullscreenElement) {
                console.log('📺 Клип открыт на весь экран');
                clipVideo.style.objectFit = 'contain';
            } else {
                clipVideo.style.objectFit = 'contain';
            }
        });
    }
    
    // Кнопка fullscreen
    const fullscreenBtn = document.querySelector('.clip-fullscreen-btn');
    if (fullscreenBtn && clipVideo) {
        fullscreenBtn.addEventListener('click', function() {
            if (clipVideo.requestFullscreen) {
                clipVideo.requestFullscreen();
            } else if (clipVideo.webkitRequestFullscreen) {
                clipVideo.webkitRequestFullscreen();
            } else if (clipVideo.msRequestFullscreen) {
                clipVideo.msRequestFullscreen();
            }
        });
    }
    
    console.log('🎬 Компонент клипа инициализирован');
});

// ============ КОНТАКТЫ - ЭФФЕКТЫ ============
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        // Эффект при наведении
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.social-icon');
            if (icon) {
                icon.style.transform = 'scale(1.3) rotate(5deg)';
                icon.style.transition = 'all 0.3s ease';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.social-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Отслеживание кликов
        link.addEventListener('click', function(e) {
            console.log('🔗 Переход в соцсеть:', this.querySelector('.social-name').textContent);
            
            // Эффект вспышки при клике
            this.style.boxShadow = '0 0 50px rgba(255, 23, 68, 0.8)';
            setTimeout(() => {
                this.style.boxShadow = '';
            }, 300);
        });
    });
    
    console.log('📱 Контакты инициализированы');
    console.log('🔗 VK: https://vk.com/scissorssband');
    console.log('🔗 TG: https://t.me/scissorsbandd');
});
