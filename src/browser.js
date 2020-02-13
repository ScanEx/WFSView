import View from './View.svelte';
import './browser.css';

window.addEventListener('load', () => {
   const app = new View({ target: document.body });
   app.$on('change:visible', ({detail}) => {
      console.log(detail);
   });
});