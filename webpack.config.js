module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: "./index.js",
  output: {
    filename: "compare.results.visualizer.js",
    path: __dirname + "/js/"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  }
};
