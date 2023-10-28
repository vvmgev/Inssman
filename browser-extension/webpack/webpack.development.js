const webpackConfig = require('./webpack.common');
module.exports = {
   ...webpackConfig,
   mode: "development",
   devtool: 'inline-source-map',
};
