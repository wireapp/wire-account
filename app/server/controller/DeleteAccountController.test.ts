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
    const client: any = {
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
      const trackingController: any = {
        trackEvent: () => {},
      };
      const config = {};
      const client = {};
      const controller = new DeleteAccountController(config as ServerConfig, client as Client);
      controller['trackingController'] = trackingController as TrackingController;
      const req: any = {
        fields: {
          code: undefined,
          key: undefined,
        },
        t: (text: string) => text,
      };
      const res: any = {
        render: renderSpy,
      };

      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.count()).toBe(1);
      expect(renderSpy.calls.mostRecent().args.length).toBe(2);
      expect(renderSpy.calls.mostRecent().args[0]).toBe(DeleteAccountController['TEMPLATE_DELETE']);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
    });
  });
});
