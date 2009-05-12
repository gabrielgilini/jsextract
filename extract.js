function extract(path, iterable){
    if((typeof iterable.length != 'number') || (path.indexOf('/') !== 0)){
        return false;
    }
    if(path == '/'){
        return iterable;
    }
    var filtered = [];
    var props = path.slice(1).split('/');
    for(var i = 0, len = iterable.length, tmpVal; i < len; ++i){
        tmpVal = getPropertyRecursively(props.slice(), iterable[i]);
        if(tmpVal){
            filtered.push(tmpVal);
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
