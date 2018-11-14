import {ServerConfig} from "../config";
import {Client} from "./Client";
import {ForgotController} from "./ForgotController";

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
});
