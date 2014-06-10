require('../../lib/core_ext/string');

describe('String.prototype.addTrailingSlash', function() {
  it('should add a trailing slash if none exists', function() {
    expect( '/some/path'.addTrailingSlash() ).toEqual( '/some/path/' );
  });

  it('should be a noop if a trailing slash already exists', function() {
    expect( '/some/path/'.addTrailingSlash() ).toEqual( '/some/path/' );
  });
});