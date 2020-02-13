<script>
    import './View.css';    
    import {toLayers, toFeatures} from './wmfs.js';
    import WFS from './WFS.svelte';    
    import WMS from './WMS.svelte';
    import Dialog from './Dialog.svelte';
    import T from 'scanex-translations';
    import {createEventDispatcher, onMount} from 'svelte';
    import send from './request.js';
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

    let links;
    let info;
    let proxy = '//maps.kosmosnimki.ru/proxy';

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
            target: links,
            props: { features, title }
        });
        lnk.$on('close', () => lnk.$destroy());
        lnk.$on('change:visible', ({detail}) => {
            console.log(detail);
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
            target: links,
            props: { layers, title }
        });
        lnk.$on('close', () => lnk.$destroy());
        lnk.$on('change:visible', ({detail}) => {
            console.log(detail);
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
                    dispatch('link:start');
                    await addwfs(value);
                    dispatch('link:end');
                }
                catch(e) {
                    dispatch('link:error');
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
                    dispatch('link:start');
                    await addwms(value);
                    dispatch('link:end');
                }
                catch(e) {
                    dispatch('link:error');
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
    <div class="links" bind:this="{links}">
    </div>
</div>