
function simplify(uri, namespaces) {
    for (var k in namespaces) { 
        if (uri.indexOf(namespaces[k]) == 0) { 
            return uri.replace(namespaces[k], k + "_") 
        }  
    } 
    return uri 
}

function nsIfyRdf(r, namespaces) { 
    var out = {}; 
    for (var k in r) { 
        var kk = simplify(k, namespaces); 
        out[kk] = nsIfyPred(r[k], namespaces) 
    } 
    return out
}

function nsIfyPred(r, namespaces) { 
    var out = {}; 
    for (var k in r) { 
        var kk = simplify(k, namespaces); 
        out[kk] = nsIfyProps(r[k], namespaces) 
    } 
    return out
}

function nsIfyProps(arr, namespaces) { 
    var out = []; 
    for (var i in arr) { 
        var item = arr[i]; 
        out.push(nsIfyItem(item, namespaces))        
    } 
    return out 
}

function nsIfyItem(item, namespaces) {
    if (item.type == 'uri') { 
        return { type: 'uri', value: simplify(item.value, namespaces) }
    } else { 
        return item
    }
} 

exports.translateNamespaces = nsIfyRdf;