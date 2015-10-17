var React = require('react');

module.exports = createCssNs;
module.exports.createOptions = createOptions;
module.exports.nsAuto = nsAuto;
module.exports.nsString = nsString;
module.exports.nsArray = nsArray;
module.exports.nsObject = nsObject;
module.exports.nsReactElement = nsReactElement;

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

function assert(truthyValue, message) {
  if (!truthyValue) throw new Error(message);
}

function assertOptionType(assertion, readableType, name, value) {
  assert(assertion(value), 'The "' + name + '" option must be of type ' + readableType + ', got: ' + value);
  return value;
}

var assertRegexOption = assertOptionType.bind(null, isRegex, 'RegExp');
var assertStringOption = assertOptionType.bind(null, isString, 'string');

function createOptions(raw) {
  if (raw._cssNsOpts) return raw; // already processed, let's skip any extra work
  if (isString(raw)) return createOptions({ namespace: raw }); // shorthand for just specifying the namespace
  assert(isObject(raw), 'Options must be provided either as an object or a string, got: ' + raw);
  return {
    namespace:  assertStringOption( 'namespace', raw.namespace).replace(/.*\/([\w-]+).*/, '$1'),
    include:    assertRegexOption(  'include',   raw.include || /^[a-z]/),
    exclude:    assertRegexOption(  'exclude',   raw.exclude || /^$/),
    self:       assertRegexOption(  'self',      raw.self    || /^this$/),
    glue:       assertStringOption( 'glue',      raw.glue    || '-'),
    _cssNsOpts: true
  };
}

function createCssNs(options) {
  var opt = createOptions(options);
  return nsAuto.bind(null, opt);
}

function nsAuto(options, x) {
  var opt = createOptions(options);
  if (React.isValidElement(x))
    return nsReactElement(opt, x);
  else if (isString(x))
    return nsString(opt, x);
  else if (isArray(x))
    return nsArray(opt, x);
  else if (isObject(x))
    return nsObject(opt, x);
  else // input was something we don't understand -> pass it through
    return x;
}

function nsString(options, string) {
  assert(isString(string), 'nsString() expects string input, got: ' + string);
  var opt = createOptions(options);
  return string.split(/\s+/).map(function(cls) {
    if (cls.match(opt.self))
      return opt.namespace;
    else if (cls.match(opt.include) && !cls.match(opt.exclude))
      return opt.namespace + opt.glue + cls;
    else
      return cls;
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
  assert(React.isValidElement(el), 'nsReactElement() expects a valid React element, got: ' + el);
  var opt = createOptions(options);
  var props = el.props.className ? { className: nsAuto(opt, el.props.className) } : el.props;
  var children = React.Children.map(el.props.children, nsReactElement.bind(null, opt));
  return React.cloneElement(el, props, children);
}
