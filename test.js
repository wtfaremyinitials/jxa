var exec = require('child_process').execSync;

function dereference(ptr, prop) {
    var js  = `
        var obj = ${ptr}.${prop};

        if(obj === undefined) {
            obj = undefined;
        } else if(obj.toString() == "function () {\\n    [native code]\\n}") {
            obj = "jxafn";
        } else {
            obj = obj();
            obj = JSON.stringify(obj)?JSON.stringify(obj):obj;
        }

        obj
    `
    var cmd = `osascript -l JavaScript -e '${js}'`;
    var res = exec(cmd).toString().trim();

    if(res.substr(0, 11) == 'Application') {
        return createProxy(res);
    } else if(res == 'jxafn') {
        return function() {
            return dereference(ptr, prop+'()');
        }
    } else {
        try {
            return JSON.parse(res);
        } catch(e) {
            return undefined;
        }
    }
}


var createProxy = function(path) {

    return Proxy.create({

        has: () => true,
        hasOwn: () => true,
        enumerate: () => console.error('jxa enumerate trap unsupported'),
        keys: () => console.error('jxa keys trap unsupported'),
        set: () =>  console.error('jxa set trap unsupported'),
        get: (target, prop) => dereference(path, prop)

    })

}

var Application = handle => createProxy('Application("' + handle + '")');

var iTunes = Application('iTunes');

iTunes.play();
