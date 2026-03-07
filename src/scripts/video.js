export function initVideo() {
  const promoVideo = document.getElementById('promo-video');
  const videoSection = document.querySelector('.video-section');

  if (promoVideo && videoSection) {
    promoVideo.volume = 0.3;

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const playPromise = promoVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log("Автовідтворення заблоковано браузером, очікуємо кліку клієнта.", error);
            });
          }
        } else {
          promoVideo.pause();
        }
      });
    }, {
      threshold: 0.5
    });

    videoObserver.observe(videoSection);
  }
}
