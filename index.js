if(!global.Proxy) {
    console.error('[jxa] Proxy support is required!');
    console.error('Please either: ');
    console.error(' - Relaunch node with the --harmony-proxies');
    console.error(' - Upgrade to node >= 6.2.0');
    process.exit(1);
}

var exec = require('child_process').execSync;

var r = function(val) {
    return val;
};

function dereference(path, args) {
    try {
        var cmd = "osascript -l JavaScript -e 'JSON.stringify(" + path + "());'"
        var res = exec(cmd, { stdio: '' }).toString().trim();
        return JSON.parse(res);
    } catch(e) {
        return null;
    }
};

var createReference = function(path) {
    return Proxy.createFunction({
        set: () =>  console.error('jxa set trap unsupported'),
        get: (_, prop) => createReference(`${path}.${prop}`),

        // TODO: Not implemented
        has: r(true),
        hasOwn: r(true),
        enumerate: r(true),
        keys: r(true),
        getPrototypeOf: r(null),
        setPrototypeOf: r(),
        isExtensible: r(false),
        preventExtensions: r(true),
        getOwnPropertyDescriptor: r(undefined),
        defineProperty: r(false)

    }, (recv, _, args) => dereference(path, args));
};

var Application = function(handle) {
    return createReference('Application("' + handle + '")');
};

module.exports.Application = Application;
