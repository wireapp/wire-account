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

import {Router} from 'express';
import {ServerConfig} from '../config';
import * as BrowserUtil from '../util/BrowserUtil';

const Root = (config: ServerConfig) => [
  Router().get('/', (req, res) => {
    const _ = req.app.locals._;
    const userAgent = req.header('User-Agent');
    const parsedUserAgent = BrowserUtil.parseUserAgent(userAgent);
    const defaultRedirect = `${config.URL.WEBSITE_BASE}${req.originalUrl}`;
    const payload: {redirect: string, label?: string} = {
      redirect: defaultRedirect,
    };

    const hasRequestedGetWire = req.hostname.includes('get.wire.com') || req.hostname.includes('get.zinfra.io');
    if (hasRequestedGetWire) {
      payload.label = 'desktop';
      payload.redirect = `${config.URL.WEBSITE_BASE}/download`;
      if (parsedUserAgent.is.android) {
        payload.redirect = config.URL.DOWNLOAD_ANDROID_BASE;
        payload.label = 'android'
      }
      if (parsedUserAgent.is.ios) {
        payload.redirect = config.URL.DOWNLOAD_IOS_BASE;
        payload.label = 'ios'
      }
      // TODO track piwik event
      // util.track_event_to_piwik('get.wire.com', 'redirect', label, 1)
    }

    if (parsedUserAgent.is.crawler) {
      const openGraphPayload = {
        title: `Wire · ${_('The most secure collaboration platform')}`,
        description: _('Business chats, one-click conference calls and shared documents – all protected with end-to-end encryption. Also available for personal use.'),
        html_class: 'index',
        redirect: payload.redirect,
      };
      return res.render('og', openGraphPayload);
    }

    return config.DEVELOPMENT ? res.render('index', payload) : res.redirect(payload.redirect);
  }),
  Router().get('/delete', (req, res) => res.render('account/delete')),
  Router().get('/forgot', (req, res) => res.render('account/forgot')),
  Router().get('/reset', (req, res) => res.render('account/reset')),
  Router().get('/verify_bot', (req, res) => res.render('account/verify_bot')),
  Router().get('/verify_email', (req, res) => res.render('account/verify_email')),
  Router().get('/verify_phone', (req, res) => res.render('account/verify_phone')),
];

export default Root;
