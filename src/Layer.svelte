<script>
    import './Layer.css';
    import {createEventDispatcher} from 'svelte';

    export let title = '';
    export let name = '';
    export let children = [];
    export let visible = false;
    
    $: hasChildren = Array.isArray(children) && children.length > 0;

    let expanded = false;
    let state = 0;

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
    function togglechildren () {
        expanded = !expanded;
    }
    function toggleVisibility () {                  
        visible = !visible;
        dispatch('change:visible', {title, name, visible});
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
    <table cellpadding="0" cellspacing="0"
        class="scanex-wms-view-header"
        on:click|stopPropagation="{togglechildren}">
        <tr>
            <td>
                <i class="scanex-wms-view-visible icon" class:check-square="{state === 1}" class:square="{state === 0}" class:minus-square="{state === -1}" on:click|stopPropagation="{toggleVisibility}"></i>
            </td>
            {#if hasChildren}
            <td>
                <i class="scanex-wms-view-folder icon" class:folder-open="{expanded}" class:folder="{!expanded}"></i>
            </td>
            {/if}            
            <td class="scanex-wms-view-title">{title}</td>            
        </tr>
    </table>
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