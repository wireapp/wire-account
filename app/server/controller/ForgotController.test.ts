import {AxiosResponse} from "axios";
import {Request, Response} from "express";
import {ServerConfig} from "../config";
import {Client} from "./Client";
import {ForgotController} from "./ForgotController";
import {TrackingController} from "./TrackingController";

describe('ForgotController', () => {
  it('successfully POSTs to /password-reset', async () => {
    const postForgotSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
    const config = {
      BACKEND_REST: 'backend',
    }
    const client: any = {
      post: postForgotSpy,
    };
    const controller = new ForgotController(config as ServerConfig, client as Client);
    const email: string = 'email';

    await controller['postPasswordReset'](email);
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
      const controller = new ForgotController(config as ServerConfig, client as Client);
      controller['trackingController'] = trackingController as TrackingController;

      const req: any = {
        app: {
          locals: {
            _: (text: string) => text
          },
        },
        fields: {
          email: 'email@email.com',
        },
      };
      const res: any = {
        render: renderSpy,
      };

      controller['postPasswordReset'] = (): Promise<AxiosResponse> => Promise.resolve({status: 200}) as Promise<AxiosResponse>;
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
        app: {
          locals: {
            _: (text: string) => text
          },
        },
        fields: {
          email: undefined,
        },
      };
      const res: any = {
        render: renderSpy,
      };

      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.count()).toBe(1);
      expect(renderSpy.calls.mostRecent().args.length).toBe(2);
      expect(renderSpy.calls.mostRecent().args[0]).toBe(ForgotController['TEMPLATE_FORGOT']);
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('That does not look like an email.');
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');

      req.fields.email = 'a@a';
      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('That does not look like an email.');

      req.fields.email = ' ';
      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('That does not look like an email.');
    });

    it('renders the error page if backend returns error', async () => {
      const renderSpy = jasmine.createSpy();
      const trackingController: any = {
        trackEvent: () => {},
      };
      const config = {};
      const client = {};
      const controller = new ForgotController(config as ServerConfig, client as Client);
      controller['trackingController'] = trackingController as TrackingController;

      const req: any = {
        app: {
          locals: {
            _: (text: string) => text
          },
        },
        fields: {
          email: 'email@email.com',
        },
      };
      const res: any = {
        render: renderSpy,
      };

      controller['postPasswordReset'] = (): Promise<AxiosResponse> => Promise.reject({response: {status: ForgotController['HTTP_STATUS_EMAIL_IN_USE']}}) as Promise<AxiosResponse>;
      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('This email is not in use.');

      controller['postPasswordReset'] = (): Promise<AxiosResponse> => Promise.reject({response: {status: ForgotController['HTTP_STATUS_EMAIL_ALREADY_SENT']}}) as Promise<AxiosResponse>;
      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('We already sent you an email. The link is valid for 1 hour.');

      controller['postPasswordReset'] = (): Promise<AxiosResponse> => Promise.reject({response: {status: 9999}}) as Promise<AxiosResponse>;
      await controller['handlePost'](req as Request, res as Response);
      expect(renderSpy.calls.mostRecent().args[1].status).toEqual('error');
      expect(renderSpy.calls.mostRecent().args[1].error).toEqual('Something went wrong, please try again.');
    });
  });
});
