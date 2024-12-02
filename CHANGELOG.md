#### 2.5.0 (2024-11-07)

##### Continuous Integration

- production releases go to 'main' in wire-builds ([1066104b](https://github.com/wireapp/wire-account/commit/1066104be7acccc1fe58b896a99a41c869abaf89))

##### New Features

- **user-migration:** add pages to migrate privat to team user [WPB-1… ([#5058](https://github.com/wireapp/wire-account/pull/5058)) ([80870f1c](https://github.com/wireapp/wire-account/commit/80870f1c553ea537be9f2b2d293ad97fb1dcd610))
- remove phone signup [WPB-4387] ([#4858](https://github.com/wireapp/wire-account/pull/4858)) ([b6ff7ade](https://github.com/wireapp/wire-account/commit/b6ff7ade81417a0a472a6665e04bad8a8a59a83e))
- add done button and enhance design for reset password flow (WPB-3157) ([#4379](https://github.com/wireapp/wire-account/pull/4379)) ([c25bb75d](https://github.com/wireapp/wire-account/commit/c25bb75d5a3c9fa1a2f663593300d3eaa6b379f0))
- Join federated conversation page UI updates ([#4365](https://github.com/wireapp/wire-account/pull/4365)) ([e4c30128](https://github.com/wireapp/wire-account/commit/e4c301284dff3f091053c3fd22701937ca71eb88))
- add manual deploy pipeline to prepare for aws migration ([#4145](https://github.com/wireapp/wire-account/pull/4145)) ([a8bb9764](https://github.com/wireapp/wire-account/commit/a8bb9764bc28552b6ea2a46ae9348dabac90b440))
- upgrade yarn ([#4142](https://github.com/wireapp/wire-account/pull/4142)) ([cc603942](https://github.com/wireapp/wire-account/commit/cc603942a7f2a895f5576604398943e70efa0cb9))

##### Bug Fixes

- translation fix for migration pages ([#5080](https://github.com/wireapp/wire-account/pull/5080)) ([58d17982](https://github.com/wireapp/wire-account/commit/58d17982abbef611f266e06eb3d91e8f6473734a))
- updated team-code param as per BE request ([#5079](https://github.com/wireapp/wire-account/pull/5079)) ([a321cc3b](https://github.com/wireapp/wire-account/commit/a321cc3b2bb448b3aa4f5d146addeb64f550921a))
- updated DE translation for reset password [WPB-10981] ([cd03b6a6](https://github.com/wireapp/wire-account/commit/cd03b6a6156ce3d3135c84389b5a12c7acd3bb0f))
- don't expose email already in use [WPB-9752] ([#4817](https://github.com/wireapp/wire-account/pull/4817)) ([1f2f4d80](https://github.com/wireapp/wire-account/commit/1f2f4d803c3b993deea18439563f5d44a12e76d5))
- Do not show conversation location for public wire ([#4428](https://github.com/wireapp/wire-account/pull/4428)) ([7815a6ee](https://github.com/wireapp/wire-account/commit/7815a6ee9054f3e2b6f9f4b56bb192dd647c8dea))
- copy typo ([04b8d3fe](https://github.com/wireapp/wire-account/commit/04b8d3fed856cae3c6436e7dd4378e6fd61b68de))
- Improve conversation join page copies ([#4426](https://github.com/wireapp/wire-account/pull/4426)) ([df9ff572](https://github.com/wireapp/wire-account/commit/df9ff572d4e1876e50df0c5818fb8b494d4c8d37))
- Remove the join as temporary guest link from conversation join ([#4371](https://github.com/wireapp/wire-account/pull/4371)) ([c4736154](https://github.com/wireapp/wire-account/commit/c47361546190e3268f1e1fd519633746f04f5017))
- broken translation ([aead821f](https://github.com/wireapp/wire-account/commit/aead821fdf6e23e1901d7314346ada7aa182e9e3))
- Use translation key for password forgot form ([#3873](https://github.com/wireapp/wire-account/pull/3873)) ([30807c87](https://github.com/wireapp/wire-account/commit/30807c8745ea29efde08e953764cc1f59bf38e7c))
- **actions:**
  - prevent workflow error when no target environment is available in wire-build - WPB-6801 ([#4797](https://github.com/wireapp/wire-account/pull/4797)) ([327ad9b2](https://github.com/wireapp/wire-account/commit/327ad9b2f0828ba07aa9f64b86d6b3da7837b8a9))
  - prevent command injection ([7a519701](https://github.com/wireapp/wire-account/commit/7a51970139e1b512d8e3d73808942caab258da2f))
- **ci:**
  - issue with pipeline coverage monitor ([2b511be4](https://github.com/wireapp/wire-account/commit/2b511be44ad40e840ea2e3c83240fd11a2b3c5b0))
  - issue with pipeline coverage monitor ([a42f189e](https://github.com/wireapp/wire-account/commit/a42f189e713d159ad6437b7aef5538a05e04d94a))

##### Other Changes

- change node version in ci" ([8289db48](https://github.com/wireapp/wire-account/commit/8289db48c9d4470aac8f2a5005d481730db322cf))
- change node version in dockerfile" ([7f865f29](https://github.com/wireapp/wire-account/commit/7f865f29ed5714203185c34619ddc3a99b9080d4))
- change node version in package.json" ([acf1419b](https://github.com/wireapp/wire-account/commit/acf1419b546bf2a4e3ab26fca7fa89b52a2a53e6))
- update yarn.lock" ([cadce9a7](https://github.com/wireapp/wire-account/commit/cadce9a7b2a8861d509b58f95fd62ed083d44d8e))
- order of babel presets to support react fragments ([#4818](https://github.com/wireapp/wire-account/pull/4818)) ([df94b95c](https://github.com/wireapp/wire-account/commit/df94b95cb6c94aca7df3727a274e4786c3ed179c))
- put css-prop babel preset back ([#4816](https://github.com/wireapp/wire-account/pull/4816)) ([269c4b1a](https://github.com/wireapp/wire-account/commit/269c4b1a171c741cf0f54d66f5d3c97f67c4c518))
- assign a user and group id to containers ([#4620](https://github.com/wireapp/wire-account/pull/4620)) ([ac195138](https://github.com/wireapp/wire-account/commit/ac195138487c968efe6d1da8e9994d27dd263417))
- Bump prettier from 2.8.8 to 3.2.4 in /server" ([#4472](https://github.com/wireapp/wire-account/pull/4472)) ([4586dac8](https://github.com/wireapp/wire-account/commit/4586dac86195d15b53df1ae91beee105e0b86b3b))
- wireapp/wire-account into release/q1-2024 ([f11cc5c9](https://github.com/wireapp/wire-account/commit/f11cc5c9ae1c04ed820567c7110a672a10db36d1))
- wireapp/wire-account into staging ([177973b0](https://github.com/wireapp/wire-account/commit/177973b0c284993c9847b3b91bfc822362b94d79))
- remove extra error message icon (WPB-3157) ([#4391](https://github.com/wireapp/wire-account/pull/4391)) ([1d51fbdc](https://github.com/wireapp/wire-account/commit/1d51fbdcb66ccd09934ec0e708553d8b01106c67))
