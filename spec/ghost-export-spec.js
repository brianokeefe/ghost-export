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

  describe('general cases, without draft or published', function() {
    var filesWritten = 0;
    var dir = 'output-published';

    it('the output directory should not exist before running', function() {
      expect( fs.existsSync(dir) ).toBeFalsy();
    })

    runs(function() {
      GhostExport({
        source: 'fixtures/ghost',
        destination: dir
      }, function(err, count) { filesWritten = count; });
    });

    waitsFor(function() {
      return (filesWritten > 0);
    });

    it('the output directory should exist after running', function() {
      expect( fs.existsSync(dir) ).toBeTruthy();
    });

    it('should write markdown files', function() {
      expect( fs.readdirSync(dir).sort() ).toEqual(['2014-03-08-a-test-post.md', '2014-06-08-welcome-to-ghost.md']);
    });

    it('should use content from the specified Ghost app', function() {
      var actual = fs.readFileSync(dir + '/2014-03-08-a-test-post.md', 'utf8'),
          expected = fs.readFileSync('fixtures/expected/default/2014-03-08-a-test-post.md', 'utf8');

      expect(actual).toEqual(expected);
    });

    runs(function() { clean(dir); });
  });

  describe('when draft mode is true', function() {
    var filesWritten = 0;
    var dir = 'output-drafts';

    runs(function() {
      GhostExport({
        source: 'fixtures/ghost',
        destination: dir,
        drafts: true,
        published: false
      }, function(err, count) { filesWritten = count; });
    });

    waitsFor(function() {
      return (filesWritten > 0);
    });

    it('should only export drafts', function() {
      expect( fs.readdirSync(dir) ).toEqual(['draft-a-draft.md']);
    });

    runs(function() { clean(dir); });
  });

  describe('when both draft and published is true', function() {
    var filesWritten = 0;
    var dir = 'output-all';

    runs(function() {
      GhostExport({
        source: 'fixtures/ghost',
        destination: dir,
        drafts: true,
        published: true
      }, function(err, count) { filesWritten = count; });
    });

    waitsFor(function() {
      return (filesWritten > 0);
    });

    it('should export all posts', function() {
      expect( fs.readdirSync(dir).sort() ).toEqual(['2014-03-08-a-test-post.md', '2014-06-08-welcome-to-ghost.md', 'draft-a-draft.md']);
    });

    runs(function() { clean(dir); });
  });
});

function clean(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(function(file) {
      fs.unlinkSync( path.join(dir, file) );
    });
    fs.rmdirSync(dir);
  }
}
