module.exports = createCssNs;
module.exports.createCssNs = createCssNs;
module.exports.createOptions = createOptions;
module.exports.createReact = createReact;
module.exports.nsAuto = nsAuto;
module.exports.nsString = nsString;
module.exports.nsArray = nsArray;
module.exports.nsObject = nsObject;
module.exports.nsReactElement = nsReactElement;

var FILE_BASENAME = /.*[\/\\]([\w-]+).*/;

function isString(x) {
  return typeof x === 'string';
}

function isArray(x) {
  return Array.isArray(x);
}

function isObject(x) {
  return typeof x === 'object' && !isArray(x) && x !== null;
}

function isRegex(x) {
  return x instanceof RegExp;
}

function isReactElement(opt, x) {
  return opt.React && opt.React.isValidElement(x);
}

function assert(truthyValue, message) {
  if (!truthyValue) throw new Error(message);
}

function assertOptionType(assertion, readableType, name, value) {
  assert(assertion(value), 'The "' + name + '" option must be of type ' + readableType + ', got: ' + value);
  return value;
}

var assertRegexOption = assertOptionType.bind(null, isRegex, 'RegExp');
var assertStringOption = assertOptionType.bind(null, isString, 'string');
var assertObjectOption = assertOptionType.bind(null, isObject, 'object');

function createOptions(raw) {
  if (raw._cssNsOpts) return raw; // already processed, let's skip any extra work
  if (isString(raw)) return createOptions({ namespace: raw }); // shorthand for just specifying the namespace
  assert(isObject(raw), 'Options must be provided either as an object or a string, got: ' + raw);
  return {
    namespace:  assertStringOption( 'namespace', raw.namespace).replace(FILE_BASENAME, '$1'),     // e.g. "/path/to/MyComponent.js" becomes "MyComponent"
    prefix:     assertStringOption( 'prefix',    raw.prefix  || ''),                              // e.g. "myapp-"
    include:    assertRegexOption(  'include',   raw.include || /^[a-z]/),                        // assume upper-cased classes are other components
    exclude:    assertRegexOption(  'exclude',   raw.exclude || /^$/),                            // don't exclude anything by default (this regex will never match anything of relevance)
    escape:     assertStringOption( 'escape',    raw.escape  || '='),                             // escape classes beginning with "="" by default
    self:       assertRegexOption(  'self',      raw.self    || /^this$/),                        // "this" references the current component directly
    glue:       assertStringOption( 'glue',      raw.glue    || '-'),                             // allows e.g. "MyComponent_foo" when set to "_"
    React:      raw.React && assertObjectOption('React', raw.React) || null,                      // passing in a React instance enables the React convenience methods
    _cssNsOpts: true                                                                              // flag signaling that options are already processed, and don't need to be processed again
  };
}

function createCssNs(options) {
  var opt = createOptions(options);
  var ns = nsAuto.bind(null, opt);
  ns.ns = ns; // allows: const { ns, React } = createCssNs(__filename);
  if (opt.React) ns.React = createReact(opt, ns);
  return ns;
}

function createReact(options, ns) {
  var opt = createOptions(options);
  ns = ns || nsAuto.bind(null, opt); // avoid creating another bound version of nsAuto() if our caller already provided one
  assert(opt.React, 'React support must be explicitly enabled by providing the "React" option');
  return Object.create(opt.React, { // inherit everything from standard React
    createElement: { // ...except hijack createElement()
      value: function(_, props) {
        if (props) props.className = ns(props.className);
        return opt.React.createElement.apply(opt.React, arguments);
      }
    }
  });
}

function nsAuto(options, x) {
  var opt = createOptions(options);
  if (isReactElement(opt, x))
    return nsReactElement(opt, x);
  else if (isString(x))
    return nsString(opt, x);
  else if (isArray(x))
    return nsArray(opt, x);
  else if (isObject(x))
    return nsObject(opt, x);
  else // input was something we don't understand (e.g. a falsy value) -> pass it through
    return x;
}

function nsString(options, string) {
  assert(isString(string), 'nsString() expects string input, got: ' + string);
  var opt = createOptions(options);
  return string.split(/\s+/).map(function(cls) {
    if (cls.match(opt.self)) // e.g. "this"
      return opt.prefix + opt.namespace;
    else if (opt.prefix && cls.substr(0, opt.prefix.length) === opt.prefix) // already prefixed
      return cls; // => don't touch it
    else if (opt.escape && cls.length >= opt.escape.length && cls.substr(0, opt.escape.length) === opt.escape)
      return cls.substr(opt.escape.length); // => remove the escape sign
    else if (cls.match(opt.include) && !cls.match(opt.exclude)) // matching non-prefixed, non-namespaced class name
      return opt.prefix + opt.namespace + opt.glue + cls; // => prefix & namespace
    else // something else
      return cls; // => don't touch it
  }).join(' ').trim();
}

function nsArray(options, array) {
  assert(isArray(array), 'nsArray() expects array input, got: ' + array);
  var opt = createOptions(options);
  return array
    .filter(function(x) { return !!x })
    .map(nsString.bind(null, opt))
    .join(' ');
}

function nsObject(options, object) {
  assert(isObject(object), 'nsObject() expects object input, got: ' + object);
  var opt = createOptions(options);
  return nsArray(opt, Object.keys(object).map(function(key) {
    return object[key] ? key : null;
  }));
}

function nsReactElement(options, el) {
  if (isString(el)) return el; // we're mapping a text node -> leave it be
  var opt = createOptions(options);
  assert(isReactElement(opt, el), 'nsReactElement() expects a valid React element, got: ' + el);
  var props = el.props.className ? { className: nsAuto(opt, el.props.className) } : el.props;
  var children = opt.React.Children.map(el.props.children, nsReactElement.bind(null, opt));
  return opt.React.cloneElement(el, props, children);
}
