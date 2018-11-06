import {ServerConfig} from "../config";
import {Client} from "./Client";
import {ResetController} from "./ResetController";

describe('ResetController', () => {
  it('successfully POSTs to /password-reset', async () => {
    const postResetSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
    const config = {
      BACKEND_REST: 'backend',
    }
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
    expect(postResetSpy.calls.mostRecent().args[0]).toBe(`${config.BACKEND_REST}/password-reset/${key}`);
    expect(postResetSpy.calls.mostRecent().args[1]).toEqual({params: {code, password}});
  });
});
