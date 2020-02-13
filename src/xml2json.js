const parse_node = node => {
    const {nodeName, localName} = node;
    let r = { name: nodeName, localName };
    const attributes = {};
    for (const a of node.attributes) {                
        attributes[a.name] = a.value;
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
        r.value = node.textContent;
    }
    return r;
};

const parse = xml => {
    const [root] = xml.children;
    return parse_node(root);
};

export default parse;