<script>
    import './Layer.css';
    import {createEventDispatcher} from 'svelte';

    export let title = '';
    export let name = '';
    export let children = [];
    export let visible = false;
    export let crs = [];
    export let exGeographicBoundingBox;
    
    $: hasChildren = Array.isArray(children) && children.length > 0;

    let expanded = false;
    let state = 0;
    let infoVisible = false;

    const dispatch = createEventDispatcher();
    
    $: {        
        if (visible === true) {
            state = 1;
        }
        else if (visible === false) {
            state = 0;
        }
        else {
            state = -1;
        }
        if (Array.isArray(children) && (typeof (visible) !== 'undefined')) {
            for (let i = 0; i < children.length; i++) {
                children[i].visible = visible;
                dispatch('change:visible', { ...children[i], visible});
            }
        }
    }
    function toggleChildren () {
        expanded = !expanded;
    }
    function toggleVisibility () {                  
        visible = !visible;
        dispatch('change:visible', {title, name, exGeographicBoundingBox, crs, visible});
        dispatch('change:state', {title, name, visible});        
    }    
    
    function onChangeState (detail, i) {
        if (hasChildren) {
            children[i].visible = detail.visible;
            if (children.every(({visible}) => visible === true)) {
                visible = true;
            }
            else if (children.every(({visible}) => visible === false)) {
                visible = false;
            }
            else {
                visible = undefined;
            }
            dispatch('change:state', {title, name, visible});
        }
    }
    
</script>

<div class="layer">    
    <div class="header"        
        on:mouseenter|stopPropagation="{() => infoVisible = true}"
        on:mouseleave|stopPropagation="{() => infoVisible = false}"
        on:click|stopPropagation="{toggleChildren}">                
            <i class="scanex-svc-view-visible icon" class:check-square="{state === 1}" class:square="{state === 0}" class:minus-square="{state === -1}" on:click|stopPropagation="{toggleVisibility}"></i>            
            {#if hasChildren}        
                <i class="scanex-svc-view-folder icon" class:folder-open="{expanded}" class:folder="{!expanded}"></i>            
            {/if}            
            {title}
    </div>
    {#if Array.isArray(children) && children.length > 0}
    <div class="children" class:collapsed="{!expanded}">
        {#each children as layer, i}
        <svelte:self 
            {...layer}            
            on:change:visible            
            on:change:state="{({detail}) => onChangeState(detail, i)}"/>
        {/each}
    </div>
    {/if}
</div>