import { ROOT_ELEMENT } from '../constants.js';
import { renderMainPage } from '../index.js';

import styles from './transportInfo.module.css';

export function renderTransportInfo() {
    const transportInfoPage = `
    <section class=${styles.top} data-aos="fade-up" data-aos-duration="1500">
        <div class=${styles.allowBox} data-aos="fade-up" data-aos-duration="1500">
            <button class=${styles.allow}>
                <img src="./Allow.png" alt="Allow">
            </button>

            <h2>Bicycle</h2>
        </div>

        <button class=${styles.button} id="rentButton">Арендовать</button>
    </section>

    <main>
        <div class=${styles.sliderContainer}>
            <div class=${styles.slider} id="slider">
                <img src="./photo_1.avif" alt="transport" class=${styles.slide} id="photo_1"> //active
                <img src="./photo_2.avif" alt="transport" class=${styles.slide} id="photo_2">
                <img src="./photo_3.avif" alt="transport" class=${styles.slide} id="photo_3">
            </div>

            <button class=${styles.prevButton} type="button"><img src="./Allow.png" alt="Allow"></button>
            <button class=${styles.nextButton} type="button"><img src="./Allow.png" alt="Allow"></button>
        </div>

        <section class=${styles.content}>
            <h3 class=${styles.title}>Bicycle</h3>
            <p class=${styles.text}>Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Nulla molestiae, modi cumque
                aliquid voluptas culpa?</p>
        </section>

        <div class=${styles.prices}>
            <div class=${styles.price}>
                <img src="./icon-time.png" alt="clock">
                <h4>За минуту</h4>
                <p>$0.10</p>
            </div>

            <div class=${styles.price}>
                <img src="./icon-time.png" alt="clock">
                <h4>За час</h4>
                <p>$5.00</p>
            </div>

            <div class=${styles.price}>
                <img src="./icon-time.png" alt="clock">
                <h4>За день</h4>
                <p>$35.00</p>
            </div>
        </div>

        <form name="reviewForm" class=${styles.reviewForm} action="">
            <h2>Оставьте отзыв о транспорте</h2>
            <p>Это поможет нам узнать какой транспорт не пользуется
                популярностью и убрать его, а те которые понравились - зарядить побольше!</p>

            <div class=${styles.rating}>
                <input value="5" name="rating" id="star5" type="radio">
                <label for="star5"></label>

                <input value="4" name="rating" id="star4" type="radio">
                <label for="star4"></label>

                <input value="3" name="rating" id="star3" type="radio">
                <label for="star3"></label>

                <input value="2" name="rating" id="star2" type="radio">
                <label for="star2"></label>

                <input value="1" name="rating" id="star1" type="radio">
                <label for="star1"></label>
            </div>

            <h2>Расскажите о товаре</h2>

            <div class=${styles.inputGroup}>
                <input required="" type="text" name="text" autocomplete="off" class=${styles.reviewInput}>
                <label class=${styles.reviewLabel}>Опишите плюсы товара*</label>
            </div>

            <div class=${styles.inputGroup}>
                <input required type="text" id="negativeInput" name="negative" autocomplete="off" class=${styles.reviewInput}>
                <label class=${styles.reviewLabel}>Опишите недостатки товара*</label>
            </div>

            <div class=${styles.inputGroup}>
                <input required type="text" id="commentsInput" name="comments" autocomplete="off" class=${styles.reviewInput}>
                <label class=${styles.reviewLabel}>Дополнительные комментарии</label>
            </div>

            <button type="submit" class="${styles.submitButton} ${styles.button}">Отправить
                отзыв</button>
        </form>
    </main>

    <div class=${styles.reviewsList}>
        <h2>Отзывы:</h2>
        <div></div>
    </div>

    <footer>
        <button class=${styles.button} id="rentButton">Арендовать</button>

        <div class=${styles.help}>
            <h3>Tex поддержка</h3>
            <button class=${styles.button}>Связаться</button>
        </div>
    </footer>

    <script>
        AOS.init();
    </script>`
    
    document.querySelector('#allow').addEventListener('click', () => {
        ROOT_ELEMENT.innerHTML = '';
        // const user = firebaseAuth.getCurrentUser()
        // todo: check if User = Admin
        renderMainPage()
    });
}