const appConfigPkg = require('./app-config/package.json');
const pkg = require('./package.json');
const {execSync} = require('child_process');
const path = require('path');

const source = path.join(pkg.name, 'content');
const currentBranch = execSync(`git rev-parse --abbrev-ref HEAD`)
  .toString()
  .trim();
const suffix =
  process.env.DISTRIBUTION !== 'wire' ? process.env.DISTRIBUTION : currentBranch === 'master' ? 'master' : 'staging';
const configurationEntry = `wire-web-config-default-${suffix}`;
const repositoryUrl = appConfigPkg.dependencies[configurationEntry];

module.exports = {
  files: {
    [`${source}/image/**`]: './dist/templates/image/',
    [`${source}/translation/**`]: './dist/translation/',
    [path.join(pkg.name, '.env.defaults')]: path.join(__dirname, '.env.defaults'),
  },
  repositoryUrl,
};
