/*
 * Wire
 * Copyright (C) 2019 Wire Swiss GmbH
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
import {APIClient} from '@wireapp/api-client';
import {LoginData} from '@wireapp/api-client/lib/auth';
import {MIN_MEETINGS_SUPPORTED_API_VERSION} from 'script/Environment';

export class AccountAction {
  private readonly apiClient: APIClient;

  constructor(apiClient: APIClient) {
    this.apiClient = apiClient;
  }

  delete = (key: string, code: string) => {
    return this.apiClient.api.account.postDeleteAccount(key, code);
  };

  initiatePasswordReset = (email: string) => {
    return this.apiClient.api.account.postPasswordReset(email);
  };

  initiateBotPasswordReset = (email: string) => {
    return this.apiClient.api.account.postBotPasswordReset(email);
  };

  completePasswordReset = (password: string, key: string, code: string) => {
    return this.apiClient.api.account.postPasswordResetComplete(password, key, code);
  };

  completeBotPasswordReset = (password: string, key: string, code: string) => {
    return this.apiClient.api.account.postBotPasswordResetComplete(password, key, code);
  };

  verifyEmail = (key: string, code: string) => {
    return this.apiClient.api.account.getVerifyEmail(key, code);
  };

  verifyBot = (key: string, code: string) => {
    return this.apiClient.api.account.getVerifyBot(key, code);
  };

  validateConversationJoin = (key: string, code: string) => {
    return this.apiClient.api.conversation.postConversationCodeCheck({code, key});
  };

  // We are soon going to move wire-account inside webapp
  // then I will update the api-client library and then use it here.
  validateMeetingJoin = async (domain: string, key: string, code: string): Promise<void> => {
    if (this.apiClient.backendFeatures.version < MIN_MEETINGS_SUPPORTED_API_VERSION) {
      throw Object.assign(new Error('Meeting links require API v19 or newer'), {label: 'meeting-api-unsupported'});
    }
    await this.apiClient.transport.http.sendJSON({
      method: 'get',
      url: `/meeting/${encodeURIComponent(domain)}/${encodeURIComponent(key)}/${encodeURIComponent(code)}/code-check`,
    });
  };

  login = (login: LoginData) => {
    return this.apiClient.login(login);
  };

  init = () => {
    return this.apiClient.init();
  };
}
