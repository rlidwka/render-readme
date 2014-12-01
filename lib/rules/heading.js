//
// This is a remarkable plugin for rendering headers with anchors in there
//
// Based off a `remarkable` core code and `remarkable-regexp` plugin.
// 

/**
 * Module dependencies.
 */

var util     = require('util')
var heading  = require('./vendor/heading')
var lheading = require('./vendor/lheading')
var escape   = require('./vendor/utils').escapeHtml

/**
 * Expose `Plugin`
 */

module.exports = Plugin

/**
 * Constructor function
 */

function Plugin(slugfn) {
  // return value should be a callable function
  // with strictly defined options passed by remarkable
  var self = function(remarkable, options) {
    self.options = options
    self.init(remarkable)
  }

  // initialize plugin object
  self.__proto__ = Plugin.prototype

  self.id     = 'render-readme-headers'
  self.slugfn = slugfn

  return self
}

util.inherits(Plugin, Function)

// function that registers plugin with remarkable
Plugin.prototype.init = function(remarkable) {
  remarkable.block.ruler.before('hr', this.id, this.parse.bind(this))
  remarkable.block.ruler.disable('heading')
  remarkable.block.ruler.disable('lheading')

  remarkable.renderer.rules.heading_open  = this.render_open.bind(this)
  remarkable.renderer.rules.heading_close = this.render_close.bind(this)
}

Plugin.prototype.parse = function(state, silent) {
  return heading(state, silent) || lheading(state, silent)
}

Plugin.prototype.render_open = function(tokens, idx, options, env) {
  var l    = Number(tokens[idx].hLevel)
  var slug = escape(this.slugfn(tokens[idx].content))
  return '<h'+l+'><a name="'+slug+'"></a>'
}

Plugin.prototype.render_close = function(tokens, idx, options, env) {
  var l = Number(tokens[idx].hLevel)
  return '</h'+l+'>\n'
}

