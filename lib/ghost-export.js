var fs = require('fs'),
    path = require('path'),
    sqlite3 = require('sqlite3');

module.exports = {
  export: function(args, callback) {
    if (!args.source) throw('No source Ghost app specified');
    if (!args.destination) throw('No destination directory specified');

    var db = new sqlite3.Database( path.join(args.source, 'content/data/ghost.db') );

    db.serialize(function() {
      db.each('SELECT * FROM posts WHERE status IS NOT "draft"', function(err, row) {
        var outFile = path.join(args.destination, row.slug + '.md');
        fs.writeFileSync(outFile, row.markdown);
      }, function(err, count) {
        // TODO: more useful error handling here
        callback(err, count);
      });
    });

    db.close();
  }
}
