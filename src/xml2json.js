function parse_node (node) {    
    const {nodeName, localName} = node;
    let r = { name: nodeName, localName };    
    const attributes = {};
    for (let i = 0; i < node.attributes.length; ++i) {
        const a = node.attributes[i];
        attributes[a.name] = a.value;
    }
    if (Object.keys(attributes).length) {
        r.attributes = attributes;
    }    
    const children = [];        
    for(let i = 0; i < node.childNodes.length; ++i) {
        const n = node.childNodes[i];
        if (n.nodeType === 1) {
            children.push(parse_node(n));
        }        
    }    
    if (children.length) {
        r.children = children;
    }
    else if (node.textContent) {        
        r.value = node.textContent;
    }
    return r;
};

function parse  (xml) {        
    return parse_node(xml.childNodes[0]);
};

export default parse;