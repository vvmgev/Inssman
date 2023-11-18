const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');
const { EnvironmentPlugin } = require('webpack');
const manifest = require('../src/manifest.json');
const { version } = require('../package.json');

const outputPath = path.join(__dirname, "../", `dist/${process.env.BROWSER}`);

module.exports = {
   entry: {
      serviceWorker: path.resolve(__dirname, "../src/serviceWorker", "serviceWorker.ts"),
      cotentScript: path.resolve(__dirname, "../src/cotentScript", "cotentScript.ts"),
      newCotentScript: path.resolve(__dirname, "../src/newCotentScript", "newCotentScript.ts"),
      recordSession: path.resolve(__dirname, "../src/recordSession", "recordSession.ts"),
      options: path.resolve(__dirname, "../src/options", "options.tsx"),
      popup: path.resolve(__dirname, "../src/popup", "popup.tsx"),
      iframeContentScript: path.resolve(__dirname, "../src/iframeContentScript", "iframeContentScript.ts"),
      setupContentConfig: path.resolve(__dirname, "../src/setupContentConfig", "setupContentConfig.ts"),
      HTTPLoggerWindow: path.resolve(__dirname, "../src/HTTPLoggerWindow", "HTTPLoggerWindow.tsx"),
      'editor.worker': path.resolve(__dirname, '../node_modules/monaco-editor/esm/vs/editor/editor.worker.js'),
      'json.worker': path.resolve(__dirname, '../node_modules/monaco-editor/esm/vs/language/json/json.worker'),
      'css.worker': path.resolve(__dirname, '../node_modules/monaco-editor/esm/vs/language/css/css.worker'),
      'html.worker': path.resolve(__dirname, '../node_modules/monaco-editor/esm/vs/language/html/html.worker'),
      'ts.worker': path.resolve(__dirname, '../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker')
   },
   output: {
      path: outputPath,
      filename: '[name]/[name].js',
      clean: true
   },
   resolve: {
      roots: [path.resolve('./src')],
      extensions: [".ts", '.tsx', ".js",  ".jsx", ".svg"],
      alias: {
         src: path.resolve(__dirname, '..', 'src'),
         models: path.resolve(__dirname, '..','src', 'models'),
         options: path.resolve(__dirname, '..', 'src', 'options'),
         components: path.resolve(__dirname, '..', 'src', 'options', 'components'),
         pages: path.resolve(__dirname, '..', 'src', 'options', 'pages'),
         assets: path.resolve(__dirname, '..', 'src', 'assets'),
         common: path.resolve(__dirname, '..', 'src', 'options', 'components', 'common'),
         utils: path.resolve(__dirname, '..', 'src', 'utils'),
         services: path.resolve(__dirname, '..', 'src', 'services')
      },
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
            use: ["style-loader", "css-loader", "postcss-loader"],
         },
         {
            test: /\.ttf$/,
            use: ['file-loader'],
            exclude: /node_modules/,
         },
         {
            test: /\.svg/,
            use: ["@svgr/webpack"],
         },
      ]
   },
   plugins: [
      new HtmlWebpackPlugin({
         inject: true,
         template: './src/options/options.html',
         filename:  'options/options.html',
         chunks: ['options']
      }),
      new HtmlWebpackPlugin({
         inject: true,
         template: './src/HTTPLoggerWindow/HTTPLoggerWindow.html',
         filename:  'HTTPLoggerWindow/HTTPLoggerWindow.html',
         chunks: ['HTTPLoggerWindow']
      }),
      new HtmlWebpackPlugin({
         inject: true,
         template: './src/popup/popup.html',
         filename:  'popup/popup.html',
         chunks: ['popup']
      }),

      new MiniCssExtractPlugin({
         filename: "options/styles.css",
         chunkFilename: "styles.css"
      }),
      new CopyPlugin({
        patterns: [
           {from : "src/assets/images", to: "assets/images"},
        ]
      }),
      (() => {
        manifest.version = version;
        return new CreateFileWebpack({
          path: outputPath,
          fileName: 'manifest.json',
          content: JSON.stringify(manifest)
        })
      })(),
      new EnvironmentPlugin({
        BROWSER: process.env.BROWSER
      })
   ],
};
