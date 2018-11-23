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
import {DeleteController} from '../controller/DeleteAccountController';
import {ForgotController} from '../controller/ForgotController';
import {ResetController} from '../controller/ResetController';
import {RootController} from '../controller/RootController';
import {VerifyController} from '../controller/VerifyAccountController';

const Root = (config: ServerConfig) => {
  const client = new Client();
  return [
    ...new ForgotController(config, client).getRoutes(),
    ...new VerifyController(config, client).getRoutes(),
    ...new RootController(config, client).getRoutes(),
    ...new DeleteController(config, client).getRoutes(),
    ...new ResetController(config, client).getRoutes(),
  ];
}

export default Root;
