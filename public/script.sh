#!/bin/bash

# Скрипт для идеальной кросс-платформенной адаптации
# Запускать из папки front

echo "📱 Делаю сайт идеально адаптивным под все устройства..."

# Проверяем, что мы в папке front
if [[ ! "$(basename $(pwd))" == "front" ]]; then
    echo "❌ Ошибка: скрипт должен запускаться из папки front/"
    exit 1
fi

# Создаем резервную копию
BACKUP_DIR="backups/adaptive_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp index.html styles.css script.js "$BACKUP_DIR/" 2>/dev/null
echo "📦 Резервная копия в $BACKUP_DIR"

# =============================================
# ОБНОВЛЯЕМ index.html - добавляем мета-теги
# =============================================
echo "📄 Обновляю index.html..."

# Добавляем мета-теги для мобильных устройств
sed -i '/<meta charset="UTF-8">/a\
    <meta http-equiv="X-UA-Compatible" content="IE=edge">\
    <meta name="theme-color" content="#0a0000">\
    <meta name="apple-mobile-web-app-capable" content="yes">\
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\
    <meta name="apple-mobile-web-app-title" content="Bloody Scissors">\
    <meta name="mobile-web-app-capable" content="yes">\
    <meta name="HandheldFriendly" content="true">\
    <meta name="format-detection" content="telephone=no">\
    <link rel="apple-touch-icon" href="img/favicon.png">\
    <link rel="manifest" href="manifest.json">' index.html

# Создаем manifest.json для PWA
cat > manifest.json << 'EOF'
{
  "name": "Bloody Scissors",
  "short_name": "SCISSORS",
  "description": "Сургутская ньюметал группа Bloody Scissors",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0a0000",
  "theme_color": "#0a0000",
  "icons": [
    {
      "src": "img/favicon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "img/favicon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

# =============================================
# ПОЛНОСТЬЮ ПЕРЕПИСЫВАЕМ styles.css С АДАПТИВНОСТЬЮ
# =============================================
echo "🎨 Создаю супер-адаптивные стили..."

cat > styles.css << 'CSSEOF'
/* ============ RESET & BASE ============ */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --blood: #ff1744;
    --blood-dark: #b2102f;
    --blood-light: #ff5252;
    --blood-glow: #ff8a80;
    --bg-deep: #050000;
    --bg-dark: #0a0000;
    --bg-card: rgba(0, 0, 0, 0.75);
    --text-white: #ffffff;
    --text-gray: #cccccc;
    --gold: #ffd700;
    --cyan: #00ffff;
    --cell-min-height: 280px;
    --gap: 3px;
    
    /* Адаптивные переменные */
    --h1-size: clamp(40px, 8vw, 120px);
    --h2-size: clamp(28px, 4vw, 60px);
    --text-sm: clamp(12px, 0.85vw, 16px);
    --text-md: clamp(14px, 1.1vw, 20px);
    --text-lg: clamp(16px, 1.4vw, 24px);
    --spacing: clamp(10px, 2vw, 40px);
}

html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

body {
    font-family: 'Metal Mania', 'Creepster', 'Courier New', monospace;
    background: var(--bg-dark);
    color: var(--blood);
    overflow-x: hidden;
    min-height: 100vh;
    min-height: 100dvh;
    position: relative;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Убираем кастомный курсор на тач-устройствах */
@media (hover: none) and (pointer: coarse) {
    body {
        cursor: auto;
    }
}

@media (hover: hover) and (pointer: fine) {
    body {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='10' cy='10' r='8' fill='none' stroke='%23ff1744' stroke-width='2'/></svg>") 10 10, crosshair;
    }
}

/* ============ VHS ОВЕРЛЕЙ ============ */
.vhs-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: overlay;
    opacity: 0.6;
}

.vhs-scanlines {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px);
    pointer-events: none;
    z-index: 10000;
    animation: scanlines 0.1s linear infinite;
}

@keyframes scanlines { 0% { transform: translateY(0); } 100% { transform: translateY(4px); } }

.vhs-noise {
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
    background-size: 256px 256px;
    pointer-events: none;
    z-index: 10001;
    animation: noise 0.5s steps(3) infinite;
    opacity: 0.3;
}

@keyframes noise { 0%{transform:translate(0,0)} 25%{transform:translate(-5%,3%)} 50%{transform:translate(3%,-2%)} 75%{transform:translate(-2%,-5%)} 100%{transform:translate(5%,2%)} }

.vhs-tracking {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10002;
    animation: tracking 3s linear infinite;
}

@keyframes tracking { 0%{background:linear-gradient(to bottom,transparent 0%,transparent 20%,rgba(255,23,68,0.05) 20%,rgba(255,23,68,0.05) 23%,transparent 23%,transparent 100%);transform:translateY(0)} 100%{background:linear-gradient(to bottom,transparent 0%,transparent 20%,rgba(255,23,68,0.05) 20%,rgba(255,23,68,0.05) 23%,transparent 23%,transparent 100%);transform:translateY(100vh)} }

.vhs-glitch-line, .vhs-glitch-line-2 {
    position: fixed;
    left: -10%;
    width: 120%;
    height: 3px;
    background: rgba(255,23,68,0.4);
    pointer-events: none;
    z-index: 10003;
    filter: blur(1px);
}
.vhs-glitch-line { top: 15%; animation: glitchLine 2s infinite; }
.vhs-glitch-line-2 { top: 65%; height: 2px; background: rgba(0,255,255,0.2); animation: glitchLine2 3s infinite 1s; }

@keyframes glitchLine { 0%,100%{transform:translateX(-5%);opacity:0} 10%{transform:translateX(2%);opacity:.8} 11%{transform:translateX(-3%);opacity:0} 12%{transform:translateX(5%);opacity:.6} 13%{transform:translateX(-1%);opacity:0} 50%{transform:translateX(0);opacity:0} }
@keyframes glitchLine2 { 0%,100%{transform:translateX(5%);opacity:0} 30%{transform:translateX(-2%);opacity:.6} 31%{transform:translateX(3%);opacity:0} 32%{transform:translateX(-5%);opacity:.4} 33%{transform:translateX(1%);opacity:0} 80%{transform:translateX(0);opacity:0} }

.vhs-flicker {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10004;
    animation: flicker 0.15s infinite;
}

@keyframes flicker { 0%{background:transparent} 50%{background:rgba(0,0,0,0.03)} 51%{background:transparent} 100%{background:transparent} }

.vhs-color-shift {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10005;
    animation: colorShift 5s infinite;
}

@keyframes colorShift { 0%,100%{box-shadow:inset 3px 0 0 rgba(255,0,0,0.03),inset -3px 0 0 rgba(0,255,255,0.03)} 25%{box-shadow:inset 5px 0 0 rgba(255,0,0,0.05),inset -5px 0 0 rgba(0,255,255,0.02)} 50%{box-shadow:inset 2px 0 0 rgba(255,0,0,0.02),inset -2px 0 0 rgba(0,255,255,0.05)} 75%{box-shadow:inset 6px 0 0 rgba(255,0,0,0.04),inset -1px 0 0 rgba(0,255,255,0.04)} }

.vhs-timestamp {
    position: fixed;
    bottom: clamp(10px, 2vw, 20px);
    right: clamp(10px, 2vw, 20px);
    font-family: 'Courier New', monospace;
    font-size: clamp(10px, 1.5vw, 14px);
    color: rgba(255,255,255,0.6);
    z-index: 10006;
    text-shadow: 0 0 5px rgba(0,0,0,0.8);
    letter-spacing: 2px;
    animation: timestampPulse 2s infinite;
}

@keyframes timestampPulse { 0%,100%{opacity:.6} 50%{opacity:.8} }

.vhs-play {
    position: fixed;
    top: clamp(10px, 2vw, 15px);
    left: clamp(10px, 2vw, 20px);
    font-family: 'Courier New', monospace;
    font-size: clamp(8px, 1vw, 12px);
    color: #00ff00;
    z-index: 10006;
    text-shadow: 0 0 10px #00ff00;
    animation: playBlink 1s infinite;
    letter-spacing: 2px;
}

@keyframes playBlink { 0%,100%{opacity:1} 50%{opacity:.3} }

/* ============ ОБЩИЕ СТИЛИ СЕКЦИЙ ============ */
.fullscreen {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing);
    position: relative;
    overflow: hidden;
}

