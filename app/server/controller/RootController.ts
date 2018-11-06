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

import {Request, Response, Router} from "express";
import {ServerConfig} from "../config";
import * as BrowserUtil from '../util/BrowserUtil';
import {Client} from "./Client";
import {TrackingController} from "./TrackingController";

export class RootController {

  public static readonly ROUTE_INDEX = '/';

  private static readonly TEMPLATE_INDEX = 'index';
  private static readonly TEMPLATE_OPEN_GRAPH = 'og';

  private readonly trackingController: TrackingController;

  constructor(private readonly config: ServerConfig, client: Client) {
    this.trackingController = new TrackingController(config, client);
  }

  public getRoutes = () => {
    return [
      Router().get(RootController.ROUTE_INDEX, this.handleGet),
    ];
  };

  private readonly handleGet = async (req: Request, res: Response) => {
    const _ = req.app.locals._;
    const userAgent = req.header('User-Agent');
    const parsedUserAgent = BrowserUtil.parseUserAgent(userAgent);
    const defaultRedirect = `${this.config.URL.WEBSITE_BASE}${req.originalUrl}`;
    const payload: {redirect: string, label?: string} = {
      redirect: defaultRedirect,
    };

    const hasRequestedGetWire = req.hostname.includes('get.wire.com') || req.hostname.includes('get.zinfra.io');
    if (hasRequestedGetWire) {
      payload.label = 'desktop';
      payload.redirect = `${this.config.URL.WEBSITE_BASE}/download`;
      if (parsedUserAgent.is.android) {
        payload.redirect = this.config.URL.DOWNLOAD_ANDROID_BASE;
        payload.label = 'android'
      }
      if (parsedUserAgent.is.ios) {
        payload.redirect = this.config.URL.DOWNLOAD_IOS_BASE;
        payload.label = 'ios'
      }
      this.trackingController.trackEvent(req.originalUrl, 'get.wire.com', 'redirect', payload.label, 1);
    }

    if (parsedUserAgent.is.crawler) {
      const openGraphPayload = {
        description: _('Business chats, one-click conference calls and shared documents – all protected with end-to-end encryption. Also available for personal use.'),
        html_class: 'index',
        redirect: payload.redirect,
        title: `Wire · ${_('The most secure collaboration platform')}`,
      };
      return res.render(RootController.TEMPLATE_OPEN_GRAPH, openGraphPayload);
    }

    return this.config.DEVELOPMENT ? res.render(RootController.TEMPLATE_INDEX, payload) : res.redirect(payload.redirect);
  }
};
