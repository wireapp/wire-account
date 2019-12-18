/*
 * Wire
 * Copyright (C) 2019 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

const path = require('path');

const dist = path.resolve(__dirname, 'server/dist/static');
const src = path.resolve(__dirname, 'src/');

module.exports = {
  devtool: 'source-map',
  entry: {
    script: path.resolve(__dirname, src, 'script', 'main.tsx'),
  },
  externals: {
    'fs-extra': '{}',
  },
  mode: 'production',
  module: {
    rules: [
      {
        exclude: [/node_modules/],
        test: /\.[tj]sx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        loader: 'svg-inline-loader?removeSVGTagAttrs=false',
        test: /\.svg$/,
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
  },
  output: {
    filename: 'script/[name].js',
    path: path.resolve(__dirname, dist),
    publicPath: '/',
  },
  plugins: [],
  resolve: {
    alias: {
      resource: path.resolve(__dirname, 'resource'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [path.resolve(src), 'node_modules'],
  },
};