.content {
    text-align: center;
    max-width: min(900px, 95vw);
    width: 100%;
}

h1, h2, h3, .koza-text, .cell-name, .members-footer {
    font-family: 'Metal Mania', 'Nosifer', 'Creepster', cursive;
    text-transform: uppercase;
    letter-spacing: clamp(2px, 0.3vw, 5px);
}

/* ============ КОМПОНЕНТ 1: ПРИВЕТСТВИЕ ============ */
#welcome {
    background: var(--bg-deep);
    animation: none !important;
}

.video-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
}

.concert-video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    object-fit: cover;
    filter: brightness(0.6) contrast(1.2) saturate(0.8);
}

.video-overlay-dark {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center, rgba(10,0,0,0.3) 0%, rgba(10,0,0,0.6) 50%, rgba(10,0,0,0.85) 100%);
    z-index: 1;
    animation: overlayPulse 3s ease-in-out infinite;
}

@keyframes overlayPulse { 0%,100%{background:radial-gradient(ellipse at center,rgba(10,0,0,0.3) 0%,rgba(10,0,0,0.6) 50%,rgba(10,0,0,0.85) 100%)} 50%{background:radial-gradient(ellipse at center,rgba(15,0,0,0.2) 0%,rgba(10,0,0,0.5) 50%,rgba(10,0,0,0.9) 100%)} }

.video-scanlines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px);
    z-index: 2;
    pointer-events: none;
    animation: videoScanlines 0.1s linear infinite;
}

@keyframes videoScanlines { 0%{transform:translateY(0)} 100%{transform:translateY(4px)} }

.video-noise {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
    background-size: 256px 256px;
    z-index: 3;
    pointer-events: none;
    animation: videoNoise 0.5s steps(3) infinite;
}

@keyframes videoNoise { 0%{transform:translate(0,0)} 25%{transform:translate(-3%,2%)} 50%{transform:translate(2%,-1%)} 75%{transform:translate(-1%,-3%)} 100%{transform:translate(3%,1%)} }

.video-glitch {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
    pointer-events: none;
}

.video-glitch::before {
    content: '';
    position: absolute;
    top: 30%;
    left: -5%;
    width: 110%;
    height: 4px;
    background: rgba(255,23,68,0.4);
    animation: videoGlitchLine 3s infinite;
    filter: blur(1px);
}

.video-glitch::after {
    content: '';
    position: absolute;
    top: 60%;
    left: -5%;
    width: 110%;
    height: 3px;
    background: rgba(0,255,255,0.2);
    animation: videoGlitchLine2 4s infinite 1s;
    filter: blur(1px);
}

@keyframes videoGlitchLine { 0%,100%{transform:translateX(-5%);opacity:0} 10%{transform:translateX(2%);opacity:.8} 11%{transform:translateX(-3%);opacity:0} 12%{transform:translateX(5%);opacity:.6} 13%{transform:translateX(-1%);opacity:0} 50%{transform:translateX(0);opacity:0} }
@keyframes videoGlitchLine2 { 0%,100%{transform:translateX(5%);opacity:0} 30%{transform:translateX(-2%);opacity:.6} 31%{transform:translateX(3%);opacity:0} 32%{transform:translateX(-5%);opacity:.4} 33%{transform:translateX(1%);opacity:0} 80%{transform:translateX(0);opacity:0} }

.welcome-content {
    position: relative;
    z-index: 5;
}

.koza-text {
    font-size: var(--h1-size);
    font-weight: 900;
    color: var(--blood);
    text-shadow: 0 0 50px var(--blood), 0 0 100px var(--blood), 4px 4px 0 #000, -4px -4px 0 rgba(0,255,255,0.3);
    animation: glitchText 0.5s infinite;
    letter-spacing: clamp(5px, 2vw, 20px);
    word-break: break-all;
}

@keyframes glitchText { 0%,100%{transform:translateX(0);text-shadow:0 0 50px var(--blood),0 0 100px var(--blood),3px 3px 0 #000} 20%{transform:translateX(-5px) skewX(2deg);text-shadow:-3px 0 red,3px 0 cyan,0 0 50px var(--blood)} 40%{transform:translateX(5px) skewX(-2deg);text-shadow:3px 0 cyan,-3px 0 red,0 0 100px var(--blood)} 60%{transform:translateX(-3px);text-shadow:-2px 0 red,2px 0 cyan,0 0 50px var(--blood)} 80%{transform:translateX(3px);text-shadow:2px 0 cyan,-2px 0 red,0 0 100px var(--blood)} }

.subtitle {
    font-family: 'Metal Mania', cursive;
    font-size: clamp(18px, 3vw, 48px);
    margin-top: clamp(10px, 2vw, 20px);
    color: var(--blood-light);
    letter-spacing: clamp(5px, 1vw, 10px);
    text-shadow: 0 0 20px var(--blood), 2px 2px 0 #000;
    background: rgba(0,0,0,0.6);
    display: inline-block;
    padding: clamp(8px, 1.5vw, 10px) clamp(15px, 3vw, 25px);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
}

.subtitle-sub {
    font-family: 'Creepster', cursive;
    font-size: clamp(12px, 1.5vw, 24px);
    color: var(--blood-glow);
    margin-top: clamp(5px, 1vw, 10px);
    text-shadow: 0 0 10px var(--blood);
    background: rgba(0,0,0,0.6);
    display: inline-block;
    padding: clamp(5px, 1vw, 8px) clamp(10px, 2vw, 20px);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
}

.scroll-indicator {
    position: absolute;
    bottom: clamp(15px, 3vw, 30px);
    font-size: clamp(20px, 4vw, 30px);
    animation: bounce 2s infinite;
    color: var(--blood);
    text-shadow: 0 0 20px var(--blood);
}

@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(20px)} }

/* ============ ФОНОВЫЕ ИЗОБРАЖЕНИЯ С VHS ============ */
.section-bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
    filter: brightness(1) contrast(1.05) saturate(0.95);
}

.concert-bg {
    filter: brightness(1) contrast(1.1) saturate(1) !important;
}

.section-bg-vhs {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
}

.vhs-scanlines-light {
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
    animation: scanlinesMove 0.1s linear infinite;
    z-index: 6;
}

@keyframes scanlinesMove { 0%{transform:translateY(0)} 100%{transform:translateY(4px)} }

.vhs-noise-subtle {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    animation: noiseShift 0.4s steps(3) infinite;
    opacity: 0.6;
    z-index: 7;
}

