import WsView from './View.svelte';
import './index.css';

window.addEventListener('load', () => {
   const app = new WsView({
      target: document.body,      
   });
   app.$on('change:visible', ({detail}) => {
      console.log(detail);
   });
});