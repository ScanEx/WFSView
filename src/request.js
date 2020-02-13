import {serviceProxy} from './config.json';
import xml2json from './xml2json.js';

const send = url => new Promise((resolve, reject) => {
    try {
        const xhr = new XMLHttpRequest();            
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {                         
                resolve (xml2json(xhr.responseXML));
            }
            else {
                reject(xhr);
            }
        });
        xhr.addEventListener('error', e => {
            reject(e);
        });
        xhr.open('GET', `${serviceProxy}?${encodeURIComponent(url)}`);
        xhr.send();                     
    }
    catch (e) {
        reject(e);
    }       
});

export default send;