const path = require("path");

const workingDir = path.resolve(__dirname);
const browserTestDir = path.join(workingDir, "test", "browser");
const testFileNames = [
    "blst-sample-case.test.ts",
    "P1.test.ts",
    "P2.test.ts",
    "Pairing.test.ts",
    "SecretKey.test.ts",
];
const testFiles = testFileNames.map(f => path.join(workingDir, "test", "unit", "bindings", f));

module.exports = {
  entry: testFiles,
  mode: "development",
  devServer: {
    static: {
      directory: browserTestDir
    },
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer"),
      "assert": require.resolve("assert-browserify"),
      "path": require.resolve("path-browserify"),
    }
  },
  output: {
    filename: "bundle.js",
    path: browserTestDir,
  },
  experiments: {
    topLevelAwait: true,
  }
};