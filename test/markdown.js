var assert = require('assert')
var parse  = require('../')

// block
assert.equal(parse('> x'),
                   '<blockquote>\n<p>x</p>\n</blockquote>\n')
assert.equal(parse('    q'),
                   '<pre><code>q</code></pre>\n')
assert.equal(parse('```foo\nxxx\n```'),
                   '<pre><code class=\"lang-foo\">xxx\n</code></pre>\n')
assert.equal(parse('# foo'),
                   '<h1><a name=\"foo\"></a>foo</h1>\n')
assert.equal(parse('bar\n----\n'),
                   '<h2><a name=\"bar\"></a>bar</h2>\n')
assert.equal(parse('----'),
                   '<hr />\n')
assert.equal(parse('<div>\n    <br>\n</div>'),
                   '<div>\n    <br />\n</div>')
assert.equal(parse('- 1\n   - 2'),
                   '<ul>\n<li>1\n<ul>\n<li>2</li>\n</ul>\n</li>\n</ul>\n')
assert.equal(parse('[zzz]\n\n[zzz]: 123'),
                   '<p><a href=\"123\">zzz</a></p>\n')
assert.equal(parse('| a | b |\n|---|---|\n| c | d |\n'),
                   '<table>\n<thead>\n<tr>\n<th>a</th>\n<th>b</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>c</td>\n<td>d</td>\n</tr>\n</tbody>\n</table>\n')

// inline
assert.equal(parse('<foo@bar.com>'),
                   '<p><a href=\"mailto:foo@bar.com\">foo@bar.com</a></p>\n')
assert.equal(parse('`test`'),
                   '<p><code>test</code></p>\n')
assert.equal(parse('&#123;'),
                   '<p>{</p>\n')
assert.equal(parse('\\[test]()'),
                   '<p>[test]()</p>\n')
assert.equal(parse('<s>foo</s>'),
                   '<p><s>foo</s></p>\n')
assert.equal(parse('**test**'),
                   '<p><strong>test</strong></p>\n')
assert.equal(parse('[test](foo)'),
                   '<p><a href="foo">test</a></p>\n')
assert.equal(parse('~~test~~'),
                   '<p><s>test</s></p>\n')
assert.equal(parse('![test](foo)'),
                   '<p><img src="foo" alt="test" /></p>\n')

// core
assert.equal(parse('```\n\0foo\r\n\nbar\nx\tbaz\n'),
                   '<pre><code>�foo\n\nbar\nx   baz\n</code></pre>\n')

// this shouldn't fail:
assert.equal(parse('```!@#$%^&*"\nxxx\n```'),
                   '<pre><code class=\"lang-!@#$%^&amp;*&quot;\">xxx\n</code></pre>\n')
