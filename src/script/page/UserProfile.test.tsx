/*
 * Wire
 * Copyright (C) 2021 Wire Swiss GmbH
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

import '../util/test/mock/matchMediaMock';

import * as History from 'history';
import {UserProfileProps, UserProfile} from './UserProfile';
import TestPage from '../util/test/TestPage';
import {ActionProvider, actionRoot} from '../module/action';
import {RecursivePartial} from '@wireapp/commons/src/main/util/TypeUtil';
import {Runtime} from '@wireapp/commons';

jest.mock('script/util/SVGProvider', () => {
  return {logo: undefined};
});

class UserProfilePage extends TestPage<UserProfileProps> {
  constructor(props?: UserProfileProps, root?: RecursivePartial<typeof actionRoot>) {
    super(
      () => (
        <ActionProvider contextData={root as typeof actionRoot}>
          <UserProfile {...props} />
        </ActionProvider>
      ),
      props,
    );
  }

  getOpenApp = () => this.get('a[data-uie-name="open-user-profile-app"]');
  getOpenWebapp = () => this.get('a[data-uie-name="open-user-profile-webapp"]');
  getDirectDownload = () => this.get('a[data-uie-name="go-direct-download"]');
  getWebsiteDownload = () => this.get('a[data-uie-name="go-website-download"]');
}

describe('UserProfile', () => {
  describe('on mobile', () => {
    it('shows open app & direct download', async () => {
      jest.spyOn(Runtime, 'isMobileOS').mockReturnValue(true);

      const conversationJoinPage = new UserProfilePage(
        {
          history: undefined,
          location: History.createLocation('/user-profile'),
          match: undefined,
        },
        {},
      );

      expect(conversationJoinPage.getOpenApp().exists()).toBe(true);
      expect(conversationJoinPage.getOpenWebapp().exists()).toBe(false);
      expect(conversationJoinPage.getOpenApp().exists()).toBe(true);
      expect(conversationJoinPage.getDirectDownload().exists()).toBe(true);
    });
  });

  describe('on desktop', () => {
    it('shows open app, webapp & direct download on MacOS', async () => {
      jest.spyOn(Runtime, 'isMobileOS').mockReturnValue(false);
      jest.spyOn(Runtime, 'isMacOS').mockReturnValue(true);

      const conversationJoinPage = new UserProfilePage(
        {
          history: undefined,
          location: History.createLocation('/user-profile'),
          match: undefined,
        },
        {},
      );

      expect(conversationJoinPage.getOpenApp().exists()).toBe(true);
      expect(conversationJoinPage.getOpenWebapp().exists()).toBe(true);
      expect(conversationJoinPage.getDirectDownload().exists()).toBe(true);
      expect(conversationJoinPage.getWebsiteDownload().exists()).toBe(false);
    });

    it('shows open app, webapp & website download on non-MacOS', async () => {
      jest.spyOn(Runtime, 'isMobileOS').mockReturnValue(false);
      jest.spyOn(Runtime, 'isMacOS').mockReturnValue(false);

      const conversationJoinPage = new UserProfilePage(
        {
          history: undefined,
          location: History.createLocation('/user-profile'),
          match: undefined,
        },
        {},
      );

      expect(conversationJoinPage.getOpenApp().exists()).toBe(true);
      expect(conversationJoinPage.getOpenWebapp().exists()).toBe(true);
      expect(conversationJoinPage.getDirectDownload().exists()).toBe(false);
      expect(conversationJoinPage.getWebsiteDownload().exists()).toBe(true);
    });
  });
});
