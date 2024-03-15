const path = require('path');
const config = require('./config');
module.exports = {
  entry: './src/init.js',
  mode: 'production',
  output: {
  filename: config.app.build_output,
  path: path.resolve(__dirname, config.app.public_dirname),
  },
};