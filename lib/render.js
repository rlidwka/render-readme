//
// exports
//
module.exports = function(html) {
  return rmk.render(html)
}

//
// helpers
//
var rmk = new (require('remarkable'))('commonmark', {
  html        : true,
  xhtmlOut    : false,
  breaks      : false,
  langPrefix  : 'lang-',
  linkify     : true,
  typographer : false,
  highlight   : highlight,
  maxNesting  : 1000,

  core: {
    rules: [
      'block',
      'inline',
      'linkify',
      'references',
    ],
  },

  block: {
    rules: [
      'blockquote',
      'code',
      'fences',
      //'heading', // overridden
      'hr',
      'htmlblock',
      //'lheading', // overridden
      'list',
      'paragraph',
      'table', // gfm
    ],
  },

  inline: {
    rules: [
      'autolink',
      'backticks',
      'del', // gfm
      'emphasis',
      'entity',
      'escape',
      'htmltag',
      'links',
      'newline',
      'text',
    ],
  },
})
.use( require('./rules/heading')(slugfn) )
.use( require('./rules/meta')() )

function slugfn(content) {
  return content.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

var highlightjs = require('highlight.js')
function highlight(code, lang) {
  try {
    try {
      return highlightjs.highlight(lang, code).value
    } catch(err) {
      if (!err.message.match(/Unknown language/)) throw err
      return highlightjs.highlightAuto(code).value
    }
  } catch(err) {
    return code
  }
}

