function initScroll() {
  const orderButtons = document.querySelectorAll('.scroll-to-order');
  const orderForm = document.getElementById('order-form');

  if (!orderButtons.length || !orderForm) return;

  const handleScrollClick = (event) => {
    event.preventDefault();
    orderForm.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  orderButtons.forEach((button) => {
    button.addEventListener('click', handleScrollClick);
  });
}

function initTimer() {
  const TIMER_DURATION = 29 * 60 + 59;
  const TIMER_KEY = 'promo_timer_end';

  let endTime = Number(localStorage.getItem(TIMER_KEY));

  if (!endTime || Number.isNaN(endTime) || endTime < Date.now()) {
    endTime = Date.now() + TIMER_DURATION * 1000;
    localStorage.setItem(TIMER_KEY, String(endTime));
  }

  const timers = [
    {
      hours: document.getElementById('t1-hours'),
      minutes: document.getElementById('t1-minutes'),
      seconds: document.getElementById('t1-seconds'),
    },
    {
      hours: document.getElementById('t2-hours'),
      minutes: document.getElementById('t2-minutes'),
      seconds: document.getElementById('t2-seconds'),
    },
  ];

  const hasTimerElements = timers.some(
    (timer) => timer.hours || timer.minutes || timer.seconds
  );

  if (!hasTimerElements) return;

  const pad = (value) => String(value).padStart(2, '0');

  const updateTimers = () => {
    let remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

    if (remaining === 0) {
      endTime = Date.now() + TIMER_DURATION * 1000;
      localStorage.setItem(TIMER_KEY, String(endTime));
      remaining = TIMER_DURATION;
    }

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    timers.forEach((timer) => {
      if (timer.hours) timer.hours.textContent = pad(hours);
      if (timer.minutes) timer.minutes.textContent = pad(minutes);
      if (timer.seconds) timer.seconds.textContent = pad(seconds);
    });
  };

  updateTimers();
  setInterval(updateTimers, 1000);
}

function initVideo() {
  const promoVideo = document.getElementById('promo-video');
  const videoSection = document.querySelector('.video-section');

  if (!promoVideo || !videoSection || !('IntersectionObserver' in window)) return;

  promoVideo.volume = 0.3;
  promoVideo.preload = 'none';

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          promoVideo.play().catch(() => {});
        } else {
          promoVideo.pause();
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  videoObserver.observe(videoSection);
}

initScroll();

requestAnimationFrame(() => {
  initTimer();
});

window.addEventListener('load', () => {
  initVideo();
});