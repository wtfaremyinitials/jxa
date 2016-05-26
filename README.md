jxa
===

![](https://img.shields.io/npm/dm/jxa.svg)
![](https://img.shields.io/npm/v/jxa.svg)
![](https://img.shields.io/npm/l/jxa.svg)

> Access OS X JavaScript for Automation APIs directly in node

Similar to the [osa](https://www.npmjs.com/package/osa) module, but with a slightly easier API. If you're building a library, the osa module is better suited as it's calls are not synchronous.

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
