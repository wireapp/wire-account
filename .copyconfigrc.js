const appConfigPkg = require('./app-config/package.json');
const pkg = require('./package.json');
const {execSync} = require('child_process');
const path = require('path');

const source = path.join(pkg.name, 'content');
const currentBranch = execSync(`git rev-parse --abbrev-ref HEAD`)
  .toString()
  .trim();
const isTagged = !!execSync('git tag -l --points-at HEAD')
  .toString()
  .trim();
const configBranchSelection = isTagged || currentBranch === 'master' ? 'master' : 'staging';
const distribution = process.env.DISTRIBUTION !== 'wire' && process.env.DISTRIBUTION;
const suffix = distribution || configBranchSelection;
const configurationEntry = `wire-web-config-default-${suffix}`;
const repositoryUrl = appConfigPkg.dependencies[configurationEntry];

module.exports = {
  files: {
    [`${source}/image/wire.svg`]: './resource/image/logo/logo.svg',
    [`${source}/translation/**`]: './resource/translation/',
    [path.join(pkg.name, '.env.defaults')]: path.join(__dirname, 'server', '.env.defaults'),
  },
  repositoryUrl,
};
