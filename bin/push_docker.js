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

/**
 * This script creates a Docker image of "wire-account" and uploads it to:
 * https://quay.io/repository/wire/acount?tab=tags (private repository!)
 *
 * To run this script, you need to have Docker installed (i.e. "Docker Desktop for Mac"). The docker daemon (or Docker for Desktop app) has to be started before running this script. Make sure to set "DOCKER_USERNAME" and "DOCKER_PASSWORD" in your local ".env" file or system environment variables.
 *
 * Note: You must run "yarn bundle:staging" or "yarn bundle:prod" before creating the Docker image, otherwise the compiled JavaScript code (and other assets) won't be part of the bundle.
 *
 * Demo execution:
 * yarn docker '' staging 'fb2f4f47f1e3eab3cd8df62c5cea6441cfb6f279' ./tag.txt
 */

const child = require('child_process');
const appConfigPkg = require('../app-config/package.json');
const pkg = require('../package.json');

/** Either empty (for our own cloud releases) or a suffix (i.e. "ey") for custom deployments */
const distributionParam = process.argv[2];
/** Either "staging" (for internal releases / staging bumps) or "production" (for cloud releases) */
const stageParam = process.argv[3];
/** Commit ID of https://github.com/wireapp/wire-team-settings (i.e. "fb2f4f47f1e3eab3cd8df62c5cea6441cfb6f279") */
const commitSha = process.argv[4];

const versionTagOut =  process.argv[5] || '';

const configurationEntry = `wire-web-config-default-${
  distributionParam ? distributionParam : stageParam === 'production' ? 'main' : 'staging'
}`;
const configVersion = appConfigPkg.dependencies[configurationEntry].split('#')[1];
const dockerRegistryDomain = 'quay.io';
const repository = `${dockerRegistryDomain}/wire/account${distributionParam ? `-${distributionParam}` : ''}`;

const tags = [];
if (stageParam) {
  const stageTag = `${repository}:${stageParam}`;
  console.info(`Pushing stage tag "${stageTag}"`);
  tags.push(stageTag);
}

const commitShaLength = 7;
const commitId = commitSha.substring(0, commitShaLength);
const versionTag = `${pkg.version}-${configVersion}-${commitId}`;
console.info(`Pushing version tag "${versionTag}"`);
tags.push(`${repository}:${versionTag}`);

const dockerCommands = [
  `echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin ${dockerRegistryDomain}`,
  `docker buildx build --platform linux/amd64 . --tag ${commitId}`,
  `if [ "${versionTagOut}" != "" ]; then echo -n "${versionTag}" > "${versionTagOut}"; fi`,
];

tags.forEach(containerImageTagValue => {
  dockerCommands.push(`docker tag ${commitId} ${containerImageTagValue}`);
  dockerCommands.push(`docker push ${containerImageTagValue}`);
});

dockerCommands.push(`docker logout ${dockerRegistryDomain}`);

dockerCommands.forEach(command => {
  child.execSync(command, {stdio: 'inherit'});
});
