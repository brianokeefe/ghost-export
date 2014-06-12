var GhostExport = require('../lib/ghost-export'),
    fs = require('fs'),
    path = require('path');

describe('GhostExport', function() {

  describe('arguments', function() {

    beforeEach(function() {
      err = null;
    });

    it('should require a source', function() {
      runs(function() {
        GhostExport({ destination: 'output' }, function(e) { err = e; });
      });

      waitsFor(function() { return err });

      runs(function() {
        expect(err.message).toMatch('No source Ghost app specified');
      });
    });

    it('should require a destination', function() {
      runs(function() {
        GhostExport({ source: 'fixtures/ghost' }, function(e) { err = e; });
      });

      waitsFor(function() { return err });

      runs(function() {
        expect(err.message).toMatch('No destination directory specified');
      });
    });

    it('should fail if the source directory does not exist', function() {
      runs(function() {
        GhostExport({
          source: 'fixtures/fake',
          destination: 'output'
        }, function(e) { err = e; });
      });

      waitsFor(function() { return err });

      runs(function() {
        expect(err.message).toMatch('Source app does not exist');
      });
    });
  });

  describe('with standard arguments', function() {

    it('the output directory should not exist before running', function() {
      expect( fs.existsSync('output') ).toBeFalsy();
    })

    var filesWritten = 0;

    runs(function() {
      GhostExport({
        source: 'fixtures/ghost',
        destination: 'output'
      }, function(err, count) { filesWritten = count; });
    });

    waitsFor(function() {
      return (filesWritten > 0);
    });

    it('the output directory should exist after running', function() {
      expect( fs.existsSync('output') ).toBeTruthy();
    })

    it('should write markdown files', function() {
      expect( fs.readdirSync('output') ).toEqual(['a-test-post.md', 'welcome-to-ghost.md']);
    });

    it('should use content from the specified Ghost app', function() {
      var actual = fs.readFileSync('output/a-test-post.md', 'utf8'),
          expected = fs.readFileSync('fixtures/expected/default/a-test-post.md', 'utf8');

      expect(actual).toEqual(expected);
    });
  });

  xdescribe('when draft mode is specified', function() {
    it('exports drafts only');
  });

  xdescribe('when all mode is specified', function() {
    it('exports both drafts and published articles');
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
