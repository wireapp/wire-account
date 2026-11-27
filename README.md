# Wire™

![Wire logo](https://github.com/wireapp/wire/blob/master/assets/logo.png?raw=true)

This repository is part of the source code of Wire. You can find more information at [wire.com](https://wire.com) or by contacting opensource@wire.com.

You can find the published source code at [github.com/wireapp/wire](https://github.com/wireapp/wire).

For licensing information, see the attached LICENSE file and the list of third-party licenses at [wire.com/legal/licenses/](https://wire.com/legal/licenses/).

If you compile the open source software that we make available from time to time to develop your own mobile, desktop or web application, and cause that application to connect to our servers for any purposes, we refer to that resulting application as an “Open Source App”. All Open Source Apps are subject to, and may only be used and/or commercialized in accordance with, the Terms of Use applicable to the Wire Application, which can be found at https://wire.com/legal/#terms. Additionally, if you choose to build an Open Source App, certain restrictions apply, as follows:

a. You agree not to change the way the Open Source App connects and interacts with our servers; b. You agree not to weaken any of the security features of the Open Source App; c. You agree not to use our servers to store data for purposes other than the intended and original functionality of the Open Source App; d. You acknowledge that you are solely responsible for any and all updates to your Open Source App.

For clarity, if you compile the open source software that we make available from time to time to develop your own mobile, desktop or web application, and do not cause that application to connect to our servers for any purposes, then that application will not be deemed an Open Source App and the foregoing will not apply to that application.

No license is granted to the Wire trademark and its associated logos, all of which will continue to be owned exclusively by Wire Swiss GmbH. Any use of the Wire trademark and/or its associated logos is expressly prohibited without the express prior written consent of Wire Swiss GmbH.

## wire-account

> For account verifications and forgotten passwords.

## Build Instructions

Requirements: the Node.js version of [`.nvmrc`](.nvmrc) and Yarn (the version is pinned in `package.json`).

1. Run `yarn`
1. Run `yarn start`
1. Open [http://localhost:8081/](http://localhost:8081/)

If you would like your browser to trust the certificate from "local.zinfra.io":

1. Download [mkcert](https://github.com/FiloSottile/mkcert/releases/latest)
2. Set the `CAROOT` environment variable to `<repository>/server/certificate`
3. Run `mkcert -install`

Before pushing, `yarn lint` and `yarn test` are what the CI runs.

## CI and deployment

| Trigger | Workflow | What it does |
| --- | --- | --- |
| Pull request to `dev` or `release/*` | `PR` | Lint and test. When the PR touches `publication/`, also checks the three publication files. |
| Push to `dev` | `Dev` | Lint, test, build, push the image and the chart as a dev build, declare it to the release managers. Nothing is deployed. |
| Manual | `Prepare release` and `Publish release` | Cut a release, see [Release flow](#release-flow). |
| Manual | `Deploy` | Deploy to an Elastic Beanstalk environment (`wire-account-staging-node22` or `wire-account-prod-node22`). Give `release_version` to deploy the artifacts of a prepared or published release instead of rebuilding from source. Production also needs `confirm_prod`. |

There is no deployment triggered by a branch name any more, and the `main` and `staging` branches are not part of the flow.

## Release flow

A release is cut entirely by CI, from `dev` or from a maintained `release/X.Y` line. The version is **computed** by CI from the latest release, the channel and the bump: it is never typed by hand, there is no `npm version`, no tag to push and no branch to merge. The artifacts are built once, then promoted by digest, never rebuilt.

The full contract (versions, the `publication/` folder, what each step checks, repository settings) is in the release documentation of `wire-rm-actions`: [Releasing a component](https://github.com/wireapp/wire-rm-actions/blob/main/docs/releasing.md).

### 1. Prepare the publication documents

The three files of [`publication/`](publication) are rewritten for every release and reviewed in a pull request to `dev`, like code:

- `release-note.md`: what a reader learns about the version, and what to do before upgrading.
- `declaration.json`: what an operator must know before upgrading to the next GA (changes, migrations, configuration keys, and the support dates on `X.Y.0`).
- `compatibility.yaml`: the APIs the component serves and consumes, and what it depends on.

A GA is refused without the note and the declaration, and this repository requires the three files for a pre-release too.

You can write them by hand, or with the `prepare-release` skill of [wire-onprem-first-decisions](https://github.com/wireapp/wire-onprem-first-decisions/tree/main/resources/shared-skills/prepare-release): it audits the repository, reads the commits since the last GA, writes the files, opens the pull request once you agree, and gives you the command that launches the release. Merge that pull request before the next step.

### 2. Launch the release

Run the `Prepare release` workflow, from the GitHub interface (`Actions` > `Prepare release` > `Run workflow`) or from the command line:

```sh
gh workflow run prepare-release.yml -f source_branch=dev -f type=ga -f bump=patch
```

| Input | Value |
| --- | --- |
| `source_branch` | `dev`, or a maintained `release/X.Y` line. |
| `type` | The channel: `ga`, `alpha`, `beta` or `rc`. |
| `bump` | `patch`, `minor` or `major`. Used only when the latest release is a GA: the next GA, or the first pre-release of the next line. |
| `force` | Bypasses the CI status gate on the source commit. Logged loudly, keep it off. |

CI resolves the source commit, checks that its CI passed, builds the bundle, the image and the chart once, and opens a **draft GitHub Release** carrying them with `release-manifest.json`. It creates no tag, no commit and no branch.

### 3. Validate

1. Open the draft GitHub Release and check the version, the release note and the assets.
2. Approve the `release-publication` environment on the waiting `Publish release` run. Its required reviewers are the only approval.
3. CI then promotes the exact artifacts (image and chart by digest), publishes the draft, which creates the `vX.Y.Z` tag, and declares the release to the release managers.
4. For a release cut from `dev`, the published bundle is deployed to the staging environment, bit for bit. Check the application there.

If the approval expired or the publication stopped half way, run `Publish release` by hand with the `version`: it is idempotent, what is already published and identical is skipped, what conflicts fails.

### 4. GA: deploy to production explicitly

Publishing a release never deploys to production. Once the GA is validated on staging, run the `Deploy` workflow:

- `environment`: `wire-account-prod-node22`
- `release_version`: the GA version, `X.Y.Z`
- `confirm_prod`: `true`

Always give `release_version`: left empty, the workflow builds from the source of the ref instead of deploying the published bundle. A draft candidate cannot be deployed to production.

## Translations

The English source is [`src/i18n/en-US.json`](src/i18n/en-US.json). Translations are managed on [Crowdin](https://crowdin.com/translate/wire-account/all/en-en).

The `Download translations` workflow runs daily: it uploads the sources, downloads the translations that are ready and opens a pull request.

To add a string:

1. Add the string variable and text to `src/i18n/en-US.json`.
1. Merge it to `dev`: the next daily run uploads it to Crowdin.
1. Add and approve the translation on Crowdin.
1. Merge the pull request opened by the next run.

To upload without waiting for the daily run, put a `keys/crowdin.yaml` with `api_key` and `api_token` in place and run `yarn translate:upload`. `yarn translate:download` pulls the translations down locally.
