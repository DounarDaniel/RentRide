const batteryLevelInput = document.querySelector('#batteryLevel');
const sliderFill = document.querySelector('.slider-fill');
const batteryPercentageSpan = document.querySelector('.battery-percentage');

batteryLevelInput.addEventListener('input', function() {
  const percentage = this.value;
  sliderFill.style.width = percentage + '%';
  batteryPercentageSpan.textContent = percentage + '%';
});
