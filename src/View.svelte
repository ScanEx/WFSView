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
    import 'core-js/stable';
    import 'regenerator-runtime';
    import 'whatwg-fetch';
    import 'url-search-params-polyfill';

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
        const u = `${url.origin}${url.pathname}`;            
        const link = links[u];
        if (link) {
            Object.keys(link).forEach(k => {
                const {layer} = link[k];
                if (layer) {
                    layer.remove();
                }
            });
            delete links[u];
        }
    }

    const renderer = L.canvas();

    function getFeatureAttributes (url, name, id) {
        return new Promise((resolve, reject) => {
            if(url.searchParams.has('request')) {
                url.searchParams.set('request', 'GetFeature');
            }
            else {                        
                url.searchParams.append('request', 'GetFeature');
            }
            if (url.searchParams.has('service')) {
                url.searchParams.set('service', 'WFS');
            }
            else {
                url.searchParams.append('service', 'WFS');
            }
            if (url.searchParams.has('typeName')) {
                url.searchParams.set('typeName', name);
            }
            else {
                url.searchParams.append('typeName', name);
            }
            if (url.searchParams.has('featureID')) {
                url.searchParams.set('featureID', id);
            }
            else {
                url.searchParams.append('featureID', id);
            }
            if (url.searchParams.has('version')) {
                url.searchParams.set('version', '2.0.0');
            }
            else {
                url.searchParams.append('version', '2.0.0');
            }
            getxml(url.toString())
            .then(data => {
                const feature = xml2json(data);                
                resolve(feature);
            })
            .catch(e => {
                reject(e);
            });
        });        
    }

    function createFeature (feature) {
        try {
            const {geometry, properties} = feature;            
            const layer = L.geoJSON(feature, {
                style: x => {                    
                    return {
                        color: properties['ms:border_color'],
                        fillColor: properties['body_back_color'],
                        weight: properties['ms:border_width']
                    };
                },
                renderer
            });            
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
                const layers = features.map(f => createFeature(f)).filter(e => e);
                const fg = L.featureGroup(layers)
                    .bindPopup(({feature: {properties}}) => {                        
                        return `<table class="scanex-svc-view-attr">
                            <tr>
                                <td>name:</td>
                                <td>${properties['name']}</td>
                            </tr>
                            <tr>
                                <td>ms:id:</td>
                                <td>${properties['ms:id']}</td>
                            </tr>
                            <tr>
                                <td>ms:layer:</td>
                                <td>${properties['ms:layer']}</td>
                            </tr>
                        </table`;
                    })                   
                    .addTo(map);
                return fg;
            }
        }
        else {
            return [];
        }
    }

    function getFeature (name, visible, url) {
        return new Promise((resolve, reject) => {
            if (map) {            
                const u = `${url.origin}${url.pathname}`;
                const link = links[u];
                if (visible) {                
                    if (link && link[name]) {                    
                        const {layer} = link[name];
                        if (layer && !link[name].visible) {
                            layer.addTo(map);
                            const bounds = layer.getBounds();
                            map.fitBounds(bounds);
                            links[u][name].visible = true;
                        }
                        resolve();
                    }
                    else {                    
                        if(url.searchParams.has('request')) {
                            url.searchParams.set('request', 'GetFeature');
                        }
                        else {                        
                            url.searchParams.append('request', 'GetFeature');
                        }
                        if (url.searchParams.has('service')) {
                            url.searchParams.set('service', 'WFS');
                        }
                        else {
                            url.searchParams.append('service', 'WFS');
                        }
                        if (url.searchParams.has('typeName')) {
                            url.searchParams.set('typeName', name);
                        }
                        else {
                            url.searchParams.append('typeName', name);
                        }
                        if (url.searchParams.has('version')) {
                            url.searchParams.set('version', '1.0.0');
                        }
                        else {
                            url.searchParams.append('version', '1.0.0');
                        }
                        getxml(url.toString())
                        .then(data => {
                            const featureCollection = xml2json(data);
                            const layer = drawFeatures(featureCollection);
                            const bounds = layer.getBounds();
                            map.fitBounds(bounds);
                            links[u] = links[u] || {};
                            links[u][name] = { data, layer, visible: true };
                            resolve();
                        })
                        .catch(e => {
                            reject(e);
                        });                        
                    }                
                }
                else if (link && link[name]) {                
                    const {layer} = link[name];
                    if (layer) {
                        layer.remove();
                        links[u][name].visible = false;
                    }
                    resolve();
                }                
            }
            else {
                reject(new Error('map not defined'));
            }
        });        
    }

    function getScale (z) {
        return Math.pow(2, -z)*156543.033928041;
    }

    // function getFeatureInfo (name, visible, url, width, height, crs) {
    //     return new Promise((resolve, reject) => {
    //         if (map) {            
    //             const u = `${url.origin}${url.pathname}`;
    //             const link = links[u];
    //             if (visible) {                
    //                 if (link && link[name]) {                    
    //                     const {layer} = link[name];
    //                     if (layer && !link[name].visible) {
    //                         layer.addTo(map);
    //                         const bounds = layer.getBounds();
    //                         map.fitBounds(bounds);
    //                         links[u][name].visible = true;
    //                     }
    //                     resolve();
    //                 }
    //                 else {                    
    //                     if(url.searchParams.has('request')) {
    //                         url.searchParams.set('request', 'GetFeatureInfo');
    //                     }
    //                     else {                        
    //                         url.searchParams.append('request', 'GetFeatureInfo');
    //                     }
    //                     if (url.searchParams.has('service')) {
    //                         url.searchParams.set('service', 'WMS');
    //                     }
    //                     else {
    //                         url.searchParams.append('service', 'WMS');
    //                     }
    //                     if (url.searchParams.has('layers')) {
    //                         url.searchParams.set('layers', name);
    //                     }
    //                     else {
    //                         url.searchParams.append('layers', name);
    //                     }
    //                     if (url.searchParams.has('query_layers')) {
    //                         url.searchParams.set('query_layers', name);
    //                     }
    //                     else {
    //                         url.searchParams.append('query_layers', name);
    //                     }
    //                     if (url.searchParams.has('version')) {
    //                         url.searchParams.set('version', '1.3.0');
    //                     }
    //                     else {
    //                         url.searchParams.append('version', '1.3.0');
    //                     }
    //                     if (url.searchParams.has('info_format')) {
    //                         url.searchParams.set('info_format', 'JSON');
    //                     }
    //                     else {
    //                         url.searchParams.append('info_format', 'JSON');
    //                     }
    //                     if (url.searchParams.has('i')) {
    //                         url.searchParams.set('i', '0');
    //                     }
    //                     else {
    //                         url.searchParams.append('i', '0');
    //                     }
    //                     if (url.searchParams.has('j')) {
    //                         url.searchParams.set('j', '0');
    //                     }
    //                     else {
    //                         url.searchParams.append('j', '0');
    //                     }
    //                     if (url.searchParams.has('width')) {
    //                         url.searchParams.set('width', width);
    //                     }
    //                     else {
    //                         url.searchParams.append('width', width);
    //                     }
    //                     if (url.searchParams.has('height')) {
    //                         url.searchParams.set('height', height);
    //                     }
    //                     else {
    //                         url.searchParams.append('height', height);
    //                     }
    //                     if (url.searchParams.has('crs')) {
    //                         url.searchParams.set('crs', 'EPSG:3857');
    //                     }
    //                     else {
    //                         url.searchParams.append('crs', 'EPSG:3857');
    //                     }
    //                     getxml(url.toString())
    //                     .then(data => {
    //                         const featureCollection = xml2json(data);
    //                         // const layer = drawFeatures(featureCollection);
    //                         // const bounds = layer.getBounds();
    //                         // map.fitBounds(bounds);
    //                         // links[u] = links[u] || {};
    //                         // links[u][name] = { data, layer, visible: true };
    //                         resolve();
    //                     })
    //                     .catch(e => {
    //                         reject(e);
    //                     });                        
    //                 }                
    //             }
    //             else if (link && link[name]) {                
    //                 const {layer} = link[name];
    //                 if (layer) {
    //                     layer.remove();
    //                     links[u][name].visible = false;
    //                 }
    //                 resolve();
    //             }                
    //         }
    //         else {
    //             reject(new Error('map not defined'));
    //         }
    //     });  
    // }

    function getMap ({name, bbox, visible, url}) {
        if (map) {
            const u = `${url.origin}${url.pathname}`;
            const link = links[u];
            if (visible) {                
                if (link && link[name]) {                    
                    const {layer} = link[name];
                    if (layer && !link[name].visible) {
                        layer.addTo(map);
                        links[u][name].visible = true;                        
                        map.fitBounds([[bbox.maxy,bbox.minx],[bbox.miny,bbox.maxx]]);                        
                    }                    
                }
                else {

                    const bs = map.getBounds();  
                    let miny = Math.max(bs.getSouth(), -90);
                    let maxy = Math.min(bs.getNorth(), 90);
                    let minx = Math.max(bs.getWest(), -180);
                    let maxx = Math.min(bs.getEast(), 180);
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

                    if(url.searchParams.has('request')) {
                        url.searchParams.delete('request');
                    }                    
                    if (url.searchParams.has('service')) {
                        url.searchParams.delete('service');
                    }                    
                    if (url.searchParams.has('version')) {
                        url.searchParams.delete('version');
                    }                                        
                    const layer = L.tileLayer.wms(`${serviceProxy}?${encodeURIComponent(url.toString())}`, {
                        layers: name,
                        styles: '',
                        width,
                        height,
                        format: 'image/png',
                        transparent: true,
                        attribution: ""
                    });                    
                    layer.addTo(map);   
                    map.fitBounds([[bbox.maxy,bbox.minx],[bbox.miny,bbox.maxx]]);
                    links[u] = links[u] || {};
                    links[u][name] = { layer, visible };
                }
            }
            else if (link && link[name]) {                
                const {layer, visible} = link[name];
                if (layer && visible) {
                    layer.remove();
                    links[u][name].visible = false;
                }
            }
        }
    }

    function addwfs (value) {
        return new Promise((resolve, reject) => {
            const url = new URL(value);
            if (url.searchParams.has('service')) {
                url.searchParams.set('service', 'WFS');
            }
            else {
                url.searchParams.append('service', 'WFS');
            }
            if (url.searchParams.has('request')) {
                url.searchParams.set('request', 'GetCapabilities');
            }
            else {
                url.searchParams.append('request', 'GetCapabilities');
            }
            if (!url.searchParams.has('version')) {
                url.searchParams.append('version', '1.3.0');
            }        
            const u = url.toString();        
            getxml(u)
            .then(data => {
                const featureCollection = xml2json(data);
                const {title, features} = toFeatures(featureCollection);
                const lnk = new WFS({
                    target: linksContainer,
                    props: { features, title }
                });
                lnk.$on('close', () => {
                    lnk.$destroy();
                    closeLink(url);
                });
                lnk.$on('change:visible', ({detail}) => {
                    const {name, visible} = detail;
                    dispatch('request:start');
                    getFeature(name, visible, url)
                    .then(() => dispatch('request:end'))
                    .catch(e => dispatch('request:error'));           
                });
                resolve();           
            })
            .catch(e => reject(e));
        });           
    }

    function addwms (value) {
        return new Promise((resolve, reject) => {
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
            getxml (url.toString())
            .then(data => {
                const layerCollection = xml2json(data);
                const {title, layers} = toLayers(layerCollection);
                const lnk = new WMS({
                    target: linksContainer,
                    props: { layers, title }
                });
                lnk.$on('close', () => {
                    lnk.$destroy();
                    closeLink(url);
                });
                lnk.$on('change:visible', ({detail}) => {
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
                            getMap({name, visible, bbox, url, crs});
                            dispatch('request:end');
                        }
                        catch(e) {
                            dispatch('request:error');
                        }                                                
                    }
                    // else if (width && height) {
                    //     dispatch('request:start');
                    //     getFeatureInfo(name, visible, url, width, height, crs)
                    //     .then(() => dispatch('request:end'))
                    //     .catch(e => dispatch('request:error'));
                    // }                                      
                });
                resolve();                
            })
            .catch(e => reject(e));
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
        dlg.$on('ok', ({detail}) => {
            const value = detail;
            dlg.$destroy();
            if (value) {
                dispatch('request:start');
                addwfs(value).then(() => dispatch('request:end')).catch(e => dispatch('request:error', e));
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
        dlg.$on('ok', ({detail}) => {
            const value = detail;            
            dlg.$destroy();
            if (value) {                
                dispatch('request:start');
                addwms(value).then(() => dispatch('request:end')).catch(e => dispatch('request:error', e));                
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