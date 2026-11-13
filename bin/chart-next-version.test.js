/** @jest-environment node */

const {spawnSync} = require('node:child_process');
const {mkdtempSync, writeFileSync, rmSync} = require('node:fs');
const {tmpdir} = require('node:os');
const {join, resolve} = require('node:path');

function runChartVersionSelection({
  releaseType = 'release',
  indexedVersion = '0.8.0',
  archivedVersions = [],
  sourceVersion = '0.0.42',
  storageExitStatus = 0,
}) {
  const commandDirectory = mkdtempSync(join(tmpdir(), 'account-chart-version-'));
  const commandScripts = {
    helm: 'printf "NAME\\tCHART VERSION\\tAPP VERSION\\ncharts-webapp/account-pages\\t%s\\told\\n" "$TEST_INDEXED_VERSION"',
    aws: 'printf "%s\\n" "$TEST_CHART_OBJECT_KEYS"; exit "$TEST_STORAGE_EXIT_STATUS"',
    yq: 'printf "%s\\n" "$TEST_SOURCE_VERSION"',
  };

  try {
    Object.entries(commandScripts).forEach(([commandName, commandScript]) => {
      writeFileSync(join(commandDirectory, commandName), `#!/bin/bash\n${commandScript}\n`, {mode: 0o755});
    });

    return spawnSync('bash', ['bin/chart-next-version.sh', releaseType], {
      cwd: resolve(__dirname, '..'),
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${commandDirectory}:${process.env.PATH}`,
        TEST_INDEXED_VERSION: indexedVersion,
        TEST_CHART_OBJECT_KEYS: archivedVersions
          .map(version => `charts-webapp/account-pages-${version}.tgz`)
          .join('\t'),
        TEST_SOURCE_VERSION: sourceVersion,
        TEST_STORAGE_EXIT_STATUS: String(storageExitStatus),
      },
    });
  } finally {
    rmSync(commandDirectory, {recursive: true, force: true});
  }
}

test.each([
  {
    scenario: 'a stable archive is missing from the index',
    archivedVersions: ['0.9.0', '0.9.0-pre.292'],
    expectedVersion: '0.10.0',
  },
  {
    scenario: 'archive versions require semantic ordering',
    archivedVersions: ['0.9.0', '0.10.0'],
    expectedVersion: '0.11.0',
  },
  {
    scenario: 'the index is newer than the archive listing',
    indexedVersion: '0.10.0',
    archivedVersions: ['0.9.0'],
    expectedVersion: '0.11.0',
  },
  {
    scenario: 'a prerelease archive is missing from the index',
    releaseType: 'prerelease',
    indexedVersion: '0.9.0-pre.291',
    archivedVersions: ['0.9.0-pre.292'],
    expectedVersion: '0.9.0-pre.293',
  },
  {
    scenario: 'a stable archive reserves the next prerelease series',
    releaseType: 'prerelease',
    indexedVersion: '0.9.0-pre.292',
    archivedVersions: ['0.9.0'],
    expectedVersion: '0.10.0-pre.1',
  },
  {
    scenario: 'only prerelease archives are newer than the stable index',
    archivedVersions: ['0.9.0-pre.292'],
    expectedVersion: '0.9.0',
  },
  {
    scenario: 'the source chart requests a newer version',
    sourceVersion: '0.12.0',
    archivedVersions: ['0.9.0'],
    expectedVersion: '0.13.0',
  },
  {
    scenario: 'the archive listing is empty',
    expectedVersion: '0.9.0',
  },
])('selects an unused version when $scenario', ({scenario, expectedVersion, ...versionSelection}) => {
  const actualResult = runChartVersionSelection(versionSelection);

  expect(actualResult.status).toBe(0);
  expect(actualResult.stdout.trim()).toBe(expectedVersion);
});

test('fails without selecting a version when the archive listing fails', () => {
  const actualResult = runChartVersionSelection({storageExitStatus: 1});

  expect(actualResult.status).toBe(1);
  expect(actualResult.stdout).toBe('');
});
