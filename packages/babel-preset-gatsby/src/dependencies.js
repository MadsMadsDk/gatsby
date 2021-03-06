// This file is heavily based on create-react-app's implementation
// @see https://github.com/facebook/create-react-app/blob/master/packages/babel-preset-react-app/dependencies.js

const path = require(`path`)
const resolve = m => require.resolve(m)

module.exports = function(api, options = {}) {
  const absoluteRuntimePath = path.dirname(
    resolve(`@babel/runtime/package.json`)
  )

  return {
    // Babel assumes ES Modules, which isn't safe until CommonJS
    // dies. This changes the behavior to assume CommonJS unless
    // an `import` or `export` is present in the file.
    // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
    sourceType: `unambiguous`,
    presets: [
      [
        // Latest stable ECMAScript features
        `@babel/preset-env`,
        {
          // Allow importing core-js in entrypoint and use browserlist to select polyfills
          useBuiltIns: `usage`,
          corejs: 2,
          modules: false,
          // Exclude transforms that make all code slower (https://github.com/facebook/create-react-app/pull/5278)
          exclude: [`transform-typeof-symbol`],
        },
      ],
    ],
    plugins: [
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      [
        resolve(`@babel/plugin-transform-runtime`),
        {
          corejs: false,
          helpers: true,
          regenerator: true,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          // We should turn this on once the lowest version of Node LTS
          // supports ES Modules.
          useESModules: true,
          // Undocumented option that lets us encapsulate our runtime, ensuring
          // the correct version is used
          // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
          absoluteRuntime: absoluteRuntimePath,
        },
      ],
      // Adds syntax support for import()
      resolve(`@babel/plugin-syntax-dynamic-import`),
    ],
  }
}
