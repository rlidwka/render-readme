
var render   = require('./render')
var sanitize = require('./sanitize')

module.exports = function(html) {
  return sanitize(render(html))
}

