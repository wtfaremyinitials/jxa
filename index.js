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
    return new Proxy((recv, _, args) => dereference(path, args), {
        get: (_, prop) => createReference(`${path}.${prop}`)
    });
};

var Application = function(handle) {
    return createReference('Application("' + handle + '")');
};

module.exports.Application = Application;
