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

import {Request, Response} from 'express';
import {ServerConfig} from '../config';
import {Client} from './Client';
import {DeleteAccountController} from './DeleteAccountController';
import {TrackingController} from './TrackingController';

describe('DeleteController', () => {
  it('successfully POSTs to /delete', async () => {
    const postDeleteSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
    const config = {
      BACKEND_REST: 'backend',
    };
    const client: Object = {
      post: postDeleteSpy,
    };
    const controller = new DeleteAccountController(config as ServerConfig, client as Client);
    const key: string = 'key';
    const code: string = 'code';

    await controller['postAccountDelete'](key, code);
    expect(postDeleteSpy.calls.count()).toBe(1);
    expect(postDeleteSpy.calls.mostRecent().args.length).toBe(2);
    expect(postDeleteSpy.calls.mostRecent().args[0]).toBe(`${config.BACKEND_REST}/delete`);
    expect(postDeleteSpy.calls.mostRecent().args[1]).toEqual({key, code});
  });

  describe('handlePost', () => {
    it('renders the error page if key or code is not provided', async () => {
      const renderSpy = jasmine.createSpy();
      const trackingController: Object = {
        trackEvent: () => {},
      };
      const config = {};
      const client = {};
      const controller = new DeleteAccountController(config as ServerConfig, client as Client);
      controller['trackingController'] = trackingController as TrackingController;
      const req: Object = {
        fields: {
          code: undefined,
          key: undefined,
        },
        t: (text: string) => text,
      };
      const res: Object = {
        render: renderSpy,
      };

      await controller.handlePost(req as Request, res as Response);
      expect(renderSpy.calls.count()).toBe(1);
      expect(renderSpy.calls.mostRecent().args.length).toBe(2);
      expect(renderSpy.calls.mostRecent().args[0]).toBe(DeleteAccountController['TEMPLATE_DELETE']);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
    });
  });
});
