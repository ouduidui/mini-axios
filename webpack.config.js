module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/dist/',
    filename: 'axios.min.js',
    library: 'axios',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  devtool: 'source-map',
  watch: true
};
