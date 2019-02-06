import {Request, Response} from 'express';
import {ServerConfig} from '../config';
import {SSOController} from './SSOController';

describe('SSOController', () => {
  describe('handleGet', () => {
    it('redirects to a custom SSO protocol', done => {
      const config = {
        URL: {
          REDIRECT_START_SSO_BASE: 'wire://start-sso',
        },
      };

      const request = {
        method: 'GET',
        params: {
          code: 'wire-26233198-77f3-4aac-97ad-03de41168ab7',
        },
        url: '/start-sso/wire-26233198-77f3-4aac-97ad-03de41168ab7',
      };

      const response = {
        redirect: (url: string) => {
          expect(url).toBe(`${config.URL.REDIRECT_START_SSO_BASE}/${request.params.code}`);
          done();
        },
      };

      const controller = new SSOController(config as ServerConfig);
      controller.handleGet(request as Request, response as Response);
    });
  });
});
