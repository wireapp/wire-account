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
import * as BrowserUtil from '../util/BrowserUtil';
import {Client} from './Client';
import {TrackingController} from './TrackingController';

export class VerifyAccountController {
  public static readonly ROUTE_VERIFY_EMAIL = '/verify';
  public static readonly ROUTE_VERIFY_BOT = '/verify/bot';
  public static readonly ROUTE_VERIFY_PHONE = '/v/:code';

  private static readonly TEMPLATE_VERIFY_EMAIL = 'account/verify_email';
  private static readonly TEMPLATE_VERIFY_BOT = 'account/verify_bot';
  private static readonly TEMPLATE_VERIFY_PHONE = 'account/verify_phone';

  private trackingController: TrackingController;

  constructor(private readonly config: ServerConfig, client: Client) {
    this.trackingController = new TrackingController(config, client);
  }

  public getRoutes = () => {
    return [
      Router().get(VerifyAccountController.ROUTE_VERIFY_EMAIL, this.handleEmailGet),
      Router().get(VerifyAccountController.ROUTE_VERIFY_BOT, this.handleBotGet),
      Router().get(VerifyAccountController.ROUTE_VERIFY_PHONE, this.handlePhoneGet),
    ];
  };

  private readonly handleEmailGet = async (req: Request, res: Response) => {
    const _ = (req as any)['t'] as Function;
    const key = req.query.key;
    const code = req.query.code;
    const payload: any = {
      _,
      credentials: 'true',
      html_class: 'account verify',
      title: _('verify.titleEmail'),
      user_agent: () => BrowserUtil.parseUserAgent(req.header('User-Agent')),
    };

    const userAgent = BrowserUtil.parseUserAgent(req.header('User-Agent'));
    if (userAgent.is.ios || userAgent.is.android) {
      payload.redirect = this.config.URL.REDIRECT_VERIFY_BASE;
    } else if (userAgent.is.desktop && !(userAgent.is.osx || userAgent.is.windows)) {
      payload.redirect = `${this.config.URL.WEBAPP_BASE}/auth/?immediate_login#login`;
    }

    if (key && code) {
      payload.url = `${this.config.BACKEND_REST}/activate?key=${key}&code=${code}`;
      payload.status = 'success';
    } else {
      payload.status = req.query.success === '' ? 'success' : 'error';
      payload.redirect = '';
    }
    return res.render(VerifyAccountController.TEMPLATE_VERIFY_EMAIL, payload);
  };

  private readonly handleBotGet = async (req: Request, res: Response) => {
    const _ = (req as any)['t'] as Function;
    const key = req.query.key;
    const code = req.query.code;
    const payload: any = {
      _,
      credentials: 'false',
      html_class: 'account verify',
      title: _('verify.titleBot'),

      user_agent: () => BrowserUtil.parseUserAgent(req.header('User-Agent')),
    };

    const userAgent = BrowserUtil.parseUserAgent(req.header('User-Agent'));
    if (userAgent.is.ios || userAgent.is.android) {
      payload.redirect = this.config.URL.REDIRECT_VERIFY_BASE;
    } else if (userAgent.is.desktop && !(userAgent.is.osx || userAgent.is.windows)) {
      payload.redirect = this.config.URL.WEBAPP_BASE;
    }

    if (key && code) {
      payload.url = `${this.config.BACKEND_REST}/provider/activate?key=${req.query.key}&code=${req.query.code}`;
      payload.status = 'success';
    } else {
      payload.status = req.query.success === '' ? 'success' : 'error';
      payload.redirect = '';
    }
    return res.render(VerifyAccountController.TEMPLATE_VERIFY_BOT, payload);
  };

  private readonly handlePhoneGet = async (req: Request, res: Response) => {
    this.trackingController.trackEvent(req.originalUrl, 'account.verify-phone', 'success', 200, 1);
    const _ = (req as any)['t'] as Function;
    const payload = {
      _,
      html_class: 'account phone',
      title: _('verify.titlePhone'),
      url: `${this.config.URL.REDIRECT_PHONE_BASE}/${req.params.code}`,
    };
    return res.render(VerifyAccountController.TEMPLATE_VERIFY_PHONE, payload);
  };
}
