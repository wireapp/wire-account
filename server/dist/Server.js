"use strict";
/*
 * Wire
 * Copyright (C) 2017 Wire Swiss GmbH
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
Object.defineProperty(exports, "__esModule", { value: true });
const hbs = require('express-hbs');
const express = require("express");
const helmet = require("helmet");
const path = require("path");
const HealthCheckRoute_1 = require("./routes/_health/HealthCheckRoute");
const CommitRoute_1 = require("./routes/commit/CommitRoute");
const ConfigRoute_1 = require("./routes/config/ConfigRoute");
const DefaultRoute_1 = require("./routes/error/DefaultRoute");
const ErrorRoute_1 = require("./routes/error/ErrorRoute");
const GeneratedAppleRoute_1 = require("./routes/generated/GeneratedAppleRoute");
const GeneratedPiwikRoute_1 = require("./routes/generated/GeneratedPiwikRoute");
hbs.registerHelper('ifAnd', (v1, v2, options) => (v1 && v2 ? options.fn(this) : options.inverse(this)));
class Server {
    constructor(config) {
        this.config = config;
        console.log(this.config);
        this.app = express();
        this.config = Object.assign({}, config);
        this.server = undefined;
        this.init();
    }
    init() {
        // The order is important here, please don't sort!
        this.initCaching();
        this.initForceSSL();
        this.initTemplateEngine();
        this.initSecurityHeaders();
        this.initStaticRoutes();
        this.initWebpack();
        this.app.use(HealthCheckRoute_1.default);
        this.app.use(ConfigRoute_1.default(this.config));
        this.app.use(CommitRoute_1.default(this.config));
        this.app.use(GeneratedAppleRoute_1.default(this.config));
        this.app.use(GeneratedPiwikRoute_1.default(this.config));
        this.app.use(DefaultRoute_1.default(this.config));
        this.app.use(ErrorRoute_1.default(this.config));
    }
    initWebpack() {
        if (this.config.SERVER.ENVIRONMENT === 'development') {
            const webpackCompiler = require('webpack')(require('../../webpack.config.dev'));
            const webpackDevMiddleware = require('webpack-dev-middleware');
            const webpackHotMiddleware = require('webpack-hot-middleware');
            this.app.use(webpackDevMiddleware(webpackCompiler));
            this.app.use(webpackHotMiddleware(webpackCompiler));
        }
    }
    initCaching() {
        if (this.config.SERVER.ENVIRONMENT === 'test' || this.config.SERVER.ENVIRONMENT === 'development') {
            this.app.use(helmet.noCache());
        }
        else {
            this.app.use((req, res, next) => {
                res.header('Cache-Control', `public, max-age=${this.config.SERVER.CACHE_DURATION_SECONDS}`);
                const milliSeconds = 1000;
                res.header('Expires', new Date(Date.now() + this.config.SERVER.CACHE_DURATION_SECONDS * milliSeconds).toUTCString());
                next();
            });
        }
    }
    initForceSSL() {
        const STATUS_CODE_MOVED = 301;
        const SSLMiddleware = (req, res, next) => {
            // Redirect to HTTPS
            if (!req.secure || req.get('X-Forwarded-Proto') !== 'https') {
                if (!this.config.SERVER.ENFORCE_HTTPS ||
                    this.config.SERVER.ENVIRONMENT === 'test' ||
                    this.config.SERVER.ENVIRONMENT === 'development' ||
                    req.url.match(/_health\/?/)) {
                    return next();
                }
                return res.redirect(STATUS_CODE_MOVED, `https://${req.headers.host}${req.url}`);
            }
            next();
        };
        this.app.enable('trust proxy');
        this.app.use(SSLMiddleware);
    }
    initSecurityHeaders() {
        this.app.disable('x-powered-by');
        this.app.use(helmet({
            frameguard: { action: 'deny' },
        }));
        this.app.use(helmet.hsts({
            includeSubDomains: true,
            maxAge: 31536000,
            preload: true,
        }));
        this.app.use(helmet.noSniff());
        this.app.use(helmet.xssFilter());
        this.app.use(helmet.contentSecurityPolicy({
            browserSniff: true,
            directives: this.config.SERVER.CSP,
            disableAndroid: false,
            loose: this.config.SERVER.ENVIRONMENT !== 'development',
            reportOnly: false,
            setAllHeaders: false,
        }));
        this.app.use(helmet.referrerPolicy({
            policy: 'same-origin',
        }));
        this.app.use(helmet.expectCt({
            maxAge: 0,
        }));
    }
    initStaticRoutes() {
        this.app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'img', 'favicon.ico')));
        this.app.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, 'robots', 'robots.txt')));
        this.app.use('/script', express.static(path.join(__dirname, 'static', 'script')));
        this.app.use('/style', express.static(path.join(__dirname, 'static', 'style')));
    }
    initTemplateEngine() {
        this.app.engine('hbs', hbs.express4());
        this.app.set('view engine', 'hbs');
        this.app.set('views', path.resolve(__dirname, 'templates'));
    }
    start() {
        return new Promise((resolve, reject) => {
            if (this.server) {
                reject('Server is already running.');
            }
            else if (this.config.SERVER.PORT_HTTP) {
                this.server = this.app.listen(this.config.SERVER.PORT_HTTP, () => resolve(this.config.SERVER.PORT_HTTP));
            }
            else {
                reject('Server port not specified.');
            }
        });
    }
    stop() {
        if (this.server) {
            this.server.close();
            this.server = undefined;
        }
        else {
            throw new Error('Server is not running.');
        }
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map