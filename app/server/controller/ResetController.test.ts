/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
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

import {ServerConfig} from '../config';
import {Client} from './Client';
import {ResetController} from './ResetController';

describe('ResetController', () => {
  it('successfully POSTs to /password-reset/complete', async () => {
    const postResetSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
    const config = {
      BACKEND_REST: 'backend',
    };
    const client: any = {
      post: postResetSpy,
    };
    const controller = new ResetController(config as ServerConfig, client as Client);
    const key: string = 'key';
    const code: string = 'code';
    const password: string = 'password';

    await controller['postPasswordReset'](key, code, password);
    expect(postResetSpy.calls.count()).toBe(1);
    expect(postResetSpy.calls.mostRecent().args.length).toBe(2);
    expect(postResetSpy.calls.mostRecent().args[0]).toBe(`${config.BACKEND_REST}/password-reset/complete`);
    expect(postResetSpy.calls.mostRecent().args[1]).toEqual({code, key, password});
  });
});
