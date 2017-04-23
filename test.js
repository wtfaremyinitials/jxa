var test = require('ava')
var inspect = require('util').inspect.custom
var { Application } = require('.')

test('system access', async t => {
    var val = Application('System Events').currentUser.name()
    t.is(val, process.env.USER)
})

test('.inspect() support', async t => {
    var val = Application('System Events').currentUser[inspect]()
    t.is(val, '[object JXAReference => [object ObjectSpecifier]]')
})
