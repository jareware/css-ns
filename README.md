# css-ns

[![Build Status](https://travis-ci.org/jareware/css-ns.svg?branch=master)](https://travis-ci.org/jareware/css-ns) [![Dependency Status](https://david-dm.org/jareware/css-ns.svg)](https://david-dm.org/jareware/css-ns) [![devDependency Status](https://david-dm.org/jareware/css-ns/dev-status.svg)](https://david-dm.org/jareware/css-ns#info=devDependencies)

## tl;dr

There's no shortage of solutions to the [problem of global CSS](https://medium.com/seek-ui-engineering/the-end-of-global-css-90d2a4a06284). The properties that set this one apart:

 * **It's very simple**, on the order of 150 [well-tested](css-ns.spec.js) lines of JS.
 * **Doesn't rely on a specific bundler**, meaning you can use [Browserify](http://browserify.org/), [webpack](https://webpack.github.io/), [RequireJS](http://requirejs.org/), or any bundler-de-jour.
 * **Works with all your favorite styling languages**, including [Sass](http://sass-lang.com/), [PostCSS](https://github.com/postcss/postcss), [Less](http://lesscss.org/) and [Stylus](http://stylus-lang.com/).
 * **Generates stable and predictable class names** for external parties, such as the consumers of your UI library on [npm](https://www.npmjs.com/), or your test automation system.
 * **Isn't tied to any UI framework**, but has opt-in convenience for [use with React](#usage-example), for example.

The core API is very straightforward:

```js
var ns = require('css-ns')('MyComponent');

ns('foo'); // => "MyComponent-foo"
```

Everything else is just added convenience for working with class names:

```js
// Multiple class names:
ns('foo bar'); // => "MyComponent-foo MyComponent-bar"

// Dynamic list of class names, filtering falsy ones out:
ns([ 'foo', null, 'bar' ]); // => "MyComponent-foo MyComponent-bar"

// Providing class names as object properties:
ns({ foo: true, unwanted: false, bar: true }); // => "MyComponent-foo MyComponent-bar"
```

## Usage example

`css-ns` can be used in a wide variety of of configurations. For instance, if you happen to use React, [stateless functional components](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html) and [`__filename`](https://nodejs.org/api/globals.html#globals_filename) (supported by node, Browserify, webpack and others), this is what `MyComponent.js` might look like, with the optional [React integration](#use-with-react):

```jsx
// Instead of importing React directly, let's import a
// wrapped version that's bound to the current namespace:
const { React } = require('./utils/css-ns')(__filename);

// All className props within this file are automatically fed through css-ns. There's really no
// magic here; keep in mind <div /> is just JSX sugar for React.createElement("div", {});
export default (props) => (
  <div className={{ this: true, isSelected: props.isSelected }}>
    <button className="submit" />
  </div>
);
```

This component produces the following DOM when rendered with `props.isSelected` truthy:

```html
<div class="MyComponent MyComponent-isSelected">
  <button class="MyComponent-submit"></button>
</div>
```

If we were to style this component using Sass, the styles could be:

```scss
.MyComponent {
  background: white;
  
  &-isSelected {
    background: cyan;
  }
  
  &-submit {
    font-weight: bold;
  }
}
```

You'll note there's little need for constantly repeating the `MyComponent` prefix. This makes it hard to accidentally forget the prefix, thus causing a style leak. 

## Getting started

Install with:

```
$ npm install --save css-ns
```

Then, create a namespace function:

```js
var ns = require('css-ns')('MyComponent');
```

Where possible, it's recommended to use `__filename` as the namespace, as it ensures the name of the UI component file always matches its namespace. For convenience, the file path and suffix are ignored, so that if the filename is `/path/to/MyComponent.js`, the resulting namespace will still be `MyComponent`.

The `createCssNs()` factory takes either a string or an options object as its only argument:

```js
var createCssNs = require('css-ns');

// This shorthand syntax...
var ns = createCssNs(__filename);

// ...is equivalent to this options object:
var ns = createCssNs({
  namespace: __filename
});
```

See [full API docs](#api) for other available options.

## Configuration

The simple `require('css-ns')(__filename)` one-liner might very well be enough for some projects. If you need to set some options, however, it might become tedious to repeat them in every file where you need a namespace function. Having an `.*rc`-style configuration file would tie `css-ns` to environments with a file system (browsers don't have one), so to create a configuration file, just use whatever module system you're already using. Let's say we're using ES6:

```js
import createCssNs from 'css-ns';

export default namespace => createCssNs({
  namespace,
  exclude: /^fa-/ // exclude Font Awesome classes, as they have their own "fa-" namespace
});
```

The above contents could go to e.g. `utils/css-ns.js`, or wherever your other utilities live. Then, wherever you wish to create a local namespace:

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
