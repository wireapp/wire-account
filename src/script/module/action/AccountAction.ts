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
}
