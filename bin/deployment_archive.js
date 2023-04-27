#!/usr/bin/env node

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

const fs = require('fs-extra');
const {join} = require('path');
const JSZip = require('jszip');
const zip = new JSZip();

const srcFolder = 'server/dist';
const distZipFile = process.argv[2] || 'wire-account.zip';
const ignoreList = ['.DS_Store'];

process.chdir(srcFolder);

fs.copySync('../package.json', './package.json');
fs.copySync('../.env.defaults', './.env.defaults');
fs.copySync('../../Procfile', './Procfile');

const walkSync = (dir, fileList = []) =>
  fs.readdirSync(dir).reduce((fileListAccumulator, file) => {
    const isDirectory = fs.statSync(join(dir, file)).isDirectory();
    return isDirectory ? walkSync(join(dir, file), fileListAccumulator) : fileListAccumulator.concat(join(dir, file));
  }, fileList);

const files = walkSync('./');

const zipOptions = {createFolders: true};

files
  .filter(file => ignoreList.some(ignore => !file.includes(ignore)))
  .forEach(file => {
    // eslint-disable-next-line no-console
    console.log(`Pushing file ${file}`);
    zip.file(file, fs.readFileSync(file), zipOptions);
  });

zip.generateAsync({type: 'nodebuffer'}).then(content => {
  fs.writeFileSync(`../../${distZipFile}`, content);
});
