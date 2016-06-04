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

// Access the contents of a reference
function dereference(path, args) {
    try {
        // Run the osascript binary in inline script mode, stringifying the reference
        args = args ? JSON.stringify(args) : '';
        args = args.substr(1, args.length - 2);

        var cmd = `osascript -l JavaScript -e 'JSON.stringify(${path}(${args}));'`
        var res = exec(cmd, { stdio: '' }).toString().trim();
        return JSON.parse(res);
    } catch(e) {
      //console.log(e);
    }
};

// Used when the node REPL calls .inspect() to print a reference
function createInspector(path)  {
  return () => `[object JXAReference => ${dereference(path+'.toString')}]`;
}

// Create a pointer to an object in the AppleScript API
function createReference(path) {
    // Object being proxied is the dereference function
    return new Proxy(
      (recv, _, args) => dereference(path, args),
      {
        apply: (target, thisArg, argumentsList) => dereference(path, argumentsList),

        get(target, propertyName, receiver) {
           // Handle node REPL's .inspect() calls
          if (propertyName == 'inspect') { return createInspector(path); }
          return createReference(`${path}.${propertyName.toString()}`)
        },

        set(target, property, value, receiver) {
          // console.log('setting: ', property);
          // TODO: Implement `set` proxy handler
        }
      }
    );
};

// Entry point for module. Creates a reference to an Application()
var Application = function(handle) {
  return createReference('Application("' + handle + '")');
};

module.exports.Application = Application;
