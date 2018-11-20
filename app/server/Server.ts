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

const autoescape = require('nunjucks-autoescape');
import * as express from 'express';
import * as formidable from 'express-formidable';
import * as helmet from 'helmet';
import * as http from 'http';
import * as i18next from 'i18next';
import * as i18nextMiddleware from 'i18next-express-middleware';
import * as i18nextLoadLocales from 'i18next-node-fs-backend';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import {ServerConfig} from './config';
import {ROUTES} from './controller';
import HealthCheckRoute from './routes/_health/HealthRoute';
import ConfigRoute from './routes/config/ConfigRoute';
import {InternalErrorRoute, NotFoundRoute} from './routes/error/ErrorRoutes';
import Root from './routes/Root';

const STATUS_CODE_MOVED = 301;

class Server {
  private readonly app: express.Express;
  private server?: http.Server;

  constructor(private readonly config: ServerConfig) {
    console.log(JSON.stringify(this.config, null, 2));
    this.app = express();
    this.init();
  }

  private init(): void {
    // The order is important here, please don't sort!
    this.app.use(formidable());
    this.initInternationalization();
    this.initTemplateEngine();
    this.initCaching();
    this.initForceSSL();
    this.initSecurityHeaders();
    this.initStaticRoutes();
    this.app.use(Root(this.config));
    this.app.use(HealthCheckRoute());
    this.app.use(ConfigRoute(this.config));
    this.app.use(NotFoundRoute());
    this.app.use(InternalErrorRoute());
  }

  private initInternationalization() {
    console.log('Initializing internationalization...');
    i18next
      .use(i18nextMiddleware.LanguageDetector)
      .use(i18nextLoadLocales)
      .init({
        backend: {
          jsonIndent: 2,
          loadPath: path.resolve(__dirname, '../locales/{{lng}}/{{ns}}.json'),
        },
        debug: false,
        detection: {
          caches: false,
          lookupQuerystring: 'hl',
          order: ['querystring', 'header'],
        },
        fallbackLng: 'en',
        preload: ['en', 'de'],
      });

    this.app.use(i18nextMiddleware.handle(i18next));
  }


  private initCaching() {
    if (this.config.ENVIRONMENT === 'development') {
      this.app.use(helmet.noCache());
    } else {
      this.app.use((req, res, next) => {
        const milliSeconds = 1000;
        res.header('Cache-Control', `public, max-age=${this.config.CACHE_DURATION_SECONDS}`);
        res.header(
          'Expires',
          new Date(Date.now() + this.config.CACHE_DURATION_SECONDS * milliSeconds).toUTCString()
        );
        next();
      });
    }
  }

  private initForceSSL(): void {
    const SSLMiddleware: express.RequestHandler = (req, res, next) => {
      const shouldEnforceHttps = this.config.FEATURE.ENFORCE_HTTPS && !req.url.match(/_health\/?/);
      const isInsecure = !req.secure || req.get('X-Forwarded-Proto') !== 'https';

      if (isInsecure && shouldEnforceHttps) {
        return res.redirect(STATUS_CODE_MOVED, `https://${req.headers.host}${req.url}`);
      }

      next();
    };

    this.app.enable('trust proxy');
    this.app.use(SSLMiddleware);
  }

  private initSecurityHeaders() {
    this.app.disable('x-powered-by');
    this.app.use(
      helmet({
        frameguard: {action: 'deny'},
      })
    );
    this.app.use(helmet.noSniff());
    this.app.use(helmet.xssFilter());
    this.app.use(
      helmet.hsts({
        includeSubdomains: true,
        maxAge: 31536000,
        preload: true,
      })
    );
    this.app.use(
      helmet.contentSecurityPolicy({
        browserSniff: true,
        directives: this.config.CSP,
        disableAndroid: false,
        loose: this.config.ENVIRONMENT !== 'development',
        reportOnly: false,
        setAllHeaders: false,
      })
    );
    this.app.use(
      helmet.referrerPolicy({
        policy: 'same-origin',
      })
    );
  }

  private initStaticRoutes() {
    this.app.use('/', express.static(path.join(__dirname, 'static')));
  }

  private initTemplateEngine() {
    const env = nunjucks.configure(path.join(__dirname, 'templates'), {
      autoescape: true,
      express: this.app,
    });
    const AutoEscapeExtension = autoescape(nunjucks);
    env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

    this.app.set('view engine', 'html');
    this.app.locals.config = this.config;
    this.app.locals.JSON = JSON;
    this.app.locals.routes = ROUTES;
  }

  start(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        reject('Server is already running.');
      } else if (this.config.PORT_HTTP) {
        this.server = this.app.listen(this.config.PORT_HTTP, () => resolve(this.config.PORT_HTTP));
      } else {
        reject('Server port not specified.');
      }
    });
  }

  async stop(): Promise<void> {
    if (this.server) {
      this.server.close();
      this.server = undefined;
    } else {
      throw new Error('Server is not running.');
    }
  }
}

export default Server;
