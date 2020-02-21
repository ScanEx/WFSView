import View from './View.svelte';
import './browser.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

window.addEventListener('load', () => {

   const map = L.map('map').setView([55, 38], 4);

   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map);
   
   new View({ 
      target: document.querySelector('#sidebar'),
      props: {
         map
      }
   });

});