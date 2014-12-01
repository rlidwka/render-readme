
Render and sanitize readme.md just like github would.

Basically, it's node.js version for this:
https://github.com/github/markup

But only for markdown for now, because that's what io.js packages use mostly.

## API

```js
require('render-readme')('Hello, *world*!')

// outputs '<p>Hello, <em>world</em>!</p>\n'
```

## Features

 - the basic rendering is [commonmark](https://github.com/jgm/CommonMark) + gfm extensions (emphasis slightly differs, but nobody cares anyway)
 - html is sanitized, the configuration is similar to [github stuff](https://github.com/github/markup#html-sanitization) (using [sanitize-html](https://github.com/punkave/sanitize-html))
 - syntax highlighting (using [highlight-js](https://github.com/isagalaev/highlight.js) for this one)
 - YAML metadata on top of markdown documents is rendered to a table
 - anchors for headers (`<a name="blah">` instead of `<a id="user-content-blah">`, but should be good enough)

