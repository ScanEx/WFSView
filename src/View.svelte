<script>
    import './View.css';
    import {WMS, WFS} from './data.js';
    import wms2json from './wms.js';
    import xml2json from './xml2json.js';
    import Link from './Link.svelte';
    import {onMount} from 'svelte';

    let url = '';

    const dp = new DOMParser();
    let links;

    const handleKey = e => {
        if (e.keyCode === 13) {
            addLink(url);
        }
    };

    function toLayer(node) {
        let r = {};
        for (const n of node.children) {
            const {name} = n;
            if (name === 'Title') {
                r.title = n.value;
            }
            switch(name) {
                case 'Title':
                    r.title = n.value;
                    break;
                case 'Name':
                    r.name = n.value;
                    break;
                case 'Layer':
                    if (r.children) {
                        r.children.push(toLayer(n));
                    }
                    else {
                        r.children = [toLayer(n)];
                    }
                    break;
                default:
                    break;
            }
        }
        return r;
    }

    async function addLink (url) {        
        try {          
            const xhr = new XMLHttpRequest();            
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {                         
                    const data = xml2json(xhr.responseXML);
                    console.log(data);
                    const {name, children} = data;
                    if (name === 'WMS_Capabilities') {
                        const layers = children.reduce((a, n) => {
                            if(n.name === 'Capability') {
                                a = a.concat (n.children.filter(x => x.name === 'Layer').map(toLayer));
                            }
                            return a;
                        }, []);
                        console.log(layers);                                            
                        const lnk = new Link({
                            target: links,
                            props: { 
                                layers,
                                title: `${url}`
                            }
                        });
                        lnk.$on('close', () => lnk.$destroy());
                        lnk.$on('change:visible', ({detail}) => {
                            console.log(detail);
                        });
                    }
                    
                }                
                else {
                    console.log(xhr);
                }
            });
            xhr.addEventListener('error', e => {
                console.log(e);
            });
            xhr.open('GET', `//maps.kosmosnimki.ru/proxy?${encodeURIComponent(url)}`);
            // xhr.open('GET', url);
            // xhr.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
            xhr.send();

            // const response = await fetch(`//maps.kosmosnimki.ru/proxy?${encodeURIComponent(url)}`, {                
            //     method: 'GET',
            //     mode: 'no-cors',
            //     credentials: 'include'
            // });
            // const result = await response.text();
            // console.log(result);
            
            
        }
        catch (e) {
            console.log(e);
        }       
    }   
</script>
<div class="scanex-wms-view">
    <div class="header">
        <input class="url" type="text" on:keydown|stopPropagation="{handleKey}" bind:value="{url}" />
    </div>
    <div class="links" bind:this="{links}">
    </div>
</div>