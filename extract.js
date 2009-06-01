function extract(path, iterable){
    var filtered = [],
        props;

    if(path == '/'){
        return iterable;
    }
    else if(path.indexOf('/') === 0){
        path = path.slice(1);
    }

    props = path.split('/');
    //for(var i = 0, len = iterable.length, tmpVal; i < len; ++i){
    for(var prop in iterable){
        if(isOwnProperty(iterable, prop)){
            tmpVal = getPropertyRecursively(props.slice(), iterable[prop]);
            if(tmpVal){
                filtered.push(tmpVal);
            }
        }
    }
    return filtered;
}

function getPropertyRecursively(props, obj){
    if(props.length === 1){
        return obj[props];
    }

    var prop = props.shift();
    if(obj[prop]){
        return getPropertyRecursively(props, obj[prop]);
    }
}

function isOwnProperty(o, p) {
    var prop = o.constructor.prototype[p];
    return typeof prop == 'undefined' || prop !== o[p];
}

//{ 'uno': { 'foo': { 'bar': 'hue' } }, 'dos': { 'foo': { 'bar': 'hua' } } }