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
import {DeleteController} from '../controller/DeleteController';
import {ForgotController} from '../controller/ForgotController';
import {ResetController} from '../controller/ResetController';
import {RootController} from '../controller/RootController';
import {VerifyController} from '../controller/VerifyController';

const Root = (config: ServerConfig) => {
  return [
    ...new ForgotController(config).getRoutes(),
    ...new VerifyController(config).getRoutes(),
    ...new RootController(config).getRoutes(),
    ...new DeleteController(config).getRoutes(),
    ...new ResetController(config).getRoutes(),
  ];
}

export default Root;
