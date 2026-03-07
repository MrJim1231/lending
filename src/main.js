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
