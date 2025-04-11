const batteryLevelInput = document.getElementById('batteryLevel');
const sliderFill = document.getElementById('sliderFill');
const batteryPercentageSpan = document.getElementById('batteryPercentage');

batteryLevelInput.addEventListener('input', function() {
  const percentage = this.value;
  sliderFill.style.width = percentage + '%';
  batteryPercentageSpan.textContent = percentage + '%';
});
