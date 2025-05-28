document.addEventListener('DOMContentLoaded', function () {
    const appIcon = document.querySelector('.app-icon');

    // Эффект при наведении на иконку
    appIcon.addEventListener('mouseenter', function () {
        this.style.boxShadow = '0 20px 50px rgba(106, 17, 203, 0.6)';
    });

    appIcon.addEventListener('mouseleave', function () {
        this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    });

    // Эффекты для кнопок
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Создаем эффект ripple
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 1000);

            // Анимация нажатия
            this.style.transform = 'translateY(2px)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px)';
            }, 100);
        });
    });

    // Динамические пузыри
    const bubblesContainer = document.querySelector('.bubbles');
    setInterval(() => {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        const size = Math.random() * 60 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${Math.random() * 5 + 5}s`;
        bubble.style.animationDelay = `${Math.random() * 3}s`;

        bubblesContainer.appendChild(bubble);

        // Удаляем пузырь после завершения анимации
        setTimeout(() => {
            bubble.remove();
        }, 11000);
    }, 1000);
});