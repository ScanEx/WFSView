<script>
    import Feature from './Feature.svelte';
    import {createEventDispatcher} from 'svelte';
    import './Link.css';

    export let title = '';
    export let features = [];

    const dispatch = createEventDispatcher();
    
    function onChangeVisible({detail}) {
        dispatch('change:visible', {...detail, service: 'WFS'});
    }

</script>

<div class="scanex-svc-view-link">   
    <div class="header">
        <table cellspacing="0" cellpadding="0">
            <tr>
                <td>
                    <div class="service">WFS</div>
                </td>
                <td class="title">{title}</td>
                <td>
                    <i class="icon close" on:click="{() => dispatch('close')}"></i>
                </td>
            </tr>
        </table>
    </div>    
    <div class="content">
        {#each features as f}
        <Feature {...f} on:change:visible="{onChangeVisible}" />
        {/each}
    </div>
</div>