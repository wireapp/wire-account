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

import * as dotenv from 'dotenv-extended';
import * as fs from 'fs-extra';
import {IHelmetContentSecurityPolicyDirectives as HelmetCSP} from 'helmet';
import * as logdown from 'logdown';
import * as path from 'path';

const logger = logdown('config', {
  logger: console,
  markdown: false,
});

const COMMIT_FILE = path.join(__dirname, 'commit');
const ROBOTS_DIR = path.join(__dirname, 'static');
const ROBOTS_ALLOW_FILE = path.join(ROBOTS_DIR, 'robots.txt');
const ROBOTS_DISALLOW_FILE = path.join(ROBOTS_DIR, 'robots-disallow.txt');
const VERSION_FILE = path.join(__dirname, 'version');

function readFile(sourcePath: string, fallback?: string): string {
  try {
    return fs.readFileSync(sourcePath, {encoding: 'utf8', flag: 'r'});
  } catch (error) {
    logger.warn(`Cannot access "${sourcePath}": ${error.message}`);
    return fallback;
  }
}

dotenv.load();

const defaultCSP: HelmetCSP = {
  connectSrc: ["'self'"],
  defaultSrc: ["'self'"],
  fontSrc: ["'self'"],
  frameSrc: ["'self'"],
  imgSrc: ["'self'"],
  manifestSrc: ["'self'"],
  mediaSrc: ["'self'"],
  objectSrc: ["'self'"],
  prefetchSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", 'https://wire.innocraft.cloud'],
  styleSrc: ["'self'"],
  workerSrc: ["'self'"],
};

function parseCommaSeparatedList(list: string = ''): string[] {
  const cleanedList = list.replace(/\s/g, '');
  if (!cleanedList) {
    return [];
  }
  return cleanedList.split(',');
}

function mergedCSP(): HelmetCSP {
  const csp: HelmetCSP = {
    connectSrc: [...defaultCSP.connectSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_CONNECT_SRC)],
    defaultSrc: [...defaultCSP.defaultSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_DEFAULT_SRC)],
    fontSrc: [...defaultCSP.fontSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_FONT_SRC)],
    frameSrc: [...defaultCSP.frameSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_FRAME_SRC)],
    imgSrc: [...defaultCSP.imgSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_IMG_SRC)],
    manifestSrc: [...defaultCSP.manifestSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_MANIFEST_SRC)],
    mediaSrc: [...defaultCSP.mediaSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_MEDIA_SRC)],
    objectSrc: [...defaultCSP.objectSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_OBJECT_SRC)],
    prefetchSrc: [...defaultCSP.prefetchSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_PREFETCH_SRC)],
    scriptSrc: [...defaultCSP.scriptSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_SCRIPT_SRC)],
    styleSrc: [...defaultCSP.styleSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_STYLE_SRC)],
    workerSrc: [...defaultCSP.workerSrc, ...parseCommaSeparatedList(process.env.CSP_EXTRA_WORKER_SRC)],
  };
  return Object.entries(csp)
    .filter(([key, value]) => !!value.length)
    .reduce((accumulator, [key, value]) => ({...accumulator, [key]: value}), {});
}

export interface ServerConfig {
  APP_BASE: string;
  APP_NAME: string;
  COMPANY_NAME: string;
  BACKEND_REST: string;
  CACHE_DURATION_SECONDS: number;
  COMMIT: string;
  CSP: HelmetCSP;
  ENVIRONMENT: string;
  FEATURE: {
    ENABLE_DEBUG: boolean;
    ENFORCE_HTTPS: boolean;
  };
  PIWIK_HOSTNAME: string;
  PIWIK_ID: string;
  PORT_HTTP: number;
  ROBOTS: {
    ALLOWED_HOSTS: string[];
    ALLOW: string;
    DISALLOW: string;
  };
  URL: {
    ACCOUNT_DELETE_SURVEY: string;
    DOWNLOAD_ANDROID_BASE: string;
    DOWNLOAD_IOS_BASE: string;
    DOWNLOAD_OSX_BASE: string;
    DOWNLOAD_WINDOWS_BASE: string;
    OPEN_GRAPH_IMAGE: string;
    REDIRECT_PHONE_BASE: string;
    REDIRECT_RESET_BASE: string;
    REDIRECT_START_SSO_BASE: string;
    REDIRECT_VERIFY_BASE: string;
    SUPPORT_BASE: string;
    TEAMS_BASE: string;
    WEBAPP_BASE: string;
    WEBSITE_BASE: string;
  };
  VERSION?: string;
}

const nodeEnvironment = process.env.NODE_ENV || 'production';

const config: ServerConfig = {
  APP_BASE: process.env.APP_BASE,
  APP_NAME: process.env.APP_NAME,
  BACKEND_REST: process.env.BACKEND_REST,
  CACHE_DURATION_SECONDS: 300,
  COMMIT: readFile(COMMIT_FILE, ''),
  COMPANY_NAME: process.env.COMPANY_NAME,
  CSP: mergedCSP(),
  ENVIRONMENT: nodeEnvironment,
  FEATURE: {
    ENABLE_DEBUG: process.env.FEATURE_ENABLE_DEBUG == 'true' ? true : false,
    ENFORCE_HTTPS: process.env.FEATURE_ENFORCE_HTTPS == 'false' ? false : true,
  },
  PIWIK_HOSTNAME: process.env.PIWIK_HOSTNAME,
  PIWIK_ID: process.env.PIWIK_ID,
  PORT_HTTP: Number(process.env.PORT) || 21080,
  ROBOTS: {
    ALLOW: readFile(ROBOTS_ALLOW_FILE, 'User-agent: *\r\nDisallow: /'),
    ALLOWED_HOSTS: ['account.wire.com'],
    DISALLOW: readFile(ROBOTS_DISALLOW_FILE, 'User-agent: *\r\nDisallow: /'),
  },
  URL: {
    ACCOUNT_DELETE_SURVEY: process.env.URL_ACCOUNT_DELETE_SURVEY,
    DOWNLOAD_ANDROID_BASE: process.env.URL_DOWNLOAD_ANDROID_BASE,
    DOWNLOAD_IOS_BASE: process.env.URL_DOWNLOAD_IOS_BASE,
    DOWNLOAD_OSX_BASE: process.env.URL_DOWNLOAD_OSX_BASE,
    DOWNLOAD_WINDOWS_BASE: process.env.URL_DOWNLOAD_WINDOWS_BASE,
    OPEN_GRAPH_IMAGE: process.env.URL_OPEN_GRAPH_IMAGE,
    REDIRECT_PHONE_BASE: process.env.URL_REDIRECT_PHONE_BASE,
    REDIRECT_RESET_BASE: process.env.URL_REDIRECT_RESET_BASE,
    REDIRECT_START_SSO_BASE: process.env.URL_REDIRECT_START_SSO_BASE,
    REDIRECT_VERIFY_BASE: process.env.URL_REDIRECT_VERIFY_BASE,
    SUPPORT_BASE: process.env.URL_SUPPORT_BASE,
    TEAMS_BASE: process.env.URL_TEAMS_BASE,
    WEBAPP_BASE: process.env.URL_WEBAPP_BASE,
    WEBSITE_BASE: process.env.URL_WEBSITE_BASE,
  },
  VERSION: readFile(VERSION_FILE, '0.0.0'),
};

export default config;
