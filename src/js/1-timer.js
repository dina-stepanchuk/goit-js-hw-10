import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const seconds = document.querySelector('[data-seconds]');
startBtn.disabled = true;

class Timer {
  constructor({ startBtn, input, elements }) {
    this.startBtn = startBtn;
    this.input = input;
    this.elements = elements;
    this.selectedDate = null;
    this.intervalId = null;
  }
  setDate(date) {
    this.selectedDate = date;
  }
  start() {
    this.startBtn.disabled = true;
    this.input.disabled = true;
    this.intervalId = setInterval(() => {
      const delta = this.selectedDate - new Date();

      if (delta <= 0) {
        this.stop();
        return;
      }
      const time = this.convertMs(delta);
      this.addLeadingZero(time);
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.input.disabled = false;
    this.startBtn.disabled = true;
    this.addLeadingZero({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  }
  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
    return { days, hours, minutes, seconds };
  }
  addLeadingZero({ hours, minutes, seconds }) {
    this.elements.days.textContent = String(days);
    this.elements.hours.textContent = String(hours).padStart(2, '0');
    this.elements.minutes.textContent = String(minutes).padStart(2, '0');
    this.elements.seconds.textContent = String(seconds).padStart(2, '0');
  }
}

const timer = new Timer({
  startBtn,
  input,
  elements: { days, hours, minutes, seconds },
});

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const now = new Date();

    if (selectedDate <= now) {
      startBtn.disabled = true;
      iziToast.error({
        color: 'red',
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        imageWidth: 30,
        maxWidth: 250,
      });
      return;
    }
    timer.setDate(selectedDate);
    if (!timer.intervalId) {
      startBtn.disabled = false;
    }
  },
};

flatpickr(input, options);
startBtn.addEventListener('click', () => {
  timer.start();
});
