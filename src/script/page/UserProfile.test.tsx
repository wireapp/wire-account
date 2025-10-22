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

import {UserProfile} from './UserProfile';
import TestPage from '../util/test/TestPage';
import {ActionProvider, ActionRoot} from '../module/action';
import {Runtime} from '@wireapp/commons';
import {pathWithParams} from '@wireapp/commons/lib/util/UrlUtil';

jest.mock('script/util/SVGProvider', () => {
  return {logo: undefined};
});

class UserProfilePage extends TestPage {
  constructor() {
    super(() => {
      const mockContext = {
        accountAction: {},
        selfAction: {},
        teamAction: {},
      } as ActionRoot;
      return (
        <ActionProvider contextData={mockContext}>
          <UserProfile />
        </ActionProvider>
      );
    });
  }

  getOpenApp = () => this.queryByTestId('open-user-profile-app');
  getOpenWebapp = () => this.queryByTestId('open-user-profile-webapp');
  getDirectDownload = () => this.queryByTestId('go-direct-download');
  getWebsiteDownload = () => this.queryByTestId('go-website-download');
}

describe('UserProfile', () => {
  describe('on mobile', () => {
    it('shows open app & direct download', async () => {
      jest.spyOn(Runtime, 'isMobileOS').mockReturnValue(true);

      const path = pathWithParams('/user-profile');
      window.history.pushState({}, 'Test page', path);

      const conversationJoinPage = new UserProfilePage();

      expect(conversationJoinPage.getOpenApp()).toBeDefined();
      expect(conversationJoinPage.getOpenWebapp()).toBeNull();
      expect(conversationJoinPage.getOpenApp()).toBeDefined();
      expect(conversationJoinPage.getDirectDownload()).toBeDefined();
    });
  });

  describe('on desktop', () => {
    it('shows open app, webapp & direct download on MacOS', async () => {
      jest.spyOn(Runtime, 'isMobileOS').mockReturnValue(false);
      jest.spyOn(Runtime, 'isMacOS').mockReturnValue(true);

      const path = pathWithParams('/user-profile');
      window.history.pushState({}, 'Test page', path);

      const conversationJoinPage = new UserProfilePage();

      expect(conversationJoinPage.getOpenApp()).toBeDefined();
      expect(conversationJoinPage.getOpenWebapp()).toBeDefined();
      expect(conversationJoinPage.getDirectDownload()).toBeDefined();
      expect(conversationJoinPage.getWebsiteDownload()).toBeNull();
    });

    it('shows open app, webapp & website download on non-MacOS', async () => {
      jest.spyOn(Runtime, 'isMobileOS').mockReturnValue(false);
      jest.spyOn(Runtime, 'isMacOS').mockReturnValue(false);

      const path = pathWithParams('/user-profile');
      window.history.pushState({}, 'Test page', path);

      const conversationJoinPage = new UserProfilePage();

      expect(conversationJoinPage.getOpenApp()).toBeDefined();
      expect(conversationJoinPage.getOpenWebapp()).toBeDefined();
      expect(conversationJoinPage.getDirectDownload()).toBeNull();
      expect(conversationJoinPage.getWebsiteDownload()).toBeDefined();
    });
  });
});
