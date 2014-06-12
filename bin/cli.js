#!/usr/bin/env node

var GhostExport = require('..'),
    package = require('../package.json'),
    program = require('commander')
      .version(package.version)
      .usage('[source] [destination] [options]');

program.on('--help', function(){
  console.log('  Description:');
  console.log('');
  console.log('    ' + package.description);
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ ghost-export /path/to/ghost/app /path/to/output');
  console.log('');
});

program.parse(process.argv);

var args = {
  source: program.args.shift(),
  destination: program.args.shift()
};

GhostExport(args, function(err, count) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
});
