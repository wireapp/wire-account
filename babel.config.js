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

const debug = false;
const modules = false;

const SUPPORTED_BROWSERS = {
  android: 5,
  chrome: 57,
  firefox: 45,
  ios: 9,
  msedge: 12,
  safari: 9,
};

const testAttributeRegex = '^data-uie-*';

module.exports = {
  env: {
    production: {
      plugins: [['babel-plugin-remove-jsx-attributes', {patterns: [testAttributeRegex]}]],
    },
  },
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-syntax-dynamic-import'],
  presets: [
    ['@babel/preset-react', {runtime: 'automatic'}],
    '@emotion/babel-preset-css-prop',
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        corejs: 'core-js@3',
        debug,
        modules,
        targets: {
          browsers: [
            `chrome >= ${SUPPORTED_BROWSERS.chrome}`,
            `firefox >= ${SUPPORTED_BROWSERS.firefox}`,
            `safari >= ${SUPPORTED_BROWSERS.safari}`,
            `edge >= ${SUPPORTED_BROWSERS.msedge}`,
            `ios >= ${SUPPORTED_BROWSERS.ios}`,
            `android >= ${SUPPORTED_BROWSERS.android}`,
          ],
        },
        useBuiltIns: 'usage',
      },
    ],
  ],
};
