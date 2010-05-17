var API = {};
(function()
{
    var extract, getPropertyRecursively, isOwnProperty, iterate, parsePath;
    var paramRegExp = new RegExp("(\\w[\\w\\d]+)\\s*(!=|[=><])\\s*([\\w\\d]+)");
    getPropertyRecursively = (function()
    {
        var propRegExp = new RegExp(".+\\[.+\\]");
        return function(props, obj)
        {
            if(props.length === 1)
            {
                props = props[0];
                if(propRegExp.test(props))
                {
                    return parsePath(obj, props);
                }
                else
                {
                    return obj[props];
                }
            }

            var prop = props.shift();
            if(propRegExp.test(prop))
            {
                var result = parsePath(obj, prop);
                if(typeof result != 'undefined')
                {
                    return getPropertyRecursively(props, result);
                }
            }
            else
            {
                if(typeof obj[prop] != 'undefined')
                {
                    return getPropertyRecursively(props, obj[prop]);
                }
            }
        };
    })();

    isOwnProperty = function(o, p)
    {
        var pr = o.constructor.prototype[p];
        return typeof pr == 'undefined' || pr !== o[p];
    };

    iterate = function(obj, fn)
    {
        if(typeof obj.length == 'number')
        {
            for(var i = 0, len = obj.length; i < len; ++i)
            {
                fn(obj, i);
            }
        }
        else
        {
            for(var i in obj)
            {
                if(isOwnProperty(obj, i))
                {
                    fn(obj, i);
                }
            }
        }
    };

    parsePath = function(obj, path)
    {
        var params = path.split('['),
            prop = params[0],
            cond = params[1].slice(0, -1),
            subj = obj[prop];

        if(typeof subj != 'undefined')
        {
            params = paramRegExp.exec(cond);
            if(params)
            {
                switch(params[2])
                {
                    case '=':
                        if(subj[params[1]] == params[3])
                        {
                            return subj;
                        }
                        break;
                    case '!=':
                        if(subj[params[1]] != params[3])
                        {
                            return subj;
                        }
                        break;
                    case '>':
                        if(subj[params[1]] > params[3])
                        {
                            return subj;
                        }
                        break;
                    case '<':
                        if(subj[params[1]] < params[3])
                        {
                            return subj;
                        }
                        break;
                }
            }
        }
    };

    if(iterate && getPropertyRecursively)
    {
        API.extract = function(path, iterable)
        {
            var filtered = [],
                props;

            if(path == '/'){
                return iterable;
            }
            else if(path.indexOf('/') === 0){
                path = path.slice(1);
            }

            props = path.split('/');
            iterate(iterable, function(it, prop){
                    var tmpVal = getPropertyRecursively(props.slice(), it[prop]);
                    if(typeof tmpVal != 'undefined'){
                        filtered.push(tmpVal);
                    }
                }
            );
            return filtered;
        };
    }
})();

