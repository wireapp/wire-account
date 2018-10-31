import {Request, Response, Router} from "express";
import {ServerConfig} from "../config";
import * as BrowserUtil from '../util/BrowserUtil';

export class RootController {

  public static readonly ROUTE_INDEX = '/';

  private static readonly TEMPLATE_INDEX = 'index';
  private static readonly TEMPLATE_OPEN_GRAPH = 'og';


  constructor(private readonly config: ServerConfig) {}

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
      // TODO track piwik event
      // util.track_event_to_piwik('get.wire.com', 'redirect', label, 1)
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
