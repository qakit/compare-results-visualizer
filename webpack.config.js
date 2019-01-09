const mode = process.env.NODE_ENV || 'development';
const sourceMaps = mode === 'development';

module.exports = {
  mode,
  devtool: sourceMaps ? 'source-map' : undefined,
  entry: "./index.js",
  output: {
    filename: "compare.results.visualizer.js",
    path: __dirname + "/js/"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          sourceMaps,
        },
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  }
};
