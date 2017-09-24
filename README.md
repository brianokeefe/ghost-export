# ghost-export
[![NPM version](https://badge.fury.io/js/ghost-export.svg)](http://badge.fury.io/js/ghost-export)
[![Code Climate](https://codeclimate.com/github/brianokeefe/ghost-export/badges/gpa.svg)](https://codeclimate.com/github/brianokeefe/ghost-export)
[![Build Status](https://travis-ci.org/brianokeefe/ghost-export.svg?branch=master)](https://travis-ci.org/brianokeefe/ghost-export)

Exports a Ghost blog into a collection of Markdown files.

## Installation

    $ npm install -g ghost-export

## Usage

    # Export published posts only
    $ ghost-export /path/to/ghost/app /path/to/output

    # Export drafts only
    $ ghost-export --drafts /path/to/ghost/app /path/to/output

    # Export all posts
    $ ghost-export --all /path/to/ghost/app /path/to/output

Alternatively, you can `require('ghost-export')` and use it in your own scripts. Example:

    var GhostExport = require('ghost-export');

    GhostExport({
      source: '/path/to/ghost/app',
      destination: '/path/to/output',
      published: true, // optional, defaults to true
      drafts: true // optional, defaults to false
    }, function(err, count) {
        if (err) { console.error(err); }
        else { console.log('Exported ' + count + ' files.'); }
    });
    
Please note that ghost-export only works with installs of Ghost v1.x.x that are running with sqlite. When you install Ghost via `ghost-cli`, install it like so:

    ghost install --db sqlite3 --dbpath ./content/data/ghost.db

## Testing

    $ npm test

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
