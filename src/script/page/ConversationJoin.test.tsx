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

import {ConversationJoin} from './ConversationJoin';
import TestPage from '../util/test/TestPage';
import {ActionProvider, ActionRoot} from '../module/action/';
import {RecursivePartial} from '@wireapp/commons/lib/util/TypeUtil';
import {act} from 'react-dom/test-utils';
import {pathWithParams} from '@wireapp/commons/lib/util/UrlUtil';
import {Runtime} from '@wireapp/commons';
import {AccountAction} from 'script/module/action/AccountAction';

jest.mock('script/util/SVGProvider', () => {
  return {logo: undefined};
});

class ConversationJoinPage extends TestPage {
  constructor(root?: RecursivePartial<AccountAction>) {
    super(() => {
      const mockContext = {
        accountAction: root,
        selfAction: {},
        teamAction: {},
      } as ActionRoot;
      return (
        <ActionProvider contextData={mockContext}>
          <ConversationJoin />
        </ActionProvider>
      );
    });
  }

  getOpenApp = () => this.queryByTestId('do-conversation-join-app');
  getOpenWebapp = () => this.queryByTestId('do-conversation-join-webapp');
  getDirectDownload = () => this.queryByTestId('go-direct-download');
  getWebsiteDownload = () => this.queryByTestId('go-website-download');
}

describe('ConversationJoin', () => {
  it('validates key & code on load', async () => {
    const key = 'key';
    const code = 'code';
    const validateConversationJoinSpy = jest.fn(() => Promise.resolve());

    const path = pathWithParams('/conversation-join', {key, code});
    window.history.pushState({}, 'Test page', path);

    const conversationJoinPage = new ConversationJoinPage({validateConversationJoin: validateConversationJoinSpy});

    await act(async () => expect(validateConversationJoinSpy).toHaveBeenCalledWith(key, code));
    expect(conversationJoinPage.getOpenApp()).toBeDefined();
  });

  describe('on mobile', () => {
    it('shows open app & direct download', async () => {
      jest.spyOn(Runtime, 'isMobileOS').mockReturnValue(true);
      const validateConversationJoinSpy = jest.fn(() => Promise.resolve());

      const path = pathWithParams('/conversation-join', {key: undefined, code: undefined});
      window.history.pushState({}, 'Test page', path);

      const conversationJoinPage = new ConversationJoinPage({
        validateConversationJoin: validateConversationJoinSpy,
      });

      await act(async () => expect(validateConversationJoinSpy).toHaveBeenCalled());

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
      const validateConversationJoinSpy = jest.fn(() => Promise.resolve());

      const path = pathWithParams('/conversation-join', {key: undefined, code: undefined});
      window.history.pushState({}, 'Test page', path);

      const conversationJoinPage = new ConversationJoinPage({
        validateConversationJoin: validateConversationJoinSpy,
      });

      await act(async () => expect(validateConversationJoinSpy).toHaveBeenCalled());

      expect(conversationJoinPage.getOpenApp()).toBeDefined();
      expect(conversationJoinPage.getOpenWebapp()).toBeDefined();
      expect(conversationJoinPage.getDirectDownload()).toBeDefined();
      expect(conversationJoinPage.getWebsiteDownload()).toBeNull();
    });

    it('shows open app, webapp & website download on non-MacOS', async () => {
      jest.spyOn(Runtime, 'isMobileOS').mockReturnValue(false);
      jest.spyOn(Runtime, 'isMacOS').mockReturnValue(false);
      const validateConversationJoinSpy = jest.fn(() => Promise.resolve());

      const path = pathWithParams('/conversation-join', {key: undefined, code: undefined});
      window.history.pushState({}, 'Test page', path);

      const conversationJoinPage = new ConversationJoinPage({
        validateConversationJoin: validateConversationJoinSpy,
      });

      await act(async () => expect(validateConversationJoinSpy).toHaveBeenCalled());

      expect(conversationJoinPage.getOpenApp()).toBeDefined();
      expect(conversationJoinPage.getOpenWebapp()).toBeDefined();
      expect(conversationJoinPage.getDirectDownload()).toBeNull();
      expect(conversationJoinPage.getWebsiteDownload()).toBeDefined();
    });
  });
});
