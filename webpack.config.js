const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.mjs',
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'ca.js',
    library: {
      name: 'ca',
      type: 'umd',
      umdNamedDefine: true
    },
    globalObject: 'typeof self !== \'undefined\' ? self : this',
    clean: true
  },
  externals: {
    'cross-fetch': {
      amd: 'cross-fetch',
      commonjs: 'cross-fetch',
      commonjs2: 'cross-fetch',
      root: 'fetch'
    },
    'dom-parser': {
      amd: 'dom-parser',
      commonjs: 'dom-parser',
      commonjs2: 'dom-parser',
      root: 'DOMParser'
    }
  },
}
