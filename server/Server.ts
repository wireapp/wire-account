/*
 * Wire
 * Copyright (C) 2019 Wire Swiss GmbH
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

const hbs = require('express-hbs');
import * as express from 'express';
import * as helmet from 'helmet';
import * as nocache from 'nocache';
import * as http from 'http';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

import HealthCheckRoute from './routes/_health/HealthCheckRoute';
import CommitRoute from './routes/commit/CommitRoute';
import ConfigRoute from './routes/config/ConfigRoute';
import DefaultRoute from './routes/error/DefaultRoute';
import ErrorRoute from './routes/error/ErrorRoute';
import GeneratedAppleRoute from './routes/generated/GeneratedAppleRoute';
import SSOStartRoute from './routes/redirect/SSOStartRoute';
import {ServerConfig} from './ServerConfig';

hbs.registerHelper('ifAnd', (v1: any, v2: any, options: any) => (v1 && v2 ? options.fn(this) : options.inverse(this)));

class Server {
  private readonly app: express.Application;
  private server: http.Server;

  constructor(private readonly config: ServerConfig) {
    console.info(this.config);
    this.app = express();
    this.config = {...config};

    if (this.config.SERVER.ENVIRONMENT === 'production' && !this.config.SERVER.APP_BASE.startsWith('https')) {
      throw new Error(`Config variable 'APP_BASE' must be protocol https but is '${this.config.SERVER.APP_BASE}'`);
    }

    this.server = undefined;
    this.init();
  }

  init(): void {
    // The order is important here, please don't sort!
    this.initCaching();
    this.initForceSSL();
    this.initTemplateEngine();
    this.initSecurityHeaders();
    this.initStaticRoutes();
    this.initWebpack();
    this.initProxy();
    this.open();
    this.app.use(HealthCheckRoute);
    this.app.use(ConfigRoute(this.config));
    this.app.use(SSOStartRoute(this.config));
    this.app.use(CommitRoute(this.config));
    this.app.use(GeneratedAppleRoute(this.config));
    this.app.use(DefaultRoute(this.config));
    this.app.use(ErrorRoute(this.config));
  }

  initWebpack(): void {
    if (this.config.SERVER.ENVIRONMENT === 'development') {
      const webpackCompiler = require('webpack')(require('../../webpack.config.dev'));
      const webpackDevMiddleware = require('webpack-dev-middleware');
      const webpackHotMiddleware = require('webpack-hot-middleware');

      this.app.use(webpackDevMiddleware(webpackCompiler));
      this.app.use(webpackHotMiddleware(webpackCompiler));
    }
  }

  initProxy() {
    if (this.config.SERVER.ENVIRONMENT === 'development') {
      const {createProxyMiddleware} = require('http-proxy-middleware');
      this.app.use(
        '/api',
        createProxyMiddleware({
          changeOrigin: true,
          pathRewrite: {
            '^/api': '',
          },
          target: 'https://staging-nginz-https.zinfra.io',
        }),
      );
    }
  }

  open() {
    if (this.config.SERVER.ENVIRONMENT === 'development') {
      require('opn')(this.config.SERVER.APP_BASE);
    }
  }

  initCaching(): void {
    if (this.config.SERVER.ENVIRONMENT === 'test' || this.config.SERVER.ENVIRONMENT === 'development') {
      this.app.use(nocache());
    } else {
      this.app.use((_req, res, next) => {
        res.header('Cache-Control', `public, max-age=${this.config.SERVER.CACHE_DURATION_SECONDS}`);
        const milliSeconds = 1000;
        res.header(
          'Expires',
          new Date(Date.now() + this.config.SERVER.CACHE_DURATION_SECONDS * milliSeconds).toUTCString(),
        );
        next();
      });
    }
  }

  initForceSSL(): void {
    const STATUS_CODE_MOVED = 301;

    const SSLMiddleware: express.RequestHandler = (req, res, next) => {
      // Redirect to HTTPS
      if (!req.secure || req.get('X-Forwarded-Proto') !== 'https') {
        if (
          !this.config.SERVER.ENFORCE_HTTPS ||
          this.config.SERVER.ENVIRONMENT === 'test' ||
          this.config.SERVER.ENVIRONMENT === 'development' ||
          req.url.match(/_health\/?/)
        ) {
          return next();
        }
        return res.redirect(STATUS_CODE_MOVED, `${this.config.SERVER.APP_BASE}${req.url}`);
      }
      next();
    };

    this.app.enable('trust proxy');
    this.app.use(SSLMiddleware);
  }

  initSecurityHeaders(): void {
    this.app.disable('x-powered-by');
    this.app.use(
      helmet({
        frameguard: {action: 'deny'},
      }),
    );
    this.app.use(helmet.noSniff());
    this.app.use(
      helmet.hsts({
        includeSubDomains: true,
        maxAge: 31536000,
        preload: true,
      }),
    );
    this.app.use(
      helmet.contentSecurityPolicy({
        directives: this.config.SERVER.CSP,
        reportOnly: false,
      }),
    );
    this.app.use(
      helmet.referrerPolicy({
        policy: 'same-origin',
      }),
    );
    this.app.use(
      helmet.expectCt({
        maxAge: 0,
      }),
    );
    // With helmet v4 the X-XSS-Protection header is set to `0` by default.
    // After discussing this with @franziskuskiefer we decided to keep this enabled for old browsers.
    // See https://github.com/helmetjs/helmet/issues/230
    this.app.use((_req, res, next) => {
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  initStaticRoutes(): void {
    this.app.get('/favicon.ico', (_req, res) => res.sendFile(path.join(__dirname, 'img', 'favicon.ico')));
    this.app.get('/robots.txt', (_req, res) => res.sendFile(path.join(__dirname, 'robots', 'robots.txt')));
    this.app.use('/script', express.static(path.join(__dirname, 'static', 'script')));
    this.app.use('/libs', express.static(path.join(__dirname, 'libs')));
  }

  initTemplateEngine(): void {
    this.app.engine('hbs', hbs.express4());
    this.app.set('view engine', 'hbs');
    this.app.set('views', path.resolve(__dirname, 'templates'));
  }

  start(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        reject(new Error('Server is already running.'));
      } else if (this.config.SERVER.PORT_HTTP) {
        if (this.config.SERVER.ENVIRONMENT === 'development') {
          const options = {
            cert: fs.readFileSync(this.config.SERVER.SSL_CERTIFICATE_PATH),
            key: fs.readFileSync(this.config.SERVER.SSL_CERTIFICATE_KEY_PATH),
          };
          this.server = https
            .createServer(options, this.app)
            .listen(this.config.SERVER.PORT_HTTP, () => resolve(this.config.SERVER.PORT_HTTP));
        } else {
          this.server = this.app.listen(this.config.SERVER.PORT_HTTP, () => resolve(this.config.SERVER.PORT_HTTP));
        }
      } else {
        reject(new Error('Server port not specified.'));
      }
    });
  }

  stop(): void {
    if (this.server) {
      this.server.close();
      this.server = undefined;
    } else {
      throw new Error('Server is not running.');
    }
  }
}

export default Server;
