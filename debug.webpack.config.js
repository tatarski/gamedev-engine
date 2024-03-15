const path = require('path');
const config = require('./config');
module.exports = {
  entry: {
    main: './src/init.js',
  },
  mode: 'development',
  // devtool: 'inline-source-map',
  output: {
  filename: config.app.build_output,
  path: path.resolve(__dirname, config.app.public_dirname),
  },
  watchOptions: {
    poll: 1000, // Check for changes every second
    ignored: '**/node_modules',
  },
};