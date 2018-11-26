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

import {Router} from 'express';
import {ServerConfig} from '../config';
import {Client} from '../controller/Client';
import {DeleteAccountController} from '../controller/DeleteAccountController';
import {ForgotController} from '../controller/ForgotController';
import {ResetController} from '../controller/ResetController';
import {RootController} from '../controller/RootController';
import {VerifyAccountController} from '../controller/VerifyAccountController';

export const ROUTES = {
  ROUTE_DELETE: '/d',
  ROUTE_FORGOT: '/forgot',
  ROUTE_INDEX: '/',
  ROUTE_RESET: '/reset',
  ROUTE_VERIFY_BOT: '/verify/bot',
  ROUTE_VERIFY_EMAIL: '/verify',
  ROUTE_VERIFY_PHONE: '/v/:code',
};

const Root = (config: ServerConfig) => {
  const client = new Client();
  const forgotController = new ForgotController(config, client);
  const verifyAccountController = new VerifyAccountController(config, client);
  const rootController = new RootController(config, client);
  const deleteAccountController = new DeleteAccountController(config, client);
  const resetController = new ResetController(config, client);
  return [
    Router().get(ROUTES.ROUTE_FORGOT, forgotController.handleGet),
    Router().post(ROUTES.ROUTE_FORGOT, forgotController.handlePost),
    Router().get(ROUTES.ROUTE_VERIFY_EMAIL, verifyAccountController.handleEmailGet),
    Router().get(ROUTES.ROUTE_VERIFY_BOT, verifyAccountController.handleBotGet),
    Router().get(ROUTES.ROUTE_VERIFY_PHONE, verifyAccountController.handlePhoneGet),
    Router().get(ROUTES.ROUTE_INDEX, rootController.handleGet),
    Router().get(ROUTES.ROUTE_DELETE, deleteAccountController.handleGet),
    Router().post(ROUTES.ROUTE_DELETE, deleteAccountController.handlePost),
    Router().get(ROUTES.ROUTE_RESET, resetController.handleGet),
    Router().post(ROUTES.ROUTE_RESET, resetController.handlePost),
  ];
};

export default Root;
