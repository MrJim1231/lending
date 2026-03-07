import './styles/style.css'
import { initScroll } from './scripts/scroll.js'
import { initTimer } from './scripts/timer.js'
import { initVideo } from './scripts/video.js'

document.addEventListener('DOMContentLoaded', () => {
  initScroll();
  initTimer();
  initVideo();
});
