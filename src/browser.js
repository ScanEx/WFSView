import View from './View.svelte';
import './browser.css';

window.addEventListener('load', () => {
   new View({ 
      target: document.body,
      props: {
         map: null
      }
   });   
});