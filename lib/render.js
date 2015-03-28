//
// exports
//
module.exports = function(html) {
  return mdit.render(html)
}

//
// helpers
//
var mdit = require('markdown-it')({
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
      'normalize',
    ],
  },

  block: {
    rules: [
      'blockquote',
      'code',
      'fence',
      //'heading', // overridden
      'hr',
      'html_block',
      //'lheading', // overridden
      'list',
      'paragraph',
      'reference',
      'table', // gfm
    ],
  },

  inline: {
    rules: [
      'autolink',
      'backticks',
      'emphasis',
      'entity',
      'escape',
      'html_inline',
      'image',
      'link',
      'newline',
      'strikethrough', // gfm
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
    return highlightjs.highlight(lang, code).value
  } catch(err) {
    return ''
  }
}
