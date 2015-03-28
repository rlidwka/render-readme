//
// This is a markdown-it plugin for rendering headers with anchors in there
//
// Based off a `markdown-it` core code and `remarkable-regexp` plugin.
// 

/**
 * Module dependencies.
 */

var util     = require('util')
var heading  = require('./vendor/heading')
var lheading = require('./vendor/lheading')

/**
 * Expose `Plugin`
 */

module.exports = Plugin

/**
 * Constructor function
 */

function Plugin(slugfn) {
  // return value should be a callable function
  // with strictly defined options passed by markdown-it
  var self = function(md, options) {
    self.options = options
    self.init(md)
  }

  // initialize plugin object
  self.__proto__ = Plugin.prototype

  self.id     = 'render-readme-headers'
  self.slugfn = slugfn

  return self
}

util.inherits(Plugin, Function)

// function that registers plugin with markdown-it
Plugin.prototype.init = function(md) {
  md.block.ruler.before('hr', this.id, this.parse.bind(this))
  md.block.ruler.disable('heading')
  md.block.ruler.disable('lheading')

  md.renderer.rules.heading_open  = this.render_open.bind(this)
  md.renderer.rules.heading_close = this.render_close.bind(this)

  this.escape = md.utils.escapeHtml
}

Plugin.prototype.parse = function() {
  return heading.apply(null, arguments) || lheading.apply(null, arguments)
}

Plugin.prototype.render_open = function(tokens, idx, options, env) {
  var slug = this.escape(this.slugfn(tokens[idx].info))
  return '<' + tokens[idx].tag + '><a name="' + slug + '"></a>'
}

Plugin.prototype.render_close = function(tokens, idx, options, env) {
  return '</' + tokens[idx].tag + '>\n'
}