@keyframes noiseShift { 0%{transform:translate(0,0)} 25%{transform:translate(-2%,1%)} 50%{transform:translate(1%,-1%)} 75%{transform:translate(-1%,-2%)} 100%{transform:translate(2%,1%)} }

.vhs-tracking-line {
    background: transparent;
    animation: trackingMove 4s linear infinite;
    z-index: 8;
}

@keyframes trackingMove { 0%{box-shadow:inset 0 0 0 transparent,0 30% 0 0 rgba(255,255,255,0.03);transform:translateY(-100%)} 100%{box-shadow:inset 0 0 0 transparent,0 30% 0 0 rgba(255,255,255,0.03);transform:translateY(100%)} }

.vhs-chromatic {
    animation: chromaShift 6s infinite;
    z-index: 9;
}

@keyframes chromaShift { 0%,100%{box-shadow:inset 2px 0 0 rgba(255,0,0,0.02),inset -2px 0 0 rgba(0,255,255,0.02)} 25%{box-shadow:inset 3px 0 0 rgba(255,0,0,0.04),inset -3px 0 0 rgba(0,255,255,0.01)} 50%{box-shadow:inset 1px 0 0 rgba(255,0,0,0.01),inset -1px 0 0 rgba(0,255,255,0.04)} 75%{box-shadow:inset 4px 0 0 rgba(255,0,0,0.03),inset -2px 0 0 rgba(0,255,255,0.03)} }

.vhs-flicker-subtle {
    animation: subtleFlicker 0.2s infinite;
    z-index: 10;
}

@keyframes subtleFlicker { 0%{background:transparent} 50%{background:rgba(0,0,0,0.02)} 51%{background:transparent} 100%{background:transparent} }

.description-content, .concerts-content, .tracks-content, .contacts-content {
    position: relative;
    z-index: 20;
}

#description, #concerts {
    position: relative;
    background: var(--bg-dark);
    overflow: hidden;
}

/* ============ ЗАГОЛОВКИ СЕКЦИЙ ============ */
#description h2, #concerts h2, #members h2, #tracks h2, #shorts h2, #clip h2, #contacts h2 {
    font-size: var(--h2-size);
    margin-bottom: clamp(15px, 3vw, 30px);
    background: var(--bg-card);
    display: inline-block;
    padding: clamp(10px, 2vw, 15px) clamp(15px, 3vw, 30px);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: #ff4444;
    text-shadow: 3px 3px 6px rgba(0,0,0,0.9), 0 0 30px rgba(255,23,68,0.8);
}

/* ============ КОМПОНЕНТ 2: ОПИСАНИЕ ============ */
.description-text {
    font-size: var(--text-lg);
    line-height: 1.9;
    color: var(--text-white);
    background: var(--bg-card);
    padding: clamp(15px, 3vw, 25px) clamp(15px, 3vw, 35px);
    border-left: 4px solid var(--blood);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.9);
    text-align: left;
    margin-bottom: clamp(15px, 3vw, 30px);
    border-radius: 0 4px 4px 0;
}

.disclaimers {
    margin-top: clamp(20px, 4vw, 40px);
    font-size: var(--text-sm);
    background: rgba(0,0,0,0.9);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid #333;
    padding: clamp(10px, 2vw, 20px);
    text-align: left;
    border-radius: 4px;
}

.disclaimer {
    margin: 5px 0;
    color: #999;
    font-family: 'Courier New', monospace;
    font-size: clamp(8px, 1.5vw, 12px);
    line-height: 1.6;
}

/* ============ КОМПОНЕНТ 3: КОНЦЕРТЫ ============ */
.concert-item {
    border: 2px solid var(--blood);
    padding: clamp(15px, 3vw, 30px);
    margin: clamp(10px, 2vw, 20px) 0;
    background: var(--bg-card);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: all 0.3s;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    border-radius: 4px;
    touch-action: manipulation;
}

.concert-item:active {
    transform: scale(0.98);
}

@media (hover: hover) {
    .concert-item:hover {
        background: rgba(255,23,68,0.2);
        transform: scale(1.05);
        box-shadow: 0 0 30px rgba(255,23,68,0.3);
    }
}

.concert-date {
    display: block;
    font-size: clamp(20px, 3vw, 48px);
    color: #ff4444;
    font-family: 'Nosifer', cursive;
    text-shadow: 0 0 20px var(--blood);
}

.concert-title {
    display: block;
    font-size: clamp(14px, 1.5vw, 24px);
    color: var(--text-white);
    margin: clamp(5px, 1vw, 10px) 0;
}

.concert-venue {
    display: block;
    color: var(--text-gray);
    font-size: clamp(11px, 1vw, 16px);
}

.coming-soon {
    margin-top: clamp(15px, 3vw, 30px);
    color: var(--text-white);
    font-size: clamp(12px, 1.2vw, 20px);
    background: var(--bg-card);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    padding: clamp(8px, 1.5vw, 12px) clamp(15px, 3vw, 25px);
    display: inline-block;
    border-radius: 4px;
}

/* ============ КОМПОНЕНТ 4: УЧАСТНИКИ ============ */
#members {
    background: var(--bg-dark);
    padding: clamp(30px, 6vw, 60px) clamp(10px, 2vw, 20px);
}

.members-content {
    max-width: min(1000px, 98vw) !important;
    margin: 0 auto;
}

.members-intro {
    font-size: var(--text-md);
    color: var(--text-white);
    margin-bottom: clamp(25px, 5vw, 50px);
    background: var(--bg-card);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    padding: clamp(10px, 2vw, 20px) clamp(15px, 3vw, 25px);
    display: inline-block;
    border-bottom: 1px solid var(--blood);
}

.tic-tac-toe-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gap);
    background: var(--blood);
    border: 3px solid var(--blood);
    max-width: min(900px, 95vw);
    margin: 0 auto clamp(20px, 4vw, 40px);
    box-shadow: 0 0 40px rgba(255,23,68,0.3);
}

.cell {
    background-color: var(--bg-dark);
    background-size: cover;
    background-position: center;
    padding: clamp(12px, 2.5vw, 25px) clamp(10px, 2vw, 20px);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease;
    min-height: var(--cell-min-height);
    position: relative;
    overflow: hidden;
}

.cell-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10,0,0,0.85);
    transition: all 0.4s ease;
    z-index: 1;
}

.cell::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px);
    z-index: 2;
    pointer-events: none;
    opacity: 0.5;
}

@media (hover: hover) {
    .cell:hover .cell-overlay {
        background: rgba(10,0,0,0.6);
    }
    .cell:hover {
        transform: scale(1.02);
        z-index: 5;
        box-shadow: 0 0 30px rgba(255,23,68,0.5);
        cursor: pointer;
    }
}

.cell:active {
    transform: scale(0.98);
}

.cell-content {
    text-align: center;
    position: relative;
    z-index: 4;
    background: var(--bg-card);
    padding: clamp(10px, 2vw, 20px);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 4px;
    width: 100%;
}

.cell-number {
    font-size: clamp(10px, 0.8vw, 14px);
    color: #ff8888;
    opacity: 0.9;
    margin-bottom: clamp(5px, 1vw, 10px);
    letter-spacing: 3px;
}

.cell-name {
    font-size: clamp(16px, 2.2vw, 32px);
    color: #ff5555;
    margin-bottom: clamp(4px, 0.8vw, 8px);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(255,23,68,0.8);
    letter-spacing: clamp(2px, 0.5vw, 5px);
}

