# ghost-export

Exports a Ghost blog into a collection of Markdown files.

## Installation

    $ npm install -g ghost-export

## Usage

    $ ghost-export /path/to/ghost/app /path/to/output

Alternatively, you can `require('ghost-export')` and use it in your own scripts. Example:

    var GhostExport = require('ghost-export');

    GhostExport({
      source: '/path/to/ghost/app',
      destination: '/path/to/output'
    });

## Testing

    $ npm test

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
