<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import './Dialog.css';

    const dispatch = createEventDispatcher();

    let container;

    export let title = '';
    export let top = 0;
    export let left = 0;

    let value = '';

    function keydown (e) {
        if (e.keyCode === 13) {
            dispatch('ok', value);
        }
    }

    onMount(() => {
        container.style.top = `${top}px`;
        container.style.left = `${left}px`;
    });

</script>

<div class="scanex-svc-view-dialog" bind:this="{container}">
    <div class="header">
        <i class="icon close" on:click|stopPropagation="{() => dispatch('close')}"></i>
        {title}
    </div>
    <div class="content">
        <input type="text" on:keydown|stopPropagation="{keydown}" bind:value="{value}" />
    </div>    
</div>