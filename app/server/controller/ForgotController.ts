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

import {Request, Response, Router} from 'express';
import {ServerConfig} from '../config';
import {Client} from './Client';
import {TrackingController} from './TrackingController';

export class ForgotController {
  public static readonly ROUTE_FORGOT = '/forgot';
  private static readonly TEMPLATE_FORGOT = 'account/forgot';

  private static readonly HTTP_STATUS_EMAIL_IN_USE = 400;
  private static readonly HTTP_STATUS_EMAIL_ALREADY_SENT = 409;

  private trackingController: TrackingController;

  constructor(private readonly config: ServerConfig, private readonly client: Client) {
    this.trackingController = new TrackingController(config, client);
  }

  public getRoutes = () => {
    return [
      Router().get(ForgotController.ROUTE_FORGOT, this.handleGet),
      Router().post(ForgotController.ROUTE_FORGOT, this.handlePost),
    ];
  };

  private resetPassword = async (email: string) => {
    return this.client.post(`${this.config.BACKEND_REST}/password-reset`, {email});
  };

  private readonly handleGet = async (req: Request, res: Response) => {
    const _ = (req as any)['t'] as Function;
    const error: string = undefined;
    const payload = {
      _,
      error,
      html_class: 'account forgot',
      status: 'init',
      title: _('forgot.title'),
    };
    return res.render(ForgotController.TEMPLATE_FORGOT, payload);
  };

  private readonly handlePost = async (req: Request, res: Response) => {
    const _ = (req as any)['t'] as Function;
    let status;
    let error;

    const email = ((req.fields.email as string) || '').toLowerCase().trim();
    const emailRegex = /[^@]+@[^@]+\.[^@]+/;

    if (!emailRegex.test(email)) {
      error = _('forgot.errorInvalidEmail');
      status = 'error';
    } else {
      try {
        const result = await this.resetPassword(email);
        this.trackingController.trackEvent(req.originalUrl, 'account.forgot', 'success', result.status, 1);
        status = 'success';
      } catch (requestError) {
        this.trackingController.trackEvent(req.originalUrl, 'account.forgot', 'fail', requestError.status, 1);
        switch (requestError.status) {
          case ForgotController.HTTP_STATUS_EMAIL_IN_USE: {
            error = _('forgot.errorUnusedEmail');
            status = 'error';
            break;
          }
          case ForgotController.HTTP_STATUS_EMAIL_ALREADY_SENT: {
            error = _('forgot.errorAlreadyProcessing');
            status = 'error';
            break;
          }
          default: {
            error = _('forgot.errorUnknown');
            status = 'error';
          }
        }
      }
    }

    const payload = {
      _,
      error,
      html_class: 'account forgot',
      status,
      title: _('forgot.title'),
    };
    return res.render(ForgotController.TEMPLATE_FORGOT, payload);
  };
}
