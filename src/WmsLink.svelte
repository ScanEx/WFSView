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
        <i class="icon close" on:click="{() => dispatch('close')}"></i>
        {title}
    </div>
    <div class="content">
        {#each layers as layer}
        <Layer {...layer} on:change:visible on:show:info />
        {/each}
    </div>    
</div>