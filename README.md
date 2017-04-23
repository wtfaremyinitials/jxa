jxa
===

![](https://img.shields.io/npm/dm/jxa.svg)
![](https://img.shields.io/npm/v/jxa.svg)
![](https://img.shields.io/npm/l/jxa.svg)

> Access OS X JavaScript for Automation APIs directly in node

Similar to the [osa2](https://www.npmjs.com/package/osa2) module, but with synchronous calls and an API with a bit more 'magic'.
If you're building a library, use `osa2`. This module is best suited for small scripts.

## Installation

**Module:** `npm install --save jxa`

**REPL:** `npm install -g jxa`

## Usage

Interact with apps in the same way you would with Apple's official JavaScript for automation runtime, as described [here](https://developer.apple.com/library/mac/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html#//apple_ref/doc/uid/TP40014508-CH109-SW1). The only difference is that you must get a handle to the `Application` object by requiring this module.

```js
var Application = require('jxa').Application;

var iTunes = Application('iTunes');

var name   = iTunes.currentTrack.name();
var artist = iTunes.currentTrack.artist();

console.log(name + ' by ' + artist);
// Pay No Mind (feat. Passion Pit) by Madeon

iTunes.pause();
// Music pauses

iTunes.play();
// Music plays
```

If you install JXA globally (`npm install -g jxa`) a REPL is provided that exposes Application() in the global scope.

```
will@laptop ~ $ jxa-node
> Application('iTunes')
[object JXAReference => [object Application]]
> Application('iTunes').play()
undefined
> Application('iTunes').currentTrack
[object JXAReference => [object ObjectSpecifier]]
> Application('iTunes').currentTrack.name()
'No Problem (feat. Lil Wayne & 2 Chainz)'
>
```
