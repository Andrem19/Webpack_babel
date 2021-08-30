const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
      splitChunks: {
        chunks: 'all'
      }
    }
  
    if (isProd) {
      config.minimizer = [
        new OptimizeCssAssetWebpackPlugin(),
        new TerserWebpackPlugin()
      ]
    }
  
    return config
  }
  const plugins = () => {
    const base = [
      new HTMLWebpackPlugin({
        template: './index.html',
        minify: {
          collapseWhitespace: isProd
        }
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/favicon.ico'),
            to: path.resolve(__dirname, 'dist')
          }
        ]
      }),
    ]
  
    if (isProd) {
      base.push(new BundleAnalyzerPlugin())
    }
  
    return base
  }

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.jsx'],
        analytics: './analytics.ts'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    //devtool: isDev ? 'source-map' : '',
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,                
                use:  ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)/,
                type: 'asset/resource'
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-react']
                  }
                }
              },
              {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              },
              {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-typescript']
                  }
                }
              },
        ]
    }
}