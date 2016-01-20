# css-ns

[![Build Status](https://travis-ci.org/jareware/css-ns.svg?branch=master)](https://travis-ci.org/jareware/css-ns) [![Dependency Status](https://david-dm.org/jareware/css-ns.svg)](https://david-dm.org/jareware/css-ns) [![devDependency Status](https://david-dm.org/jareware/css-ns/dev-status.svg)](https://david-dm.org/jareware/css-ns#info=devDependencies)

## tl;dr

There's no shortage of solutions to the [problem of global CSS](https://medium.com/seek-ui-engineering/the-end-of-global-css-90d2a4a06284). The properties that set this one apart:

 * **It's very simple**, on the order of 150 [well-tested](css-ns.spec.js) lines of JS.
 * **Works with all your favorite styling languages**, including [Sass](http://sass-lang.com/), [PostCSS](https://github.com/postcss/postcss), [Less](http://lesscss.org/) and [Stylus](http://stylus-lang.com/).
 * **Doesn't rely on a specific bundler**, meaning you can use [Browserify](http://browserify.org/), [webpack](https://webpack.github.io/), [RequireJS](http://requirejs.org/), or any bundler-de-jour.
 * **Isn't tied to any UI framework**, but has opt-in convenience for [use with React](#usage-example), for example.
 * **Generates stable and predictable class names** for external parties, such as the consumers of your UI library on [npm](https://www.npmjs.com/), or your test automation system.

The core API is very straightforward:

```js
var ns = require('css-ns')('MyComponent');

ns('foo'); // => "MyComponent-foo"
```

Everything else is just added convenience for working with class names:

```jsx
// Multiple class names:
ns('foo bar'); // => "MyComponent-foo MyComponent-bar"

// Dynamic list of class names, filtering falsy ones out:
ns([ 'foo', null, 'bar' ]); // => "MyComponent-foo MyComponent-bar"

// Providing class names as object properties:
ns({ foo: true, unwanted: false, bar: true }); // => "MyComponent-foo MyComponent-bar"

// Namespacing React elements:
ns(<div className="foo" />); // => <div className="MyComponent-foo" />
```

## Getting started

Install with:

```
$ npm install --save css-ns
```

Then, create a namespace function:

```js
var ns = require('css-ns')('MyComponent');
```

## Usage example

It's easy to add `css-ns` to most frameworks and workflows. For example, if you happen to use React, this is what `MyComponent.js` might look like:

```jsx
var ns = require('css-ns')('MyComponent');

module.exports = (props) => (
  <div className={ns('this')}>
    <button className={ns({ submit: true, isActive: props.isActive })} />
  </div>
);
```

This component produces the following DOM when rendered with truthy `props.isActive`:

```html
<div class="MyComponent">
  <button class="MyComponent-submit MyComponent-isActive"></button>
</div>
```

To ensure you won't accidentally forget to wrap a `className` with `ns()`, you can use the optional [React integration](#use-with-react). Here we also use [`__filename`](https://nodejs.org/api/globals.html#globals_filename) (supported by node, Browserify, webpack and others) to make sure our namespace always matches the file that contains it:

```jsx
// Instead of requiring React directly, let's import a
// wrapped version that's bound to the current namespace:
var { React } = require('./utils/css-ns')(__filename);

// All className props within this file are automatically fed through css-ns. There's really no
// magic here; keep in mind <div /> is just JSX sugar for React.createElement("div", {});
module.exports = (props) => (
  <div className="this">
    <button className={{ submit: true, isActive: props.isActive }} />
  </div>
);
```

You'll note we also `require('./utils/css-ns')`; this is explained thoroughly in [Configuration](#configuration).

Finally, if we were to style this component [using Sass](#use-with-sass), those styles could be:

```scss
.MyComponent {
  background: white;
  
  &-isActive {
    background: cyan;
  }
  
  &-submit {
    font-weight: bold;
  }
}
```

The `&` reference is a [Sass built-in](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#parent-selector), no plugins needed.

## Configuration

The simple `require('css-ns')(__filename)` one-liner might very well be enough for some projects. If you need to set some options, however, it might become tedious to repeat them in every file where you need a namespace function. Having an `.*rc`-style configuration file would tie `css-ns` to environments with a file system (browsers don't have one), so to create a configuration file, just use whatever module system you're already using. Let's say we're using ES6:

```js
import createCssNs from 'css-ns';

export default namespace => createCssNs({
  namespace,
  exclude: /^fa-/ // exclude Font Awesome classes, as they have their own "fa-" namespace
});
```

The above contents could go to e.g. `utils/css-ns.js`, or wherever your other utilities live. Then, to create a local namespace with the `exclude` option set:

```js
import createCssNs from './utils/css-ns';

const ns = createCssNs(__filename);
```

Or, in the more compact CommonJS form:

```js
var ns = require('./utils/css-ns')(__filename);
```

There's also a [complete demo app](demo/react) configured this way.

## API

## Use with React

## Use with Sass

## Use with PostCSS

## Use with Less

## Use with Stylus

## Licence

[MIT](https://opensource.org/licenses/MIT)
