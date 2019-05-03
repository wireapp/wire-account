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

/* eslint-disable no-magic-numbers, es5/no-block-scoping, es5/no-template-literals */

const child = require('child_process');
const pkg = require('../app-config/package');

const companyParam = process.argv[2];
const stageParam = process.argv[3];
const suffix = companyParam ? `-${companyParam}` : '';
const stage = stageParam ? `-${stageParam}` : '';
const buildCounter = process.env.TRAVIS_BUILD_NUMBER || 'BUILD_NUMBER';
const commitSha = process.env.TRAVIS_COMMIT || 'COMMIT_ID';
const commitShaLength = 7;
const commitShortSha = commitSha.substring(0, commitShaLength - 1);
const configurationEntry = `wire-web-config-default${suffix}`;
const dependencies = {
  ...pkg.dependencies,
  ...pkg.devDependencies,
  ...pkg.peerDependencies,
  ...pkg.optionalDependencies,
};

const configVersion = dependencies[configurationEntry].split('#')[1];
const dockerRegistryDomain = 'quay.io';
const dockerImageTag = `${dockerRegistryDomain}/wire/account${suffix}:${buildCounter}-${
  pkg.version
}-${commitShortSha}-${configVersion}${stage}`;

child.execSync(
  `echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin ${dockerRegistryDomain}`,
  {stdio: 'inherit'},
);
child.execSync(
  `docker build . -t ${dockerImageTag} &&
  docker push ${dockerImageTag} &&
  docker logout ${dockerRegistryDomain}`,
  {stdio: 'inherit'},
);
