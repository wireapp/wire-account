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
import * as BrowserUtil from '../util/BrowserUtil';

export class ResetController {

  public static readonly ROUTE_RESET = '/reset';

  private static readonly TEMPLATE_RESET = 'account/reset';

  constructor(private readonly config: ServerConfig) {}

  public getRoutes = () => {
    return [
      Router().get(ResetController.ROUTE_RESET, this.handleGet),
      Router().post(ResetController.ROUTE_RESET, this.handlePost),
    ];
  };

  private readonly postPasswordReset = async (key: string, code: string, password: string) => {
    return Axios.post(`${this.config.BACKEND_REST}/password-reset/${key}`, {params: {password, code}})
  };

  private readonly handleGet = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    let status = 'error';

    if (req.query.key && req.query.code) {
      status = 'init';
    }

    const payload = {
      html_class: 'account forgot',
      status: req.query.success ? 'success' : status,
      title: _('Change Password'),
      user_agent: () => BrowserUtil.parseUserAgent(req.header('User-Agent')),
    };
    return res.render(ResetController.TEMPLATE_RESET, payload);
  };

  private readonly handlePost = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    let status = 'error';
    let error = '';

    const code = req.fields.code as string;
    const key = req.fields.key as string;
    const password = req.fields.password as string;

    if (!password || password.length < 8) {
      error = _('Choose a password that is at least 8 characters.')
      status = 'fail'
    } else if (key && code){
      try {
        await this.postPasswordReset(key, code, password);
        // TODO track piwik
        // util.track_event_to_piwik('account.reset', 'success' if result.status_code < 300 else 'fail', result.status_code, 1)
        status = 'success';
      } catch (requestError) {
        switch (requestError.response.data.code) {
          case 400: {
            status = 'error';
            break;
          }
          default: {
            error = _('Something went wrong, please try again.');
            status = 'fail';
          }
        }
      }
    }

    const payload = {
      code,
      error,
      html_class: 'account reset',
      key,
      status: req.query.success ? 'success' : status,
      title: _('Password reset'),
      user_agent: () => BrowserUtil.parseUserAgent(req.header('User-Agent')),
    };
    return res.render(ResetController.TEMPLATE_RESET, payload)
  }
}
