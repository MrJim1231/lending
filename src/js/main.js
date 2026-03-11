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
      el: document.querySelector('.hero__timer'),
      visible: false,
      hours: document.getElementById('t1-hours'),
      minutes: document.getElementById('t1-minutes'),
      seconds: document.getElementById('t1-seconds'),
    },
    {
      el: document.querySelector('.promo-bottom__timer'),
      visible: false,
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
      // Lazy init timer values if timer is in viewport
      if (!timer.el) return;
      if (!timer.visible) return;

      if (timer.hours) timer.hours.textContent = pad(hours);
      if (timer.minutes) timer.minutes.textContent = pad(minutes);
      if (timer.seconds) timer.seconds.textContent = pad(seconds);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        timers.forEach(timer => {
          if (timer.el === entry.target) {
            timer.visible = entry.isIntersecting;
            if (timer.visible) updateTimers(); // initial update
          }
        });
      });
    }, { rootMargin: '100px' });
    
    timers.forEach(timer => {
        if(timer.el) observer.observe(timer.el);
    });
  } else {
     timers.forEach(t => t.visible = true);
  }

  updateTimers();
  setInterval(updateTimers, 1000);
}

function initVideo() {
  const promoVideo = document.getElementById('promo-video');
  const videoSection = document.querySelector('.video-section');

  if (!promoVideo || !videoSection) return;

  promoVideo.volume = 0.3;
  promoVideo.preload = 'none';

  if (!('IntersectionObserver' in window)) return;

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Lazy load video src
            if(promoVideo.getAttribute('data-src')){
                promoVideo.src = promoVideo.getAttribute('data-src');
                promoVideo.removeAttribute('data-src');
                promoVideo.load();
            }
          promoVideo.play().catch(() => {});
        } else {
          promoVideo.pause();
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '200px'
    }
  );

  videoObserver.observe(videoSection);
}

// 1. Scroll logic must work immediately
initScroll();

// 2. Timer and video can wait until main thread is idle
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    initTimer();
  });
} else {
  setTimeout(() => {
    initTimer();
  }, 100);
}

// Ensure video init runs later
window.addEventListener('load', () => {
    // defer slightly more
    setTimeout(initVideo, 500);
});