
var Application = require('../').Application;
var iterm = Application('iTerm');

iterm.includeStandardAdditions = true;

var value = iterm.createWindowWithDefaultProfile({command: "/bin/bash"});
