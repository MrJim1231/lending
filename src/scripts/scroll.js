export function initScroll() {
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
}
