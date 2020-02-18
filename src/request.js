import {serviceProxy} from './config.json';

const getxml = url => new Promise((resolve, reject) => {
    try {
        const xhr = new XMLHttpRequest();            
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {                         
                resolve (xhr.responseXML);
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

export default getxml;