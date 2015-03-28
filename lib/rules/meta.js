//
// This is a markdown-it plugin for rendering headers with anchors in there
//
// Based off a `markdown-it` core code and `remarkable-meta` plugin.
// 

/**
 * Module dependencies.
 */

var util   = require('util')
var YAML   = require('js-yaml')

/**
 * Expose `Plugin`
 */

module.exports = Plugin

/**
 * Constructor function
 */

function Plugin() {
  // return value should be a callable function
  // with strictly defined options passed by markdown-it
  var self = function(md, options) {
    self.options = options
    self.init(md)
  }

  // initialize plugin object
  self.__proto__ = Plugin.prototype

  self.id     = 'render-readme-meta'

  return self
}

util.inherits(Plugin, Function)

// function that registers plugin with markdown-it
Plugin.prototype.init = function(md) {
  md.block.ruler.before('hr', this.id, this.parse.bind(this))
  md.renderer.rules.raw = this.render_text.bind(this)

  this.escape = md.utils.escapeHtml
}

Plugin.prototype.render_text = function(tokens, idx, options, env) {
  return this.escape(tokens[idx].content)
}

Plugin.prototype.parse = function(state, start, end, silent) {
  if (start !== 0 || state.blkIndent !== 0) return false
  if (state.tShift[start] < 0) return false
  if (!get(state, start).match(/^---$/)) return false

  var data = []
  for (var line = start + 1; line < end; line++) {
    var str = get(state, line)
    if (str.match(/^---$/)) break
    if (state.tShift[line] < 0) break
    data.push(str)
  }

  if (line >= end) return false

  try {
    var parsed = YAML.safeLoad(data.join('\n'))
  } catch(er) {
    return false
  }

  if (!(typeof(parsed) === 'object' && parsed !== null)) return false

  if (!silent) {
    addTable(state, parsed, 0)
  }

  state.line = line + 1
  return true
}

function addTable(state, parsed, level) {
  function open(tag) {
    state.push(tag + '_open', tag, 1)
  }
  function close(tag) {
    state.push(tag + '_close', tag, -1)
  }
  function data(x) {
    if (level >= 3 || !(typeof(x) === 'object' && x !== null)) {
      var token = state.push('raw', '', 0)
      token.content = String(x)
    } else {
      addTable(state, parsed, level + 1)
    }
  }

  open('table')
  if (Array.isArray(parsed)) {
    open('tbody')
    open('tr')
    parsed.forEach(function(el) {
      open('td')
      data(el)
      close('td')
    })
    close('tr')
    close('tbody')
  } else {
    var keys = Object.keys(parsed)
    open('thead')
    keys.forEach(function(k) {
      open('th')
      data(k)
      close('th')
    })
    close('thead')
    open('tbody')
    keys.forEach(function(k) {
      open('td')
      data(parsed[k])
      close('td')
    })
    close('tbody')
  }
  close('table')
}

function get(state, line) {
  var pos = state.bMarks[line]
  var max = state.eMarks[line]
  return state.src.substr(pos, max - pos)
}

