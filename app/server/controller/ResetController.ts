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

import {ValidationUtil} from '@wireapp/commons';
import {Request, Response, Router} from 'express';
import {ServerConfig} from '../config';
import {ROUTES} from '../routes/Root';
import * as BrowserUtil from '../util/BrowserUtil';
import {Client} from './Client';
import {TrackingController} from './TrackingController';

export class ResetController {
  private static readonly TEMPLATE_RESET = 'account/reset';

  private trackingController: TrackingController;

  constructor(private readonly config: ServerConfig, private readonly client: Client) {
    this.trackingController = new TrackingController(config, client);
  }

  public get ROUTES(): Router[] {
    return [Router().get(ROUTES.ROUTE_RESET, this.handleGet), Router().post(ROUTES.ROUTE_RESET, this.handlePost)];
  }

  private readonly postPasswordReset = async (key: string, code: string, password: string) => {
    return this.client.post(`${this.config.BACKEND_REST}/password-reset/complete`, {password, key, code});
  };

  public readonly handleGet = async (req: Request, res: Response) => {
    const _ = (req as any)['t'] as Function;
    let status = 'error';
    const error: any = undefined;
    const key = req.query.key;
    const code = req.query.code;

    if (key && code) {
      status = 'init';
    }

    const payload = {
      _,
      code,
      error,
      html_class: 'account forgot',
      key,
      passwordInfo: _('reset.passwordInfo', {minPasswordLength: this.config.NEW_PASSWORD_MINIMUM_LENGTH}),
      status: req.query.success === '' ? 'success' : status,
      title: _('forgot.title'),
      user_agent: () => BrowserUtil.parseUserAgent(req.header('User-Agent')),
    };
    return res.render(ResetController.TEMPLATE_RESET, payload);
  };

  public readonly handlePost = async (req: Request, res: Response) => {
    const _ = (req as any)['t'] as Function;
    let status = 'error';
    let error = '';

    const code = req.fields.code as string;
    const key = req.fields.key as string;
    const password = req.fields.password as string;
    const passwordCheck = new RegExp(
      ValidationUtil.getNewPasswordPattern(this.config.NEW_PASSWORD_MINIMUM_LENGTH),
      'u',
    );
    if (!passwordCheck.test(password)) {
      error = _('reset.passwordInfo', {minPasswordLength: this.config.NEW_PASSWORD_MINIMUM_LENGTH});
      status = 'fail';
    } else if (key && code) {
      try {
        const result = await this.postPasswordReset(key, code, password);
        this.trackingController.trackEvent(req.originalUrl, 'account.reset', 'success', result.status, 1);
        status = 'success';
      } catch (requestError) {
        this.trackingController.trackEvent(req.originalUrl, 'account.reset', 'fail', requestError.status, 1);
        switch (requestError.status) {
          case 400: {
            status = 'error';
            break;
          }
          default: {
            error = _('reset.errorUnknown');
            status = 'fail';
          }
        }
      }
    }

    const payload = {
      _,
      code,
      error,
      html_class: 'account reset',
      key,
      status,
      title: _('reset.title'),
      user_agent: () => BrowserUtil.parseUserAgent(req.header('User-Agent')),
    };
    return res.render(ResetController.TEMPLATE_RESET, payload);
  };
}
