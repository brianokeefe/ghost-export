#!/usr/bin/env node

var GhostExport = require('..'),
    package = require('../package.json'),
    program = require('commander')
      .version(package.version)
      .usage('[options...] [source] [destination]')
      .option('-d --drafts', 'Export drafts only')
      .option('-a --all', 'Export both published posts and drafts')
      .option('-t --title', 'Export including title at the beginning of the file');

program.on('--help', function(){
  console.log('  Description:');
  console.log('');
  console.log('    ' + package.description);
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    # Export published posts only')
  console.log('    $ ghost-export /path/to/ghost/app /path/to/output');
  console.log('');
  console.log('    # Export drafts only')
  console.log('    $ ghost-export --drafts /path/to/ghost/app /path/to/output');
  console.log('');
  console.log('    # Export all posts')
  console.log('    $ ghost-export --all /path/to/ghost/app /path/to/output');
  console.log('');
});

program.parse(process.argv);

var args = {
  source: program.args.shift(),
  destination: program.args.shift(),
  published: (!program.drafts || program.all) ? true : false,
  drafts: (program.drafts || program.all),
  title: program.title ? true : false
};

GhostExport(args, function(err, count) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
});
