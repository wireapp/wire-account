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

export class ForgotController {

  public static readonly ROUTE_FORGOT = '/forgot';
  private static readonly TEMPLATE_PATH = 'account/forgot';

  constructor(private readonly config: ServerConfig) {}

  public getRoutes = () => {
    return [
      Router().get(ForgotController.ROUTE_FORGOT, this.handleGet),
      Router().post(ForgotController.ROUTE_FORGOT, this.handlePost),
    ];
  };

  private readonly postPasswordReset = async (email: string) => {
    return Axios.post(`${this.config.BACKEND_REST}/password-reset`, {params: {email}});
  };

  private readonly handleGet = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    const payload = {
      html_class: 'account forgot',
      status: req.query.success ? 'success' : 'error',
      title: _('Change Password'),
    };
    return res.render(ForgotController.TEMPLATE_PATH, payload);
  };

  private readonly handlePost = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    let status;
    let error;

    const email = (req.fields.email as string || '').toLowerCase().trim();
    const emailRegex = /[^@]+@[^@]+\.[^@]+/;

    if (!emailRegex.test(email)) {
      error = _('That does not look like an email.');
      status = 'error';
    } else {
      try {
        await this.postPasswordReset(email);
        // TODO Track piwik
        // util.track_event_to_piwik('account.forgot', 'success' if result.status_code < 300 else 'fail', result.status_code, 1)
        status = 'success';
      } catch (requestError) {
        switch (requestError.response.data.code) {
          case 400: {
            error = _('This email is not in use.');
            status = 'error';
            break;
          }
          case 409: {
            error = _('We already sent you an email. The link is valid for 10 minutes.');
            status = 'error';
            break;
          }
          default: {
            error = _('Something went wrong, please try again.');
            status = 'error';
          }
        }
      }
    }

    const payload = {
      error,
      html_class: 'account forgot',
      status: req.query.success ? 'success' : status,
      title: _('Change Password'),
    };
    return res.render(ForgotController.TEMPLATE_PATH, payload);
  }
};
