var fs = require('fs'),
    path = require('path'),
    sqlite3 = require('sqlite3');

module.exports = function(args, callback) {
  callback = callback || function() {};

  if (!args.source) { callback(new Error('No source Ghost app specified'), 0); }
  else if (!fs.existsSync(args.source)) { callback(new Error('Source app does not exist'), 0); }
  else if (!args.destination) { callback(new Error('No destination directory specified'), 0); }
  else {
    if (!fs.existsSync(args.destination)) { fs.mkdirSync(args.destination); }

    var db = new sqlite3.Database(path.join(args.source, 'content/data/ghost.db'), function(err, db) {
      if (err) callback(err, 0);
    });

    db.serialize(function() {
      db.each('SELECT * FROM posts WHERE status IS NOT "draft"', function(err, row) {
        var outFile = path.join(args.destination, row.slug + '.md');
        try {
          fs.writeFileSync(outFile, row.markdown);
        } catch(err) {
          callback(err, 0);
        }
      }, function(err, count) {
        callback(err, count);
      });
    });

    db.close();
  }
};
