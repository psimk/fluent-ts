var path = require("path");
var { default: FluentTSWebpackPlugin } = require("../../dist/plugin");

module.exports = {
  context: __dirname,
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "../../testdist"),
    publicPath: "",
    filename: "bundle.js",
  },
  module: { rules: [{ test: /\.ftl$/, loader: "raw-loader" }] },
  plugins: [new FluentTSWebpackPlugin({ outDir: __dirname })],
};
