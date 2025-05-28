import { ROOT_ELEMENT } from '../constants.js';
import { renderMainPage } from '../index.js';

import styles from './transportInfo.module.css';

export function renderTransportInfo(transportData) {
    ROOT_ELEMENT.innerHTML = '';

    const transportInfoPage = `
    <section class=${styles.top}>
        <div class=${styles.arrowBox}>
            <button class=${styles.arrow}>
                <img src="../../transportInfoIcons/arrow_back.png" alt="arrow" id="arrowBack">
            </button>

            <h2>${transportData.type[0].toUpperCase() + transportData.type.slice(1)}</h2>
        </div>

        <button class=${styles.button} id="rentButton">Арендовать</button>
    </section>

    <main>
        <div class=${styles.sliderContainer}>
            <div class=${styles.slider} id="slider">
                <img src="../../mapIcons/car.png" alt="transport" class="${styles.active}" id="slide">
                <img src="../../mapIcons/bike.png" alt="transport" id="slide">
                <img src="../../mapIcons/electric_bike.png" alt="transport" id="slide">
            </div>

            <button class=${styles.prevButton} type="button" id="prevButton">
                <img src="../../transportInfoIcons/arrow_back.png" alt="arrow">
            </button>

            <button class=${styles.nextButton} type="button" id="nextButton">
                <img src="../../transportInfoIcons/arrow_back.png" alt="arrow">
            </button>
        </div>

        <section>
            <h3 class=${styles.name}>${transportData.model}</h3>
            <p class=${styles.text}>${transportData.basic_info}</p>
            <p class=${styles.text}>${transportData.additional_info}</p>
            <p class=${styles.text}>Заряд/топливо: ${transportData.fuelLevel}%</p>
            <p class=${styles.text}>Номер: ${transportData.plate_number}</p>
        </section>

        <div class=${styles.prices}>
            <div class=${styles.price}>
                <img src="../../transportInfoIcons/money.png" alt="clock">
                <h4>За минуту</h4>
                <p>${transportData.price.per_minute}$</p>
            </div>

            <div class=${styles.price}>
                <img src="../../transportInfoIcons/money.png" alt="clock">
                <h4>За час</h4>
                <p>${transportData.price.per_hour}$</p>
            </div>

            <div class=${styles.price}>
                <img src="../../transportInfoIcons/money.png" alt="clock">
                <h4>За день</h4>
                <p>${transportData.price.per_day}$</p>
            </div>
        </div>

        <form name="reviewForm" class=${styles.reviewForm} action="">
            <h2>Оставьте отзыв о транспорте</h2>
            <p>Это поможет нам узнать какой транспорт не пользуется
                популярностью и убрать его, а те которые понравились - зарядить побольше!</p>

            <div class=${styles.rating}>
                <input value="1" name="rating" id="star1" type="radio">
                <label for="star1"></label>

                <input value="2" name="rating" id="star2" type="radio">
                <label for="star2"></label>

                <input value="3" name="rating" id="star3" type="radio">
                <label for="star3"></label>

                <input value="4" name="rating" id="star4" type="radio">
                <label for="star4"></label>

                <input value="5" name="rating" id="star5" type="radio">
                <label for="star5"></label>
            </div>

            <h2>Расскажите о товаре</h2>

            <div class=${styles.inputGroup}>
                <label>Опишите плюсы транспорта*</label>
                <input required type="text" name="text"  class=${styles.reviewInput} placeholder="Плюсы транспорта">
            </div>

            <div class=${styles.inputGroup}>
                <label>Опишите недостатки транспорта*</label>
                <input required type="text" id="negativeInput" name="negative" class=${styles.reviewInput}
                    placeholder="Недостатки транспорта -">
            </div>

            <div class=${styles.inputGroup}>
                <label>Дополнительные комментарии</label>
                <input type="text" id="commentsInput" name="comments" class=${styles.reviewInput} 
                    placeholder="Дополнительные комментарии">
            </div>

            <button type="submit" class="${styles.submitButton} ${styles.button}">Отправить
                отзыв</button>
        </form>
    </main>

    <div class=${styles.reviewsList}>
        <h2>Отзывы:</h2>
        <div></div>
    </div>

    <footer class=${styles.footer}>
        <button class=${styles.button} id="rentButton">Арендовать</button>

        <div class=${styles.help}>
            <h3>Tex поддержка</h3>
            <button class=${styles.button}>Связаться</button>
        </div>
    </footer>
    
    <script src="./script.js"></script>
    `

    ROOT_ELEMENT.insertAdjacentHTML('afterbegin', transportInfoPage);

    // Слайдер
    const prevButton = document.querySelector('#prevButton');
    const nextButton = document.querySelector('#nextButton');

    const slides = Array.from(document.querySelectorAll('#slide'));
    const slideCount = slides.length;
    let slideIndex = 0;

    slides.forEach((slide, index) => {
        slide.classList.toggle(styles.active, index === slideIndex);
    });

    prevButton.addEventListener('click', () => {
        slideIndex = (slideIndex - 1 + slideCount) % slideCount;

        slides.forEach((slide, index) => {
            slide.classList.toggle(styles.active, index === slideIndex);
        });
    });

    nextButton.addEventListener('click', () => {
        slideIndex = (slideIndex + 1) % slideCount;

        slides.forEach((slide, index) => {
            slide.classList.toggle(styles.active, index === slideIndex);
        });
    });

    document.querySelector('#arrowBack').addEventListener('click', () => {
        ROOT_ELEMENT.innerHTML = '';
        // const user = firebaseAuth.getCurrentUser()
        // todo: check if User = Admin
        // renderMainPage()
    });
}