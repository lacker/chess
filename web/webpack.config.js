var path = require("path");
module.exports = {
  entry: "./main.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: "\.js$",
        loader: "babel-loader" }
    ]
  },
  resolveLoader: {
    root: "/usr/local/lib/node_modules/"
  }
};
