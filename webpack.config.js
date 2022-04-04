const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  target: ['web', 'es5'],
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'ca.js',
    library: {
      name: 'ca',
      type: 'umd'
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
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  performance: {
    hints: false
  }
}
