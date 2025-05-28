import { PIECE_OF_ADMIN_NICKNAME, ROOT_ELEMENT, TRANSPORT_COLLECTION_NAME } from '../constants.js';
import { firebaseAuth, firebaseFirestore, renderMainPage, triggerPopUp } from '../index.js';

import styles from './transportInfo.module.css';

export async function renderTransportInfo(transportData) {
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
                <input value="5" name="rating" id="star5" type="radio" required>
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
                <label>Опишите плюсы транспорта*</label>
                <input required type="text" name="pluses" class=${styles.reviewInput} placeholder="Плюсы транспорта">
            </div>

            <div class=${styles.inputGroup}>
                <label>Опишите недостатки транспорта*</label>
                <input required type="text" name="cons" class=${styles.reviewInput} placeholder="Недостатки транспорта -">
            </div>

            <div class=${styles.inputGroup}>
                <label>Дополнительные комментарии</label>
                <input type="text" name="comments" class=${styles.reviewInput} placeholder="Дополнительные комментарии">
            </div>

            <button type="submit" class="${styles.submitButton} ${styles.button}">Отправить
                отзыв</button>
        </form>
    </main>

    <div class=${styles.reviewContainer} id="reviewContainer">
        <h2>Отзывы</h2>
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

    const currentUser = firebaseAuth.getCurrentUser();
    // Выход на основную страницу
    document.querySelector('#arrowBack').addEventListener('click', () => {
        ROOT_ELEMENT.innerHTML = '';

        let isAdmin;

        if (currentUser.displayName) {
            isAdmin = currentUser.displayName.includes(PIECE_OF_ADMIN_NICKNAME);
        } else {
            isAdmin = false;
        }

        renderMainPage(isAdmin);
    });

    // Отзывы
    const reviewContainer = document.querySelector('#reviewContainer');

    if (transportData.reviews.length) {
        transportData.reviews.forEach((review) => {
            const reviewElement = `
            <div class=${styles.review}>
                <div class=${styles.reviewTop}>
                    <div class=${styles.userInfo}>
                        <p${review?.owner || 'anonim'}</p>
                        <p>${review.date}</p>
                    </div>
                </div>
                
                <div class=${styles.reviewSection}>
                    <div class="${styles.sectionTitle} ${styles.pros}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L4 12l8 10 8-10z"/>
                        </svg>
                        Плюсы
                    </div>

                    <div>${review.pluses}</div>
                </div>
                
                <div class=${styles.reviewSection}>
                    <div class="${styles.sectionTitle} ${styles.cons}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22L4 12l8-10 8 10z"/>
                        </svg>
                        Минусы
                    </div>
                    <div>${review.cons}</div>
                </div>
                
                <div class=${styles.reviewSection} id="commentsSection">
                    <div class="${styles.sectionTitle} ${styles.comments}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.115l-.78 2.77 3.116-1.65c.88.275 1.823.425 2.775.425 4.97 0 9-3.186 9-7.115C21 6.186 16.97 3 12 3z"/>
                        </svg>
                        Дополнительные комментарии
                    </div>

                    <div>${review?.comments}</div>
                </div>
            </div>`

            reviewContainer.insertAdjacentHTML('beforeend', reviewElement);

            if (!review.comments) {
                document.querySelector('#commentsSection').remove();
            }
        })
    } else {
        reviewContainer.innerHTML = ''
    }

    // Добавление отзывов
    const reviewForm = document.forms.reviewForm;

    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const form = event.target
        const formElements = form.elements;

        const rating = document.querySelector('input[name="rating"]:checked').value;

        const pluses = formElements.pluses.value;
        const cons = formElements.cons.value;
        const comments = formElements.comments.value;

        const review = {
            owner: currentUser.displayName || 'anonim',
            rating: Number(rating),
            pluses,
            cons,
            comments,
            date: new Date().toLocaleString()
        };

        triggerPopUp({
            title: 'Спасибо!',
            text: 'Ваше мнение – топливо для нашего прогресса ⚡',
        })

        transportData.reviews.push(review);
        firebaseFirestore.updateDoc(TRANSPORT_COLLECTION_NAME, transportData.plate_number, transportData)
    });
}