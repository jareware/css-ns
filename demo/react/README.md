# css-ns React demo

## Build performance notes

At the time of writing (or committing).

 * Build with `uglifyjs --compress --mangle` is `409K`, but breaks `class` names
 * Build with `uglifyjs --compress --mangle --keep-fnames` is `435K`, and keeps names
 * Build with `uglifyjs --compress --mangle` but with [babel-plugin-react-class-display-name](https://github.com/researchgate/babel-plugin-react-class-display-name) is again `409K`, and keeps names
   * but see also [babel-plugin-react-class-display-name/issues/1](https://github.com/researchgate/babel-plugin-react-class-display-name/issues/1)

Conclusion: `displayName` can be included in production builds for free in terms of file size, but not without a bit of a hassle.
