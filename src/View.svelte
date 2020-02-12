<script>
    import './View.css';    
    import xml2json from './xml2json.js';
    import {toLayers, toFeatures} from './wfms.js';
    import WfsLink from './WfsLink.svelte';    
    import WmsLink from './WmsLink.svelte';
    import './icons.css';

    let links;
    let info;
    let proxy = '//maps.kosmosnimki.ru/proxy';

    function addLink (url) {        
        return new Promise((resolve, reject) => {
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
                xhr.open('GET', `${proxy}?${encodeURIComponent(url)}`);
                xhr.send();                     
            }
            catch (e) {
                reject(e);
            }       
        });
    }

    async function addWFS () {
        const value = prompt('Добавить ссылку на WFS-сервис');
        if (value) {
            const url = new URL(value);
            if (!url.searchParams.has('service')) {
                url.searchParams.append('service', 'WFS');
            }
            if (!url.searchParams.has('request')) {
                url.searchParams.append('request', 'GetCapabilities');
            }
            if (!url.searchParams.has('version')) {
                url.searchParams.append('version', '1.3.0');
            }
            const data = await addLink (url.toString());
            const {title, features} = toFeatures(data);
            const lnk = new WfsLink({
                target: links,
                props: { features, title }
            });
            lnk.$on('close', () => lnk.$destroy());
            lnk.$on('change:visible', ({detail}) => {
                console.log(detail);
            });
        }        
    }

    async function addWMS () {
        const value = prompt('Добавить ссылку на WMS-сервис');
        if (value) {
            const url = new URL(value);
            if (!url.searchParams.has('service')) {
                url.searchParams.append('service', 'WMS');
            }
            if (!url.searchParams.has('request')) {
                url.searchParams.append('request', 'GetCapabilities');
            }
            if (!url.searchParams.has('version')) {
                url.searchParams.append('version', '1.3.0');
            }
            const data = await addLink (url.toString());
            const {title, layers} = toLayers(data);
            const lnk = new WmsLink({
                target: links,
                props: { layers, title }
            });
            lnk.$on('close', () => lnk.$destroy());
            lnk.$on('change:visible', ({detail}) => {
                console.log(detail);
            });
        }
    }
</script>
<div class="scanex-svc-view">
    <div class="header">
        <button on:click="{addWFS}">WFS</button>
        <button on:click="{addWMS}">WMS</button>        
    </div>
    <div class="links" bind:this="{links}">
    </div>
</div>