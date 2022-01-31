const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // The entry point file described above
  entry: {
    app: './src/index.js',
    historia: './src/js/historia.js',
    editarhistoria: './src/js/editar-historia.js',
    controles: './src/js/control-asistencias.js',
    agregarcontrol: './src/js/agregar-control.js',
    editarcontrol: './src/js/editar-control.js',
    odograma: './src/js/odograma.js',
  },
  // The location of the build folder described above
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        /* use: [MiniCssExtractPlugin.loader, 'css-loader'],*/
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(jpg|png|jpeg|webp|svg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
    ],
  },
  devServer: {
    port: 3001,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'node_vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        },
        common: {
          name: 'common_code',
          test: /[\\/]src[\\/]commons[\\/]/,
          chunks: 'all',
          minSize: 0,
        },
      },
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'push', to: 'push' }],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      template: './src/html/historia.html',
      filename: './historia.html',
      chunks: ['historia'],
    }),

    new HtmlWebpackPlugin({
      template: './src/html/editar-historia.html',
      filename: './editar-historia.html',
      chunks: ['editarhistoria'],
    }),
    new HtmlWebpackPlugin({
      template: './src/html/control-asistencias.html',
      filename: './control-asistencias.html',
      chunks: ['controles'],
    }),
    new HtmlWebpackPlugin({
      template: './src/html/agregar-control.html',
      filename: './agregar-control.html',
      chunks: ['agregarcontrol'],
    }),
    new HtmlWebpackPlugin({
      template: './src/html/editar-control.html',
      filename: './editar-control.html',
      chunks: ['editarcontrol'],
    }),
    new HtmlWebpackPlugin({
      template: './src/html/odograma.html',
      filename: './odograma.html',
      chunks: ['odograma'],
    }),
    new HtmlWebpackTagsPlugin({
      files: [
        './historia.html',
        './editar-historia.html',
        './editar-control.html',
        './control-asistencias.html',
        './agregar-control.html',
      ],
      tags: ['push/historia.css'],
      append: true,
    }),
    new MiniCssExtractPlugin(),
  ],
};
