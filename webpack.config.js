const path = require("path");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  mode: isDev ? "development" : "production",
  entry: `${__dirname}/lib/index.js`,
  output: {
    path: path.resolve(__dirname),
    filename: "zoop-sdk.min.js"
  },
  target: "web"
};
