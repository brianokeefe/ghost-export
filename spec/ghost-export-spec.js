var exporter = require('../lib/ghost-export'),
    fs = require('fs'),
    path = require('path');

describe('export', function() {

  describe('arguments', function() {
    it('should require a source', function() {
      function testFunction() {
        exporter.export({ destination: 'output' });
      }
      expect(testFunction).toThrow();
    });

    it('should require a destination', function() {
      function testFunction() {
        exporter.export({ source: 'fixtures/ghost' });
      }
      expect(testFunction).toThrow();
    });
  });

  describe('with standard arguments', function() {
    var filesWritten = 0;

    runs(function() {
      if (!fs.existsSync('output')) {
        fs.mkdirSync('output');
      }

      exporter.export({
        source: 'fixtures/ghost',
        destination: 'output'
      }, function(err, count) {
        filesWritten = count;
      });
    });

    waitsFor(function() {
      return (filesWritten > 0);
    });

    it('writes markdown files', function() {
      expect( fs.readdirSync('output') ).toEqual(['a-test-post.md', 'welcome-to-ghost.md']);
    });

    it('uses content from the specified Ghost app', function() {
      var actual = fs.readFileSync('output/a-test-post.md', 'utf8'),
          expected = fs.readFileSync('fixtures/expected/default/a-test-post.md', 'utf8');

      expect(actual).toEqual(expected);
    });
  });

  // teardown
  runs(function() {
    if (fs.existsSync('output')) {
      fs.readdirSync('output').forEach(function(file) {
        fs.unlink( path.join('output', file) );
      });
      fs.rmdirSync('output');
    }
  });

});
