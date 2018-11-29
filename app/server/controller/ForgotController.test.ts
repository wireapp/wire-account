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
import {Request, Response} from 'express';
import {ServerConfig} from '../config';
import {Client} from './Client';
import {ForgotController} from './ForgotController';
import {TrackingController} from './TrackingController';

describe('ForgotController', () => {
  it('successfully POSTs to /password-reset', async () => {
    const postForgotSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
    const config = {
      BACKEND_REST: 'backend',
    };
    const client: any = {
      post: postForgotSpy,
    };
    const controller: any = new ForgotController(config as ServerConfig, client as Client);
    const email: string = 'email';

    await controller['resetPassword'](email);
    expect(postForgotSpy.calls.count()).toBe(1);
    expect(postForgotSpy.calls.mostRecent().args.length).toBe(2);
    expect(postForgotSpy.calls.mostRecent().args[0]).toBe(`${config.BACKEND_REST}/password-reset`);
    expect(postForgotSpy.calls.mostRecent().args[1]).toEqual({email});
  });

  describe('handlePost', () => {
    it('renders the success page if valid email is provided', async () => {
      const renderSpy = jasmine.createSpy();
      const trackingController: any = {
        trackEvent: () => {},
      };
      const config = {};
      const client = {};
      const controller: any = new ForgotController(config as ServerConfig, client as Client);
      controller['trackingController'] = trackingController as TrackingController;

      const req: any = {
        fields: {
          email: 'email@email.com',
        },
        t: (text: string) => text,
      };
      const res: any = {
        render: renderSpy,
      };

      controller['resetPassword'] = (): Promise<AxiosResponse> =>
        Promise.resolve({status: 200}) as Promise<AxiosResponse>;
      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.count()).toBe(1);
      expect(renderSpy.calls.mostRecent().args.length).toBe(2);
      expect(renderSpy.calls.mostRecent().args[0]).toBe(ForgotController['TEMPLATE_FORGOT']);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('success');
    });

    it('renders the error page if invalid email is provided', async () => {
      const renderSpy = jasmine.createSpy();
      const trackingController: any = {
        trackEvent: () => {},
      };
      const config = {};
      const client = {};
      const controller = new ForgotController(config as ServerConfig, client as Client);
      controller['trackingController'] = trackingController as TrackingController;
      const req: any = {
        fields: {
          email: undefined,
        },
        t: (text: string) => text,
      };
      const res: any = {
        render: renderSpy,
      };

      await controller.handlePost(req as Request, res as Response);
      expect(renderSpy.calls.count()).toBe(1);
      expect(renderSpy.calls.mostRecent().args.length).toBe(2);
      expect(renderSpy.calls.mostRecent().args[0]).toBe(ForgotController['TEMPLATE_FORGOT']);
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('forgot.errorInvalidEmail');
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');

      req.fields.email = 'a@a';
      await controller.handlePost(req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('forgot.errorInvalidEmail');

      req.fields.email = ' ';
      await controller.handlePost(req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('forgot.errorInvalidEmail');
    });

    it('renders the error page if backend returns error', async () => {
      const renderSpy = jasmine.createSpy();
      const trackingController: any = {
        trackEvent: () => {},
      };
      const config = {};
      const client = {};
      const controller: any = new ForgotController(config as ServerConfig, client as Client);
      controller['trackingController'] = trackingController as TrackingController;

      const req: any = {
        fields: {
          email: 'email@email.com',
        },
        t: (text: string) => text,
      };
      const res: any = {
        render: renderSpy,
      };

      controller['resetPassword'] = (): Promise<AxiosResponse> =>
        Promise.reject({response: {status: ForgotController['HTTP_STATUS_EMAIL_NOT_IN_USE']}}) as Promise<
          AxiosResponse
        >;
      await controller.handlePost(req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('forgot.errorUnusedEmail');

      controller['resetPassword'] = (): Promise<AxiosResponse> =>
        Promise.reject({response: {status: ForgotController['HTTP_STATUS_EMAIL_ALREADY_SENT']}}) as Promise<
          AxiosResponse
        >;
      await controller.handlePost(req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('forgot.errorAlreadyProcessing');

      controller['resetPassword'] = (): Promise<AxiosResponse> =>
        Promise.reject({response: {status: 9999}}) as Promise<AxiosResponse>;
      await controller.handlePost(req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('forgot.errorUnknown');
    });
  });
});
