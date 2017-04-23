// TODO: Different behavior for array specifiers over object specifiers?

var osa = require('osa2')
var wait = require('blocking-await')

function isInspect(obj) {
    var symb = require('util').inspect.custom
    return obj == (symb ? symb : 'inspect')
}

function parent(path) {
    // TODO: May need to handle func calls and . accessor
    return path.replace(/\["\w+"\]$/, '')
}

// Access the contents of a reference
function dereference(path, args) {
    return wait((osa(function(path, that, args) {
        var target = eval(path)

        if (args.length != 0 || path.endsWith('toString')) {
            obj = target.apply(eval(that), args)
        } else {
            obj = target()
        }

        if (obj == null)
            return null

        if (/\\[object \\w+Specifier\\]/.test(obj.toString()))
            obj = obj.toString()

        return obj
    }))(path, parent(path), args))
}

// Used when the node REPL calls .inspect() to print a reference
function createInspector(path)  {
    return () => `[object JXAReference => ${dereference(path+'.toString',[])}]`
}

// Create a pointer to an object in the AppleScript API
function createReference(path) {
    // Object being proxied is the dereference function
    return new Proxy((...args) => dereference(path, args), {
        // Get trap catches props being accessed, returns a new reference
        get: (_, prop) => {
            if(isInspect(prop)) // Handle node REPL's .inspect() calls
                return createInspector(path)
            return createReference(`${path}["${prop}"]`)
        }
    });
};

// Entry point for module. Creates a reference to an Application()
function Application(handle) {
    return createReference(`Application("${handle}")`)
}

module.exports.Application = Application
