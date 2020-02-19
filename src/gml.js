function parseLinearRing (linearRing) {
    const {children} = linearRing;
    if (Array.isArray(children)) {
        return children.reduce((a, e) => {
            switch(e.name) {
                case 'gml:coordinates':
                    a = a.concat (parseCoordinates(e));                
                    break;
                default:
                    break;
            }
            return a;
        }, []);
    }
    else {
        return null;
    }    
}

function parseBoundary (outerBoundary) {
    const {children} = outerBoundary;
    if (Array.isArray(children)) {
        return children.reduce((a, e) => {
            switch(e.name) {
                case 'gml:LinearRing':
                    a = a.concat (parseLinearRing(e));
                    break;
                default:
                    break;
            }
            return a;
        }, []);
    }
    else {
        return null;
    }
}

function parsePolygon (polygon) {
    const {children} = polygon;
    if (Array.isArray(children)) {
        const coordinates = children.reduce((a, e) => {
            switch(e.name) {
                case 'gml:outerBoundaryIs':
                    a.push (parseBoundary(e));
                    break;
                case 'gml:innerBoundaryIs':
                    a.push (parseBoundary(e));
                    break;
                default:
                    break;
            }
            return a;
        }, []);
        return {type: 'Polygon', coordinates};
    }
    else {
        return null;
    }    
}

function parsePolygonMember (polygon) {
    const {children} = polygon;
    if (Array.isArray(children) && children.length === 1) {
        const [e] = children;
        switch(e.name) {
            case 'gml:Polygon':                
                return parsePolygon(e).coordinates;                            
            default:
                return null;
        }
    }
    else {
        return null;
    }
}

function parseMultiPolygon (multiPolygon) {
    const {children} = multiPolygon;
    if(Array.isArray(children)) {
        const coordinates = children.reduce((a, e) => {
            switch(e.name) {
                case 'gml:polygonMember':
                    a.push (parsePolygonMember(e));
                    break;
                default:
                    break;
            }
            return a;
        }, []);
        return {type: 'MultiPolygon', coordinates};
    }
    else {
        return null;
    }    
}

function parseGeometry (geometry) {
    const {children} = geometry;
    if (Array.isArray(children) && children.length === 1) {
        const [e] = children;
        switch(e.name) {
            case 'gml:Polygon':
                return parsePolygon(e);                
            case 'gml:MultiPolygon':
                return parseMultiPolygon(e);                
            default:
                return null;
        }
    }
    else {
        return null;
    } 
}

const parseCoordinates = coordinates =>
    coordinates.value
        .split(/\s+/g)
        .filter(e => e)
        .map(e => e.split(',').map(v => parseFloat(v)));

function parseBox (box) {
    const {children} = box;
    if (Array.isArray(children)) {
        const [e] = children;
        switch(e.name) {
            case 'gml:coordinates':
                return parseCoordinates(e).reduce((b, p) => b.concat(p), []);                
            default:
                return null;
        }
    }
    else {
        return null;
    }
}

function parseBoundedBy(boundedBy) {
    const {children} = boundedBy;
    if (Array.isArray(children) && children.length === 1) {
        const [e] = children;
        switch(e.name) {
            case 'gml:Box':
                return parseBox(e);                
            default:
                return null;
        }
    }
    else {
        return null;
    }    
}

function parseFeature(feature) {        
    const {name, children} = feature;
    if (Array.isArray(children)) {
        return children.reduce((a, e) => {
            switch(e.name) {
                case 'gml:boundedBy':
                    a.bbox = parseBoundedBy(e);
                    break;
                case 'ms:msGeometry':
                    a.geometry = parseGeometry(e);
                    break;
                case 'ms:id':
                case 'ms:layer':
                case 'ms:border_color':
                case 'ms:body_fore_color':
                case 'ms:body_back_color':
                case 'ms:symbol':
                case 'ms:angle':
                case 'ms:size':
                case 'ms:width':
                case 'ms:border_width':
                    a.properties[e.name] = e.value;
                    break;
                default:
                    break;
            }
            return a;
        },  {type: 'Feature', properties: {name}});
    }
    else {
        return null;
    }    
}

function parseFeatureMember (featureMember) {
    const {children} = featureMember;
    if (Array.isArray(children) && children.length === 1) {
        const [e] = children;
        return parseFeature(e);
    }
    else {
        return null;
    }
}

function parseGmx (gmx) {
    const {children} = gmx;
    if (Array.isArray(children)) {
        return children.reduce((a,e) => {
            switch (e.name){
                case 'gmx:NAME':
                    a.properties.name = e.value;
                    break;
                case 'gmx:wkb_geometry':
                    a.geometry = parseGeometry(e);
                    break;                
                default:
                    a.properties[e.name] = e.value;
                    break;
            }
            return a;
        }, {properties: {}});
    }
    else {
        return null;
    }
}

function parseWfsMember (wfsMember) {
    const {children, localName} = wfsMember;
    if (Array.isArray(children)) {
        return children.reduce((a,e) => {                     
            return {...a, ...parseGmx(e)};
        }, {type: 'Feature', properties: {name: localName}});
    }
    else {
        return null;
    }
}

function parseFeatures (featureCollection) {
    const {children} = featureCollection;
    if (Array.isArray(children)) {
        return children.reduce((a, e) => {
            if (e.name === 'gml:featureMember') {
                const f = parseFeatureMember(e);
                if (f) {                    
                    a.features.push(f);
                }                
            }
            else if (e.name === 'gml:boundedBy') {
                a.bbox = parseBoundedBy(e);
            }
            else if (e.name === 'wfs:member') {
                a.features.push(parseWfsMember(e));
            }            
            return a;
        }, {type: 'FeatureCollection', features: []});
    }
    else {
        return null;
    }
}

export default parseFeatures;