.cell-role {
    font-size: clamp(10px, 0.9vw, 15px);
    color: #ffaaaa;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: clamp(8px, 1.5vw, 15px);
}

.cell-desc {
    font-size: clamp(10px, 0.9vw, 15px);
    color: var(--text-white);
    line-height: 1.7;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.9);
}

.cell-quote {
    font-size: clamp(9px, 0.85vw, 14px);
    color: var(--text-white);
    font-style: italic;
    border-top: 1px solid var(--blood);
    padding-top: clamp(5px, 1vw, 10px);
    margin-top: clamp(5px, 1vw, 10px);
    background: rgba(0,0,0,0.5);
    display: inline-block;
    padding: clamp(5px, 1vw, 8px) clamp(8px, 1.5vw, 12px);
    font-family: 'Rubik Glitch', cursive;
    border-radius: 4px;
}

.center-cell-bg {
    background-color: #1a0000 !important;
}

.center-overlay {
    background: rgba(10,0,0,0.7) !important;
}

.center-cell .cell-name {
    font-size: clamp(18px, 2.5vw, 36px);
    animation: centerPulse 1s infinite;
}

@keyframes centerPulse { 0%,100%{text-shadow:0 0 20px rgba(255,23,68,0.9),0 0 40px rgba(255,23,68,0.5);transform:scale(1)} 50%{text-shadow:0 0 40px rgba(255,23,68,1),0 0 80px rgba(255,23,68,0.8);transform:scale(1.05)} }

.empty-cell-bg {
    background: var(--bg-deep) !important;
    background-image: 
        linear-gradient(45deg, rgba(255,23,68,0.05) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(255,23,68,0.05) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(255,23,68,0.05) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(255,23,68,0.05) 75%) !important;
    background-size: 20px 20px;
}

.empty-cell {
    opacity: 0.5;
}

@media (hover: hover) {
    .empty-cell:hover {
        opacity: 0.9;
    }
}

.cell-symbol {
    font-size: clamp(30px, 6vw, 80px);
    color: var(--blood);
    opacity: 0.3;
    text-shadow: 0 0 30px rgba(255,23,68,0.5);
    animation: pulse 2s infinite;
}

.cell-empty-text {
    font-size: clamp(10px, 1.1vw, 18px);
    color: var(--text-white);
    background: rgba(0,0,0,0.6);
    display: inline-block;
    padding: clamp(5px, 1vw, 8px) clamp(10px, 2vw, 15px);
    border-radius: 4px;
}

.members-footer {
    margin-top: clamp(15px, 3vw, 30px);
    font-size: clamp(16px, 2vw, 32px);
    color: var(--blood);
    text-shadow: 0 0 20px var(--blood);
    animation: glitchText 0.3s infinite;
    background: var(--bg-card);
    display: inline-block;
    padding: clamp(8px, 1.5vw, 15px) clamp(15px, 3vw, 30px);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 4px;
}

.footer-sub {
    font-size: clamp(11px, 1.2vw, 20px);
    color: var(--text-white);
}

/* ============ КОМПОНЕНТ 5: ТРЕКИ ============ */
#tracks {
    position: relative;
    background: var(--bg-dark);
    padding: clamp(30px, 6vw, 60px) clamp(10px, 2vw, 20px);
}

.tracks-bg {
    background: 
        radial-gradient(ellipse at 30% 20%, #1a0000 0%, transparent 50%),
        radial-gradient(ellipse at 70% 80%, #0d0000 0%, transparent 50%),
        var(--bg-dark) !important;
}

.tracks-intro {
    font-size: var(--text-md);
    color: var(--text-white);
    margin-bottom: clamp(25px, 5vw, 50px);
    background: var(--bg-card);
    padding: clamp(10px, 2vw, 20px) clamp(15px, 3vw, 25px);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: inline-block;
    border-bottom: 1px solid var(--blood);
    border-radius: 4px;
}

.tracks-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gap);
    background: var(--blood);
    border: 3px solid var(--blood);
    max-width: min(900px, 95vw);
    margin: 0 auto clamp(20px, 4vw, 40px);
    box-shadow: 0 0 40px rgba(255,23,68,0.3);
}

.track-cell {
    background: var(--bg-dark);
    padding: clamp(12px, 2.5vw, 25px) clamp(10px, 2vw, 20px);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s ease;
    min-height: var(--cell-min-height);
    position: relative;
}

@media (hover: hover) {
    .track-cell:hover {
        background: #0f0000;
        box-shadow: inset 0 0 40px rgba(255,23,68,0.2);
        transform: scale(1.02);
        z-index: 5;
    }
}

.track-cell:active {
    transform: scale(0.98);
}

.track-cell-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
    z-index: 1;
    pointer-events: none;
}

.track-cell-content {
    text-align: center;
    position: relative;
    z-index: 2;
    width: 100%;
}

.track-badge {
    display: inline-block;
    padding: clamp(3px, 0.5vw, 5px) clamp(8px, 1.5vw, 15px);
    font-size: clamp(8px, 0.7vw, 12px);
    letter-spacing: 3px;
    margin-bottom: clamp(8px, 1.5vw, 15px);
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 3px;
}

.badge-best {
    color: var(--gold);
    border: 1px solid var(--gold);
    text-shadow: 0 0 10px var(--gold);
    animation: badgeGlow 2s infinite;
}

