//
// exports
//
module.exports = function(html) {
  return sanitize(html, options)
}

//
// helpers
//
var sanitize = require('sanitize-html')

function $w(str) {
  return str.split(' ').filter(Boolean)
}

var tags = $w( ' h1 h2 h3 h4 h5 h6 h7 h8 br b i strong em a pre code img tt'
             + ' div ins del sup sub p ol ul table thead tbody tfoot'
             + ' blockquote dl dt dd kbd q samp var hr ruby rt rp li tr td'
             + ' th s strike span' )

var attrs = $w( ' abbr accept accept-charset accesskey action align alt axis'
              + ' border cellpadding cellspacing char charoff charset checked'
              + ' cite clear cols colspan color compact coords datetime'
              + ' details dir disabled enctype for frame headers height'
              + ' hreflang hspace ismap label lang longdesc maxlength media'
              + ' method multiple name nohref noshade nowrap prompt readonly'
              + ' rel rev rows rowspan rules scope selected shape size span'
              + ' start summary tabindex target title type usemap valign'
              + ' value vspace width itemprop class' )

var addAttrs = {
  a   : $w('href name'),
  img : $w('src'),
  div : $w('itemscope itemtype'),
}

var attrsMap = {}
tags.forEach(function(tag) {
  attrsMap[tag] = attrs
  if (addAttrs[tag]) attrsMap[tag] = attrsMap[tag].concat(addAttrs[tag])
})

var options = {
  allowedTags       : tags,
  allowedAttributes : attrsMap,
  allowedSchemes    : $w('http https mailto github-windows github-mac'),
  exclusiveFilter   : function(tag) {
    if (!tag.attribs.class) return false
    return !tag.attribs.class.match(/^(lang|hljs)-[^\s]+$/)
  }
}

