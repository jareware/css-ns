# css-ns React demo

## Build performance notes

At the time of writing (or committing).

 * Build with `uglifyjs --compress --mangle` is `409K`, but breaks `class` names
 * Build with `uglifyjs --compress --mangle --keep-fnames` is `435K`, and keeps names
 * Build with `uglifyjs --compress --mangle` but with [babel-plugin-react-class-display-name](https://github.com/researchgate/babel-plugin-react-class-display-name) is again `409K`, and keeps names
   * but see also [babel-plugin-react-class-display-name/issues/1](https://github.com/researchgate/babel-plugin-react-class-display-name/issues/1)

**Conclusion:** `displayName` can be included in production builds for free in terms of file size, but not without a bit of a hassle.

## Runtime performance notes

At the time of writing (or committing). In Chrome, with `SCALE_FACTOR = 10`. Application reloaded multiple times, and an "average" run was selected. Component render times are "exclusive render times" as reported by React's perf tools. This test run entails about 13,000 namespaced React elements (counted as the number of actual clones made by `nsReactElement()`). [See here about "manual namespacing"](https://github.com/jareware/css-ns/commit/1fb5e43aa2553a7ff5e05dfc7db152c0ac497671).

| Setup | SingleMessage | SingleThread | Total |
|:---|---:|---:|---:|
| Dev build, no namespacing                   | 10 ms        | 64 ms         | 341 ms        |
| Dev build, with namespacing                 | 38 ms        | 285 ms        | 712 ms        |
| Dev build, with manual namespacing          | 34 ms        | 84 ms         | 407 ms        |
| Prod build, no namespacing                  | n/a          | n/a           | 150 ms        |
| Prod build, with namespacing                | n/a          | n/a           | 345 ms        |
| Prod build, with manual namespacing         | n/a          | n/a           | 201 ms        |

**Conclusion:** Naive runtime-namespacing of ReactElements is quite costly, with roughly 4.5x penalty for the SingleThread component (dev build). The prod builds are much more important, though, and there the penalty for the whole app is roughly 2.5x. I'm sure this can be optimized in several ways, the most intriguing of which would be a Babel plugin for doing all non-dynamic namespacing already during compile time.
