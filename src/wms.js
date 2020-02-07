const evaluateXPath = (root, context, exp) => {
    const resolver = () => 'http://www.opengis.net/wms';
    const result = root.evaluate(exp, context, resolver, XPathResult.ANY_TYPE, null);
    const nodes = [];
    let n;
    switch (result.resultType) {
        case XPathResult.ANY_TYPE:
            break;
        case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:            
            n = result.iterateNext();            
            while(n) {
                nodes.push(n);
                n = result.iterateNext();
            }
            break;
        default:
            break;
    }    
    return nodes;
}

const read_single = (root, context, expr) => {
    const n = evaluateXPath(root, context, expr)
    return n.length === 1 && n[0].textContent || '';
};

const read_many = (root, context, expr) => {
    const n = evaluateXPath(root, context, expr)
    return n.length > 0 && n.map(x => x.textContent) || [];
};

const read_ex_geographic_bbox = (root, context) => {
    return {
        westBoundLongitude: parseFloat (read_single(root, context, 'wms:westBoundLongitude')),
        eastBoundLongitude: parseFloat (read_single(root, context, 'wms:eastBoundLongitude')),
        southBoundLatitude: parseFloat (read_single(root, context, 'wms:southBoundLatitude')),
        northBoundLatitude: parseFloat (read_single(root, context, 'wms:northBoundLatitude')),
    };
};

const read_bbox = (root, context) => {
    return {
        crs: read_single(root, context, '@CRS'),
        minx: parseFloat(read_single(root, context, '@minx')),
        miny: parseFloat(read_single(root, context, '@miny')),
        maxx: parseFloat(read_single(root, context, '@maxx')),
        maxy: parseFloat(read_single(root, context, '@maxy')),
    };    
};

const read_layer = (root, context) => {        
    const title = read_single(root, context, 'wms:Title');
    const name = read_single(root, context, 'wms:Name');
    const abstract = read_single(root, context, 'wms:Abstract');
    const crs = read_many(root, context, 'wms:CRS');
    const layers = evaluateXPath(root, context, 'wms:Layer').map(context => read_layer(root, context));
    const exGeographicBoundingBoxNodes = evaluateXPath(root, context, 'wms:EX_GeographicBoundingBox');
    const boundingBoxes = evaluateXPath(root, context, 'wms:BoundingBox').map(context => read_bbox(root, context));
    return {
        title,
        name,
        abstract,
        crs,
        layers,
        exGeographicBoundingBox: exGeographicBoundingBoxNodes.length > 0 ? read_ex_geographic_bbox(root, exGeographicBoundingBoxNodes[0]) : [],
        boundingBoxes 
    };
};
 
const read_cap = (root, context) => {
    const layers = evaluateXPath(root, context, 'wms:Layer').map(context => read_layer(root, context));
    return { layers };
};

const parse = root => {    
    const capabilities = evaluateXPath(root, root, '/wms:WMS_Capabilities/wms:Capability').map(context => read_cap(root, context));
    return { capabilities };
};

export default parse;