.badge-brutal { color: #ff4444; border: 1px solid #ff4444; }
.badge-dark { color: #8888ff; border: 1px solid #8888ff; }
.badge-meh { color: #888; border: 1px solid #888; }

.badge-new {
    color: #00ff44;
    border: 1px solid #00ff44;
    text-shadow: 0 0 15px #00ff44;
    animation: badgePulse 1s infinite;
    font-size: clamp(9px, 0.8vw, 13px);
}

.badge-first { color: #ff8800; border: 1px solid #ff8800; }

@keyframes badgeGlow { 0%,100%{box-shadow:0 0 5px var(--gold)} 50%{box-shadow:0 0 20px var(--gold)} }
@keyframes badgePulse { 0%,100%{box-shadow:0 0 5px #00ff44;transform:scale(1)} 50%{box-shadow:0 0 25px #00ff44;transform:scale(1.05)} }

.track-name {
    font-family: 'Metal Mania', 'Nosifer', cursive;
    font-size: clamp(14px, 1.8vw, 28px);
    color: #ff4444;
    margin-bottom: clamp(6px, 1.2vw, 12px);
    text-shadow: 0 0 15px rgba(255,23,68,0.7), 2px 2px 4px rgba(0,0,0,0.9);
    letter-spacing: 3px;
    background: rgba(0,0,0,0.6);
    display: inline-block;
    padding: clamp(3px, 0.5vw, 5px) clamp(8px, 1.5vw, 15px);
    border-radius: 3px;
}

.track-desc {
    font-size: clamp(9px, 0.85vw, 14px);
    color: var(--text-white);
    line-height: 1.6;
    margin-bottom: clamp(10px, 2vw, 20px);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.9);
    background: rgba(0,0,0,0.6);
    padding: clamp(5px, 1vw, 10px) clamp(8px, 1.5vw, 15px);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 3px;
}

.track-player {
    display: flex;
    align-items: center;
    gap: clamp(4px, 0.8vw, 8px);
    background: rgba(0,0,0,0.8);
    padding: clamp(6px, 1vw, 10px);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid var(--blood);
    border-radius: 4px;
}

.track-play-btn {
    background: rgba(255,23,68,0.2);
    border: 1px solid var(--blood);
    color: var(--blood);
    padding: clamp(5px, 0.8vw, 8px) clamp(8px, 1.5vw, 15px);
    font-family: 'Metal Mania', cursive;
    font-size: clamp(9px, 0.8vw, 13px);
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 2px;
    white-space: nowrap;
    border-radius: 3px;
    touch-action: manipulation;
    -webkit-appearance: none;
}

.track-play-btn:active {
    background: var(--blood);
    color: #000;
}

@media (hover: hover) {
    .track-play-btn:hover {
        background: var(--blood);
        color: #000;
        box-shadow: 0 0 20px rgba(255,23,68,0.5);
    }
}

.track-play-btn.playing {
    background: var(--blood);
    color: #000;
    animation: btnPulse 0.5s infinite;
}

@keyframes btnPulse { 0%,100%{box-shadow:0 0 10px var(--blood)} 50%{box-shadow:0 0 30px var(--blood)} }

.track-progress {
    flex: 1;
    height: clamp(3px, 0.5vw, 4px);
    background: rgba(255,23,68,0.2);
    position: relative;
    cursor: pointer;
    min-width: 30px;
    border-radius: 2px;
    touch-action: manipulation;
}

.track-progress-fill {
    height: 100%;
    background: var(--blood);
    width: 0%;
    transition: width 0.1s linear;
    box-shadow: 0 0 10px var(--blood);
    border-radius: 2px;
}

.track-time {
    font-family: 'Courier New', monospace;
    font-size: clamp(8px, 0.7vw, 11px);
    color: var(--text-white);
    min-width: 30px;
    text-align: right;
}

.center-track .track-name {
    font-size: clamp(16px, 2vw, 30px);
    animation: centerPulse 1s infinite;
}

.tracks-footer {
    margin-top: clamp(15px, 3vw, 30px);
    font-size: clamp(16px, 2vw, 32px);
    color: var(--blood);
    text-shadow: 0 0 20px var(--blood);
    animation: glitchText 0.3s infinite;
    font-family: 'Nosifer', 'Metal Mania', cursive;
    background: var(--bg-card);
    display: inline-block;
    padding: clamp(8px, 1.5vw, 15px) clamp(15px, 3vw, 30px);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 4px;
}

.empty-track {
    opacity: 0.4;
}

@media (hover: hover) {
    .empty-track:hover {
        opacity: 0.7;
        background: #0f0000;
    }
}

.track-empty-symbol {
    font-size: clamp(25px, 5vw, 70px);
    color: var(--blood);
    opacity: 0.3;
    text-shadow: 0 0 30px rgba(255,23,68,0.5);
    animation: pulse 2s infinite;
}

.track-empty-text {
    font-size: clamp(9px, 1vw, 16px);
    color: var(--text-white);
    background: rgba(0,0,0,0.6);
    display: inline-block;
    padding: clamp(4px, 0.8vw, 8px) clamp(8px, 1.5vw, 15px);
    border-radius: 3px;
}

/* ============ КОМПОНЕНТ 6: ШОРТСЫ ============ */
#shorts {
    position: relative;
    background: var(--bg-dark);
    padding: clamp(30px, 6vw, 60px) clamp(10px, 2vw, 20px);
}

.shorts-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(ellipse at 20% 50%, #1a0000 0%, transparent 60%),
        radial-gradient(ellipse at 80% 50%, #0d0000 0%, transparent 60%),
        var(--bg-dark);
    z-index: 0;
}

.shorts-intro {
    font-size: var(--text-md);
    color: var(--text-white);
    margin-bottom: clamp(25px, 5vw, 50px);
    background: var(--bg-card);
    padding: clamp(10px, 2vw, 20px) clamp(15px, 3vw, 25px);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: inline-block;
    border-radius: 4px;
}

.shorts-carousel-container {
    width: 100%;
    overflow: hidden;
    padding: clamp(10px, 2vw, 20px) 0;
    perspective: 1000px;
    -webkit-overflow-scrolling: touch;
}

.shorts-carousel {
    display: flex;
    gap: clamp(10px, 2vw, 20px);
    animation: carouselRotate 20s linear infinite;
    width: max-content;
}

.shorts-carousel:hover {
    animation-play-state: paused;
}

@keyframes carouselRotate {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

.short-item {
    flex-shrink: 0;
    width: clamp(160px, 28vw, 280px);
    height: clamp(240px, 40vw, 400px);
    border: 2px solid var(--blood);
    cursor: pointer;
    transition: all 0.4s;
    position: relative;
    overflow: hidden;
    background: var(--bg-dark);
    box-shadow: 0 0 20px rgba(255,23,68,0.2);
    border-radius: 4px;
    touch-action: manipulation;
}

.short-item:active {
    transform: scale(0.95);
}

@media (hover: hover) {
    .short-item:hover {
        transform: scale(1.08) translateY(-10px);
        border-color: var(--blood-light);
        box-shadow: 0 0 40px rgba(255,23,68,0.5), 0 15px 30px rgba(0,0,0,0.5);
        z-index: 10;
    }
}

.short-preview {
    width: 100%;
    height: 100%;
    position: relative;
}

.short-video-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.7) contrast(1.2) saturate(0.8);
}

.short-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.4) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
}

.short-item:hover .short-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.3) 100%);
}

.short-play-icon {
    font-size: clamp(25px, 4vw, 60px);
    color: var(--blood);
    text-shadow: 0 0 30px rgba(255,23,68,0.8);
    opacity: 0.8;
    transition: all 0.3s;
    margin-bottom: clamp(8px, 1.5vw, 15px);
}

.short-item:hover .short-play-icon {
    opacity: 1;
    transform: scale(1.2);
    text-shadow: 0 0 50px rgba(255,23,68,1);
}

.short-title {
    font-family: 'Metal Mania', 'Nosifer', cursive;
    font-size: clamp(14px, 1.8vw, 28px);
    color: var(--text-white);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(255,23,68,0.5);
    letter-spacing: 3px;
    margin-bottom: clamp(4px, 0.8vw, 8px);
}

.short-desc {
    font-size: clamp(10px, 0.9vw, 15px);
    color: var(--text-gray);
}

/* Модальное окно */
.short-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100000;
    -webkit-overflow-scrolling: touch;
}

.short-modal.active {
    display: flex;
    align-items: center;
    justify-content: center;
    animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }

.short-modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.short-modal-content {
    position: relative;
    z-index: 1;
    width: min(90%, 900px);
    animation: modalScaleIn 0.4s cubic-bezier(0.4,0,0.2,1);
}

@keyframes modalScaleIn { from{transform:scale(0.8);opacity:0} to{transform:scale(1);opacity:1} }

.short-modal-close {
    position: absolute;
    top: clamp(-40px, -5vw, -50px);
    right: 0;
    background: rgba(255,23,68,0.2);
    border: 1px solid var(--blood);
    color: var(--blood);
    padding: clamp(6px, 1vw, 10px) clamp(12px, 2.5vw, 25px);
    font-family: 'Metal Mania', cursive;
    font-size: clamp(12px, 1.2vw, 20px);
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 2px;
    z-index: 2;
    border-radius: 3px;
    touch-action: manipulation;
    -webkit-appearance: none;
}

.short-modal-close:active {
    background: var(--blood);
    color: #000;
}

