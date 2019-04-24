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

import {AxiosResponse} from 'axios';
import {ServerConfig} from '../config';
import {Client} from './Client';
import {ResetController} from './ResetController';
import {TrackingController} from './TrackingController';

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

  describe('handlePost', () => {
    it('renders password already used error message when resetting to previous password', async () => {
      const renderSpy = jasmine.createSpy();
      const trackingController: any = {
        trackEvent: () => {},
      };
      const config = {};
      const client = {};
      const controller: any = new ResetController(config as ServerConfig, client as Client);
      controller['trackingController'] = trackingController as TrackingController;

      const req: any = {
        fields: {
          code: 'code',
          key: 'key',
          password: 'Aa1_Aa1_',
        },
        t: (text: string) => text,
      };
      const res: any = {
        render: renderSpy,
      };

      const errorResponse: any = new Error('Previous password');
      errorResponse.response = {
        data: {
          code: 409,
          label: 'password-must-differ',
          message: 'For password reset, new and old password must be different.',
        },
        status: 409,
      };
      controller['postPasswordReset'] = (): Promise<AxiosResponse> =>
        Promise.reject(errorResponse) as Promise<AxiosResponse>;

      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.count()).toBe(1);
      expect(renderSpy.calls.mostRecent().args.length).toBe(2);
      expect(renderSpy.calls.mostRecent().args[0]).toBe(ResetController['TEMPLATE_RESET']);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('reset.errorPasswordAlreadyUsed');
    });

    it('renders invalid password error message', async () => {
      const trackingController: any = {
        trackEvent: () => {},
      };
      const config = {};
      const client = {};
      const controller: any = new ResetController(config as ServerConfig, client as Client);
      controller['trackingController'] = trackingController as TrackingController;

      // Password missing capital, special char and number
      let renderSpy = jasmine.createSpy();
      let res: any = {
        render: renderSpy,
      };
      let req: any = {
        fields: {
          code: 'code',
          key: 'key',
          password: 'password',
        },
        t: (text: string) => text,
      };

      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.count()).toBe(1);
      expect(renderSpy.calls.mostRecent().args.length).toBe(2);
      expect(renderSpy.calls.mostRecent().args[0]).toBe(ResetController['TEMPLATE_RESET']);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('reset.passwordInfo');

      // Password too short
      renderSpy = jasmine.createSpy();
      res = {
        render: renderSpy,
      };
      req = {
        fields: {
          code: 'code',
          key: 'key',
          password: 'Aa1_',
        },
        t: (text: string) => text,
      };

      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.count()).toBe(1);
      expect(renderSpy.calls.mostRecent().args.length).toBe(2);
      expect(renderSpy.calls.mostRecent().args[0]).toBe(ResetController['TEMPLATE_RESET']);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('reset.passwordInfo');

      // Password too long
      renderSpy = jasmine.createSpy();
      res = {
        render: renderSpy,
      };
      req = {
        fields: {
          code: 'code',
          key: 'key',
          password:
            'Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_Aa1_',
        },
        t: (text: string) => text,
      };

      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.count()).toBe(1);
      expect(renderSpy.calls.mostRecent().args.length).toBe(2);
      expect(renderSpy.calls.mostRecent().args[0]).toBe(ResetController['TEMPLATE_RESET']);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('reset.passwordInfo');
    });
  });
});
