#!/usr/bin/env node

/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
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

const fs = require('fs-extra');
const {join, resolve} = require('path');

const SUPPORTED_LOCALE = ['de'];
const root = resolve(__dirname, '..');
const translationsDir = join(root, 'i18n');

function transDir(file) {
  return join(translationsDir, file);
}

function getLocale(filename) {
  const localeRgx = /.+?-([a-zA-Z-]+)\.(po|js)/.exec(filename);
  return localeRgx && localeRgx[1];
}

function removeCountryFromFilename(filename) {
  const newFilename = filename.replace(/(.+?-[a-zA-Z]+)(?:-[a-zA-Z]+)?(\.(po|js))/, '$1$2');
  if (newFilename !== filename) {
    fs.renameSync(transDir(filename), transDir(newFilename));
  }
  return newFilename;
}

function fixApostrophe(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const newLines = lines.map(line => {
    const lineRgx = /^([^']*')(.*?)('[^']*)$/.exec(line);
    return lineRgx ? `${lineRgx[1]}${lineRgx[2].replace("'", '’')}${lineRgx[3]}` : line; // eslint-disable-line no-magic-numbers
  });
  fs.writeFileSync(file, newLines.join('\n'));
}

function processFiles(files) {
  files.forEach(file => {
    const locale = getLocale(file);

    if (!locale) {
      return;
    }

    if (!SUPPORTED_LOCALE.includes(locale.split('-')[0])) {
      console.log(`Removing unsupported locale "${locale}"`);
      fs.unlinkSync(transDir(file));
      return;
    }

    const newFilename = removeCountryFromFilename(file);
    fixApostrophe(transDir(newFilename));
  });
}

processFiles(fs.readdirSync(translationsDir));