@media (hover: hover) {
    .short-modal-close:hover {
        background: var(--blood);
        color: #000;
        box-shadow: 0 0 30px rgba(255,23,68,0.5);
    }
}

.short-modal-video {
    width: 100%;
    max-height: 85vh;
    max-height: 85dvh;
    background: #000;
    border: 2px solid var(--blood);
    box-shadow: 0 0 50px rgba(255,23,68,0.3);
    border-radius: 4px;
}

.short-modal-title {
    font-family: 'Metal Mania', cursive;
    font-size: clamp(14px, 1.5vw, 24px);
    color: var(--blood);
    text-align: center;
    margin-top: clamp(8px, 1.5vw, 15px);
    text-shadow: 0 0 20px rgba(255,23,68,0.5);
    letter-spacing: 3px;
}

.shorts-footer {
    margin-top: clamp(20px, 4vw, 40px);
    font-size: clamp(16px, 2vw, 32px);
    color: var(--blood);
    text-shadow: 0 0 20px var(--blood);
    animation: glitchText 0.3s infinite;
    font-family: 'Nosifer', 'Metal Mania', cursive;
    background: var(--bg-card);
    display: inline-block;
    padding: clamp(8px, 1.5vw, 15px) clamp(15px, 3vw, 30px);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 4px;
}

/* ============ КОМПОНЕНТ 7: КЛИП ============ */
#clip {
    position: relative;
    background: var(--bg-dark);
    padding: clamp(30px, 6vw, 60px) clamp(10px, 2vw, 20px);
}

.clip-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(ellipse at 50% 30%, #1a0000 0%, transparent 50%),
        radial-gradient(ellipse at 50% 70%, #0d0000 0%, transparent 50%),
        var(--bg-dark);
    z-index: 0;
}

.clip-intro {
    font-size: var(--text-md);
    color: var(--text-white);
    margin-bottom: clamp(25px, 5vw, 50px);
    background: var(--bg-card);
    padding: clamp(10px, 2vw, 20px) clamp(15px, 3vw, 25px);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: inline-block;
    border-radius: 4px;
}

.clip-container {
    display: flex;
    flex-direction: column;
    gap: clamp(15px, 3vw, 30px);
    margin-bottom: clamp(20px, 4vw, 40px);
}

.clip-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    border: clamp(2px, 0.3vw, 3px) solid var(--blood);
    box-shadow: 0 0 40px rgba(255,23,68,0.3), 0 0 80px rgba(255,23,68,0.1);
    overflow: hidden;
    background: #000;
    transition: all 0.4s;
    border-radius: 4px;
}

@media (hover: hover) {
    .clip-frame:hover {
        box-shadow: 0 0 60px rgba(255,23,68,0.5), 0 0 120px rgba(255,23,68,0.2);
        border-color: var(--blood-light);
    }
}

.clip-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 1;
}

.clip-vhs-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
}

.clip-scanlines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px);
    animation: scanlinesMove 0.1s linear infinite;
}

.clip-tracking {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: clipTracking 5s linear infinite;
}

@keyframes clipTracking { 0%{box-shadow:inset 0 0 0 transparent;transform:translateY(-100%)} 50%{box-shadow:inset 0 30% 0 0 rgba(255,255,255,0.03)} 100%{box-shadow:inset 0 0 0 transparent;transform:translateY(100%)} }

.clip-info {
    text-align: center;
    background: var(--bg-card);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: clamp(12px, 2.5vw, 25px) clamp(15px, 3vw, 30px);
    border: 1px solid var(--blood);
    border-radius: 4px;
}

.clip-title {
    font-family: 'Metal Mania', 'Nosifer', cursive;
    font-size: clamp(16px, 2vw, 32px);
    color: #ff4444;
    margin-bottom: clamp(8px, 1.5vw, 15px);
    text-shadow: 0 0 20px rgba(255,23,68,0.8);
    letter-spacing: 3px;
}

.clip-actions {
    display: flex;
    justify-content: center;
    gap: clamp(8px, 2vw, 20px);
    flex-wrap: wrap;
}

.clip-btn {
    display: inline-block;
    padding: clamp(8px, 1.2vw, 12px) clamp(15px, 3vw, 30px);
    font-family: 'Metal Mania', cursive;
    font-size: clamp(11px, 1vw, 16px);
    letter-spacing: 3px;
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
    border: 2px solid var(--blood);
    position: relative;
    overflow: hidden;
    border-radius: 3px;
    touch-action: manipulation;
    -webkit-appearance: none;
}

.clip-fullscreen-btn {
    background: rgba(255,23,68,0.1);
    color: var(--blood);
}

.clip-download-btn {
    background: rgba(255,23,68,0.05);
    color: var(--blood-light);
}

.clip-btn:active {
    background: var(--blood);
    color: #000;
    transform: translateY(-2px);
}

@media (hover: hover) {
    .clip-btn:hover {
        background: var(--blood);
        color: #000;
        box-shadow: 0 0 30px rgba(255,23,68,0.5);
        transform: translateY(-3px);
    }
}

.clip-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,23,68,0.3), transparent);
    transition: left 0.5s;
}

.clip-btn:hover::before {
    left: 100%;
}

.clip-footer {
    margin-top: clamp(10px, 2vw, 20px);
    font-size: clamp(14px, 1.8vw, 28px);
    color: var(--blood);
    text-shadow: 0 0 20px var(--blood);
    animation: glitchText 0.3s infinite;
    font-family: 'Nosifer', 'Metal Mania', cursive;
    background: var(--bg-card);
    display: inline-block;
    padding: clamp(8px, 1.5vw, 15px) clamp(15px, 3vw, 30px);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 4px;
}

/* ============ КОМПОНЕНТ 8: КОНТАКТЫ ============ */
#contacts {
    position: relative;
    background: var(--bg-dark);
}

.contacts-bg {
    background: radial-gradient(ellipse at 50% 50%, #1a0000 0%, transparent 60%), var(--bg-dark) !important;
}

.contacts-intro {
    font-size: var(--text-md);
    color: var(--text-white);
    margin-bottom: clamp(25px, 5vw, 50px);
    background: var(--bg-card);
    padding: clamp(10px, 2vw, 20px) clamp(15px, 3vw, 25px);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: inline-block;
    border-bottom: 1px solid var(--blood);
    border-radius: 4px;
}

.social-links {
    display: flex;
    justify-content: center;
    gap: clamp(15px, 3vw, 30px);
    flex-wrap: wrap;
    margin-bottom: clamp(25px, 5vw, 50px);
}

.social-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: clamp(15px, 3vw, 30px) clamp(20px, 4vw, 40px);
    border: 2px solid var(--blood);
    color: var(--blood);
    text-decoration: none;
    transition: all 0.4s;
    background: var(--bg-card);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
    min-width: clamp(180px, 25vw, 250px);
    border-radius: 4px;
    touch-action: manipulation;
}

.social-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,23,68,0.2), transparent);
    transition: left 0.5s;
}

.social-link:hover::before {
    left: 100%;
}

.social-link:active {
    transform: translateY(-5px);
}

@media (hover: hover) {
    .social-link:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(255,23,68,0.3);
        border-color: var(--blood-light);
    }
}

