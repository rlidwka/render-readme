//
// This is a remarkable plugin for rendering headers with anchors in there
//
// Based off a `remarkable` core code and `remarkable-meta` plugin.
// 

/**
 * Module dependencies.
 */

var util   = require('util')
var escape = require('./vendor/utils').escapeHtml
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
  // with strictly defined options passed by remarkable
  var self = function(remarkable, options) {
    self.options = options
    self.init(remarkable)
  }

  // initialize plugin object
  self.__proto__ = Plugin.prototype

  self.id     = 'render-readme-meta'

  return self
}

util.inherits(Plugin, Function)

// function that registers plugin with remarkable
Plugin.prototype.init = function(remarkable) {
  remarkable.block.ruler.before('hr', this.id, this.parse.bind(this))
  remarkable.renderer.rules.raw = this.render_text.bind(this)
}

Plugin.prototype.render_text = function(tokens, idx, options, env) {
  return escape(tokens[idx].text)
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
    state.tokens.push({
      type  : tag + '_open',
      level : state.level++,
    })
  }
  function close(tag) {
    state.tokens.push({
      type  : tag + '_close',
      level : --state.level,
    })
  }
  function data(x) {
    if (level >= 3 || !(typeof(x) === 'object' && x !== null)) {
      state.tokens.push({
        type  : 'raw',
        level : state.level,
        text  : String(x),
      })
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
      open('td')
      data(k)
      close('td')
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

