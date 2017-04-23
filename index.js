var osa = require('osa2')
var wait = require('blocking-await')

function isInspect(obj) {
    var symb = require('util').inspect.custom
    return obj == (symb ? symb : 'inspect')
}

// Access the contents of a reference
function dereference(path, args) {
    return wait((osa(function(path, args) {
        var toStringMode = path[path.length - 1] == 'toString' // Stupid hack

        var lastTarget = null
        var target = eval(path.shift())
        while (path.length != 0) {
            lastTarget = target
            target = target[path.shift()]
        }

        if (args.length != 0 || toStringMode) {
            obj = target.apply(lastTarget, args)
        } else {
            obj = target()
        }

        if (obj == null)
            return null

        // TODO: Different behavior for array specifiers over object specifiers?
        if (/\\[object \\w+Specifier\\]/.test(obj.toString()))
            obj = obj.toString()

        return obj
    }))(path, args))
}

// Used when the node REPL calls .inspect() to print a reference
function createInspector(path)  {
    return () => `[object JXAReference => ${dereference(path.concat(['toString']),[])}]`
}

// Create a pointer to an object in the AppleScript API
function createReference(path) {
    // Object being proxied is the dereference function
    return new Proxy((...args) => dereference(path, args), {
        // Get trap catches props being accessed, returns a new reference
        get: (_, prop) => {
            if(isInspect(prop)) // Handle node REPL's .inspect() calls
                return createInspector(path)
            return createReference(path.concat([prop]))
        }
    });
};

// Entry point for module. Creates a reference to an Application()
function Application(handle) {
    return createReference([`Application("${handle}")`])
}

module.exports.Application = Application