.social-vk:active { border-color: #4a76a8; }
.social-tg:active { border-color: #2aabee; }

@media (hover: hover) {
    .social-vk:hover { border-color: #4a76a8; box-shadow: 0 20px 40px rgba(74,118,168,0.3); }
    .social-tg:hover { border-color: #2aabee; box-shadow: 0 20px 40px rgba(42,171,238,0.3); }
}

.social-icon {
    font-family: 'Metal Mania', cursive;
    font-size: clamp(20px, 3vw, 48px);
    margin-bottom: clamp(5px, 1vw, 10px);
    text-shadow: 0 0 20px rgba(255,23,68,0.8);
    transition: all 0.3s;
}

.social-link:hover .social-icon {
    text-shadow: 0 0 40px rgba(255,23,68,1);
    transform: scale(1.2);
}

.social-name {
    font-family: 'Metal Mania', cursive;
    font-size: clamp(14px, 1.5vw, 24px);
    letter-spacing: 5px;
    margin-bottom: clamp(4px, 0.8vw, 8px);
    color: var(--text-white);
}

.social-handle {
    font-family: 'Courier New', monospace;
    font-size: clamp(10px, 0.9vw, 15px);
    color: var(--blood-glow);
    letter-spacing: 2px;
}

.final-message p:first-child {
    font-size: clamp(16px, 2vw, 32px);
    color: var(--blood);
    font-weight: bold;
    text-shadow: 0 0 20px var(--blood);
    background: var(--bg-card);
    display: inline-block;
    padding: clamp(8px, 1.5vw, 15px) clamp(15px, 3vw, 25px);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 4px;
}

.koza-small {
    font-size: clamp(30px, 5vw, 80px);
    color: var(--blood);
    margin-top: clamp(10px, 2vw, 20px);
    text-shadow: 0 0 30px var(--blood);
    animation: glitchText 0.3s infinite;
    font-family: 'Nosifer', cursive;
}

/* ============ АДАПТИВНЫЕ МЕДИА-ЗАПРОСЫ ============ */

/* Планшеты (портрет) и большие телефоны */
@media (max-width: 1024px) {
    :root {
        --cell-min-height: 240px;
    }
    
    .tic-tac-toe-grid,
    .tracks-grid {
        max-width: 90vw;
    }
    
    .short-item {
        width: clamp(140px, 25vw, 220px);
        height: clamp(200px, 35vw, 320px);
    }
}

/* Планшеты (портрет) */
@media (max-width: 768px) {
    :root {
        --cell-min-height: 200px;
    }
    
    .fullscreen {
        padding: clamp(15px, 4vw, 30px) clamp(10px, 3vw, 20px);
    }
    
    /* Перестраиваем сетки в 2 колонки */
    .tic-tac-toe-grid,
    .tracks-grid {
        grid-template-columns: repeat(2, 1fr);
        max-width: 95vw;
        gap: 2px;
    }
    
    /* Растягиваем центральную ячейку на полную ширину */
    .cell-middle-center {
        grid-column: 1 / -1;
        min-height: clamp(150px, 30vw, 200px);
    }
    
    .center-track {
        grid-column: 1 / -1;
        min-height: clamp(150px, 30vw, 200px);
    }
    
    /* Последний ряд - одна ячейка на полную ширину */
    .cell-bottom-left,
    .cell-bottom-center,
    .cell-bottom-right {
        grid-column: span 1;
    }
    
    .cell-bottom-right {
        grid-column: 1 / -1;
    }
    
    .short-item {
        width: clamp(120px, 30vw, 200px);
        height: clamp(180px, 40vw, 300px);
    }
    
    .social-links {
        flex-direction: column;
        align-items: center;
    }
    
    .social-link {
        min-width: clamp(200px, 60vw, 300px);
    }
    
    .clip-frame {
        aspect-ratio: 4/3;
    }
    
    .clip-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .clip-btn {
        width: 100%;
        max-width: 300px;
        text-align: center;
    }
}

/* Телефоны */
@media (max-width: 480px) {
    :root {
        --cell-min-height: 160px;
        --gap: 2px;
    }
    
    .fullscreen {
        padding: clamp(10px, 3vw, 20px) clamp(8px, 2vw, 15px);
    }
    
    /* Перестраиваем в 1 колонку */
    .tic-tac-toe-grid,
    .tracks-grid {
        grid-template-columns: 1fr;
        gap: 2px;
        max-width: 100%;
    }
    
    .cell {
        min-height: clamp(120px, 25vw, 160px);
        padding: 10px;
    }
    
    .track-cell {
        min-height: clamp(140px, 30vw, 180px);
        padding: 10px;
    }
    
    .cell-name {
        font-size: clamp(18px, 6vw, 28px);
    }
    
    .cell-desc {
        font-size: clamp(11px, 3.5vw, 16px);
    }
    
    .cell-role {
        font-size: clamp(10px, 3vw, 14px);
    }
    
    .track-name {
        font-size: clamp(16px, 5vw, 24px);
    }
    
    .track-desc {
        font-size: clamp(10px, 3vw, 14px);
    }
    
    .track-play-btn {
        font-size: clamp(10px, 3vw, 14px);
        padding: 8px 12px;
    }
    
    .track-time {
        font-size: clamp(9px, 2.5vw, 12px);
        min-width: 25px;
    }
    
    /* Шортсы - одна карточка */
    .short-item {
        width: clamp(140px, 60vw, 200px);
        height: clamp(200px, 70vw, 300px);
    }
    
    .short-title {
        font-size: clamp(16px, 5vw, 24px);
    }
    
    .short-desc {
        font-size: clamp(11px, 3vw, 14px);
    }
    
    /* Клип */
    .clip-frame {
        aspect-ratio: 1/1;
        border-width: 2px;
    }
    
    .clip-info {
        padding: 10px;
    }
    
    .clip-title {
        font-size: clamp(14px, 4vw, 20px);
    }
    
    /* Модальное окно */
    .short-modal-close {
        font-size: clamp(12px, 3.5vw, 16px);
        padding: 6px 15px;
        top: -40px;
    }
    
    /* Соцсети */
    .social-link {
        min-width: 80vw;
        padding: 20px;
    }
    
    .social-icon {
        font-size: clamp(24px, 8vw, 40px);
    }
    
    .social-name {
        font-size: clamp(14px, 4vw, 20px);
    }
    
    .social-handle {
        font-size: clamp(11px, 3vw, 14px);
    }
    
    /* Заголовки секций */
    #description h2, #concerts h2, #members h2, #tracks h2, #shorts h2, #clip h2, #contacts h2 {
        font-size: clamp(22px, 7vw, 36px);
        padding: 8px 20px;
    }
    
    /* Текст описания */
    .description-text {
        font-size: clamp(13px, 4vw, 18px);
        padding: 12px 15px;
    }
    
    .disclaimers {
        font-size: clamp(8px, 2.5vw, 11px);
    }
    
    /* Подвалы */
    .members-footer,
    .tracks-footer,
    .shorts-footer,
    .clip-footer {
        font-size: clamp(14px, 4.5vw, 22px);
        padding: 8px 15px;
    }
    
    .koza-small {
        font-size: clamp(35px, 12vw, 60px);
    }
    
    .final-message p:first-child {
        font-size: clamp(14px, 4.5vw, 22px);
    }
}

/* Очень маленькие экраны */
@media (max-width: 360px) {
    :root {
        --cell-min-height: 130px;
    }
    
    .koza-text {
        letter-spacing: 3px;
    }
    
    .cell-content {
        padding: 8px;
    }
    
    .track-player {
        flex-wrap: wrap;
        gap: 4px;
    }
    
    .track-progress {
        min-width: 100%;
        order: 3;
    }
    
    .track-time {
        order: 2;
    }
}

/* Ландшафтная ориентация на телефонах */
@media (max-height: 500px) and (orientation: landscape) {
    .fullscreen {
        min-height: 100vh;
        padding: 10px;
    }
    
    .tic-tac-toe-grid,
    .tracks-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .cell,
    .track-cell {
        min-height: 120px;
    }
    
    .koza-text {
        font-size: clamp(30px, 6vw, 60px);
    }
    
    .short-item {
        width: 140px;
        height: 180px;
    }
}

/* Поддержка тёмной темы системы */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-deep: #030000;
        --bg-dark: #080000;
    }
}

/* Уменьшение анимаций для пользователей с предпочтением */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    html {
        scroll-behavior: auto;
    }
}

