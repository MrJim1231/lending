import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll to the order form
  const orderButtons = document.querySelectorAll('.scroll-to-order');
  const orderForm = document.getElementById('order-form');

  if (orderButtons.length > 0 && orderForm) {
    orderButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        orderForm.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // --- Синхронізований таймер для екранів 1 і 7 ---
  const TIMER_DURATION = 29 * 60 + 59; // 29:59 в секундах
  const TIMER_KEY = 'promo_timer_end';

  // Перевіряємо, чи є збережений час закінчення. Якщо є — використовуємо, якщо ні — стартуємо новий
  let endTime = localStorage.getItem(TIMER_KEY);
  if (!endTime) {
    endTime = Date.now() + TIMER_DURATION * 1000;
    localStorage.setItem(TIMER_KEY, endTime);
  }
  endTime = parseInt(endTime);

  const pad = (n) => String(n).padStart(2, '0');

  function updateTimers() {
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;

    // Оновлюємо обидва таймери одночасно
    ['t1', 't2'].forEach(prefix => {
      const elH = document.getElementById(`${prefix}-hours`);
      const elM = document.getElementById(`${prefix}-minutes`);
      const elS = document.getElementById(`${prefix}-seconds`);
      if (elH) elH.textContent = pad(h);
      if (elM) elM.textContent = pad(m);
      if (elS) elS.textContent = pad(s);
    });

    if (remaining > 0) {
      setTimeout(updateTimers, 1000);
    } else {
      // Якщо таймер дійшов до 0 — перезапускаємо його автоматично
      endTime = Date.now() + TIMER_DURATION * 1000;
      localStorage.setItem(TIMER_KEY, endTime);
      setTimeout(updateTimers, 1000); // Продовжуємо цикл
    }
  }

  updateTimers();

  // --- Відео логіка (гучність 30% + пауза при скролі) ---
  const promoVideo = document.getElementById('promo-video');
  const videoSection = document.querySelector('.video-section');

  if (promoVideo && videoSection) {
    // Встановлюємо гучність на 30%
    promoVideo.volume = 0.3;

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Якщо відео потрапило в екран (мінімум на 50%) — намагаємося запустити
          const playPromise = promoVideo.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              // Сучасні браузери (Safari/Chrome) блокують автовідтворення ЗІ ЗВУКОМ, 
              // якщо користувач ще не клікав по сторінці. 
              // У такому випадку відео просто буде на паузі, поки клієнт сам не натисне Play.
              console.log("Автовідтворення заблоковано браузером, очікуємо кліку клієнта.", error);
            });
          }
        } else {
          // Якщо скролимо на інший екран — ставимо на паузу
          promoVideo.pause();
        }
      });
    }, {
      threshold: 0.5 // Спрацьовує, коли екран з відео видно хоча б на 50%
    });

    videoObserver.observe(videoSection);
  }
});
