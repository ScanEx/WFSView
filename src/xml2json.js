const parse_node = node => {    
    let r = {};    
    for (const n of node.children) {
        if(r[n.nodeName]) {
            if(Array.isArray(r[n.nodeName])) {
                r[n.nodeName].push(parse_node(n));
            }
            else {
                r[n.nodeName] = [parse_node(n)];
            }
        }
        else {
            r[n.nodeName] = parse_node(n);
        }        
    }
    if (Object.keys(r).length === 0) {
        let n = {[node.nodeName]: {
            value: node.textContent
        }};
        const attributes = [];
        for (const a of node.attributes) {
            attributes.push (a.value);
        }
        if (attributes.length > 0) {
            n.attributes = attributes;
        }
        return n;
    } 
    else {
        return {[node.nodeName]: r};
    }   
    
};

const parse = xml => {
    const [root] = xml.children;
    return parse_node(root);
};

export default parse;