![css-ns](logo.png)

[![Build Status](https://travis-ci.org/jareware/css-ns.svg?branch=master)](https://travis-ci.org/jareware/css-ns) [![Dependency Status](https://david-dm.org/jareware/css-ns.svg)](https://david-dm.org/jareware/css-ns) [![devDependency Status](https://david-dm.org/jareware/css-ns/dev-status.svg)](https://david-dm.org/jareware/css-ns#info=devDependencies)

## tl;dr

There's no shortage of solutions to the [problem of global CSS](https://medium.com/seek-ui-engineering/the-end-of-global-css-90d2a4a06284). The properties that set this one apart:

 * **It's very simple**, on the order of 100 [well](css-ns.spec.js)-[tested](selenium.png) lines of JS, with [0 dependencies](package.json).
 * **Works with all your favorite styling languages**, including [Sass](#use-with-sass), [PostCSS](#use-with-postcss), [Less](#use-with-less) and [Stylus](#use-with-stylus).
 * **Doesn't rely on a specific bundler**, meaning you can use [Browserify](http://browserify.org/), [webpack](https://webpack.github.io/), [RequireJS](http://requirejs.org/), or any bundler-de-jour.
 * **Isn't tied to any UI framework**, but has opt-in convenience for [use with React](#usage-example), for example.
 * **Generates stable and predictable class names** for external parties, such as the consumers of your UI library on [npm](https://www.npmjs.com/), or your test automation system.

The core API is very straightforward:

```js
var ns = require('css-ns')('MyComponent');

ns('foo') // "MyComponent-foo"
```

Everything else is just added convenience for working with class names:

```js
// Multiple class names:
ns('foo bar') // "MyComponent-foo MyComponent-bar"

// Dynamic list of class names, filtering falsy ones out:
ns([ 'foo', null, 'bar' ]) // "MyComponent-foo MyComponent-bar"

// Providing class names as object properties:
ns({ foo: true, unwanted: false, bar: true }) // "MyComponent-foo MyComponent-bar"
```

And with the optional [React integration](#use-with-react):

```jsx
// Simplest possible integration:
<div className={ns('foo')} />) // <div class="MyComponent-foo" />

// Namespacing existing elements:
ns(<div className="foo" />) // <div class="MyComponent-foo" />

// Creating a namespace-bound React instance:
var { React } = require('./config/css-ns')('MyComponent');
<div className="foo" /> // <div class="MyComponent-foo" />
<div className={{ foo: true }} /> // <div class="MyComponent-foo" />
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
// Instead of requiring React directly, let's require a
// wrapped version that's bound to the current namespace:
var { React } = require('./config/css-ns')(__filename);

// All className props within this file are automatically fed through css-ns. There's really no
// magic here; keep in mind <div /> is just JSX sugar for React.createElement('div', {});
module.exports = (props) => (
  <div className="this">
    <button className={{ submit: true, isActive: props.isActive }} />
  </div>
);
```

You'll note we also `require('./config/css-ns')`; this is explained thoroughly in [Configuration](#configuration).

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

The simple `require('css-ns')(__filename)` one-liner might very well be enough for some projects. If you need to set some options, however, it might become tedious to repeat them in every file. Having an `.*rc`-style configuration file would tie `css-ns` to environments with a file system (browsers don't have one), so to create a configuration file, just use whatever module system you're already using. Let's say we're using ES6:

```js
// e.g. config/css-ns.js

import createCssNs from 'css-ns';

export default namespace => createCssNs({
  namespace,
  exclude: /^fa-/ // exclude Font Awesome classes, as they have their own "fa-" namespace
});
```

Then, to create a local namespace with the `exclude` option set:

```js
import createCssNs from './config/css-ns'; // instead of the global 'css-ns'

const ns = createCssNs(__filename);
```

Or, in the more compact CommonJS form:

```js
var ns = require('./config/css-ns')(__filename);
```

There's also a [complete demo app](demo/react) configured this way.

## API

The `createCssNs()` factory takes either a string or an options object as its single argument:

```js
var createCssNs = require('css-ns');

// This shorthand syntax...
var ns = createCssNs(__filename);

// ...is equivalent to this options object:
var ns = createCssNs({
  namespace: __filename
});
```

All available options are:

| Option      | Type   | Default    | Description
|-------------|--------|------------|------------
| `namespace` | string | (none)     | Mandatory base part for the namespace, e.g. `"MyComponent"` or `__filename`. For convenience, a possible file path and suffix are ignored, so that if the provided value is `"/path/to/MyComponent.js"`, the resulting namespace will still be `"MyComponent"`.
| `include`   | regex  | `/^[a-z]/` | Only class names matching this regex are namespaced. By default, only ones starting in lower-case are. This works out nicely with upper-cased `namespace` values: it ensures only one namespace can be applied to a class name, and calling `ns()` multiple times has the same effect as calling it once.
| `exclude`   | regex  | `/^$/`     | Class names matching this regex are not namespaced. By default, nothing is excluded (since `/^$/` won't ever match a class name). When both `include` and `exclude` match, `exclude` wins.
| `self`      | regex  | `/^this$/` | Class names matching this regex are replaced with the name of the namespace itself. This allows you to e.g. mark the root of your UI component without any suffixes, just the component name.
| `glue`      | string | `"-"`      | This string is used to combine the namespace and the class name.
| `React`     | object | (none)     | Providing this option enables React integration. When provided, must be an instance of React, e.g. `{ react: require('react') }`. See [Use with React](#use-with-react) for details.

## Use with React

By default, `css-ns` doesn't use or depend on React in any way. This ensures bundlers don't get confused in projects that don't need the React integration. To enable React integration, provide the [`React` option](#api) for `createCssNs()`:

```js
// e.g. config/css-ns.js

var createCssNs = require('css-ns');
var React = require('react');

module.exports = function(namespace) {
  return createCssNs({
    namespace,
    React
  });
};
```

### Wrapped React instance

Providing the `React` option will expose a wrapped React instance on resulting namespace functions:

```js
var ns = require('./config/css-ns')('MyComponent');

ns.React.createElement('div', { className: 'foo' }) // <div class="MyComponent-foo">
```

Because JSX just sugar for `React.createElement()` calls, this allows you to:

```jsx
var { React } = require('./config/css-ns')('MyComponent');

<div className="foo"> // <div class="MyComponent-foo">
```

The wrapping is in fact [extremely thin](https://github.com/jareware/css-ns/blob/b62b5d4aef6d8c43707622da2fa63eeb601bdb66/css-ns.js#L70-L77), and everything except `React.createElement()` is just inherited from React proper.

### Namespacing existing React elements

Providing the `React` option will also enable support for React elements in the `ns()` function, so that:

```jsx
var React = require('react'); // vanilla, non-wrapped React instance

ns(<div className="foo" />) // <div class="MyComponent-foo" />
```

This can be useful in the (rare) cases where your namespace has to be dynamically applied to elements created by some other module. Because the only safe way to do this is to invoke `React.cloneElement()` under the hood, it can have performance implications if overused.

## Use with Sass

Use with [Sass](http://sass-lang.com/) requires no special support or plugins. This input:

```scss
.MyComponent {
  background: cyan;

  &-row {
    color: red;
  }
}
```

will be compiled to this CSS:

```css
.MyComponent {
  background: cyan;
}
.MyComponent-row {
  color: red;
}
```

## Use with PostCSS

Use with [PostCSS](https://github.com/postcss/postcss) is easiest with the [`postcss-nested`](https://github.com/postcss/postcss-nested) plugin. With it, this input:

```scss
.MyComponent {
  background: cyan;

  &-row {
    color: red;
  }
}
```

will be compiled to this CSS:

```css
.MyComponent {
  background: cyan;
}
.MyComponent-row {
  color: red;
}
```

## Use with Less

Use with [Less](http://lesscss.org/) requires no special support or plugins. This input:

```less
.MyComponent {
  background: cyan;

  &-row {
    color: red;
  }
}
```

will be compiled to this CSS:

```css
.MyComponent {
  background: cyan;
}
.MyComponent-row {
  color: red;
}
```

## Use with Stylus

Use with [Stylus](http://stylus-lang.com/) requires no special support or plugins. This input:

```
.MyComponent
  background: cyan

  &-row
    color: red
```

will be compiled to this CSS:

```css
.MyComponent {
  background: cyan;
}
.MyComponent-row {
  color: red;
}
```

## Licence

[MIT](https://opensource.org/licenses/MIT)
