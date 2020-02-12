const parse_node = node => {    
    let r = {
        name: node.localName
    };
    const attributes = {};
    for (const a of node.attributes) {        
        const value = parseFloat(a.value);
        attributes[a.name] = isNaN(value) ? a.value : value;
    }
    if (Object.keys(attributes).length) {
        r.attributes = attributes;
    }
    const children = [];
    for (const n of node.children) {
        children.push(parse_node(n));
    }
    if (children.length) {
        r.children = children;
    }
    else if (node.textContent) {
        const value = parseFloat(node.textContent);
        r.value = isNaN(value) ? node.textContent : value;
    }
    return r;
};

const parse = xml => {
    const [root] = xml.children;
    return parse_node(root);
};

export default parse;