/*
 * Wire
 * Copyright (C) 2020 Wire Swiss GmbH
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

import BotPasswordForgot from './BotPasswordForgot';
import TestPage from '../util/test/TestPage';

jest.mock('script/util/SVGProvider', () => {
  return {logo: undefined};
});

class BotPasswordForgotPage extends TestPage<{}> {
  constructor(props?: {}) {
    super(BotPasswordForgot, props);
  }

  getEmailInput = () => this.get('input[data-uie-name="enter-email"]');
  getResetPasswordButton = () => this.get('button[data-uie-name="do-send-password-reset-email"]');
  getError = () => this.get('span[data-uie-name="error-message"]');

  enterEmail = (email: string) => this.changeValue(this.getEmailInput(), email);

  submitResetEmail = () => this.submit(this.getResetPasswordButton());
}

describe('BotPasswordForgot', () => {
  it('shows error on invalid email', async () => {
    const invalidEmail = 'aaa';
    const botPasswordForgot = new BotPasswordForgotPage();

    expect(botPasswordForgot.getEmailInput().exists()).toBe(true);
    botPasswordForgot.enterEmail(invalidEmail);
    botPasswordForgot.submitResetEmail();

    expect(botPasswordForgot.getError().exists()).toBe(true);
    expect(botPasswordForgot.getError().text()).toEqual('That does not look like an email.');
  });
});
