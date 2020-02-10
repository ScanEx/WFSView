const parse_node = node => {    
    let r = {
        name: node.nodeName
    };
    const attributes = [];
    for (const a of node.attributes) {
        attributes.push(a.value);
    }
    if (attributes.length) {
        r.attributes = attributes;
    }
    const children = [];
    for (const n of node.children) {
        children.push(parse_node(n));
    }
    if (children.length) {
        r.children = children;
    }
    else {
        r.value = node.textContent;
    }
    return r;
};

const parse = xml => {
    const [root] = xml.children;
    return parse_node(root);
};

export default parse;