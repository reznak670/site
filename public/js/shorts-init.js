// Инициализация кнопки шортсов
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем кнопку шортсов на страницу
    const shortsButton = document.createElement('button');
    shortsButton.innerHTML = '📱 Шортсы';
    shortsButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1000;
        padding: 15px 25px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
        font-family: Arial, sans-serif;
    `;
    
    shortsButton.onmouseover = () => {
        shortsButton.style.transform = 'scale(1.05)';
        shortsButton.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
    };
    
    shortsButton.onmouseout = () => {
        shortsButton.style.transform = 'scale(1)';
        shortsButton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    };
    
    shortsButton.onclick = () => {
        if (window.shortsComponent) {
            window.shortsComponent.openShorts();
        } else {
            alert('Компонент шортсов еще не загружен');
        }
    };
    
    document.body.appendChild(shortsButton);
    
    console.log('🎬 Кнопка шортсов добавлена!');
});
