import WmsView from './View.svelte';
import './icons.css';
import './index.css';

window.addEventListener('load', () => {
   const app = new WmsView({
      target: document.body,      
   });
   app.$on('change:visible', ({detail}) => {
      console.log(detail);
   });
});