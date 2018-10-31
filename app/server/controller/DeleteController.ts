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

import Axios from "axios";
import {Request, Response, Router} from "express";
import {ServerConfig} from "../config";

export class DeleteController {

  public static readonly ROUTE_DELETE = '/d';

  private static readonly TEMPLATE_DELETE = 'account/delete';

  constructor(private readonly config: ServerConfig) {}

  public getRoutes = () => {
    return [
      Router().get(DeleteController.ROUTE_DELETE, this.handleGet),
      Router().post(DeleteController.ROUTE_DELETE, this.handlePost),
    ];
  };

  private readonly postAccountDelete = async (key: string, code: string) => {
    return Axios.post(`${this.config.BACKEND_REST}/delete`, {params: {key, code}})
  };

  private readonly handleGet = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    let status = 'error';

    const key = req.query.key;
    const code = req.query.code;

    if (key && code) {
      status = 'init';
    }

    const payload = {
      code,
      html_class: 'account delete',
      key,
      status: status,
      title: _('Delete Account'),
    };
    return res.render(DeleteController.TEMPLATE_DELETE, payload);
  };

  private readonly handlePost = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    let status = 'error';

    const code = req.fields.code as string;
    const key = req.fields.key as string;

    if (key && code){
      try {
        await this.postAccountDelete(key, code);
        // TODO track piwik
        // util.track_event_to_piwik('account.delete', 'success' if result.status_code < 300 else 'fail', result.status_code, 1)
        status = 'success';
      } catch (requestError) {
        status = 'error';
      }
    }

    const payload = {
      code,
      html_class: 'account delete',
      key,
      status,
      title: _('Delete Account'),
    };
    return res.render(DeleteController.TEMPLATE_DELETE, payload)
  }
};
