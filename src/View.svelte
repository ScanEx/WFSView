<script>
    import './View.css';    
    import {toLayers, toFeatures} from './wmfs.js';
    import WFS from './WFS.svelte';    
    import WMS from './WMS.svelte';
    import Dialog from './Dialog.svelte';
    import T from 'scanex-translations';
    import {createEventDispatcher, onMount} from 'svelte';
    import getxml from './request.js';
    import xml2json from './xml2json.js';
    import L from 'leaflet';
    import parseFeatures from './gml.js';
    import {serviceProxy} from './config.json';
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
            delete links[url];
        }
    }

    function drawFeature (feature) {
        try {
            const {geometry, properties} = feature;
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
            const featureCollection = parseFeatures(data);
            if (featureCollection) {
                const {features, bbox} = featureCollection;
                const layers = features.map(drawFeature).filter(e => e);
                const [x1, y1, x2, y2] = bbox;                
                map.fitBounds([[y1,x1],[y2,x2]]);
                return layers;
            }
        }
        else {
            return [];
        }
    }

    async function getFeature (name, visible, url) {
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
                    const data = await getxml(`${url}?request=GetFeature&service=WFS&version=1.0.0&typeName=ms:${name}`);
                    const featureCollection = xml2json(data);
                    const layers = drawFeatures(featureCollection);
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

    function getScale (z) {
        return Math.pow(2, -z)*156543.033928041;
    }

    async function getMap ({name, bbox, visible, url}) {
        if (map) {            
            const link = links[url];
            if (visible) {                
                if (link && link[name]) {                    
                    const {layers} = link[name];
                    if (Array.isArray (layers) && layers.length) {
                        layers.forEach(layer => layer.addTo(map));
                    }                    
                }
                else {
                    const bounds = map.getBounds();  
                    let miny = Math.max(bounds.getSouth(), -90);
                    let maxy = Math.min(bounds.getNorth(), 90);
                    let minx = Math.max(bounds.getWest(), -180);
                    let maxx = Math.min(bounds.getEast(), 180);
                    if (bbox)
                    {
                        minx = Math.min(bbox.minx, minx);
                        miny = Math.min(bbox.miny, miny);
                        maxx = Math.max(bbox.maxx, maxx);
                        maxy = Math.max(bbox.maxy, maxy);

                        if (minx >= maxx || miny >= maxy) return;
                    }

                    const mercMin = L.Projection.Mercator.project({lat: miny, lng: minx});
                    const mercMax = L.Projection.Mercator.project({lat: maxy, lng: maxx});
                    const scale = getScale(map.getZoom());
                    const width = Math.round((mercMax.x - mercMin.x)/scale);
                    const height = Math.round((mercMax.y - mercMin.y)/scale);                    
                    const layer = L.tileLayer.wms(`${serviceProxy}?${encodeURIComponent(url)}`, {
                        layers: name,
                        styles: '',
                        width,
                        height,
                        format: 'image/png',
                        transparent: true,
                        attribution: ""
                    });
                    layer.addTo(map);
                    map.fitBounds([[bbox.maxy, bbox.minx],[bbox.miny, bbox.maxx]]);
                    links[url] = links[url] || {};
                    links[url][name] = { layers: [layer] };
                }
            }
            else if (link && link[name]) {                
                const {layers} = link[name];
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
        const data = await getxml (url.toString());
        const featureCollection = xml2json(data);
        const {title, features} = toFeatures(featureCollection);
        const lnk = new WFS({
            target: linksContainer,
            props: { features, title }
        });
        lnk.$on('close', () => {
            lnk.$destroy();
            closeLink(value);
        });
        lnk.$on('change:visible', async ({detail}) => {            
            const {name, visible} = detail;
            try {
                dispatch('request:start');
                await getFeature(name, visible, value);
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
        const data = await getxml (url.toString());
        const layerCollection = xml2json(data);
        const {title, layers} = toLayers(layerCollection);
        const lnk = new WMS({
            target: linksContainer,
            props: { layers, title }
        });
        lnk.$on('close', () => {
            lnk.$destroy();
            closeLink(value);
        });
        lnk.$on('change:visible', async ({detail}) => {   
            const {name, visible, exGeographicBoundingBox, crs} = detail;
            if (exGeographicBoundingBox) {
                const { eastBoundLongitude, northBoundLatitude, southBoundLatitude, westBoundLongitude } = exGeographicBoundingBox;
                const bbox = {
                    miny: southBoundLatitude,
                    maxy: northBoundLatitude,
                    minx: westBoundLongitude,
                    maxx: eastBoundLongitude,
                };                
                try {
                    dispatch('request:start');
                    await getMap({name, visible, bbox, url: value, crs});
                    dispatch('request:end');
                }
                catch(e) {
                    dispatch('request:error');
                }
            }            
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