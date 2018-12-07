import * as BrowserUtil from './BrowserUtil';

describe('BrowserUtil', () => {
  it('detects iPhone', () => {
    const userAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1`;
    expect(BrowserUtil.parseUserAgent(userAgent).is.ios).toBe(true);
    expect(BrowserUtil.parseUserAgent(userAgent).is.mobile).toBe(true);
  });
  it('detects iPad', () => {
    const userAgent = `Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1`;
    expect(BrowserUtil.parseUserAgent(userAgent).is.ios).toBe(true);
    expect(BrowserUtil.parseUserAgent(userAgent).is.mobile).toBe(true);
  });
  it('detects Android', () => {
    const userAgent = `Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36`;
    expect(BrowserUtil.parseUserAgent(userAgent).is.android).toBe(true);
    expect(BrowserUtil.parseUserAgent(userAgent).is.mobile).toBe(true);
  });
  it('detects Android tablet', () => {
    const userAgent = `Mozilla/5.0 (Linux; Android 7.1; vivo 1716 Build/N2G47H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.98 Mobile Safari/537.36`;
    expect(BrowserUtil.parseUserAgent(userAgent).is.android).toBe(true);
    expect(BrowserUtil.parseUserAgent(userAgent).is.mobile).toBe(true);
  });
});
