#!/usr/bin/env node
var repl = require('repl');
var ctx = repl.start('> ').context;
ctx.Application = require('./').Application;
