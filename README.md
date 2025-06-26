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

1. Run `yarn`
1. Run `yarn start`
1. Open [http://localhost:8081/](http://localhost:8081/)

If you would like your browser to trust the certificate from "local.zinfra.io":

1. Download [mkcert](https://github.com/FiloSottile/mkcert/releases/latest)
2. Set the `CAROOT` environment variable to `<TM App Dir>/server/certificate`
3. Run `mkcert -install`

## Deployment

Depending on the branch name it will be automatically deployed to the following environments:

- `staging` -> `wire-account-staging-node22`

### Translations

1. Verify you have a "keys/crowdin.yaml" in place with "api_key" and "api_token" in it
1. Add string variable and text to "i18n/en-US.json"
1. Run `yarn translate:upload`
1. Verify your string shows up on [Crowdin project: wire-account](https://crowdin.com/translate/wire-account/all/en-en)
1. Add translation on Crowdin
1. Approve translation on Crowdin
1. Run `yarn translate:download`

### Release flow

1. Merge `staging` branch into `main` branch
1. Create a tag with `npm version <version bump type>`. Possible values for `version bump type` are `patch`, `minor` or `major`.
1. The tag will be pushed to `main` and the CI will deploy the new version. Manual deployment can be triggered via `eb deploy`.
