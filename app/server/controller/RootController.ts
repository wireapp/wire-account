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
import {ROUTES} from '../routes/Root';
import * as BrowserUtil from '../util/BrowserUtil';
import {Client} from './Client';
import {TrackingController} from './TrackingController';

export class RootController {
  private static readonly TEMPLATE_INDEX = 'index';
  private static readonly TEMPLATE_OPEN_GRAPH = 'og';

  private trackingController: TrackingController;

  constructor(private readonly config: ServerConfig, client: Client) {
    this.trackingController = new TrackingController(config, client);
  }

  public get ROUTES(): Router[] {
    return [Router().get(ROUTES.ROUTE_INDEX, this.handleGet)];
  }

  public readonly handleGet = async (req: Request, res: Response) => {
    const _ = (req as any)['t'] as Function;
    const userAgent = req.header('User-Agent');
    const parsedUserAgent = BrowserUtil.parseUserAgent(userAgent);
    const defaultRedirect = `${this.config.URL.WEBSITE_BASE}${req.originalUrl}`;
    const payload: any = {
      _,
      redirect: defaultRedirect,
    };

    const hasRequestedGetWire = req.hostname.includes('get.wire.com') || req.hostname.includes('get.zinfra.io');
    if (hasRequestedGetWire) {
      payload.label = 'desktop';
      payload.redirect = `${this.config.URL.WEBSITE_BASE}/download`;
      if (parsedUserAgent.is.android) {
        payload.redirect = this.config.URL.DOWNLOAD_ANDROID_BASE;
        payload.label = 'android';
      }
      if (parsedUserAgent.is.ios) {
        payload.redirect = this.config.URL.DOWNLOAD_IOS_BASE;
        payload.label = 'ios';
      }
      this.trackingController.trackEvent(req.originalUrl, 'get.wire.com', 'redirect', payload.label, 1);
    }

    if (parsedUserAgent.is.crawler) {
      const openGraphPayload = {
        _,
        description: _('index.description'),
        html_class: 'index',
        redirect: payload.redirect,
        title: `${this.config.COMPANY_NAME} · ${_('index.title')}`,
      };
      return res.render(RootController.TEMPLATE_OPEN_GRAPH, openGraphPayload);
    }

    return this.config.ENVIRONMENT === 'development'
      ? res.render(RootController.TEMPLATE_INDEX, payload)
      : res.redirect(payload.redirect);
  };
}
