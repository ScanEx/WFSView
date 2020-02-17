<script>
    import './View.css';    
    import {toLayers, toFeatures} from './wmfs.js';
    import WFS from './WFS.svelte';    
    import WMS from './WMS.svelte';
    import Dialog from './Dialog.svelte';
    import T from 'scanex-translations';
    import {createEventDispatcher, onMount} from 'svelte';
    import send from './request.js';
    import L from 'leaflet';
    import parseFeature from './gml.js';
    import './icons.css';

    const translate = T.getText.bind(T);
    const dispatch = createEventDispatcher();

    T.addText('eng', {
        link: {
            wfs: 'Add WFS link',
            wms: 'Add WMS link',
        },
    });

    T.addText('rus', {
        link: {
            wfs: 'Добавить ссылку на WFS-сервис',
            wms: 'Добавить ссылку на WMS-сервис',
        },
    });

    let linksContainer;
    let links = {};

    export let map;

    function closeLink (url) {        
        const link = links[url];
        if (link) {
            Object.keys(link).forEach(k => {
                const {layers} = link[k];
                if (Array.isArray (layers) && layers.length) {
                    layers.forEach(layer => layer.remove());
                }
            });
        }
    }

    function drawFeature (feature) {
        try {
            const {geometry, properties} = parseFeature(feature);
            const layer = L.geoJSON(geometry, {
                style: x => {                    
                    return {color: properties['ms:border_color'], weight: 1};
                },
            });
            layer.addTo(map);
            return layer;
        }
        catch(e) {
            console.log(e);
            return null;
        } 
    }   

    function drawFeatures(data) {
        if (data.name === 'wfs:FeatureCollection') {
            return data.children.filter(({name}) => name === 'gml:featureMember').map(drawFeature).filter(e => e);
        }
        else {
            return [];
        }
    }

    async function getFeature (name, service, visible, url) {
        if (map) {            
            const link = links[url];
            if (visible) {                
                if (link && link[name]) {                    
                    const {data, layers} = link[name];
                    if (Array.isArray (layers) && layers.length) {
                        layers.forEach(layer => layer.addTo(map));
                    }                    
                }
                else {                    
                    const data = await send(`${url}?request=GetFeature&service=${service}&version=1.0.0&typeName=ms:${name}`);
                    const layers = drawFeatures(data);
                    links[url] = links[url] || {};
                    links[url][name] = { data, layers };
                }                
            }
            else if (link && link[name]) {                
                const {data, layers} = link[name];
                if (Array.isArray (layers) && layers.length) {
                    layers.forEach(layer => layer.remove());
                }
            }
        }
    }

    async function addwfs (value) {
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
        const data = await send (url.toString());
        const {title, features} = toFeatures(data);
        const lnk = new WFS({
            target: linksContainer,
            props: { features, title }
        });
        lnk.$on('close', () => {
            lnk.$destroy();
            closeLink(value);
        });
        lnk.$on('change:visible', async ({detail}) => {            
            const {name, service, visible} = detail;
            try {
                dispatch('request:start');
                await getFeature(name, service, visible, value);
                dispatch('request:end');
            }
            catch(e) {
                dispatch('request:error');
            } 
        });
    }

    async function addwms (value) {
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
        const data = await send (url.toString());
        const {title, layers} = toLayers(data);
        const lnk = new WMS({
            target: linksContainer,
            props: { layers, title }
        });
        lnk.$on('close', () => {
            lnk.$destroy();
            closeLink(value);
        });
        lnk.$on('change:visible', async ({detail}) => {   
            // const {name, service, visible} = detail;
            // try {
            //     dispatch('request:start');
            //     await getFeature(name, service, visible, value);
            //     dispatch('request:end');
            // }
            // catch(e) {
            //     dispatch('request:error');
            // }
        });
    }

    let header;
    let dlg;

    function getwfs () {
        if (dlg) {
            dlg.$destroy();
        }
        const {top, left} = header.getBoundingClientRect();
        dlg = new Dialog({
            target: document.body,
            props: { title: translate('link.wfs'), top, left }
        });
        dlg.$on('close', () => dlg.$destroy());        
        dlg.$on('ok', async ({detail}) => {
            const value = detail;
            dlg.$destroy();
            if (value) {
                try {
                    dispatch('request:start');
                    await addwfs(value);
                    dispatch('request:end');
                }
                catch(e) {
                    dispatch('request:error');
                }             
            }
        });                      
    }

    function getwms () {
        if (dlg) {
            dlg.$destroy();
        }
        const {top, left} = header.getBoundingClientRect();
        dlg = new Dialog({
            target: document.body,
            props: { title: translate('link.wms'), top, left }
        });
        dlg.$on('close', () => dlg.$destroy());        
        dlg.$on('ok', async ({detail}) => {
            const value = detail;            
            dlg.$destroy();
            if (value) {
                try {
                    dispatch('request:start');
                    await addwms(value);
                    dispatch('request:end');
                }
                catch(e) {
                    dispatch('request:error');
                }
            }
        });                      
    }    
</script>
<div class="scanex-svc-view">
    <div class="header" bind:this="{header}">
        <button on:click|stopPropagation="{getwfs}">WFS</button>
        <button on:click|stopPropagation="{getwms}">WMS</button>
    </div>
    <div class="links" bind:this="{linksContainer}">
    </div>
</div>