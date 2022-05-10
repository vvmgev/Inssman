const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // extract css to files
module.exports = {
   entry: {
      background: path.resolve(__dirname, "../src/background", "background.ts"),
      popup: path.resolve(__dirname, "../src/popup", "popup.ts"),
      options: path.resolve(__dirname, "../src/options", "options.tsx"),
   },
   output: {
      path: path.join(__dirname, "../", "dist"),
      filename: "[name]/[name].js",
      clean: true
   },
   resolve: {
      extensions: [".ts", '.tsx', ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            use: [{loader : "babel-loader"}, {loader : "ts-loader"}],
            exclude: /node_modules/,
         },
         {
            test: /\.css$/i,
            include: path.resolve(__dirname, "../", "src"),
            use: ["style-loader", "css-loader", "postcss-loader"],
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
      new MiniCssExtractPlugin({
         filename: "options/styles.css",
         chunkFilename: "styles.css"
       }),
   ],
   // experiments: {
      // topLevelAwait: true,
   //  },
};