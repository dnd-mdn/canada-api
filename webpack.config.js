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
  devtool: false
}
