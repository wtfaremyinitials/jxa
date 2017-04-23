// Check for Proxy support
if(!global.Proxy) {
    console.error('[jxa] Proxy support is required!');
    console.error('Please either: ');
    console.error(' - Relaunch node with the --harmony-proxies flag');
    console.error(' - Upgrade to node >= 6.2.0');
    process.exit(1);
}

// The AppleScript API is accessed through the `osascript` binary
var exec = require('child_process').execSync;

function isInspect(obj) {
    var symb = require('util').inspect.custom
    return obj == (symb ? symb : 'inspect')
}

function parent(path) {
    // TODO: May need to handle func calls and . accessor
    return path.replace(/\["\w+"\]$/, '');
}

// Access the contents of a reference
function dereference(path, args) {
    try { // Run the osascript binary in inline script mode, stringifying the reference
        var cmd;
 
        // Arguments passed?
        if(args.length == 0) {
            cmd = `${path}()`; // Don't bother with apply
        } else {
            // Stringify the arguments then call the method with `apply`
            args = JSON.stringify(args);
            cmd = `${path}.apply(${parent(path)}, JSON.parse(\`${args}\`))`;
        }

        // Add in code to test if the resulting output should be stringified (object specifiers should not)
        cmd = `obj=${cmd};if(!(/\\[object \\w+Specifier\\]/.test(obj.toString())))obj=JSON.stringify(obj);obj`
        // Wrap it as a command
        cmd = `osascript -l JavaScript -e '${cmd}'`;
        // Run it
        var res = exec(cmd, { stdio: '' }).toString().trim();

        // Create a reference if an object specifier was returned
        if(res.startsWith('Application'))
            return createReference(res);
        // Otherwise parse the result
        return JSON.parse(res);
    } catch(e) {}
};

// Used when the node REPL calls .inspect() to print a reference
function createInspector(path)  {
    return () => `[object JXAReference => ${dereference(path+'.toString',[])}]`;
}

// Create a pointer to an object in the AppleScript API
function createReference(path) {
    // Object being proxied is the dereference function
    return new Proxy((...args) => dereference(path, args), {
        // Get trap catches props being accesses, returns a new reference
        get: (_, prop) => {
            if(isInspect(prop)) // Handle node REPL's .inspect() calls
                return createInspector(path);
            return createReference(`${path}["${prop}"]`)
        }
    });
};

// Entry point for module. Creates a reference to an Application()
var Application = function(handle) {
    return createReference('Application("' + handle + '")');
};

module.exports.Application = Application;
