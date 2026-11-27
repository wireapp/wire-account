## Overview

Version 2.11.3 covers everything merged since the 2.11.2 GA (2026-11-13). It is a **patch release** with one user-facing fix and a new release pipeline. The structured release declaration of this version is [`declaration.json`](declaration.json).

### Release Stats

- **0 Features**: patch release
- **1 Bug Fix**: Delete account button
- **Maintenance**: dependencies refreshed, release and dev build pipelines moved to the shared actions

---

## Bug Fixes & Improvements

- [WPB-23643](https://wearezeta.atlassian.net/browse/WPB-23643): The Delete account button no longer looks disabled while it is active [`d698a99b`](https://github.com/wireapp/wire-account/commit/d698a99b)

## Maintenance

- Dependencies refreshed within their current major versions
- Release pipeline: release files in `publication/`, validated on every pull request that touches them
- Dev images and charts are built on the `dev` branch with the shared actions

## Configuration

No configuration change.
