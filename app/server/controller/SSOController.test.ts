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
