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

import {ServerConfig} from '../config';
import {Client} from '../controller/Client';
import {DeleteAccountController} from '../controller/DeleteAccountController';
import {ForgotController} from '../controller/ForgotController';
import {ResetController} from '../controller/ResetController';
import {RootController} from '../controller/RootController';
import {SSOController} from '../controller/SSOController';
import {VerifyAccountController} from '../controller/VerifyAccountController';

export const ROUTES = {
  ROUTE_DELETE: '/d',
  ROUTE_FORGOT: '/forgot',
  ROUTE_INDEX: '/',
  ROUTE_RESET: '/reset',
  ROUTE_SSO_START: '/start-sso/:code',
  ROUTE_VERIFY_BOT: '/verify/bot',
  ROUTE_VERIFY_EMAIL: '/verify',
  ROUTE_VERIFY_PHONE: '/v/:code',
};

const Root = (config: ServerConfig) => {
  const client = new Client();

  return [
    ...new DeleteAccountController(config, client).ROUTES,
    ...new ForgotController(config, client).ROUTES,
    ...new ResetController(config, client).ROUTES,
    ...new RootController(config, client).ROUTES,
    ...new SSOController(config).ROUTES,
    ...new VerifyAccountController(config, client).ROUTES,
  ];
};

export default Root;
