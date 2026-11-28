# account-pages 2.11.3

One bug fix, a round of dependency updates that closes known vulnerabilities, and the first release cut with the new release pipeline. Nothing to do before upgrading.

- The Delete account button no longer looks disabled while it is active: it now uses the red cancel style.
- Third-party libraries are updated in the web app and in the server, including express, body-parser and handlebars, to close known vulnerabilities.
- Releases are now prepared from the files in `publication/`, built once, published after an approval and declared to the release managers.
- The chart states Kubernetes 1.24 as its minimum version.

---

## Details

### Fixes

- The Delete account button looked disabled while it was active: [#6510](https://github.com/wireapp/wire-account/pull/6510), [`8305fc43`](https://github.com/wireapp/wire-account/commit/8305fc43), [WPB-23643](https://wearezeta.atlassian.net/browse/WPB-23643)

### Security

Dependency updates for known vulnerabilities in third-party packages. The history names no advisory id.

- Critical, high and medium alerts, mostly transitive: [#6591](https://github.com/wireapp/wire-account/pull/6591), [#6592](https://github.com/wireapp/wire-account/pull/6592)
- `socks` and `@babel/core` in the lockfile: [#6595](https://github.com/wireapp/wire-account/pull/6595)
- `simple-git` 4.1.0 and `jsdoc`: [#6596](https://github.com/wireapp/wire-account/pull/6596)

### Changes

- The server's process manager `pm2`, used by `start:prod`, moves from 6 to 7, and express from 4.21 to 4.22: [#6591](https://github.com/wireapp/wire-account/pull/6591)
- The chart is now `apiVersion: v2` and sets `kubeVersion` to `>=1.24.0-0`; its version is set at release time: [`2a2068c5`](https://github.com/wireapp/wire-account/commit/2a2068c5)
- New release pipeline: prepare, approve, publish. The old test environment deployment is removed: [#6582](https://github.com/wireapp/wire-account/pull/6582), [#6581](https://github.com/wireapp/wire-account/pull/6581), [#6599](https://github.com/wireapp/wire-account/pull/6599)
- Dependabot waits 7 days before proposing a release and groups major updates: [#6585](https://github.com/wireapp/wire-account/pull/6585)

### Configuration

No configuration change.

### Migrations

None.
