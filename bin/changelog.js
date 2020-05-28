/*
 * Wire
 * Copyright (C) 2020 Wire Swiss GmbH
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

const fs = require('fs');
const Changelog = require('generate-changelog');
const path = require('path');
const pkg = require('../package.json');
const simpleGit = require('simple-git')();

const options = {'--list': null};
simpleGit.tags(options, async (error, tags) => {
  const outputPath = path.join(__dirname, '../CHANGELOG.md');

  const latestTags = tags.all.reverse();
  const lastTag = latestTags[0];
  const secondLastTag = latestTags[1];
  const changelog = await Changelog.generate({
    exclude: ['chore', 'build', 'docs', 'refactor', 'style', 'test'],
    repoUrl: pkg.repository.url.replace('.git', ''),
    tag: `${secondLastTag}...${lastTag}`,
  });
  console.info(`Changelog size: ${changelog.length}`);
  fs.writeFileSync(outputPath, changelog, 'utf8');
  console.info(`Wrote file to: ${outputPath}`);
});
