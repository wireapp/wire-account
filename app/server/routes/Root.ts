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
import {DeleteController} from '../controller/DeleteController';
import {ForgotController} from '../controller/ForgotController';
import {ResetController} from '../controller/ResetController';
import {RootController} from '../controller/RootController';
import {VerifyController} from '../controller/VerifyController';

const Root = (config: ServerConfig) => {
  const forgotController = new ForgotController(config);
  const verifyController = new VerifyController(config);
  const rootController = new RootController(config);
  const deleteController = new DeleteController();
  const resetController = new ResetController();
  return [
    Router().get('/', rootController.handleGet),
    Router().get('/delete', deleteController.handleGet),
    Router().get('/forgot', forgotController.handleGet),
    Router().post('/forgot', forgotController.handlePost),
    Router().get('/reset', resetController.handleGet),
    Router().get('/verify', verifyController.handleEmailGet),
    Router().get('/verify/bot', verifyController.handleBotGet),
    Router().get('/v/:code', verifyController.handlePhoneGet),
  ];
}

export default Root;
