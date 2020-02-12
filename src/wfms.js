const uncap = str => `${str.substr(0, 1).toLowerCase()}${str.substr(1)}`;

const parseNode = node => {
    let r = {};
    for (const n of node.children) {        
        r[uncap(n.name)] = n.value;
    }
    return r;
};

const toLayer = node => {
    let r = {};
    for (const n of node.children) {
        const {name} = n;
        if (name === 'Title') {
            r.title = n.value;
        }
        switch(name) {
            case 'Title':                
            case 'Name':
                r[uncap(name)] = n.value;
                break;
            case 'Layer':
                if (r.children) {
                    r.children.push(toLayer(n));
                }
                else {
                    r.children = [toLayer(n)];
                }
                break;            
            case 'CRS':
                if (r.crs) {
                    r.crs.push(n.value);
                }
                else {
                    r.crs = [n.value];
                }
                break;
            case 'EX_GeographicBoundingBox':
                r.exGeographicBoundingBox = parseNode(n);
                break;
            case 'BoundingBox':
                if (r.boundingBoxes) {
                    r.boundingBoxes.push(n.attributes);
                }
                else {
                    r.boundingBoxes = [n.attributes];
                }                    
                break;
            default:
                break;
        }
    }
    return r;
};

const toLayers = ({children}) => {
    return children.reduce((a, n) => {
        switch(n.name) {
            case 'Capability':                                        
                n.children
                .filter(x => x.name === 'Layer')
                .map(toLayer)
                .forEach(x => a.layers = a.layers ? a.layers.concat(x) : [x]);
                break;
            case 'Service':
                a = {...a, ...parseNode(n)};
                break;
            default:
                break;
        }
        return a;
    }, {});
};

const toFeature = node => {
    let r = {};
    for (const n of node.children) {
        const {name} = n;        
        switch(name) {
            case 'Title':
            case 'Name':            
            case 'Abstract':
            case 'DefaultSRS':
                r[uncap(name)] = n.value;
                break;
            case 'OtherSRS':
                if (r.otherSRS) {
                    r.otherSRS.push(n.value);
                }
                else {
                    r.otherSRS = [n.value];
                }
                break;            
            case 'WGS84BoundingBox':                
                r.wgs84BoundingBox = parseNode(n);
                break;
            default:
                break;
        }
    }
    return r;
};

const toFeatures = ({children}) => {
    return children.reduce((a, n) => {
        const {name} = n;
        switch(name) {
            case 'FeatureTypeList':
                n.children
                .filter(x => x.name === 'FeatureType')
                .map(toFeature)
                .forEach(x => a.features = a.features ? a.features.concat(x) : [x]);
                break;
            case 'ServiceIdentification':
                a = {...a, ...parseNode(n)};
                break;
            default:
                break;
        }
        return a;
    }, []);
};

export {toLayers, toFeatures};