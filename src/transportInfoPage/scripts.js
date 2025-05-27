const slider = document.querySelector('.slider');
const prevButton = document.querySelector('.prevButton');
const nextButton = document.querySelector('.nextButton');
const slides = Array.from(document.querySelectorAll('.slide'));
const slideCount = slides.length;
let slideIndex = 0;

function initSlider() {
  prevButton.addEventListener('click', showPreviousSlide);
  nextButton.addEventListener('click', showNextSlide);
  updateSlider();
}

function showPreviousSlide() {
  slideIndex = (slideIndex - 1 + slideCount) % slideCount;
  updateSlider();
}

function showNextSlide() {
  slideIndex = (slideIndex + 1) % slideCount;
  updateSlider();
}

function updateSlider() {
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === slideIndex);
  });
}

function initReviews() {
  loadReviews();

  const reviewForm = document.querySelector('.reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();
      submitReview();
    });
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', searchReviews);
  }
}

function submitReview() {
  const rating = document.querySelector('input[name="rating"]:checked');
  const positiveInput = document.querySelector('.review-input[name="text"]');
  const negativeInput = document.getElementById('negativeInput');
  const commentsInput = document.getElementById('commentsInput');

  if (!rating || !positiveInput.value || !negativeInput.value) {
    alert('Пожалуйста, укажите рейтинг и заполните обязательные поля');
    return;
  }

  const review = {
    id: Date.now(),
    rating: parseInt(rating.value),
    positive: positiveInput.value,
    negative: negativeInput.value,
    comments: commentsInput.value,
    date: new Date().toLocaleString()
  };

  let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  reviews.push(review);
  localStorage.setItem('reviews', JSON.stringify(reviews));
  document.querySelector('.reviewForm').reset();
  loadReviews();
  alert('Спасибо за ваш отзыв!');
}

function loadReviews(filter = '') {
  const reviewsList = document.querySelector('.reviewsList div');
  if (!reviewsList) return;

  let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

  if (filter) {
    const searchTerm = filter.toLowerCase();
    reviews = reviews.filter(r =>
      r.positive.toLowerCase().includes(searchTerm) ||
      r.negative.toLowerCase().includes(searchTerm) ||
      (r.comments && r.comments.toLowerCase().includes(searchTerm))
    );
  }

  if (reviews.length === 0) {
    reviewsList.innerHTML = '<p>Отзывов пока нет</p>';
    return;
  }

  reviewsList.innerHTML = '';
  reviews.forEach(review => {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';

    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < review.rating ? '★' : '☆';
    }

    reviewItem.innerHTML = `
      <div class="review-rating">${stars}</div>
      <p><strong>Понравилось:</strong> ${review.positive}</p>
      <p><strong>Недостатки:</strong> ${review.positive}</p>
      ${review.comments ? `<p><strong>Комментарии:</strong> ${review.comments}</p>` : ''}
      <small>${review.date}</small>
    `;

    reviewsList.appendChild(reviewItem);
  });
}

function searchReviews() {
  const searchTerm = document.getElementById('searchInput')?.value || '';
  loadReviews(searchTerm);
}

document.addEventListener('DOMContentLoaded', function () {
  initSlider();
  initReviews();
  AOS.init();
});