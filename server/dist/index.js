"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const Server_1 = require("./Server");
const TimeUtil_1 = require("./util/TimeUtil");
const server = new Server_1.default(config_1.default);
server
    .start()
    .then(port => {
    console.info(`[${TimeUtil_1.formatDate()}] Server is running on port ${port}.`);
    if (config_1.default.SERVER.ENVIRONMENT === 'development') {
        require('opn')(`http://localhost:${config_1.default.SERVER.PORT_HTTP}`);
    }
})
    .catch(error => console.error(`[${TimeUtil_1.formatDate()}] ${error.stack}`));
process.on('uncaughtException', error => console.error(`[${TimeUtil_1.formatDate()}] Uncaught exception: ${error.message}`, error));
process.on('unhandledRejection', error => console.error(`[${TimeUtil_1.formatDate()}] Uncaught rejection "${error.constructor.name}"`, error));
//# sourceMappingURL=index.js.map