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

import * as fs from 'fs';
import {promisify} from 'util';

function fileIsReadable(filePath: string, synchronous: true): boolean;
function fileIsReadable(filePath: string, synchronous?: false): Promise<boolean>;
function fileIsReadable(filePath: string, synchronous = false): Promise<boolean> | boolean {
  if (synchronous) {
    try {
      fs.accessSync(filePath, fs.constants.F_OK | fs.constants.R_OK);
      return true;
    } catch (error) {
      return false;
    }
  }
  return promisify(fs.access)(filePath, fs.constants.F_OK | fs.constants.R_OK)
    .then(() => true)
    .catch(() => false);
}

function readFile(filePath: string, synchronous: true): string;
function readFile(filePath: string, synchronous?: false): Promise<string>;
function readFile(filePath: string, synchronous = false): Promise<string> | string {
  return synchronous
    ? fs.readFileSync(filePath, {encoding: 'utf-8'})
    : promisify(fs.readFile)(filePath, {encoding: 'utf-8'});
}

export {fileIsReadable, readFile};
