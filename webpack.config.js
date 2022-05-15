const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    extensionPage: path.resolve(__dirname, './src/extensionPage/extensionPage.tsx'),
    service_worker: {
      import: path.resolve(__dirname, './src/service_worker.ts'),
      filename: 'service_worker.js',
    },
    content_script: {
      import: path.resolve(__dirname, './src/content-script.ts'),
      filename: 'content-script.js',
    },
  },

  output: {
  path: path.resolve(__dirname, './dist'),
  filename: 'js/[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            // options: { presets: ['@babel/preset-env', '@babel/react', '@babel/preset-typescript'] },
          },
        ],
      },
      {
          test: /\.css$/,
          use: 'css-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['extensionPage'],
      template: path.resolve(__dirname, './public/template.html'),
      filename: 'extensionPage/extensionPage.html',
      title: 'extensionPage',
    }),
    new CopyPlugin({
      patterns: [
        { from: './public/manifest.json', to: './' },
        { from: './public/rules.json', to: './' },
      ]
    }),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  target: 'web',
  devtool: 'cheap-module-source-map',
  mode: 'development',
};
