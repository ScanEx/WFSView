<script>
    import './Feature.css';
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    export let name = '';
    export let title = '';
    export let abstract = '';
    export let visible = false;

    function toggleVisibility () {                  
        visible = !visible;
        dispatch('change:visible', {title, name, abstract, visible});        
    } 

</script>

<div class="feature">                
    <i class="scanex-svc-view-visible icon" class:check-square="{visible}" class:square="{!visible}" on:click|stopPropagation="{toggleVisibility}"></i>
    {title}
</div>