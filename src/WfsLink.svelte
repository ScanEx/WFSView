<script>
    import Feature from './Feature.svelte';
    import {createEventDispatcher} from 'svelte';
    import './Link.css';

    export let title = '';
    export let features = [];

    const dispatch = createEventDispatcher();    

</script>

<div class="scanex-svc-view-link">
    <div class="header">
        <i class="icon close" on:click="{() => dispatch('close')}"></i>
        {title}
    </div>
    <div class="content">
        {#each features as f}
        <Feature {...f} on:change:visible />
        {/each}
    </div>
</div>