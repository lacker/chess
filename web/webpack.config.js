var path = require("path");
module.exports = {
  entry: "./main.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: __dirname,
        loader: 'babel-loader' }
    ]
  }
};
