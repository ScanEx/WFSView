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
        return children.reduce((a,e) => {
            if (e.localName === 'LegendURL' && e.attributes) {                
                const {width, height} = e.attributes;
                if (width) {
                    a.width = parseInt(width, 10);
                }
                if (height) {
                    a.height = parseInt(height, 10);
                }
            }
            return a;
        }, {});
    }
    else {
        return null;
    }
};

const toLayer = node => {
    let r = {};
    const {children} = node;
    if(Array.isArray(children)) {
        return children.reduce((a,e) => {
            const {localName, name} = e;
            switch(localName) {            
                case 'Layer':
                    if (a.children) {
                        a.children.push(toLayer(e));
                    }
                    else {
                        a.children = [toLayer(e)];
                    }
                    break;
                case 'Style':
                    a = {...a, ...parseStyle(e)};
                    break;
                case 'CRS':
                    if (a.crs) {
                        a.crs.push(e.value);
                    }
                    else {
                        a.crs = [e.value];
                    }
                    break;
                case 'EX_GeographicBoundingBox':
                    a.exGeographicBoundingBox = parseExGeographicBoundingBox(e);
                    break;
                case 'BoundingBox':
                    if (a[uncap(name)]) {
                        a[uncap(name)].push(e.attributes);
                    }
                    else {
                        a[uncap(name)] = [e.attributes];
                    }               
                    break;
                default:
                    a[uncap(name)] = e.value;
                    break;
            }
            return a;
        }, {});
    }
    else {
        return null;
    }    
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
    const {children} = node;
    if (Array.isArray(children)) {
        return children.reduce((a,e) => {
            const {localName, name} = e;
            switch(localName) {
                case 'Title':
                    a.title = e.value;
                    a[uncap(name)] = e.value;
                    break;
                case 'Name':            
                case 'Abstract':
                case 'DefaultSRS':
                    a[uncap(name)] = e.value;
                    break;
                case 'OtherSRS':
                    if (a[uncap(name)]) {
                        a[uncap(name)].push(e.value);
                    }
                    else {
                        a[uncap(name)] = [e.value];
                    }
                    break;            
                case 'WGS84BoundingBox':                
                    a.wgs84BoundingBox = parseNode(e);
                    break;
                default:
                    break;
            }
            return a;
        }, {});
    }
    else {
        return null;
    }
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