/* High-DPI экраны */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .vhs-scanlines,
    .video-scanlines,
    .vhs-scanlines-light,
    .clip-scanlines {
        background: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px);
    }
}

/* Печать */
@media print {
    .vhs-overlay,
    .video-background,
    .section-bg-vhs,
    .shorts-carousel-container {
        display: none !important;
    }
    
    body {
        background: #fff;
        color: #000;
    }
    
    .fullscreen {
        min-height: auto;
        page-break-inside: avoid;
    }
}
CSSEOF

echo "✅ styles.css создан с полной адаптивностью"

# =============================================
# ОБНОВЛЯЕМ script.js ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
# =============================================
echo "📜 Обновляю script.js..."

cat >> script.js << 'JSEOF'

// ============ МОБИЛЬНАЯ ОПТИМИЗАЦИЯ ============
document.addEventListener('DOMContentLoaded', function() {

    // Определение типа устройства
    const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    console.log(`📱 Устройство: ${isMobile ? 'Мобильное' : 'Десктоп'}`);
    console.log(`👆 Тач: ${isTouch ? 'Да' : 'Нет'}`);

    // Оптимизация VHS эффектов на мобильных
    if (isMobile) {
        // Уменьшаем интенсивность анимаций
        document.querySelectorAll('.vhs-scanlines, .video-scanlines').forEach(el => {
            el.style.animationDuration = '0.2s';
        });
        
        // Отключаем некоторые эффекты для производительности
        const vhsNoise = document.querySelector('.vhs-noise');
        if (vhsNoise) vhsNoise.style.opacity = '0.15';
        
        const vhsFlicker = document.querySelector('.vhs-flicker');
        if (vhsFlicker) vhsFlicker.style.animationDuration = '0.3s';
    }

    // Предотвращение дергания при скролле на iOS
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        document.body.style.webkitOverflowScrolling = 'touch';
    }

    // Оптимизация для медленных соединений
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.saveData || connection.effectiveType === '2g') {
            // Отключаем видео-фон
            const concertVideo = document.querySelector('.concert-video');
            if (concertVideo) {
                concertVideo.pause();
                concertVideo.style.display = 'none';
            }
            
            // Отключаем превью шортсов
            document.querySelectorAll('.short-video-preview').forEach(v => {
                v.pause();
                v.style.display = 'none';
            });
            
            console.log('🐌 Режим экономии данных активирован');
        }
    }

    // Адаптивный тач для плеера
    if (isTouch) {
        document.querySelectorAll('.track-progress').forEach(bar => {
            bar.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                const audio = this.closest('.track-player').querySelector('.track-audio');
                const progressFill = this.querySelector('.track-progress-fill');
                const timeDisplay = this.closest('.track-player').querySelector('.track-time');
                
                if (audio && audio.duration) {
                    const rect = this.getBoundingClientRect();
                    const touchX = e.touches[0].clientX - rect.left;
                    const seekTime = (touchX / rect.width) * audio.duration;
                    audio.currentTime = seekTime;
                    progressFill.style.width = (touchX / rect.width) * 100 + '%';
                    const m = Math.floor(seekTime / 60);
                    const s = Math.floor(seekTime % 60);
                    timeDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
                }
            });
            
            bar.addEventListener('touchmove', function(e) {
                e.preventDefault();
                const audio = this.closest('.track-player').querySelector('.track-audio');
                const progressFill = this.querySelector('.track-progress-fill');
                const timeDisplay = this.closest('.track-player').querySelector('.track-time');
                
                if (audio && audio.duration) {
                    const rect = this.getBoundingClientRect();
                    const touchX = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                    const seekTime = (touchX / rect.width) * audio.duration;
                    audio.currentTime = seekTime;
                    progressFill.style.width = (touchX / rect.width) * 100 + '%';
                    const m = Math.floor(seekTime / 60);
                    const s = Math.floor(seekTime % 60);
                    timeDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
                }
            });
        });
    }

    // Закрытие модалки свайпом вниз на мобильных
    const modal = document.getElementById('shortModal');
    if (modal && isTouch) {
        let touchStartY = 0;
        
        modal.addEventListener('touchstart', function(e) {
            if (e.target === modal.querySelector('.short-modal-backdrop')) {
                touchStartY = e.touches[0].clientY;
            }
        });
        
        modal.addEventListener('touchmove', function(e) {
            if (e.target === modal.querySelector('.short-modal-backdrop')) {
                const diff = e.touches[0].clientY - touchStartY;
                if (diff > 50) {
                    closeModal();
                }
            }
        });
    }

    // Адаптивная высота для mobile viewport
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });
    setViewportHeight();

    console.log('📱 Мобильная оптимизация завершена');
});
JSEOF

echo "✅ script.js обновлён"

# =============================================
# СОЗДАЕМ ДОПОЛНИТЕЛЬНЫЕ ФАЙЛЫ
# =============================================

# Service Worker для оффлайн-доступа
cat > sw.js << 'EOF'
const CACHE_NAME = 'bloody-scissors-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
EOF

# Регистрация Service Worker в index.html
sed -i '/<script src="script.js"><\/script>/i\
    <script>if("serviceWorker" in navigator){navigator.serviceWorker.register("/sw.js")}</script>' index.html

echo ""
echo "════════════════════════════════════════"
echo "✅ САЙТ ПОЛНОСТЬЮ АДАПТИРОВАН!"
echo "════════════════════════════════════════"
echo ""
echo "📱 Поддерживаемые устройства:"
echo "   • iPhone (все модели, все ориентации)"
echo "   • iPad (портрет + ландшафт)"
echo "   • Android (все размеры экранов)"
echo "   • Десктоп (Full HD, 2K, 4K, ультраширокие)"
echo ""
echo "🎯 Ключевые улучшения:"
echo "   • CSS clamp() для всех размеров"
echo "   • 4 контрольные точки (1024, 768, 480, 360px)"
echo "   • Сетки: 3 колонки → 2 колонки → 1 колонка"
echo "   • Адаптивная карусель шортсов"
echo "   • Тач-оптимизация плеера"
echo "   • Свайп для закрытия модалки"
echo "   • Экономия данных (data-saver)"
echo "   • PWA-ready (manifest + service worker)"
echo "   • Поддержка тёмной темы"
echo "   • Reduced motion"
echo "   • Retina/HiDPI дисплеи"
echo "   • Печать"
echo ""
echo "📦 Дополнительные файлы:"
echo "   • manifest.json (PWA)"
echo "   • sw.js (Service Worker)"
echo ""
echo "КОЗААА! Сайт идеален на любом устройстве! 📱🤘"