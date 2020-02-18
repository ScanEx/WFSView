<script>
    import Layer from './Layer.svelte';
    import {createEventDispatcher} from 'svelte';
    import './Link.css';

    export let title = '';
    export let layers = [];

    const dispatch = createEventDispatcher();   
    
</script>

<div class="scanex-svc-view-link">
    <div class="header">
        <table cellspacing="0" cellpadding="0">
            <tr>
                <td>
                    <div class="service">WMS</div>
                </td>
                <td class="title">{title}</td>
                <td>
                    <i class="icon close" on:click="{() => dispatch('close')}"></i>
                </td>
            </tr>
        </table>
    </div>    
    <div class="content">
        {#each layers as layer}
        <Layer {...layer} on:change:visible />
        {/each}
    </div>    
</div>