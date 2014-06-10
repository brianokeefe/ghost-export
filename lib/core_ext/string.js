String.prototype.addTrailingSlash = function() {
  return this.match(/\/$/) ? this : this + '/'
}