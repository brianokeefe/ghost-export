var dateFormat = require('dateformat'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    sqlite3 = require('sqlite3');

module.exports = function(args, callback) {
  callback = callback || function() {};
  if (args.published === undefined) { args.published = true; }

  if (!args.source) {
    callback(new Error('No source Ghost app specified'), 0);
  } else if (!fs.existsSync(args.source)) {
    callback(new Error('Source app does not exist'), 0);
  } else if (!args.destination) {
    callback(new Error('No destination directory specified'), 0);
  } else {
    if (!fs.existsSync(args.destination)) { fs.mkdirSync(args.destination); }

    if (args.published && !args.drafts) {
      var where = ' WHERE status IS NOT "draft"';
    } else if (!args.published && args.drafts) {
      var where = ' WHERE status IS "draft"';
    } else { var where = ''; }

    var db = new sqlite3.Database(path.join(args.source, 'content/data/ghost.db'), function(err, db) {
      if (err) callback(err, 0);
    });

    db.serialize(function() {
      db.each('SELECT * FROM posts' + where, function(err, row) {
        if (row.status === 'draft') {
          var prefix = 'draft-'
        } else {
          var prefix = dateFormat(new Date(row.published_at), 'yyyy-mm-dd-');
        }
        var name = prefix + row.slug + '.md';
        var outFile = path.join(args.destination, name);

        try {
          var toWrite = [];
          // Post title
          if (args.title) {
            toWrite.push('# ' + row.title);
            toWrite.push('');
          }
          // Post content
          toWrite.push(row.markdown);
          fs.writeFileSync(outFile, toWrite.join(os.EOL));
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
