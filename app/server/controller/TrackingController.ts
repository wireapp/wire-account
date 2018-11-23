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
import {Client} from './Client';

export class TrackingController {
  constructor(private readonly config: ServerConfig, private readonly client: Client) {}

  trackEvent = async (originalUrl: string, category: string, action: string, name: any, value: any) => {
    if (this.config.PIWIK_HOSTNAME && this.config.PIWIK_ID) {
      const result = await this.client.post(`${this.config.PIWIK_HOSTNAME}/piwik.php`, {
        data: {
          apiv: 1,
          e_a: action,
          e_c: category,
          e_n: name,
          e_v: value,
          idsite: this.config.PIWIK_ID,
          rand: Math.random(),
          rec: 1,
          url: originalUrl,
        },
      });
      return result.status;
    }
    return 0;
  };
}
