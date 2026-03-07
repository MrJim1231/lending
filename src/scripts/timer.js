export function initTimer() {
  const TIMER_DURATION = 29 * 60 + 59; // 29:59 в секундах
  const TIMER_KEY = 'promo_timer_end';

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
      endTime = Date.now() + TIMER_DURATION * 1000;
      localStorage.setItem(TIMER_KEY, endTime);
      setTimeout(updateTimers, 1000);
    }
  }

  updateTimers();
}
