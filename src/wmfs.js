const uncap = str => `${str.substr(0, 1).toLowerCase()}${str.substr(1)}`;

const parseNode = node => {
    const {children} = node;
    if (Array.isArray(children)) {
        return children.reduce((a,e) => {
            return {...a, [uncap (e.name)]: e.value};
        }, {});
    }
    else {
        return null;
    }    
};

const parseExGeographicBoundingBox = node => {
    const { eastBoundLongitude,  northBoundLatitude, southBoundLatitude, westBoundLongitude } = parseNode(node);
    return { 
        eastBoundLongitude: parseFloat(eastBoundLongitude), 
        northBoundLatitude: parseFloat(northBoundLatitude),
        southBoundLatitude: parseFloat(southBoundLatitude),
        westBoundLongitude: parseFloat(westBoundLongitude)
    };
};

const parseStyle = node => {
    const {children} = node;
    if (Array.isArray(children)) {
        return children.reduce((a,e) => {}, {});
    }
    else {
        return null;
    }
};

const toLayer = node => {
    let r = {};
    for (const n of node.children) {
        const {localName, name} = n;        
        switch(localName) {            
            case 'Layer':
                if (r.children) {
                    r.children.push(toLayer(n));
                }
                else {
                    r.children = [toLayer(n)];
                }
                break;
            case 'Style':
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
                r.exGeographicBoundingBox = parseExGeographicBoundingBox(n);
                break;
            case 'BoundingBox':
                if (r[uncap(name)]) {
                    r[uncap(name)].push(n.attributes);
                }
                else {
                    r[uncap(name)] = [n.attributes];
                }               
                break;
            default:
                r[uncap(name)] = n.value;
                break;
        }
    }
    return r;
};

const toLayers = ({children}) => {
    return children.reduce((a, n) => {
        switch(n.localName) {
            case 'Capability':                                        
                n.children
                .filter(x => x.localName === 'Layer')
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
        const {localName, name} = n;
        switch(localName) {
            case 'Title':
                r.title = n.value;
                r[uncap(name)] = n.value;
                break;
            case 'Name':            
            case 'Abstract':
            case 'DefaultSRS':
                r[uncap(name)] = n.value;
                break;
            case 'OtherSRS':
                if (r[uncap(name)]) {
                    r[uncap(name)].push(n.value);
                }
                else {
                    r[uncap(name)] = [n.value];
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

const parseServiceIdentification = node => {
    const {children} = node;
    if (Array.isArray(children)) {
        return children.reduce((a, e) => {
            switch(e.name) {
                case 'ows:Title':
                    a.title = e.value;
                    break;
                default:
                    a[uncap(e.name)] = e.value;
                    break;
            }
            return a;
        }, {});
    }
    else {
        return null;
    }
};

const toFeatures = ({children}) => {
    return children.reduce((a, n) => {
        const {localName} = n;
        switch(localName) {
            case 'FeatureTypeList':
                n.children
                .filter(x => x.localName === 'FeatureType')
                .map(toFeature)
                .forEach(x => a.features = a.features ? a.features.concat(x) : [x]);
                break;
            case 'ServiceIdentification':
                a = {...a, ...parseServiceIdentification(n)};
                break;
            default:
                break;
        }
        return a;
    }, []);
};

export {toLayers, toFeatures};