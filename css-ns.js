var React = require('react');

module.exports = {
  makeOptions: makeOptions,
  nsClassList: nsClassList,
  nsReactElement: nsReactElement
};

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

function assertRegexOpt(value, name) {
  assert(isRegex(value), 'The "' + name + '" option must be provided as a RegExp object, got: ' + value);
  return value;
}

function makeOptions(raw) {
  if (raw._cssNsOpts) return raw; // already processed, let's skip any extra work
  if (isString(raw)) return makeOptions({ namespace: raw }); // shorthand for just specifying the namespace
  assert(isObject(raw), 'Options must be provided either as an object or a string, got: ' + raw);
  assert(isString(raw.namespace), 'Mandatory "namespace" option must be provided as a string, got: ' + raw.namespace);
  return {
    namespace: raw.namespace.replace(/.*\/([\w-]+).*/, '$1'),
    include: assertRegexOpt(raw.include || /^[a-z]/, 'include'),
    exclude: assertRegexOpt(raw.exclude || /^$/, 'exclude'),
    self: assertRegexOpt(raw.self || /^this$/, 'self'),
    _cssNsOpts: true
  };
}

function nsClassList(options, x) {
  var opt = makeOptions(options);
  if (isString(x)) {
    return x.split(/\s+/).map(function(cls) {
      if (cls.match(opt.self))
        return opt.namespace;
      else if (cls.match(opt.include) && !cls.match(opt.exclude))
        return opt.namespace + '-' + cls;
      else
        return cls;
    }).join(' ').trim();
  } else if (isArray(x)) {
    return x
      .map(nsClassList.bind(null, opt))
      .filter(function(x) { return !!x })
      .join(' ');
  } else if (isObject(x)) {
    return nsClassList(opt, Object.keys(x).map(function(key) {
      return x[key] ? key : null;
    }));
  } else { // input was either falsy or something we don't understand -> don't output anything
    return '';
  }
}

function nsReactElement(options, el) {
  assert(el === null || el === false || React.isValidElement(el), 'nsReactElement() expects a valid React element, null or false, got: ' + el);
  if (!el) return el; // see https://facebook.github.io/react/tips/false-in-jsx.html for why falsy values can be useful
  var opt = makeOptions(options);
  var props = el.props.className ? { className: nsClassList(opt, el.props.className) } : el.props;
  var children = React.Children.map(el.props.children, nsReactElement.bind(null, opt));
  return React.cloneElement(el, props, children);
}
