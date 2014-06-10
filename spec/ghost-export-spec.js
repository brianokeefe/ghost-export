var exporter = require('../lib/ghost-export'),
    fs = require('fs');

describe('export', function() {

  describe('with invalid arguments', function() {
    it('requires a source', function() {
      function testFunction() {
        exporter.export({ destination: 'output' });
      }

      expect(testFunction).toThrow();
    });

    it('requires a destination', function() {
      function testFunction() {
        exporter.export({ source: 'fixtures/ghost' });
      }
      expect(testFunction).toThrow();
    });
  });

  describe('with standard arguments', function() {
    fs.mkdirSync('output');

    exporter.export({
      source: 'fixtures/ghost',
      destination: 'output'
    });

    var output = fs.readdirSync('output');

    it('writes markdown files', function() {
      expect(output).toEqual(['a-test-post.md', 'welcome-to-ghost.md']);
    });

    it('uses content from the specified Ghost app', function() {
      var actual = fs.readFileSync('output/welcome-to-ghost.md', 'utf8'),
          expected = fs.readFileSync('fixtures/expected/default/welcome-to-ghost.md', 'utf8');

      expect(actual).toEqual(expected);
    });

  });

  if (fs.existsSync('output')) {
    fs.rmdirSync('output');
  }

});
