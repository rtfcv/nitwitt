const TerserPlugin = require("terser-webpack-plugin")
const path = require('path');

const common = require('./webpack.config.prod.js');
common.output.path = path.resolve(__dirname, './release');

module.exports = common
