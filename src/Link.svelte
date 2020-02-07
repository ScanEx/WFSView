<script>
    import Layer from './Layer.svelte';
    import {createEventDispatcher} from 'svelte';
    import './Link.css';

    export let title = '';
    export let layers = [];

    const dispatch = createEventDispatcher();    

</script>

<div class="scanex-wms-view-link">
    <div class="header">
        <label class="title">{title}</label>
        <i class="icon close" on:click|stopPropagation="{() => dispatch('close')}"></i>
    </div>
    <div class="content">
        {#each layers as layer}
        <Layer {...layer} on:change:visible />
        {/each}
    </div>    
</div>