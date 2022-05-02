const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
   entry: {
      background: path.resolve(__dirname, "../src/background", "background.ts"),
      popup: path.resolve(__dirname, "../src/popup", "popup.ts"),
      options: path.resolve(__dirname, "../src/options", "options.ts"),
   },
   output: {
      path: path.join(__dirname, "../", "dist"),
      filename: "[name]/[name].js",
      clean: true
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            use: [{loader : "ts-loader"}],
            exclude: /node_modules/,
            
         },
      ],
   },
   plugins: [
      new CopyPlugin({
         patterns: [
            {from : "src/popup/popup.html", to: "popup"},
            {from : "src/options/options.html", to: "options"},
            {from : "src/images", to: "images"},
            {from : "src/manifest.json", to: "."},
         ]
      }),
   ],
   // experiments: {
      // topLevelAwait: true,
   //  },
};